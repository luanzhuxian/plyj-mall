<template>
    <div :class="$style.statistics">
        <Progress :class="$style.progress" v-bind="$attrs" />
        <div :class="$style.content">
            <div :class="$style.join">
                <div v-if="activityStatus === 1">活动还未开始奥~</div>
                <template v-else>
                    <span>加入</span>
                    <span :class="[$style.peopleNum, $style.green]"> {{ joinNum }} </span>
                    <span>人</span>
                </template>
            </div>
            <div :class="$style.description">累计公益金</div>
            <div :class="$style.price">
                <span :class="$style.num" v-for="(item,index) in price.pre" :key="index + 'pre'">{{ item }}</span>
                <span :class="$style.dot">.</span>
                <span :class="$style.num" v-for="(item,index) in price.suf" :key="index + 'suf'">{{ item }}</span>
                <span>元</span>
            </div>
            <div :class="$style.timeout">
                <template v-if="activityStatus === 1 || activityStatus === 2">
                    <span v-if="activityStatus === 1">距活动开始仅剩</span>
                    <span v-else>距活动结束仅剩</span>
                    <span :class="[$style.green]">
                        <i v-if="isDayShow">{{ d }}</i><span v-if="isDayShow">天</span><i v-text="h" /><span>:</span><i v-text="m" /><span>:</span><i v-text="s" />
                    </span>
                </template>
                <span v-else-if="activityStatus === 3">
                    活动已过期
                </span>
                <span v-else-if="activityStatus === 4">
                    活动已结束
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { Countdown } from '.././../../../assets/js/util'
import Progress from './Progress'
export default {
    name: 'Statistics',
    components: {
        Progress
    },
    props: {
        joinNum: {
            type: Number,
            default: 0
        },
        donationAmount: {
            type: Number,
            default: 0
        },
        countdown: {
            type: Number,
            default: 0
        },
        // 1 未开始 2 进行中，3 已过期，4 已结束
        activityStatus: {
            type: Number,
            default: 1
        }
    },
    data () {
        return {
            timer: null,
            d: 0,
            h: '00',
            m: '00',
            s: '00'
        }
    },
    deactivated () {
        this.done()
    },
    methods: {
        setTime ({ seconds, minutes, hours, days }) {
            this.d = String(days).padStart(2, '0')
            this.h = String(hours).padStart(2, '0')
            this.m = String(minutes).padStart(2, '0')
            this.s = String(seconds).padStart(2, '0')
        },
        done () {
            this.timer && this.timer.stop()
            this.timer = null
        }
    },
    watch: {
        countdown (news) {
            if (news <= 0) {
                return
            }

            this.timer = new Countdown(Math.abs(news), data => {
                if (data) {
                    this.setTime(data)
                } else {
                    this.done()
                    this.$emit('done')
                }
            })
            this.timer.start()
        }
    },
    computed: {
        price () {
            const price = this.donationAmount.toFixed(2)
            const [pre, suf] = price.split('.')
            return { pre, suf }
        },
        isDayShow () {
            return this.d && this.d !== '00'
        }
    }
}
</script>

<style module lang='scss'>

.statistics {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 560px;
    height: 560px;
    border-radius: 50%;
    overflow: hidden;
    > .progress {
        position: absolute;
        top: 0;
        left: 0;
    }
    > .content {
        width: 480px;
        height: 480px;
        padding: 98px 0;
        box-sizing: border-box;
        font-size: 24px;
        color: #fff;
        background: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/粽子.png') 100%/100% no-repeat;
        > .join {
            display: flex;
            justify-content: center;
            align-items: baseline;
            margin-bottom: 42px;
            > .people-num {
                margin: 0 8px;
                font-size: 32px;
                font-weight: bold;
            }
        }
        > .description {
            font-size: 26px;
            font-weight: bold;
        }
        > .price {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0 36px 0;
            font-size: 46px;
            font-weight: bold;
            color: #11fe73;
            > .num {
                display: inline-block;
                box-sizing: border-box;
                width: 46px;
                line-height: 58px;
                margin-right: 4px;
                border: 2px solid #11fe73;
                border-radius: 5px;
            }
            > .dot {
                position: relative;
                top: 5px;
            }
            > span:nth-last-of-type(1) {
                margin: 0 0 0 4px;
                font-size: 24px;
                font-weight: 400;
                border: none;
                color: #fff;
            }
        }
        > .timeout {
            font-size: 24px;
            > .green {
                margin-left: 4px;
                font-size: 20px;
            }
        }
        .green {
            color: #11fe73;
        }
    }
}

</style>
