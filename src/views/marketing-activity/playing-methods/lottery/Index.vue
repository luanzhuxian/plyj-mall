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

        <div :class="[$style.fixedTop, $style.poster]">分享海报</div>
        <div :class="[$style.fixedTop, $style.activityIntro]">活动锦囊</div>
    </div>
</template>

<script>
export default {
    name: 'LotteryAvtivity',
    data () {
        return {
            theme: null,
            theme1: {
                '--bg': 'url(https://mallcdn.youpenglai.com/static/mall/lottery/bg-1.png?t=121233)',
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
