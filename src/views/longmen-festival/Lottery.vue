<template>
    <div :class="$style.lottery">
        <div :class="$style.container">
            <div :class="$style.lotteryBox">
                1
            </div>
            <div :class="$style.awards">
                <div :class="$style.title">
                    <pl-svg name="icon-present-6233e" width="32" />活动奖品
                </div>
                <div :class="$style.awardsBox">
                    <div :class="$style.inner" ref="inner">
                        <div :class="$style.content">
                            <div :class="$style.gift">
                                <img src="http://img0.imgtn.bdimg.com/it/u=2768793229,662123591&fm=26&gp=0.jpg" alt="">
                                <div>
                                    <div :class="$style.level">一等奖</div>
                                    <div :class="$style.name">豪华游艇一艘</div>
                                </div>
                            </div>
                            <div :class="$style.gift">
                                <img src="http://img0.imgtn.bdimg.com/it/u=2768793229,662123591&fm=26&gp=0.jpg" alt="">
                                <div>
                                    <div :class="$style.level">一等奖</div>
                                    <div :class="$style.name">豪华游艇一艘</div>
                                </div>
                            </div>
                            <div :class="$style.gift">
                                <img src="http://img0.imgtn.bdimg.com/it/u=2768793229,662123591&fm=26&gp=0.jpg" alt="">
                                <div>
                                    <div :class="$style.level">一等奖</div>
                                    <div :class="$style.name">豪华游艇一艘</div>
                                </div>
                            </div>
                            <div :class="$style.gift">
                                <img src="http://img0.imgtn.bdimg.com/it/u=2768793229,662123591&fm=26&gp=0.jpg" alt="">
                                <div>
                                    <div :class="$style.level">一等奖</div>
                                    <div :class="$style.name">豪华游艇一艘</div>
                                </div>
                            </div>
                        </div>
                        <!--<div :class="$style.demo" />-->
                        <!-- 灯 -->
                        <canvas ref="canvas" :class="$style.lights" />
                    </div>
                </div>
            </div>

            <div :class="$style.myAwards">
                <div :class="$style.tabs">
                    <div :class="{ [$style.tab]: true, [$style.active]: tab === 0 }" @click="tab = 0">我的奖品</div>
                    <div :class="{ [$style.tab]: true, [$style.active]: tab === 1 }" @click="tab = 1">获奖记录</div>
                </div>
                <div :class="$style.wrap">
                    <ul :class="$style.awardList">
                        <li :class="$style.awardItem">
                            <img src="http://img0.imgtn.bdimg.com/it/u=2768793229,662123591&fm=26&gp=0.jpg" alt="">
                            <div>
                                <div :class="$style.name">豪华游艇一艘</div>
                                <div :class="$style.date">2020.02.23</div>
                            </div>
                        </li>
                        <li :class="$style.awardItem">
                            <img src="http://img0.imgtn.bdimg.com/it/u=2768793229,662123591&fm=26&gp=0.jpg" alt="">
                            <div>
                                <div :class="$style.name">豪华游艇一艘</div>
                                <div :class="$style.date">2020.02.23</div>
                            </div>
                        </li>
                        <li :class="$style.awardItem">
                            <img src="http://img0.imgtn.bdimg.com/it/u=2768793229,662123591&fm=26&gp=0.jpg" alt="">
                            <div>
                                <div :class="$style.name">豪华游艇一艘</div>
                                <div :class="$style.date">2020.02.23</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 根据屏幕大小转换canvas中使用的长度大小
const transformSize = num => num / 7.5 * (window.innerWidth / 100)
/* eslint-disable */
// 白色灯泡的下标，后面灯泡的颜色交替更换，默认第0个，即左上角第一个
const WHITE_LIGHT_INDEX = 0
export default {
    name: 'Lottery',
    data () {
        return {
            tab: 0
        }
    },
    mounted () {
        // this.setLights()
    },
    methods: {
        setLights () {
            const canvas = this.$refs.canvas
            const inner = this.$refs.inner
            canvas.width = inner.offsetWidth
            canvas.height = inner.offsetHeight
            // 灯的大小
            const lightSize = 18
            console.log(lightSize)
            // 灯间距
            const linghtGap = 35
            // 灯的开始点位
            const lightStart = 48
            // 容器的周长
            const L = (canvas.width + canvas.height) * 2
            const ctx = canvas.getContext('2d')
            // 计算横着能放几个灯, 计算公式，18 * x + (x - 1) * 70 + 96 * 2 = canvas.width
            const lightCountX = (canvas.width + linghtGap - lightStart * 2) / (lightSize + linghtGap)
            // 计算竖着能放几个灯, 计算公式，18 * x + (x - 1) * 70 + 96 * 2 = canvas.height
            const lightCountY = (canvas.height + linghtGap - lightStart * 2) / (lightSize + linghtGap)
            // 灯的个数可能有小数部分，将小数部分计算成长度，增加至灯的间距
            const lightCountXInt = Number.parseInt(lightCountX)
            const lightCountYInt = Number.parseInt(lightCountY)
            // 计算横坐标间距的富余值，
            const linghtGapXAdded = (lightCountX - lightCountXInt) / (lightCountXInt - 1)
            const linghtGapYAdded = (lightCountY - lightCountYInt) / (lightCountYInt - 1)
            console.log(lightCountX, lightCountXInt, linghtGapXAdded)
            console.log(lightCountY, lightCountYInt, linghtGapYAdded)
            for (let i = 0; i < lightCountX; i++) {
                ctx.beginPath()
                // ctx.arc(105, 30, lightSize, 0, 2 * Math.PI)
                ctx.arc((lightStart + lightSize / 2) + (linghtGap + lightSize) * i, transformSize(30), lightSize, 0, 2 * Math.PI)
                ctx.fillStyle = '#fff'
                ctx.fill()
            }
            // ctx.beginPath()
            // ctx.arc(96 + 9, 30, lightSize, 0, 2 * Math.PI)
            // ctx.arc(96 + 9 + 18 + 140, 30, lightSize, 0, 2 * Math.PI)
            // ctx.arc(96 + 9 + 18 * 2  + 140 * 2, 30, lightSize, 0, 2 * Math.PI)
            // ctx.arc(96 + 9 + 18 * 3  + 140 * 3, 30, lightSize, 0, 2 * Math.PI)
            // ctx.arc(96 + 9 + 18 * 4  + 140 * 4, 30, lightSize, 0, 2 * Math.PI)
            // ctx.arc(96 + 9 + 18 * 5  + 140 * 5, 30, lightSize, 0, 2 * Math.PI)
            // ctx.fillStyle = '#fff'
            // ctx.fill()
        }
    }
}
</script>

<style module lang="scss">
    .lottery {
        background: #d7565d linear-gradient(90deg, #cc4e54 1px, transparent 2px, transparent 40px) -24px fixed;
        background-size: 40px 40px;
        > .container {
            padding-top: 40px;
            padding-bottom: 118px;
            background: linear-gradient(180deg, #cc4e54 1px, transparent 2px, transparent 40px) fixed;
            background-size: 40px 40px;
            overflow: auto;
        }
    }
    .lotteryBox {
        height: 1163px;
        background: url("https://mallcdn.youpenglai.com/static/admall/2.9.0/弹窗.png") no-repeat center center;
        background-size: 100%;
    }
    .awards {
        margin-top: 64px;
        margin-bottom: 64px;
        font-size: 0;
        > .title {
            margin: 0 auto;
            width: 270px;
            line-height: 60px;
            text-align: center;
            font-size: 32px;
            color: #E1302B;
            font-weight: bold;
            background-color: #FDEC5A;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            > svg {
                margin-right: 12px;
                vertical-align: -5px;
            }
        }
    }
    .awardsBox {
        width: 670px;
        margin: 0 auto;
        border: 10px solid #FDEC5A;
        border-radius: 78px;
        /*overflow: hidden;*/
        box-sizing: border-box;
        > .inner {
            position: relative;
            width: 650px;
            padding: 40px;
            background-color: #fd7a30;
            border: 2px solid #BF1E00;
            border-radius: 70px;
            box-sizing: border-box;
            > .content {
                min-height: 570px;
                padding: 16px;
                border-radius: 48px;
                z-index: 2;
                background-color: #fff;
            }
            .gift {
                display: flex;
                margin-bottom: 12px;
                overflow: hidden;
                background-color: #FE672A;
                border-radius: 32px;
                &:nth-last-of-type(1) {
                    margin-bottom: 0;
                }
                > img {
                    width: 156px;
                    height: 156px;
                    margin-right: 32px;
                }
                .level {
                    margin-top: 26px;
                    font-size: 36px;
                    color: #FCE804;
                }
                .name {
                    margin-top: 8px;
                    font-size: 32px;
                    color: #fff;
                }
            }
            > .lights {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
                width: 100%;
                height: 100%;
            }
        }
    }
    .my-awards {
        width: 670px;
        margin: 0 auto;
        > .tabs {
            display: flex;
            align-items: flex-end;
            height: 98px;
            > .tab {
                flex: 1;
                line-height: 80px;
                font-size: 32px;
                color: #653100;
                text-align: center;
                font-weight: bold;
                background-color: #F0AF00;
                border-radius: 32px 32px 0 0;
                transition: line-height .2s linear;
                &.active {
                    line-height: 98px;
                    background-color: #FFB31E;
                }
            }
        }
        > .wrap {
            padding: 32px 24px;
            background-color: #FFB31E;
        }
    }
    .awardList {
        padding: 16px 0 16px 32px;
        background-color: #fff;

    }
    .awardItem {
        display: flex;
        overflow: hidden;
        background-color: #fff;
        border-bottom: 2px solid #e7e7e7;
        &:nth-last-of-type(1) {
            border-bottom: none;
        }
        > img {
            width: 156px;
            height: 156px;
            margin: 16px 32px 16px 0;
        }
        > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .name {
            font-size: 36px;
            @include elps-wrap(1);
        }
        .date {
            margin-top: 8px;
            font-size: 28px;
            color: #999;
        }
    }
    .demo {
        width: 18px;
        height: 18px;
        border-radius: 9px;
        background-color: #fff;
    }
</style>
