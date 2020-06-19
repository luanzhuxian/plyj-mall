<template>
    <div :class="$style.countdown">
        <span v-if="!isSarted">距活动开始仅剩：</span>
        <span v-else-if="isSarted && !isEnd">距活动结束仅剩：</span>
        <span v-else>活动已结束仅</span>
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
        startTime: {
            type: Number,
            default: 0
        },
        endTime: {
            type: Number,
            default: 0
        }
    },
    computed: {
        duration () {
            if (!this.isSarted) {
                return this.startTime - Date.now()
            }
            if (this.isSarted && !this.isEnd) {
                return this.endTime - Date.now()
            }
            return 0
        },
        // 是否已经开始
        isSarted () {
            return Date.now() - this.startTime > 0
        },
        isEnd () {
            return Date.now() - this.endTime > 0
        }
    },
    watch: {
        duration: {
            handler (val) {
                if (val && val > 0) {
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
