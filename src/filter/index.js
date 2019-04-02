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
  }
}
