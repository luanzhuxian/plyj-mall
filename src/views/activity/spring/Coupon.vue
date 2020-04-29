<template>
    <router-link :class="$style.coupon" tag="div" :to="{ name: 'CouponCenter' }">
        <div :class="$style.bg">
            <div :class="$style.couponTitle">
                购物先领券 就要划算
            </div>
            <div :class="$style.couponSubtitle">
                {{ data.otherValue > 0 ? `${data.otherValue}人已领券 快来领取` : '快来领取' }}
            </div>
            <div :class="$style.couponButton">
                <img src="https://mallcdn.youpenglai.com/static/mall/icons/olds/envelope.png" style="width: 3.73vw;" alt="">
                <span :class="$style.text">优惠券中心</span>
                <span :class="$style.btn">
                    <span>领取更多</span>
                    <pl-svg name="icon-right" fill="#FFE9BE" width="20" />
                </span>
            </div>
            <ul :class="$style.couponList" v-if="data.values.length">
                <template v-for="(item, i) of data.values">
                    <li
                        v-if="item.goodsInfo"
                        :class="$style.couponListItem"
                        :key="i"
                    >
                        <div :class="$style.left">
                            <span :class="$style.number">{{ item.goodsInfo.amount }}</span>
                        </div>
                        <div :class="$style.middle">
                            <b :class="$style.main">
                                <span v-if="item.goodsInfo.couponType === 1">满减券</span>
                                <span v-if="item.goodsInfo.couponType === 2">品类券</span>
                            </b>
                            <p :class="$style.sub">
                                {{ `满${item.goodsInfo.useLimitAmount}减${item.goodsInfo.amount}` }}
                            </p>
                            <p :class="$style.date">
                                {{ `(有效期至${getDate(item.goodsInfo.useEndTime, 'YYYY.MM.DD')})` }}
                            </p>
                        </div>
                        <div :class="$style.right" @click.stop="getCoupon(item)">
                            免费领取
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </router-link>
</template>

<script>
import { receiveCoupon } from '../../../apis/my-coupon'
import { getDate } from '../helper.js'

let isClickable = false

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
        getDate,
        async getCoupon ({ goodsInfo = {} }) {
            const { id } = goodsInfo
            if (isClickable) return
            if (!id) return
            isClickable = true
            try {
                await receiveCoupon({ couponId: id })
                this.$success('领取成功！')
            } catch (e) {
                throw e
            } finally {
                setTimeout(() => (isClickable = false), 500)
            }
        }
    }
}
</script>

<style lang="scss" module>
  .coupon {
    background: #EF5B3F;
    box-shadow: 0px 16px 24px rgba(121, 30, 5, 0.2);
    border-radius: 20px;
    overflow: hidden;
    .bg {
      padding: 20px 28px 28px;
      background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/fa1c99ec-c614-4b87-a713-6d0def781e20.png") no-repeat center top;
      background-size: 100% auto;
    }
    &-title {
      font-size: 40px;
      font-weight: 800;
      color: #FFF9ED;
      text-align: center;
      letter-spacing: 4px;
    }
    &-subtitle {
      margin-top: 10px;
      font-size: 28px;
      color: #FFF9ED;
      text-align: center;
      letter-spacing: 2px;
    }
    &-button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 52px;
      font-size: 24px;
      color: #FFE9BE;
      line-height: 38px;
      .text {
        margin-left: 5px;
      }
      .btn {
        box-sizing: border-box;
        margin-left: 12px;
        width: 162px;
        height: 42px;
        border: 2px solid #FFE9BE;
        border-radius: 100px;
        font-weight: 800;
        text-align: center;
      }
    }
    &-list {
      margin-top: 20px;
      &-item {
        display: flex;
        align-items: center;
        margin-top: 32px;
        background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/c775af74-0fa4-4506-8bb2-8623c58bc5fd.png") no-repeat center;
        background-size: 100%;
        height: 180px;
        padding: 0 36px 0 20px;
        text-align: center;
        :nth-of-type(1) {
          margin: 0;
        }
        .left {
          width: 174px;
          font-size: 44px;
          font-family: San Francisco Display;
          font-weight: bold;
          color: #E72441;
          @include elps();
          &:after {
            content: '元';
            font-size: 30px;
            font-weight: bold;
          }
        }
        .middle {
          flex: 1;
          width: 0;
          padding-left: 24px;
          text-align: left;
          font-size: 24px;
          font-family: Microsoft YaHei;
          color: #EC535B;
          > .main {
            font-size: 32px;
            color: #E72441;
          }
          > .sub {
            margin-top: 4px;
            color: #EC535B;
          }
          >.date {
            margin-top: 10px;
            color: #F19874;
          }
        }
        .right {
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 38px;
          width: 138px;
          height: 132px;
          font-size: 28px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #FFFFFF;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
  }
</style>
