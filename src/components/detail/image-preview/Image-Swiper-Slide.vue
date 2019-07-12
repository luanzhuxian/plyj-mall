<template>
  <swiper-slide :class="$style.imageSlide">
    <img
      v-finger:double-tap="doubleTap"
      :class="$style.mainImage"
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
      console.log(e)
    }
  }
}
</script>

<style module lang="scss">
  .image-slide {
    position: relative;
    display: flex;
    align-items: center;
    width: 100vw;
    height: 100vh;
    overflow: scroll;
  }
  .main-image {
    width: 100%;
  }
</style>
