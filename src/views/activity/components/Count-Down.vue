<template>
  <div
    v-show="show"
    :class="{
      [$style.countDown]: true,
      [$style[size]]: true
    }"
    :style="{ color }"
  >
    <span v-if="textBefore">{{ textBefore }}</span>
    <div :class="$style.time" v-if="Number(d)">
      <i>{{ d }}</i><span>天</span><i v-if="h" v-text="h" /><span v-if="h">时</span>
    </div>
    <div :class="$style.time" v-else>
      <i v-if="h" v-text="h" /><span v-if="h">:</span><i v-if="m" v-text="m" /><span v-if="m">:</span><i v-if="s" v-text="s" />
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
    currentTimestamp: {
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
  watch: {
    timestamp (val, old) {
      this.reset()
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    async init () {
      if (this.currentTimestamp) {
        this.cts = this.currentTimestamp || Date.now()
      } else {
        let { result } = await getServerTime()
        this.cts = Number(result)
      }
      if (this.cts && this.timestamp) {
        this.start = Math.min(this.cts, this.timestamp)
        this.end = Math.max(this.cts, this.timestamp)
        this.show = true
        this.countdown()
      }
    },
    async reset () {
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
      this.d = String(_data.days)
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

<style module lang="scss">
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
        display: inline-block;
        text-align: center;
      }
    }
    &.small {
      .time {
        > i {
          box-sizing: border-box;
          margin: 0 5px;
          padding: 4px;
          width: 40px;
          height: 35px;
          line-height: 30px;
          background: rgba(174, 174, 174, 0.64);
          border-radius: 4px;
        }
      }
    }
  }
</style>
