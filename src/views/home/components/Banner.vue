<template>
  <div :class="$style.banner">
    <swiper
      :options="swiperOptionBanner"
    >
      <swiperSlide v-for="(item, i) of data.values" :key="i">
        <img :class="$style.img" :src="item.image" :alt="item.name" @click="imgClick(item)">
      </swiperSlide>
      <div v-show="data.values.length > 1" class="banner-pagination" slot="pagination" />
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'
export default {
  name: 'Banner',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      swiperOptionBanner: {
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: true,
        loop: false,
        spaceBetween: 20,
        pagination: {
          el: '.banner-pagination',
          clickable: true
        }
      }
    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return { values: [] }
      }
    }
  },
  computed: {
    ...mapGetters(['agentUser', 'userId'])
  },
  methods: {
    imgClick (item) {
      if (!item.value) return
      if (item.type === 1) {
        this.$router.push({ name: 'Classify', params: { optionId: item.value } })
      } else if (item.type === 2) {
        this.$router.push({ name: 'Lesson', params: { productId: item.value, brokerId: this.agentUser ? this.userId : null } })
      }
    }
  }
}
</script>

<style module lang="scss">
  .banner {
    padding: 24px 24px 32px 24px;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
    .img {
      width: 702px;
      height: 468px;
      border-radius: 20px;
    }
  }
</style>
<style scoped lang="scss">
  .banner-pagination {
    position: absolute;
    left: 50%;
    bottom: 16px;
    display: flex;
    align-items: center;
    width: auto;
    height: 18px;
    padding: 0 8px;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, .3);
    border-radius: 9px;
    z-index: 1;
    /deep/.swiper-slide {
      border-radius: 10px;
    }
    /deep/.swiper-pagination-bullet {
      width: 10px !important;
      height: 10px !important;
      margin-right: 8px;
      border-radius: 5px;
      background-color: #ccc;
      &.swiper-pagination-bullet-active {
        background-color: #fff;
      }
      &:nth-last-of-type(1) {
        margin-right: 0;
      }
    }
  }
</style>
