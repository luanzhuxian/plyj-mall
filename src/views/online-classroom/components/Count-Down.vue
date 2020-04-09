<template>
    <div
        :class="[$style.countDown, $style[theme]]"
        v-if="endtime"
        v-show="show"
    >
        <span>{{ prefix }}</span>
        <div :class="$style.time">
            <i v-if="Number(d)">{{ d }}</i>
            <em v-if="Number(d)">天</em>
            <i v-if="h" v-text="h" />
            <em>:</em>
            <i v-if="m" v-text="m" />
            <em>:</em>
            <i v-if="s" v-text="s" />
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { Countdown } from '../../../assets/js/util'
export default {
    name: 'CountDown',
    props: {
        endtime: {
            type: [Number, String],
            default: 0
        },
        theme: {
            type: String,
            default: 'small'
        },
        prefix: {
            type: String,
            default: '距开始'
        }
    },
    data () {
        return {
            time: '',
            timer: '',
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
    beforeDestroy () {
        if (this.COUNTDOWN) {
            this.COUNTDOWN.stop()
        }
    },
    methods: {
        async init () {
            this.starttiemstamp = await Countdown.getServerTime()
            this.endtiemstamp = Number(moment(this.endtime).valueOf()) || 0
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
    position: absolute;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    align-items: center;
    text-align: center;
    font-size: 20px;
    background-color: rgba(0, 0, 0, .7);
    color: #fff;
    > span {
      word-break: keep-all;
      width: max-content;
    }
    > .time {
      display: flex;
      > i {
        display: inline-block;
        text-align: center;
        background-color: rgba(255, 255, 255, .4);
      }
    }
    &.black {
      padding: 10px 8px;
      font-size: 24px;
      > .time {
        > i {
          margin: 0 8px;
          padding: 3px;
          line-height: 36px;
          border-radius: 4px;
          font-size: 22px;
        }
        > em {
          line-height: 36px;
        }
      }
      span {
        margin-right: 12px;
      }
    }
    &.orange {
      font-size: 24px;
      background: url("https://mallcdn.youpenglai.com/static/mall/2.9.0/orange-count-down.png") no-repeat center center;
      background-size: 100% auto;
      &:before{
        content: '即将开始';
        padding: 0 24px;
        white-space: nowrap;
        font-size:30px;
        font-weight:bold;
      }
      .time {
        > i {
          margin: 0 8px;
          padding: 3px;
          border-radius:8px;
          line-height: 28px;
          font-size: 26px;
          font-weight:bold;
          background-color:#FFF;
          color: #E95338;
        }
        > em {
          line-height: 33px;
        }
      }
      span {
        padding-left: 40px;
        padding-right: 8px;
        font-size:28px;
      }
    }
  }
</style>
