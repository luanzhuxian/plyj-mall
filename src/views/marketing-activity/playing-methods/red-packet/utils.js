import moment from 'moment'

// 计算福利红包倒计时间隔
export const getDuration = (status, receiveStartTime, receiveEndTime) => {
    // 0 未开始 1 进行中 2 暂停 3 结束
    const now = Date.now().valueOf()
    if (status === 0) {
        return moment(receiveStartTime).valueOf() - now
    } else if (status === 1) {
        return moment(receiveEndTime).valueOf() - now
    }
    return 0
}

// 获取福利红包弹幕模板
export const getBulletTemplate = (bullet, vm) => {
    const { userImage, userName, mobile, time, message } = bullet
    const text = `${ userName.slice(0, 1) }** ${ String(mobile).slice(0, 3) }****${ String(mobile).slice(-4) } ${ time }领取${ message }的福利红包`
    const template = `
        <div class="my-bullet">
            <div class="my-bullet__avatar">
                <img src="${ userImage }" alt="${ userName }">
            </div>
            <div class="my-bullet__message">
                ${ text }
            </div>
        </div>
    `
    return template
}

// 单位转换：分转元
export const fenToYuan = function (num) {
    const regexp = /(?:\.0*|(\.\d+?)0+)$/
    num = (num / 100).toFixed(2)
    num = num.replace(regexp, '$1')
    return Number(num)
}

// 是否是今天
export const isToday = date => {
    const today = new Date().setHours(0, 0, 0, 0)
    const tomorrow = today + (24 * 60 * 60 * 1000)
    const current = moment(date).valueOf()
    return current >= today && current <= tomorrow
}
