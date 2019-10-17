<template>
  <div :class="[$style.couponItem, status ? $style.unavailable : '']">
    <div :class="$style.wrap">
      <div :class="$style.main">
        <div :class="$style.couponItemLeft">
          <div :class="$style.leftTop">
            <div :class="$style.couponType">满减券</div>
            <div :class="$style.couponPrice" v-text="amount" />
            <div :class="$style.couponDesc">
              <div>满{{ full }}减 {{ subtract }}</div>
              <div v-text="name" />
            </div>
          </div>
          <div :class="$style.lifeTime">
            <div>有效期：<i>{{ useStartTime | dateFormat('YYYY-MM-DD') }}~{{ useEndTime | dateFormat('YYYY-MM-DD') }}</i></div>
            <div v-show="instruction" @click="showInstruction = !showInstruction">
              使用说明 <pl-icon :class="{ [$style.showInstruction]: showInstruction }" name="icon-arrow-down" color="#EC6251" size="10" />
            </div>
          </div>
        </div>
        <div
          :class="$style.couponItemRight"
          @click.stop="couponClick"
        >
          <div :class="$style.getNow">
            <span v-if="!isAvailableStatus">
              立即
              <br>
              领取
            </span>
            <span v-if="isAvailableStatus">
              去
              <br>
              使
              <br>
              用
            </span>
            <br>
            <span :class="$style.receiveCount">{{ receiveCount ? `(${receiveCount}次)` : '' }}</span>
          </div>
          <pl-icon name="icon-arrow-right" color="#fff" size="16" font-weight="bolder" />
          <div :class="$style.sawtooth" :style="{ backgroundImage: `url(${sawtoothImg})` }" />
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="instruction && showInstruction" :class="$style.instruction" v-text="instruction" />
    </transition>
    <div :class="$style.unavailableDesc" v-if="status" v-text="status" />
  </div>
</template>

<script>
import { createObjectUrl } from '../../assets/js/upload-image'
export default {
  name: 'CouponItem',
  data () {
    return {
      sawtoothImg: '',
      showInstruction: false
    }
  },
  props: {
    status: {
      type: String,
      default: ''
    },
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
    },
    // 说明
    instruction: {
      type: String,
      default: ''
    },
    useStartTime: {
      type: String,
      default: ''
    },
    useEndTime: {
      type: String,
      default: ''
    },
    isAvailableStatus: {
      type: Boolean,
      default: false
    },
    receiveCount: {
      type: Number,
      default: 0
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
      ctx.beginPath()
      ctx.moveTo(0, 16)
      ctx.lineTo(37, 0)
      ctx.lineTo(37, 31)
      ctx.closePath()
      ctx.fillStyle = '#ec6251'
      ctx.fill()
      cvs.toBlob(blob => {
        this.sawtoothImg = createObjectUrl(blob)
      })
    },
    couponClick (e) {
      if (this.isAvailableStatus) {
        this.$router.push({
          path: '/Classify'
        })
      } else {
        this.$emit('couponClick', e)
      }
    }
  }
}
</script>

<style module lang="scss">
  .unavailable {
    filter: grayscale(100%);
  }

  .unavailableDesc {
    width: 240px;
    height: 80px;
    color: #FFF;
    background-color: #4D000000;
    border: 6px solid #fff;
    border-radius: 12px;
    transform: rotate(-10deg);
    font-size: 44px;
    font-weight: 800;
    text-align: center;
    line-height: 80px;
    position: absolute;
    top: 54px;
    right: 52px;
  }
  .coupon-item {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, .16);
    width: 100%;
    > .wrap {
      position: relative;
      padding: 12px;
      background: linear-gradient(90deg, #ffc9a2 75.75%, #ec6251 75.75%);
      overflow: hidden;
      > .main {
        width: 100%;
        height: max-content;
        display: flex;
        border: 2px solid #fff;
        box-sizing: border-box;
      }
    }
  }
  .coupon-item-left {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 62px 0 24px 32px;
    background-color: #ffc9a2;
  }
  .left-top {
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
          width: 18px;
          line-height: 18px;
          vertical-align: 2px;
          transform: rotate(0);
          transition: transform .2s linear;
          &.showInstruction {
            transform: rotate(-180deg);
          }
        }
      }
    }
  }
  .coupon-item-right {
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
      position: relative;
      .receive-count {
        position: absolute;
        font-weight: normal;
        width: 150px;
      }
    }
    > .sawtooth {
      position: absolute;
      left: -5px;
      top: 50%;
      content: '';
      width: 6px;
      height: 120%;
      transform: translateY(-50%);
      background-repeat: repeat-y;
      background-size: 100%;
    }
  }
  .instruction {
    padding: 20px 24px;
    word-break: break-all;
    white-space: pre-line;
    font-size: 24px;
    color: #666;
  }
</style>
