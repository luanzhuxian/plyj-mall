<template>
  <div :class="$style.bestRecommend">
    <div :class="$style.btnBottom" />
    <div
      :class="$style.product"
      v-for="(item, i) of data.values"
      :key="i"
      @click="clickHandler(item)"
    >
      <div :class="$style.img" :style="{ backgroundImage: `url(${item.image})` }">
        <div :class="$style.typeBox">
          <div :class="$style.type" v-if="item.goodsInfo.productType === 'EXPERIENCE_CLASS'">
            体验课
          </div>
          <count-down :class="$style.countDown" size="small" v-if="item.goodsInfo.shoppingStatus === 1" :data="item.goodsInfo" :fields="{ end: 'shoppingTimeLong' }" />
        </div>

        <div :class="$style.howManyBuy">
          <pl-svg name="hot" />
          <span v-if="item.goodsInfo.salesVolume === 0">正在热销中</span>
          <template v-else-if="item.goodsInfo.salesVolume > 0 && item.goodsInfo.salesVolume < 10">
            <span>
              {{ item.goodsInfo.pageviews }}人关注
            </span>
          </template>
          <template v-else-if="item.goodsInfo.salesVolume >= 10">
            <span>
              {{ `${item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume}人${productTypeMap[item.goodsInfo.productType]}` }}
            </span>
          </template>
        </div>
      </div>

      <div :class="$style.content">
        <div :class="$style.name" v-text="item.goodsInfo.productName" />
        <Tags size="middle" :tags="item.goodsInfo.labelModels" />
        <div :class="$style.bottom">
          <div :class="$style.priceBox">
            <span>¥</span>
            <span v-text="getMinPrice(item.goodsInfo.productSkuModels)" />
            <del>
              ¥{{ getMaxOrinalPrice(item.goodsInfo.productSkuModels) }}
            </del>
          </div>
          <button>
            {{ `立即${productTypeMap[item.goodsInfo.productType]}` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Tags from '../../home/components/Tags.vue'
import CountDown from '../../../components/product/Count-Down.vue'
export default {
  name: 'BestRecommend',
  components: {
    Tags,
    CountDown
  },
  props: {
    data: {
      type: Object,
      default () {
        return {
          values: []
        }
      }
    }
  },
  data () {
    return {
      // 最小查看数量
      minSee: 10,
      productTypeMap: {
        'PHYSICAL_GOODS': '购买',
        'VIRTUAL_GOODS': '购买',
        'FORMAL_CLASS': '学习',
        'EXPERIENCE_CLASS': '报名'
      }
    }
  },
  computed: {
    ...mapGetters(['userId']),
    styleType () {
      return this.data.styleType || -1
    }
  },
  methods: {
    getMinPrice (skuList) {
      let priceList = skuList.filter(item => item.status === 1).map(item => item.price)
      return Math.min(...priceList)
    },
    getMinOrinalPrice (skuList) {
      let priceList = skuList.filter(item => item.status === 1).map(item => item.originalPrice)
      return Math.min(...priceList)
    },
    getMaxOrinalPrice (skuList) {
      let priceList = skuList.filter(item => item.status === 1).map(item => item.originalPrice)
      return Math.max(...priceList)
    },
    getMaxPrice (skuList) {
      let priceList = skuList.filter(item => item.status === 1).map(item => item.price)
      return Math.max(...priceList)
    },
    clickHandler (item) {
      this.$router.push({ name: 'Lesson', params: { productId: item.value, brokerId: this.userId || null } })
    }
  }
}
</script>

<style module lang="scss">
  .best-recommend {
    padding: 0 24px;
    color: #000;
  }
  .btn-bottom {
    width: 520px;
    height: 78px;
    background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/button-bottom.png") no-repeat center center;
    background-size: 100% auto;
    border-radius: 70px;
    margin: 48px auto 32px;
  }
  .product {
    position: relative;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
    .img {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      height: 470px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      > .type-box {
        width: 100%;
        padding: 18px 24px;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        > div {
          position: relative;
        }
        > .type {
          padding: 6px 24px;
          font-size: 28px;
          color: #fff;
          background-color: #F2B036;
          border-radius: 10px;
        }
      }
      .how-many-buy {
        position: absolute;
        bottom: 0;
        width: 100%;
        font-size: 28px;
        padding-left: 20px;
        padding-bottom: 16px;
        padding-top: 16px;
        color: #fff;
        background: linear-gradient(0, rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
        svg {
          width: 36px;
          vertical-align: -2px;
          path {
            box-shadow: 0 0 0 4px red;
          }
        }
      }
    }
  }
  .content {
    padding: 16px;
    .name {
      margin-bottom: 8px;
      font-size: 32px;
      line-height: 42px;
      font-weight: bold;
      color: #000;
      @include elps-wrap(2);
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .priceBox {
      > span {
        color: #fe7700;
        &:nth-of-type(1) {
          font-size: 28px;
        }
        &:nth-of-type(2) {
          font-size: 48px;
          font-weight: bold;
        }
      }
      > del {
        margin-left: 12px;
        font-size: 28px;
        color: #999;
      }
    }
    > button {
      padding: 12px 26px;
      font-size: 32px;
      color: #fff;
      background-color: #fe7700;
      border-radius: 8px;
    }
  }
</style>
