import img from '../assets/images/img_error.png'
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
  }
}
