<template>
  <router-link :class="$style.coupon" tag="div" :to="{ name: 'CouponCenter' }">
    <div :class="$style.background">
      <div :class="$style.btnMiddle" v-if="type === 5" />
      <div :class="$style.title" v-if="data.otherValue > 0">
        {{ `- ${data.otherValue}人已领券 快来领取 -` }}
      </div>
      <div :class="$style.title" v-else>
        - 快来领取 -
      </div>
      <ul :class="$style.list" v-if="data.values.length">
        <template v-for="(item, i) of data.values">
          <li
            v-if="item.goodsInfo"
            :class="{
              [$style.listItem]: true,
              [$style.large]: data.values.length < 3,
              [$style.small]: data.values.length === 3
            }"
            :key="i"
          >
            <div :class="$style.listItemWrapper">
              <div :class="$style.price">
                ￥ <span :class="$style.number">{{ item.goodsInfo.amount }}</span>
              </div>
              <div>{{ `满${item.goodsInfo.useLimitAmount}减${item.goodsInfo.amount}` }}</div>
              <div :class="$style.date">
                {{ `${getDate(item.goodsInfo.useStartTime, 'MM/DD')}-${getDate(item.goodsInfo.useEndTime, 'MM/DD')}` }}
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </router-link>
</template>

<script>
import mixin from '../mixin.js'

export default {
  name: 'Coupon',
  mixins: [mixin],
  props: {
    data: {
      type: Object,
      default () {
        return { values: [] }
      }
    },
    type: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style module lang="scss">
  .coupon {
    margin-top: 32px;
    margin-bottom: 42px;

    .btn-middle {
      width: 520px;
      height: 78px;
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/button-middle.png") no-repeat center center;
      background-size: 100% auto;
      border-radius: 70px;
      margin: 48px auto 0;
    }

    .background {
      margin: 0 -24px 24px;
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/color-bar.png") no-repeat center bottom;
      background-size: 100% auto;
      box-shadow: 0 20px 20px #8A0108;
    }

    .title {
      padding: 12px 0 32px;
      font-size: 28px;
      line-height: 36px;
      color: #FFF;
      text-align: center;
    }

    .list {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding-bottom: 30px;

      &-item {
        height: 140px;
        font-size: 20px;
        color: #FFF;

        &.large {
          width: 346px;
          background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-coupon-large.png") no-repeat center center;
          background-size: 100% 100%;

          .number {
            font-size: 40px;
            margin-right: 6px;
          }
        }

        &.small {
          width: 220px;
          background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-coupon.png") no-repeat center center;
          background-size: 100% 100%;
        }

        &-wrapper {
          padding: 12px 10px 20px;
        }

        .price {
          font-size: 24px;
          margin-right: 6px;
        }

        .number {
          font-size: 32px;
          font-family: San Francisco Display;
          font-weight: bold;
        }

        .date {
          margin-top: 4px;
          font-family: San Francisco Display;
        }
      }
    }
  }
</style>
