<template>
    <div :class="$style.longmenAction">

        <header :class="$style.header">
            <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/public-goods.png" alt="">
            <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/public-goods-title.png" alt="">
            <div :class="$style.description">
                <p>用户累计捐赠公益金</p>
                <p>攻占疫情，学子携手贡献爱心公益活动</p>
            </div>
        </header>

        <main :class="$style.main">
            <Progress color="pink" :percentage="percentage" />
            <div :class="$style.activityHandle">
                <div @click="isShowRule = true">
                    <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/分享海报.png" alt="">
                    <span>活动规则</span>
                </div>
                <div>
                    <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/规则.png" alt="">
                    <span>分享海报</span>
                </div>
            </div>
        </main>

        <div :class="$style.publicContent">
            <div :class="$style.tabs">
                <div :class="{ [$style.active]: active === 0 }" @click="slide(0)">活动商品</div>
                <div :class="{ [$style.active]: active === 1 }" @click="slide(1)">公益榜单</div>
            </div>
            <swiper :options="swiperOption" ref="swiper" @slideChangeTransitionEnd="slideChangeTransitionEnd">
                <swiperSlide :class="$style.slide"> <Courses /> </swiperSlide>
                <swiperSlide :class="$style.slide"> <Crunchies />  </swiperSlide>
            </swiper>
        </div>

        <!-- 活动细则 -->
        <pl-popup
            :show="isShowRule"
            title="活动说明"
            @close="isShowRule = false"
        >
            <div :class="$style.ruleContent">
                <dl>
                    <dt>1.活动时间</dt>
                    <dd>21515</dd>
                </dl>
                <dl>
                    <dt>2.活动对象</dt>
                    <dd>21515</dd>
                </dl>
                <dl>
                    <dt>3.活动说明</dt>
                    <dd>21515</dd>
                </dl>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Progress from './components/Progress'
import Courses from './components/Courses'
import Crunchies from './components/Crunchies'
export default {
    name: 'LongmenAction',
    components: {
        swiper,
        swiperSlide,
        Progress,
        Courses,
        Crunchies
    },
    data () {
        return {
            isShowRule: false,
            percentage: 0,
            active: 0,
            swiperOption: {
                spaceBetween: 20
            }
        }
    },
    methods: {
        slide (index) {
            this.$refs.swiper.swiper.slideTo(index)
            this.active = index
        },
        slideChangeTransitionEnd () {
            this.active = this.$refs.swiper.swiper.activeIndex
        }
    }
}
</script>

<style module lang='scss'>

.longmen-action {
    box-sizing: border-box;
    min-height: 100vh;
    padding: 32px 24px;
    text-align: center;
    background-color: #1b5dda;
    > .header {
        > .description {
            margin-top: 22px;
            font-size: 28px;
            color: #fff;
            > p {
                line-height: 40px;
                text-align: center;
            }
        }
    }
    > .main {
        display: flex;
        justify-content: center;
        position: relative;
        margin: 24px 0 82px 0;
        > .activity-handle {
            display: flex;
            justify-content: space-between;
            position: absolute;
            bottom: -28px;
            width: 100%;
            > div {
                width: 106px;
                font-size: 24px;
                color: #fff;
                > img {
                    width: 106px;
                    height: 106px;
                    margin-bottom: 10px;
                }
            }
        }
    }
    > .public-content {
        > .tabs {
            display: flex;
            align-items: flex-end;
            height: 98px;
            > div {
                flex: 1;
                line-height: 80px;
                font-size: 32px;
                color: #fff;
                text-align: center;
                font-weight: bold;
                background-color: #c0d5fe;
                opacity: .8;
                border-radius: 32px 32px 0 0;
                transition: line-height .2s linear;
                &.active {
                    line-height: 98px;
                    color: #1b5cda;
                    opacity: 1;
                }
            }
        }
        .slide {
            overflow: hidden;
            border-radius: 0 0 32px 32px;
        }
    }
    .rule-content {
        box-sizing: border-box;
        padding: 40px;
        text-align: left;
        > dl {
            margin-bottom: 20px;
            font-size: 28px;
            color: #000;
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }
            > dt {
                margin-bottom: 10px;
                font-size: 32px;
                font-weight: bold;
            }
        }
    }
}

</style>
