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
   * 给字符串添加分隔符
   * @param separator
   * @num 多少位字符设一个分隔符
   * @returns {*}
   */
    separator (val, separator, num) {
        const strArr = []
        let index = 1
        for (const char of val) {
            if (index > num) {
                strArr.push(separator)
                index = 1
            }
            strArr.push(char)
            index++
        }
        return strArr.join('')
    },

    /**
   * 将后台的金额 分 转化为 元
   * @val 金额
   * @returns {*}
   */
    formatAmount (val) {
        if (isNaN(Number(val))) return 0
        return Number((Number(val) / 100).toFixed(2))
    }
}
