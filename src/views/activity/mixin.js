import moment from 'moment'

export default {
  methods: {
    getPrice (list) {
      return (key) => {
        let arr = list.map(item => item[key])
        return key === 'originalPrice' ? Math.max(...arr) : Math.min(...arr)
      }
    },
    getDate (val, format) {
      if (!val) return
      return moment(val).format(format)
    },
    getTimeStatus ([start, end]) {
      let msg = ''
      const timestamp = this.timestamp
      const startTs = moment(start).valueOf()
      const endTs = moment(end).valueOf()
      if (timestamp < startTs) msg = '未开始'
      if (timestamp >= startTs && timestamp < endTs) msg = '进行中'
      if (timestamp >= endTs) msg = '已结束'
      return msg
    },
    getTime ({ activityStartTime, activityEndTime, status }) {
      // 0: 未开始 1: 进行中
      const startTs = moment(activityStartTime).valueOf()
      const endTs = moment(activityEndTime).valueOf()
      let ts
      if (status === 0) {
        ts = startTs
      } else if (status === 1) {
        ts = endTs
      }
      return ts
    }
  }
}
