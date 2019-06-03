import moment from 'moment'
import 'moment/locale/zh-cn.js'

export default {
  formatDateTime (val) {
    if (!val) return ''
    if (typeof val === 'number') {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
    if (typeof Number(val) === 'number' && !!Number(val)) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
    if (typeof val === 'string') {
      return val
    }
  },

  // 隐藏账号中间几个字符
  formatAccount (str) {
    if (!str) return ''
    if (str.length < 8) {
      return str.replace(/(.)(.+)(.)/, '$1*****$3')
    }
    return str.replace(/(.{3})(.{4})(.+)/, '$1****$3')
  }
}
