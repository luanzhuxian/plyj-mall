<template>
  <div
    :class="{
      [$style.countDown]: true, [Number(d) ? $style.d : '']: true
    }"
    v-show="show"
  >
    <span :class="$style.text">{{ activityText }}</span>
    <div :class="$style.time">
      <i v-if="Number(d)">{{ d }}</i><em v-if="Number(d)">天</em><i v-if="h" v-text="h" /><em>:</em><i v-if="m" v-text="m" /><em>:</em><i v-if="s" v-text="s" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getServerTime } from '../../apis/base-api'
export default {
  name: 'CountDown',
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
        this.endtiemstamp = Number(new Date(this.endtime).getTime()) || 0
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
      this.d = String(_data.days).padStart(2, '0')
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
    font-size: 24px;
    width: 222px;
    &.d{
      width: 278px;
    }
    height: 34px;
    background: #FF6767;
    border-radius: 4px;
    color: #fff;
    margin-bottom: 16px;
    .text{
      font-size: 24px;
      width: 72px;
      margin-left: 12px;
      margin-right: 8px;
    }
    .time {
      background: #fff;
      display: flex;
      align-items: center;
      color: #FF6767;
      padding: 0 10px;
      i {
        color: #FF6767;
        margin: 0 2px;
      }
    }
  }
</style>
