<template>
  <div
    :class="{
      [$style.fengqiang]: true,
      [$style.bg1]: type === 5,
      [$style.bg2]: type === 6,
      [$style.bg3]: type === 7
    }"
  >
    <div :class="$style.background">
      <div :class="$style.wrapper">
        <ul :class="$style.list" v-if="data.values.length">
          <template v-for="(item, i) of data.values">
            <li
              v-if="item.goodsInfo"
              :class="{
                [$style.listItem]: true,
                [$style.large]: data.values.length % 2 === 1,
                [$style.small]: data.values.length % 2 === 0
              }"
              :key="i"
              @click="$router.push({ name: 'Lesson', params: { productId: item.goodsInfo.id } })"
            >
              <div :class="$style.imgWrapper">
                <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
              </div>
              <div :class="$style.itemInfo" v-if="type === 5 || type === 7">
                <h4>{{ item.goodsInfo.productName }}</h4>
                <div :class="$style.infoText">
                  <pl-icon name="icon-fengqiangjia" type="svg" />
                  <span :class="$style.price">
                    {{ item.goodsInfo && item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('price') }}
                  </span>
                  <span :class="$style.pay" v-if="item.goodsInfo.salesVolume < 10">
                    {{ item.goodsInfo.pageviews }}人关注
                  </span>
                  <span :class="$style.pay" v-else>
                    {{ `${item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume}` }}人付款
                  </span>
                  <div :class="$style.btnHighlight">
                    <pl-icon name="icon-mashangqiang" type="svg" />
                  </div>
                </div>
              </div>
              <div :class="$style.itemInfo" v-if="type === 6">
                <h4>{{ item.goodsInfo.productName }}</h4>
                <div :class="$style.infoText">
                  <span :class="$style.price">
                    {{ item.goodsInfo && item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('price') }}
                  </span>
                  <div :class="$style.tag" v-if="coupon && coupon.useLimitAmount && coupon.amount">
                    {{ `满${coupon.useLimitAmount}减${coupon.amount}` }}
                  </div>
                  <div :class="$style.btn">
                    马上抢！
                  </div>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '../mixin.js'
import { getMaxCoupon } from '../../../apis/home'

export default {
  name: 'Fengqiang',
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
  },
  data () {
    return {
      coupon: {}
    }
  },
  created () {
    getMaxCoupon().then(({ result }) => {
      this.coupon = result
    })
  }
}
</script>

<style module lang="scss">
  .fengqiang {
    margin-top: 32px;
    background: linear-gradient(180deg, rgba(242, 183, 164, 1) 0%, rgba(228, 89, 83, 1) 12%, rgba(228, 87, 80, 1) 100%);
    border-radius: 20px;
    overflow: hidden;
    &.bg-1 > .background {
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-qiang-1.jpg") no-repeat center top;
      background-size: 100% auto;
    }
    &.bg-3 > .background {
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-qiang-3.jpg") no-repeat center top;
      background-size: 100% auto;
    }
    &.bg-2 {
      background: #FF0B00 !important;
      .background {
        background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-qiang-2.jpg") no-repeat center top;
        background-size: 100% auto;
        .wrapper {
          padding-top: 188px;
        }
        .list-item > .item-info {
          padding: 0!important;
          h4 {
            margin: 0 !important;
            padding: 0 16px;
            height: 68px !important;;
            line-height: 68px !important;;
            background-color: #FDFEFB;
          }
          .info-text {
            align-items: center !important;
            height: 92px;
            line-height: 92px;
            background-color: #FE3C5E;
            .price {
              margin: 0 !important;
              padding: 0 16px;
              font-size: 44px !important;
              font-family: San Francisco Display !important;
              font-weight: bold !important;
              color: #FFFF00 !important;
              &::before {
                content: '￥';
                font-size: 22px;
                font-family: Microsoft YaHei;
                font-weight: bold;
              }
            }
            .tag {
              padding: 0 8px;
              height: 40px;
              line-height: 40px;
              background: #D5193A;
              border-radius: 4px;
              font-size: 28px;
              font-family: Microsoft YaHei;
              color: #FFFFFF;
            }
            .btn {
              margin-left: auto;
              padding-left: 40px;
              width: 180px;
              height: 92px;
              line-height: 92px;
              color: #FE3C5E;
              font-size: 32px;
              font-weight: bold;
              text-align: center;
              background: linear-gradient(135deg, transparent 32px, #FFFF00 0) top left,
                          linear-gradient(-135deg, transparent 0px, #FFFF00 0) top right,
                          linear-gradient(-45deg, transparent 0px, #FFFF00 0) bottom right,
                          linear-gradient(45deg, transparent 32px, #FFFF00 0) bottom left;
              background-size: 51% 51%;
              background-repeat: no-repeat;
              overflow: hidden;
            }
          }
        }
      }
    }
    .wrapper {
      padding: 140px 20px 48px;
    }
    .list {
      &-item {
        margin-top: 20px;
        background-color: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        &:first-of-type {
          margin-top: 0;
        }
        .img-wrapper {
          width: 100%;
          height: 444px;
          overflow: hidden;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-info {
          padding: 16px;
          > h4 {
            margin-bottom: 16px;
            height: 1;
            line-height: 44px;
            font-size: 32px;
            font-weight: 600;
            color: #000000;
            @include elps();
          }
          .info-text {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 22px;
            color: #999999;
            @include elps();
            svg {
              width: 78px;
              min-width: 78px;
              height: 34px;
              padding-bottom: 4px;
            }
            .price {
              margin: 0 16px 0 8px;
              font-size: 44px;
              font-family: Helvetica;
              font-weight: bold;
              color: #FE3C5E;
              @include elps();
              &::before {
                content: '¥';
                font-size: 22px;
                font-weight: 600;
                line-height: 32px;
              }
            }
            .pay {
              padding-bottom: 4px;
            }
            .btn-highlight {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: auto;
              background: linear-gradient(225deg, rgba(238, 144, 111, 1) 0%, rgba(233, 70, 115, 1) 100%);
              border-radius: 8px;
              padding: 8px 22px;
              svg {
                width: 118px;
                height: 46px;
              }
            }
          }
        }
      }
    }
  }
</style>
