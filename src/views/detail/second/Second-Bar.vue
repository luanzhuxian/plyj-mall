<template>
  <div :class="$style.together" v-if="detail">
    <div :class="$style.productInfo" v-if="detail.preActivity === 1">
      <div :class="$style.price">
        <div :class="$style.secondPrice">
          {{ detail.activityProductModel.price }}
        </div>
        <del :class="$style.original" v-text="minPrice" />
        <template v-if="minPrice !== maxPrice">
          ~ <del :class="$style.original" v-text="maxPrice" />
        </template>
      </div>
      <div :class="$style.desc">活动限量{{ detail.activityProductModel.stock }}件</div>
    </div>
    <div :class="$style.productInfo" v-if="detail.preActivity === 2">
      <div :class="$style.price">
        <div :class="$style.secondPrice">
          {{ detail.activityProductModel.price }}
        </div>
        <del :class="$style.original" v-text="minPrice" />
        <template v-if="minPrice !== maxPrice">
          ~ <del :class="$style.original" v-text="maxPrice" />
        </template>
        <div :class="$style.number">已抢 {{ detail.activityProductModel.number }}</div>
      </div>
      <div :class="$style.desc">
        <div :class="$style.progress">
          <div :class="$style.percent" :style="{width: (detail.activityProductModel.number / detail.activityProductModel.stock) * 100 + '%' }" />
        </div>
        <div>共 {{ detail.activityProductModel.stock || 0 }} 件</div>
      </div>
    </div>
    <count-down
      @done="countFinished"
      activity-text="距离结束"
      v-if="detail.preActivity === 2"
      :endtime="detail.activityProductModel.activityEndTime"
    />
    <count-down
      @done="countFinished"
      activity-text="距离开始"
      v-if="detail.preActivity === 1"
      :endtime="detail.activityProductModel.activityStartTime"
    />
  </div>
</template>

<script>
/* eslint-disable */
import CountDown from '../../../components/product/Second-Count-Down.vue'
export default {
  components: {
    CountDown
  },
  data () {
    return {
    }
  },
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
  },
  methods: {
    countFinished () {
      this.$set(this.detail, 'serverTime', '')
      this.$set(this.detail, 'shoppingTimeLong', '')
    }
  }
}
</script>

<style module lang="scss">
  .together{
    height: 120px;
    background: #FF3323;
    padding-left: 24px;
    display: flex;
    justify-content: space-between;
    .price{
      display: flex;
      align-items: baseline;
      .second-price{
        font-size: 52px;
        color: #ffffff;
        display: flex;
        align-items: baseline;
        &:before{
          content: '¥';
          font-size: 24px;
        }
      }
      .original{
        font-size: 26px;
        color: #FFD9CE;
        margin-left: 20px;
        &:before{
          content: '¥';
          font-size: 26px;
        }
      }
    }
    .number{
      color: #EEEEEE;
      font-size: 26px;
      margin-left: 20px;
    }
    .desc{
      display: flex;
      color: #ffffff;
      align-items: center;
      font-size: 20px;
      height: 34px;
      margin-top: 2px;
      .progress{
        width: 356px;
        height: 10px;
        background: rgba(255, 255, 255, .5);
        border-radius: 206px;
        display: flex;
        align-items: center;
        margin-right: 16px;
        .percent{
          height: 10px;
          background: #ffffff;
          border-radius: 206px;
        }
      }
    }
  }
</style>
