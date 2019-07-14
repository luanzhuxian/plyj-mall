<template>
  <div :class="$style.plImagePreview">
    123
  </div>
</template>

<script>
export default {
  name: 'PlImagePreview',
  components: {
  },
  props: {
    // 是否将组件dom插入body
    appendToBody: Boolean,
    imgList: {
      type: Array,
      default: function () {
        return [
          'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/cUO57DkLFduZWjEJ1YJ20190611135305.jpeg',
          'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/cUO57DkLFduZWjEJ1YJ20190611135305.jpeg',
          'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/cUO57DkLFduZWjEJ1YJ20190611135305.jpeg'
        ]
      }
    }
  },
  data () {
    // 上次缩放结束时的值
    this.lastZoom = 1
    return {
      swiperOption: {
        autoplay: false
      },
      activeIndex: 0,
      isZoom: false,
      zoom: 1,
      maxZoom: 4,
      minZoom: 0.8,
      deltaX: 0,
      deltaY: 0,
      transition: false
    }
  },
  computed: {
    swiper () {
      return this.$refs.swiper.swiper
    },
    hasHeader () {
      return Boolean(this.$slots.header)
    },
    hasFooter () {
      return Boolean(this.$slots.footer)
    }
  },
  watch: {
    zoom (val) {
      if (val > 1) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = null
      }
    }
  },
  mounted () {
    console.log(this)
    // if (this.appendToBody) {
    //   document.body.appendChild(this.$el)
    // }
  },
  methods: {
    slideChange () {
      this.activeIndex = this.swiper.activeIndex
      this.$emit('slideChange', this.swiper.activeIndex)
      console.log(this.$refs)
    },
    doubleTap (e) {
      this.transition = true
      if (this.zoom > 1) {
        this.zoom = 1
        this.deltaX = 0
        this.deltaY = 0
      } else {
        this.zoom = this.maxZoom
      }
      this.lastZoom = 0
      setTimeout(() => {
        this.transition = false
      }, 300)
    },
    touchmove (e) {
      if (this.zoom === 1) return
      e.stopPropagation()
      e.preventDefault()
      this.deltaX += e.deltaX
      this.deltaY += e.deltaY
      console.log(this.deltaX, this.deltaY)
    },
    // 捏 (放大或缩小)
    pinch (e) {
      let { zoom } = e
      if (this.zoom < this.minZoom) {
        return
      }
      if (this.zoom > this.maxZoom) {
        return
      }
      this.zoom = this.lastZoom * zoom
    },
    multipointEnd () {
      this.lastZoom = this.zoom
      // console.log(this.lastZoom)
      // console.log('CANCEL')
      console.log()
      this.transition = true
      if (this.zoom > this.maxZoom) {
        this.zoom = this.maxZoom
      }
      if (this.zoom < 1) {
        this.zoom = 1
      }
      // this.deltaX = 0
      // this.deltaY = 0
      setTimeout(() => {
        this.transition = false
      }, 300)
    },
    lockBody () {

    }
  }
}
</script>

<style module lang="scss">
  .pl-image-preview {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 9999;
  }
  .header {
    position: relative;
    width: 100%;
    color: #fff;
    font-size: 28px;
    padding: 24px 0;
    text-align: center;
    background: linear-gradient(180deg, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
  }
  .number {
    text-shadow: 1px -2px 3px #333;
  }
  .closeSwiper {
    position: absolute;
    top: 32px;
    left: 40px;
    width: 23px;
  }
  .header {
    position: absolute;
    width: 100%;
    z-index: 20;
  }
  .footer {
    position: absolute;
    width: 100%;
  }

  .image-slide {
    display: flex;
    align-items: center;
    position: relative;
    width: 100vw;
    height: 100vh;
  }
  .main-image {
    width: 100%;
    overflow: scroll;
    transform: matrix(var(--zoom), 0, 0, var(--zoom), var(--deltaX), var(--deltaY));
    &.transition {
      transition: transform .3s ease;
    }
  }
</style>
