/**
 * 微信版本 位置工具模型
 */

import {promisic} from "./util";

class LocationUtils {
    /**
     * 打开地图选择位置。
     * @returns {Promise<{address: (Document.address|*|string), latitude: (*|string|number), name: *, longitude: (*|string|number)}|null>}
     */
    static async chooseLocation() {
        const res = await promisic(wx.chooseLocation)({});
        if (res.errMsg === "chooseLocation:fail cancel") {
            return null;
        } else {
            return {
                name: res.name,
                address: res.address,
                latitude: res.latitude,
                longitude: res.longitude
            }
        }
    }

    /**
     * 获取当前的地理位置、速度
     * @returns {Promise<void>}
     */
    static async getLocation() {
        const res = await promisic(wx.getLocation)({
            type: 'wgs84',// or gcj02
            altitude: true,
            isHighAccuracy: true,
            highAccuracyExpireTime: 3000
        });
        console.log('res');
        console.log(res);
    }
}

export {
    LocationUtils
}