// pages/statisticalReport/statisticalReport/index.js
import {Statistic} from "../../../model/statistical/statistic";
import {Storage} from "../../../utils/storage";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        conferenceStatistic: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        wx.showLoading({content: '加载中...'});
        await this.initData();
        wx.hideLoading();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        await this.initData();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    async onPullDownRefresh() {
        await this.initData();
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    async initData() {
        const departmentId = Storage.getStorageSyncByKey('department');
        const conferenceStatistic = await Statistic.conferenceStatistic('1219441916791739', 1);
        console.log(conferenceStatistic);
        this.setData({
            conferenceStatistic: conferenceStatistic
        });
    }
})