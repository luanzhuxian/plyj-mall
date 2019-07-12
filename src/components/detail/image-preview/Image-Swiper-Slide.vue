<template>
  <swiper-slide
    :class="{
      [$style.imageSlide]: true,
      'swiper-no-swiping': zoom > 1
    }"
  >
    <img
      v-finger:double-tap="doubleTap"
      v-finger:touch-move="touchmove"
      :class="{
        [$style.mainImage]: true,
        [$style.transition]: transition
      }"
      :style="{
        '--zoom': zoom,
        '--deltaX': deltaX,
        '--deltaY': deltaY
      }"
      src="http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/cUO57DkLFduZWjEJ1YJ20190611135305.jpeg" alt=""
    >
  </swiper-slide>
</template>

<script>
import { swiperSlide } from 'vue-awesome-swiper'
export default {
  name: 'PlImagePreview',
  components: {
    swiperSlide
  },
  data () {
    return {
      isZoom: false,
      zoom: 1,
      maxZoom: 4,
      deltaX: 0,
      deltaY: 0,
      transition: false
    }
  },
  props: {
    // 是否将组件dom插入body
    appendToBody: Boolean
  },
  computed: {
  },
  mounted () {
    console.log(this)
  },
  methods: {
    doubleTap (e) {
      this.transition = true
      if (this.zoom === this.maxZoom) {
        this.zoom = 1
        this.deltaX = 0
        this.deltaY = 0
        document.body.style.overflow = null
      } else {
        document.body.style.overflow = 'hidden'
        this.zoom = this.maxZoom
      }
      setTimeout(() => {
        this.transition = false
      }, 300)
      console.log(e)
    },
    touchmove (e) {
      if (this.zoom === 1) return
      e.stopPropagation()
      e.preventDefault()
      this.deltaX += e.deltaX
      this.deltaY += e.deltaY
      console.log(this.deltaX, this.deltaY)
    }
  }
}
</script>

<style module lang="scss">
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
