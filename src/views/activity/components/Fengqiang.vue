<template>
  <router-link :class="$style.fengqiang" tag="div" :to="{ name: '' }">
    <div
      :class="{
        [$style.background]: true,
        [$style.bg1]: type === 5,
        [$style.bg2]: type === 6,
        [$style.bg3]: type === 7
      }"
    >
      <div :class="$style.wrapper">
        <ul :class="$style.list" v-if="data.values.length">
          <li
            :class="{
              [$style.listItem]: true,
              [$style.large]: data.values.length % 2 === 1,
              [$style.small]: data.values.length % 2 === 0
            }"
            v-for="(item, i) of data.values"
            :key="i"
          >
            <div :class="$style.imgWrapper">
              <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-small'">
            </div>
            <div :class="$style.itemInfo" v-if="type === 5 || type === 7">
              <h4>{{ item.goodsInfo.productName }}</h4>
              <div :class="$style.infoText">
                <pl-icon name="icon-fengqiangjia" type="svg" />
                <span :class="$style.price">
                  {{ item.goodsInfo && item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('price') }}
                </span>
                <span :class="$style.pay">
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
                <div :class="$style.middle">
                  <div :class="$style.middleMain">
                    双十二狂欢
                  </div>
                  <span :class="$style.middleSub">
                    领券价
                  </span>
                </div>
                <div :class="$style.btn">
                  马上抢！
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'Fengqiang',
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
    return {}
  },
  methods: {
    getPrice (list) {
      return (key) => {
        let arr = list.map(item => item[key])
        return key === 'originalPrice' ? Math.max(...arr) : Math.min(...arr)
      }
    }
  }
}
</script>

<style module lang="scss">
  .fengqiang {
    margin-top: 32px;
    background: linear-gradient(180deg, rgba(242, 183, 164, 1) 0%, rgba(228, 89, 83, 1) 12%, rgba(228, 87, 80, 1) 100%);
    border-radius: 20px;
    overflow: hidden;
    .background {
      &.bg-1 {
        background: url("../../../assets/images/activity/bg-qiang-1.png") no-repeat center top;
        background-size: 100% auto;
      }
      &.bg-2 {
        background: url("../../../assets/images/activity/bg-qiang-2.png") no-repeat center top;
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
              margin-right: 24px !important;
              padding: 0 16px;
              font-size: 64px !important;
              font-family: San Francisco Display !important;
              font-weight: bold !important;
              color: #FFFF00 !important;
              &::before {
                content: '￥';
                font-size: 40px;
                font-family: Microsoft YaHei;
                font-weight: bold;
              }
            }
            .middle {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              color: #FFFFFF;
              &-main {
                margin-bottom: 8px;
                line-height: 1;
                font-size: 26px;
                font-family: Microsoft YaHei;
                font-weight: bold;
              }
              &-sub {
                padding: 0 12px;
                height: 32px;
                line-height: 32px;
                background: #D5193A;
                border-radius: 20px;
                font-size: 22px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                text-align: center;
              }
            }
            .btn {
              margin-left: auto;
              width: 160px;
              height: 92px;
              line-height: 92px;
              background-color: #FFFF00;
              color: #FE3C5E;
              font-size: 32px;
              font-weight: bold;
              text-align: center;
            }
          }
        }
      }
      &.bg-3 {
        background: url("../../../assets/images/activity/bg-qiang-3.png") no-repeat center top;
        background-size: 100% auto;
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
            // line-height: 52px;
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
        // .icon-fengqiangjia,
        // .icon-fanchangjia {
        //   margin-right: 8px;
        //   font-size: 24px;
        //   color: #FE3C5E;
        // }
        // .icon-mashangqiang,
        // .icon-lijigoumai {
        //   font-size: 34px;
        //   color: #ffffff;
        // }
      }
    }
  }
</style>
