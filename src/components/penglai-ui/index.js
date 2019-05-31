import './lib/transition.scss'
import './fonts/iconfont.css'
import Button from './Button.vue'
import Input from './Input.vue'
import GetCode from './Get-Code.vue'
import Tab from './Tab.vue'
import Form from './Form'
import FormItem from './Form-Item'
import Radio from './Radio.vue'
import List from './List.vue'
import UploadImg from './Upload-Img.vue'
import Fields from './Fields.vue'
import Switch from './Switch.vue'
import PlSvg from './Pl-Svg.vue'
import MessageBox from './message-box'
import Selector from './Selector.vue'
import Checkbox from './Checkbox.vue'
import CheckboxGroup from './Checkbox-Group.vue'
import { Toast } from './toast'
const components = [
  Button,
  Input,
  GetCode,
  Tab,
  Form,
  FormItem,
  Radio,
  List,
  UploadImg,
  Fields,
  PlSvg,
  Switch,
  MessageBox,
  Selector,
  Checkbox,
  CheckboxGroup
]
/* 定义全局安装方法，即在全局使用Vue.use方法 */
const install = function (Vue, opts = {}) {
  /* 安装所有组件 */
  for (let c of components) {
    if (!c.install) {
      c.install = function (Vue) {
        Vue.component(c.name, c)
      }
    }
    Vue.use(c)
  }
  /* penglai-ui 全局变量 */
  Vue.prototype.$PL = {
    size: opts.size || '',
    zIndex: opts.size || 2000
  }
  Vue.prototype.$toast = Toast
  Vue.prototype.$error = message => {
    Toast({
      type: 'error',
      message
    })
  }
  Vue.prototype.$success = message => {
    Toast({
      type: 'success',
      message
    })
  }
  Vue.prototype.$warning = message => {
    Toast({
      type: 'warning',
      message
    })
  }
}

export default {
  install,
  Button,
  Input,
  GetCode,
  Tab,
  Form,
  FormItem,
  Radio,
  List,
  UploadImg,
  Fields,
  PlSvg,
  Switch,
  MessageBox,
  Selector
}
