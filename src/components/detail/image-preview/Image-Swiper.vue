<template>
  <div :class="$style.plImagePreview">
    <div :class="$style.header">
      <slot :totalSlide="totalSlide" :activeIndex="activeIndex" name="header" />
    </div>
    <swiper :options="swiperOption" @slideChange="slideChange" ref="swiper">
      <slot :total="totalSlide" :activeIndex="activeIndex" />
    </swiper>
    <div :class="$style.footer">
      <slot :totalSlide="totalSlide" :activeIndex="activeIndex" name="footer" />
    </div>
  </div>
</template>

<script>
import { swiper } from 'vue-awesome-swiper'
export default {
  name: 'PlImagePreview',
  components: {
    swiper
  },
  props: {
    // 是否将组件dom插入body
    appendToBody: Boolean
  },
  data () {
    return {
      swiperOption: {
        autoplay: false
      },
      activeIndex: 0
    }
  },
  computed: {
    swiper () {
      return this.$refs.swiper.swiper
    },
    totalSlide () {
      return this.$slots.default.length
    },
    hasHeader () {
      return Boolean(this.$slots.header)
    },
    hasFooter () {
      return Boolean(this.$slots.footer)
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
    position: absolute;
    width: 100%;
  }
  .footer {
    position: absolute;
    width: 100%;
  }
</style>
