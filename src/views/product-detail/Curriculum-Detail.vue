<template>
    <div :class="$style.curriculum">
        <template v-if="loaded">
            <div :class="$style.bannerWrapper">
                <!-- 海报按钮 -->
                <div :class="$style.haibao">
                    <PlSvg :key="1" v-show="creating" name="icon-btn-loading" width="35" fill="#fff" class="rotate" />
                    <PlSvg
                        :key="2"
                        v-show="!creating"
                        name="icon-poster-512b1"
                        fill="#fff"
                        width="35"
                        @click="() => productActive === 7 ? createCharityPoster() : createPoster()"
                    />
                    <p>分享海报</p>
                </div>
                <Banner :banners="banners" />

                <!-- 弹幕 -->
                <Barrage
                    v-if="productActive === 7"
                    :class="$style.barrage"
                    :list="charityMembers"
                />
                <!-- 公益棕活动倒计时 -->
                <CharityCountdownBar
                    v-if="productActive === 7"
                    :class="$style.countDownBar"
                    :starttime="detail.currentTime"
                    :endtime="detail.activityEndTime"
                    :donation="charityStastics.donationAmount"
                    :total="charityStastics.topAmount"
                    @done="refresh"
                />
                <!-- 倒计时 -->
                <CountDown
                    v-else-if="isCountdownShow"
                    :class="[$style.countDownBar, $style.regular]"
                    :endtime="detail.regularSaleTime"
                    theme="orange"
                    prefix="距抢课开始仅剩"
                    @done="refresh"
                />
            </div>

            <InfoBox>
                <div :class="$style.priceBoxWrapper">
                    <!-- 公益活动进入 -->
                    <div :class="$style.priceBox" v-if="productActive === 7">
                        <div v-if="detail.priceType === 1" :class="$style.price" v-text="detail.sellingPrice" />
                        <div v-else :class="$style.free">免费</div>
                        <div :class="$style.original">
                            <div v-if="detail.priceType === 1" class="mr-30">
                                <template v-if="isPresent">
                                    售价：<del v-text="detail.sellingPrice" />
                                </template>
                                <template v-else-if="detail.originalPrice && detail.originalPrice !== detail.sellingPrice">
                                    原价：<del v-text="detail.originalPrice" />
                                </template>
                            </div>
                        </div>
                    </div>
                    <!-- 非公益活动进入 -->
                    <div :class="$style.priceBox" v-else>
                        <template v-if="isPresent">
                            <div :class="$style.free">赠课</div>
                        </template>
                        <template v-else>
                            <div v-if="detail.priceType === 1" :class="$style.price" v-text="detail.sellingPrice" />
                            <div v-else :class="$style.free">免费</div>
                        </template>
                        <div :class="$style.original">
                            <template v-if="detail.priceType === 1">
                                <div v-if="isPresent" class="mr-30">
                                    售价：<del v-text="detail.sellingPrice" />
                                </div>
                                <div v-else-if="detail.originalPrice && detail.originalPrice !== detail.sellingPrice" class="mr-30">
                                    原价：<del v-text="detail.originalPrice" />
                                </div>
                            </template>
                            <div v-if="Number(detail.showSales) === 1">
                                <span v-if="detail.sale === 0">正在热销中</span>
                                <template v-else>
                                    <span v-text="detail.sale" />人订阅
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- 公益棕用户头像 -->
                    <CharityJoin v-if="productActive === 7" :data="charityMembers" :donation="detail.donationAmount" />

                    <div :class="$style.priceRight" v-else-if="agentUser && detail.rebate">
                        <p class="fz-22 gray-1">
                            <span :class="$style.returnRunbi">
                                润笔
                            </span>
                            <i class="rmb" v-text="detail.rebate" />
                        </p>
                        <p class="fz-22 gray-3">
                            分享下单即可获得润笔
                        </p>
                    </div>
                </div>

                <!-- 课程名称 -->
                <DetailTitle :product-name="detail.courseName" />
                <!-- 课程描述 -->
                <DetailDesc v-text="detail.courseBrief" />
                <!-- 课程标签 -->
                <Tags :tags="detail.labelModels" />

                <Field
                    v-if="detail.lecturer"
                    :class="$style.field"
                    size="small"
                    icon="icon-teacher-d2398"
                    label="主讲人："
                    :content="detail.lecturer"
                />
                <Field
                    :class="$style.field"
                    size="small"
                    icon="icon-date"
                    label="有效期："
                    :content="getExpiration(detail)"
                />
            </InfoBox>

            <!-- 相关课程 -->
            <SlideCourses
                v-if="courseType === 1 && relatedCourses.length"
                :class="$style.slideCourses"
                :data="relatedCourses"
            />

            <!-- 公益棕活动规则 -->
            <CharityRule
                :class="$style.rule"
                v-if="productActive === 7"
                :detail="detail.activityBrief"
            />

            <Tabs
                :tabs="[{ label: '课程介绍', value: 1 }, { label: '目录', value: 2, hidden: courseType === 1 }]"
                v-model="tab"
            >
                <DetailInfo v-show="tab === 1" :content="detail.details || '暂无详情'" />
                <SeriseCourses
                    v-show="tab === 2"
                    :data="videoList"
                    :course-id="detail.id"
                    :order-id="detail.orderId"
                    :is-present="isPresent"
                    :is-buy="!!detail.isBuy"
                    :is-finish="!detail.haveNoVideo"
                    :status="Number(detail.status)"
                    :is-open-sale="detail.isOpenSale"
                    :course-status="detail.courseStatus"
                    @preview="previewCourse"
                />
            </Tabs>

            <!-- 订购须知 -->
            <Instructions v-if="detail.payNotice" title="订购须知" :content="detail.payNotice" />

            <!-- 底部购买 -->
            <div :class="$style.bottom" v-if="!~[5, 6].indexOf(productActive)">
                <div :class="$style.icons">
                    <router-link :class="$style.link + ' ' + $style.home" :to="{ name: 'Home' }">
                        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/首页选中.png" alt="">
                        <i :class="$style.text">首页</i>
                    </router-link>
                    <a v-if="servicePhoneModels.length === 1" :class="$style.link + ' ' + $style.contact" :href="'tel:' + servicePhoneModels[0].contactWay">
                        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/联系我们.png" alt="">
                        <i :class="$style.text">联系我们</i>
                    </a>
                    <a v-else :class="$style.link + ' ' + $style.contact" @click="showContact = true">
                        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/联系我们.png" alt="">
                        <i :class="$style.text">联系我们</i>
                    </a>
                </div>
                <div :class="$style.buttons">
                    <template v-if="canLearn">
                        <button
                            v-if="courseType === 1"
                            :class="$style.button + ' ' + $style.yellow"
                            :disabled="loading"
                            @click="$router.push({
                                name: 'CourseWatch',
                                params: {
                                    courseId: productId
                                },
                                query: {
                                    liveId: videoList[0].id,
                                    orderId: detail.orderId,
                                    progress: detail.learnProgress
                                }
                            })"
                        >
                            <span v-if="isPresent">获得赠课 去学习</span>
                            <span v-else>去学习</span>
                        </button>
                        <span v-if="courseType === 2" :class="$style.progress">
                            {{ `已学习 ${detail.learnedNumber}/${detail.totalLiveNumber} 节` }}
                        </span>
                    </template>
                    <template v-else>
                        <button
                            v-if="courseType === 1 && detail.supportWatch"
                            :class="$style.button + ' ' + $style.yellow"
                            :disabled="Number(detail.status) === 2 || loading"
                            @click="previewCourse(videoList[0])"
                        >
                            试看视频
                        </button>
                        <button
                            v-if="detail.isOpenSale === 1 && detail.courseStatus === 2"
                            :class="$style.button + ' ' + $style.orange"
                            disabled
                        >
                            即将开售
                        </button>
                        <button
                            v-if="detail.isOpenSale === 0 || (detail.isOpenSale === 1 && detail.courseStatus === 1)"
                            :class="$style.button + ' ' + $style.orange"
                            :disabled="Number(detail.status) === 2 || loading"
                            @click="submit"
                        >
                            立即订购
                        </button>
                    </template>
                </div>
            </div>

            <div
                :class="$style.buttomTip"
                v-if="Number(detail.status) === 2 && !~[5, 6].indexOf(productActive) && !detail.isBuy"
            >
                该视频课程已下架
            </div>

            <Contact :show.sync="showContact" />

            <!-- 试看视频 -->
            <VideoPlayer
                :show.sync="preview.show"
                :size="preview.size"
                :src="preview.url"
                :video-id="preview.id"
                :resource-id="detail.id"
                :resource-name="detail.courseName"
                :has-statistics="detail.courseType === 2"
            />

            <!-- 海报弹框 -->
            <PlMask :show.sync="showHaibao">
                <div :class="$style.saveHaibaoContent">
                    <img v-imgError :src="haibao" alt="">
                    <div :class="$style.saveButton">
                        长按识别或保存二维码，分享给朋友吧！
                    </div>
                </div>
            </PlMask>

            <!-- 公益棕海报 -->
            <CharityPoster
                v-if="productActive === 7"
                ref="charityPoster"
                :data="detail"
                :donation="detail.donationAmount"
                :share="shareUrl"
                :show-logo="detail.logoShow"
                :logo-url="detail.logoUrl"
            />
        </template>

        <!-- 骨架屏 -->
        <Skeleton v-else />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SET_SHARE_ID } from '../../store/mutation-type'
import Banner from '../../components/product-detail/Banner.vue'
import InfoBox from '../../components/product-detail/Info-Box.vue'
import DetailTitle from '../../components/product-detail/Title.vue'
import DetailDesc from '../../components/product-detail/Desc.vue'
import DetailInfo from '../../components/product-detail/Detail.vue'
import Tags from '../../components/product-detail/Tags.vue'
import Contact from '../../components/common/Contact.vue'
import Field from '../../components/product-detail/Field.vue'
import SlideCourses from '../../components/product-detail/Slide-Courses'
import SeriseCourses from '../../components/product-detail/Series-Courses'
import Instructions from '../../components/product-detail/Instructions.vue'
import CountDown from '../../components/product-detail/Courses-Count-Down.vue'
import CharityCountdownBar from './charity/Countdown-Bar.vue'
import CharityJoin from './charity/Join.vue'
import CharityRule from './charity/Rule.vue'
import CharityPoster from './charity/Poster.vue'
import Skeleton from '../../components/product-detail/Skeleton.vue'
import { share } from '../../assets/js/wechat/wechat-share'
import Barrage from '../marketing-activity/longmen-festival-2020/action/components/Barrage'
import VideoPlayer from '../../components/product-detail/Video-Player'
import Tabs from '../../components/product-detail/Tabs.vue'
import { getCourseDetail } from '../../apis/product'
import {
    getPublicBenefitStatistics,
    getPublicBenefitList
} from '../../apis/longmen-festival/public-benefit'
import Poster from './poster/Poster'

export default {
    name: 'CurriculumDetail',
    components: {
        Banner,
        InfoBox,
        DetailTitle,
        DetailDesc,
        Tags,
        DetailInfo,
        Contact,
        Field,
        SlideCourses,
        SeriseCourses,
        Instructions,
        CountDown,
        CharityCountdownBar,
        CharityJoin,
        CharityRule,
        CharityPoster,
        Skeleton,
        Barrage,
        VideoPlayer,
        Tabs
    },
    data () {
        return {
            // 1 单课 2 系列课
            courseType: 1,
            banners: [],
            relatedCourses: [],
            videoList: [],
            detail: {},
            agentProduct: false,
            tab: 2,
            loaded: false,
            loading: false,
            isPresent: false,
            showContact: false,
            preview: {
                show: false,
                id: '',
                url: '',
                fileSize: ''
            },
            haibao: '',
            creating: false,
            showHaibao: false,
            // 公益棕统计数据
            charityStastics: 0,
            // 公益榜单
            charityMembers: [],
            // 分享链接
            shareUrl: ''
        }
    },
    props: {
        productId: {
            type: String,
            default: null
        },
        brokerId: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['appId', 'userName', 'avatar', 'mobile', 'mallUrl', 'userId', 'agentUser', 'servicePhoneModels', 'courseTypeMap']),

        // 1 正常進入詳情 2  团购列表进去  3  秒杀列表进去 4  预购商品列表进去 5 从春耘活动进入 6 从组合课活动进入 7 公益棕活动进入
        productActive () {
            return (this.$route.query && Number(this.$route.query.currentProductStatus)) || 1
        },
        isCountdownShow () {
            const { isOpenSale = 0, courseStatus = 0, regularSaleTime } = this.detail
            return !this.canLearn && isOpenSale === 1 && courseStatus === 2 && regularSaleTime
        },
        canLearn () {
            return this.detail.isBuy || this.isPresent
        },
        activityId () {
            return this.$route.query.activityId || '1'
        }
    },
    watch: {
        async '$route' (to, from) {
            if (from.params.productId && to.params.productId) {
                try {
                    await this.refresh()
                } catch (error) {
                    throw error
                }
            }
        }
    },
    async activated () {
        try {
            await this.refresh()
        } catch (error) {
            throw error
        }
    },
    deactivated () {
        this.loaded = false
        this.loading = false
        this.creating = false
        this.showContact = false
        this.showHaibao = false
        this.haibao = ''
        this.preview.show = false
    },
    mounted () {
        this.$store.commit(SET_SHARE_ID, this.brokerId)
    },
    methods: {
        async refresh () {
            try {
                this.loaded = false
                this.loading = true
                const list = [
                    this.getDetail(),
                    ...(this.productActive === 7 ? [
                        this.getPublicBenefitStatistics(),
                        this.getPublicBenefitList()
                    ] : [])
                ]

                await Promise.all(list.map(p => p.catch(e => {
                    console.error(e)
                    return {}
                })))
                this.createShare()
                this.loaded = true
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

        /**
         * 获取商品详
         * @returns {Object} result - 商品详情
         * @property {String} result.id
         * @property {String} result.orderId
         * @property {String} result.courseName
         * @property {String} result.courseImg
         * @property {String} result.liveIds - 课程相关视频id，系列课是多个id用逗号拼接
         * @property {String} result.courseBrief
         * @property {String} result.lecturer
         * @property {String} result.details
         * @property {Number} result.sale
         * @property {Number} result.views
         * @property {Number} result.vodNumber - 点播量
         * @property {Number} result.watchTime
         * @property {Number} result.targetGroups
         * @property {Array} result.tagIds
         * @property {Number} result.courseType - 课程类型 (1 单课 2 系列课)
         * @property {Number} result.priceType - 价格类型 (0 免费 1 付费)
         * @property {Number} result.originalPrice - 原价
         * @property {Number} result.sellingPrice - 售价
         * @property {Number} result.validityType - 有效期类型 (0 不限制有效期 1 限制有效期)
         * @property {Number} result.validity - 有效期 / 天
         * @property {String} result.validityDate - 免费课截止日期
         * @property {Boolean} result.isBuy - 是否已购买
         * @property {String} result.learnProgress - 学习进度
         * @property {String} result.payNotice - 购买须知
         * @property {String} result.status - 状态 (1 上架 2 下架)
         * @property {Boolean} result.isOpenSale - 是否开启定时开售 (0 不开启 1 开启)
         * @property {Number} result.courseStatus - 开售状态 (1 已开售 2 未开售 0 默认值啥也不是)
         * @property {String} result.regularSaleTime - 定时开售时间
         * @property {Boolean} result.supportWatch - 是否支持试看 (单课程才有)
         * @property {String} result.supportWatchUrl - 试看地址
         * @property {Array} result.relatedCoursesModels - 单课的相关课程列表
         * @property {Array} result.videoLibEntities - 课程关联的视频资源列表
         * @property {Boolean} result.haveNoVideo - 系列课是否有课程未关联视频
         * @property {Number} result.totalLiveNumber - 系列课课程总数
         * @property {Number} result.learnedNumber - 系列课已经学习课程数
         */
        async getDetail () {
            try {
                // 此步是为了兼容处理，当当前产品的活动结束，重新刷新产品详情页面，当作普通商品
                const { result } = await getCourseDetail(this.productId, { productStatus: this.productActive })
                if (!result) {
                    this.$error('该课程异常')
                    this.$router.go(-1)
                    return
                }

                const {
                    courseType,
                    courseImg,
                    courseMainImg,
                    relatedCoursesModels,
                    videoLibEntities,
                    isGive
                } = result

                this.tab = courseType
                this.courseType = courseType
                this.banners = courseImg ? (courseMainImg.splice(0, 1, courseImg) && courseMainImg) : courseMainImg
                this.relatedCourses = relatedCoursesModels || []
                this.videoList = videoLibEntities || []
                this.isPresent = !!isGive
                this.detail = result

                return result
            } catch (e) {
                throw e
            }
        },
        // 查询公益棕活动统计数据
        async getPublicBenefitStatistics () {
            try {
                const { result } = await getPublicBenefitStatistics(this.activityId)
                this.charityStastics = result
                return result
            } catch (error) {
                throw error
            }
        },
        // 查询公益榜单
        async getPublicBenefitList () {
            try {
                const { result } = await getPublicBenefitList({ activityId: this.activityId, productId: this.productId })
                this.charityMembers = result
                return result
            } catch (error) {
                throw error
            }
        },
        getExpiration ({ validityType, validity, validityDate = '', priceType = 1 }) {
            return priceType === 1
                ? validityType
                    ? `购买后 ${ validity } 天内可观看学习`
                    : '购买后不限观看次数'
                : `订购后 ${ validityDate.split(' ')[0].replace(/-/g, '.') } 前可观看学习`
        },
        previewCourse ({ url, id, resourceSize }) {
            if (!url) {
                return this.$warning('该视频不支持试看')
            }
            this.preview.id = id
            this.preview.url = url
            this.preview.size = Number(resourceSize)
            this.preview.show = true
        },
        submit () {
            if (!this.mobile) {
                this.$confirm('您还没有绑定手机，请先绑定手机')
                    .then(() => {
                        sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                            name: this.$route.name,
                            params: this.$route.params,
                            query: this.$route.query
                        }))
                        this.$router.push({ name: 'BindMobile' })
                    })
                    .catch(() => {})
                return
            }
            this.$store.commit('submitOrder/setOrderProducts', {
                params: {
                    activeProduct: this.productActive,
                    preActivity: this.detail.preActivity,
                    activityId: this.activityId
                },
                products: [
                    {
                        productId: this.productId,
                        count: 1,
                        skuCode1: '',
                        skuCode2: '',
                        price: this.detail.sellingPrice,
                        productType: this.courseTypeMap[this.courseType]
                    }
                ]
            })
            this.$router.push({ name: 'SubmitOrder' })
        },
        // 生成分享
        createShare () {
            const { courseName, courseBrief, courseImg } = this.detail
            try {
                let shareUrl = ''
                if (this.userId) {
                    shareUrl = `${ this.mallUrl }/detail/curriculum/${ this.productId }/${ this.userId }?noCache=${ Date.now() }`
                } else {
                    shareUrl = `${ this.mallUrl }/detail/curriculum/${ this.productId }?noCache=${ Date.now() }`
                }
                // TODO: 以后可能需要自定义分享链接，现在直接使用当前连接
                this.shareUrl = shareUrl
                share({
                    appId: this.appId,
                    title: courseName,
                    link: shareUrl,
                    desc: courseBrief,
                    imgUrl: courseImg
                })
            } catch (error) {
                throw error
            }
        },
        // 生成海报
        async createPoster (type) {
            if (this.loading) return
            if (this.haibao) {
                this.showHaibao = true
                return
            }
            try {
                this.creating = true
                const poster = new Poster({
                    cover: this.detail.courseImg,
                    productName: this.detail.courseName,
                    originalPrice: this.detail.originalPrice,
                    avatar: this.avatar,
                    nickname: this.userName,
                    shareUrl: this.shareUrl,
                    price: this.detail.sellingPrice
                })
                this.haibao = await poster.create()
                this.showHaibao = true
            } catch (e) {
                throw e
            } finally {
                this.creating = false
            }
        },
        async createCharityPoster () {
            try {
                if (this.loading) {
                    return
                }

                if (this.userId) {
                    this.shareUrl = `${ this.mallUrl }/detail/curriculum/${ this.productId }/${ this.userId }?currentProductStatus=7&activityId=${ this.activityId }&noCache=${ Date.now() }`
                } else {
                    this.shareUrl = `${ this.mallUrl }/detail/curriculum/${ this.productId }?currentProductStatus=7&activityId=${ this.activityId }&noCache=${ Date.now() }`
                }

                this.creating = true
                await this.$nextTick()
                this.$refs.charityPoster.createPoster()
            } catch (error) {
                throw error
            } finally {
                this.creating = false
            }
        }
    }
}
</script>

<style module lang="scss">
.curriculum {
    padding-bottom: 190px;
}
.banner-wrapper {
    position: relative;
}
.barrage {
    position: absolute;
    left: 0;
    bottom: 116px;
    z-index: 2;
}
.count-down-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    &.regular {
        height: 80px !important;
    }
}
.price-box-wrapper {
    display: flex;
    align-items: center;
}
.price-box {
    flex: 1;
    width: 0;
    > .price {
        font-size: 46px;
        color: #fe7700;
        &:before {
            content: '¥';
            margin-right: 3px;
            font-size: 24px;
            vertical-align: 3px;
        }
    }
    .free {
        font-size: 46px;
        color: #fe7700;
    }
    > .original {
        display: flex;
        align-items: center;
        margin-top: 4px;
        color: #999;
        font-size: 26px;
        del {
            &:before {
                content: '¥';
            }
        }
    }
}

.field {
    border-top: 1px solid #e7e7e7;
}

.rule,
.slide-courses {
    margin-top: 20px;
}

.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 110px;
    background-color: #fff;
    border-top: 1px solid #e7e7e7;
    .icons {
        display: flex;
        justify-content: space-between;
        flex: 1;
        width: 0;
        height: 100%;
        padding: 0 40px;
    }
    .link {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        box-sizing: border-box;
        padding: 16px 0 14px;
        font-size: 18px;
        line-height: 24px;
        color: #f2b036;
        &.home > .icon {
            width: 50px;
            height: 46px;
        }
        &.contact > .icon {
            width: 46px;
            height: 46px;
        }
    }
    .buttons {
        display: flex;
        margin-right: 20px;
        width: 496px;
        border-radius: 10px;
        overflow: hidden;
    }
    .button {
        flex: 1;
        width: 0;
        line-height: 80px;
        text-align: center;
        font-size: 26px;
        color: #fff;
    }
    .progress {
        margin-left: auto;
        margin-right: 30px;
        font-size: 26px;
        font-weight: bold;
        color: #fe7700;
    }
    .orange {
        background-color: #fe7700;
        &:disabled {
            background-color: rgba(254, 119, 0, .4);
        }
    }
    .yellow {
        background-color: #f2b036;
        &:disabled {
            opacity: .4 !important;
        }
    }
}

.haibao {
    position: fixed;
    right: 0;
    top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 84px;
    font-size: 16px;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    z-index: 20;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    > svg {
        width: 33px;
    }
    > p {
        margin-top: 4px;
    }
}
.save-haibao-content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: max-content;
    height: max-content;
    > .save-button {
        width: 560px;
        margin-top: -4px;
        text-align: center;
        line-height: 66px;
        font-size: 28px;
        color: #666;
        background-color: #fbfbfb;
    }
    > img {
        width: 560px;
        object-fit: cover;
    }
}
.buttom-tip {
    position: fixed;
    bottom: 130px;
    left: 50%;
    transform: translateX(-50%);
    width: 725px;
    line-height: 110px;
    background-color: rgba(0, 0, 0, .7);
    border-radius: 4px;
    font-size: 30px;
    text-align: center;
    color: #fff;
    z-index: 13;
    &:before {
        position: absolute;
        left: 78px;
        bottom: -28px;
        content: '';
        border: 14px solid transparent;
        border-top-color: rgba(0, 0, 0, .7);
    }
}

.price-right {
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    margin-top: 5px;
    > p {
        margin-top: 6px;
    }
    .return-runbi {
        display: inline-block;
        width: 60px;
        height: 28px;
        margin-right: 10px;
        border-radius: 13px;
        line-height: 28px;
        text-align: center;
        font-size: 18px;
        background-color: #fe7700;
        color: #fff;
    }
}

</style>
