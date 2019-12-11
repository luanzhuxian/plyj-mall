<template>
  <div :class="$style.tuan">
    <div v-if="detail.preActivity === 1">
      <div v-if="detail.preActivity === 2" :class="$style.price">拼团价： <span>{{ detail.activityProductModel.price }}</span></div>
      <div v-else-if="detail.preActivity === 1" :class="$style.price">拼团价： <span v-text="hidePrice(detail.activityProductModel.price)" /></div>
      <div :class="$style.proInfo">
        <div :class="$style.original">现价：<i v-text="minPrice" />
          <template v-if="minPrice !== maxPrice">
            ~ <i v-text="maxPrice" />
          </template></div>
        <div :class="$style.buyNum">{{ detail.salesVolume }}人已购买</div>
      </div>
    </div>
    <div v-if="detail.preActivity === 2">
      <div :class="$style.price">拼团价： <span v-text="detail.activityProductModel.price" /></div>
      <div :class="$style.original" v-if="(minPrice !== maxPrice || maxOriginalPrice !== maxPrice) && maxOriginalPrice">原价：<del v-text="maxOriginalPrice" /></div>
    </div>
    <div>
      <!-- 团购用户头像 -->
      <div :class="$style.join" v-if="detail.preActivity === 2">
        <ul :class="$style.avatarList">
          <li
            :class="$style.avatar"
            v-for="(item, k) in detail.activityProductModel.userImageList.slice(-4)"
            :key="k"
          >
            <img :src="item.headImgURL">
          </li>
        </ul>
        <div v-if="detail.activityProductModel.number > 0">{{ detail.activityProductModel.number }}人和你一起参与</div>
      </div>
      <div :class="$style.priceRight" v-if="agentUser && (minRebate || maxRebate) && detail.preActivity !== 2">
        <p class="fz-22 gray-1">
          <span :class="$style.returnRunbi">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'TogetherPrice',
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
  },
  methods: {
    // 替换价格整数位第2位为 ‘?’
    hidePrice (price) {
      let integer = String(price).split('.')[0]
      const decimals = String(price).split('.')[1]
      if (integer.length <= 1) {
        return `${integer}.${decimals}`
      }
      integer = integer.split('')
      integer.splice(1, 1, '?')
      return `${integer.join('')}.${decimals}`
    }
  }
}
</script>

<style lang="scss" module>
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
      font-size: 26px;
    }
    .join{
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 360px;
      font-size: 26px;
      color: #999999;
      .avatarList {
        display: flex;
        align-items: center;
        margin-right: 30px;
        .avatar {
          width: 30px;
          height: 48px;
          img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
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
