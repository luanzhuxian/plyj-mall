<template>
    <div :class="$style.curriculum">
        <template v-if="loaded">
            <div :class="$style.bannerWrapper">
                <!-- 海报按钮 -->
                <div :class="$style.haibao">
                    <pl-svg :key="1" v-show="creating" name="icon-btn-loading" width="35" fill="#fff" class="rotate" />
                    <pl-svg :key="2" v-show="!creating" name="icon-poster-512b1" fill="#fff" width="35" @click="createCharityPoster" />
                    <p>分享海报</p>
                </div>
                <banner :banners="banners" />

                <!-- 倒计时 -->
                <count-down
                    v-if="isCountdownShow"
                    :class="[$style.countDownBar, $style.regular]"
                    :endtime="detail.regularSaleTime"
                    theme="orange"
                    prefix="距抢课开始仅剩"
                    @done="refresh"
                />
                <!-- 公益棕活动倒计时 -->
                <countdown-bar
                    v-if="false"
                    :class="$style.countDownBar"
                    :starttime="'2020-09-09 20:00:00'"
                    :endtime="detail.regularSaleTime"
                    @done="refresh"
                />
            </div>

            <info-box>
                <div :class="$style.priceBoxWrapper">
                    <div :class="$style.priceBox">
                        <template v-if="isPresent">
                            <div :class="$style.free">赠课</div>
                        </template>
                        <template v-else>
                            <div v-if="detail.priceType === 1" :class="$style.price" v-text="detail.sellingPrice" />
                            <div v-else :class="$style.free">免费</div>
                        </template>
                        <div :class="$style.original">
                            <div v-if="detail.priceType === 1" class="mr-30">
                                <template v-if="isPresent">
                                    售价：<del v-text="detail.sellingPrice" />
                                </template>
                                <template v-else-if="detail.originalPrice && detail.originalPrice !== detail.sellingPrice">
                                    原价：<del v-text="detail.originalPrice" />
                                </template>
                            </div>
                            <div>
                                <span v-if="detail.sale === 0">正在热销中</span>
                                <!-- <template v-else-if="detail.sale > 0 && detail.sale < 10">
                                <span v-text="detail.sale" />人关注
                            </template> -->
                                <template v-else>
                                    <span v-text="detail.sale" />人订阅
                                </template>
                            </div>
                        </div>
                    </div>
                    <div :class="$style.priceRight" v-if="agentUser && detail.rebate">
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
                    <!-- 公益棕用户头像 -->
                    <join v-if="false" />
                </div>

                <!-- 课程名称 -->
                <detail-title :product-name="detail.courseName" />
                <!-- 课程描述 -->
                <detail-desc v-text="detail.courseBrief" />
                <!-- 课程标签 -->
                <tags :tags="detail.labelModels" />

                <field
                    v-if="detail.lecturer"
                    :class="$style.field"
                    size="small"
                    icon="icon-teacher-d2398"
                    label="主讲人："
                    :content="detail.lecturer"
                />
                <field
                    :class="$style.field"
                    size="small"
                    icon="icon-date"
                    label="有效期："
                    :content="getExpiration(detail)"
                />
            </info-box>

            <!-- 相关课程 -->
            <slide-courses
                v-if="courseType === 1 && relatedCourses.length"
                :class="$style.slideCourses"
                :data="relatedCourses"
            />

            <!-- 公益棕活动规则 -->
            <rule :class="$style.rule" v-if="false" />

            <!-- 课程详情 -->
            <div :class="$style.detailOrComment">
                <div :class="$style.tabs">
                    <div :class="{ [$style.activeTab]: tab === 1 }" @click="tab = 1">
                        课程介绍
                    </div>
                    <div :class="{ [$style.activeTab]: tab === 2 }" @click="tab = 2" v-if="courseType === 2">
                        目录
                    </div>
                </div>
                <div>
                    <detail-info v-show="tab === 1" :content="detail.details || '暂无详情'" />
                    <serise-courses
                        v-show="tab === 2"
                        :data="seriesCourses"
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
                </div>
            </div>

            <!-- 订购须知 -->
            <instructions v-if="detail.payNotice" title="订购须知" :content="detail.payNotice" />

            <!-- 底部购买 -->
            <div :class="$style.bottom" v-if="!~[5, 6].indexOf(productActive)">
                <div :class="$style.content">
                    <router-link :class="$style.link" :to="{ name: 'Home' }">
                        <pl-svg name="icon-home" width="38.5" height="70" />
                    </router-link>
                    <a :class="$style.callUs" @click="showContact = true">
                        <pl-svg name="icon-call-us" width="80" height="70" />
                    </a>
                    <div :class="$style.buttonWrapper">
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
                                        liveId: detail.liveIds,
                                        orderId: detail.orderId,
                                        progress: detail.learnProgress
                                    }
                                })"
                            >
                                <span v-if="isPresent">获得赠课 去学习</span>
                                <span v-else>立即学习</span>
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
                                @click="previewCourse(detail.supportWatchUrl)"
                            >
                                试看视频
                            </button>
                            <button
                                v-if="detail.isOpenSale === 1 && detail.courseStatus === 2"
                                :class="$style.button + ' ' + $style.orange"
                                disabled
                            >
                                暂未开售 敬请期待
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
            </div>

            <div :class="$style.buttomTip" v-if="Number(detail.status) === 2 && !~[5, 6].indexOf(productActive)">
                该视频课程已下架
            </div>

            <contact :show.sync="showContact" />

            <!-- 试看视频 -->
            <video-player ref="videoPlayer" :show.sync="preview.show" :url="preview.url" />

            <!-- 海报弹框 -->
            <pl-mask :show.sync="showHaibao">
                <div :class="$style.saveHaibaoContent">
                    <img :src="haibao" alt="">
                    <div :class="$style.saveButton">
                        长按识别或保存二维码，分享给朋友吧！
                    </div>
                </div>
            </pl-mask>

            <!-- 公益棕海报 -->
            <poster
                ref="charityPoster"
                :data="detail"
                :share="shareUrl"
            />
        </template>

        <!-- 骨架屏 -->
        <skeleton v-else />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SET_SHARE_ID } from '../../store/mutation-type'
import Banner from '../../components/detail/Banner.vue'
import InfoBox from '../../components/detail/Info-Box.vue'
import DetailTitle from '../../components/detail/Title.vue'
import DetailDesc from '../../components/detail/Desc.vue'
import DetailInfo from '../../components/detail/Detail.vue'
import Tags from '../../components/detail/Tags.vue'
import Contact from '../../components/common/Contact.vue'
import Field from '../../components/detail/Field.vue'
import SlideCourses from './components/SlideCourses'
import SeriseCourses from './components/SeriesCourses'
import Instructions from '../../components/detail/Instructions.vue'
import VideoPlayer from './components/Video-Player.vue'
import CountDown from '../../components/product/Courses-Count-Down.vue'
import CountdownBar from './charity/Countdown-Bar.vue'
import Join from './charity/Join.vue'
import Rule from './charity/Rule.vue'
import Poster from './charity/Poster.vue'
import Skeleton from './components/Skeleton.vue'
import share from '../../assets/js/wechat/wechat-share'
import { getCourseDetail, checkIsPresentCourse } from '../../apis/product'
import {
    generateQrcode,
    cutImageCenter,
    cutArcImage,
    loadImage,
    createText
} from '../../assets/js/util'

const avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'

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
        VideoPlayer,
        CountDown,
        CountdownBar,
        Join,
        Rule,
        Poster,
        Skeleton
    },
    data () {
        return {
            // 1 单课 2 系列课
            courseType: 1,
            banners: [],
            relatedCourses: [],
            seriesCourses: [],
            detail: {},
            agentProduct: false,
            tab: 2,
            loaded: false,
            loading: false,
            isPresent: false,
            showContact: false,
            preview: {
                show: false,
                url: ''
            },
            haibao: '',
            creating: false,
            showHaibao: false
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
        ...mapGetters(['appId', 'userName', 'avatar', 'mobile', 'mallUrl', 'userId', 'agentUser']),

        // 1 正常進入詳情 2  团购列表进去  3  秒杀列表进去 4  预购商品列表进去 5 从春耘活动进入 6 从组合课活动进入
        productActive () {
            return (this.$route.query && Number(this.$route.query.currentProductStatus)) || 1
        },
        isCountdownShow () {
            const { isOpenSale = 0, courseStatus = 0, regularSaleTime } = this.detail
            return !this.canLearn && isOpenSale === 1 && courseStatus === 2 && regularSaleTime
        },
        canLearn () {
            return this.detail.isBuy || this.isPresent
        }
    },
    watch: {
        '$route' (to, from) {
            if (from.params.productId && to.params.productId) {
                this.refresh()
            }
        }
    },
    async activated () {
        try {
            await this.refresh()
        } catch (e) {
            throw e
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
    async mounted () {
        this.$store.commit(SET_SHARE_ID, this.brokerId)
    },
    methods: {
        async refresh () {
            try {
                this.loaded = false
                this.loading = true
                const list = [
                    this.getDetail(),
                    this.checkIsPresentCourse().catch(e => {
                        console.error(e.message)
                        return e
                    })
                ]

                await Promise.all(list)
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
         * @property {Array} result.videoLibEntities - 系列课关联的视频资源列表
         * @property {Boolean} result.haveNoVideo - 系列课是否有课程未关联视频
         * @property {Number} result.totalLiveNumber - 系列课课程总数
         * @property {Number} result.learnedNumber - 系列课已经学习课程数
         */
        async getDetail () {
            try {
                // 重置一些状态
                this.banners.splice(0, 1000000)
                // 此步是为了兼容处理，当当前产品的活动结束，重新刷新产品详情页面，当作普通商品
                const { result } = await getCourseDetail(this.productId)
                if (!result) {
                    this.$error('该课程异常')
                    this.$router.go(-1)
                    return
                }

                const {
                    courseType,
                    courseImg,
                    relatedCoursesModels,
                    videoLibEntities
                } = result

                this.tab = courseType
                this.courseType = courseType
                this.banners = [courseImg]
                this.relatedCourses = relatedCoursesModels || []
                this.seriesCourses = videoLibEntities || []
                this.detail = result

                return result
            } catch (e) {
                throw e
            }
        },
        // 是否是赠课
        async checkIsPresentCourse () {
            try {
                const { result } = await checkIsPresentCourse(this.productId)
                this.isPresent = result
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
        previewCourse (url) {
            if (!url) {
                return this.$warning('该视频不支持试看')
            }
            this.preview.url = url
            this.preview.show = true
            this.$nextTick(() => {
                const player = this.$refs.videoPlayer
                if (player) {
                    player.play()
                }
            })
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
            this.$router.push({
                name: 'SubmitCurriculum',
                params: {
                    productId: this.productId,
                    count: 1
                }
            })
        },
        // 生成分享
        async createShare () {
            const { courseName, lecturer, courseImg } = this.detail
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
                    link: this.shareUrl,
                    desc: lecturer,
                    imgUrl: courseImg
                })
            } catch (error) {
                throw error
            }
        },
        // 生成海报
        async createPoster (type) {
            if (this.loading) {
                return
            }

            let img = await loadImage(this.detail.courseImg)
            if (!img) {
                this.$error('图片加载错误')
                return
            }
            // if (this.haibao) {
            //     this.showHaibao = true
            //     return
            // }
            this.creating = true

            // 截取头像
            let lodedAvatar
            try {
                lodedAvatar = await loadImage(this.avatar)
            } catch (e) {
                lodedAvatar = await loadImage(avatar)
            }
            const arcAvatar = cutArcImage(lodedAvatar)

            // 截取中间部分
            img = cutImageCenter(img, 750 / 500)
            const canvas = document.createElement('canvas')
            canvas.width = 1120
            canvas.height = 1346
            const ctx = canvas.getContext('2d')

            // 绘制头部
            ctx.fillStyle = '#fff'
            ctx.fillRect(0, 0, 1120, 192)
            ctx.drawImage(arcAvatar, 32, 32, 128, 128)
            ctx.font = 'bold 48px Microsoft YaHei UI'
            ctx.fillStyle = '#000'
            createText(ctx, 192, 120, this.userName, 68, 800, 1)
            try {
                // 二维码
                const qrcode = await generateQrcode({ size: 300, text: this.shareUrl, padding: 15, img, centerPadding: 10, type: 'canvas' })

                // 商品图片
                ctx.drawImage(img, 0, 0, img.width, img.height, 0, 192, 1120, 746)
                if (type !== 1 && this.preActivity === 2) {
                    ctx.fillStyle = '#FA4D2F'
                } else {
                    ctx.fillStyle = '#fff'
                }
                ctx.fillRect(0, 938, 1120, 408)
                ctx.drawImage(qrcode, 750, 978, 320, 320)

                // 填充商品名称
                // let str = this.detail.courseName
                const line = ((type !== 1 && this.preActivity === 2) || this.courseType === 2) ? 1 : 2
                const { sellingPrice: price, originalPrice, totalLiveNumber } = this.detail
                ctx.textBaseline = 'top'
                ctx.font = '56px Microsoft YaHei UI'
                ctx.fillStyle = '#000'

                // 商品名称
                createText(ctx, 49, 978, this.detail.courseName, 80, 620, line)
                if (this.courseType === 2) {
                    ctx.font = '48px Microsoft YaHei UI'
                    ctx.fillStyle = '#999'
                    ctx.fillText(`包含${ totalLiveNumber }节课程`, 48, 1058)
                }

                // 填充价钱
                if (price) {
                    ctx.fillStyle = '#FE7700'
                    ctx.fillText('¥', 48, 1190 + (76 - 56) / 2)
                    ctx.font = 'bold 88px Microsoft YaHei UI'
                    createText(ctx, 96, 1170 + (104 - 88) / 2, String(price), 104)
                } else {
                    ctx.fillStyle = '#FE7700'
                    ctx.font = 'bold 88px Microsoft YaHei UI'
                    createText(ctx, 48, 1190 + (76 - 56) / 2, '免费', 104)
                }

                // 绘制原价
                if (originalPrice && originalPrice !== price) {
                    const priceWidth = ctx.measureText(price).width
                    ctx.fillStyle = '#999'
                    ctx.font = '56px Microsoft YaHei UI'
                    ctx.fillText(`¥${ originalPrice }`, 96 + priceWidth + 44, 1190 + (80 - 56) / 2)
                    const originalPriceWidth = ctx.measureText(`¥${ originalPrice }`).width
                    ctx.save()

                    // 设置删除线
                    ctx.strokeStyle = '#999'
                    ctx.beginPath()
                    ctx.lineWidth = '4'
                    ctx.moveTo(96 + priceWidth + 44, 1190 + (80 - 56) / 2 + 80 / 3)
                    ctx.lineTo(96 + priceWidth + 44 + originalPriceWidth, 1190 + (80 - 56) / 2 + 80 / 3)
                    ctx.stroke()
                }
                this.haibao = canvas.toDataURL('image/jpeg', 0.9)
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

                this.creating = true
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
.count-down-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
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
.slide-courses,
.detail-or-comment {
    margin-top: 20px;
}

.tabs {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid #e7e7e7;
    > div {
        width: max-content;
        font-size: 26px;
        color: #999;
        height: 90px;
        line-height: 90px;
        box-sizing: border-box;
        font-weight: bold;
        &.active-tab {
            color: #000;
            border-bottom: 2px solid #000;
        }
    }
}
.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    > .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        height: 110px;
        border-top: 1px solid #e7e7e7;
    }
    .link {
        margin-left: 12px;
    }
    .call-us {
        margin-left: 36px;
    }
    .button-wrapper {
        display: flex;
        margin-left: auto;
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
.saveHaibaoContent {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: max-content;
    height: max-content;
    > .saveButton {
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

.priceRight {
  flex: 1;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 5px;
  > p {
    margin-top: 6px;
  }
  .returnRunbi {
    display: inline-block;
    width: 60px;
    height: 28px;
    margin-right: 10px;
    border-radius: 13px;
    line-height: 28px;
    text-align: center;
    font-size: 18px;
    background-color: #FE7700;
    color: #fff;
  }
}
</style>
