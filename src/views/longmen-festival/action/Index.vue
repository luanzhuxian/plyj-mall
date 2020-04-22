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
            <Statistics
                :percentage="percentage"
                :join-num="statistics.orderNo"
                :countdown="countdown"
            />
            <div :class="$style.activityHandle">
                <div @click="isShowRule = true">
                    <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/分享海报.png" alt="">
                    <span>活动规则</span>
                </div>
                <div>
                    <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/规则.png" alt="">
                    <span>分享海报</span>
                </div>
                <Barrage :class="$style.barrage" :list="publicBenefitList" />
            </div>
        </main>

        <div :class="$style.publicContent">
            <div :class="$style.tabs">
                <div :class="{ [$style.active]: active === 0 }" @click="slide(0)">活动商品</div>
                <div :class="{ [$style.active]: active === 1 }" @click="slide(1)">公益榜单</div>
            </div>
            <swiper :options="swiperOption" ref="swiper" @slideChangeTransitionEnd="slideChangeTransitionEnd">
                <swiperSlide :class="$style.slide"> <Courses :activity-status="detail.definiteStatus" :list="detail.productList" /> </swiperSlide>
                <swiperSlide :class="$style.slide"> <Crunchies :amounts="myPublicBenefitAmounts" :list="publicBenefitList" />  </swiperSlide>
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
                    <dd>{{ detail.startTime }} 至 {{ detail.endTime }}</dd>
                </dl>
                <dl>
                    <dt>2.活动对象</dt>
                    <dd>{{ userScope[detail.userScope] }}</dd>
                </dl>
                <dl>
                    <dt>3.活动说明</dt>
                    <dd v-html="detail.activityDesc || ''">}</dd>
                </dl>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import moment from 'moment'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Statistics from './components/Statistics'
import Courses from './components/Courses'
import Crunchies from './components/Crunchies'
import Barrage from './components/Barrage'
import {
    getPublicBenefitDetail,
    getPublicBenefitStatistics,
    getPublicBenefitList
} from './../../../apis/longmen-festival/lottery'
export default {
    name: 'LongmenAction',
    components: {
        swiper,
        swiperSlide,
        Statistics,
        Courses,
        Crunchies,
        Barrage
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            isShowRule: false,
            percentage: 0,
            active: 0,
            swiperOption: {
                spaceBetween: 20
            },
            userScope: {
                0: '全部用户',
                1: 'Helper',
                2: '普通会员',
                3: '部分用户组'
            },
            detail: {
                productList: []
            },
            statistics: {
                // 加入人数
                orderNo: 0,
                // 累计公益金
                donationAmount: 0
            },
            // 我累计的公益金
            myPublicBenefitAmounts: 0,
            // 公益榜单
            publicBenefitList: [],
            // 据活动开始的时间戳
            countdown: 0,
            countdownTimer: null
        }
    },
    async activated () {
        try {
            await this.getStatistics()
            await Promise.all([
                this.getDetail(),
                this.getPublicBenefitList()
            ])
        } catch (e) { throw e }
    },
    deactivated () {
        window.clearTimeout(this.countdownTimer)
    },
    methods: {
        async getDetail () {
            try {
                const { result } = await getPublicBenefitDetail(this.id)
                const { productModels = [], courseModels = [] } = result
                const productList = productModels.concat(courseModels).map(item => ({
                    productId: item.productId,
                    // 商品为 1 课程为 2
                    productType: item.courseType ? 2 : 1,
                    img: item.productImage,
                    type: item.productTypeDesc || item.courseTypeDesc,
                    name: item.productName || item.courseName,
                    price: item.activityPrice,
                    donationAmount: item.donationAmount
                }))
                result.productList = productList
                // 进度
                this.percentage = (this.statistics.donationAmount / result.topAmount) * 100
                // 活动开始剩余时间戳
                this.countdown = moment(result.startTime).valueOf() - moment(result.systemTime).valueOf()
                // 未开始状态
                if (result.definiteStatus === 1) {
                    this.countdownTimer = setTimeout(() => {
                        window.location.reload()
                    }, this.countdown)
                }
                this.detail = result
            } catch (e) { throw e }
        },
        async getStatistics () {
            try {
                const { result } = await getPublicBenefitStatistics(this.id)
                this.statistics = result
            } catch (e) { throw e }
        },
        async getPublicBenefitList () {
            try {
                const { result } = await getPublicBenefitList(this.id)
                let amounts = 0
                for (const item of result) {
                    if (item.flag) amounts += item.donationAmount
                }
                this.myPublicBenefitAmounts = amounts
                this.publicBenefitList = result
            } catch (e) { throw e }
        },
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
            > .barrage {
                position: absolute;
                left: -24px;
                top: -70px;
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
            white-space: pre-wrap;
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
