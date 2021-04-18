import moment from 'moment'

export const getPrice = (list = []) => key => {
    const arr = list.map(item => item[key])
    return key === 'originalPrice' ? Math.max(...arr) : Math.min(...arr)
}

export const getDate = (val, format) => {
    if (!val) return
    return moment(val).format(format)
}

export const getTime = ({ activityStartTime, activityEndTime, startTime, endTime, status }) => {
    // 0: 未开始 1: 进行中
    const startTs = moment(activityStartTime || startTime).valueOf()
    const endTs = moment(activityEndTime || endTime).valueOf()
    let ts
    if (status === 0) {
        ts = startTs
    } else if (status === 1) {
        ts = endTs
    }
    return ts
}

export const getDuration = (activity = {}) => {
    const duration = Date.now().valueOf() - getTime(activity)
    return Math.abs(duration)
}

export const reset = item => {
    if (item.goodsInfo.activityInfo.status === 0) {
        item.goodsInfo.activityInfo.status = 1
    } else if (item.goodsInfo.activityInfo.status === 1) {
        item.goodsInfo.activityInfo.status = 3
    }
    // this.$emit('done')
}

export const plus = (arg1, arg2) => {
    let r1
    let r2
    try {
        r1 = arg1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    const m = Math.pow(10, Math.max(r1, r2))
    const n = (r1 >= r2) ? r1 : r2
    return ((arg1 * m + arg2 * m) / m).toFixed(n)
}

export const sub = (arg1, arg2) => {
    let r1
    let r2
    try {
        r1 = arg1.toString().split('.')[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split('.')[1].length
    } catch (e) {
        r2 = 0
    }
    const m = Math.pow(10, Math.max(r1, r2))
    const n = (r1 >= r2) ? r1 : r2
    return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

export const getTotalPrice = item => {
    if (!item.goodsInfo) return ''

    if (item.goodsInfo.activityInfo.activityPrice >= item.goodsInfo.activityInfo.skuPrice) {
        return item.goodsInfo.activityInfo.price
    }
    return sub(Number(item.goodsInfo.activityInfo.skuPrice), Number(sub(Number(item.goodsInfo.activityInfo.activityPrice), Number(item.goodsInfo.activityInfo.price))))
}
