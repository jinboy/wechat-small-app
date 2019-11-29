// components/conference/card/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        conferenceList: Array,
        infoOmitted: Boolean,
        hideInfo: Boolean,
        hideStatus: Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {
        infoOmitted: Boolean
    },

    observers: {
        'infoOmitted': function (infoOmitted) {
            if (infoOmitted) {// 省略
                this.data.infoOmitted = true;
            } else {
                this.data.infoOmitted = false;
            }
            console.log(infoOmitted);
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 跳转到会议详情
         * @param e
         */
        toConferenceDetail(e) {
            console.log('e');
            console.log(e);
            let conference = e.currentTarget.dataset.conference;
            let mid = conference.id;
            wx.navigateTo({
                url: '/pages/conference/detail/index?mid=' + mid,
            });
        },
    }
})

//
//     [{
//   "id": 95,
//   "orgId": 1,
//   "uid": "15189856020",
//   "theme": "主题党日活动",
//   "time": "2019年11月29日 (星期五) 09点30分",
//   "roomId": {
//     "id": 1,
//     "name": "党办会议室",
//     "location": "119.40954372829862,32.38017578125"
//   },
//   "address": "党办会议室",
//   "topic": [{
//     "id": 1,
//     "name": "理论学习教育及党性教育实践活动"
//   }],
//   "info": "一、充分认识学习宣传贯彻党的十九大精神的重大意义\r\n党的十九大是全体建成小康社会决胜阶段，中国特色社会主义新时代的关键时期召开的一次十分重要的大会，是一次不忘初心，牢记使命，高举旗帜团结奋进的大会，是党和国家发展史上的重大里程碑。\r\n二、准确把握精神实质，以十九大精神为动力，全面推进公司各项工作。\r\n三、加强组织领导掀起学习宣传贯彻党的十九大精神的热潮。\r\n1、要坚持领导带头，党员干部要带头学习，带头宣讲，带头贯彻落实做到先学一步，学透学深。\r\n2、要组织好宣传引导，大力学习贯彻十九大精神的新典型。\r\n3、要加强组织领导，结合实际，精心部署。",
//   "imgs": [{
//     "id": 1219,
//     "path": "http://47.105.100.97/dolphin/public/uploads/images/20191126/af3bfd0d418b7e1fac4d3e3033c8f9de.png"
//   }],
//   "summary": null,
//   "conferee": [],
//   "open": 1,
//   "status": 1,
//   "update_time": "2019-11-26 10:41:12",
//   "create_time": "2019-11-26 10:37:52",
//   "timeFormat": "2019-11-29 09:30"
// }]