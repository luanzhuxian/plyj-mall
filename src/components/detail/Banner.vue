<template>
  <div
    v-if="banners.length > 0"
    :class="'detail-banner' + ' ' + $style.detailBanner"
  >
    <swiper ref="swiper" :options="swiperOption" @slideChange="slideChange">
      <swiperSlide
        v-for="(img, index) of banners"
        :key="index"
      >
        <!-- 加了Key以后。图片可动态切换 -->
        <img
          :class="$style.bannerImg"
          alt=""
          :src="img"
          crossOrigin=""
        >
      </swiperSlide>
    </swiper>
    <div :class="'swiper-pagination ' + $style.pagination" />
    <slot />
  </div>

  <div
    v-else
    :class="$style.skeleton"
  />
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
  name: 'DetailBanner',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    banners: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      swiperOption: {
        autoplay: true,
        pagination: {
          el: '.swiper-pagination'
        }
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.swiper.swiper
    }
  },
  methods: {
    slideChange () {
      this.$emit('slideChange', this.swiper.activeIndex)
    }
  }
}
</script>

<style module lang="scss">
  .detail-banner {
    position: relative;
    height: 750px;
    font-size: 0;
  }
  .pagination {
    width: 100%;
    bottom: 94px;
  }
  .banner-img {
    width: 750px;
    height: 750px;
    object-fit: cover;
  }
  .skeleton {
    height: 750px;
    @include skeAnimation(#eee)
  }
</style>
<style lang="scss">
  .detail-banner {
    .swiper-pagination-bullet {
      position: relative;
      width: 8px;
      height: 6px;
      margin-left: 8px;
      border-radius: 3px;
      transition: width .3s linear;
      background-color: #848786;
      opacity: 1;
      &.swiper-pagination-bullet-active {
        width: 22px;
        background-color:  #e8e8e8;
      }
    }
  }
</style>
