<template>
  <div
    :class="{
      [$style.countDown]: true,
    }"
    v-show="show"
  >
    <span :class="$style.text">
      <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/time.png">{{ activityText }}
    </span>
    <div :class="$style.time">
      <i>{{ d }}</i><em>天</em><i v-if="h" v-text="h" /><em>:</em><i v-if="m" v-text="m" /><em>:</em><i v-if="s" v-text="s" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Countdown } from '../../assets/js/util'
export default {
  name: 'SecondCountDown',
  props: {
    activityText: {
      type: [Number, String],
      default: ''
    },
    endtime: {
      type: [Number, String],
      default: 0
    },
    starttime: {
      type: [Number, String],
      default: 0
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
      timer: '',
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
  watch: {
    endtime (val) {
      this.endtime = val
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      let serverTiem = await Countdown.getServerTime()
      this.starttiemstamp = Number(serverTiem)
      if (this.data) {
        this.endtiemstamp = Number(this.data[this.fields.end]) || 0
      } else {
        this.endtiemstamp = Number(moment(this.endtime).valueOf()) || 0
      }
      if (this.starttiemstamp - this.endtiemstamp < 0) {
        // 启动倒计时
        console.warn('启动倒计时')
        this.show = true
        this.countdown(this.endtiemstamp - this.starttiemstamp)
      } else {
        this.show = false
      }
    },
    countdown (duration) {
      this.COUNTDOWN = new Countdown(duration, data => {
        if (!data) {
          this.show = false
          this.$emit('done', true)
          this.data[this.fields.start] = 0
        }
        this.d = String(data.days).padStart(2, '0')
        this.h = String(data.hours).padStart(2, '0')
        this.m = String(data.minutes).padStart(2, '0')
        this.s = String(data.seconds).padStart(2, '0')
      })
      this.COUNTDOWN.start()
    }
  }
}
</script>

<style module lang="scss">
  .count-down {
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/count_down.png") no-repeat;
    background-size: 100% 100%;
    width: 264px;
    height: 120px;
    font-size: 26px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    .text{
      color: #FF3323;
      margin-right: 16px;
      margin-bottom: 10px;
      font-weight: bold;
      font-size: 28px;
      display: flex;
      align-items: center;
      img{
        width: 28px;
        height: 28px;
        margin-right: 8px;
      }
    }
    .time {
      display: flex;
      color: #ffffff;
      margin-right: 16px;
      i {
        display: inline-block;
        text-align: center;
        width: 34px;
        height: 34px;
        line-height: 40px;
        background: #fff;
        color: #E95338;
        margin: 0 6px;
        font-size: 24px;
      }
      i:nth-last-of-type(1){
          margin-right: 0;
      }
    }
  }
</style>
