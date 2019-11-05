<template>
  <div :class="$style.yugou">
    <div :class="$style.background">
      <div :class="$style.wrapper">
        <div :class="$style.navBar">
          <router-link :class="$style.navLink" tag="div" :to="{ name: 'BookList' }">
            <span>查看更多</span>
            <pl-icon name="icon-arrow-right" size="20" />
          </router-link>
        </div>
        <ul :class="$style.list" v-if="data.values.length">
          <li
            :class="$style.listItem"
            v-for="(item, i) of data.values"
            :key="i"
            @click="$router.push({ name: 'Lesson', params: { productId: item.goodsInfo.id } })"
          >
            <div :class="$style.time">
              <div :class="$style.timeLeft" v-if="item.goodsInfo.activityInfo && item.goodsInfo.activityInfo.status === 0">
                距开始
              </div>
              <div :class="$style.timeLeft" v-if="item.goodsInfo.activityInfo && item.goodsInfo.activityInfo.status === 1">
                距结束
              </div>
              <div :class="$style.timeLeft" v-if="item.goodsInfo.activityInfo && item.goodsInfo.activityInfo.status === 2">
                已结束
              </div>
              <div :class="$style.timeRight" v-if="item.goodsInfo.activityInfo && ~[0, 1].indexOf(item.goodsInfo.activityInfo.status)">
                <count-down
                  :timestamp="getTime(item.goodsInfo.activityInfo)"
                  color="#DB4D7D"
                  size="mini"
                  @done="() => item.goodsInfo.activityInfo.status += 1"
                />
              </div>
            </div>
            <div :class="$style.listItemWrapper">
              <div :class="$style.imgWrapper">
                <img :src="item.goodsInfo.productMainImage">
              </div>
              <div :class="$style.info">
                <div :class="$style.main">
                  {{ item.goodsInfo.productName }}
                </div>
                <div :class="$style.sub1">
                  <span v-if="item.goodsInfo && item.goodsInfo.activityInfo">{{ `预交定金￥${item.goodsInfo.activityInfo.price}` }}</span>
                  <span v-if="item.goodsInfo && item.goodsInfo.activityInfo && item.goodsInfo.activityInfo.activityPrice">{{ `抵￥${item.goodsInfo.activityInfo.activityPrice}` }}</span>
                </div>
                <div :class="$style.sub2">
                  {{ `双十二价位：${item.goodsInfo && item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('price')}元` }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '../mixin.js'
import CountDown from './Count-Down.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Yugou',
  mixins: [mixin],
  components: {
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
    return {}
  },
  computed: {
    ...mapGetters(['userId'])
  }
}
</script>

<style module lang="scss">
  .yugou {
    margin-top: 32px;
    // background: linear-gradient(180deg, rgba(255, 114, 199, 1) 0%, rgba(213, 97, 167, 1) 12%, rgba(213, 55, 151, 1) 100%);
    background: #d53796;
    border-radius: 20px;
    overflow: hidden;
    .background {
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-yugou.jpg") no-repeat center top;
      background-size: 100% auto;
    }
    .wrapper {
      padding: 0 20px 48px;
    }
    .nav-bar {
      padding: 42px 0 46px;
      display: flex;
      justify-content: flex-end;
    }
    .nav-link {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 184px;
      height: 52px;
      line-height: 52px;
      text-align: center;
      background: #FFF;
      border-radius: 292px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 800;
      color: #D661A8;
      i {
        margin-left: 8px;
        font-weight: bold;
      }
    }
    .list {
      position: relative;
      &-item {
        margin-bottom: 20px;
        padding: 20px 16px 16px;
        background: #FFF;
        border-radius: 20px;
        overflow: hidden;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
        &-wrapper {
          display: flex;
        }
        .time {
          display: inline-flex;
          align-items: center;
          text-align: center;
          margin-bottom: 14px;
          // width: max-content;
          height: 34px;
          line-height: 34px;
          border: 2px solid #EC6BA4;
          border-radius: 4px;
          overflow: hidden;
          &-left {
            width: 94px;
            font-size: 24px;
            color: #FFF;
            background: #FF6767;
            overflow: hidden;
          }
          &-right {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 120px;
            font-size: 24px;
            font-family: San Francisco Display;
            color: #DB4D7D;
          }
        }
        .img-wrapper {
          margin-right: 20px;
          width: 264px;
          height: 176px;
          border-radius: 20px;
          overflow: hidden;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .info {
          flex: 1;
          width: 0;
          line-height: 36px;
        }
        .main {
          margin-bottom: 18px;
          height: 76px;
          font-size: 28px;
          font-weight: bold;
          color: #333333;
          @include elps-wrap(2);
          text-align: justify;
        }
        .sub-1 {
          margin-bottom: 8px;
          height: 36px;
          font-size: 24px;
          font-family: San Francisco Display;
          color: #EA618E;
          letter-spacing: 1.2px;
          @include elps();
        }
        .sub-2 {
          font-size: 28px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #EA618E;
          @include elps();
        }
      }
    }
  }
</style>
