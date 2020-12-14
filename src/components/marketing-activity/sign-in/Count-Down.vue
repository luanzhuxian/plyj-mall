<template>
    <div
        :class="$style.signInCountDown"
        :style="{
            '--tip-colour': tipColour,
            '--count-colour': countColour,
            '--time-bottom-colour': timeBottomColour,
            '--time-colour': timeColour
        }"
    >
        <div
            :class="$style.tip"
            v-if="status !== 0"
        >
            已有<strong :class="$style.count">{{ count }}人</strong>参与{{ activeName }}
        </div>

        <div :class="$style.timeBar">
            <span v-if="status === 0" :class="$style.statusText">距活动开始仅剩</span>
            <span v-if="status === 1" :class="$style.statusText">距活动结束仅剩</span>
            <span :class="[$style.t, $style.day]" v-text="time.d" />
            <span :class="$style.t" v-text="time.h" />
            <span :class="$style.t" v-text="time.m" />
            <span :class="$style.t" v-text="time.s" />
        </div>
    </div>
</template>

<script>
import Countdown from '../../../assets/js/Countdown'
const TIME_DATA = {
    d: '00',
    h: '00',
    m: '00',
    s: '00'
}
let countdownInstance = null
export default {
    name: 'SignInCountDown',
    props: {
        // 活动名称
        activeName: {
            type: String,
            default: ''
        },
        tipColour: {
            type: String,
            default: ''
        },
        countColour: {
            type: String,
            default: ''
        },
        // 时间的底色
        timeBottomColour: {
            type: String,
            default: ''
        },
        // 时间颜色
        timeColour: {
            type: String,
            default: ''
        },
        // 活动状态 0 未开始 1 已开始
        status: {
            type: Number,
            default: 0
        },
        // 参与人数
        count: {
            type: Number,
            default: 0
        },
        // 倒计时持续的时间（ms）
        duration: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            time: TIME_DATA
        }
    },
    activated () {
    },
    watch: {
        duration: {
            handler () {
                this.startCountdown()
            },
            immediate: true
        }
    },
    methods: {
        startCountdown () {
            if (this.duration <= 0) return
            if (countdownInstance) countdownInstance.stop()
            countdownInstance = new Countdown(this.duration, data => {
                if (!data) {
                    // 倒计时结束
                    this.$emit('ended')
                    this.time = TIME_DATA
                    return
                }
                const d = String(data.days)
                const h = String(data.hours)
                const m = String(data.minutes)
                const s = String(data.seconds)
                this.time.d = d.padStart(2, '0')
                this.time.h = h.padStart(2, '0')
                this.time.m = m.padStart(2, '0')
                this.time.s = s.padStart(2, '0')
            })
            countdownInstance.start()
        }
    }
}
</script>

<style module lang="scss">
    .signInCountDown {
        text-align: center;
        > .tip {
            color: var(--tip-colour);
            font-size: 28px;
            > .count {
                color: var(--count-colour);
            }
        }
        > .timeBar {
            margin-top: 14px;
            font-size: 26px;
            > .statusText {
                margin-right: 6px;
                line-height: 36px;
                color: var(--time-bottom-colour);
            }
            > .t {
                position: relative;
                display: inline-block;
                width: 36px;
                line-height: 36px;
                margin-right: 26px;
                text-align: center;
                color: var(--time-colour);
                background-color: var(--time-bottom-colour);
                border-radius: 4px;
                &:after {
                    position: absolute;
                    content: ':';
                    top: 50%;
                    right: -15px;
                    transform: translateY(-50%);
                    line-height: 35px;
                    color: var(--time-bottom-colour);
                }
                &.day {
                    margin-right: 36px;
                    &:after {
                        content: '天';
                        right: -30px;
                        color: var(--time-bottom-colour);
                    }
                }
                &:nth-last-of-type(1) {
                    margin-right: 0;
                    &:after {
                        content: none;
                    }
                }
            }
        }
    }
</style>
