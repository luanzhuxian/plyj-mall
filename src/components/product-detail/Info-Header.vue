<template>
    <div :class="$style.infoHeader">
        <div :class="$style.priceLeft">
            <div :class="$style.price">
                <i v-text="minPrice" />
                <template v-if="minPrice !== maxPrice">
                    ~ <i v-text="maxPrice" />
                </template>
            </div>
            <div :class="$style.count" v-if="Number(detail.showSales) === 1">
                <del v-if="(minPrice !== maxPrice || maxOriginalPrice !== maxPrice) && maxOriginalPrice" v-text="maxOriginalPrice" />
                <span v-if="salesVolume === 0 && productStatus === 2">正在热销中</span>
                <template v-else-if="salesVolume > 0 && salesVolume < 10 || productStatus === 1">
                    <span v-text="pageviews" />人关注
                </template>
                <template v-else-if="salesVolume >= 10">
                    <span v-text="salesVolume" />人购买
                </template>
            </div>
        </div>
        <div :class="$style.priceRight" v-if="agentUser && (minRebate || maxRebate)">
            <p class="fz-22 gray-1">
                <span :class="$style.returnRunbi">
                    润笔
                </span>
                <i v-if="minRebate || (minRebate === 0)" class="rmb" v-text="minRebate" />
                <i v-if="(minRebate || (minRebate === 0)) && maxRebate && minRebate !== maxRebate">~</i>
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
    name: 'InfoHeader',
    props: {
        detail: {
            type: Object,
            default () {
                return {}
            }
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
        rebateList () {
            return this.skuList.map(item => Number(item.realRebate)) || []
        },
        maxRebate () {
            return this.rebateList.length ? Math.max(...this.rebateList) : 0
        },
        minRebate () {
            return this.rebateList.length ? Math.min(...this.rebateList) : 0
        },
        maxOriginalPrice () {
            return Math.max(...this.originalPriceList)
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

<style module lang="scss">
  .infoHeader {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: start;
  }
  .priceLeft {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
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
  .price {
    line-height: 48px;
    margin-bottom: 4px;
    color: #FE7700;
    font-size: 40px;
    &:before {
      content: '¥';
      font-size: 24px;
    }
  }
  .count {
    font-size: 24px;
    color: #999999;
    del {
      margin-right: 32px;
      &:before {
        content: '¥';
      }
    }
  }
</style>
