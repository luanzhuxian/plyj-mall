<template>
    <div
        v-if="!loading"
        :class="$style.submitOrder"
    >
        <div
            :class="$style.address + ' radius-20'"
            v-if="physicalProducts.length > 0"
        >
            <AddressItem ref="addAddressItem" />
        </div>

        <ProductVeiwer
            :products="products"
            :pre-activity="preActivity"
            :active-product="activeProduct"
        >
            <template>
                <InfoItem v-if="physicalProducts.length > 0">
                    <div slot="label">
                        <span>配送方式</span>
                        <span v-if="freight > 0" class="ml-10">普通快递</span>
                    </div>
                    <template slot="content">
                        <span v-if="freight === 0" :class="$style.itemContent">
                            快递免邮
                        </span>
                        <span v-if="freight > 0" :class="$style.freight">
                            ¥ {{ freight }}
                        </span>
                    </template>
                </InfoItem>

                <InfoItem v-if="activeProduct === 5 && detail.discount !== 10">
                    <template slot="label">春耘折扣</template>
                    <template slot="content">
                        {{ detail.discount }}折 -¥{{ (physicalProductOriginalPrice - physicalProductPrice).toFixed(2) }}
                    </template>
                </InfoItem>

                <InfoItem v-if="activeProduct === 6 && detail.discount !== 10">
                    <template slot="label">组合折扣</template>
                    <span slot="content">{{ detail.discount }}折 -¥{{ (physicalProductOriginalPrice - physicalProductPrice).toFixed(2) }}</span>
                </InfoItem>

                <InfoItem>
                    <template slot="label">商品金额</template>
                    <span slot="content" class="gray-1">¥ {{ goodsAmount }}</span>
                </InfoItem>
            </template>
            <!--<div slot="physical">
                &lt;!&ndash;<InfoItem v-if="isCart">
                    <template slot="label">订单备注</template>
                    <template slot="content">
                        <input
                            :class="$style.remark"
                            type="text"
                            placeholder="选填"
                            v-model="physicalRemark"
                        >
                    </template>
                </InfoItem>&ndash;&gt;

                <InfoItem v-if="!isCart">
                    <template slot="label">购买数量</template>
                    <template slot="content">
                        <div :class="$style.editCount">
                            <span>剩余{{ (activeProduct !== 1 && preActivity === 2) ? physicalProducts[0].activeStock : physicalProducts[0].stock }}件</span>
                            <Count
                                :min="physicalProducts[0].minBuyNum"
                                :max="(activeProduct !== 1 && preActivity === 2) ? (physicalProducts[0].activityLimit ? physicalProducts[0].activityLimitNumber : physicalProducts[0].activeStock) : (physicalProducts[0].purchaseQuantity || physicalProducts[0].stock)"
                                :count="physicalProducts[0].count"
                                @change="(count, next) => { countChange(count, physicalProducts[0], next) }"
                            />
                        </div>
                    </template>
                </InfoItem>

                &lt;!&ndash;<InfoItem v-if="(coupon.amount || isNotChooseCoupon) && !isCart && activeProduct === 1" @click="showCoupon = true">
                    <template slot="label">优惠券</template>
                    <span slot="content">
                        <span v-if="!isNotChooseCoupon">-¥{{ coupon.amount }}</span>
                        <span v-else>{{ couponList.length }}张可用</span>
                        <pl-svg name="icon-right" fill="#ccc" width="22" style="vertical-align: -2px;" class="ml-10" />
                    </span>
                </InfoItem>&ndash;&gt;

                &lt;!&ndash;<InfoItem
                    v-if="(totalAmount + (currentRedEnvelope.amount || 0) - (freight || 0)) && (currentRedEnvelope.amount || isNotChooseRedEnvelope) && redEnvelopeList.length && !isCart && activeProduct === 1"
                    @click="showRedEnvelopePopupClick"
                >
                    <template slot="label">奖学金（红包）</template>
                    <span slot="content">
                        <span v-if="!isNotChooseRedEnvelope">-¥{{ currentRedEnvelope.amount }}</span>
                        <span v-else-if="redEnvelopeList.length">有可用</span>
                        <span v-else>无可用</span>
                        <pl-svg class="ml-10" name="icon-right" fill="#ccc" width="22" style="vertical-align: -2px;" />
                    </span>
                </InfoItem>&ndash;&gt;
            </div>-->

            <!-- 非实体商品显示（虚拟和课程） -->
            <!--<template v-slot:noPhysical="{ type, product: item }">
                <InfoItem v-if="item.productType === 'KNOWLEDGE_COURSE'">
                    <template slot="label">
                        有效期
                    </template>
                    <template slot="content">
                        {{ item.validity ? `购买后${ item.validity }天内学完` : '购买后不限观看次数' }}
                    </template>
                </InfoItem>
                <InfoItem v-else>
                    <template slot="label">使用时间</template>
                    <p slot="content" class="fz-24" v-if="item.validityPeriodStart">
                        <span>
                            {{ item.validityPeriodStart | dateFormat('YYYY.MM.DD') }}
                        </span>
                        <template v-if="item.validityPeriodStart.split(' ')[0] !== item.validityPeriodEnd.split(' ')[0]">
                            -
                            <span>
                                {{ item.validityPeriodEnd | dateFormat('YYYY.MM.DD') }}
                            </span>
                        </template>
                    </p>
                    <p slot="content" v-else class="fz-24">
                        长期有效
                    </p>
                </InfoItem>
                <InfoItem v-if="activeProduct === 5 && detail.discount !== 10">
                    <template slot="label">春耘折扣</template>
                    <span slot="content">{{ detail.discount }}折 -¥{{ ((item.originPrice - item.price) * item.count).toFixed(2) }}</span>
                </InfoItem>
                <InfoItem v-if="activeProduct === 6 && detail.discount !== 10">
                    <template slot="label">组合折扣</template>
                    <span slot="content">{{ detail.discount }}折 -¥{{ ((item.originPrice - item.price) * item.count).toFixed(2) }}</span>
                </InfoItem>
                <StudentInline
                    v-if="isCart && item.needStudentInfo === 1"
                    :product="item"
                    :count="item.count"
                    :lesson-error-id="lessonErrorId"
                    :lesson-error-tip="lessonErrorTip"
                    :students="CHECKED_STUDENT[item.skuCode1 + item.skuCode2] || []"
                    :custom-list="item.formEntityList"
                />
                <CustomInline
                    :key="item.skuCode1 + item.skuCode2"
                    v-if="isCart && item.needStudentInfo === 2"
                    :product="item"
                    :count="item.count"
                    :custom-list="item.formEntityList"
                    :error-item-id="customErrorId"
                />
                &lt;!&ndash;<InfoItem v-if="isCart">
                    <template slot="label">订单备注</template>
                    <input
                        slot="content"
                        :class="$style.remark"
                        type="text"
                        placeholder="选填"
                        v-model="item.remark"
                    >
                </InfoItem>&ndash;&gt;
                <InfoItem v-if="!isCart">
                    <template slot="label">购买数量</template>
                    <div :class="$style.editCount" slot="content">
                        <span>剩余{{ (activeProduct !== 1 && preActivity === 2) ? item.activeStock : item.stock }}件</span>
                        <Count
                            :min="item.minBuyNum"
                            :max="(activeProduct !== 1 && preActivity === 2) ? (item.activityLimit ? item.activityLimitNumber : item.activeStock) : (item.purchaseQuantity || item.stock)"
                            :count="item.count"
                            @change="(count, next) => { countChange(count, item, next) }"
                        />
                    </div>
                </InfoItem>
                <InfoItem>
                    <template slot="label">商品金额</template>
                    <span slot="content" class="gray-1">¥ {{ item.amount }}</span>
                </InfoItem>
                <InfoItem v-if="(coupon.amount || isNotChooseCoupon) && !isCart && activeProduct === 1">
                    <template slot="label">优惠券</template>
                    <div slot="content">
                        <span v-if="!isNotChooseCoupon">-¥{{ coupon.amount }}</span>
                        <span v-else>{{ couponList.length }}张可用</span>
                        <pl-svg name="icon-right" fill="#ccc" width="22" style="vertical-align: -2px;" class="ml-10" />
                    </div>
                </InfoItem>
                &lt;!&ndash;<InfoItem
                    v-if="(totalAmount + (currentRedEnvelope.amount || 0) - (freight || 0)) && (currentRedEnvelope.amount || isNotChooseRedEnvelope) && redEnvelopeList.length && !isCart && activeProduct === 1"
                    @click="showRedEnvelopePopupClick"
                >
                    <template slot="label">奖学金（红包）</template>
                    <div slot="content">
                        <span v-if="!isNotChooseRedEnvelope">-¥{{ currentRedEnvelope.amount }}</span>
                        <span v-else-if="redEnvelopeList.length">有可用</span>
                        <span v-else>无可用</span>
                        <pl-svg name="icon-right" fill="#ccc" width="22" style="vertical-align: -2px;" class="ml-10" />
                    </div>
                </InfoItem>&ndash;&gt;
            </template>-->
        </ProductVeiwer>

        <CustomBlock
            v-if="physicalProducts.some(item => item.needStudentInfo === 2)"
            :products="physicalProducts"
            :error-item-id="customErrorId"
            label="用户信息"
        />

        <div :class="$style.confirm">
            <div>
                <span class="fz-20 gray-2">合计</span>
                <span
                    class="rmb fz-32"
                    v-text="totalAmount || 0"
                />
            </div>
            <pl-button
                style="width: 28vw;"
                :loading="submiting"
                type="warning"
                size="large"
                @click="submitOrder"
            >
                确认付款
            </pl-button>
        </div>
        <Coupon
            v-if="loaded"
            :active-product="activeProduct"
            @change="couponChange"
        />
        <Scholarship
            v-if="loaded"
            :active-product="activeProduct"
            :total-amount="totalAmount"
            :freight="freight"
            :current-coupon="currentCoupon"
            @change="scholarshipChange"
        />
        <Invoice
            v-if="loaded && showInvoiceSelector"
            :active-product="activeProduct"
            :total-amount="totalAmount"
            :products="products"
            :contact-info-model="form.userAddress"
            @selected="invoiceSelected"
        />
        <ContactInfo
            :physical-products="physicalProducts"
            @change="contactInfoChange"
        />
        <Student
            :products="products"
            @selected="studentSelected"
        />

        <!---->

        <CustomBlock
            v-if="customList.length === 1"
            :product="customList[0]"
            :count="customList[0].count"
            :custom-list="customList[0].formEntityList"
            :label="physicalProducts.length ? '用户信息' : '学员信息'"
        />

        <!-- 订单备注（只有一个商品时显示） -->
        <div :class="$style.oneProductMark">
            <span>订单备注</span>
            <input type="text" placeholder="请和商家协商一致后填写" v-model="form.orderPostscript">
        </div>

        <!---->
    </div>

    <div
        :class="$style.skeleton"
        v-else
    >
        <div :class="$style.skeleton1">
            <AddressItemSkeleton />
        </div>
        <div :class="$style.skeleton2">
            <div :class="$style.skeleton21 + ' ' + $style.skeAnimation" />
            <OrderItemSkeleton />
            <div :class="$style.skeleton22 + ' ' + $style.skeAnimation" />
            <div :class="$style.skeleton23 + ' ' + $style.skeAnimation" />
            <div :class="$style.skeleton24 + ' ' + $style.skeAnimation" />
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import AddressItem from '../../components/item/Address-Item.vue'
// import OrderItem from '../../components/item/Order-Item.vue'
import moment from 'moment'
import {
    confirmCart,
    // submitOrder,
    submitOrderPay
} from '../../apis/shopping-cart'
import { getCouponOfMax, getCouponByPrice, getRedEnvelopeListByPrice } from '../../apis/my-coupon'
import {
    cancelOrder,
    confirmOrder,
    submitOrder,
    deleteOrder
} from '../../apis/order-manager'
import wechatPay from '../../assets/js/wechat/wechat-pay'
import { mapGetters, mapActions } from 'vuex'
import { STUDENTS } from '../../store/mutation-type'
import OrderItemSkeleton from '../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../components/skeleton/Address-Item.vue'
import Count from '../../components/common/Count.vue'
import { checkLength, isPhone } from '../../assets/js/validate'
import { resetForm, setTimeoutSync } from '../../assets/js/util'
import { getServerTime } from '../../apis/base-api'
import StudentInline from './components/Student-Inline.vue'
import CustomInline from './components/Custom-Inline.vue'
// import OtherInfo from './components/Other-Info.vue'
import InfoItem from './components/Info-Item.vue'
import CustomBlock from './components/Custom-Block.vue'
import ProductVeiwer from './components/Product-Veiwer.vue'
import Coupon from './components/Coupon.vue'
import Scholarship from './components/Scholarship.vue'
import Invoice from './components/Invoice.vue'
import ContactInfo from './components/Contact-Info.vue'
import Student from './components/Student.vue'
export default {
    name: 'SubmitOrderV2',
    components: {
        AddressItem,
        // OrderItem,
        OrderItemSkeleton,
        AddressItemSkeleton,
        Count,
        StudentInline,
        // OtherInfo,
        InfoItem,
        CustomInline,
        CustomBlock,
        ProductVeiwer,
        Coupon,
        Scholarship,
        Invoice,
        ContactInfo,
        Student
    },
    data () {
        this.requestPayDataCount = 0
        return {
            showPopup: false,
            showContactPopup: false,
            submiting: false,
            loading: false,
            showCoupon: false,
            // 是否显示选择发票
            showInvoiceSelector: false,
            // 物流价格
            freight: 0,
            // 商品价格，不含其它费用
            totalAmount: 0,
            // 总消费价格
            goodsAmount: 0,
            // 优惠券信息
            currentCoupon: {},
            // 优惠券信息
            couponList: [],
            // 实体商品
            physicalProducts: [],
            // 全部商品列表
            products: [],
            // physicalProducts: [],
            // virtualProducts: [],
            // lessonList: [],
            needStudentList: [],
            // 需要自定义表单的商品
            customList: [],
            invioceType: 0,
            INVOICE_MODEL: {},
            CHECKED_STUDENT: {},
            detail: {},
            // 学员信息错误标记点
            lessonErrorId: '',
            // 学员信息错误标记点提示语
            lessonErrorTip: '',
            // 自定义表单错误信息点
            customErrorId: '',
            // 服务器时间
            serverTime: '',
            showRedEnvelopePopup: false,
            // 红包列表
            redEnvelopeList: [],
            // 当前选中的红包
            currentRedEnvelope: {},
            /* ******************* v2 ********************* */
            form: {
                activityId: '',
                helper: '',
                // 商品来源：1 正常购买下单， 2 团购商品购买下单，3秒杀商品购买下单，4.预购商品下单确认，5春耘，6组合商品
                source: 1,
                skus: [],
                students: [],
                // 地址信息
                userAddress: null,
                // 留言
                orderPostscript: '',
                // 奖学金
                scholarshipModel: null,
                // 优惠券
                cartCouponModel: null,
                // 发票
                invoiceInfoModel: null,
            },
            loaded: false
        }
    },
    computed: {
        ...mapGetters(['selectedAddress', 'openId', 'mobile', 'addressList', 'realName', 'userName', 'shareId']),
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
            return this.preActivity === 2 ? Number(this.$route.query.activeProduct) || 1 : 1
        },
        // 传入的活动状态 2 为进行中
        preActivity () {
            return Number(this.$route.query.preActivity) || 1
        },
        // 活动id
        activityId () {
            return this.$route.query.activityId || ''
        },
        // 是否为购物车页面购买，有些活动页面的购买逻辑类似于购物车购买逻辑，因此也需要传YES, 如：组合课活动下单
        isCart () {
            return this.$route.query.isCart === 'YES'
        },
    },
    watch: {
    },
    async mounted () {
        try {
            await this.init()
        } catch (e) {
            throw e
        }
    },
    deactivated () {
    },
    methods: {
        // 初始化，执行顺序不能乱
        async init () {
            try {
                await this.initProductInfo()
                const { result: serverTime } = await getServerTime()
                this.serverTime = serverTime
                this.loaded = true
            } catch (e) {
                throw e
            }
        },
        // 根据初始化的商品基本信息，获取商品详情和价格
        async getProductDetail () {
            try {
                // 选择合适的优惠券
                const { result } = await confirmOrder(this.form)
                const {
                    amount,
                    goodsTotalPrice,
                    freightAmount,
                    skus,
                    skusGrouping: {
                        PHYSICAL_GOODS = []
                    }
                } = result
                this.goodsAmount = goodsTotalPrice / 100
                this.totalAmount = amount / 100
                this.freight = Number(freightAmount) / 100
                this.physicalProducts = PHYSICAL_GOODS
                // 将线上课归到课程中
                this.products = skus
                this.showInvoiceSelector = skus.some(item => item.supportInvoice === 1)
            } catch (e) {
                throw e
            }
        },
        // 初始化商品基本信息
        async initProductInfo () {
            /*
                CONFIRM_LIST 的格式
                [
                    {
                        productId: "1241922868768460800"
                        count: 1
                        skuCode1: "1241922766104481793"
                        skuCode2: ""
                        price: 0.01
                        agentUser: "123123"
                        productType: "PHYSICAL_GOODS"
                    }
                ]
            */
            try {
                const CONFIRM_LIST = JSON.parse(sessionStorage.getItem('CONFIRM_LIST'))
                if (!CONFIRM_LIST || !CONFIRM_LIST.length) {
                    return this.$router.replace({ name: 'Home' })
                }
                this.form.activityId = this.activityId
                this.form.helper = this.shareId
                this.form.source = this.activeProduct
                if (this.selectedAddress) {
                    this.form.userAddress = {
                        addressSeq: this.selectedAddress.sequenceNbr,
                        mobile: this.selectedAddress.mobile,
                        name: this.selectedAddress.realName
                    }
                }
                this.form.skus = CONFIRM_LIST.map(item => ({
                    count: item.count,
                    goodsId: item.productId,
                    goodsType: item.productType,
                    productCustomInfo: '',
                    sku1: item.skuCode1,
                    sku2: item.skuCode2
                }))
                return  CONFIRM_LIST
            } catch (e) {
                throw e
            }
        },
        // 根据商品总价，获取合适的优惠券，并设置为当前的优惠券
        // async getCouponOfMax (proList = []) {
        //     try {
        //         // 获取优惠券信息
        //         const { result } = await getCouponOfMax({
        //             activeProduct: this.preActivity === 2 ? this.activeProduct : 1,
        //             activityId: this.activityId,
        //             cartProducts: proList,
        //             addressSeq: this.selectedAddress.sequenceNbr
        //         })
        //         // 设置优惠券
        //         if (result.id) {
        //             this.form.cartCouponModel = {
        //                 userCouponId: result.id
        //             }
        //         }
        //         this.coupon = result.id ? result : { scholarship: 1 }
        //         return result
        //     } catch (e) {
        //         throw e
        //     }
        // },
        // 获取优惠券列表
        // async getCouponList (proList) {
        //     try {
        //         if (this.activeProduct !== 1) return
        //         const { result } = await getCouponByPrice({
        //             activeProduct: this.preActivity === 2 ? this.activeProduct : 1,
        //             activityId: this.activityId,
        //             cartProducts: proList,
        //             addressSeq: this.selectedAddress.sequenceNbr
        //         })
        //         const { serverTime } = this
        //         this.couponList = result.map(item => {
        //             const duration = moment(item.useEndTime).valueOf() - moment(serverTime).valueOf()
        //             const day = Math.floor(moment.duration(duration).asDays())
        //             item.timeDesc = ''
        //             if (day < 4) item.timeDesc = day < 1 ? '即将过期' : `${ day }天后过期`
        //             return item
        //         })
        //     } catch (e) {
        //         throw e
        //     }
        // },
        // 选择优惠券, 选择完成后，重新计算价格
        // async couponClick (item) {
        //     this.form.cartCouponModel = item.id ? { userCouponId: item.id } : null
        // },
        // 修改优惠券
        async couponChange (coupon) {
            this.currentCoupon = coupon
            this.form.cartCouponModel = coupon.id ? { userCouponId: coupon.id } : null
            // 优惠券的改变会引起奖学金的改变，因此，等待奖学金改变后，在调用
            await this.$nextTick()
            try {
                await this.getProductDetail()
            } catch (e) {
                throw e
            }
        },
        // 修改红包
        async scholarshipChange (scholarship) {
            this.form.scholarshipModel = scholarship.id ? { scholarshipId: scholarship.id } : null
            try {
                await this.getProductDetail()
            } catch (e) {
                throw e
            }
        },
        // 修改联系人
        contactInfoChange ({ name, mobile }) {
            this.form.userAddress = name ? {
                mobile,
                name
            } : null
        },
        // 选择了发票
        invoiceSelected (data) {
            this.form.invoiceInfoModel = data ? {
                invoiceTitle: data.invoiceTitle,
                invoiceType: data.invoiceType,
                taxpayerNumber: data.tin,
                skus: data.orderDetails
            } : null
        },
        // 选择了学员
        studentSelected (data) {
            this.form.students = data.map(item => ({
                name: item.stuName,
                mobile: item.stuMobile
            }))
        },
        submitOrder () {
            console.log(this.physicalProducts)
        }
    },
    beforeRouteLeave (to, from, next) {
        next()
    }
}
</script>

<style module lang="scss">
    @import "scss/submit-order";
</style>
