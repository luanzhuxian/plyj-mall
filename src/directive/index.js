import img from '../assets/images/img_error.png'
export default {
  imgError: {
    inserted: function (el) {
      if (el.tagName === 'IMG') {
        el.onerror = function () {
          el.src = img
        }
      }
    }
  }
}
