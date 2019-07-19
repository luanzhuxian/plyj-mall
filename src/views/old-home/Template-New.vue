<template lang="html">
  <div :class="$style.templateNew">
    <div :class="$style.search">
      <router-link
        tag="div"
        :class="$style.inputWrapper"
        :to="{ name: 'Search' }"
      >
        <pl-svg name="search" />
        <input type="text" placeholder="搜索商品">
      </router-link>
    </div>
    <div :class="$style.bannerModule">
      <div :class="$style.swiperWrapper">
        <swiper
          v-if="data['BANNER'].values.length"
          :class="$style.swiper"
          :options="swiperOption"
        >
          <swiper-slide v-for="(item, index) of data['BANNER'].values" :key="index">
            <router-link
              :class="$style.img"
              v-if="item.type && item.value"
              tag="img"
              :src="item.image"
              :to="getRouteLink(item)"
            />
            <img
              :class="$style.img"
              v-else
              :src="item.image"
            >
          </swiper-slide>
          <div class="banner-pagination" slot="pagination" />
        </swiper>
      </div>
    </div>
    <div :class="[$style.module, $style.popularModule]" v-if="data['MODULEA'].values.length">
      123
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'

export default {
  name: 'TemplateNew',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: true,
        loop: false,
        pagination: {
          el: '.banner-pagination',
          clickable: true
        }
      }
    }
  },
  computed: {
    ...mapGetters(['agencyCode', 'agentUser', 'mallName', 'userId'])
  },
  created () {},
  methods: {
    getRouteLink ({ type, value }) {
      const name = type === 1 ? 'Classify' : 'Lesson'
      const id = (type === 1 && value === '全部商品') ? '' : value
      return {
        name,
        params: {
          ...(type === 1 ? { optionId: id } : null),
          ...(type === 2 ? { productId: id } : null),
          ...(type === 2 && this.agentUser ? { brokerId: this.userId } : null) // 如果当前用户是helper，尝试获取该商品的brokerId
        }
      }
    }
  }
}
</script>

<style module lang="scss">
  @import "./index.scss";
</style>
<style lang="scss">
  .swiper-slide {
    display: inline-flex;
    justify-content: center;
  }
  .banner-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto !important;
    position: absolute;
    bottom: 30px;
    z-index: 9;
    span {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-left: 7px;
      background-color: #CCCCCC !important;
    }
  }
  .good-gift-pagination {
    margin-top: 33px;
    text-align: center;
    span {
      display: inline-block;
      width: 10px;
      height: 17px;
      background-color: #d8d8d8;
      border-radius: 5px !important;
      margin: 0 16px 0 0 !important;
      transform: rotate(45deg);
      opacity: 1;
      &.swiper-pagination-bullet-active {
        background-color: #333;
      }
    }
  }
</style>
