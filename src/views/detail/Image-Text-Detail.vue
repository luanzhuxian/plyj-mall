
<template>
    <div :class="$style.imageTextDetail">
        <template v-if="loaded">
            <div :class="$style.bannerWrapper">
                <!-- 海报按钮 -->
                <div :class="$style.haibao">
                    <pl-svg :key="1" v-show="creating" name="icon-btn-loading" width="35" fill="#fff" class="rotate" />
                    <pl-svg :key="2" v-show="!creating" name="icon-poster-512b1" fill="#fff" width="35" @click="createPoster" />
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
            </div>

            <info-box>
                <div :class="$style.priceBoxWrapper">
                    <div :class="$style.priceBox">
                        <template v-if="detail.isGive">
                            <div :class="$style.free">赠课</div>
                        </template>
                        <template v-else>
                            <div v-if="detail.priceType === 1" :class="$style.price" v-text="detail.sellingPrice" />
                            <div v-else :class="$style.free">免费</div>
                        </template>
                        <div :class="$style.original">
                            <template v-if="detail.priceType === 1">
                                <div v-if="detail.isGive" class="mr-30">
                                    售价：<del v-text="detail.sellingPrice" />
                                </div>
                                <div v-else-if="detail.originalPrice && detail.originalPrice !== detail.sellingPrice" class="mr-30">
                                    原价：<del v-text="detail.originalPrice" />
                                </div>
                            </template>
                            <div v-if="Number(detail.showSales) === 1">
                                <span v-if="detail.orderCount === 0">正在热销中</span>
                                <template v-else>
                                    <span v-text="detail.orderCount" />人订阅
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 名称 -->
                <detail-title :product-name="detail.graphicName" />
                <!-- 描述 -->
                <detail-desc v-text="detail.graphicBrief" />

                <field
                    v-if="detail.author"
                    :class="$style.field"
                    size="small"
                    icon="icon-teacher-d2398"
                    label="作者："
                    :content="detail.author"
                />
            </info-box>

            <!-- 课程详情 -->
            <div :class="$style.detailOrComment">
                <Tabs :tabs="tabs" v-model="tab">
                    <detail-info
                        v-show="tab === 1"
                        :content="detail.details || '暂无详情'"
                    />
                    <image-text-list
                        v-show="tab === 2"
                        :data="detail.graphicPdfs || []"
                        :is-bought="isBought"
                        :is-study="Boolean(detail.isStudy)"
                        :product-id="detail.id"
                        @preview="previewPdf"
                    />
                </Tabs>
            </div>

            <!-- 使用说明 -->
            <Instructions title="订购须知" :content="detail.payNotice" />

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
                    <button
                        v-if="isBought"
                        :class="$style.button + ' ' + $style.yellow"
                        :disabled="loading"
                        @click="previewPdf(0)"
                    >
                        查看资料
                    </button>
                    <button
                        v-else
                        :class="$style.button + ' ' + $style.orange"
                        :disabled="loading || !isNormal || isNotStarted"
                        @click="submit"
                    >
                        {{ (isNormal && isNotStarted) ? '即将开售' : '立即订购' }}
                    </button>
                </div>
            </div>

            <div
                :class="$style.buttomTip"
                v-if="Number(detail.status) === 2 && !~[5, 6].indexOf(productActive) && !isBought"
            >
                该图文资料已下架
            </div>

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

            <!-- pdf预览 -->
            <pdf-previewer :show.sync="isPreviewerShow" :url="pdfUrl" />
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
import Instructions from '../../components/detail/Instructions.vue'
import Tabs from './components/Tabs.vue'
import CountDown from '../../components/product/Courses-Count-Down.vue'
import ImageTextList from './components/Image-Text-List.vue'
import PdfPreviewer from './components/Pdf-Previewer.vue'
import Skeleton from './components/Skeleton.vue'
import share from '../../assets/js/wechat/wechat-share'
import { getImageTextDetail } from '../../apis/product'
import {
    generateQrcode,
    cutImageCenter,
    cutArcImage,
    loadImage,
    createText
} from '../../assets/js/util'
import moment from 'moment'

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
        CountDown,
        ImageTextList,
        PdfPreviewer,
        Skeleton,
        Instructions
    },
    data () {
        return {
            loaded: false,
            loading: false,
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
            tab: 1,
            showContact: false,
            // 海报
            haibao: '',
            creating: false,
            showHaibao: false,
            // 分享链接
            shareUrl: '',
            // pdf预览
            isPreviewerShow: false,
            pdfUrl: ''
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
        ...mapGetters(['appId', 'userName', 'avatar', 'mobile', 'mallUrl', 'userId', 'agentUser', 'servicePhoneModels']),

        // 1 正常進入詳情 2  团购列表进去  3  秒杀列表进去 4  预购商品列表进去 5 从春耘活动进入 6 从组合课活动进入 7 公益棕活动进入
        productActive () {
            return 1
        },
        activityId () {
            return this.$route.query.activityId || ''
        },
        isCountdownShow () {
            return this.isNormal && !this.isBought && this.isNotStarted
        },
        // 商品状态是否正常
        isNormal () {
            return Number(this.detail.status) === 1 && Number(this.detail.dataStatus) === 1
        },
        // 已买
        isBought () {
            return !!this.detail.isGive || !!this.detail.orderId
        },
        // 是否定时开售
        isOpenSale () {
            return Boolean(this.detail.isOpenSale)
        },
        // 距离开售的时间
        distanceStart () {
            return moment(this.detail.regularSaleTime).valueOf() - Date.now()
        },
        // 是否未开始销售
        isNotStarted () {
            return this.distanceStart > 0 && this.isOpenSale
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
        this.isPreviewerShow = false
        this.pdfUrl = ''
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
                this.loaded = true
                this.createShare()
            } catch (error) {
                throw error
            } finally {
                this.loading = false
            }
        },

        /**
         * 获取商品详情
         * @returns {Object} result - 商品详情
         * @property {String} result.id
         * @property {String} result.graphicName
         * @property {String} result.graphicMainImg
         * @property {Array} result.graphicImgs
         * @property {Array} result.graphicPdfs
         * @property {String} result.graphicBrief
         * @property {String} result.author
         * @property {String} result.category1
         * @property {String} result.category1Name
         * @property {String} result.category2
         * @property {String} result.category2Name
         * @property {String} result.payNotice - 购买须知
         * @property {Number} result.targetGroups - 观看对象
         * @property {Array} result.tagIds
         * @property {Number} result.priceType - 价格类型 (0 免费 1 付费)
         * @property {Number} result.originalPrice - 原价
         * @property {Number} result.sellingPrice - 售价
         * @property {Number} result.orderCount - 订购量
         * @property {String} result.status - 状态 (1 上架 2 下架)
         * @property {String} result.statusText - 状态
         * @property {Number} result.dataStatus - 数据状态 0：删除 1：正常
         * @property {String} result.dataStatusText - 数据状态
         * @property {Boolean} result.isGive - 是否赠送
         * @property {Boolean} result.isOpenSale - 是否开启定时开售 (0 不开启 1 开启)
         * @property {Boolean} result.isShow - 是否c端展示（0：不展示 1：展示）
         * @property {Number} result.showSales - 是否展示销量（1-展示，0-隐藏）
         * @property {String} result.entId - 机构ID
         * @property {String} result.regularSaleTime - 定时开售时间
         * @property {Object} result.themeModel - 主题
         */
        async getDetail () {
            try {
                // 此步是为了兼容处理，当当前产品的活动结束，重新刷新产品详情页面，当作普通商品
                const { result } = await getImageTextDetail(this.productId)
                if (!result) {
                    this.$error('该课程异常')
                    this.$router.go(-1)
                    return
                }

                const { graphicImgs, graphicMainImg } = result

                this.banners = graphicMainImg ? (graphicImgs.splice(0, 1, graphicMainImg) && graphicImgs) : graphicImgs
                // 删除文件名的后缀
                for (const pdf of result.graphicPdfs) {
                    pdf.name = pdf.name.replace('.pdf', '')
                }
                this.detail = result
                // 根据是否已购买展示不同的tab
                this.tab = result.orderId ? 2 : 1

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
                        price: this.detail.sellingPrice || 0,
                        productType: 'GRAPHIC_DATA'
                    }
                ]
            })
            this.$router.push({ name: 'SubmitOrder' })
        },
        // 生成分享
        async createShare () {
            const { graphicName, graphicBrief, graphicMainImg } = this.detail
            try {
                let shareUrl = ''
                if (this.userId) {
                    shareUrl = `${ this.mallUrl }/detail/image-text/${ this.productId }/${ this.userId }?noCache=${ Date.now() }`
                } else {
                    shareUrl = `${ this.mallUrl }/detail/image-text/${ this.productId }?noCache=${ Date.now() }`
                }
                // TODO: 以后可能需要自定义分享链接，现在直接使用当前连接
                this.shareUrl = shareUrl
                share({
                    appId: this.appId,
                    title: graphicName,
                    link: shareUrl,
                    desc: graphicBrief,
                    imgUrl: graphicMainImg
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

            let img = await loadImage(this.detail.graphicMainImg)
            if (!img) {
                this.$error('图片加载错误')
                return
            }
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
                const line = type !== 1 && this.preActivity === 2 ? 1 : 2
                const { sellingPrice, originalPrice } = this.detail
                ctx.textBaseline = 'top'
                ctx.font = '56px Microsoft YaHei UI'
                ctx.fillStyle = '#000'

                // 商品名称
                createText({
                    ctx,
                    x: 48,
                    y: 978,
                    text: this.detail.graphicName,
                    lineHeight: 80,
                    width: 620,
                    lineNumber: line
                })

                // 填充价钱
                let priceWidth = 0
                if (sellingPrice) {
                    ctx.fillStyle = '#FE7700'
                    ctx.fillText('¥', 48, 1190 + (76 - 56) / 2)
                    ctx.font = 'bold 88px Microsoft YaHei UI'
                    priceWidth = createText({
                        ctx,
                        x: 96,
                        y: 1170 + (104 - 88) / 2,
                        text: String(sellingPrice),
                        lineHeight: 104
                    })
                } else {
                    ctx.fillStyle = '#FE7700'
                    ctx.font = 'bold 88px Microsoft YaHei UI'
                    priceWidth = createText({
                        ctx,
                        x: 48,
                        y: 1160 + (76 - 56) / 2,
                        text: '免费',
                        lineHeight: 104
                    })
                }

                // 绘制原价
                if (originalPrice && originalPrice !== sellingPrice) {
                    ctx.fillStyle = '#999'
                    ctx.font = '56px Microsoft YaHei UI'
                    ctx.fillText(`¥${ originalPrice }`, priceWidth + 100, 1190 + (80 - 56) / 2)
                    const originalPriceWidth = ctx.measureText(`¥${ originalPrice }`).width
                    ctx.save()

                    // 设置删除线
                    ctx.strokeStyle = '#999'
                    ctx.beginPath()
                    ctx.lineWidth = '4'
                    ctx.moveTo(priceWidth + 100, 1190 + (80 - 56) / 2 + 80 / 3)
                    ctx.lineTo(priceWidth + 100 + originalPriceWidth, 1190 + (80 - 56) / 2 + 80 / 3)
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
        async previewPdf (index) {
            const { graphicPdfs = [] } = this.detail
            const pdf = graphicPdfs[index]

            if (!pdf || !pdf.url) {
                return false
            }

            this.pdfUrl = pdf.url
            this.isPreviewerShow = true
        }
    }
}
</script>

<style module lang="scss">
.image-text-detail {
    padding-bottom: 210px;
}
.banner-wrapper {
    position: relative;
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
        padding: 0 38px;
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
