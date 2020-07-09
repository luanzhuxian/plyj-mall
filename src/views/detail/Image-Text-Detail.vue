
<template>
    <div :class="$style.imageTextDetail">
        <template v-if="loaded">
            <div :class="$style.bannerWrapper">
                <!-- 海报按钮 -->
                <div :class="$style.haibao">
                    <pl-svg :key="1" v-show="creating" name="icon-btn-loading" width="35" fill="#fff" class="rotate" />
                    <pl-svg
                        :key="2"
                        v-show="!creating"
                        name="icon-poster-512b1"
                        fill="#fff"
                        width="35"
                        @click="createPoster"
                    />
                    <p>分享海报</p>
                </div>
                <banner :banners="banners" />
            </div>

            <info-box>
                <div :class="$style.priceBoxWrapper">
                    <div :class="$style.priceBox">
                        <div v-if="detail.priceType === 1" :class="$style.price" v-text="detail.sellingPrice" />
                        <div v-else :class="$style.free">免费</div>
                        <div :class="$style.original">
                            <div v-if="detail.priceType === 1 && (detail.originalPrice && detail.originalPrice !== detail.sellingPrice)" class="mr-30">
                                原价：<del v-text="detail.originalPrice" />
                            </div>
                            <div v-if="Number(detail.showSales) === 1">
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
                </div>

                <!-- 课程名称 -->
                <detail-title :product-name="detail.courseName" />
                <!-- 课程描述 -->
                <detail-desc v-text="detail.courseBrief" />

                <field
                    v-if="detail.lecturer"
                    :class="$style.field"
                    size="small"
                    icon="icon-teacher-d2398"
                    label="作者："
                    :content="detail.lecturer"
                />
            </info-box>

            <!-- 课程详情 -->
            <div :class="$style.detailOrComment">
                <Tabs :tabs="tabs" v-model="tab">
                    <detail-info v-show="tab === 1" :content="detail.details || '暂无详情'" />
                    <image-text-list v-show="tab === 2" />
                </Tabs>
            </div>

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
                    <router-link :class="$style.link + ' ' + $style.cart" :to="{ name: 'ShoppingCart' }">
                        <i v-if="cartCount > 99" :class="$style.cartCount">99+</i>
                        <i v-else-if="cartCount > 0" :class="$style.cartCount" v-text="cartCount" />
                        <img :class="$style.icon" src="https://mallcdn.youpenglai.com/static/mall/icons/2.11.0/购物车选中.png" alt="">
                        <i :class="$style.text">购物车</i>
                    </router-link>
                </div>
                <div :class="$style.buttons">
                    <button
                        v-if="false"
                        :class="$style.button + ' ' + $style.yellow"
                        :disabled="Number(detail.status) === 2 || loading"
                        @click="openFIle"
                    >
                        查看资料
                    </button>
                    <button
                        v-else
                        :class="$style.button + ' ' + $style.orange"
                        :disabled="Number(detail.status) === 2 || loading"
                        @click="submit"
                    >
                        立即订购
                    </button>
                </div>
            </div>

            <!-- <div
                :class="$style.buttomTip"
                v-if="Number(detail.status) === 2 && !~[5, 6].indexOf(productActive) && !detail.isBuy"
            >
                该图文资料已下架
            </div> -->

            <contact :show.sync="showContact" />

            <!-- 海报弹框 -->
            <pl-mask :show.sync="showHaibao">
                <div :class="$style.saveHaibaoContent">
                    <img v-imgError :src="haibao" alt="">
                    <div :class="$style.saveButton">
                        长按识别或保存二维码，分享给朋友吧！
                    </div>
                </div>
            </pl-mask>
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
import DetailInfo from './components/Detail.vue'
import Contact from '../../components/common/Contact.vue'
import Field from '../../components/detail/Field.vue'
import Tabs from './components/Tabs.vue'
import ImageTextList from './components/Image-Text-List.vue'
import Skeleton from './components/Skeleton.vue'
import share from '../../assets/js/wechat/wechat-share'
import { getCourseDetail } from '../../apis/product'
import {
    generateQrcode,
    cutImageCenter,
    cutArcImage,
    loadImage,
    createText
} from '../../assets/js/util'

const avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'

export default {
    name: 'ImageTextDetail',
    components: {
        Banner,
        InfoBox,
        DetailTitle,
        DetailDesc,
        DetailInfo,
        Contact,
        Field,
        Tabs,
        ImageTextList,
        Skeleton
    },
    data () {
        return {
            loaded: false,
            loading: false,
            courseType: 1,
            detail: {},
            banners: [],
            tabs: [
                {
                    label: '详情介绍',
                    value: 1
                },
                {
                    label: '图文资料',
                    value: 2
                }
            ],
            tab: 2,
            showContact: false,
            haibao: '',
            creating: false,
            showHaibao: false,
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
        ...mapGetters(['appId', 'userName', 'avatar', 'mobile', 'mallUrl', 'userId', 'agentUser', 'courseTypeMap', 'servicePhoneModels', 'cartCount']),

        // 1 正常進入詳情 2  团购列表进去  3  秒杀列表进去 4  预购商品列表进去 5 从春耘活动进入 6 从组合课活动进入 7 公益棕活动进入
        productActive () {
            return (this.$route.query && Number(this.$route.query.currentProductStatus)) || 1
        },
        activityId () {
            return this.$route.query.activityId
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
    },
    async mounted () {
        this.$store.commit(SET_SHARE_ID, this.brokerId)
    },
    methods: {
        async refresh () {
            try {
                this.loaded = false
                this.loading = true
                await this.getDetail()
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
                    courseImg,
                    courseMainImg
                } = result

                // this.tab = courseType
                this.banners = courseImg ? (courseMainImg.splice(0, 1, courseImg) && courseMainImg) : courseMainImg
                this.detail = result

                return result
            } catch (e) {
                throw e
            }
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
        openFIle () {},
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
            createText({
                ctx,
                x: 192,
                y: 120,
                text: this.userName,
                lineHeight: 68,
                width: 800
            })
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
                const line = type !== 1 && this.preActivity === 2 ? 1 : 2
                const { sellingPrice: price, originalPrice } = this.detail
                ctx.textBaseline = 'top'
                ctx.font = '56px Microsoft YaHei UI'
                ctx.fillStyle = '#000'

                // 商品名称
                createText({
                    ctx,
                    x: 49,
                    y: 978,
                    text: this.detail.courseName,
                    lineHeight: 80,
                    width: 620,
                    lineNumber: line
                })

                // 填充价钱
                if (price) {
                    ctx.fillStyle = '#FE7700'
                    ctx.fillText('¥', 48, 1190 + (76 - 56) / 2)
                    ctx.font = 'bold 88px Microsoft YaHei UI'
                    createText({
                        ctx,
                        x: 96,
                        y: 1170 + (104 - 88) / 2,
                        text: String(price),
                        lineHeight: 104
                    })
                } else {
                    ctx.fillStyle = '#FE7700'
                    ctx.font = 'bold 88px Microsoft YaHei UI'
                    createText({
                        ctx,
                        x: 48,
                        y: 1190 + (76 - 56) / 2,
                        text: '免费',
                        lineHeight: 104
                    })
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
        }
    }
}
</script>

<style module lang="scss">
.image-text-detail {
    padding-bottom: 190px;
}
.banner-wrapper {
    position: relative;
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
.detail-or-comment {
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
        color: #F2B036;
        &.home > .icon {
            width: 50px;
            height: 46px;
        }
        &.contact > .icon {
            width: 46px;
            height: 46px;
        }
        &.cart > .icon {
            width: 44px;
            height: 45px;
        }
        .cart-count {
            position: absolute;
            right: -20px;
            top: -5px;
            height: 36px;
            min-width: 36px;
            padding: 0 5px;
            line-height: 32px;
            color: #fff;
            background-color: #FE7700;
            border-radius: 18px;
            font-size: 24px;
            border: 2px solid #fff;
            box-sizing: border-box;
            text-align: center;
        }
    }
   .buttons {
        display: flex;
        margin-right: 20px;
        width: 420px;
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

</style>
