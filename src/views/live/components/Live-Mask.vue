<template>
  <div :class="$style.liveMask">
    <img :src="imgSrc" alt="">
    <div :class="$style.countdown">
      <div :class="$style.time">
        <div>倒计时</div>
        <div>
          <i v-if="isDayShow">{{ d }}</i><span v-if="isDayShow">天</span><i v-text="h" /><span>:</span><i v-text="m" /><span>:</span><i v-text="s" />
        </div>
      </div>
      <div :class="$style.description">直播暂未开始</div>
    </div>
  </div>
</template>

<script>
import { Countdown } from './../../../assets/js/util'
export default {
  name: 'LiveMask',
  props: {
    imgSrc: {
      type: String,
      default: 'https://mallcdn.youpenglai.com/static/mall/2.5.0/live/live-off.png'
    },
    timestamp: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      countdown: null,
      d: 0,
      h: '00',
      m: '00',
      s: '00'
    }
  },
  computed: {
    isDayShow () {
      return this.d && this.d !== '00'
    }
  },
  watch: {
    timestamp (news, pre) {
      if (news < 0) {
        this.countdown = new Countdown(-news, (data) => {
          if (data) {
            this.setTime(data)
          } else {
            this.countdown.stop()
          }
        })
        this.countdown.start()
      }
    }
  },
  methods: {
    setTime ({ seconds, minutes, hours, days }) {
      this.d = String(days).padStart(2, '0')
      this.h = String(hours).padStart(2, '0')
      this.m = String(minutes).padStart(2, '0')
      this.s = String(seconds).padStart(2, '0')
    },
    stop () {
      if (this.countdown) {
        this.countdown.stop()
      }
    }
  },
  destroyed () {
    this.stop()
  }
}
</script>

<style lang='scss' module>

  .live-mask {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    overflow: hidden;
    > img {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
    > .countdown {
      display: flex;
      position: absolute;
      left: 0;
      bottom: 0;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 20%;
      padding: 0 28px;
      box-sizing: border-box;
      background: url('https://mallcdn.youpenglai.com/static/mall/2.5.0/live/组 919@2x.png') top/100% no-repeat;
      > .time {
        display: flex;
        align-items: center;
        font-size: 26px;
        color: #FFFFFF;
        > div:nth-of-type(2) {
          display: flex;
          margin-left: 20px;
          font-size: 26px;
          font-weight: bold;
          > span {
            padding: 0 8px;
            line-height: 40px;
          }
          > i {
            display: inline-block;
            width: 40px;
            box-sizing: border-box;
            border-radius: 6px;
            line-height: 40px;
            text-align: center;
            font-family: auto;
            color: #E95338;
            background: #FFFFFF;
          }
        }
      }
      > .description {
        padding: 0 20px;
        border-radius: 8px;
        line-height: 44px;
        font-size: 24px;
        color: #E95338;
        background: #FFFFFF;
      }
    }
  }

</style>
