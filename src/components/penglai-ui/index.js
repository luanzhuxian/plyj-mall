import './assets/scss/transition.scss'
import Button from './Button.vue'
import Checkbox from './checkbox/Checkbox.vue'
import CheckboxGroup from './checkbox/Checkbox-Group.vue'
import Collapse from './collapse/Collapse.vue'
import CollapseItem from './collapse/Collapse-Item.vue'
import Fields from './Fields.vue'
import Form from './Form'
import FormItem from './Form-Item'
import Indicator from './indicator'
import Input from './Input.vue'
import List from './List.vue'
import Loading from './loading'
import Mask from './Mask.vue'
import MessageBox from './message-box'
import Modal from './Modal.vue'
import Picker from './picker/Picker.vue'
import Popup from './Popup.vue'
import Progress from './Progress.vue'
import Radio from './radio/Radio.vue'
import RadioGroup from './radio/Radio-Group.vue'
import Selector from './Selector.vue'
import Svg from './Pl-Svg.vue'
import Switch from './Switch.vue'
import Tab from './Tab.vue'
import TabContainer from './tab-container/Tab-Container.vue'
import TabContainerItem from './tab-container/Tab-Container-Item.vue'
import Toast from './toast'
import { Timeline, TimelineItem } from './timeline'
// import CanvasVideo from './Canvas-Video.vue'
// import SvgIcon from 'vue-svgicon'

const components = [
    Button,
    Checkbox,
    CheckboxGroup,
    Collapse,
    CollapseItem,
    Fields,
    Form,
    FormItem,
    Indicator,
    Input,
    List,
    Loading,
    Mask,
    MessageBox,
    Modal,
    Picker,
    Popup,
    Progress,
    Radio,
    RadioGroup,
    Selector,
    Svg,
    Switch,
    Timeline,
    TimelineItem,
    Tab,
    TabContainer,
    TabContainerItem,
    Toast
    // CanvasVideo
]

/* 定义全局安装方法，即在全局使用 Vue.use 方法 */
const install = function (Vue, opts = {}) {
    // Vue.use(SvgIcon, {
    //   tagName: 'svgicon'
    // })
    /* 安装所有组件 */
    for (const c of components) {
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
}

export default {
    install
}
