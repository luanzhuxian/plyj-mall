<template>
  <div
    :class="{
      [$style.countDown]: true,
      [$style[size]]: true
    }"
    v-if="data || endtime"
    v-show="show"
  >
    <pl-svg v-if="size === 'large'" name="time4" />
    <span>距开抢</span>
    <div :class="$style.time">
      <i v-if="Number(d)">{{ d }}</i><em v-if="Number(d)">天</em><i v-if="h" v-text="h" />:<i v-if="m" v-text="m" />:<i v-if="s" v-text="s" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getServerTime } from '../../apis/base-api'
export default {
  name: 'CountDown',
  props: {
    endtime: {
      type: [Number, String],
      default: 0
    },
    starttime: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: String,
      default: 'mini'
    },
    fields: {
      type: Object,
      default () {
        return {
          start: 'start',
          end: 'end'
        }
      }
    },
    // 数据载体，内部必须包含 start 和 end
    // 如果不传，那就必须传 endtime， starttime
    data: {
      type: Object,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      time: '',
      show: false,
      endtiemstamp: 0,
      starttiemstamp: 0,
      d: 0,
      h: 0,
      m: 0,
      s: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      let { result: serverTiem } = await getServerTime()
      this.starttiemstamp = Number(serverTiem)
      if (this.data) {
        this.endtiemstamp = Number(this.data[this.fields.end]) || 0
      } else {
        this.endtiemstamp = Number(this.endtime) || 0
      }
      if (this.starttiemstamp - this.endtiemstamp < 0) {
        // 启动倒计时
        console.warn('启动倒计时')
        this.show = true
        this.countdown()
      } else {
        this.show = false
      }
    },
    countdown () {
      this.setTime()
      let timer = setInterval(() => {
        this.endtiemstamp -= 1000
        if (this.endtiemstamp - this.starttiemstamp <= 0) {
          clearInterval(timer)
          this.show = false
          this.$emit('done', true)
          this.data[this.fields.start] = 0
        }
        this.setTime()
      }, 1000)
    },
    setTime () {
      let { _data } = moment.duration(this.endtiemstamp - this.starttiemstamp)
      this.d = String(_data.days)
      this.h = String(_data.hours).padStart(2, '0')
      this.m = String(_data.minutes).padStart(2, '0')
      this.s = String(_data.seconds).padStart(2, '0')
      // if (d !== '0') {
      //   this.time = `${d}天${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
      // } else if (h !== '0') {
      //   this.time = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
      // } else if (m !== '0') {
      //   this.time = `${m.padStart(2, '0')}:${s.padStart(2, '0')}`
      // }
    }
  }
}
</script>

<style module lang="scss">
  .count-down {
    display: flex;
    align-items: center;
    position: absolute;
    width: max-content;
    border-radius: 5px;
    font-size: 20px;
    color: #fff;
    background-color: rgba(0, 0, 0, .7);
    box-sizing: border-box;
    word-break: break-all;
    text-align: center;
    > time {
      display: flex;
      > i {
        display: inline-block;
        text-align: center;
        background-color: rgba(255, 255, 255, .4);
      }
    }
    &.large {
      left: 0;
      display: flex;
      align-items: center;
      width: 100%;
      height: 82px;
      padding: 0 24px;
      font-size: 24px;
      background-color: #FE7700;
      border-radius: 0;
      > .time {
        > i {
          width: 40px;
          margin: 0 4px;
          line-height: 36px;
          font-size: 28px;
          color: #FE7700;
          background-color: #fff;
          border-radius: 4px;
        }
      }
      > svg {
        fill: #fff;
        width: 36px;
        height: 36px;
        margin-right: 16px;
      }
      > span {
        margin-right: 12px;
        font-size: 30px;
      }
    }
    &.small {
      padding: 10px 8px;
      font-size: 22px;
      height: 52px;
      > .time {
        > i {
          width: 34px;
          margin: 0 4px;
          line-height: 36px;
          border-radius: 4px;
          font-size: 22px;
        }
      }
      span {
        margin-right: 12px;
      }
    }
    &.mini {
      padding: 10px 12px;
      font-size: 18px;
      height: 44px;
      .time {
        > i {
          width: 28px;
          margin: 0 4px;
          line-height: 28px;
          border-radius: 4px;
          font-size: 20px;
        }
      }
      span {
        margin-right: 14px;
      }
    }
    &.cart {
      font-size: 22px;
      height: 32px;
      background: none;
      border: 1px solid #FE7700;
      border-radius: 4px;
      color: #FE7700;
      > span {
        display: inline-block;
        line-height: 32px;
        padding: 0 8px 0 12px;
        background-color: #FE7700;
        color: #fff;
      }
      > .time {
        padding: 0 5px;
        > i {
          width: 28px;
          line-height: 28px;
          font-size: 22px;
        }
      }
    }
  }
</style>
