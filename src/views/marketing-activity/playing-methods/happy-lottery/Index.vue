<template>
    <div
        :class="$style.lottery"
        :style="theme"
    >
        <div :class="$style.countDown">
            <span>距活动结束</span>
            <i>21天 12小时 23分钟</i>
        </div>

        <div :class="$style.joinCount">
            <i>已有2333人参与</i>
        </div>

        <div :class="$style.dial">
            <div
                v-for="(item, i) of turntableAwards.slice(0, 4)"
                :key="i"
                :data-index="i"
                :class="{
                    [$style.dialItem]: true,
                    [$style.first]: item.grade === '一等奖',
                    [$style.activity]: i === currentPrize
                }"
            >
                <img :src="item.icon" alt="icon">
                <span v-text="item.grade" />
            </div>
            <div :class="[$style.dialItem, $style.count]">
                <span>我的次数</span>
                <span>x1</span>
            </div>
            <div
                v-for="(item, i) of turntableAwards.slice(4)"
                :key="i + 4"
                :data-index="i + 4"
                :class="{
                    [$style.dialItem]: true,
                    [$style.first]: item.grade === '一等奖',
                    [$style.activity]: false
                }"
            >
                <img :src="item.icon" alt="icon">
                <span v-text="item.grade" />
            </div>
        </div>

        <button @click="drawLottery" :class="$style.startBtn" />

        <h2 :class="$style.title">活动奖品</h2>
        <ul :class="$style.prizeList">
            <li :class="$style.prize">
                <img src="https://mallcdn.youpenglai.com/static/mall/lottery/prize-bg.png" alt="奖品图片">
                <div>
                    <strong :class="[$style.grade, $style.first]">一等奖</strong>
                    <span :class="$style.name">最好的礼品伴手礼</span>
                </div>
            </li>
            <li :class="$style.prize">
                <img src="https://mallcdn.youpenglai.com/static/mall/lottery/prize-bg.png" alt="奖品图片">
                <div>
                    <strong :class="[$style.grade, $style.second]">二等奖</strong>
                    <span :class="$style.name">最好的礼品伴手礼</span>
                </div>
            </li>
            <li :class="$style.prize">
                <img src="https://mallcdn.youpenglai.com/static/mall/lottery/prize-bg.png" alt="奖品图片">
                <div>
                    <strong :class="$style.grade">三等奖</strong>
                    <span :class="$style.name">最好的礼品伴手礼</span>
                </div>
            </li>
            <li :class="$style.prize">
                <img src="https://mallcdn.youpenglai.com/static/mall/lottery/prize-bg.png" alt="奖品图片">
                <div>
                    <strong :class="$style.grade">四等奖</strong>
                    <span :class="$style.name">最好的礼品伴手礼</span>
                </div>
            </li>
        </ul>

        <div :class="$style.prizeRecords">
            <LotteryTabs>
                <LotteryTabPane label="我的奖品" value="1">
                    <ul :class="[$style.records]">
                        <li :class="$style.myPrize">
                            <img src="https://mallcdn.youpenglai.com/static/mall/lottery/prize-bg.png" alt="奖品图片">
                            <div>
                                <p :class="$style.name">这是一个奖品的名称</p>
                                <p :class="$style.date">2020.0203 15:39:20</p>
                            </div>
                        </li>
                        <li :class="$style.myPrize">
                            <img src="https://mallcdn.youpenglai.com/static/mall/lottery/prize-bg.png" alt="奖品图片">
                            <div>
                                <p :class="$style.name">这是一个奖品的名称</p>
                                <p :class="$style.date">2020.0203 15:39:20</p>
                            </div>
                        </li>
                    </ul>
                </LotteryTabPane>
                <LotteryTabPane label="获奖记录" value="2">
                    <ul :class="[$style.records]">
                        <li :class="$style.record">
                            <img src="https://mallcdn.youpenglai.com/static/mall/lottery/prize-bg.png" alt="奖品图片">
                            <div>
                                <div class="flex space-between">
                                    <span :class="$style.username">法外狂徒张三</span>
                                    <span :class="$style.date">2020.0203 15:39:20</span>
                                </div>
                                <div :class="$style.prizeName">获得三等奖5元优惠券</div>
                            </div>
                        </li>
                        <li :class="$style.record">
                            <img src="https://mallcdn.youpenglai.com/static/mall/lottery/prize-bg.png" alt="奖品图片">
                            <div>
                                <div class="flex space-between">
                                    <span :class="$style.username">法外狂徒张三</span>
                                    <span :class="$style.date">2020.0203 15:39:20</span>
                                </div>
                                <div :class="$style.prizeName">获得三等奖5元优惠券</div>
                            </div>
                        </li>
                    </ul>
                </LotteryTabPane>
            </LotteryTabs>
        </div>

        <div :class="[$style.fixedTop, $style.poster]">分享海报</div>
        <div :class="[$style.fixedTop, $style.activityIntro]">活动锦囊</div>
    </div>
</template>

<script>
import LotteryTabs from './components/Lottery-Tabs.vue'
import LotteryTabPane from './components/Lottery-Tab-Pane.vue'
import { SectionToChinese } from '../../../../assets/js/util'
import { shuffle } from '../../../../assets/js/loadsh'
import moment from 'moment'
import {
    getAwardRecords,
    getDetail,
    getLotteryCount,
    getLotteryRecords
} from '../../../../apis/longmen-festival/lottery'
import Countdown from '../../../../assets/js/Countdown'

// 是否正在抽奖
// let drawing = false
let countDownInstance = null
const AWARD_ICON = [
    'https://mallcdn.youpenglai.com/static/mall/lottery/first-prize.png',
    'https://mallcdn.youpenglai.com/static/mall/lottery/second-prize.png',
    'https://mallcdn.youpenglai.com/static/mall/lottery/third-prize.png'
]
// 旋转的角度
let angle = Math.PI / 4
export default {
    name: 'LotteryAvtivity',
    components: {
        LotteryTabs,
        LotteryTabPane
    },
    data () {
        return {
            theme: null,
            theme1: {
                '--bg': 'url(https://mallcdn.youpenglai.com/static/mall/lottery/lottery-bg.png)',
                '--bgc': '#ffb5b0'
            },
            // 要显示在转盘上的奖品，如果奖品时8个，那么就等于awards，如果不是8个，需要填充
            turntableAwards: [],
            // 当前抽中的奖品的下标
            currentPrize: 0,
            // 奖品列表
            awardList: [
                { id: '1' },
                { id: '2' },
                { id: '3' }
            ],
            // 详情
            detail: null,
            // 状态
            status: '',
            // 获奖记录
            lotteryRecords: [],
            // 我的奖品
            awardRecords: []
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    created () {
        this.theme = this.theme1
        // await this.getDetail()
        this.setAwards()
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
                // this.$router.replace({ name: 'Home' })
                throw e
            }
        },
        // 设置奖品
        setAwards () {
            const turntableAwards = []
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
            this.turntableAwards = shuffle(turntableAwards)
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
                    })
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
        drawLottery () {
            const A = Number.parseInt(Math.random() * 10)
            console.log(A)
            this.loop()
            // 顺时针旋转，每次转45度，以转盘的中心坐标为原点
        },
        loop () {
            // 获取转盘的宽度
            // const dial = document.querySelector(`.${ this.$style.dial }`)
            const dialWidth = 3
            const dialHeight = 3
            // 原点坐标，转盘将围绕此点顺时针旋转，每次旋转45度，求圆上的点在哪个奖品上即可知道转到哪个商品上了
            const ORIGINAL_POINT = [dialWidth / 2, dialHeight / 2]
            // 圆的半径
            const R = dialWidth / 2
            // 转标的坐标
            const X = (dialWidth / 2 - Math.cos(angle) * R).toPrecision(2)
            const Y = (dialHeight / 2 - Math.sin(angle) * R).toPrecision(2)
            console.log(ORIGINAL_POINT, X, Y, angle)
            angle += Math.PI / 4
            if (angle === Math.PI * 2 + Math.PI / 4) {

            }
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
                    font-size: 60px;
                }
                &:before {
                    content: none;
                }
            }
            /*width: 154px;*/
            /*height: 154px;*/
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
                width: 240px;
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

    .fixedTop {
        position: fixed;
        right: 0;
        top: 39px;
        padding: 30px 16px;
        text-align: center;
        width: 27px;
        font-size: 20px;
        font-weight: bold;
        border-radius: 20px 0 0 20px;
        &.poster {
            background: linear-gradient(180deg, #FFF0A2, #FFEFC6) no-repeat;
            color: #C36304;
        }
        &.activityIntro {
            top: 228px;
            background: linear-gradient(180deg, #FCD612, #FFB700) no-repeat;
            color: #fff;
        }
    }
</style>
