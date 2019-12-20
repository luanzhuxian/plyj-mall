<template>
  <div :class="$style.chunyun" class="chunyun">
    <router-link :class="$style.chunyunBg" tag="div" :to="{ name: 'SpringPloughing' }">
      <div :class="$style.countDownWrapper">
        <span v-if="data.values[0].status === 0">距活动开始：</span>
        <span v-if="data.values[0].status === 1">距活动结束：</span>
        <span v-if="data.values[0].status === 2">活动已结束</span>
        <count-down
          v-if="~[0, 1].indexOf(data.values[0].status)"
          :timestamp="getTime(data.values[0])"
          size="middle"
          color="#184B28"
          background="#96E3A9"
          @done="data.values[0].status += 1"
        />
      </div>
      <p :class="$style.link">
        查看计划礼包 >
      </p>
    </router-link>
    <ul
      v-if="data.values.length && data.values[0].combinationDetailList && data.values[0].combinationDetailList.length"
      :class="[$style.chunyunList, $style[size], size]"
    >
      <template v-if="data.values[0].status === 0">
        <swiper :options="getOptions(data.values[0].combinationDetailList, map1)">
          <swiper-slide v-for="(item, i) of data.values[0].combinationDetailList" :key="i">
            <item-chunyun :data="item" :size="size" />
          </swiper-slide>
        </swiper>
      </template>

      <template v-if="data.values[0].status === 1">
        <swiper :options="getOptions(item.productModelList, map2)" v-for="(item, i) of data.values[0].combinationDetailList" :key="i">
          <swiper-slide>
            <item-chunyun :data="item" :size="size" />
          </swiper-slide>
          <swiper-slide v-for="(prod, j) of item.productModelList" :key="j">
            <router-link
              :class="$style.chunyunListProdWrapper"
              class="chunyun-list-prod-wrapper"
              tag="li"
              :to="{ name: 'Lesson', params: { productId: prod.productId }, query: { currentProductStatus: 5 } }"
            >
              <div :class="$style.chunyunListProd">
                <div :class="$style.imgWrapper">
                  <img :src="prod.productImage" alt="">
                </div>
                <div :class="$style.name">
                  {{ prod.productName }}
                </div>
                <div :class="$style.origin">
                  {{ `原价：￥${(prod.originPrice * 1000 * prod.count) / 1000}` }}
                </div>
                <div :class="$style.current">
                  {{ `组合价：￥${(prod.price * 1000 * prod.count) / 1000}` }}
                </div>
              </div>
            </router-link>
          </swiper-slide>
        </swiper>
      </template>
    </ul>
  </div>
</template>

<script>
import mixin from '../mixin.js'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CountDown from '../components/Count-Down.vue'
import ItemChunyun from './Item-Chunyun.vue'

export default {
  name: 'Chunyun',
  mixins: [mixin],
  components: {
    swiper,
    swiperSlide,
    CountDown,
    ItemChunyun
  },
  props: {
    data: {
      type: Object,
      default () {
        return { values: [] }
      }
    }
  },
  data () {
    return {
      map1: {
        '0': 1,
        '1': 1,
        '2': 1.2
      },
      map2: {
        '0': 1,
        '1': 2,
        '2': 2.14,
        '3': 2.2,
        '4': 2.25,
        '5': 2.26,
        '6': 2.28
      }
    }
  },
  computed: {
    size () {
      const { data } = this
      let result
      if (!data.values.length) return
      if (data.values[0].status === 0) {
        if (data.values[0].combinationDetailList.length === 1) result = 'large'
        if (data.values[0].combinationDetailList.length > 1) result = 'medium'
      }
      if (data.values[0].status === 1) result = 'small'
      return result
    }
  },
  methods: {
    getOptions (list, map) {
      const length = (list && list.length) || 0
      const swiperOption = {
        slidesPerView: map[length],
        spaceBetween: 0,
        grabCursor: true
      }
      return swiperOption
    }
  }
}
</script>

<style lang="scss" module>
.chunyun {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &-bg {
    position: relative;
    background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/c6bd4a18-d557-4dbd-9270-edab7a0f30b1.png") no-repeat center top;
    background-size: 100% auto;
    height: 682px;
    .count-down-wrapper {
      position: absolute;
      top: 290px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      width: 420px;
      height: 70px;
      line-height: 70px;
      font-size: 28px;
      color: #96E3A9;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .link {
      position: absolute;
      top: 390px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 26px;
      font-family: Microsoft YaHei;
      color: #184B28;
    }
  }
  &-list {
    padding: 0 32px 48px;
    background: #8DC607;
    &.medium {
      padding: 0 0 48px 32px;
    }
    &.small {
      padding: 0 0 48px 32px;
      .chunyun-list-prod-wrapper {
        display: flex;
        align-items: center;
        padding: 0 8px;
        height: 440px;
        background: #749529;
      }
      .chunyun-list-prod {
        box-sizing: border-box;
        padding: 12px;
        width: 280px;
        height: 330px;
        background: #BFE36A;
        .img-wrapper {
          height: 172px;
        }
        .name {
          padding: 0 12px;
          height: 44px;
          line-height: 44px;
          background: #397432;
          font-size: 24px;
          font-family: Microsoft YaHei;
          color: #92F4C7;
          text-align: center;
          @include elps();
        }
        .origin {
          margin-top: 12px;
          font-size: 24px;
          line-height: 30px;
          color: #02684F;
          @include elps();
        }
        .current {
          margin-top: 6px;
          font-size: 24px;
          font-weight: bold;
          line-height: 30px;
          color: #A6482F;
          @include elps();
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.chunyun {
  /deep/ .count-down > .time > span {
    padding: 0 8px;
    font-size: 24px;
    line-height: 40px;
    color: #96E3A9;
  }
}
.small {
  .swiper-container {
    margin-top: 32px;
    &:nth-of-type(1) {
      margin: 0;
    }
    > .swiper-wrapper > .swiper-slide {
      display: flex;
      align-items: center;
      width: auto !important;
      height: 508px !important;
      &:nth-of-type(1) {
        width: auto !important;
      }
      &:nth-of-type(2) > .chunyun-list-prod-wrapper {
        padding-left: 20px;
      }
      &:nth-last-of-type(1) > .chunyun-list-prod-wrapper {
        padding-right: 20px;
      }
    }
  }
}
</style>
