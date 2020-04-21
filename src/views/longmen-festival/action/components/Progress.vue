<template>
    <div :class="$style.progress">
        <svg viewBox="0 0 100 100">
            <path :d="trackPath"
                  stroke="#2B68DD"
                  :stroke-width="relativeStrokeWidth"
                  fill="none"
                  :style="trailPathStyle"
            />
            <path
                :d="trackPath"
                :stroke="color"
                fill="none"
                stroke-linecap="round"
                :stroke-width="percentage ? relativeStrokeWidth : 0"
                :style="circlePathStyle"
            />
        </svg>
        <div :class="$style.content">
            <div :class="$style.join">
                <!-- <div>活动还未开始奥~</div> -->
                <template>
                    <span>加入</span>
                    <span :class="[$style.peopleNum, $style.green]"> 227163 </span>
                    <span>人</span>
                </template>
            </div>
            <div :class="$style.description">累计公益金</div>
            <div :class="$style.price">
                <span :class="$style.num" v-for="item in 5" :key="item">{{ item }}</span>
                <span :class="$style.dot">.</span>
                <span :class="$style.num" v-for="item in 2" :key="item + '-'">0</span>
                <span>元</span>
            </div>
            <div :class="$style.timeout">
                <span>距活动开始仅剩</span>
                <span :class="[$style.green]">2天 23:56:56</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Progress',
    props: {
        width: {
            type: Number,
            default: 180
        },
        color: {
            type: String,
            default: '#20a0ff'
        },
        percentage: {
            type: Number,
            default: 0
        }
    },
    computed: {
        radius () {
            return parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10)
        },
        perimeter () {
            return 2 * Math.PI * this.radius
        },
        rate () {
            return this.type === 'dashboard' ? 0.75 : 1
        },
        relativeStrokeWidth () {
            return (6 / this.width * 100).toFixed(1)
        },
        trackPath () {
            const radius = this.radius
            return `
                M 50 50
                m 0 -${ radius }
                a ${ radius } ${ radius } 0 1 1 0 ${ radius * 2 }
                a ${ radius } ${ radius } 0 1 1 0 -${ radius * 2 }
            `
        },
        trailPathStyle () {
            return {
                strokeDasharray: `${ (this.perimeter * this.rate) }px, ${ this.perimeter }px`,
                strokeDashoffset: this.strokeDashoffset
            }
        },
        circlePathStyle () {
            return {
                strokeDasharray: `${ this.perimeter * this.rate * (this.percentage / 100) }px, ${ this.perimeter }px`,
                strokeDashoffset: this.strokeDashoffset,
                transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
            }
        }
    }
}
</script>

<style module lang='scss'>

    .progress {
        position: relative;
        width: 560px;
        height: 560px;
        border-radius: 50%;
        overflow: hidden;
        > .content {
            position: absolute;
            left: 40px;
            top: 40px;
            width: 480px;
            height: 480px;
            padding: 98px 0;
            box-sizing: border-box;
            font-size: 24px;
            color: #FFFFFF;
            background: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/粽子.png') no-repeat;
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
                color: #11FE73;
                > .num {
                    display: inline-block;
                    box-sizing: border-box;
                    width: 46px;
                    line-height: 58px;
                    margin-right: 4px;
                    border: 2px solid #11FE73;
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
                    color: #FFFFFF;
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
                color: #11FE73;
            }
        }
    }

</style>
