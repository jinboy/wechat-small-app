/**
 * 统计业务模型
 */


import {Http} from "../../utils/http";

class Statistic {
    /**
     * 获取会议统计数据
     * @param uid 用户
     * @returns {Promise<*>}
     */
    static async conferenceStatistic(uid, orgId) {
        const statistic = await Http.request({
            url: `5daa7c699f203`,
            data: {
                uid: uid,
                orgId: orgId
            }
        });
        return statistic.data;
    }
}

export {
    Statistic
}