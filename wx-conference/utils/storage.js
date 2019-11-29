/**
 * 微信版本 缓存模型
 */


import {promisic} from "./util";

class Storage {
    static async setStorage(
        {
            key,
            data
        }
    ) {
        const res = await promisic(wx.setStorage)({
            key,
            data,
        });
        return res;
    }

    /**
     *
     * @param key
     * @returns {Promise<*>}
     */
    static async getStorage({key}) {
        const res = await promisic(wx.getStorage)({
            key,
        });
        return res.data;
    }

    static setStorageSyncByKeyAndValue(key, data) {
        wx.setStorageSync({
            key: key,
            data: data
        });
    }

    static getStorageSyncByKey(key) {
        const value = wx.getStorageSync(key);
        return value;
    }
}

export {
    Storage
}