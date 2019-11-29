//index.js
//获取应用实例
import {
    Conference
} from "../../model/conference/conference";
import {
    Storage
} from "../../utils/storage";
import {FreeLogin} from "../../model/authentication/freeLogin";
import {Location} from "../../model/location/location";

const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),

        corpId: '',
        authCode: '',
        administrator: '',
        userId: '',
        userName: '',
        isAdmin: false, // 默认不是管理员
        isLeaderInDepts: false, // 默认不是部门主管
        hideList: true,

        hasMeeting: true, // 默认有会议的

        nowConferenceList: null, // 当前会议
        futureConferenceList: null, // 预备会议
        pastConferenceList: null, // 历史会议

        isShowNowConferenceList: false, // 默认不显示当前会议列表
        isShowFutureConferenceList: false, // 默认不显示预备会议列表
        isShowPastConferenceList: false, // 默认不显示历史会议列表

        isNeedCheckIn: true, // 默认需要签到
    },

    async onLoad() {
        console.log('666');
        await FreeLogin.login();
    },

    async onShow() {
        await this.initData(); // 重新初始化会议列表
        await Location.getLocation();
    },


    /**
     * 初始化页面数据
     */
    async initData() {

        // const authCode = await System.loginSystem();// 获取钉钉免登授权码
        // const currentUser = await FreeLogin.freeLogin(authCode.authCode, app.globalData.corpId);// 用户登录并进入缓存
        console.log('currentUser');

        this.setData({
            // isAdmin: currentUser.currentUser.isAdmin,
            isLeaderInDepts: Storage.getStorageSyncByKey('isLeaderInDepts')
        });

        this.initConferenceData(); // 获取会议列表
    },

    /** 初始化会议数据 */
    async initConferenceData() {
        let that = this;
        // TODO 缓存 -> 用户 -> 会议列表
        const currentUserid = Storage.getStorageSyncByKey('user');

        const conferenceListByUserId = await Conference.getConferenceList(currentUserid); // 获取当前用户会议列表，因为涉及到用户签到情况

        const nowConferenceList = conferenceListByUserId.now; // 当前会议
        const futureConferenceList = conferenceListByUserId.future; // 预备会议
        const pastConferenceList = conferenceListByUserId.past; // 当前用户历史会议
        // console.log(JSON.stringify(futureConferenceList));

        // 控制列表显示，没有会议，展示"暂无会议"


        // 有会议
        if (nowConferenceList.length == 0) { // 没有当前会议，不显示
            that.setData({
                isShowNowConferenceList: false
            })
        } else {
            that.setData({
                isShowNowConferenceList: true
            })
        }
        if (futureConferenceList.length == 0) { // 没有预备会议，不显示
            that.setData({
                isShowFutureConferenceList: false
            })
        } else {
            that.setData({
                isShowFutureConferenceList: true
            })
        }
        if (pastConferenceList.length == 0) { // 没有历史会议，不显示
            that.setData({
                isShowPastConferenceList: false
            })
        } else {
            that.setData({
                isShowPastConferenceList: true
            })
        }

        if (nowConferenceList.length == 0 &&
            futureConferenceList.length == 0 &&
            pastConferenceList.length == 0) {
            that.setData({
                hasMeeting: false
            });
            // InterAction.fnShowToast('exception', '无会议记录', 2000);
        } else {
            that.setData({
                hasMeeting: true
            });
        }

        // 将当前用户
        this.setData({
            nowConferenceList: nowConferenceList, // 当前会议
            futureConferenceList: futureConferenceList, // 预备会议
            pastConferenceList: pastConferenceList, // 当前用户历史会议
        });


    },

    async onPullDownRefresh() {
        await this.initData();
        wx.stopPullDownRefresh();
    },


    /**
     * 主管新增会议
     */
    addConference() {
        wx.navigateTo({
            url: '/pages/conference/add/index',
        })
    },
})