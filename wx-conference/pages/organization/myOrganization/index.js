// pages/organization/myOrganization/index.js
import {PartyMember} from "../../../model/organization/partyMember";

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        organizationPartyMember: [],

        defaultAvatar: [
            '/resources/icon/common/male.png',
            '/resources/icon/common/female.png',
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        wx.showLoading({content: '加载中...'})
        await this.initData();
        wx.hideLoading();
    },

    onShow() {
        this.initData();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 初始化页面基本信息
     * @returns {Promise<void>}
     */
    async initData() {
        const partyMemberInfo = await this.initPartyMenberInfo();
        this.setData({
            organizationPartyMember: partyMemberInfo
        })
    },
    /**
     * 初始化党员基本信息
     */
    async initPartyMenberInfo() {
        const partyMemberInfoRes = await PartyMember.getPartyMemberInfo(1);
        console.log(partyMemberInfoRes);
        let partyMemberInfo = partyMemberInfoRes.data;
        // for (let i = 0; i < partyMemberInfo.length; i++) {
        //     if (app.isNull(partyMemberInfo[i].headImg)) {
        //         switch (partyMemberInfo[i].gender) {
        //             case '男':
        //                 partyMemberInfo[i].headImg = this.data.defaultAvatar[0];
        //                 break;
        //             case '女':
        //                 partyMemberInfo[i].headImg = this.data.defaultAvatar[1];
        //                 break;
        //         }
        //     }
        // }
        return partyMemberInfo;
    },

    toSingleMember(e) {
        console.log(e)
        let singleMember = e.currentTarget.dataset.singlemember;
        console.log(singleMember)
        wx.navigateTo({
            url: '/pages/organization/singleMember/index?single=' + JSON.stringify(singleMember),
        });
    }
})