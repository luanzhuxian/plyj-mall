import img from '../assets/images/img_error.png'
let IMGERLIST = {}
let id = 0
export default {
  imgError: {
    inserted: function (el, { value }) {
      if (el.tagName === 'IMG') {
        el.onerror = function () {
          if (value === 'classifyIcon') {
            el.src = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/category-default.png'
          } else {
            el.src = img
          }
        }
      }
    }
  },
  /**
   * v-imger:group="url"
   */
  imger: {
    inserted: function (el, { value, arg }) {
      value = value || el.src || ''
      if (!arg) id++
      let currentArg = arg || 'imgerList_' + id
      if (IMGERLIST[currentArg]) {
        IMGERLIST[currentArg].push(value)
      } else {
        IMGERLIST[currentArg] = [value]
      }
      IMGERLIST[currentArg] = [...new Set(IMGERLIST[currentArg])]
      el.addEventListener('click', function (e) {
        e.stopPropagation()
        window.wx.previewImage({
          current: value, // 当前显示图片的http链接
          urls: [...IMGERLIST[currentArg]] // 需要预览的图片http链接列表
        })
      })
    },
    unbind () {
      IMGERLIST = {}
    }
  }
}
