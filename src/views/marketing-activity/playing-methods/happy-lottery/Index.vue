<template>
    <div
        :class="$style.lottery"
        :style="theme"
    >
        <div :class="$style.countDown">
            <span v-if="status === 2">距活动结束</span>
            <span v-else-if="status === 1">距活动开始</span>
            <span v-else>活动已结束</span>
            <template v-if="date">
                <i>{{ date.days }}天 {{ date.hours }}小时 {{ date.minutes }}分钟</i>
            </template>

        </div>

        <div :class="$style.joinCount">
            <i>已有{{ detail.joinUserNumber }}人参与</i>
        </div>

        <div :class="$style.dial">
            <div
                v-for="(item, i) of turntableAwards.slice(0, 4)"
                :key="i"
                :data-index="i"
                :class="{
                    [$style.dialItem]: true,
                    [$style.first]: item.grade === '一等奖',
                    [$style.activity]: item.x === currentX && item.y === currentY
                }"
            >
                <img :src="item.icon" alt="icon">
                <span v-text="item.grade" />
            </div>
            <div :class="[$style.dialItem, $style.count]">
                <span>我的次数</span>
                <span>x{{ count }}</span>
            </div>
            <div
                v-for="(item, i) of turntableAwards.slice(4)"
                :key="i + 4"
                :data-index="i + 4"
                :class="{
                    [$style.dialItem]: true,
                    [$style.first]: item.grade === '一等奖',
                    [$style.activity]: item.x === currentX && item.y === currentY
                }"
            >
                <img :src="item.icon" alt="icon">
                <span v-text="item.grade" />
            </div>
        </div>

        <button :disabled="drawing" @click="drawLottery" :class="$style.startBtn" />

        <h2 :class="$style.title">活动奖品</h2>
        <ul :class="$style.prizeList">
            <li
                :class="$style.prize"
                v-for="(prize, i) of awardList"
                :key="i"
            >
                <img v-if="Number(prize.awardType) === 2" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/scholarship.png" alt="奖品图片">
                <img v-else-if="Number(prize.awardType) === 3 || Number(prize.awardType) === 4" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/coupon.png" alt="奖品图片">
                <img v-else :src="prize.giftImage" alt="奖品图片">
                <div>
                    <strong :class="[$style.grade, $style.first]" v-text="prize.grade" />
                    <span :class="$style.name" v-text="prize.awardName" />
                </div>
            </li>
        </ul>

        <div :class="$style.prizeRecords">
            <LotteryTabs v-model="prizeType">
                <LotteryTabPane label="我的奖品" value="1">
                    <ul :class="[$style.records]" v-if="awardRecords.length">
                        <li
                            :class="$style.myPrize"
                            v-for="(item, i) of awardRecords"
                            :key="i"
                        >
                            <img v-if="item.awardType === 2" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/scholarship.png" alt="">
                            <img v-else-if="item.awardType === 3 || item.awardType === 4" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/coupon.png" alt="">
                            <img v-else :src="item.giftImg" alt="">
                            <div>
                                <p :class="$style.name" v-text="item.awardName" />
                                <p :class="$style.date" v-text="item.awardTime" />
                            </div>
                        </li>
                    </ul>
                    <img :class="$style.noPrize" v-else height="300" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/no-awards.png" alt="">
                </LotteryTabPane>
                <LotteryTabPane label="获奖记录" value="2">
                    <ul :class="[$style.records]" v-if="lotteryRecords.length">
                        <li
                            :class="$style.record"
                            v-for="(item, i) of lotteryRecords"
                            :key="i"
                        >
                            <img v-if="item.awardType === 2" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/scholarship.png" alt="">
                            <img v-else-if="item.awardType === 3 || item.awardType === 4" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/coupon.png" alt="">
                            <img v-else :src="item.giftImg" alt="">
                            <div>
                                <div class="flex space-between">
                                    <span :class="$style.username" v-text="item.userName" />
                                    <p :class="$style.date" v-text="item.awardTime" />
                                </div>
                                <div :class="$style.prizeName">
                                    获得{{ item.awardLevel | sectionToChinese }}等奖{{ item.awardName }}
                                </div>
                            </div>
                        </li>
                    </ul>
                    <img :class="$style.noPrize" v-else height="300" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/no-awards.png" alt="">
                </LotteryTabPane>
            </LotteryTabs>
        </div>
        <SilkBag :detail="detail" />
        <Poster />
    </div>
</template>

<script>
import LotteryTabs from './components/Lottery-Tabs.vue'
import LotteryTabPane from './components/Lottery-Tab-Pane.vue'
import Poster from './components/Poster.vue'
import SilkBag from './components/Silk-Bag.vue'
import { SectionToChinese } from '../../../../assets/js/util'
import { shuffle } from '../../../../assets/js/loadsh'
import moment from 'moment'
import {
    getAwardRecords,
    getDetail,
    getLotteryCount,
    getLotteryRecords,
    lottery
} from '../../../../apis/longmen-festival/lottery'
import Countdown from '../../../../assets/js/Countdown'

let countDownInstance = null
const AWARD_ICON = [
    'https://mallcdn.youpenglai.com/static/mall/lottery/first-prize.png',
    'https://mallcdn.youpenglai.com/static/mall/lottery/second-prize.png',
    'https://mallcdn.youpenglai.com/static/mall/lottery/third-prize.png'
]
// 旋转的角度
let angle = Math.PI / 4
let velocity = 5
// 位置变化量（最后的速度）
const C = 500
// 初始位置（初始的速度）
const B = velocity
// 转盘的总转动次数
const D = 35
// 当前转动第几次了
let t = 0

export default {
    name: 'LotteryAvtivity',
    components: {
        LotteryTabs,
        LotteryTabPane,
        SilkBag,
        Poster
    },
    data () {
        return {
            theme: null,
            theme1: {
                '--bg': 'url(https://mallcdn.youpenglai.com/static/mall/lottery/lottery-bg.png)',
                '--bgc': '#ffb5b0'
            },
            date: null,
            // 抽奖机会（次）
            count: 0,
            // 要显示在转盘上的奖品，如果奖品时8个，那么就等于awards，如果不是8个，需要填充
            turntableAwards: [],
            // 当前抽中的奖品的下标
            currentPrize: 0,
            // 奖品列表
            awardList: [],
            // 详情
            detail: {},
            // 状态
            status: '',
            // 获奖记录
            lotteryRecords: [],
            // 我的奖品
            awardRecords: [],
            currentX: -1,
            currentY: -1,
            prizeType: '1',
            // 是否正在抽奖
            drawing: false
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async activated () {
        this.theme = this.theme1
        await this.getDetail()
    },
    methods: {
        // 活动详情
        async getDetail () {
            try {
                const { result } = await getDetail(this.id)
                this.awardList = result.gifts
                this.detail = result
                this.status = Number(result.status)
                await this.$nextTick()
                this.setAwards()
                await this.getRecords()
                await this.countDown()
            } catch (e) {
                this.$router.replace({ name: 'Home' })
                throw e
            }
        },
        // 设置奖品
        setAwards () {
            let turntableAwards = []
            let index = 0
            for (const [i, award] of this.awardList.entries()) {
                award.grade = i < 3 ? `${ SectionToChinese(i + 1) }等奖` : '好礼'
                turntableAwards.push({
                    ...award,
                    icon: AWARD_ICON[i]
                })
            }
            for (let i = this.awardList.length; i < 8; i++) {
                turntableAwards.push({
                    id: i,
                    grade: '谢谢参与',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/lottery/no-prize.png',
                    awardType: -1
                })
            }
            // 打乱奖品数据
            turntableAwards = shuffle(turntableAwards)
            // 为奖品模块设置坐标
            for (let y = 0; y < 3; y++) {
                for (let x = 0; x < 3; x++) {
                    if (x === 1 && y === 1) {
                        continue
                    }
                    const award = turntableAwards[index]
                    award.x = x
                    award.y = y
                    index++
                }
            }
            this.turntableAwards = turntableAwards
        },
        // 倒计时
        async countDown () {
            if (countDownInstance) {
                countDownInstance.stop()
            }
            try {
                const currentTime = await Countdown.getServerTime()
                let duration = 0
                if (this.status === 1) {
                    duration = moment(this.detail.startTime).valueOf() - Number(currentTime)
                } else if (this.status === 2) {
                    duration = moment(this.detail.endTime).valueOf() - Number(currentTime)
                }
                if (duration) {
                    const toString = function (num) {
                        return String(num).padStart(2, '0')
                    }
                    // 启动倒计时
                    countDownInstance = new Countdown(duration, data => {
                        if (!data) return location.reload()
                        const { seconds, minutes, hours, days } = data
                        this.date = {
                            seconds: toString(seconds),
                            minutes: toString(minutes),
                            hours,
                            days
                        }
                    }, 1000 * 60)
                    countDownInstance.start()
                }
            } catch (e) {
                throw e
            }
        },
        // 获取奖品记录
        async getRecords () {
            try {
                const { result: count } = await getLotteryCount(this.id)
                this.count = count
                const { result: { records: awardRecords } } = await getAwardRecords(this.id)
                this.lotteryRecords = awardRecords
                const { result: { records: lotteryRecords } } = await getLotteryRecords(this.id)
                this.awardRecords = lotteryRecords
            } catch (e) {
                throw e
            }
        },
        // 开始抽奖
        async drawLottery () {
            if (this.drawing) return
            if (this.status === 1) return this.$warning('活动未开始')
            if (this.status === 3 || this.status === 4) return this.$warning('活动已结束')
            try {
                this.drawing = true
                const { result } = await lottery(this.id)
                // 找到中奖的坐标
                if (result.isAward) {
                    const { x, y } = this.turntableAwards.find(item => item.id === result.id)
                    this.prizeX = x
                    this.prizeY = y
                } else {
                    const { x, y } = this.turntableAwards.find(item => item.awardType === -1)
                    this.prizeX = x
                    this.prizeY = y
                }
                this.run()
            } catch (e) {
                this.drawing = false
                throw e
            }
        },
        // 旋转函数
        async rotate () {
            // 获取转盘的宽度
            const dialWidth = 3
            const dialHeight = 3
            // 圆的半径
            const R = dialWidth / 2 - 0.5
            // 转标的坐标
            const X = (dialWidth / 2 - Math.cos(angle) * R).toPrecision(2)
            const Y = (dialHeight / 2 - Math.sin(angle) * R).toPrecision(2)
            await this.setActivity(X, Y)
            angle += Math.PI / 4
            if (angle >= Math.PI * 2 + Math.PI / 4) {
                angle = Math.PI / 4
            }
        },

        /**
         * 判断当前转盘的位置（奖品）
         * 该函数通过传入的坐标可找到该坐标对应的奖品
         * 奖品是九宫格的，可以建设每个格子的大小是1x1，则转盘的大小就是3x3
         * @param x {String | Number}
         * @param y {String | Number}
         */
        async setActivity (x, y) {
            x = Number(x)
            y = Number(y)
            for (let x1 = 0; x1 < 3; x1++) {
                for (let y1 = 0; y1 < 3; y1++) {
                    if (x >= x1 && x < x1 + 1 && y >= y1 && y < y1 + 1) {
                        this.currentX = x1
                        this.currentY = y1
                        // 旋转的圈数够了，接下来定位到中奖的奖品
                        if ((t > D && (x1 !== this.prizeX || y1 !== this.prizeY)) || t <= D) {
                            this.run()
                        } else {
                            t = 0
                            this.drawing = false
                            // 获取奖品记录
                            await this.getRecords()
                        }
                    }
                }
            }
        },
        // 转起来，此函数觉得转的速度和转的方式
        run () {
            setTimeout(() => {
                velocity = C * t / D + B
                t++
                this.rotate()
            }, velocity)
        }
    }
}
</script>

<style module lang="scss">
    .lottery {
        padding-bottom: 100px;
        min-height: 100vh;
        background: var(--bgc) var(--bg) no-repeat center top;
        background-size: 100%;
        overflow: hidden;
    }

    .countDown {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 446px;
        margin: 253px auto 0;
        height: 58px;
        color: #fff;
        background-color: rgba(131, 61, 230, .37);
        border-radius: 21px 21px 21px 0;
        > span {
            margin-right: 20px;
            font-size: 20px;
        }
        > i {
            font-style: normal;
            font-size: 26px;
        }
    }
    .joinCount {
        position: relative;
        margin-top: 42px;
        text-align: center;
        font-size: 20px;
        line-height: 38px;
        color: #C36304;
    }

    .dial {
        width: 482px;
        height: 482px;
        padding: 15px;
        margin: 40px auto 0;
        @supports (display: grid) {
            display: grid;
            grid-template-rows: repeat(3, 154px);
            grid-template-columns: repeat(3, 154px);
            grid-gap: 10px;
        }
        @supports not (display: grid) {
            display: flex;
            flex-wrap: wrap;
            align-content: space-between;
            justify-content: space-between;
            .dialItem {
                width: 154px;
                height: 154px;
            }
        }
        .dialItem {
            position: relative;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            padding-top: 116px;
            box-sizing: border-box;
            font-size: 20px;
            color: #FE570A;
            font-weight: bold;
            background: radial-gradient(circle, #fffaed 40%, #ffe6b5) no-repeat center center;
            background-size: 100% 100%;
            border-radius: 30px;
            &:before {
                position: absolute;
                content: '';
                background: url("https://mallcdn.youpenglai.com/static/mall/lottery/reflect-light.png") no-repeat center center;
                background-size: 100%;
                top: 6px;
                right: 6px;
                width: 40px;
                height: 36px;
            }
            &.first {
                > img {
                    top: 0;
                    width: 140px;
                    height: auto;
                }
            }
            > img {
                position: absolute;
                top: 20px;
                width: auto;
                height: 84px;
                z-index: 1;
            }
            span {
                z-index: 2;
            }
            &.activity {
                color: #fff;
                background: radial-gradient(circle, #FF9519, #FFEC5D 70%) no-repeat center center;
            }
            &.count {
                display: flex;
                flex-direction: column;
                padding-top: 27px;
                font-size: 24px;
                color: #fff;
                background: none;
                > span:nth-of-type(2) {
                    color: #FFEC5D;
                    font-size: 50px;
                }
                &:before {
                    content: none;
                }
            }
        }
    }
    .startBtn {
        display: block;
        margin: 0 auto;
        width: 255px;
        height: 164px;
        background: url("https://mallcdn.youpenglai.com/static/mall/lottery/start-btn.png") no-repeat center center;
        background-size: 100%;
        &:active {
            transform-origin: center bottom;
            transform: scaleY(0.9);
        }
    }
    .title {
        font-size: 0;
        margin: 164px auto 0;
        width: 287px;
        height: 65px;
        background: url("https://mallcdn.youpenglai.com/static/mall/lottery/activity-award.png") no-repeat center center;
        background-size: 287px;
    }
    @mixin listBg {
        width: 702px;
        margin-left: 22px;
        margin-top: 36px;
        padding: 64px 0;
        background-color: #fff;
        border-radius: 30px;
        box-shadow: 10px 17px 0 #F58882;
    }
    .prizeList {
        @include listBg();
        > .prize {
            display: flex;
            align-items: flex-start;
            margin-bottom: 30px;
            padding: 0 54px;
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }
            > img {
                width: 160px;
                height: 160px;
                object-fit: cover;
                margin-right: 30px;
            }
            .grade {
                display: block;
                margin-top: 24px;
                font-size: 36px;
                color: #BE9B62;
                &.first {
                    color: #E63303;
                }
                &.second {
                    color: #F79F1A;
                }
            }
            .name {
                display: block;
                margin-top: 16px;
                font-size: 28px;
                @include elps-wrap(2);
            }
        }
    }
    .prizeRecords {
        @include listBg();
    }
    .records {
        padding: 60px 54px;
        > .myPrize {
            display: flex;
            margin-bottom: 40px;
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }
            > img {
                width: 120px;
                height: 120px;
                margin-right: 30px;
            }
            > div {
                padding-top: 18px;
                > .name {
                    margin-bottom: 10px;
                    font-size: 28px;
                }
                > .date {
                    font-size: 24px;
                    color: $--font-color_gray3;
                }
            }
        }
        > .record {
            display: flex;
            align-items: flex-start;
            margin-bottom: 48px;
            > div {
                padding-top: 6px;
            }
            > img {
                width: 96px;
                height: 96px;
                margin-right: 24px;
                border-radius: 48px;
            }
            .username {
                font-size: 28px;
                width: 230px;
                @include elps();
            }
            .date {
                font-size: 24px;
                color: $--font-color_gray3;
            }
            .prizeName {
                margin-top: 10px;
                font-size: 24px;
                color: #F79F1A;
            }
        }
    }
    .noPrize {
        display: block;
        margin: 50px auto 0;
    }
</style>
