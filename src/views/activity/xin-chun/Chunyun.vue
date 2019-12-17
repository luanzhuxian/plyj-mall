<template>
  <router-link :class="$style.chunyun" tag="div" :to="{ name: 'SpringPloughing' }">
    <div :class="$style.chunyunBg">
      <div :class="$style.countDownWrapper">
        <span v-if="data.values[0].status === 0">距活动开始：</span>
        <span v-if="data.values[0].status === 1">距活动结束：</span>
        <span v-if="data.values[0].status === 2">活动已结束</span>
        <count-down
          :timestamp="getTime(data.values[0].activityStartTime, data.values[0].activityEndTime, data.values[0].status)"
          size="middle"
          color="#184B28"
          background="#96E3A9"
          @done="data.values[0].status += 1"
        />
      </div>
    </div>
    <ul
      v-if="data.values.length && data.values[0].combinationDetailList && data.values[0].combinationDetailList.length"
      :class="{
        [$style.chunyunList]: true,
        [$style.large]: data.values[0].status === 0 && data.values[0].combinationDetailList.length === 1,
        [$style.medium]: data.values[0].status === 0 && data.values[0].combinationDetailList.length > 1,
        [$style.small]: data.values[0].status === 1,
        small: data.values[0].status === 1,
      }"
    >
      <template v-if="data.values[0].status === 0">
        <swiper :options="getOptions(data.values[0].combinationDetailList, map1)">
          <swiper-slide v-for="(item, i) of data.values[0].combinationDetailList" :key="i">
            <li :class="$style.chunyunListItem">
              <div :class="$style.title">
                {{ item.name }}
              </div>
              <div :class="$style.imgWrapper">
                <img :src="item.imageUrl" alt="">
              </div>
              <div :class="$style.price">
                <div :class="$style.origin">
                  {{ `原价：￥${item.totalPrice}` }}
                </div>
                <div :class="$style.current">
                  {{ `组合到手价：￥${item.discountTotalPrice}` }}
                </div>
              </div>
              <div :class="[$style.cornner, $style.topLeft]" />
              <div :class="[$style.cornner, $style.topRight]" />
              <div :class="[$style.cornner, $style.bottomRight]" />
              <div :class="[$style.cornner, $style.bottomLeft]" />
            </li>
          </swiper-slide>
        </swiper>
      </template>

      <template v-if="data.values[0].status === 1">
        <swiper :options="getOptions(item.productModelList, map2)" v-for="(item, i) of data.values[0].combinationDetailList" :key="i">
          <swiper-slide>
            <li :class="$style.chunyunListItem">
              <div :class="$style.title">
                {{ item.name }}
              </div>
              <div :class="$style.imgWrapper">
                <img :src="item.imageUrl" alt="">
              </div>
              <div :class="$style.countDownWrapper">
                <span v-if="item.status === 0">距开始：</span>
                <span v-if="item.status === 1">距结束：</span>
                <span v-if="item.status === 2">已结束</span>
                <count-down
                  :timestamp="getTime(item.startTime, item.endTime, item.status)"
                  color="#184B28"
                  background="#92F4C7"
                  format="HH:mm"
                  @done="item.status += 1"
                />
              </div>
              <div :class="$style.price">
                <div :class="$style.origin">
                  <span :class="$style.left">
                    {{ `原价：￥${item.totalPrice}` }}
                  </span>
                  <span :class="$style.right">
                    {{ `人已买` }}
                  </span>
                </div>
                <div :class="$style.current">
                  {{ `组合到手价：￥${item.discountTotalPrice}` }}
                </div>
              </div>
              <div :class="[$style.cornner, $style.topLeft]" />
              <div :class="[$style.cornner, $style.topRight]" />
              <div :class="[$style.cornner, $style.bottomRight]" />
              <div :class="[$style.cornner, $style.bottomLeft]" />
            </li>
          </swiper-slide>
          <swiper-slide v-for="(prod, j) of item.productModelList" :key="j">
            <li :class="$style.chunyunListProdWrapper" class="chunyun-list-prod-wrapper">
              <div :class="$style.chunyunListProd">
                <div :class="$style.imgWrapper">
                  <img :src="prod.productImage" alt="">
                </div>
                <div :class="$style.name">
                  {{ prod.productName }}
                </div>
                <div :class="$style.origin">
                  {{ `原价：￥${prod.price}` }}
                </div>
                <div :class="$style.current">
                  {{ `组合价：￥${prod.discountPrice}` }}
                </div>
              </div>
            </li>
          </swiper-slide>
        </swiper>
      </template>
    </ul>
  </router-link>
</template>

<script>
import moment from 'moment'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CountDown from '../components/Count-Down.vue'

export default {
  name: 'Chunyun',
  components: {
    swiper,
    swiperSlide,
    CountDown
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
        '1': 1,
        '2': 1.2
      },
      map2: {
        '1': 2,
        '2': 2.14,
        '3': 2.2,
        '4': 2.25,
        '5': 2.26,
        '6': 2.28
      }
    }
  },
  methods: {
    getTime (startTime, endTime, status) {
      // 0: 未开始 1: 进行中
      const startTs = moment(startTime).valueOf()
      const endTs = moment(endTime).valueOf()
      let ts
      if (status === 0) {
        ts = startTs
      } else if (status === 1) {
        ts = endTs
      }
      return ts
    },
    getOptions (list, map) {
      if (!list || !list.length) return
      const swiperOption = {
        slidesPerView: map[list.length],
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
  /deep/ .count-down > .time > span {
    padding: 0 8px;
    font-size: 24px;
    line-height: 40px;
    color: #96E3A9;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &-bg {
    position: relative;
    background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/7abb300e-640c-4a22-a540-2c837bf9401d.png") no-repeat center top;
    background-size: 100% auto;
    height: 682px;
    .count-down-wrapper {
      position: absolute;
      top: 290px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      width: 416px;
      height: 70px;
      line-height: 70px;
      font-size: 28px;
      color: #96E3A9;
      display: flex;
      justify-content: center;
      align-items: center;
      .num {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        background: #96E3A9;
        border-radius: 6px;
        font-size: 28px;
        color: #184B28;
        margin: 0 4px;
      }
    }
  }
  &-list {
    padding: 0 32px 48px;
    background: #8DC607;
    &.medium {
      padding: 0 0 48px 32px;
      .chunyun-list-item {
        width: 560px;
        .img-wrapper {
          height: 344px;
        }
      }
    }
    &.small {
      padding: 0 0 48px 32px;
      .chunyun-list-item {
        padding: 20px 16px;
        width: 344px;
        .title {
          height: 48px;
          line-height: 48px;
          font-size: 24px;
          letter-spacing: 4px;
        }
        .img-wrapper {
          margin-top: 20px;
          height: 208px;
        }
        .count-down-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 8px;
          height: 62px;
          line-height: 62px;
          background: #397432;
          font-size: 24px;
          color: #92F4C7;
        }
        .origin {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          font-size: 24px;
          .left {
            @include elps();
          }
          .right {
            font-size: 20px;
            color: #92F4C7;
            @include elps();
          }
        }
        .current {
          max-width: none;
          height: 60px;
          line-height: 60px;
          font-size: 28px;
          font-family: San Francisco Display;
          @include elps();
        }
        .cornner {
          width: 30px;
          height: 30px;
        }
      }
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
    &-item {
      position: relative;
      box-sizing: border-box;
      padding: 40px 24px 48px;
      background: #428B42;
      border: 2px solid #A3D816;
      width: 100%;
      .title {
        margin: 0 auto;
        height: 64px;
        line-height: 64px;
        background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/e009100a-579a-4369-8238-db258fb2d91b.png") no-repeat center;
        background-size: auto 100%;
        font-size: 28px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #DCFD8C;
        letter-spacing: 4px;
        text-align: center;
        @include elps();
      }
      .img-wrapper {
        margin-top: 32px;
        width: 100%;
        height: 426px;
        overflow: hidden;
      }
      .origin {
        margin-top: 24px;
        font-size: 36px;
        font-family: San Francisco Display;
        line-height: 42px;
        color: #FFFFFF;
        text-align: center;
        @include elps();
      }
      .current {
        margin: 12px auto 0;
        padding: 0 20px;
        max-width: fit-content;
        height: 90px;
        line-height: 90px;
        background: #DEF3CA;
        color: #A6482F;
        font-size: 44px;
        font-family: San Francisco Display;
        font-weight: bold;
        border-radius: 10px;
        @include elps();
      }
      .cornner {
        position: absolute;
        width: 46px;
        height: 46px;
        background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/1c11b4a5-091d-4f8d-a88c-e8334dfc9d88.png") no-repeat center;
        background-size: cover;
        &.top-left {
          top: 0;
          left: 0;
        }
        &.top-right {
          top: 0;
          right: 0;
          transform: rotate(90deg);
        }
        &.bottom-left {
          bottom: 0;
          left: 0;
          transform: rotate(270deg);
        }
        &.bottom-right {
          bottom: 0;
          right: 0;
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
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
