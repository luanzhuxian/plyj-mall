<template>
  <div :class="$style.best">
    <ul :class="$style.proList">
      <template v-for="(item, i) of data.values">
        <li
          v-if="item.goodsInfo"
          :class="$style.proItem"
          :key="i"
          @click="clickHandler(item)"
        >
          <div :class="$style.img">
            <count-down :class="$style.countDown" size="small" v-if="item.goodsInfo.shoppingStatus === 1" :data="item.goodsInfo" :fields="{ end: 'shoppingTimeLong' }" />
            <img :src="item.image + '?x-oss-process=style/thum-middle'" alt="">
          </div>

          <span v-if="item.goodsInfo.productType === 'EXPERIENCE_CLASS'" :class="$style.experience">体验课</span>
          <div :class="$style.itemContent">
            <p :class="$style.proName" v-text="item.goodsInfo.productName" />
            <div :class="$style.bottom">
              <div :class="$style.priceBox">
                <div :class="$style.price">
                  <span>¥</span>
                  <span v-text="getMinPrice(item.goodsInfo.productSkuModels)" />
                </div>
                <span :class="$style.howManyBuy" v-if="item.goodsInfo.salesVolume === 0">正在热销中</span>
                <template v-else-if="item.goodsInfo.salesVolume > 0 && item.goodsInfo.salesVolume < 10">
                  <span :class="$style.howManyBuy">
                    {{ item.goodsInfo.pageviews }}人关注
                  </span>
                </template>
                <template v-else-if="item.goodsInfo.salesVolume >= 10">
                  <span :class="$style.howManyBuy">
                    {{ `${item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume}人${productTypeMap[item.goodsInfo.productType]}` }}
                  </span>
                </template>
              </div>
              <button>{{ `立即${productTypeMap[item.goodsInfo.productType]}` }}</button>
            </div>
          </div>
        </li>
      </template>

      <li v-if="data.values.length % 2 === 1" :class="$style.pro + ' ' + $style.proItem" />
    </ul>
  </div>
</template>

<script>
import CountDown from '../../../components/product/Count-Down.vue'

export default {
  name: 'Best',
  components: {
    CountDown
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      productTypeMap: {
        'PHYSICAL_GOODS': '购买',
        'VIRTUAL_GOODS': '购买',
        'FORMAL_CLASS': '学习',
        'EXPERIENCE_CLASS': '报名'
      }
    }
  },
  methods: {
    getMinPrice (skuList) {
      let priceList = skuList.filter(item => item.status === 1).map(item => item.price)
      return Math.min(...priceList)
    },
    getMaxPrice (skuList) {
      let priceList = skuList.filter(item => item.status === 1).map(item => item.price)
      return Math.max(...priceList)
    },
    clickHandler (item) {
      this.$router.push({ name: 'Lesson', params: { productId: item.value } })
    }
  }
}
</script>

<style module lang="scss">
  .pro-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: -20px;
  }
  .pro-item {
    position: relative;
    width: 340px;
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 20px;
    background-color: #fff;
    .img {
      position: relative;
      > img {
        width: 340px;
        height: 228px;
        object-fit: cover;
      }
      > .countDown {
        display: flex;
        width: 100%;
        bottom: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }
  .experience {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 100px;
    font-size: 24px;
    text-align: center;
    color: #fff;
    line-height: 42px;
    background-color: #F2B036;
    border-radius: 6px;
    z-index: 1;
  }
  .item-content {
    padding: 16px;
    box-sizing: border-box;
    .pro-name {
      height: 72px;
      font-weight: bold;
      font-size: 24px;
      line-height: 36px;
      color: #000;
      @include elps-wrap(2);
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    > button {
      width: 124px;
      height: 48px;
      font-size: 26px;
      color: #fff;
      background-color: #fe7700;
      border-radius: 8px;
    }
  }
  .price-box {
    .price {
      font-size: 32px;
      font-weight: bold;
      color: #fe7700;
      span:nth-of-type(1) {
        font-size: 20px;
      }
    }
    .how-many-buy {
      font-size: 20px;
      color: #fe7700;
    }
  }
  .pro {
    width: 340px;
    height: 413px;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/product-item.png") no-repeat center center;
    background-size: 115%;
    border-radius: 20px;
  }
</style>
