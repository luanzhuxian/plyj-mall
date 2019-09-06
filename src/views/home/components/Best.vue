<template>
  <div :class="$style.best">
    <div :class="$style.top">
      <span :class="$style.title" v-text="data.moduleName" />
    </div>
    <ul :class="$style.proList">
      <li
        :class="$style.proItem"
        v-for="(item, i) of data.values"
        :key="i"
        @click="clickHandler(item)"
      >
        <img :class="$style.img" :src="item.image" alt="">
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
                  {{ item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume }}人报名
                </span>
              </template>
            </div>
            <button> {{ item.goodsInfo.productType === 'FORMAL_CLASS' ? '立即学习' : '立即报名' }}</button>
          </div>
        </div>
      </li>
      <li v-if="data.values.length % 2 === 1" :class="$style.pro + ' ' + $style.proItem" />
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Best',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['agentUser', 'userId'])
  },
  methods: {
    getMinPrice (skuList) {
      let priceList = skuList.map(item => item.price)
      return Math.min(...priceList)
    },
    getMaxPrice (skuList) {
      let priceList = skuList.map(item => item.price)
      return Math.max(...priceList)
    },
    clickHandler (item) {
      this.$router.push({ name: 'Lesson', params: { productId: item.value, brokerId: this.userId || null } })
    }
  }
}
</script>

<style module lang="scss">
  .best {
    padding: 24px;
    background-color: #f4f5f9;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .title {
      position: relative;
      font-size: 36px;
      font-weight: bold;
    }
  }
  .pro-list {
    display: grid;
    grid-template-columns: 340px 340px;
    grid-gap: 22px;
    margin-top: 20px;
  }
  .pro-item {
    position: relative;
    width: 340px;
    border-radius: 20px;
    overflow: hidden;
    background-color: #fff;
    .img {
      width: 340px;
      height: 228px;
      object-fit: cover;
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
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/img/product-item.png") no-repeat center center;
    background-size: 115%;
    border-radius: 20px;
  }
</style>
