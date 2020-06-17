<template>
    <div :class="$style.countdown">
        <span>距活动开始仅剩：</span>
        <span :class="$style.timeItem" v-text="day" />
        <i>天</i>
        <span :class="$style.timeItem" v-text="hour" />
        <i>:</i>
        <span :class="$style.timeItem" v-text="minute" />
        <i>:</i>
        <span :class="$style.timeItem" v-text="second" />
    </div>
</template>

<script>
import Countdown from '../../../../assets/js/Countdown'
export default {
    name: 'Countdown',
    data () {
        return {
            day: '',
            hour: '',
            minute: '',
            second: ''
        }
    },
    props: {
        duration: {
            type: Number,
            default: 100000
        }
    },
    watch: {
        duration: {
            handler (val) {
                console.log(val)
                if (val) {
                    this.start()
                }
            },
            immediate: true
        }
    },
    deactivated () {
        this.COUNTDOWN.stop()
    },
    beforeDestroy () {
        this.COUNTDOWN.stop()
    },
    methods: {
        start () {
            const COUNTDOWN = new Countdown(this.duration, this.callback)
            COUNTDOWN.start()
            this.COUNTDOWN = COUNTDOWN
        },
        callback (data) {
            console.log(data)
            if (!data) {
                this.$emit('end')
                return
            }
            const {
                days,
                hours,
                minutes,
                seconds
            } = data
            this.day = String(days).padStart(2, '0')
            this.hour = String(hours).padStart(2, '0')
            this.minute = String(minutes).padStart(2, '0')
            this.second = String(seconds).padStart(2, '0')
        }
    }
}
</script>

<style module lang="scss">
    .countdown {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 436px;
        height: 72px;
        margin: 378px auto 0;
        text-align: center;
        font-size: 24px;
        background: linear-gradient(180deg, #F67D3E, #FB621C) no-repeat;
        border-radius: 36px;
        > span {
            color: #FBEFD7;
        }
        > i {
            color: #FBEFD7;
            margin: 0 4px;
        }
        > .timeItem {
            width: 36px;
            line-height: 38px;
            color: #DF5B2F;
            background-color: #FBEFD7;
            border-radius: 6px;
        }
    }
</style>
