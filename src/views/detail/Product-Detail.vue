<template>
    <div :class="$style.lesson">
        <!-- activeProduct - 1-正常商品 2-团购 3-秒杀 4-预购 -->
        <!-- productStatus - 0：已删除 1：下架 2：上架  3：草稿箱 -->

        <!-- 正常商品 按照 商品本身的状态显示; 活动商品 按照 活动中的商品显示，不理会商品本身的状态 -->

        <template v-if="loaded">
            <!-- 售罄 -->
            <SoldOut v-if="isDeletedShow" />
            <template v-else>
                <!-- 海报按钮 -->
                <div :class="$style.haibao">
                    <pl-svg :key="1" v-show="creating" name="icon-btn-loading" width="35" fill="#fff" class="rotate" />
                    <pl-svg
                        :key="2"
                        v-show="!creating"
                        name="icon-poster-512b1"
                        fill="#fff"
                        width="35"
                        @click="() => activeProduct === 7 ? createCharityPoster() : createHaibao(activeProduct)"
                    />
                    <p>分享海报</p>
                </div>
                <!-- 公益粽弹幕 -->
                <Barrage
                    v-if="activeProduct === 7"
                    :class="$style.barrage"
                    :list="charityMembers"
                />
                <!-- 商品banner -->
                <DetailBanner :banners="banners" :main="detail.productMainImage" />
                <template v-if="detail.id && preActivity !== 0">
                    <!-- 团购倒计时条 -->
                    <TogetherBar
                        v-if="activeProduct === 2"
                        :detail="detail"
                        @started="refresh(2)"
                        @ended="refresh(1)"
                    />
                    <!-- 秒杀倒计时条 -->
                    <SecondBar
                        v-else-if="activeProduct === 3"
                        :detail="detail"
                        @started="refresh(3)"
                        @ended="refresh(1)"
                    />
                    <!-- 预购倒计时条 -->
                    <BookingBar
                        v-else-if="activeProduct === 4"
                        :detail="detail"
                        @started="refresh(4)"
                        @ended="refresh(1)"
                    />
                    <!-- 公益棕活动倒计时 -->
                    <CountdownBar
                        v-else-if="activeProduct === 7"
                        :class="$style.countDownBar"
                        :starttime="detail.activityProductModel.activityStartTime"
                        :endtime="detail.activityProductModel.activityEndTime"
                        :donation="charityStastics.donationAmount"
                        :total="charityStastics.topAmount"
                        @done="refresh"
                    />
                </template>

                <!-- 商品基本信息 -->
                <DetailInfoBox>
                    <!-- 团购信息: 活动进行中，或者，活动预热中且需要隐藏价格，才需要显示这个组件，组件内部会根据活动状态进行显示 -->
                    <TogetherPrice :detail="detail" v-if="activeProduct === 2 && (preActivity === 2 || (preActivity === 1 && !detail.activityProductModel.hidePrice))" />
                    <!-- 秒杀信息 -->
                    <SecondPrice :detail="detail" v-else-if="activeProduct === 3 && preActivity !== 0" />
                    <!-- 预购信息 -->
                    <BookingPrice :detail="detail" v-else-if="activeProduct === 4 && preActivity !== 0" />
                    <!-- 公益棕信息 -->
                    <CharityPrice :detail="detail" :charity-members="charityMembers" v-else-if="productActive === 7 && preActivity !== 0" />
                    <!-- 价格 润笔 购买数量，关注人数 登信息 -->
                    <info-header :detail="detail" v-else />
                    <!-- 开售倒计时 -->
                    <count-down
                        :class="$style.countDown"
                        v-if="detail.shoppingStatus === 1 && (activeProduct === 1 || !preActivity)"
                        size="large"
                        :starttime="detail.serverTime"
                        :endtime="detail.shoppingTimeLong"
                        @done="countFinished"
                    />
                    <!-- 商品名称 -->
                    <DetailTitle :active-product="activeProduct" :pre-activity="preActivity" :activity-tag="detail.activityProductModel && detail.activityProductModel.activityTag" :product-name="detail.productName" />
                    <!-- 商品描述 -->
                    <DetailDesc v-text="detail.productDesc" />
                    <!-- 商品标签 -->
                    <Tags :tags="detail.labelModels" />
                    <!-- 使用期限(注意：预购商品取 activityProductModel.validityPeriodStar，表示预购核销时间) -->
                    <!-- 新春团购或新春预购并且活动进行中 走 activityProductModel (注意：双十二团购无核销时间) -->
                    <useful-life
                        v-if="productType === 'FORMAL_CLASS' || productType === 'EXPERIENCE_CLASS' || productType === 'VIRTUAL_GOODS'"
                        :start="([2,4].indexOf(activeProduct) !== -1 && preActivity === 2) ? (activeProduct === 2 && detail.activityProductModel.type !== '2019_02' ? detail.validityPeriodStart : detail.activityProductModel.validityPeriodStart) : detail.validityPeriodStart"
                        :end="([2,4].indexOf(activeProduct) !== -1 && preActivity === 2) ? (activeProduct === 2 && detail.activityProductModel.type !== '2019_02' ? detail.validityPeriodEnd : detail.activityProductModel.validityPeriodEnd) : detail.validityPeriodEnd"
                    />
                </DetailInfoBox>

                <!-- 选择优惠券 -->
                <counpon-field
                    v-if="couponList.length && preActivity !== 2 && !~[5, 6].indexOf(productActive)"
                    :coupon-list="couponList"
                />

                <Field
                    :class="$style.field"
                    v-if="productType === 'PHYSICAL_GOODS'"
                    label="发货"
                    :label-width="120"
                    content="普通快递"
                />

                <!-- 正常商品 按照 商品本身的规格显示; 活动商品 按照 活动中的商品显示，已下架也需显示规格 -->
                <Field
                    :class="$style.field"
                    label="选择"
                    :label-width="120"
                    :clickable="!noStock && !isDown"
                    @click="showSpecifica = true"
                >
                    <template v-if="currentModel.skuCode1Name">
                        已选择：“<span v-text="currentModel.skuCode1Name" />
                    </template>
                    <template v-if="currentModel.skuCode2Name">，<i v-text="currentModel.skuCode2Name" /></template>
                    <span v-if="!currentModel.id">请选择规格</span>
                </Field>

                <TogetherRule v-if="(activeProduct === 2 || activeProduct === 4) && preActivity === 2" :active-product="activeProduct" :activity-brief="detail.activityProductModel.activityBrief" />

                <!-- 公益棕活动规则 -->
                <CharityRule
                    v-if="activeProduct === 7 && preActivity === 2"
                    :active-product="activeProduct"
                    :detail="detail.activityProductModel.activityBrief"
                    :class="$style.rule"
                />
                <Tabs
                    :tabs="[{ label: '商品详情', value: 2 }, { label: `雅客评论(${ detail.assessmentCount })`, value: 1 }]"
                    v-model="tab"
                >
                    <Comments
                        v-show="tab === 1"
                        :show="tab === 1"
                        :product-id="productId"
                    />
                    <DetailInfo
                        v-show="tab === 2"
                        :content="detail.detail || '暂无详情'"
                    />
                </Tabs>
                <!-- 使用说明 -->
                <Instructions
                    v-if="productType === 'FORMAL_CLASS' || productType === 'EXPERIENCE_CLASS' || productType === 'VIRTUAL_GOODS'"
                    :content="detail.useDesc"
                />

                <!-- 品宣入口 -->
                <div v-if="showBranding" :class="$style.pingxuan" @click="$router.push({ name: 'Appointment', query: { showStatus: 'ALL' } })">
                    <div :class="$style.pingxuanLeft">
                        <div :class="$style.mallName" v-text="mallName" />
                        <div :class="$style.mallDesc" v-text="mallDesc" />
                    </div>
                    <div :class="$style.pingxuanMiddle">
                        <img :src="logoUrl" alt="">
                        <button
                            v-if="mallQRCodeInfo && mallQRCodeInfo.isDetailDisplay"
                            :class="$style.qrcodeBtn"
                            @click.stop="$showMallQRCOde()"
                        >
                            关注
                        </button>
                    </div>
                    <div :class="$style.pingxuanRight">
                        <pl-svg name="icon-right" fill="#ccc" width="20" height="25" />
                    </div>
                </div>

                <!--底部购买按钮  -->
                <buy-now
                    v-if="!~[5, 6].indexOf(productActive) && mchId"
                    type="warning"
                    ref="buyNow"
                    :image="detail.productMainImage"
                    :product-id="productId"
                    :sku-list="detail.productSkuModels"
                    :public-benefit-sku-list="detail.activityProductModel.productModels"
                    :sku-attr-list="detail.productAttributes"
                    :current-sku.sync="currentModel"
                    :product-status="detail.productStatus"
                    :confirm-text="confirmText"
                    :disable-confirm="confirmText === '暂未开售' || noStock || loading"
                    :disable-add-cart="loading"
                    :limiting="limiting"
                    :active-product="activeProduct"
                    :activity-product-model="detail.activityProductModel || null"
                    :pre-activity="preActivity"
                    :product-type="productType"
                    @addToCart="addToCart"
                    @buyNow="buyNow"
                />

                <!-- 详情页面选择规格 - 弹框 -->
                <specification-pop
                    :default-count="defaultCount"
                    :sku-list="detail.productSkuModels"
                    :sku-attr-list="detail.productAttributes"
                    :product-image="detail.productMainImage"
                    :visible.sync="showSpecifica"
                    :sku.sync="currentModel"
                    :limiting="limiting"
                    :active-product="activeProduct"
                    :activity-product-model="detail.activityProductModel || null"
                    :pre-activity="preActivity"
                >
                    <template v-slot:footer="{ currentSku, limiting, limit, publicBenefitActiveStock, publicBenefitActivePrice}" v-if="!~[5, 6].indexOf(productActive) && mchId">
                        <div :class="$style.buttons" v-if="activeProduct === 2 && preActivity === 2">
                            <!-- 活动商品库存不足时，显示该按钮 -->
                            <button
                                v-if="showNormalBuy"
                                :class="$style.add"
                                :disabled="adding || !currentModel.stock || currentModel.count > currentModel.stock || (detail.serverTime - detail.shoppingTimeLong < 0) || loading"
                                @click="buyNow(currentSku, 1, limiting, limit)"
                            >
                                单独购买
                                <div :class="$style.btnText">¥ {{ currentSku.price }}</div>
                            </button>
                            <button
                                :class="$style.buy"
                                :disabled="activeStock <= 0 || loading"
                                @click="buyNow(currentSku, -1, limiting, limit)"
                            >
                                {{ activeStock > 0 ? '我要参团' : '已售罄' }}
                                <div v-if="activeStock > 0" :class="$style.text">¥ {{ detail.activityProductModel.price }}</div>
                            </button>
                        </div>
                        <!-- 秒杀商品下单 -->
                        <div :class="$style.buttons" v-else-if="activeProduct === 3 && preActivity === 2">
                            <!-- 活动商品库存不足时，显示该按钮 -->
                            <button
                                v-if="showNormalBuy"
                                :class="$style.add"
                                :disabled="adding || !currentModel.stock || currentModel.count > currentModel.stock || (detail.serverTime - detail.shoppingTimeLong < 0) || loading"
                                @click="buyNow(currentSku, 1, limiting, limit)"
                            >
                                原价购买
                                <div :class="$style.btnText">¥ {{ currentSku.price }}</div>
                            </button>
                            <button
                                :class="$style.buy"
                                :disabled="activeStock <= 0 || loading"
                                @click="buyNow(currentSku, -1, limiting, limit)"
                            >
                                {{ activeStock > 0 ? '立即秒杀' : '已售罄' }}
                                <div v-if="activeStock > 0" :class="$style.text">¥ {{ detail.activityProductModel.price }}</div>
                            </button>
                        </div>
                        <!-- 预购商品下单 -->
                        <div :class="$style.button" v-else-if="activeProduct === 4 && preActivity === 2 && currentSku.activityProduct">
                            <button
                                :class="$style.preBtn"
                                :disabled="activeStock <= 0"
                                @click="buyNow(currentSku, -1, limiting, limit)"
                            >
                                {{ activeStock > 0 ? '定金购买' : '已售罄' }}
                                <div :class="$style.btnText">¥ {{ detail.activityProductModel.price }}</div>
                            </button>
                        </div>
                        <!-- 公益商品下单 -->
                        <div :class="$style.button" v-else-if="activeProduct === 7 && preActivity === 2">
                            <button
                                :class="$style.preBtn"
                                :disabled="publicBenefitActiveStock <= 0 || productStatus !== 2"
                                @click="buyNow(currentSku, -1, 0, limit)"
                            >
                                {{ publicBenefitActiveStock > 0 ? '公益购买' : '已售罄' }}
                                <div :class="$style.btnText">¥ {{ publicBenefitActivePrice }}</div>
                            </button>
                        </div>
                        <div :class="$style.buttons" v-else>
                            <button
                                :class="$style.add"
                                :disabled="adding || noStock || loading"
                                @click="addToCart(currentSku, limiting, limit)"
                            >
                                加入购物车
                            </button>
                            <button
                                :class="$style.buy"
                                :disabled="adding || noStock || confirmText === '暂未开售' || loading"
                                @click="buyNow(currentSku, 1, limiting, limit)"
                            >
                                {{ confirmText }}
                            </button>
                        </div>
                    </template>
                </specification-pop>

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
                <CharityPoster
                    ref="charityPoster"
                    :data="detail"
                    :donation="detail.activityProductModel.donationAmount"
                    :share="shareUrl"
                    :show-logo="detail.activityProductModel.logoShow"
                    :logo-url="detail.activityProductModel.logoUrl"
                />

                <!--团购的提醒， 团购 且 进行中 显示-->
                <div
                    v-if="(detail.activityProductModel && activeProduct === 2 && preActivity === 2) && (detail.activityProductModel.percolatorCount || detail.activityProductModel.flag)"
                    :class="$style.togetherWarn"
                >
                    <!--双十二团购阶梯奖提醒，在 新春 且 团购 且 进行中 且 设置了阶梯 的条件下显示-->
                    <template v-if="detail.activityProductModel.percolatorCount">
                        <ul>
                            <li
                                v-for="(item, index) in detail.activityProductModel.payUserImageList.slice(-3)"
                                :key="index"
                            >
                                <img :src="item.headImgURL">
                            </li>
                            <li v-if="!detail.activityProductModel.payUserImageList.length"><div>+{{ detail.activityProductModel.percolatorCount }}</div></li>
                            <li v-if="detail.activityProductModel.payUserImageList.length > 3"><div>...</div></li>
                        </ul>
                        <div :class="$style.carveUp">
                            <div>还差{{ detail.activityProductModel.percolatorCount }}人即可瓜分<span>{{ detail.activityProductModel.prize }}元</span>红包</div>
                            <div v-if="detail.activityProductModel.flag">有人未付款，还有机会哟，请稍后刷新尝试</div>
                        </div>
                    </template>
                    <div v-else :class="$style.waitPay">有人未付款，还有机会哟，请稍后刷新尝试</div>
                </div>

                <!-- 正常商品 或 未开始的活动商品 按照 商品本身的状态显示; 活动商品 按照 活动中的商品显示，不理会商品本身的状态 -->
                <div :class="$style.buttomTip" v-if="!loading && isDown && activeProduct === 1 && !~[5, 6].indexOf(productActive) && mchId">
                    该商品已下架
                </div>
                <div :class="$style.buttomTip" v-if="!loading && noStock && mchId">
                    该商品已全部售罄，请选择其它商品购买
                </div>
            </template>

            <!-- 猜你喜欢 -->
            <div style="background-color: #f4f5f9;">
                <you-like :product-id="productId" :is-my="true" />
            </div>
        </template>

        <!-- 骨架屏 -->
        <skeleton v-else />
    </div>
</template>

<script>
import DetailBanner from '../../components/detail/Banner.vue'
import DetailInfoBox from '../../components/detail/Info-Box.vue'
import DetailTitle from '../../components/detail/Title.vue'
import DetailDesc from '../../components/detail/Desc.vue'
import DetailInfo from './components/Detail.vue'
import BuyNow from '../../components/detail/Buy-Now.vue'
import Tags from '../../components/detail/Tags.vue'
import UsefulLife from '../../components/detail/Useful-Life.vue'
import InfoHeader from '../../components/detail/Info-Header.vue'
import Instructions from '../../components/detail/Instructions.vue'
import Field from '../../components/detail/Field.vue'
import CounponField from './components/Counpon-Field.vue'
import { getProductDetail, getCouponInDetail } from '../../apis/product'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import share from '../../assets/js/wechat/wechat-share'
import { mapGetters, mapActions } from 'vuex'
import { GET_CART_COUNT, SET_SHARE_ID } from '../../store/mutation-type'
import { addToCart } from '../../apis/shopping-cart'
import youLike from './../home/components/YouLike.vue'
import SoldOut from './Sold-Out.vue'
import Comments from './Comments.vue'
import CountDown from '../../components/product/Count-Down.vue'
import TogetherBar from './together/Together-Bar'
import SecondBar from './second/Second-Bar'
import BookingBar from './booking/Booking-Bar'
import TogetherRule from './together/Together-Rule'
import TogetherPrice from './together/Together-Price'
import SecondPrice from './second/Second-Price'
import BookingPrice from './booking/Booking-Price'
import CountdownBar from './charity/Countdown-Bar.vue'
import CharityRule from './charity/Rule.vue'
import CharityPoster from './charity/Poster.vue'
import Skeleton from './components/Skeleton.vue'
import Tabs from './components/Tabs.vue'
import Barrage from '../marketing-activity/longmen-festival/action/components/Barrage'
import CharityPrice from './charity/Charity-Price'
import {
    getPublicBenefitStatistics,
    getPublicBenefitList
} from '../../apis/longmen-festival/public-benefit'
import Poster from './poster/Poster'
import GroupPurchasePoster from './poster/Group-Purchase-Poster'
import SeckillPoster from './poster/Seckill-Poster'
import PreorderPoster from './poster/Preorder-Poster'
export default {
    name: 'Product',
    components: {
        TogetherPrice,
        SecondPrice,
        BookingPrice,
        TogetherRule,
        TogetherBar,
        SecondBar,
        BookingBar,
        DetailBanner,
        DetailTitle,
        DetailDesc,
        DetailInfo,
        Field,
        CounponField,
        Tags,
        BuyNow,
        DetailInfoBox,
        SpecificationPop,
        youLike,
        SoldOut,
        Comments,
        UsefulLife,
        InfoHeader,
        Instructions,
        CountDown,
        CountdownBar,
        CharityRule,
        CharityPoster,
        Skeleton,
        Barrage,
        CharityPrice,
        Tabs
    },
    data () {
        return {
            banners: [],
            couponList: [],
            productStatus: 2,
            detail: {},
            productSkuModels: [],
            showSpecifica: false,
            // 当前选中的规格
            currentModel: {},
            // 活动信息
            activityProductModel: {},
            commentForm: {
                current: 1,
                size: 3,
                productId: ''
            },
            agentProduct: false,
            showHaibao: false,
            loaded: false,
            loading: false,
            adding: false,
            creating: false,
            haibao: '',
            tab: 2,
            imgels: [],
            // 公益棕统计数据
            charityStastics: 0,
            // 公益榜单
            charityMembers: [],
            // 分享链接
            shareUrl: '',
            // 活动类型
            qrcode: ''
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
        ...mapGetters(['appId', 'mallUrl', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl', 'mchId', 'roleCode', 'shareId', 'mallQRCodeInfo']),

        // 公益活动可购买数量
        publicBenefitActiveStock () {
            const list = this.detail.activityProductModel.productModels || []
            return Math.max(...list.map(item => item.activityStock)) || 0
        },

        // 活动商品的可购买数量
        activeStock () {
            return this.activityProductModel ? this.activityProductModel.buyCount : 0
        },

        // 1 正常進入詳情 2  团购列表进去  3  秒杀列表进去 4  预购商品列表进去 5 从春耘活动进入 6 从组合课活动进入 7 公益粽子行动
        productActive () {
            return (this.$route.query && Number(this.$route.query.currentProductStatus)) || 1
        },

        /**
         * 传入的活动类型
         * 1 正常商品
         * 2 团购
         * 3 秒杀
         * 4 预购
         * 5 春耘
         * 6 组合课
         */
        activeProduct () {
            return this.detail.activeProduct || 1
        },

        /**
         * 活动进行状态
         * '' 正常商品
         * 0 未开始
         * 1 预热中
         * 2 进行中
         */
        preActivity () {
            return this.detail.preActivity || 0
        },

        /**
         * 是否显示正常购买的按钮，活动数量不足时，显示
         * 正常情况下，它的值等于活动类型
         * 但是当活动商品库存不足时，团购和秒杀需要开放正常购买通道
         */
        showNormalBuy () {
            return this.activeStock <= 0
        },

        /**
         * 判断是否还有库存
         *
         * 其它活动商品的库存同意用
         */
        noStock () {
            // 公益活动
            if (this.activeProduct === 7 && this.preActivity === 2) {
                return !this.publicBenefitActiveStock
            }
            // 如果时预购的商品，根据当前活动库存来判断
            if (this.activeProduct === 4 && this.preActivity === 2) {
                return !this.activeStock
            }

            // 除了预购商品，其它活动商品不判断是否售罄，如果售罄了，就以正常购买途径是否还有库存为准
            if (this.activeProduct === 1 || this.activeStock <= 0 || this.preActivity !== 2) {
                return this.productSkuModels.every(item => item.stock < item.minBuyNum)
            }
            return false
        },
        defaultCount () {
            return this.currentModel.count || 1
        },
        limiting () {
            if (this.activeProduct !== 1 && this.preActivity === 2) {
                return this.activityProductModel.activityLimit ? this.activityProductModel.activityLimitNumber : 0
            }
            return this.detail.purchaseLimit ? (this.detail.purchaseQuantity) : 0
        },
        productType () {
            return this.detail.productType
        },
        confirmText () {
            const textMap = {
                FORMAL_CLASS: '立即学习',
                EXPERIENCE_CLASS: '立即报名'
            }
            if (this.detail.serverTime - this.detail.shoppingTimeLong < 0 && (this.activeProduct === 1 || this.preActivity !== 2)) {
                return '暂未开售'
            }
            return textMap[this.productType] || '立即购买'
        },
        showBranding () {
            return this.detail.showBranding === 1
        },
        minPrice () {
            if (this.detail.productSkuModels) {
                return Math.min(...this.detail.productSkuModels.map(item => item.price))
            }
            return 0
        },
        maxPrice () {
            if (this.detail.productSkuModels) {
                return Math.max(...this.detail.productSkuModels.map(item => item.price))
            }
            return 0
        },
        maxOriginalPrice () {
            if (this.detail.productSkuModels) {
                return Math.max(...this.detail.productSkuModels.map(item => item.originalPrice))
            }
            return 0
        },

        // 是否下架
        isDown () {
            // activeProduct - 1-正常商品 2-团购 3-秒杀 4-预购
            // productStatus - 0：已删除 1：下架 2：上架  3：草稿箱
            return (this.activeProduct === 1 || this.preActivity !== 2) && (this.productStatus === 1 || this.productStatus === 0)
        },

        // 是否展示"商品已删除"提醒
        isDeletedShow () {
            return !~[5, 6].indexOf(this.productActive) && this.activeProduct === 1 && this.productStatus === 0
        }
    },
    watch: {
        productId: {
            async handler () {
            },
            immediate: true
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
        this.showSpecifica = false
        this.showHaibao = false
        this.haibao = ''
        this.currentModel = {}
        this.tab = 2
    },
    async mounted () {
        // 缓存分享人的id
        this.$store.commit(SET_SHARE_ID, this.brokerId)
    },
    methods: {
        ...mapActions({
            getCartCount: GET_CART_COUNT
        }),
        async refresh (productActive) {
            try {
                this.currentModel = {}
                this.haibao = ''
                this.tab = 2
                this.showSpecifica = false
                this.loading = true
                await this.getDetail(productActive)
            } catch (e) {
                setTimeout(() => {
                    this.$router.go(-1)
                }, 2000)
                throw e
            }
            try {
                await this.getCouponList()
                if (this.productActive === 7) {
                    await this.getPublicBenefitInfo()
                }
                this.loaded = true
                await this.createShare()
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        },

        // 查询公益粽想关信息
        async getPublicBenefitInfo () {
            try {
                await Promise.all([
                    this.getPublicBenefitStatistics(),
                    this.getPublicBenefitList()
                ])
            } catch (e) { throw e }
        },

        // 查询公益棕活动统计数据
        async getPublicBenefitStatistics () {
            try {
                const activityId = this.$route.query.activityId
                const { result } = await getPublicBenefitStatistics(activityId)
                this.charityStastics = result
            } catch (e) { throw e }
        },
        // 查询公益榜单
        async getPublicBenefitList () {
            try {
                const activityId = this.$route.query.activityId
                const { result } = await getPublicBenefitList({ activityId, productId: this.productId })
                this.charityMembers = result
            } catch (e) { throw e }
        },

        //  获取商品详情
        async getDetail (productActive) {
            try {
                // 重置一些状态
                this.resetState()
                // 此步是为了兼容处理，当当前产品的活动结束，重新刷新产品详情页面，当作普通商品
                productActive = productActive || this.productActive
                const { result } = await getProductDetail(this.productId, productActive)
                const { id, agentProduct, mediaInfoIds, productStatus } = result
                if (!result) {
                    this.$error('该商品异常')
                    this.$router.go(-1)
                    return
                }
                this.productStatus = productStatus
                this.commentForm.productId = id
                this.agentProduct = agentProduct

                // 存储活动信息
                this.activityProductModel = result.activityProductModel

                // 所有图片
                this.banners = mediaInfoIds
                this.productSkuModels = result.productSkuModels
                this.currentModel = result.productSkuModels.find(item => item.minBuyNum <= item.stock) || result.productSkuModels[0]
                this.currentModel.count = result.productSkuModels[0].minBuyNum
                this.detail = result

                return result
            } catch (e) {
                throw e
            }
        },

        // 获取优惠券
        async getCouponList () {
            try {
                const { result } = await getCouponInDetail(this.productId)
                this.couponList = result
                return result
            } catch (e) {
                throw e
            }
        },
        resetState () {
            this.currentModel = {}
            this.banners.splice(0, 1000000)
        },

        // 判断绑定手机
        hasBind () {
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
                return false
            }
            return true
        },
        addToCart (selected, limiting, limit) {
            if (!this.hasBind()) {
                return
            }
            this.currentModel = selected
            this.adding = true
            const { count, skuCode2 = '', skuCode1 } = selected

            // 分享时携带的id
            return new Promise(async (resolve, reject) => {
                try {
                    await addToCart({
                        productId: this.productId,
                        productCount: count,
                        skuCode: skuCode1,
                        skuCode2,
                        // 如果当前用户是经纪人，则覆盖其他经纪人的id
                        agentUser: this.shareId
                    })
                    this.$success('已添加到购物车')
                    this.showSpecifica = false
                    this.getCartCount()
                } catch (e) {
                    reject(e)
                } finally {
                    this.adding = false
                }
            })
        },

        /**
         * 购买
         * @param selected {object} 选择的规格
         * @param buyWay {number} 购买方式 1：正常购买 其它：活动购买
         * @param limiting {number} 总限购数量
         * @param limit {number} 可买数量
         */
        buyNow (selected, buyWay, limiting, limit) {
            if (!this.hasBind()) {
                return
            }

            /* if (!this.checkLimit(selected, limiting, limit)) {
                return
            } */
            this.currentModel = selected
            const { skuCode1, count, skuCode2, price } = selected

            // 分享时携带的id
            this.$store.commit('submitOrder/setOrderProducts', {
                params: {
                    activeProduct: buyWay === 1 ? 1 : this.activeProduct,
                    preActivity: (buyWay === 1 || this.activeProduct === 1) ? null : this.preActivity,
                    activityId: (this.activeProduct === 1 || buyWay === 1) ? null : this.detail.activityProductModel.activityId
                },
                products: [{
                    productId: this.productId,
                    count,
                    skuCode1,
                    skuCode2,
                    price,
                    // 如果当前用户是经纪人，则覆盖其他经纪人的id
                    agentUser: this.shareId,
                    productType: this.productType
                }]
            })
            this.showSpecifica = false
            this.$router.push({
                name: 'SubmitOrder'
            })
        },

        // 检查限购
        checkLimit (sku, limiting, limit) {
            if (limiting && sku.count > limit) {
                if (limiting === limit) {
                    this.$warning(`您至多购买${ limit }件`)
                    return false
                }
                if (limiting - limit === limiting) {
                    this.$warning(`您已购买${ limiting }件，已达购买上限`)
                    return false
                }
                this.$warning(`您已购买${ limiting - limit }件，您还可以购买${ limit }件`)
                return false
            }
            return true
        },
        // 生成分享
        async createShare () {
            const { productName, productDesc, productMainImage } = this.detail
            try {
                let shareUrl = ''
                if (this.userId) {
                    shareUrl = `${ this.mallUrl }/detail/product/${ this.productId }/${ this.userId }?noCache=${ Date.now() }`
                } else {
                    shareUrl = `${ this.mallUrl }/detail/product/${ this.productId }?noCache=${ Date.now() }`
                }
                this.shareUrl = shareUrl
                let hide = []
                if (this.detail.activeProduct !== 1) {
                    // 活动商品隐藏分享到朋友圈
                    hide = ['menuItem:share:timeline']
                }
                share({
                    appId: this.appId,
                    title: productName,
                    desc: productDesc,
                    link: shareUrl,
                    imgUrl: productMainImage,
                    willHide: hide
                })
            } catch (error) {
                throw error
            }
        },
        async createHaibao (type) {
            if (this.loading) return
            if (this.haibao) {
                this.showHaibao = true
                return
            }
            try {
                this.creating = true
                // 通用数据
                const data = {
                    cover: this.detail.productMainImage,
                    productName: this.detail.productName,
                    originalPrice: this.maxOriginalPrice,
                    avatar: this.avatar,
                    nickname: this.userName,
                    shareUrl: this.shareUrl
                }
                let poster = null
                if (this.preActivity === 2) {
                    if (type === 2) {
                        // 团购海报
                        poster = new GroupPurchasePoster({
                            ...data,
                            price: this.detail.activityProductModel.price,
                            maxPrice: this.maxPrice,
                            headerBg: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/poster3.png',
                            tuanIcon: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/tuangoujia.png',
                            yuanIcon: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/yuan.png',
                            originalPriceIcon: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/yuanjia.png'
                        })
                    } else if (type === 3) {
                        // 秒杀海报
                        poster = new SeckillPoster({
                            ...data,
                            price: this.detail.activityProductModel.price,
                            maxPrice: this.maxPrice,
                            headerBg: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/poster2.png',
                            sekillIcon: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/miaoshajia.png',
                            yuanIcon: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/yuan.png',
                            originalPriceIcon: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/yuanjia.png'
                        })
                    } else if (type === 4) {
                        // 预购海报
                        poster = new PreorderPoster({
                            ...data,
                            price: this.detail.activityProductModel.price,
                            originalPrice: this.detail.activityProductModel.depositTotal,
                            headerBg: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/poster1.png',
                            yujiaoIcon: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/yujiao.png',
                            yuanIcon: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/yuan.png',
                            dikouIcon: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/yugou/dikou.png'
                        })
                    }
                } else {
                    poster = new Poster({
                        ...data,
                        price: this.minPrice
                    })
                }

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

                const { activityId } = this.$route.query
                if (this.userId) {
                    this.shareUrl = `${ this.mallUrl }/detail/product/${ this.productId }/${ this.userId }?currentProductStatus=7&activityId=${ activityId }&noCache=${ Date.now() }`
                } else {
                    this.shareUrl = `${ this.mallUrl }/detail/product/${ this.productId }?currentProductStatus=7&activityId=${ activityId }&noCache=${ Date.now() }`
                }

                this.creating = true
                await this.$nextTick()
                this.$refs.charityPoster.createPoster()
            } catch (error) {
                throw error
            } finally {
                this.creating = false
            }
        },
        async countFinished () {
            // this.$set(this.detail, 'serverTime', '')
            // this.$set(this.detail, 'shoppingTimeLong', '')
            // this.$set(this.detail, 'preActivity', 2)
            // location.reload()
            try {
                await this.refresh()
            } catch (e) {
                throw e
            }
        }
    },
    async beforeRouteUpdate (to, from, next) {
        try {
            await next()
            await this.refresh()
        } catch (e) {
            throw e
        }
    }
}

</script>

<style module lang="scss">

  .lesson {
    position: relative;
    padding-bottom: 120px;
    > .barrage {
        position: absolute;
        left: 0;
        top: 446px;
        z-index: 2;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > button {
      flex: 1;
      width: 340px;
      line-height: 34px;
      padding: 6px 0;
      color: #fff;
      font-size: 30px;
      border-radius: $--radius2;
      &:nth-last-of-type(1) {
        margin-left: 20px;
      }
    }
    .add {
      background-color: $--warning-color;
      &:disabled {
        color: rgba(255, 255, 255, .4);
        .btn-text {
          background-color: #e7e7e7;
          color: #ccc;
        }
      }
    }
    .buy {
      background-color: $--primary-color;
      &:disabled {
        color: #fea455;
      }
    }
    .add, .buy {
      height: 80px;
      color: #fff;
      font-size: 30px;
      &:disabled {
        color: rgba(255, 255, 255, .4);
        .btn-text {
          background-color: #e7e7e7;
          color: #ccc;
        }
      }
    }
    .btn-text{
      margin: 4px auto 0;
      width: 100px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      background: #ffffff;
      border-radius: 304px;
      font-size: 20px;
      color: #FE7700;
    }
  }
  .preBtn{
    width: 100%;
    height: 80px;
    margin-right: 16px;
    color: #fff;
    font-size: 30px;
    background: #FE7700;
    border-radius: 10px;
    &:disabled {
      color: rgba(255, 255, 255, .4);
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
  .together-warn {
    display: flex;
    font-size: 26px;
    background: #FFE1C7;
    text-align: center;
    padding: 10px 32px;
    position: fixed;
    bottom: 111px;
    left: 0;
    width: 100%;
    justify-content: space-between;
    align-content: center;
    box-sizing: border-box;
    > ul {
      display: flex;
      align-items: center;
      margin-right: 30px;
      > li {
        width: 30px;
        height: 48px;
        position: relative;
        > img {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid #FFF;
        }
        > div {
          width: 48px;
          line-height: 48px;
          font-size: 24px;
          text-align: center;
          position: absolute;
          border-radius: 50%;
          color: #FFFFFF;
          opacity: 0.9;
          background: #FE7700;
          border: 1px solid #FFF;
        }
      }
    }
    > .carve-up {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      text-align: right;
      > div {
        width: 100%;
        > span {
          color: #ff0000;
        }
      }
      > div:nth-of-type(2) {
        color: #999999;
        font-size: 20px;
      }
    }
    > .wait-pay {
      width: 100%;
      text-align: center;
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
          background-color: #FBFBFB;
      }
      > img {
          width: 560px;
          object-fit: cover;
      }
  }
  .count-down {
    top: 0;
    left: 0;
    transform: translateY(-100%);
    width: 100%;
  }
  .pingxuan {
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 24px;
    background-color: #fff;
    .pingxuan-left {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding-right: 96px;
    }
    .mall-name {
      font-size: 36px;
      font-weight: bold;
      line-height: 50px;
    }
    .mall-desc {
      margin-top: 16px;
      font-size: 24px;
      color: #999;
      line-height: 35px;
      @include elps-wrap(2);
    }
    .pingxuan-middle {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 40px;
      > img {
        width: 128px;
        height: 128px;
        object-fit: cover;
        border-radius: 64px;
      }
    }
    .pingxuan-right {
      display: flex;
      flex-direction: column;
    }
    .qrcode-btn {
        margin-top: 14px;
        width: 120px;
        height: 48px;
        background: #F2B036;
        border-radius: 30px;
        font-size: 26px;
        font-family: Microsoft YaHei;
        line-height: 48px;
        text-align: center;
        color: #FFFFFF;
    }
  }

  .haibao-canvas {
    width: 560px;
    height: 673px;
    .haibao-top {
      display: flex;
      align-items: center;
      height: 96px;
      padding: 0 16px;
      text-align: center;
      background-color: #fff;
      &.active-product {
        background-color: #fa4d2f;
        justify-content: center;
      }
      > img {
        height: 80px;
      }
      .avatar {
        width: 64px;
        height: 64px;
        margin-right: 16px;
        object-fit: cover;
      }
      .nickName {
        font-size: 24px;
        color: #000;
      }
    }
    .product-main-image {
      > img {
        width: 560px;
        height: 373px;
        object-fit: cover;
      }
    }
    .hai-bao-bottom {
      display: flex;
      justify-content: space-between;
      height: 204px;
      padding: 20px 24px;
      background-color: #fff;
      box-sizing: border-box;
      &.active-product {
        background-color: #FA4D2F;
        .pro-name {
          height: 40px;
          color: #fff;
          @include elps();
        }
      }
    }
    .bottom-left {
      width: 310px;
      > .pro-name {
        width: 310px;
        height: 80px;
        line-height: 40px;
        margin-bottom: 10px;
        font-size: 28px;
        color: #000;
      }
      > .haibao-price {
        > span {
          margin-right: 20px;
          font-size: 44px;
          color: #ef7700;
        }
        > del {
          font-size: 28px;
          color: #999;
        }
      }
      > .yujiao, .dikou {
        display: flex;
        align-items: center;
        img {
          height: 56px;
        }
        > span {
          margin: 0 5px;
          font-size: 44px;
          color: #F9E687;
          font-weight: bold;
        }
      }
      .dikou {
        img {
          height: 52px;
        }
        > span {
          color: #fff;
        }
      }
    }
    .qrcode {
      width: 160px;
      height: 160px;
    }
  }
.field {
    margin-top: 20px;
    padding: 0 24px;
}
.rule {
    margin-top: 20px;
}

</style>
