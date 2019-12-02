/**
 * 微信版本交互模型
 */

class InterAction {
    // static fnAlert(title, content, buttonText) {
    //     wx.alert({
    //         title: title,
    //         content: content,
    //         buttonText: buttonText,
    //         success: () => {
    //
    //         },
    //     });
    // }


    /**
     * 显示消息提示框
     * https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html
     * @param title 提示的内容
     * @param icon 图标，success，loading，none
     * @param image 自定义图标的本地路径，image 的优先级高于 icon
     * @param duration 提示的延迟时间
     * @param mask 是否显示透明蒙层，防止触摸穿透
     */
    static fnShowToast(title = '', icon = 'none', duration = 2000, image = '', mask = false) {
        wx.showToast({
            title: title,// 必填，提示的内容
            icon: icon,// 非必填，图标，success，loading，none
            image: image,// 非必填，自定义图标的本地路径，image 的优先级高于 icon
            duration: duration,// 非必填，提示的延迟时间
            mask: mask,// 非必填，是否显示透明蒙层，防止触摸穿透
            success: (res) => {
                console.log('调用消息提示框成功');
            },
            fail: () => {
                console.log('调用消息提示框失败');
            }
        });
    }
}

export {
    InterAction
}