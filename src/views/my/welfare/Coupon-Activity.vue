<template>
  <div :class="$style.couponActivity">
    <div>
      <CouponItem
        :id="couponInfo.id"
        :name="couponInfo.name"
        :amount="couponInfo.amount"
        :full="couponInfo.useLimitAmount"
        :subtract="couponInfo.amount"
        :use-start-time="couponInfo.useStartTime"
        :use-end-time="couponInfo.useEndTime"
        :coupon-type="couponInfo.type"
        :instruction="couponInfo.instruction"
      />
    </div>
    <!--TODO.金额可变-->
    <div :class="$style.counterTitle">
      限时优惠，满{{ couponInfo.useLimitAmount }}减{{ couponInfo.amount }}，还差{{ differenceCount }}，可选择以下商品凑单购买
    </div>
    <div :class="$style.sort">
      <div @click="sort('isByComprehensive')">
        <span :class="{ [$style.changeColor]: isByComprehensive }">综合</span>
        <pl-icon :name="isByComprehensiveUp? 'icon-triangle-down': 'icon-triangle'"
                 color="#747474"
                 size="30"
        />
      </div>
      <div @click="sort('isBySaleCount')">
        <span :class="{ [$style.changeColor]: isBySaleCount }">销量</span>
        <pl-icon :name="isBySaleCountUp? 'icon-triangle-down': 'icon-triangle'"
                 color="#747474"
                 size="30"
        />
      </div>
    </div>
    <LoadMore />
  </div>
</template>

<script>
// import LoadMore from '../../../components/common/Load-More.vue'
import CouponItem from '../../../components/item/Coupon-Item.vue'

export default {
  name: 'CouponActivity',
  components: {
    // LoadMore,
    CouponItem
  },
  data () {
    return {
      couponInfo: {
        id: '',
        name: '',
        type: '',
        amount: '',
        useLimitAmount: '',
        useStartTime: '',
        useEndTime: '',
        instruction: ''
      },
      isByComprehensive: true, // 是否综合排序
      isByComprehensiveUp: false, // 是否综合排序从大到小
      isBySaleCount: false, // 是否按照销量排序
      isBySaleCountUp: false, // 是否按照销量排序从大到小
      differenceCount: 12 // 离满足优惠券优惠还差多少元
    }
  },
  computed: {},
  created () {
  },
  async activated () {
    this.couponInfo.id = this.$route.params.id
    this.couponInfo.type = this.$route.params.couponType
    this.couponInfo.name = this.$route.query.couponName
    this.couponInfo.amount = this.$route.query.amount
    this.couponInfo.useLimitAmount = this.$route.query.useLimitAmount
    this.couponInfo.useStartTime = this.$route.query.useStartTime
    this.couponInfo.useEndTime = this.$route.query.useEndTime
    this.couponInfo.instruction = this.$route.query.instruction
  },
  methods: {
    sort (keyword) {
      if (keyword === 'isByComprehensive') {
        this.isByComprehensive = true
        this.isByComprehensiveUp = !this.isByComprehensiveUp
        this.isBySaleCount = false
        this.isBySaleCountUp = false
      } else {
        this.isByComprehensive = false
        this.isByComprehensiveUp = false
        this.isBySaleCount = true
        this.isBySaleCountUp = !this.isBySaleCountUp
      }
    }
  }
}
</script>

<style module lang="scss">
  .coupon-activity {
    position: relative;
    padding-bottom: 88px;
    background-color: #f1f4f5;
    margin: 24px;
  }

  .counter-title {
    font-size: 24px;
    line-height: 24px;
    color: #414141;
    text-align: center;
    margin: 20px 0;
  }

  .sort {
    height: 76px;
    padding: 0 26px;
    border-radius: 20px;
    background: #FFFFFF;
    display: flex;
    > div {
      width: 180px;
      font-size:28px;
      line-height:76px;
      span {
        color: #373737;
        &.changeColor {
          color: #FE7700;
        }
      }
    }
  }
</style>
