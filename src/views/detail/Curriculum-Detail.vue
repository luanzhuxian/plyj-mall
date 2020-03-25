<template>
    <div :class="$style.curriculum">
        <!-- 海报按钮 -->
        <div :class="$style.haibao">
            <pl-svg :key="1" v-if="creating" name="icon-btn-loading" width="35" fill="#fff" class="rotate" />
            <pl-svg :key="2" v-else name="icon-haibao" width="35" @click="createHaibao" />
            <p>分享海报</p>
        </div>
        <Banner :banners="banners" />
        <InfoBox>
            <div :class="$style.priceBox">
                <div v-if="detail.sellingPrice" :class="$style.price" v-text="detail.sellingPrice" />
                <div v-else :class="$style.free">免费</div>
                <div :class="$style.original">
                    <div v-if="detail.priceType && detail.originalPrice && detail.originalPrice !== detail.sellingPrice" class="mr-30">原价：<del v-text="detail.originalPrice" /></div>
                    <div>
                        <span v-if="detail.sale === 0">正在热销中</span>
                        <!--<template v-else-if="detail.sale > 0 && detail.sale < 10">
              <span v-text="detail.sale" />人关注
            </template>-->
                        <template v-else>
                            <span v-text="detail.sale" />人已学
                        </template>
                    </div>
                </div>
            </div>
            <!-- 课程名称 -->
            <DetailTitle :product-name="detail.courseName" />
            <!-- 课程描述 -->
            <DetailDesc v-text="detail.courseBrief" />
            <!-- 课程标签 -->
            <Tags :tags="detail.labelModels" />

            <div :class="$style.field" v-if="detail.lecturer">
                <div :class="$style.left">
                    <pl-svg name="icon-teacher-d2398" width="30" />
                    主讲人：
                </div>
                <div :class="$style.right" v-text="detail.lecturer" />
            </div>

            <div :class="$style.field">
                <div :class="$style.left">
                    <pl-svg name="icon-date" width="30" />
                    有效期：
                </div>
                <div :class="$style.right" v-text="detail.validityType ? `购买后${detail.validity}天内学完` : '购买后不限观看次数'" />
            </div>
        </InfoBox>

        <div :class="$style.detailOrComment">
            <div :class="$style.tabs">
                <div :class="{ [$style.activeTab]: tab === 2 }" @click="tab = 2">
                    商品详情
                </div>
            </div>

            <div>
                <DetailInfo
                    v-show="tab === 2"
                    :content="detail.details || '暂无详情'"
                />
            </div>
        </div>

        <div :class="$style.bottom" v-if="productActive !== 5">
            <div :class="$style.content">
                <router-link :class="$style.link" :to="{ name: 'Home' }">
                    <pl-svg name="icon-home" width="38" height="70" />
                </router-link>
                <a :class="$style.link + ' ' + $style.callUs" @click="showContact = true">
                    <pl-svg name="icon-call-us" width="80" height="72" />
                </a>
                <button
                    v-if="!detail.isBuy"
                    :disabled="Number(detail.status) === 2 || loading"
                    :class="$style.button + ' ' + $style.clickMeBecauseYouAreYoung"
                    @click="goSubmit"
                >
                    立即学习
                </button>
                <button
                    v-else
                    :disabled="loading"
                    :class="$style.button + ' ' + $style.hasStudied"
                    @click="$router.push({ name: 'CourseWatch', params: { courseId: productId }, query: { liveId: detail.liveId, orderId: detail.orderId, progress: detail.learnProgress } })"
                >
                    观看学习
                </button>
            </div>
        </div>

        <div :class="$style.buttomTip" v-if="Number(detail.status) === 2">
            该视频课程已下架
        </div>

        <Contact :show.sync="showContact" />

        <!-- 海报弹框 -->
        <transition name="fade">
            <div :class="$style.saveHaibao" v-if="showHaibao">
                <div :class="$style.saveHaibaoContent">
                    <img :src="haibao" alt="">
                    <div :class="$style.saveButton">
                        长按识别或保存二维码，分享给朋友吧！
                    </div>
                    <pl-svg name="icon-close3" fill="#fff" width="30" @click="showHaibao = false" />
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import Banner from '../../components/detail/Banner.vue'
import InfoBox from '../../components/detail/Info-Box.vue'
import DetailTitle from '../../components/detail/Title.vue'
import DetailDesc from '../../components/detail/Desc.vue'
import DetailInfo from '../../components/detail/Detail.vue'
import Tags from '../../components/detail/Tags.vue'
import Contact from '../../components/common/Contact.vue'
import { getCourseDetail } from '../../apis/product'
import share from '../../assets/js/wechat/wechat-share'
import { generateQrcode, cutImageCenter, cutArcImage, loadImage, createText } from '../../assets/js/util'
import { mapGetters } from 'vuex'
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
        Contact
    },
    data () {
        return {
            banners: [],
            detail: {},
            agentProduct: false,
            loading: false,
            tab: 2,
            studied: true,
            showContact: false,
            creating: false,
            showHaibao: false,
            haibao: ''
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
        ...mapGetters(['appId', 'userName', 'avatar', 'mobile', 'mallUrl']),

        // 0 全部，1 helper，2 会员，3 部分用户
        targetGroups () {
            return this.detail.targetGroups
        },
        tagIds () {
            return this.detail.tagIds
        },
        // 1 正常進入詳情 2  团购列表进去  3  秒杀列表进去 4  预购商品列表进去 5 从春耘活动进入
        productActive () {
            return (this.$route.query && Number(this.$route.query.currentProductStatus)) || 1
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
        this.showHaibao = false
        this.haibao = ''
    },
    async mounted () {
        sessionStorage.setItem('shareBrokerId', this.brokerId || '')
    },
    methods: {

        //  获取商品详情
        async getDetail () {
            try {
                this.loading = true
                // 重置一些状态
                this.resetState()
                // 此步是为了兼容处理，当当前产品的活动结束，重新刷新产品详情页面，当作普通商品
                const { result } = await getCourseDetail(this.productId)
                if (!result) {
                    this.$error('该课程异常')
                    this.$router.go(-1)
                    return
                }
                this.loading = false
                const {
                    courseImg
                } = result
                this.banners = [courseImg]
                this.detail = result

                // 生成分享
                let shareUrl = ''
                if (this.userId) {
                    shareUrl = `${ this.mallUrl }/detail/curriculum/${ this.productId }/${ this.userId }?noCache=${ Date.now() }`
                } else {
                    shareUrl = `${ this.mallUrl }/detail/curriculum/${ this.productId }?noCache=${ Date.now() }`
                }
                this.shareUrl = shareUrl
                share({
                    appId: this.appId,
                    title: result.productName,
                    desc: result.productDesc,
                    link: shareUrl,
                    imgUrl: result.productMainImage
                })
                this.haibaoImg = await loadImage(courseImg)
                return result
            } catch (e) {
                throw e
            }
        },
        goSubmit () {
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
            this.$router.push({ name: 'SubmitCurriculum', params: { productId: this.productId, count: 1 } })
        },
        resetState () {
            this.banners.splice(0, 1000000)
        },
        async refresh () {
            try {
                await this.getDetail()
            } catch (e) {
                throw e
            }
        },
        async createHaibao (type) {
            if (this.loading) {
                return
            }
            let img = this.haibaoImg
            if (!img) {
                this.$error('图片加载错误')
                return
            }
            if (this.haibao) {
                this.showHaibao = true
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
            createText(ctx, 192, 120, this.userName, 68, 800, 1)
            try {
                // 二维码
                const qrcode = await generateQrcode(300, this.shareUrl, 15, img, 10, 'canvas')

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
                const line = (type !== 1 && this.preActivity === 2) ? 1 : 2
                const price = this.detail.sellingPrice
                const { originalPrice } = this.detail
                ctx.textBaseline = 'top'
                ctx.font = '56px Microsoft YaHei UI'
                ctx.fillStyle = '#000'

                // 填充价钱
                createText(ctx, 48, 978, this.detail.courseName, 80, 620, line)
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
                this.haibao = canvas.toDataURL('image/jpeg', 0.7)
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
.curriculum {
    padding-bottom: 190px;
}
.priceBox {
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
    display: flex;
    align-items: center;
    line-height: 78px;
    font-size: 24px;
    border-top: 1px solid #e7e7e7;
    > .left {
        color: #999;
        > svg {
            vertical-align: -6px;
        }
    }
    > .right {
        color: #000;
    }
}
.detailOrComment {
    margin-top: 20px;
    background-color: #fff;
}
.tabs {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #e7e7e7;
    > div {
        width: max-content;
        font-size: 26px;
        color: #999;
        height: 90px;
        line-height: 90px;
        box-sizing: border-box;
        font-weight: bold;
        &.activeTab {
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
        align-items: center;
        height: 110px;
        border-top: 1px solid #e7e7e7;
    }
    .link {
        margin-left: 42px;
        &.callUs {
            margin-left: 36px;
        }
    }
    .button {
        width: 496px;
        margin-left: 40px;
        line-height: 80px;
        font-size: 26px;
        text-align: center;
        color: #fff;
        border-radius: 10px;
    }
    .click-me-because-you-are-young {
        background-color: #fe7700;
        &:disabled {
            background-color: rgba(254, 119, 0, .4);
        }
    }
    .has-studied {
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
.saveHaibao {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    z-index: 10000;
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
        > svg {
            position: absolute;
            top: -64px;
            right: 0;
            width: 48px;
            height: 48px;
            color: #fff;
        }
    }
}
.buttomTip {
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
