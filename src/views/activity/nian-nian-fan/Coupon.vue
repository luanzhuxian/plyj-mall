<template>
    <div>
        <div :class="$style.coupon">
            <div :class="$style.couponTitle">
                <div :class="$style.couponTitleLeft">
                    <pl-svg name="icon-speaker-bb20d" width="26" height="26" />
                    您有优惠券可使用！
                </div>
                <div :class="$style.couponTitleRight">
                    <span>立即领取</span>
                    <pl-svg name="icon-right" width="26" height="26" fill="#7E6E4D" />
                </div>
            </div>
            <ul :class="$style.couponList" v-if="data.values.length">
                <template v-for="(item, i) of data.values">
                    <li
                        v-if="item.goodsInfo"
                        :class="{
                            [$style.couponListItem]: true,
                            [$style.large]: data.values.length === 1,
                            [$style.medium]: data.values.length === 2,
                            [$style.small]: data.values.length === 3
                        }"
                        :key="i"
                    >
                        <div :class="$style.couponListItemWrapper">
                            <div :class="$style.price">
                                ￥<span :class="$style.number">{{ item.goodsInfo.amount }}</span>
                            </div>
                            <div>
                                <div>{{ `满${item.goodsInfo.useLimitAmount}减${item.goodsInfo.amount}` }}</div>
                                <div :class="$style.date">
                                    <span v-if="data.values.length === 1">{{ `${getDate(item.goodsInfo.useStartTime, 'YYYY/MM/DD')}-${getDate(item.goodsInfo.useEndTime, 'YYYY/MM/DD')}` }}</span>
                                    <span v-else>{{ `${getDate(item.goodsInfo.useStartTime, 'MM/DD')}-${getDate(item.goodsInfo.useEndTime, 'MM/DD')}` }}</span>
                                </div>
                            </div>
                        </div>
                        <div :class="$style.couponListItemCover">
                            立即领取
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
import { getDate } from '../helper'

export default {
    name: 'Coupon',
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
    methods: {
        getDate
    }
}
</script>

<style module lang="scss">
  .coupon {
    background-color: #FFF;
    border-radius: 20px;
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    &-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      font-size: 24px;
      line-height: 64px;
      background: #FBEFD7;
      color: #7E6E4D;
      &-left {
        display: flex;
        align-content: center;
        font-size: 26px;
        font-family: Microsoft YaHei;
        color: #FF8533;
        letter-spacing: 2px;
        svg {
          margin-right: 6px;
        }
      }
    }
    &-list {
      display: flex;
      justify-content: space-around;
      padding: 24px 12px 40px;
      &-item {
        position: relative;
        box-sizing: border-box;
        padding: 10px;
        width: 214px;
        font-size: 20px;
        color: #F34436;
        background-color: #FBEFD7;
        border-radius: 10px;
        &.large {
          width: 570px;
          font-size: 28px;
          .coupon-list-item-wrapper {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding-right: 44px;
            height: 142px;
          }
          .price {
            font-size: 40px;
          }
          .number {
            font-size: 84px;
            margin-right: 6px;
          }
        }
        &.medium {
          width: 320px;
          .number {
            font-size: 40px;
            margin-right: 6px;
          }
        }
        &-wrapper {
          padding: 6px 12px 10px;
          border: 2px solid #F29E5E;
          border-style: dashed;
          border-radius: 10px;
        }
        &-cover {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 16px;
          width: 54px;
          background: #F6CE9A;
          border-radius: 0px 10px 10px 0px;
          font-size: 18px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 28px;
          color:#F34436;
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
