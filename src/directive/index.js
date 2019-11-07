let img = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/img_error.png'
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
      if (!arg) id++
      let currentArg = arg || 'imgerList_' + id
      // 如果绑定的元素不是img元素，那么就获取改元素下的所有图片元素
      // 以这些图片的src属性组成列表

      value = value || el.src || ''
      if (IMGERLIST[currentArg]) {
        IMGERLIST[currentArg].push(value)
      } else {
        IMGERLIST[currentArg] = [value]
      }
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
