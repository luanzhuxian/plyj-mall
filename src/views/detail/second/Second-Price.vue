<template>
  <div class="tuan">
    <div v-if="detail.preActivity === 1">
      <div class="price"><span><i v-text="minPrice" />
        <template v-if="minPrice !== maxPrice">
          ~ <i v-text="maxPrice" />
        </template></span></div>
      <div class="pro-info">
        <div class="original" v-if="(minPrice !== maxPrice || maxOriginalPrice !== maxPrice) && maxOriginalPrice">原价：<del v-text="maxOriginalPrice" /></div>
        <div class="buy-num">{{ detail.salesVolume }}人已购买</div>
      </div>
    </div>
    <div class="priceRight" v-if="agentUser && (minRebate || maxRebate) && detail.preActivity !== 2">
      <p class="fz-22 gray-1">
        <span class="returnRunbi">
          润笔
        </span>
        <i v-if="minRebate" class="rmb" v-text="minRebate" />
        <i v-if="minRebate && maxRebate && minRebate !== maxRebate">~</i>
        <i v-if="maxRebate && minRebate !== maxRebate" v-text="maxRebate" />
      </p>
      <p class="fz-22 gray-3">
        分享下单即可获得润笔
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SecondPrice',
  props: {
    detail: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters(['agentUser']),
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
    },
    rebateList () {
      return this.skuList.filter(item => Number(item.realRebate) !== 0).map(item => item.realRebate) || []
    },
    maxRebate () {
      return this.rebateList.length ? Math.max(...this.rebateList) : 0
    },
    minRebate () {
      return this.rebateList.length ? Math.min(...this.rebateList) : 0
    },
    productStatus () {
      return this.detail.productStatus
    },
    salesVolume () {
      return this.detail.salesVolume
    },
    pageviews () {
      return this.detail.pageviews
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
    .priceRight {
      flex: 1;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
      margin-top: 5px;
      > p {
        margin-top: 6px;
      }
      .returnRunbi {
        display: inline-block;
        width: 60px;
        height: 28px;
        line-height: 28px;
        margin-right: 10px;
        text-align: center;
        color: #fff;
        font-size: 18px;
        background-color: #FE7700;
        border-radius: 13px;
      }
    }
  }
</style>
