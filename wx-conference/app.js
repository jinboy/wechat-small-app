//app.js
import {Storage} from "./utils/storage";

App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        });

    },
    onShow() {
        Storage.setStorageSyncByKeyAndValue('administrator', '1219441916791739');
        Storage.setStorageSyncByKeyAndValue('isLeaderInDepts', true);
        Storage.setStorageSyncByKeyAndValue('user', true);
    },

    globalData: {
        userInfo: null
    },

    /**
     * 判空
     * @param param
     * @returns {boolean}
     */
    isNull(_param) {
        if (_param == '') {
            return true;
        } else if (_param == null) {
            return true;
        } else if (_param == undefined) {
            return true;
        }
        return false;
    },

    /**
     * 数组判空
     * @param _array 待判断的临时数组
     * @returns {boolean}
     */
    isArrayNull(_array) {
        if (JSON.stringify(_array) === '[]') {
            return true;
        }
        return false;
    },

    /**
     * 判断item是否在数组中
     * @param arr 数组
     * @param item 待检测元素
     * @returns {boolean}
     */
    inArray(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == item) {
                return true;
            }
        }
        return false;
    }
})