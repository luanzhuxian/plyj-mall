<template>
    <div :class="$style.best">
        <ul :class="$style.proList">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo"
                    :class="{
                        [$style.proItem]: true,
                        [$style.large]: (i === 0 && isOdd)
                    }"
                    :key="i"
                    @click="jump(item)"
                >
                    <div :class="$style.img">
                        <count-down
                            v-if="item.goodsInfo.shoppingStatus === 1"
                            :class="[(i === 0 && isOdd) ? $style.countDown : $style.countDown2]"
                            size="small"
                            :data="item.goodsInfo"
                            :fields="{ end: 'shoppingTimeLong' }"
                        />
                        <img v-imgError :src="item.image + '?x-oss-process=style/thum-middle'" v-img-error alt="">
                    </div>
                    <span v-if="item.goodsInfo.productType === 'EXPERIENCE_CLASS'" :class="$style.experience">体验课</span>
                    <div :class="$style.content">
                        <h4 :class="$style.proName" v-text="item.goodsInfo.productName" />
                        <div :class="$style.bottom">
                            <div :class="$style.priceBox">
                                <div :class="$style.price">
                                    <span v-text="getMinPrice(item.goodsInfo.productSkuModels)" />
                                </div>
                                <template v-if="item.goodsInfo.showSales">
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
                                </template>
                            </div>
                            <button>{{ `立即${productTypeMap[item.goodsInfo.productType]}` }}</button>
                        </div>
                    </div>
                </li>
            </template>
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
                PHYSICAL_GOODS: '购买',
                VIRTUAL_GOODS: '购买',
                FORMAL_CLASS: '学习',
                EXPERIENCE_CLASS: '报名'
            }
        }
    },
    computed: {
        isOdd () {
            return !!(this.data.values.length % 2)
        }
    },
    methods: {
        getMinPrice (skuList) {
            const priceList = skuList.filter(item => item.status === 1).map(item => item.price)
            return Math.min(...priceList)
        },
        getMaxPrice (skuList) {
            const priceList = skuList.filter(item => item.status === 1).map(item => item.price)
            return Math.max(...priceList)
        },
        jump (item) {
            this.$router.push({ name: 'Product', params: { productId: item.value } })
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
    &.large {
      width: 100%;
      .img {
        width: 100%;
        > img {
          width: 100%;
          height: 470px;
          object-fit: cover;
        }
      }
      .experience {
        padding: 6px 16px;
        font-size: 32px;
        line-height: 40px;
      }
      .content {
        height: auto;
        .pro-name {
          height: 72px;
          line-height: 36px;
          font-size: 28px;
        }
      }
    }
  }
  .img {
    position: relative;
    > img {
      width: 340px;
      height: 228px;
      object-fit: cover;
    }
  }
  .experience {
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 4px 12px;
    line-height: 32px;
    font-size: 24px;
    color: #fff;
    background-color: #F2B036;
    border-radius: 6px;
    z-index: 1;
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    box-sizing: border-box;
    height: 186px;
    .pro-name {
      height: 64px;
      font-weight: bold;
      font-size: 24px;
      line-height: 32px;
      color: #000;
      @include elps-wrap(2);
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
        &:before {
          content: '¥';
          margin-right: 3px;
          font-size: 20px;
          vertical-align: 3px;
        }
      }
      .how-many-buy {
        font-size: 20px;
        color: #fe7700;
      }
    }
  }

  .count-down {
    display: flex;
    width: 100%;
    bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .count-down2 {
    display: flex;
    width: 100%;
    bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
