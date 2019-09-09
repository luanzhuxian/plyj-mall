<template>
  <div :class="$style.hotItem">
    <div :class="$style.top">
      <span :class="$style.title" v-text="moduleName" />
      <!--<p :class="$style.more">
        <span>查看更多</span>
        <pl-svg name="right" color="#ccc" />
      </p>-->
    </div>

    <div :class="$style.proBox">
      <div
        v-for="(item, i) of first"
        :class="{
          [$style.first]: true,
          [$style.proItem]: true,
          [$style.other]: i > 0
        }"
        :key="i"
        @click="jump(item)"
      >
        <div :class="$style.img">
          <count-down v-if="item.goodsInfo.shoppingStatus === 1" :class="$style.countDown" size="small" :data="item.goodsInfo" :fields="{ end: 'shoppingTimeLong' }" />
          <img :src="item.image" v-img-error alt="">
        </div>
        <div :class="$style.content">
          <div :class="$style.proName" v-text="item.name" />
          <Tags size="middle" :tags="item.goodsInfo.labelModels" />
          <div :class="$style.proPrice">
            <div :class="$style.price">
              <span>¥</span>
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

      <div :class="$style.other" v-if="data.values.length > 0">
        <div
          :class="$style.proItem"
          v-for="(item, i) of this.data.values"
          :key="i"
          @click="jump(item)"
        >
          <div :class="$style.img">
            <count-down v-if="item.goodsInfo.shoppingStatus === 1" :class="$style.countDown2" size="small" :data="item.goodsInfo" :fields="{ end: 'shoppingTimeLong' }" />
            <img :src="item.image + '?x-oss-process=style/thum-middle'" alt="">
          </div>
          <div :class="$style.content">
            <div :class="$style.proName" v-text="item.name" />
            <tags size="small" :tags="item.goodsInfo.labelModels.slice(0, 2)" />
            <div :class="$style.proPrice">
              <div :class="$style.price">
                <span>¥</span>
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
        <div v-if="data.values.length % 2 === 1" :class="$style.pro" />
      </div>
    </div>
  </div>
</template>

<script>
import Tags from './Tags.vue'
import { mapGetters } from 'vuex'
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
    },
    ...mapGetters(['agentUser', 'userId'])
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
        this.$router.push({ name: 'Lesson', params: { productId: value, brokerId: this.userId || null } })
      }
    }
  }
}
</script>

<style module lang="scss">
  .hot-item {
    padding: 34px 24px 24px 24px;
    background-color: #F4F5F9;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .title {
        position: relative;
        font-size: 36px;
        font-weight: bold;
        &:after {
          position: absolute;
          right: -36px;
          content: 'HOT';
          width: 44px;
          line-height: 24px;
          text-align: center;
          font-size: 14px;
          color: #fff;
          font-weight: normal;
          background: linear-gradient(60deg, #FE7700 35%, rgba(255, 255, 255, .5), #FE7700 75%);
          background-size: 200%;
          border-radius: 12px;
          animation: bgc-move 2s ease infinite;
        }
      }
      .more {
        font-size: 24px;
        color: #999;
        > svg {
          width: 20px;
          margin-left: 6px;
          vertical-align: -2px;
        }
      }
    }
  }
  .pro-box {
    margin-top: 20px;
  }
  .pro-item {
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
    width: 340px;
    .img {
      position: relative;
      > img {
        width: 340px;
        height: 340px;
        object-fit: cover;
      }
    }
    .content {
      padding: 16px;
      margin-bottom: 6px;
      .pro-name {
        height: 72px;
        margin-bottom: 8px;
        font-size: 28px;
        font-weight: bold;
        line-height: 36px;
        @include elps-wrap(2);
      }
      .pro-price {
        margin-top: 16px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        .price {
          span {
            display: inline-block;
            color: #FE7700;
            &:nth-of-type(1) {
              font-size: 24px;
              line-height: 28px;
              font-weight: 600;
            }
            &:nth-of-type(2) {
              font-size: 40px;
              line-height: 36px;
              font-weight: bold;
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
          height: 296px;
          object-fit: cover;
        }
      }
      .content {
        .pro-name {
          margin-bottom: 12px;
          height: 36px;
          @include elps();
        }
      }
      .how-many-pay {
        font-size: 24px !important;
      }
    }
  }
  .other {
    display: grid;
    margin-top: 22px;
    grid-template-columns: 340px 340px;
    grid-gap: 22px;
  }
  .pro {
    width: 340px;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/img/product-item.png") no-repeat center center;
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
  @keyframes bgc-move {
    0% { background-position: 150% 0 }
    100% { background-position: -50% 0 }
  }
</style>
