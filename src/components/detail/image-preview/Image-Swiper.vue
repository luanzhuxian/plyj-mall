<template>
  <div :class="$style.plImagePreview">
    <div :class="$style.header">
      <pl-svg :class="$style.closeSwiper" name="close" color="#fff" />
      <span :class="$style.number">{{ activeIndex + 1 }}/{{ totalSlide }}</span>
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

</style>
