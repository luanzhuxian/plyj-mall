<template>
  <div :class="$style.chunyun" class="chunyun">
    <div :class="$style.chunyunBg">
      <div :class="$style.countDownWrapper">
        <span>{{ true ? '距活动开始：' : '距活动结束：' }}</span>
        <count-down
          :timestamp="ts"
          size="middle"
          color="#184B28"
          background="#96E3A9"
          @done="data.statue = 4"
        />
      </div>
    </div>
    <!-- <ul :class="$style.chunyunList" v-if="data.values.length"> -->
    <ul :class="$style.chunyunList">
      <li :class="$style.chunyunListItem">
        <div :class="$style.title">
          新春开学季度第一弹
        </div>
        <div :class="$style.imgWrapper">
          <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
        </div>
        <div :class="$style.origin">
          原价：￥1999
        </div>
        <div :class="$style.current">
          组合到手价：￥99.9
        </div>
        <div :class="[$style.cornner, $style.topLeft]" />
        <div :class="[$style.cornner, $style.topRight]" />
        <div :class="[$style.cornner, $style.bottomRight]" />
        <div :class="[$style.cornner, $style.bottomLeft]" />
      </li>
    </ul>
  </div>
</template>

<script>
// import moment from 'moment'
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CountDown from '../components/Count-Down.vue'

export default {
  name: 'Chunyun',
  components: {
    // swiper,
    // swiperSlide,
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
      ts: '1576553460000'
    }
  },
  computed: {
    // ts () {
    //   return moment(liveStartTime).valueOf()
    // }
  },
  methods: {}
}
</script>
<style lang="scss" module>
.chunyun {
  &-bg {
    position: relative;
    background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/7abb300e-640c-4a22-a540-2c837bf9401d.png") no-repeat center top;
    background-size: 100% auto;
    height: 682px;
  }
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
  }
  &-list {
    padding: 0 32px 48px;
    background: #8DC607;
    &-item {
      position: relative;
      padding: 40px 24px 48px;
      background: #428B42;
      border: 2px solid #A3D816;
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
      }
      .img-wrapper {
        margin-top: 32px;
        width: 100%;
        height: 426px;
        overflow: hidden;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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
        font-size: 36px;
        font-family: San Francisco Display;
        background: #DEF3CA;
        color: #195231;
        font-size: 44px;
        font-family: San Francisco Display;
        font-weight: bold;
        border-radius: 10px;
        @include elps();
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
</style>
