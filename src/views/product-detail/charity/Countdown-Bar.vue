<template>
    <div :class="$style.countdownBar">
        <div :class="$style.content">
            <div :class="$style.contentLeft">
                <pl-svg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/gyxd.png" width="80" />
            </div>
            <div :class="$style.contentRight">
                <div :class="$style.contentRightTop">
                    <span>距活动结束仅剩</span>
                    <div :class="$style.countdown" v-if="show">
                        <i>{{ d }}</i><em>天</em><i v-if="h" v-text="h" /><em>:</em><i v-if="m" v-text="m" /><em>:</em><i v-if="s" v-text="s" />
                    </div>
                </div>
                <div :class="$style.contentRightBottom">
                    <Progress
                        :class="$style.progress"
                        :percentage="percentage"
                        :stroke-width="10"
                        color="#11FD74"
                        outter-color="rgba(255, 255, 255, 0.5)"
                    >
                        <span slot="content" :class="$style.progressText">
                            累计公益金<b>{{ donation }}</b>元
                        </span>
                    </Progress>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import Countdown from '../../../assets/js/Countdown'
import Progress from '../../../components/penglai-ui/Progress.vue'

export default {
    name: 'CountdownBar',
    components: {
        Progress
    },
    props: {
        starttime: {
            type: [Number, String],
            default: 0
        },
        endtime: {
            type: [Number, String],
            default: 0
        },
        // 捐赠总额
        donation: {
            type: [Number, String],
            default: 0
        },
        // 捐赠上限
        total: {
            type: [Number, String],
            default: 0
        }
    },
    data () {
        return {
            show: false,
            d: 0,
            h: 0,
            m: 0,
            s: 0
        }
    },
    computed: {
        percentage () {
            const { donation, total } = this
            if (!donation || !total) {
                return 0
            }
            const percentage = parseInt(donation * 100 / total)
            return percentage > 100 ? 100 : percentage
        }
    },
    created () {
        this.init()
    },
    methods: {
        async init () {
            const servertime = await Countdown.getServerTime()
            const currenttime = Number(servertime)

            const starttime = moment(this.starttime).valueOf()
            const endtime = moment(this.endtime).valueOf()

            if (starttime > currenttime) {
                this.show = true
                this.countdown(starttime - currenttime)
            } else if (endtime > currenttime) {
                this.show = true
                return this.countdown(endtime - currenttime)
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

<style lang="scss" module>
.countdown-bar {
    background: linear-gradient(90deg, #4076e0 0%, #1c5ddb 100%);
    color: #fff;
    overflow: hidden;
    z-index: 1;
}
.content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    height: 100px;
    background: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/charity-heart.png') no-repeat right top;
    background-size: 112px auto;
    &-left {
        padding-left: 12px;
        &::after {
            display: inline-block;
            margin: 0 16px;
            content: '';
            width: 2px;
            height: 66px;
            background: #fff;
            opacity: .2;
        }
    }
    &-right {
        flex: 1;
        width: 0;
        padding-right: 16px;
        font-size: 26px;
        &-top {
            display: flex;
            align-items: center;;
        }
        &-bottom {
            margin-top: 4px;
        }
    }
}
.countdown {
    margin-left: 16px;
    > i {
        box-sizing: border-box;
        padding: 0 6px;
        text-align: center;
        min-width: 44px;
        line-height: 40px;
        background: #fff;
        border-radius: 8px;
        font-size: 26px;
        font-weight: bold;
        color: #6b32ee;
    }
    > em {
        padding: 0 8px;
        line-height: 40px;
        font-weight: bold;
    }
}
.progress {
    display: flex;
    align-items: baseline;
    &-text {
        display: flex;
        align-items: center;
        max-width: 300px;
        font-size: 22px;
        line-height: 32px;
        @include elps();
        > b {
            padding: 0 4px;
            font-size: 26px;
            color: #0fff73;
        }
    }
}

</style>
