<template>
  <div>
    <div :class="$style.walfareTip" v-if="hasPackages">
      <!--TODO.闹铃的icon图-->
      <pl-icon name="icon-alarm" color="#fff" size="18" type="icon" />
      <span>您有一个新人有礼优惠大礼包，还未领取哦！<b /></span>
    </div>
    <div :class="$style.coupons">
      <div :class="$style.couponsHeader">
        <div :class="$style.couponsInfo">
          <pl-icon name="icon-coupon1" width="40" height="40" type="svg" />
          <span>优惠卷</span>
          <b>({{ couponsNumber }}张)</b>
        </div>
        <button>管理</button>
      </div>
      <div :class="$style.couponsView">
        <div v-if="coupons.length !== 0">
          <div :class="$style.couponItem" v-for="couponItem in coupons" :key="couponItem.id">
            <div :class="$style.coupon">
              <div :class="$style.couponDetail">
                <div>
                  <div>满减券</div>
                  <div>
                    {{ couponItem.price }}
                    <b>元</b>
                  </div>
                  <div>
                    <h5>{{ couponItem.intensity }}</h5>
                    <span>双十二优惠劵</span>
                  </div>
                </div>
                <div>
                  <span>有效期：<b>{{ couponItem.timeline }}</b></span>
                </div>
              </div>
              <div :class="$style.goToUse">
                <h5>去使用</h5>
                <b>></b>
              </div>
            </div>
            <div :class="$style.couponInstructions" ng-if="displayCouponInstructions">
              <span>1-</span>
            </div>
          </div>
        </div>
        <div v-if="coupons.length === 0" />
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'Comment',
  data () {
    return {
      hasPackages: true, // TODO.默认false
      couponsNumber: 0,
      coupons: [],
      displayCouponInstructions: false
    }
  },
  methods: {}
}
</script>

<style module lang="scss">
  .walfare-tip {
    height: 64px;
    line-height: 64px;
    text-align: center;
    margin: 10px 50px;
    background: #F67070;
    box-shadow: 0px 10px 20px #000;
    opacity: 1;
    border-radius: 258px;

    i {
      color: #fff;
    }

    span {
      color: #fff;
      font-size: 26px;
      font-weight: 400;
      line-height: 36px;
      position: relative;
      b {
        width: 6px;
        height: 6px;
        border-top: 1px solid #999;
        border-right: 1px solid #999;
        transform: rotate(45deg);
        position: absolute;
        right: 0px;
      }
    }
  }
</style>
