// pages/conference/detail/index.js
import {Conference} from "../../../model/conference/conference";
import {Storage} from "../../../utils/storage";
import {InterAction} from "../../../model/interaction/interaction";

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentUserId: null,// 当前用户id
        isAdmin: false,// 默认是非管理员
        isLeaderInDepts: false,// 默认非部门主管
        conference: {},
        currentConference: null,// 当前会议
        currentConferenceMid: null,


        confereeInfo: [],// 会议人员参会信息

        chooseParticipantNumber: 0,// 参加人员数
        chooseParticipant: [],// 参加人员
        conferee: null,// 参加人员数组

        readInfo: [],   // 通知阅读人员情况数组
        noticeReadNumber: 0,// 通知阅读数
        noticeRead: [],// 已阅读人员
        noticeNotRead: [],// 未阅读人员

        participatedStatus: ['已参加', '未参加', '请假', '迟到'],
        swiperParticipantCurrent: 0,
        noticeReadStatus: ['已阅读', '未阅读'],
        swiperNoticeReadCurrent: 0,

        filePaths: null,
        imgArr: [],
        chooseViewShow: true,
        imgObjArr: [],

        isAllowCheckIn: false,// 默认不允许签到

        layout: [
            {
                index: 0,
                title: 'summary'
            }
        ],

        // 主管按钮
        adminOperation: [
            {
                index: 0,
                operation: 'locationCheckCurrentConference',
                name: "签到",
                status: true,
                img: '/resources/conferenceDetial/checkIn.png'
            },
            {
                index: 1,
                operation: 'toPhoto',
                name: "照片",
                status: true,
                img: '/resources/conferenceDetial/photo.png'
            },
            {
                index: 2,
                operation: 'summary',
                name: "纪要",
                status: true,
                img: '/resources/conferenceDetial/summary.png'
            },
        ],

        // 普通按钮
        commonOperation: [
            {
                index: 0,
                operation: 'takeOff',
                name: "请假",
                status: true,
                img: '/resources/icon/tabBar/icon1_1.png'
            },
            {
                index: 1,
                operation: 'locationCheckCurrentConference',
                name: "签到",
                status: true,
                img: '/resources/icon/tabBar/icon2_1.png'
            },
            {
                index: 2,
                operation: 'note',
                name: "笔记",
                status: true,
                img: '/resources/icon/tabBar/icon3_1.png'
            },
        ],

        // 按钮相关
        OperationStatus: {
            takeOffStatus: true, // 党员请假按钮
            checkInStatus: true, // 签到按钮
            noteStatus: true, // 党员笔记按钮
            photoStatus: true, // 照片按钮
            summary: true,// 纪要按钮
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(param) {
        let mid = param.mid;
        this.setData({
            currentConferenceMid: mid
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let mid = this.data.currentConferenceMid;
        this.initData(mid);
        this.setData({
            currentConferenceMid: mid
        });
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let mid = this.data.currentConferenceMid;
        this.initData(mid);
        this.setData({
            currentConferenceMid: mid
        });
        wx.stopPullDownRefresh();
    },

    /**
     * 初始化页面信息
     * @returns {Promise<void>}
     */
    async initData(mid) {
        // const userId = await this.checkUserInfo();
        // console.log('userId:' + userId);
        const userId = Storage.getStorageSyncByKey('user');
        const currentConference = await Conference.getConferenceDetail(mid, userId);
        let imgArr = [];
        for (let i = 0; i < currentConference.imgs.length; i++) {
            imgArr.push(currentConference.imgs[i].path);
        }
        this.setData({
            conference: currentConference,
            imgArr: imgArr,
            imgObjArr: currentConference.imgs
        });

        this.checkCurrentIsInParticipator(currentConference, userId);// 判断当前用户是否在参加人员中
        this.initOperationStatus(currentConference.sign_type);// 初始化按钮状态
        this.packageConfereeInfo(currentConference);// 包装参会人员信息
        this.packageReadInfo(currentConference);// 包装阅读人员信息
    },

    /**
     * 初始化用户信息
     */
    async initUser() {
        const authCode = await System.loginSystem();// 获取钉钉免登授权码
        const currentUser = await FreeLogin.freeLogin(authCode.authCode, app.globalData.corpId);// 用户登录并进入缓存
        this.setData({
            isAdmin: currentUser.currentUser.isAdmin,
            isLeaderInDepts: Storage.getStorageSyncByKey('isLeaderInDepts')
        });
        return currentUser;
    },

    /**
     * 校验管理员或者用户
     * 如果没有当前用户是否是管理员
     * 或没有当前用户信息
     */
    async checkUserInfo() {
        let that = this;
        const isAdmin = Storage.getStorageSyncByKey('isAdmin');// 管理员标志从缓存中获取
        const isLeaderInDepts = Storage.getStorageSyncByKey('isLeaderInDepts');// 主管标志从缓存中获取
        const userid = Storage.getStorageSyncByKey('user');// 从缓存中获取到当前用户
        let userId = null;
        if (app.isNull(isLeaderInDepts) || app.isNull(userid)) {
            // 如果缓存中没有是否是管理员或当前用户信息,则从网络获取当前用户，并将当前用户信息缓存
            const currentUserInfo = await that.initUser();
            console.log('currentUserInfo')
            console.log(currentUserInfo)
            console.log('currentUserInfo')
            userId = currentUserInfo.currentUser.userid;
        } else {
            this.setData({
                isAdmin: isAdmin,
                currentUserId: userid,
                isLeaderInDepts: isLeaderInDepts
            })
            userId = userid;
        }
        return userId;
    },

    /**
     * 判断当前用户是否在参加人员中
     * @param currentConference 当前会议
     */
    checkCurrentIsInParticipator(currentConference, userId) {
        // 判断当前用户是否在参加人员中
        let conferee = [];
        for (let i = 0; i < currentConference.conferee.length; i++) {
            conferee.push(currentConference.conferee[i].userid)
        }
        this.setData({
            conferee: conferee
        });
        if (app.inArray(conferee, userId)) {
            this.setData({
                isAllowCheckIn: false
            })
        } else {
            this.setData({
                isAllowCheckIn: true
            });
        }
    },

    /**
     * 分享
     * @returns {{path: string, title: string, desc: string}}
     */
    onShareAppMessage() {
        return {
            title: '支部会议详情',
            desc: '展示支部会议详情',
            path: 'page/meetingAgenda/conferenceDetail/conferenceDetail?conference=' + JSON.stringify(this.data.currentConference),
        };
    },

    /**
     * 初始化底部按钮状态 ok
     * @param signType 签到状态
     */
    initOperationStatus(signType) {
        let that = this;
        switch (signType) {
            case 0:// 未签到，不禁用签到按钮
                that.setData({
                    'adminOperation[0].status': true,
                    'commonOperation[1].status': true,
                });
                break;
            case 1:// 已签到，禁用签到按钮
                that.setData({
                    'adminOperation[0].status': false,
                    'commonOperation[0].status': false,// 禁用党员请假按钮
                    'commonOperation[1].status': false,// 禁用签到按钮
                    'adminOperation[0].name': '已签到',
                    'commonOperation[1].name': '已签到',
                });
                break;
            case 2:// 签到迟到
                that.setData({
                    'adminOperation[0].status': false,// 禁用管理员签到按钮
                    'commonOperation[0].status': false,// 禁用党员请假按钮
                    'commonOperation[1].status': false,// 禁用党员签到按钮
                    'adminOperation[0].name': '已迟到',
                    'commonOperation[1].name': '已迟到',
                });
                break;
            case 3:// 请假
                that.setData({
                    'commonOperation[0].status': false,// 禁用党员请假按钮
                    'commonOperation[0].name': '已请假',
                    'commonOperation[1].status': false,// 禁用党员签到按钮
                });
                break;
        }
    },

    /**
     * 包装会议参会信息 ok
     */
    packageConfereeInfo(currentConference) {
        const conferee = currentConference.conferee;
        let confereeArray = []; // 参会信息数组
        let attended = [];      // 已参加人员
        let notAttended = [];   // 未参加人员
        let leaveStaff = [];    // 请假人员
        let latePerson = [];    // 迟到人员

        for (let i = 0; i < conferee.length; i++) {
            // 筛选参加人员
            switch (conferee[i].sign_type) {
                case 0:// 未签到
                    notAttended.push(conferee[i]);
                    break;
                case 1:// 已签到
                    attended.push(conferee[i]);
                    break;
                case 2:// 迟到
                    attended.push(conferee[i]);
                    latePerson.push(conferee[i]);
                    break;
                case 3:// 请假
                    leaveStaff.push(conferee[i]);
                    break;
            }
        }
        confereeArray.push(attended);
        confereeArray.push(notAttended);
        confereeArray.push(leaveStaff);
        confereeArray.push(latePerson);
        this.setData({
            confereeInfo: confereeArray
        });
        console.log('confereeArray');
        console.log(confereeArray);
    },

    /**
     * 包装阅读情况 ok
     */
    packageReadInfo(currentConference) {
        const read = currentConference.msg;
        let readArr = [];       // 通知阅读情况数组
        readArr.push(currentConference.msg.read);// readArr[0]
        readArr.push(currentConference.msg.unread);// readArr[1]
        this.setData({
            readInfo: readArr
        });
        console.log('readInfo');
        console.log(readArr);
    },

    /**
     * 切换会议人员swiper
     * @param e
     */
    switchParticipantSwiper(e) {
        let swiperChangeCurrent = parseInt(e.currentTarget.dataset.index),
            num = parseInt(e.currentTarget.dataset.index)
        this.curIndex = parseInt(e.currentTarget.dataset.index)
        console.log('切换swiper');
        console.log(swiperChangeCurrent);
        console.log('切换swiper');
        this.setData({
            swiperParticipantCurrent: swiperChangeCurrent
        })
    },

    /**
     * 会议人员轮播切换
     * @param e
     */
    swiperParticipantChange(e) {
        // console.log('触发会议人员轮播');
        // console.log(e);
        this.setData({
            swiperParticipantCurrent: e.detail.current
        })
        // console.log(this.data.swiperParticipantCurrent)
    },

    /**
     * 切换会议人员swiper
     * @param e
     */
    switchNoticeReadSwiper(e) {
        let id = e.currentTarget.dataset.id,
            swiperChangeCurrent = parseInt(e.currentTarget.dataset.index),
            num = parseInt(e.currentTarget.dataset.index)
        this.curIndex = parseInt(e.currentTarget.dataset.index)
        console.log('切换swiper');
        console.log(swiperChangeCurrent);
        console.log('切换swiper');
        this.setData({
            swiperNoticeReadCurrent: swiperChangeCurrent
        })
    },

    /**
     * 阅读情况轮播切换
     * @param e
     */
    swiperNoticeReadChange(e) {
        // console.log('触发阅读情况轮播轮播');
        // console.log(e);
        this.setData({
            swiperNoticeReadCurrent: e.detail.current
        })
        console.log(this.data.swiperNoticeReadCurrent)
    },


    /** 选择图片 */
    chooseImage() {
        let that = this;
        wx.chooseImage({
            count: 16 - that.data.imgArr.length,//最多选择4张图片
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: async function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                // console.log('返回选定照片的本地文件路径列表');
                // console.log(res);
                // console.log(res.apFilePaths);
                if (res.apFilePaths.count == 0) {
                    return;
                }
                //上传图片
                console.log('上传图片路径：' + res.filePaths[0]);
                that.setData({
                    cacheImg: res.filePaths[0]
                })
                // console.log('上传图片名：');
                // console.log('图片上传');
                // console.log(uploadImg);

                dd.uploadFile({
                    url: `${config.apiUpload2}`,
                    fileType: 'image',
                    fileName: 'img',
                    filePath: res.filePaths[0],
                    // filePath: '/Users/Tabbits/Desktop/jinboy/xiaojin.jpg',
                    header: {
                        // 'Content-Type': 'application/json',
                        'version': 'v3.0',
                        'access-token': ''
                    },
                    success: (res) => {
                        dd.hideLoading();
                        console.log('图片上传成功');
                        console.log(res.data);
                        that.setData({
                            imageResData: JSON.stringify(res.data)
                        })
                    },
                    fail: (err) => {
                        dd.hideLoading();
                        console.log('图片上传失败');
                        console.log(err);
                    }
                });

                //显示图片
                let imgArrNow = that.data.imgArr;
                imgArrNow = imgArrNow.concat(res.apFilePaths);
                console.log(imgArrNow);
                that.setData({
                    imgArr: imgArrNow
                })
                that.chooseViewShow();
            }
        })
    },

    /** 删除图片 */
    deleteImv(e) {
        let imgArr = this.data.imgArr;
        let itemIndex = e.currentTarget.dataset.id;
        imgArr.splice(itemIndex, 1);
        console.log(imgArr);
        this.setData({
            imgArr: imgArr
        })
        //判断是否隐藏选择图片
        this.chooseViewShow();
    },


    /** 是否隐藏图片选择 */
    chooseViewShow() {
        if (this.data.imgArr.length >= 4) {
            this.setData({
                chooseViewShow: false
            })
        } else {
            this.setData({
                chooseViewShow: true
            })
        }
    },

    /** 显示图片 */
    showImage(e) {
        let imgArr = this.data.imgArr;
        let itemIndex = e.currentTarget.dataset.id;

        wx.previewImage({
            current: itemIndex, // 当前显示图片的http链接
            urls: imgArr // 需要预览的图片http链接列表
        })
    },

    async formSubmit(e) {
        let conference = JSON.parse(this.data.conference);
        let mid = conference.id;
        let uid = '11111111111';
        let text = e.detail.value.text;
        let img = 'https://www.baidu.com/img/bd_logo1.png?qua=high&where=super';
        let res = await Notes.submitNotes(mid, uid, text, img);
    },

    /**
     * 签到当前会议
     * @param e
     * @returns {Promise<void>}
     */
    async locationCheckCurrentConference() {
        let that = this;
        let currentConference = that.data.conference;
        // console.log(currentConference)

        if (app.isNull(currentConference)) {// currentConference，提示为获取到当前会议
            InterAction.fnAlert('抱歉', '未获取到当前会议，请重启应用', '好的');
        } else { //有当前会议信息，绑定当前用户与其参加会议的签到行为
            // 首先判断当前用户是否在参加人员中

            // 会议地点经纬度
            let currentLocation = currentConference.roomId.location.split(',');
            let latitude = parseFloat(currentLocation[0]);// 纬度
            let longitude = parseFloat(currentLocation[1]);// 经度（大）

            const res = await GetLocation.getLocation();
            let currentLatitude = parseFloat(res.longitude);
            let currentLongitude = parseFloat(res.latitude);
            const distance = CheckIn.getFlatternDistance(latitude, longitude, currentLatitude, currentLongitude);
            // console.log('distance')
            // console.log(distance)
            // console.log('distance')
            // 包装签到对象
            let checkInInfo = {};
            checkInInfo.mid = currentConference.id;
            checkInInfo.uid = Storage.getStorageSyncByKey('user');
            checkInInfo.address = res.address;
            checkInInfo.distance = distance;
            checkInInfo.leaveType = "";
            checkInInfo.leaveReason = "";
            if (app.isNull(checkInInfo.mid)) {
                InterAction.fnShowToast('fail', '未获取到签到会议', 2000);
            } else if (app.isNull(checkInInfo.uid)) {
                InterAction.fnShowToast('fail', '未获取到用户信息', 2000);
            } else if (app.isNull(checkInInfo.address)) {
                InterAction.fnShowToast('fail', '未获取到地址信息', 2000);
            } else if (app.isNull(checkInInfo.distance)) {
                InterAction.fnShowToast('fail', '位置异常', 2000);
            } else {
                const checkInInfoRes = await CheckIn.submitCheckInInfo(checkInInfo);
                // console.log('签到信息返回');
                // console.log(checkInInfoRes);
                // console.log(checkInInfoRes.code);
                // console.log('签到信息返回');
                // console.log(checkInInfoRes.data.sign_type);
                if (checkInInfoRes.code === 1) {
                    // that.initOperationStatus(currentConference.sign_type);// 初始化按钮状态
                    switch (checkInInfoRes.data.sign_type) {
                        case 0:// 未签到，不禁用签到按钮
                            that.setData({
                                'adminOperation[0].status': true,
                                'commonOperation[1].status': true,
                            });
                            break;
                        case 1:// 签到成功，禁用签到按钮
                            InterAction.fnShowToast('success', '成功签到', 2000);
                            that.setData({
                                'adminOperation[0].status': false,
                                'commonOperation[0].status': false,// 禁用党员请假按钮
                                'commonOperation[1].status': false,// 禁用签到按钮
                                'adminOperation[0].name': '已签到',
                                'commonOperation[1].name': '已签到',
                            });
                            break;
                        case 2:// 签到迟到
                            InterAction.fnShowToast('您已迟到', 'success', 2000, '', false);
                            that.setData({
                                'adminOperation[0].status': false,// 禁用管理员签到按钮
                                'commonOperation[0].status': false,// 禁用党员请假按钮
                                'commonOperation[1].status': false,// 禁用党员签到按钮
                                'adminOperation[0].name': '已迟到',
                                'commonOperation[1].name': '已迟到',
                            });
                            break;
                        case 3:// 请假
                            InterAction.fnShowToast('您已请假', 'success', 2000, '', false);
                            that.setData({
                                'commonOperation[0].status': false,// 禁用党员请假按钮
                                'commonOperation[0].name': '已请假',
                                'commonOperation[1].status': false,// 禁用党员签到按钮
                            });
                            break;
                    }
                } else {
                    InterAction.fnShowToast(checkInInfoRes.msg, 'success', 2000, '', false);
                }
            }
        }
    },

    /**
     * 请假
     */
    takeOff() {
        let that = this;
        const conference = that.data.conference;
        wx.navigateTo({
            url: '/pages/conference/takeoff/index?conference=' + JSON.stringify(conference),
        });
    },

    /**
     *
     */
    toPhoto() {
        let imgArr = this.data.imgObjArr;
        let mid = this.data.currentConferenceMid;
        wx.navigateTo({
            url: '/pages/conference/photo/index?imgArr=' + JSON.stringify(imgArr) + '&mid=' + mid
        });
    },

    /**
     * 纪要
     */
    summary() {
        let that = this;
        console.log(that.data.conference);
        const mid = that.data.conference.id;
        wx.navigateTo({
            url: '/pages/conference/summary/index?mid=' + mid,
        });
    },

    /**
     * 笔记
     */
    note() {
        let that = this;
        console.log(that.data.conference);
        const conference = that.data.conference;
        wx.navigateTo({
            url: '/pages/conference/note/index?conference=' + JSON.stringify(conference),
        });
    },

    /**
     * 发送钉
     */
    notice() {
        // console.log(this.data.conference)
        // let userIdArr = Conference.extractUserId(this.data.conference.conferee);// 全部参会人员id
        // console.log(userIdArr);
        let useridArr = [];
        this.data.readInfo[1].forEach(user => {
            useridArr.push(user.userid);
        });
        console.log('useridArr');
        console.log(useridArr);
        console.log('useridArr');
        Ding.createNoticeDing({
            users: useridArr,
            corpId: app.globalData.corpId,
            text: this.data.conference.theme,
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
})