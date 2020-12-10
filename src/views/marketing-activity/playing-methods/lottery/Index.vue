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
            <canvas />
        </div>

        <button :class="$style.startBtn" />

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
                <LotteryTabPane label="我的奖品">我的奖品</LotteryTabPane>
                <LotteryTabPane label="获奖记录">获奖记录</LotteryTabPane>
            </LotteryTabs>
        </div>

        <div :class="[$style.fixedTop, $style.poster]">分享海报</div>
        <div :class="[$style.fixedTop, $style.activityIntro]">活动锦囊</div>
    </div>
</template>

<script>
import LotteryTabs from './components/Lottery-Tabs.vue'
import LotteryTabPane from './components/Lottery-Tab-Pane.vue'
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
            }
        }
    },
    created () {
        this.theme = this.theme1
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
        width: 516px;
        height: 514px;
        margin: 40px auto 0;
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
