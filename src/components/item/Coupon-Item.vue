<template>
  <div :class="$style.couponItem">
    <div :class="$style.couponItemRight">
      <div :class="$style.rightTop">
        <div :class="$style.couponType" v-text="name" />
        <div :class="$style.couponPrice" v-text="amount" />
        <div :class="$style.couponDesc">
          <div>满50000减5000</div>
          <div>双十二优惠券</div>
        </div>
      </div>
      <div :class="$style.lifeTime">
        <div>有效期：<i>2019.4.15-2019.4.30</i></div>
        <div>使用说明 <pl-icon name="icon-arrow-down" color="#EC6251" size="10" /></div>
      </div>
    </div>
    <div
      :class="$style.couponItemLeft"
    >
      <div :class="$style.getNow">
        立即
        <br>
        领取
      </div>
      <pl-icon name="icon-arrow-right" color="#fff" size="16" font-weight="bolder" />
      <div :class="$style.sawtooth" :style="{ backgroundImage: `url(${sawtoothImg})` }" />
    </div>
  </div>
</template>

<script>
import { createObjectUrl } from '../../assets/js/upload-image'
export default {
  name: 'CouponItem',
  data () {
    return {
      sawtoothImg: ''
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    // 优惠总金额
    amount: {
      type: Number,
      default: 1
    },
    // 满多少
    full: {
      type: Number,
      default: 1
    },
    // 减多少
    subtract: {
      type: Number,
      default: 1
    }
  },
  created () {
    this.sawtooth()
  },
  methods: {
    // 生成锯齿图标
    sawtooth () {
      let cvs = document.createElement('canvas')
      cvs.width = 37
      cvs.height = 31
      let ctx = cvs.getContext('2d')
      ctx.fillStyle = '#ffc9a2'
      ctx.fillRect(0, 0, 37, 31)
      ctx.beginPath()
      ctx.moveTo(0, 16)
      ctx.lineTo(37, 0)
      ctx.lineTo(37, 31)
      ctx.closePath()
      ctx.fillStyle = '#ec6251'
      ctx.fill()
      cvs.toBlob(blob => {
        this.sawtoothImg = createObjectUrl(blob)
      }, 'image/jpeg', 0.7)
    }
  }
}
</script>

<style module lang="scss">
  .coupon-item {
    position: relative;
    display: flex;
    margin-bottom: 32px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, .16);
    &:after {
      position: absolute;
      left: 50%;
      top: 50%;
      content: '';
      width: 678px;
      height: 96%;
      border: 2px solid #fff;
      transform: translate(-50%, -50%);
      box-sizing: border-box;
    }
  }
  .coupon-item-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 74px 0 36px 44px;
    background-color: #ffc9a2;
  }
  .right-top {
    display: flex;
    align-items: center;
  }
  .coupon-price {
    margin-left: 16px;
    line-height: 82px;
    font-size: 70px;
    color: #D8574B;
    font-weight: bold;
    &:after {
      display: inline-block;
      content: '元';
      width: 38px;
      box-sizing: border-box;
      color: #fff;
      line-height: 34px;
      text-align: center;
      font-size: 22px;
      border: 2px solid #fff;
      background-color: #D8574B;
      border-radius: 19px;
      transform: translate(-10px, -5px);
    }
  }
  .coupon-type {
    width: 34px;
    padding: 6px 0;
    writing-mode: sideways-rl;
    line-height: 24px;
    text-align: center;
    font-size: 22px;
    color: #fff;
    background-color: #EC8378;
    border-radius: 4px;
  }
  .coupon-desc {
    > div {
      &:nth-of-type(1) {
        font-size: 28px;
        font-weight: bold;
        line-height: 38px;
      }
      &:nth-of-type(2) {
        font-size: 22px;
        line-height: 30px;
      }
    }
  }
  .life-time {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    padding-right: 22px;
    font-size: 20px;
    color: #F9F9F9;
    > div {
      &:nth-last-of-type(1) {
        width: 118px;
        line-height: 28px;
        font-size: 20px;
        text-align: center;
        color: #EC6251;
        background-color: #fff;
        border-radius: 14px;
        > i {
          vertical-align: 2px;
        }
      }
    }
  }
  .coupon-item-left {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 154px;
    background-color: #EC6251;
    > .get-now {
      font-size: 32px;
      color: #fff;
      font-weight: bold;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.30);
    }
    > .sawtooth {
      position: absolute;
      left: 0;
      top: 0;
      content: '';
      width: 6px;
      height: 100%;
      background-repeat: repeat-y;
      background-size: 100%;
    }
  }
</style>
