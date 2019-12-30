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
  },
  /**
   * 转化浮点数精度
   * @param val {number} 待转换的数字
   * @param precision {number} 精度(默认为整数)
   */
  toPrecision (val = 0, precision = 0) {
    return Number(val.toPrecision(precision))
  },
  /**
   * 给字符串添加分隔符
   * @param separator
   * @num 多少位字符设一个分隔符
   * @returns {*}
   */
  separator (val, separator, num) {
    let strArr = []
    let index = 1
    for (let char of val) {
      if (index > num) {
        strArr.push(separator)
        index = 1
      }
      strArr.push(char)
      index++
    }
    return strArr.join('')
  }
}
