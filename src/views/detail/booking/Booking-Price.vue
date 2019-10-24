<template>
  <div class="tuan">
    <div>
      <div class="price">定金 <span>{{ detail.activityProductModel.price }}</span> <div class="deposit" v-if="detail.activityProductModel.multiple === 1">抵 <span>{{ detail.activityProductModel.depositTotal }}</span></div></div>
      <div class="pro-info">
        <div class="original">原价：<del :class="$style.original" v-if="(minPrice !== maxPrice || maxOriginalPrice !== maxPrice) && maxOriginalPrice" v-text="maxOriginalPrice" /></div>
        <div class="buy-num">{{ detail.salesVolume }}人已购买</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TogetherPrice',
  props: {
    detail: {
      type: Object,
      default: null
    }
  },
  computed: {
    skuList () {
      return this.detail.productSkuModels || []
    },
    priceList () {
      return this.skuList.map(item => item.price) || []
    },
    originalPriceList () {
      return this.skuList.map(item => item.originalPrice) || []
    },
    maxPrice () {
      return Math.max(...this.priceList)
    },
    minPrice () {
      return Math.min(...this.priceList)
    },
    maxOriginalPrice () {
      return Math.max(...this.originalPriceList)
    }
  }
}
</script>

<style lang="scss" scoped>
  .tuan{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 14px;
    .price {
      line-height: 48px;
      margin-bottom: 4px;
      color: #FE7700;
      font-size: 30px;
      display: flex;
      align-items: center;
      .deposit{
        margin-left: 10px;
      }
      span {
        font-size: 48px;
        &:before {
          content: '¥';
          font-size: 24px;
        }
      }
    }
    .pro-info{
      display: flex;
      color: #999999;
    }
    .original{
      display: flex;
      font-size: 24px;
      color: #999999;
      margin-right: 32px;
      .text{
        margin-right: 10px;
      }
      del {
        &:before {
          content: '¥';
        }
      }
    }
    .buy-num{
      font-size: 24px;
    }
  }
</style>
