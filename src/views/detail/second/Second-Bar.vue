<template>
  <div :class="$style.together">
    <div :class="$style.productInfo" v-if="detail.preActivity === 1">
      <div :class="$style.price">
        <div :class="$style.secondPrice">
          {{ detail.activityProductModel.price }}
        </div>
        <del class="">108.00</del>
      </div>
      <div class="">活动限量10件</div>
    </div>
    <div :class="$style.productInfo" v-if="detail.preActivity === 2">
      <div :class="$style.price">
        <div :class="$style.secondPrice">
          {{ detail.activityProductModel.price }}
        </div>
        <del class="">108.00</del>
        <div class="">已抢20</div>
      </div>
      <div :class="$style.desc">
        <div :class="$style.progress">
          <div :class="$style.percent" :style="{width: (detail.activityProductModel.number / detail.activityProductModel.joinCount) * 100 + '%' }" />
        </div>
        <div>{{ detail.activityProductModel.joinCount || 0 }}人</div>
      </div>
    </div>
    <together-count-down
      @done="countFinished"
      activity-text="距活动开始仅剩"
      :starttime="detail.serverTime"
      v-if="detail.activityProductModel"
      :endtime="detail.activityProductModel.activityStartTime"
    />
  </div>
</template>

<script>
/* eslint-disable */
import TogetherCountDown from '../../../components/product/Together-Count-Down.vue'
export default {
  components: {
    TogetherCountDown
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
    padding-left: 118px;
    .desc{
      display: flex;
      color: #ffffff;
      align-items: center;
      font-size: 20px;
      height: 34px;
      margin-top: 2px;
      .progress{
        width: 480px;
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
