<template>
  <div :class="$style.countDown" v-if="data" v-show="show">
    距开抢 {{ time }}
  </div>
</template>

<script>
import moment from 'moment'
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
      show: true,
      endtiemstamp: 0,
      starttiemstamp: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.data) {
        this.endtiemstamp = Number(this.data[this.fields.end]) || 0
        this.starttiemstamp = Number(this.data[this.fields.start]) || 0
      } else {
        this.endtiemstamp = Number(this.endtime) || 0
        this.starttiemstamp = Number(this.starttime) || 0
      }
      if (this.starttiemstamp - this.endtiemstamp < 0) {
        // 启动倒计时
        console.log('启动倒计时')
        this.countdown()
      } else {
        this.show = false
      }
    },
    countdown () {
      let timer = setInterval(() => {
        this.endtiemstamp -= 1000
        if (this.endtiemstamp - this.starttiemstamp <= 0) {
          clearInterval(timer)
          this.show = false
          this.$emit('done', true)
          this.data[this.fields.end] = 0
          this.data[this.fields.start] = 0
        }
        let { _data } = moment.duration(this.endtiemstamp - this.starttiemstamp)
        let d = String(_data.days)
        let h = String(_data.hours)
        let m = String(_data.minutes)
        let s = String(_data.seconds)
        if (d !== '0') {
          this.time = `${d}:${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
        } else if (h !== '0') {
          this.time = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
        } else if (m !== '0') {
          this.time = `${m.padStart(2, '0')}:${s.padStart(2, '0')}`
        }
      }, 1000)
    }
  }
}
</script>

<style module lang="scss">
  .count-down {
    position: absolute;
    right: 10px;
    top: 10px;
    width: max-content;
    padding: 0 15px;
    border-radius: 5px;
    line-height: 40px;
    font-size: 20px;
    color: #fff;
    background-color: #000;
    opacity: .6;
    box-sizing: border-box;
  }
</style>
