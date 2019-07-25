<template>
  <div :class="$style.bestRecommend">
    <div :class="$style.title" v-text="data.moduleName" />
    <template v-if="styleType === 2">
      <div
        :class="$style.product"
        v-for="(item, i) of data.values"
        :key="i"
        @click="clickHandler(item)"
      >
        <div :class="$style.img" :style="{ backgroundImage: `url(${item.image + '?x-oss-process=style/thum-middle'})` }">
          <div :class="$style.type" v-if="item.goodsInfo.productType === 'EXPERIENCE_CLASS'">
            体验课
          </div>
          <div :class="$style.howManyBuy">
            <pl-svg name="hot" />
            <span v-if="item.goodsInfo.salesVolume === 0">正在热销中</span>
            <template v-else-if="item.goodsInfo.salesVolume > 0 && item.goodsInfo.salesVolume < 10">
              <span>
                {{ item.goodsInfo.pageviews }}人关注
              </span>
            </template>
            <template v-else-if="item.goodsInfo.salesVolume >= 10">
              <span>
                {{ item.goodsInfo.salesVolume >= 999 ? '999+' : item.goodsInfo.salesVolume }}人{{ item.goodsInfo.productType === 'FORMAL_CLASS' ? '学习' : '报名' }}
              </span>
            </template>
          </div>
        </div>

        <div :class="$style.content">
          <div :class="$style.name" v-text="item.goodsInfo.productName" />
          <Tags size="middle" />
          <div :class="$style.bottom">
            <div :class="$style.priceBox">
              <span>¥</span>
              <span v-text="getMinPrice(item.goodsInfo.productSkuModels)" />
              <del>
                ¥{{ getMinOrinalPrice(item.goodsInfo.productSkuModels) }}
              </del>
            </div>
            <button v-if="item.goodsInfo.productType === 'FORMAL_CLASS'">
              立即报名
            </button>
            <button v-else-if="item.goodsInfo.productType === 'EXPERIENCE_CLASS'">
              立即学习
            </button>
            <button v-else>
              立即购买
            </button>
          </div>
        </div>
      </div>
    </template>
    <!-- 瀑布流 -->
    <div v-if="styleType === 1" :class="$style.waterfallBox">
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
          <img :class="$style.img" :src="item.image + '?x-oss-process=style/thum-middle'" alt="">
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
          <img :class="$style.img" :src="item.image" alt="">
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
    </div>
    <button :class="$style.seeAll" v-if="type === 2 && maxSee > localValue.length" @click="seeAll">
      <span>查看全部</span>
      <pl-svg name="right" color="#272536" />
    </button>
    <footer :class="$style.footer">
      — 技术支持 朋来科技 —
    </footer>
  </div>
</template>

<script>
import Tags from './Tags.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'BestRecommend',
  components: {
    Tags
  },
  data () {
    return {
      // 最小查看数量
      minSee: 10
    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return {
          values: []
        }
      }
    },
    type: {
      type: Number,
      default: 2
    }
  },
  computed: {
    ...mapGetters(['agentUser', 'userId']),
    listLeft () {
      return this.localValue.filter((item, i) => i % 2 === 0)
    },
    listRight () {
      return this.localValue.filter((item, i) => (i + 1) % 2 === 0)
    },
    localValue () {
      return this.data.values.slice(0, this.minSee)
    },
    maxSee () {
      return this.data.values.length
    },
    styleType () {
      return this.data.styleType || -1
    }
  },
  methods: {
    getMinPrice (skuList) {
      let priceList = skuList.map(item => item.price)
      return Math.min(...priceList)
    },
    getMinOrinalPrice (skuList) {
      let priceList = skuList.map(item => item.originalPrice)
      return Math.min(...priceList)
    },
    getMaxPrice (skuList) {
      let priceList = skuList.map(item => item.price)
      return Math.max(...priceList)
    },
    seeAll () {
      // if (this.minSee < this.maxSee) {
      //   this.minSee++
      // }
      this.minSee = this.maxSee
    },
    clickHandler (item) {
      this.$router.push({ name: 'Lesson', params: { productId: item.value, brokerId: this.agentUser ? this.userId : null } })
    }
  }
}
</script>

<style module lang="scss">
  .best-recommend {
    padding: 0 24px;
    color: #000;
    background: linear-gradient(180deg, #DFE4F3, #ECEAF7);
  }
  .title {
    position: relative;
    text-align: center;
    line-height: 114px;
    font-size: 36px;
    font-weight: bolder;
    color: #F2B036;
    letter-spacing: 14px;
    &:after, &:before {
      position: absolute;
      top: 50%;
      content: '';
      width: 20px;
      height: 4px;
      background-color: currentColor;
    }
    &:after {
      right: 32%;
    }
    &:before {
      left: 30%;
    }
  }
  .product {
    margin-bottom: 56px;
    border-radius: 20px;
    overflow: hidden;
    background-color: #fff;
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
      .type {
        padding: 6px 24px;
        margin: 20px 0 0 20px;
        font-size: 28px;
        color: #fff;
        background-color: #F2B036;
        border-radius: 10px;
      }
      .how-many-buy {
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
    padding: 16px;
    .name {
      font-size: 32px;
      line-height: 42px;
      font-weight: bold;
      color: #000;
      @include elps-wrap(2);
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
      margin-top: 22px;
      padding: 12px 26px;
      font-size: 32px;
      color: #fff;
      background-color: #fe7700;
      border-radius: 8px;
    }
  }
  .waterfall-box {
    display: grid;
    grid-template-columns: 340px 340px;
    grid-gap: 22px;
  }
  .waterfall {
    .item {
      width: 340px;
      margin-bottom: 22px;
      color: #000;
      border-radius: 20px;
      overflow: hidden;
      background-color: #fff;
      &.long {
        color: red;
        .img {
          width: 340px;
          height: 454px;
          object-fit: cover;
        }
      }
      .img {
        width: 340px;
        height: 340px;
        object-fit: cover;
      }
      .content {
        padding: 16px;
        .name {
          margin-bottom: 6px;
          line-height: 31px;
          font-size: 24px;
          color: #000;
        }
        .desc {
          line-height: 24px;
          font-size: 20px;
          color: #999;
        }
        .bottom {
          display: flex;
          align-items: flex-end;
          margin-top: 20px;
          line-height: 38px;
          .price {
            font-size: 32px;
            color: #fe7700;
            &:before {
              content: '¥';
              font-size: 20px;
            }
          }
          .many {
            font-size: 20px;
            color: #999;
          }
        }
      }
    }
  }
  .see-all {
    width: 100%;
    height: 100px;
    margin-bottom: 36px;
    font-size: 26px;
    color: #000;
    border-radius: 20px;
    background-color: #FEF7F4;
    > svg {
      width: 26px;
      margin-left: 10px;
      vertical-align: -4px;
    }
  }
  .footer {
    padding-bottom: 50px;
    font-size: 26px;
    color: #999;
    text-align: center;
  }
</style>
