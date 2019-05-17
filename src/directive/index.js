import img from '../assets/images/img_error.png'
import classifyIcon from '../assets/images/default.svg'
export default {
  imgError: {
    inserted: function (el, { value }) {
      if (el.tagName === 'IMG') {
        el.onerror = function () {
          if (value === 'classifyIcon') {
            el.src = classifyIcon
          } else {
            el.src = img
          }
        }
      }
    }
  }
}
