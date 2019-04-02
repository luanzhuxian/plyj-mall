import Vue from 'vue'
import {
  Swipe,
  SwipeItem,
  Picker,
  MessageBox,
  Loadmore,
  Toast,
  DatetimePicker
} from 'mint-ui'
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Picker.name, Picker)
Vue.component(Loadmore.name, Loadmore)
Vue.component(DatetimePicker.name, DatetimePicker)

/*
* 提示框，返回一个promise对象
* @msg: 要提示的内容
* @title: 提示框头部(标题), 默认为‘温馨提示’
* */
Vue.prototype.$confirm = (msg, title = '温馨提示') => MessageBox.confirm(msg, title)
Vue.prototype.$alert = (msg, title = '温馨提示') => MessageBox.alert(msg, title)
Vue.prototype.$prompt = (msg, title = '温馨提示') => MessageBox.prompt(msg, title)

let toastInterface = null
Vue.prototype.$toast = function (msg) {
  if (toastInterface) {
    // 开启下一个Toast时关闭上次打开的Toast
    toastInterface.close()
    toastInterface = null
  }
  toastInterface = Toast(msg)
}
