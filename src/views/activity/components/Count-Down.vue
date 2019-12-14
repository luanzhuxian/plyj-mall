<template>
  <div
    v-show="show"
    :class="['count-down', size, (!!background ? 'bg' : '')]"
    :style="{
      color,
      '--background': background
    }"
  >
    <span v-if="textBefore">{{ textBefore }}</span>
    <div class="time">
      <i v-if="isDayShow">{{ d }}</i><span v-if="isDayShow">天</span><i v-text="h" /><span>:</span><i v-text="m" /><span v-if="isSecondsShow || !isDayShow">:</span><i v-if="isSecondsShow || !isDayShow" v-text="s" />
    </div>
    <span v-if="textAfter">{{ textAfter }}</span>
  </div>
</template>

<script>
import moment from 'moment'
import { getServerTime } from '../../../apis/base-api'

export default {
  name: 'CountDown',
  props: {
    timestamp: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: String,
      default: 'small'
    },
    textBefore: {
      type: String,
      default: ''
    },
    textAfter: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#FFF'
    },
    format: {
      type: String,
      default: 'HH:mm:ss'
    },
    background: {
      type: String,
      default: ''
    },
    fields: {
      type: [Number, String],
      default: ''
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
      show: false,
      cts: 0,
      d: 0,
      h: 0,
      m: 0,
      s: 0,
      start: 0,
      end: 0,
      timer: null
    }
  },
  computed: {
    isSecondsShow () {
      return this.format.includes('ss')
    },
    isDayShow () {
      return this.d && this.d !== '00'
    }
  },
  watch: {
    timestamp (val, old) {
      this.init()
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    async init () {
      let { result } = await getServerTime()
      this.cts = Number(result)
      if (this.cts && this.timestamp) {
        this.start = Math.min(this.cts, this.timestamp)
        this.end = Math.max(this.cts, this.timestamp)
        this.show = true
        this.countdown()
      }
    },
    countdown () {
      this.setTime(this.end - this.start)
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.end -= 1000
        if (this.end - this.start <= 0) {
          // clearInterval(timer)
          // this.show = false
          this.clear()
          this.$emit('done', true)
        }
        this.setTime(this.end - this.start)
      }, 1000)
    },
    setTime (duration) {
      let { _data } = moment.duration(duration)
      this.d = String(Math.floor(moment.duration(duration).asDays())).padStart(2, '0')
      this.h = String(_data.hours).padStart(2, '0')
      this.m = String(_data.minutes).padStart(2, '0')
      this.s = String(_data.seconds).padStart(2, '0')
    },
    clear () {
      clearInterval(this.timer)
      this.timer = null
      this.show = false
      this.d = ''
      this.h = ''
      this.m = ''
      this.s = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .count-down {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 24px;
    > span {
      word-break: keep-all;
      width: max-content;
    }
    > .time {
      display: flex;
      > i {
        box-sizing: border-box;
        display: inline-block;
        text-align: center;
      }
    }
    &.small {
      font-size: 24px;
      line-height: 36px;
      &.bg {
        .time {
          > span {
            padding: 0 5px;
          }
          > i {
            width: 40px;
            height: 36px;
            background: var(--background);
            border-radius: 4px;
          }
        }
      }
    }
    &.middle {
      font-size: 28px;
      line-height: 40px;
      .time {
        > span {
          padding: 0 8px;
          color: var(--background);
        }
        > i {
          width: 40px;
          height: 40px;
          background: var(--background);
          border-radius: 6px;
        }
      }
    }
    &.medium {
      font-size: 32px;
      line-height: 46px;
      .time {
        > span {
          padding: 0 8px;
          color: var(--background);
        }
        > i {
          width: 46px;
          height: 46px;
          background: var(--background);
          border-radius: 10px;
          font-weight: bold;
        }
      }
    }
  }
</style>
