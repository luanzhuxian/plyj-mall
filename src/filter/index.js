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
   * 浮点数加法计算
   * @param a {number} 第一个加数
   * @param args {Array<number>} 其余加数
   */
  floatPlus (a, ...args) {
    const pre = 100000
    a *= pre
    for (let num of args) {
      a += num * pre
    }
    return a / pre
  },
  /**
   * 浮点数加法计算
   * @param a {number} 被减数
   * @param args {Array<number>} 减数
   */
  floatSub (a, ...args) {
    const pre = 100000
    a *= pre
    for (let num of args) {
      a -= num * pre
    }
    return a / pre
  },
  /**
   * 浮点数乘法计算
   * @param a {number} 被减数
   * @param pre {number} 被计算的数字有几位小数
   * @param args {Array<number>} 其他乘数
   */
  floatMulti (a, pre = 0, ...args) {
    a = a * Math.pow(10, pre)
    for (let num of args) {
      num = num * Math.pow(10, pre)
      a = a * num
      a = a / Math.pow(10, pre)
    }
    return a / Math.pow(10, pre)
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
