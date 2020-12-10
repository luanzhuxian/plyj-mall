<template>
    <div :class="$style.countdown">
        <template v-if="!isEnd">
            <span v-if="!isStart">距活动开始仅剩：</span>
            <span v-else>距活动结束仅剩：</span>
            <span :class="$style.timeItem" v-text="day" />
            <i>天</i>
            <span :class="$style.timeItem" v-text="hour" />
            <i>:</i>
            <span :class="$style.timeItem" v-text="minute" />
            <i>:</i>
            <span :class="$style.timeItem" v-text="second" />
        </template>
        <span v-else>活动已结束</span>
    </div>
</template>

<script>
import Countdown from '../../../../../assets/js/Countdown'
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
        startTime: {
            type: Number,
            default: 0
        },
        endTime: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number,
            default: 0
        },
        isStart: Boolean,
        isEnd: Boolean
    },
    watch: {
        duration () {
            this.start()
        }
    },
    computed: {
    },
    activated () {
        this.start()
    },
    deactivated () {
        this.stop()
    },
    beforeDestroy () {
        this.stop()
    },
    methods: {
        start () {
            this.stop()
            if (this.duration > 0 && !this.isEnd) {
                const COUNTDOWN = new Countdown(this.duration, this.callback)
                COUNTDOWN.start()
                this.COUNTDOWN = COUNTDOWN
            }
        },
        stop () {
            if (this.COUNTDOWN) {
                this.COUNTDOWN.stop()
            }
        },
        callback (data) {
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
        width: max-content;
        height: 72px;
        margin: 378px auto 0;
        padding: 0 20px;
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
            padding: 0 4px;
            line-height: 38px;
            color: #DF5B2F;
            background-color: #FBEFD7;
            border-radius: 6px;
        }
    }
</style>
