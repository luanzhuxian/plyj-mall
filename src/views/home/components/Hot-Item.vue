<template>
    <div :class="$style.hotItem">
        <ul :class="$style.proList">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo"
                    :class="{
                        [$style.proItem]: true,
                        [$style.large]: i === 0 && isOdd
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
                    <div :class="$style.content">
                        <div :class="$style.proName" v-text="item.name" />
                        <tags
                            :class="$style.tags"
                            :size="(i === 0 && isOdd) ? 'middle' : 'small'"
                            :tags="(i === 0 && isOdd) ? item.goodsInfo.labelModels : item.goodsInfo.labelModels.slice(0, 2)"
                        />
                        <div :class="$style.proPrice">
                            <div :class="$style.price">
                                <span v-text="getMinPrice(item.goodsInfo.productSkuModels)" />
                            </div>
                            <span :class="$style.howManyPay" v-if="item.goodsInfo.salesVolume === 0">正在热销中</span>
                            <template v-else-if="item.goodsInfo.salesVolume > 0 && item.goodsInfo.salesVolume < 10">
                                <span :class="$style.howManyPay">
                                    {{ item.goodsInfo.pageviews }}人关注
                                </span>
                            </template>
                            <template v-else-if="item.goodsInfo.salesVolume >= 10">
                                <span :class="$style.howManyPay">
                                    {{ item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume }}人付款
                                </span>
                            </template>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
import Tags from './Tags.vue'
import CountDown from '../../../components/product/Count-Down.vue'

export default {
    name: 'HotItem',
    components: {
        Tags,
        CountDown
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {
        }
    },
    computed: {
        isOdd () {
            return !!(this.data.values.length % 2)
        },
        moduleName () {
            return this.data.moduleName
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
            const { type, value } = item
            if (type === 1) {
                this.$router.push({ name: 'Classify', params: { optionId: value || null } })
            } else {
                this.$router.push({ name: 'Product', params: { productId: value } })
            }
        }
    }
}
</script>

<style module lang="scss">
  .pro-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: -20px;
    justify-content: space-between;
  }
  .pro-item {
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
    width: 340px;
    margin-bottom: 20px;
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
      .content {
        height: auto;
        .pro-name {
          margin-bottom: 14px;
          height: 36px;
          -webkit-line-clamp: 1;
        }
      }
      .how-many-pay {
        font-size: 24px !important;
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
  .content {
    box-sizing: border-box;
    height: 202px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    .pro-name {
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: bold;
      line-height: 36px;
      @include elps-wrap(2);
    }
    .tags {
      margin-bottom: 16px;
    }
    .pro-price {
      margin-top: auto;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      .price {
        span {
          display: inline-block;
          color: #FE7700;
          font-size: 40px;
          line-height: 36px;
          font-weight: bold;
          &:before {
            content: '¥';
            margin-right: 3px;
            font-size: 24px;
            vertical-align: 3px;
          }
        }
      }
      .how-many-pay {
        display: inline-block;
        font-size: 20px;
        color: #999;
        vertical-align: -4px;
      }
    }
  }
  .count-down {
    top: 16px;
    left: 20px;
  }
  .count-down2 {
    display: flex;
    width: 100%;
    bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
