// pages/organization/singleMember/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        singleMember: null,
        gender: '男',
        headImg: [
            '/resources/icon/organiztion/male.png',
            '/resources/icon/organiztion/female.png',
        ]
    },
    onLoad(param) {
        let singleMember = JSON.parse(param.single);
        console.log('singleMember')
        console.log(singleMember)
        this.setData({
            singleMember: singleMember,
            gender: singleMember.gender
        });
    },

    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },
});