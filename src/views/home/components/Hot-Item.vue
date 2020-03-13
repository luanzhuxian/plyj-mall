<template>
    <div :class="$style.hotItem">
        <div :class="$style.proBox">
            <template v-for="(item, i) of first">
                <div
                    v-if="item.goodsInfo"
                    :class="{
                        [$style.first]: true,
                        [$style.proItem]: true,
                        [$style.other]: i > 0
                    }"
                    :key="i"
                    @click="jump(item)"
                >
                    <div :class="$style.img">
                        <count-down
                            v-if="item.goodsInfo.shoppingStatus === 1"
                            :class="$style.countDown"
                            size="small"
                            :data="item.goodsInfo"
                            :fields="{ end: 'shoppingTimeLong' }"
                        />
                        <img :src="item.image + '?x-oss-process=style/thum-middle'" v-img-error alt="">
                    </div>
                    <div :class="$style.content">
                        <div :class="$style.proName" v-text="item.name" />
                        <tags
                            :class="$style.tags"
                            size="middle"
                            :tags="item.goodsInfo.labelModels"
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
                </div>
            </template>

            <div :class="$style.other" v-if="data.values.length > 0">
                <template v-for="(item, i) of this.data.values">
                    <div
                        v-if="item.goodsInfo"
                        :class="$style.proItem"
                        :key="i"
                        @click="jump(item)"
                    >
                        <div :class="$style.img">
                            <count-down v-if="item.goodsInfo.shoppingStatus === 1" :class="$style.countDown2" size="small" :data="item.goodsInfo" :fields="{ end: 'shoppingTimeLong' }" />
                            <img :src="item.image + '?x-oss-process=style/thum-middle'" alt="">
                        </div>
                        <div :class="$style.content">
                            <div :class="$style.proName" v-text="item.name" />
                            <tags
                                :class="$style.tags"
                                size="small"
                                :tags="item.goodsInfo.labelModels.slice(0, 2)"
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
                    </div>
                </template>
                <div v-if="data.values.length % 2 === 1" :class="$style.pro" />
            </div>
        </div>
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
        first () {
            /* eslint-disable */
      return this.data.values.splice(0, 1)
    },
    moduleName () {
      return this.data.moduleName
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
    jump (item) {
      let { type, value } = item
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
  .pro-item {
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
    width: 340px;
    margin-bottom: 20px;
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
    &.first {
      width: 100%;
      .img {
        width: 100%;
        position: relative;
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
  .other {
    display: flex;
    flex-wrap: wrap;
    margin-top: 22px;
    margin-bottom: -20px;
    justify-content: space-between;
  }
  .pro {
    width: 340px;
    margin-bottom: 20px;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/product-item.png") no-repeat center center;
    background-size: 115%;
    border-radius: 20px;
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
