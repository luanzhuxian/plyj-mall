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
                :donation-amount="statistics.donationAmount"
                :join-num="statistics.orderNo"
                :countdown="countdown"
                :activity-status="detail.definiteStatus"
                @done="refresh"
            />
            <div :class="$style.activityHandle">
                <div @click="isShowRule = true">
                    <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/规则.png" alt="">
                    <span>活动规则</span>
                </div>
                <div @click="share">
                    <pl-svg v-if="createPosterLoading" name="icon-btn-loading" width="100" fill="#fff" class="rotate" style="margin-bottom:1.333333vw" />
                    <img v-else src="https://mallcdn.youpenglai.com/static/mall/2.9.0/分享海报.png" alt="">
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
                <swiperSlide :class="$style.slide">
                    <Courses
                        :activity-status="detail.definiteStatus"
                        :activity-id="id"
                        :list="detail.productList"
                    />
                </swiperSlide>
                <swiperSlide :class="$style.slide">
                    <Crunchies
                        :amounts="myPublicBenefitAmounts"
                        :list="publicBenefitList"
                    />
                </swiperSlide>
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
                    <dd :class="$style.activityDesc" v-html="detail.activityDesc || ''">}</dd>
                </dl>
            </div>
        </pl-popup>

        <!-- 海报 -->
        <Poster
            ref="poster"
            :data="detail"
            :share="shareUrl"
            :show-logo="detail.logoShow"
            :logo-url="detail.logoUrl"
        />

    </div>
</template>

<script>
import moment from 'moment'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Statistics from './components/Statistics'
import Courses from './components/Courses'
import Crunchies from './components/Crunchies'
import Barrage from './components/Barrage'
import Poster from './components/Poster'
import {
    getPublicBenefitDetail,
    getPublicBenefitStatistics,
    getPublicBenefitList
} from './../../../apis/longmen-festival/public-benefit'
import { mapGetters } from 'vuex'
export default {
    name: 'LongmenAction',
    components: {
        swiper,
        swiperSlide,
        Statistics,
        Courses,
        Crunchies,
        Barrage,
        Poster
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            createPosterLoading: false,
            shareUrl: '',
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
        // 格式化获取的各个规格商品，聚合为一个商品
        formatProductModels (productModels = []) {
            const obj = {}
            for (const item of productModels) {
                if (!obj[item.productId]) {
                    obj[item.productId] = { minPrice: item.activityPrice }
                } else {
                    const minPrice = obj[item.productId].minPrice
                    obj[item.productId].minPrice = minPrice > item.activityPrice ? item.activityPrice : minPrice
                }
            }

            return Object.keys(obj).map(key => {
                const list = productModels.filter(({ productId, activityPrice }) => (key === productId) && (obj[key].minPrice === activityPrice))
                return list.sort((next, pre) => next.donationAmount - pre.donationAmount)[0]
            })
        },
        // 聚合课程和商品
        formatProductList (productModels = [], courseModels = []) {
            return productModels.concat(courseModels).map(item => ({
                productId: item.productId,
                // 商品为 1 课程为 2
                productType: item.courseType ? 2 : 1,
                img: item.productImage,
                type: item.productTypeDesc || item.courseTypeDesc,
                name: item.productName || item.courseName,
                price: item.activityPrice,
                donationAmount: item.donationAmount
            }))
        },
        async getDetail () {
            try {
                const { result } = await getPublicBenefitDetail(this.id)

                // 活动不存在，弹出去
                if (result.definiteStatus === '') {
                    if (window.history.length > 1) {
                        return this.$router.go(-1)
                    }
                    return this.$router.replace({ name: 'home' })
                }

                // eslint-disable-next-line prefer-const
                let { productModels, courseModels } = result
                productModels = this.formatProductModels(productModels)
                result.productList = this.formatProductList(productModels, courseModels)

                // 进度
                this.percentage = (this.statistics.donationAmount / result.topAmount) * 100

                // definiteStatus 1未开始，2进行中，3已过期，4已结束
                if ([1, 2].indexOf(result.definiteStatus) !== -1) {
                    // 活动开始剩余或活动结束时间戳
                    const countdown = moment(result.startTime).valueOf() - moment(result.systemTime).valueOf()
                    this.countdown = countdown > 0 ? countdown : moment(result.endTime).valueOf() - moment(result.systemTime).valueOf()
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
                const { result } = await getPublicBenefitList({ activityId: this.id })
                let amounts = 0
                for (const item of result) {
                    if (item.flag) amounts += item.donationAmount
                }
                this.myPublicBenefitAmounts = amounts
                // 数据量可能很大，且都是静态展示数据，所以可以冻结
                this.publicBenefitList = Object.freeze(result)
            } catch (e) { throw e }
        },
        slide (index) {
            this.$refs.swiper.swiper.slideTo(index)
            this.active = index
        },
        slideChangeTransitionEnd () {
            this.active = this.$refs.swiper.swiper.activeIndex
        },
        async share () {
            try {
                this.createPosterLoading = true
                this.shareUrl = `${ this.mallUrl }/longmen-festival/action/${ this.id }?shareUserId=${ this.userId }&t=${ Date.now() }`
                await this.$nextTick()
                await this.$refs.poster.createPoster()
                this.createPosterLoading = false
            } catch (e) { throw e }
        },
        async refresh () {
            try {
                await this.getStatistics()
                await Promise.all([
                    this.getDetail(),
                    this.getPublicBenefitList()
                ])
            } catch (e) { throw e }
        }
    },
    computed: {
        ...mapGetters(['mallUrl', 'userId'])
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
            left: 0;
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
                top: -240px;
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
            > .activity-desc {
                line-height: 50px;
            }
        }
    }
}

</style>
