import moment from 'moment'

export default {
    methods: {
        getPrice (list) {
            return key => {
                const arr = list.map(item => item[key])
                return key === 'originalPrice' ? Math.max(...arr) : Math.min(...arr)
            }
        },
        getDate (val, format) {
            if (!val) return
            return moment(val).format(format)
        },
        getTimeStatus ([start, end]) {
            let msg = ''
            const timestamp = this.timestamp || Date.now()
            const startTs = moment(start).valueOf()
            const endTs = moment(end).valueOf()
            if (timestamp < startTs) msg = '未开始'
            if (timestamp >= startTs && timestamp < endTs) msg = '进行中'
            if (timestamp >= endTs) msg = '已结束'
            return msg
        },
        getTime (item) {
            // 0: 未开始 1: 进行中
            const startTs = moment(item.activityStartTime || item.startTime).valueOf()
            const endTs = moment(item.activityEndTime || item.endTime).valueOf()
            const { status } = item
            let ts
            if (status === 0) {
                ts = startTs
            } else if (status === 1) {
                ts = endTs
            }
            return ts
        },
        reset (item) {
            if (item.goodsInfo.activityInfo.status === 0) {
                item.goodsInfo.activityInfo.status = 1
            } else if (item.goodsInfo.activityInfo.status === 1) {
                item.goodsInfo.activityInfo.status = 3
            }
            this.$emit('done')
        },
        sub (arg1, arg2) {
            let r1; let r2
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
    }
}
