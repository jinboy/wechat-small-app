import {MeetingRoom} from "../../../model/location/meetingRoom";
import {InterAction} from "../../../model/interaction/interaction";
import {Location} from "../../../utils/location";


const app = getApp();

Page({
    data: {
        room: [
            {
                rid: 1,
                rName: '东边会议室',
            }
        ],
        chooseLocation: false,// 是否定位成功
        location: '',
    },

    onLoad(e) {

    },


    onPullDownRefresh() {
        console.log('重新加载')
    },

    /**
     * 点击地点选择位置
     * @returns {Promise<void>}
     */
    async chooseLocation() {
        const location = await Location.chooseLocation();
        console.log(location);
        if (location) {
            this.setData({
                chooseLocation: true,
                'conference.address': location.address,// 地址
                'conference.longitude': location.longitude,// 经度(钉钉接口模拟器这边有问题)
                'conference.latitude': location.latitude,// 纬度
                location: `${location.longitude},${location.latitude}`,
            });
        } else {
            this.setData({
                chooseLocation: false,
            });
        }
    },

    meetingRoom(e) {
        console.log(e);
        let that = this;
        let meetingRoom = e.target.dataset.meetingRoom;
        console.log(meetingRoom);
        that.setData({
            'conference.address': meetingRoom
        });

    },

    /**
     * 提交表单
     * @param e
     * @returns {Promise<void>}
     */
    async submit(e) {
        console.log(e);
        let name = e.detail.value.name;
        let location = e.detail.value.location;
        console.log(name);
        console.log(location);
        if (app.isNull(name)) {
            InterAction.fnShowToast('请输入会议室名称', 'none', 2000);
        } else if (app.isNull(location)) {
            InterAction.fnShowToast('请到指定地点定位会议室', 'none', 2000);
        } else {
            const res = await MeetingRoom.addOrUpdateMeetingRoom(name, location);
            console.log(res);
            if (res.code === 1) {
                InterAction.fnShowToast('编辑会议室成功，请重新点击地点刷新会议室', 'success', 2000);
                wx.navigateBack({
                    delta: 1
                })
            } else {
                InterAction.fnShowToast('编辑会议室失败', 'none', 2000);
            }
        }

    }
});
