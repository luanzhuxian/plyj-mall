import Swiper from 'swiper'
import AlloyFinger from 'alloyfinger'
let zooming = false
let big = false
let initialX = 0
let initialY = 0
let mySwiper = null
const FingerConfig = {
  touchStart: function () {
  },
  touchMove: function (e) {
    e.preventDefault()
    if (!big || zooming) return
    let { deltaX, deltaY } = e
    initialX += deltaX
    initialY += deltaY
    if (initialX <= -250) {
      initialX = -250
    }
    if (initialX >= 250) {
      initialX = 250
    }
    if (initialY <= -70) {
      initialY = -70
    }
    if (initialY >= 70) {
      initialY = 70
    }
    mySwiper.el.style.setProperty('--deltaX', `${initialX}px`)
    mySwiper.el.style.setProperty('--deltaY', `${initialY}px`)
  },
  touchEnd: function () {
  },
  touchCancel: function () {
  },
  multipointStart: function () {
  },
  multipointEnd: function () {
  },
  tap: function () {
  },
  doubleTap: function (e) {
    // 双击缩放
    if (zooming) {
      return
    }
    zooming = true
    if (big) {
      initialX = 0
      initialY = 0
      this.style.transition = 'transform .3s linear'
      this.classList.remove('swiper-no-swiping')
      this.classList.remove('scaling')
      mySwiper.el.style.setProperty('--deltaX', `${initialX}%`)
      mySwiper.el.style.setProperty('--deltaY', `${initialY}%`)
      mySwiper.el.style.setProperty('--scale', 1)
      setTimeout(() => {
        this.style.transition = null
      }, 600)
      big = false
    } else {
      this.classList.add('scaling')
      this.style.transition = 'transform .3s linear'
      mySwiper.el.style.setProperty('--scale', 2)
      this.classList.add('swiper-no-swiping')
      big = true
    }
    setTimeout(() => {
      this.style.transition = null
      zooming = false
    }, 600)
  },
  pinch: function (evt) {
    console.log(evt.zoom)
  }
}
const imgerList = {}
export default {
  inserted: function (el, { arg, value }) {
    if (el.tagName === 'IMG') {
      el.addEventListener('click', function (e) {
        createSwiper(imgerList[arg])
      })
      if (arg) {
        imgerList[arg] = imgerList[arg] || []
        imgerList[arg].push(value)
      }
      console.log(imgerList[arg])
    }
  }
}
/* eslint-disable */
function createSwiper (imgList) {
  const swiperContainer = document.createElement('div')
  const swiperWrapper = document.createElement('div')
  swiperContainer.classList.add('imger-swiper-container')
  swiperWrapper.classList.add('swiper-wrapper')
  for (let url of imgList) {
    let swiperSlide = document.createElement('div')
    let swiperImg = document.createElement('img')
    swiperImg.src = url
    swiperSlide.classList.add('swiper-slide')
    swiperSlide.appendChild(swiperImg)
    swiperWrapper.appendChild(swiperSlide)
    new AlloyFinger(swiperImg, FingerConfig)
  }
  swiperContainer.appendChild(swiperWrapper)
  document.body.appendChild(swiperContainer)
  mySwiper = new Swiper('.imger-swiper-container', {
    autoplay: false,
    preloadImages: false,
    noSwiping: true,
    preventInteractionOnTransition: true,
    on: {
      slideChange () {
        // zooming = false
        // big = false
        // initialX = 0
        // initialY = 0
        // let scaleImg = mySwiper.el.querySelector('img.scaling')
        // scaleImg.transition = 'transform .3s linear'
        // mySwiper.el.style.setProperty('--deltaX', `${initialX}%`)
        // mySwiper.el.style.setProperty('--deltaY', `${initialY}%`)
        // mySwiper.el.style.setProperty('--scale', 1)
        // setTimeout(() => {
        //   scaleImg.transition = null
        //   scaleImg.classList.remove('scaling')
        // }, 300)
      }
    }
  })

  mySwiper.el.style.setProperty('--deltaX', `${initialX}px`)
  mySwiper.el.style.setProperty('--deltaY', `${initialY}px`)
}
