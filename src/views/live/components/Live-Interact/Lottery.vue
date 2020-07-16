<template>
    <div :class="[$style.lump, $style.lottery]" @click="getLotteryInfo">
        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/抽奖.png" alt="">
        <span :class="$style.title">抽奖</span>
        <div @click.stop :class="$style.container">
            <div :class="$style.mask" v-show="showMask" />

            <!-- 抽奖 -->
            <div v-show="isStart" :class="$style.lottery">
                <div :class="$style.wicket">
                    <div :class="$style.text">| | | | | | | | | |</div>
                </div>
            </div>

            <!-- 结果 -->
            <div v-if="isEnd" :class="$style.lotteryInfo">
                <div :class="$style.head">
                    <div :class="$style.title">抽奖结果</div>
                    <div v-if="isWin">恭喜您获得 {{ prize }}</div>
                    <div v-else>很遗憾，您与大奖擦肩而过</div>
                </div>

                <div :class="$style.content">
                    <template v-if="isWin">
                        <p :class="$style.tip">请等待主播联系你</p>
                        <img src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/中奖.png" alt="">
                    </template>
                    <img v-else src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/未中奖.png" alt="">
                </div>

                <div :class="$style.btn" @click.stop="confirm">
                    我知道了
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Lottery',
    inheritAttrs: false,
    props: {
        socket: {
            type: Object,
            default: null
        },
        userId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            showMask: false,
            isStart: false,
            isEnd: false,
            hasLotteryResult: false,
            isWin: false,
            prize: '',
            form: {},
            rules: {}
        }
    },
    methods: {
        async init () {
            try {
                await this.$nextTick()
                console.log('抽奖初始化')
                this.socket.off('message', this.start)
                this.socket.off('message', this.end)

                this.socket.on('message', this.start)
                this.socket.on('message', this.end)
            } catch (e) { throw e }
        },
        start (data) {
            const { EVENTS: { LOTTERY_START } } = window.PolyvLiveSdk
            data = JSON.parse(data)

            if (data.EVENT.toUpperCase() === LOTTERY_START.toUpperCase()) {
                this.showMask = true
                this.isStart = true
                this.isEnd = false
                this.hasLotteryResult = false
            }
        },
        end (data) {
            const { EVENTS: { LOTTERY_END } } = window.PolyvLiveSdk
            data = JSON.parse(data)

            if (data.EVENT.toUpperCase() === LOTTERY_END.toUpperCase()) {
                this.isStart = false
                this.isEnd = true
                this.showMask = true
                this.hasLotteryResult = true

                const { data: winnerList, prize } = data

                this.isWin = winnerList.some(item => item.userId === this.userId)
                this.prize = prize
            }
        },
        confirm () {
            this.showMask = false
            this.isEnd = false
        },
        getLotteryInfo () {
            if (this.hasLotteryResult) {
                this.showMask = true
                this.isEnd = true
                return
            }
            this.$alert({
                message: '抽奖',
                viceMessage: '主播暂未发起抽奖~'
            })
        }
    }
}
</script>

<style lang='scss' module>

@import './common.scss';

.lottery {
    > .container {
        display: flex;
        align-items: center;
        > .mask {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, .65);
        }
        > .lottery {
            position: fixed;
            top: 90px;
            left: 0;
            width: 100%;
            height: 812px;
            background: url('https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/抽奖中.png') no-repeat;
            background-size: contain;
            > .wicket {
                display: flex;
                align-items: flex-end;
                position: absolute;
                top: 354px;
                left: 248px;
                height: 148px;
                overflow: hidden;
                box-shadow: 0 10px 20px rgba(0, 0, 0, .65) inset;
                > .text {
                    width: 265px;
                    font-size: 40px;
                    font-weight: 500;
                    text-align: center;
                    animation: move .11s ease infinite;
                    @keyframes move {
                        0% {
                            transform: translateY(40px);
                        }
                        100% {
                            transform: translateY(-200px);
                        }
                    }
                }
            }
        }
        > .lottery-info {
            position: fixed;
            top: 370px;
            left: 106px;
            width: 540px;
            border-radius: 20px;
            background-color: #fff;
            > .head {
                padding: 32px 0;
                box-sizing: border-box;
                color: #fff;
                font-size: 26px;
                text-align: center;
                background: url('https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/中奖背景.png') no-repeat;
                > .title {
                    margin-bottom: 18px;
                    font-size: 38px;
                }
            }
            > .content {
                padding: 20px 44px;
                box-sizing: border-box;
                > .tip {
                    font-size: 26px;
                    text-align: center;
                    color: #666;
                }
                > img {
                    margin-top: 40px;
                    width: 190px;
                    height: 190px;
                }
            }
            > .btn {
                padding: 30px 0;
                text-align: center;
                font-size: 34px;
                color: #fe7700;
            }
        }
    }
}

</style>
