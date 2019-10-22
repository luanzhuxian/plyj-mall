<template>
  <div class="tuan">
    <div v-if="detail.preActivity === 1">
      <div class="price"><span>{{ detail.activityProductModel.price }}</span></div>
      <div class="pro-info">
        <div class="original">原价：<del v-if="(minPrice !== maxPrice || maxOriginalPrice !== maxPrice) && maxOriginalPrice" v-text="maxOriginalPrice" /></div>
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
      font-size: 26px;
      color: #999999;
      margin-right: 32px;
      .text{
        margin-right: 10px;
        font-size: 24px;
      }
      del {
        &:before {
          content: '¥';
        }
      }
    }
    .buy-num{
      font-size: 26px;
    }
    .join{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 360px;
      font-size: 26px;
      color: #999999;
      ul{
        display: flex;
        align-items: center;
        .avatar{
          width: 48px;
          height: 48px;
          margin-left: -18px;
          img{
            width: 48px;
            height: 48px;
          }
        }
      }
    }
  }
</style>
