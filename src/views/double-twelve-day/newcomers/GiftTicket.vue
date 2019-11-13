<template>
  <div class="gift-ticket" :class="{ stoped }">
    <div class="sub-ticket">
      <span class="desc">满减券</span>
    </div>
    <div class="content-box">
      <div class="coupon-info">
        <!-- <span class="ticket-label">满减券</span> -->
        <span class="denomination">
          {{ couponAmount }}
          <span class="yuan">元</span>
        </span>
        <span style="position: relative; left:-30px;">
          <span class="coupon-desc">满{{ useLimit }}减{{ couponAmount }}</span><br>
          <span class="coupon-name">{{ couponName }}</span>
        </span>
      </div>
      <div>
        <span class="valid-date">有效期：{{ validDate }}</span>
        <!-- <span class="intro" @click="showRules">使用说明<i class="icon-font arrow-down" /></span> -->
      </div>
    </div>
    <div class="stop-label" v-if="stoped">
      {{ status === 'stop' ? '已停止' : '已结束' }}
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'GiftTicket',
  props: {
    stoped: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'stoped'
    },
    couponName: {
      type: String,
      required: true
    },
    couponAmount: {
      type: Number,
      required: true
    },
    useLimit: {
      type: Number,
      required: true
    },
    startTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    }
  },
  computed: {
    validDate () {
      let startTime = moment(this.startTime).format('YYYY.MM.DD')
      let endTime = moment(this.endTime).format('YYYY.MM.DD')
      return `${startTime}-${endTime}`
    }
  },
  methods: {
    showRules () {
      this.$emit('showrule')
    }
  }
}
</script>

<style lang="scss" scoped>
.gift-ticket {
  position: relative;
  width: 678px;
//   height: 220px;
  padding: 12px;
  margin-bottom: 20px;
  background-color: #ffc9a2;
  box-shadow:0px 6px 12px rgba(0, 0, 0, 0.16);

  &.stoped {
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
  }

  .sub-ticket {
    position: absolute;
    top: 0;
    right: 0;
    width:154px;
    height:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ec6251;
    color: white;
    text-align: center;

    .desc {
      display: inline-block;
      width: 32px;
      height: 114px;
      font-size: 32px;
      font-weight: bold;
      line-height: 36px;
      color: white;
      text-shadow: 0px 1px 1px rgba(0,0,0,0.30);
      opacity: 0.9;
      vertical-align: middle;
    }
  }

  .stop-label {
    position: absolute;
    z-index: 2;
    padding: 10px 40px;
    right: 50px;
    top: 80px;
    background: rgba(0, 0, 0, 0.3);
    color: rgb(253, 253, 253);
    border: 4px solid rgb(238, 238, 238);
    border-radius:12px;
    box-shadow:0px 6px 12px rgba(0, 0, 0, 0.16);
    font-size: 44px;
    font-weight: 800;
    transform: rotate(-15deg);
  }

  .content-box {
    position: relative;
    z-index: 1;
    padding: 62px 0 24px 32px;
    border: 1px solid white;

    .ticket-label {
      display: inline-block;
      margin-right: 16px;
      width: 34px;
      height: 82px;
      background:rgba(236,131,120,1);
      border-radius: 4px;
      color: white;
      font-size: 22px;
      text-align: center;
    }

    .denomination {
        line-height: 82px;
        font-size: 70px;
        color: #D8574B;
        font-weight: bold;
      .yuan {
        position: relative;
        left: -40px;
        display: inline-block;
        width: 38px;
        height: 38px;
        line-height: 38px;
        background-color: #d8574b;
        border: 1px solid white;
        color:white;
        font-size: 22px;
        font-weight: bold;
        text-align: center;
        border-radius: 50%;
      }
    }

    .coupon-info {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 24px;
      padding-right: 79px;
    }

    .coupon-desc {
      font-size: 38px;
      font-weight: bold;
      word-break: break-word;
    }

    .coupon-name {
      font-size: 28px;
    }

    .valid-date {
      margin-right: 84px;
      font-size: 20px;
      color: white;
    }

    .intro {
      display: inline-block;
      width:118px;
      height:28px;
      line-height: 28px;
      font-size: 20px;
      text-align: center;
      color: #ec6251;
      background-color: white;
      border-radius: 188px;
    }
  }
}
</style>
