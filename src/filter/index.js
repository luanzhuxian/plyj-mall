import moment from 'moment'
import 'moment/locale/zh-cn.js'

export default {
  dateFormat (val, format) {
    return moment(val).format(format)
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
