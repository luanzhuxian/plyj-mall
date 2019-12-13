<template>
  <div :class="$style.bestRecommend">
    <ul>
      <template v-for="(item, i) of data.values">
        <li
          v-if="item.goodsInfo"
          :class="$style.product"
          :key="i"
          @click="clickHandler(item)"
        >
          <div :class="$style.img" :style="{ backgroundImage: `url(${item.goodsInfo.productMainImage})` }">
            <div :class="$style.typeBox">
              <div :class="$style.type" v-if="item.goodsInfo.productType === 'EXPERIENCE_CLASS'">
                体验课
              </div>
              <count-down
                v-if="item.goodsInfo.shoppingStatus === 1"
                :class="$style.countDown"
                size="small"
                :data="item.goodsInfo"
                :fields="{ end: 'shoppingTimeLong' }"
              />
            </div>
            <div :class="$style.howManyBuy">
              <pl-svg name="icon-hot" height="40" fill="#FFF" />
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
            <Tags
              :class="$style.tags"
              size="middle"
              :tags="item.goodsInfo.labelModels"
            />
            <div :class="$style.bottom">
              <slot name="price" :price="getMinPrice(item.goodsInfo.productSkuModels)" v-if="$scopedSlots.price" />
              <div :class="$style.priceBox" v-else>
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
        </li>
      </template>
    </ul>
    <!-- 瀑布流 -->
    <!-- <div v-if="styleType === 1" :class="$style.waterfallBox">
      <ul
        :class="$style.waterfall"
        v-if="listLeft.length"
      >
        <li
          v-for="(item, i) of listLeft"
          :key="i"
          :class="{
            [$style.item]: true,
            [$style.long]: i % 2 === 1
          }"
          @click="clickHandler(item)"
        >
          <div :class="$style.topImg">
            <img :src="item.image" alt="">
            <count-down :class="$style.countDown2" size="mini" v-if="item.goodsInfo.shoppingStatus === 1" :data="item.goodsInfo" :fields="{ end: 'shoppingTimeLong' }" />
          </div>
          <div :class="$style.content">
            <p :class="$style.name" v-text="item.goodsInfo.productName" />
            <p :class="$style.desc" v-text="item.goodsInfo.productDesc" />
            <p :class="$style.bottom">
              <span :class="$style.price" v-text="getMinPrice(item.goodsInfo.productSkuModels)" />
              <span :class="$style.many" v-if="item.goodsInfo.salesVolume === 0">正在热销中</span>
              <template v-else-if="item.goodsInfo.salesVolume > 0 && item.goodsInfo.salesVolume < 10">
                <span :class="$style.many">
                  {{ item.goodsInfo.pageviews }}人关注
                </span>
              </template>
              <template v-else-if="item.goodsInfo.salesVolume >= 10">
                <span :class="$style.many">
                  {{ item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume }}人付款
                </span>
              </template>
            </p>
          </div>
        </li>
      </ul>
      <ul :class="$style.waterfall" v-if="listRight.length">
        <li
          v-for="(item, i) of listRight"
          :key="i"
          :class="{
            [$style.item]: true,
            [$style.long]: (i + 1) % 2 === 1
          }"
          @click="clickHandler(item)"
        >
          <div :class="$style.topImg">
            <img :src="item.image" alt="">
            <count-down :class="$style.countDown2" size="mini" v-if="item.goodsInfo.shoppingStatus === 1" :data="item.goodsInfo" :fields="{ end: 'shoppingTimeLong' }" />
          </div>
          <div :class="$style.content">
            <p :class="$style.name" v-text="item.goodsInfo.productName" />
            <p :class="$style.desc" v-text="item.goodsInfo.productDesc" />
            <p :class="$style.bottom">
              <span :class="$style.price" v-text="getMinPrice(item.goodsInfo.productSkuModels)" />
              <span :class="$style.many" v-if="item.goodsInfo.salesVolume === 0">正在热销中</span>
              <template v-else-if="item.goodsInfo.salesVolume > 0 && item.goodsInfo.salesVolume < 10">
                <span :class="$style.many">
                  {{ item.goodsInfo.pageviews }}人关注
                </span>
              </template>
              <template v-else-if="item.goodsInfo.salesVolume >= 10">
                <span :class="$style.many">
                  {{ item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume }}人付款
                </span>
              </template>
            </p>
          </div>
        </li>
      </ul>
    </div> -->
    <!-- <button :class="$style.seeAll" v-if="maxSee > localValue.length" @click="seeAll">
      <span>查看全部</span>
      <pl-svg name="right" color="#272536" />
    </button> -->
  </div>
</template>

<script>
import Tags from './Tags.vue'
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
    // listLeft () {
    //   return this.localValue.filter((item, i) => i % 2 === 0)
    // },
    // listRight () {
    //   return this.localValue.filter((item, i) => (i + 1) % 2 === 0)
    // },
    // localValue () {
    //   return this.data.values.slice(0, this.minSee)
    // },
    // maxSee () {
    //   return this.data.values.length
    // },
    styleType () {
      return this.data.styleType || -1
    }
  },
  methods: {
    getMinPrice (skuList) {
      if (!skuList) return
      let priceList = skuList.filter(item => item.status === 1).map(item => item.price)
      return Math.min(...priceList)
    },
    getMinOrinalPrice (skuList) {
      if (!skuList) return
      let priceList = skuList.filter(item => item.status === 1).map(item => item.originalPrice)
      return Math.min(...priceList)
    },
    getMaxOrinalPrice (skuList) {
      if (!skuList) return
      let priceList = skuList.filter(item => item.status === 1).map(item => item.originalPrice)
      return Math.max(...priceList)
    },
    getMaxPrice (skuList) {
      if (!skuList) return
      let priceList = skuList.filter(item => item.status === 1).map(item => item.price)
      return Math.max(...priceList)
    },
    // seeAll () {
    //   // if (this.minSee < this.maxSee) {
    //   //   this.minSee++
    //   // }
    //   this.minSee = this.maxSee
    // },
    clickHandler (item) {
      this.$router.push({ name: 'Lesson', params: { productId: item.value } })
    }
  }
}
</script>

<style module lang="scss">
  .product {
    position: relative;
    margin-bottom: 28px;
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
        display: flex;
        align-items: center;
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    box-sizing: border-box;
    height: 250px;
    .name {
      margin-bottom: 10px;
      font-size: 32px;
      line-height: 42px;
      font-weight: bold;
      color: #000;
      @include elps-wrap(2);
    }
    .tags {
      margin-bottom: 20px;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
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
  // .waterfall-box {
  //   display: grid;
  //   grid-template-columns: 340px 340px;
  //   grid-gap: 22px;
  // }
  // .waterfall {
  //   .item {
  //     position: revert;
  //     width: 340px;
  //     margin-bottom: 22px;
  //     color: #000;
  //     border-radius: 20px;
  //     overflow: hidden;
  //     background-color: #fff;
  //     .count-down2 {
  //       display: flex;
  //       width: 100%;
  //       bottom: 0;
  //       border-bottom-left-radius: 0;
  //       border-bottom-right-radius: 0;
  //     }
  //     &.long {
  //       color: red;
  //       .top-img {
  //         position: relative;
  //         img {
  //           width: 340px;
  //           height: 454px;
  //           object-fit: cover;
  //         }
  //       }
  //     }
  //     .top-img {
  //       position: relative;
  //       img {
  //         width: 340px;
  //         height: 340px;
  //         object-fit: cover;
  //       }
  //     }
  //     .content {
  //       padding: 16px;
  //       .name {
  //         margin-bottom: 6px;
  //         line-height: 31px;
  //         font-size: 24px;
  //         color: #000;
  //       }
  //       .desc {
  //         line-height: 24px;
  //         font-size: 20px;
  //         color: #999;
  //       }
  //       .bottom {
  //         display: flex;
  //         align-items: flex-end;
  //         margin-top: 20px;
  //         line-height: 38px;
  //         .price {
  //           font-size: 32px;
  //           color: #fe7700;
  //           &:before {
  //             content: '¥';
  //             font-size: 20px;
  //           }
  //         }
  //         .many {
  //           font-size: 20px;
  //           color: #999;
  //         }
  //       }
  //     }
  //   }
  // }
  // .see-all {
  //   width: 100%;
  //   height: 100px;
  //   margin-bottom: 36px;
  //   font-size: 26px;
  //   color: #000;
  //   border-radius: 20px;
  //   background-color: #FEF7F4;
  //   > svg {
  //     width: 26px;
  //     margin-left: 10px;
  //     vertical-align: -4px;
  //   }
  // }
</style>
