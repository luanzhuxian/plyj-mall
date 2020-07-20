<template>
    <div>
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
                :exchange-code-map="exchangeCodeMap"
                :exchange-code="exchangeCodeInfo"
                :is-cart="isCart"
                @exchangeCodeChange="exchangeCodeChange"
                @studentInited="studentInited"
                @countChange="countChange"
                ref="productVeiwer"
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

            <div
                v-if="physicalProducts.length > 0"
                :class="$style.itemSelector"
            >
                <pl-fields
                    size="middle"
                    text="普通快递"
                    icon="icon-express"
                    :icon-gap="12"
                    :right-text="freight ? '¥' + freight : '包邮'"
                    left-text-weight="bold"
                />
            </div>

            <!--知识课程暂时不支持使用优惠券-->
            <Coupon
                v-if="couponList.length > 0 && activeProduct === 1 && goodsAmount > 0 && !hasKnowlegeCourse && !exchangeCodeInfo.id"
                :active-product="activeProduct"
                :coupon.sync="currentCoupon"
                :coupon-list="couponList"
                :recommend-coupon="recommendCoupon"
                @change="couponChange"
            />
            <!--知识课程暂时不支持使用奖学金-->
            <Scholarship
                v-if="goodsAmount > 0 && activeProduct === 1 && !hasKnowlegeCourse && !exchangeCodeInfo.id"
                :active-product="activeProduct"
                :total-amount="totalAmount"
                :freight="freight"
                :red-envelope-list="redEnvelopeList"
                :current-red-envelope.sync="currentRedEnvelope"
                :current-coupon="currentCoupon"
                @change="scholarshipChange"
            />

            <!--除运费以外的实付款小于等于0, 不支持开发票-->
            <Invoice
                :disabled="totalAmount - freight <= 0"
                :active-product="activeProduct"
                :total-amount="totalAmount"
                :products="products"
                :contact-info-model="form.userAddress"
                :physical-products="physicalProducts"
                @selected="invoiceSelected"
            />

            <ContactInfo
                v-if="!physicalProducts.length"
                :physical-products="physicalProducts"
                @change="contactInfoChange"
            />
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
    </div>
</template>

<script>
import AddressItem from '../../components/item/Address-Item.vue'
import moment from 'moment'
import { getCouponOfMax, getCouponByPrice, getRedEnvelopeListByPrice, getExchangeCodeMap } from '../../apis/my-coupon'
import {
    confirmOrder,
    submitOrder,
    getOrderPayData,
    cancleOrderListByBatchNumber
} from '../../apis/order-manager'
import { getList } from '../../apis/student'
import { mapGetters } from 'vuex'
import OrderItemSkeleton from '../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../components/skeleton/Address-Item.vue'
import { getServerTime } from '../../apis/base-api'
import ProductVeiwer from './components/Product-Veiwer.vue'
import Coupon from './components/Coupon.vue'
import Scholarship from './components/Scholarship.vue'
import Invoice from './components/Invoice.vue'
import ContactInfo from './components/Contact-Info.vue'
import { setTimeoutSync } from '../../assets/js/util'
import wechatPay from '../../assets/js/wechat/wechat-pay'
export default {
    name: 'SubmitOrder',
    components: {
        AddressItem,
        OrderItemSkeleton,
        AddressItemSkeleton,
        ProductVeiwer,
        Coupon,
        Scholarship,
        Invoice,
        ContactInfo
    },
    data () {
        this.requestPayDataCount = 0
        return {
            // 提交中
            submiting: false,
            // 加载数据中
            loading: true,
            // 物流价格
            freight: 0,
            // 商品价格，不含其它费用
            totalAmount: 0,
            // 总消费价格
            goodsAmount: 0,
            // 优惠券信息
            currentCoupon: {},
            // 推荐的优惠券
            recommendCoupon: {},
            // 优惠券信息
            couponList: [],
            // 当前默认选择的兑换码信息
            exchangeCodeInfo: {},
            // 商品兑换码列表
            exchangeCodeMap: {},
            // 实体商品
            physicalProducts: [],
            // 全部商品列表
            products: [],
            // 需要自定义表单的商品
            customList: [],
            // 服务器时间
            serverTime: '',
            // 红包列表
            redEnvelopeList: [],
            // 当前选中的红包
            currentRedEnvelope: {},
            form: {
                activityId: '',
                helper: '',
                // 商品来源：1 正常购买下单， 2 团购商品购买下单，3秒杀商品购买下单，4.预购商品下单确认，5春耘，6组合商品，7公益， 8兑换码
                source: 1,
                // 其中的goodType包括: PHYSICAL_GOODS VIRTUAL_GOODS SERIES_OF_COURSE EXPERIENCE_CLASS KNOWLEDGE_COURSE SERIES_OF_COURSE LIVE_GOODS
                skus: [],
                // 地址信息
                userAddress: null,
                // 奖学金
                scholarshipModel: null,
                // 优惠券
                cartCouponModel: null,
                // 发票
                invoiceInfoModel: null
            }
        }
    },
    computed: {
        ...mapGetters(['selectedAddress', 'openId', 'mobile', 'addressList', 'realName', 'userName', 'shareId', 'orderTypeKeyMap', 'skuSourceKeyMap', 'submitOrder/orderProducts', 'submitOrder/exchangeCodeInfo', 'submitOrder/checkedStudents']),
        // 是否从购物车进入的确认订单页面
        isCart () {
            return !!this.$route.query.isCart
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
            return this.preActivity === 2 ? Number(this.params.activeProduct) || 1 : 1
        },
        // 传入的活动状态 2 为进行中
        preActivity () {
            return Number(this.params.preActivity) || 1
        },
        // 活动id
        activityId () {
            return this.params.activityId
        },
        params () {
            return this['submitOrder/orderProducts'].params || { activityId: '', preActivity: '', activeProduct: '1' }
        },
        hasKnowlegeCourse () {
            return this.form.skus.some(item => [this.orderTypeKeyMap.KNOWLEDGE_COURSE, this.orderTypeKeyMap.SERIES_OF_COURSE].includes(item.goodsType))
        }
    },
    watch: {
    },
    async mounted () {
        try {
            this.loading = true
            await this.init()
            await this.getProductDetail()
            // 设置默认学员
            await this.setDefaultChecked()
            this.loading = false
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
                const CONFIRM_LIST = await this.initProductInfo()
                await this.initRedeemCode()
                // 以下是设置订单红包和优惠券，只有普通订单并且没有默认使用兑换码 才可以选择优惠券和红包 或者 兑换码
                if (this.activeProduct === 1 && !this.exchangeCodeInfo.isDefault) {
                    // 获取服务器时间
                    const { result: serverTime } = await getServerTime()
                    // 设置服务器时间
                    this.serverTime = serverTime

                    if (!this.hasKnowlegeCourse) {
                        const AMOUNT = CONFIRM_LIST.map(item => item.price * item.count).reduce((total, price) => total + price)
                        const COUPON_DATA = {
                            activeProduct: this.preActivity === 2 ? this.activeProduct : 1,
                            activityId: this.activityId,
                            cartProducts: CONFIRM_LIST,
                            addressSeq: this.selectedAddress.sequenceNbr
                        }
                        // 初始化优惠券列表
                        const { result: COUPON_LIST } = await getCouponByPrice(COUPON_DATA)
                        // 获取推荐的优惠券
                        const { result: MAX_COUPON } = await getCouponOfMax(COUPON_DATA)
                        // 获取奖学金
                        const { result: RED_ENVELOP } = await getRedEnvelopeListByPrice(AMOUNT)
                        // 设置优惠券列表
                        this.couponList = COUPON_LIST.map(item => {
                            const duration = moment(item.useEndTime).valueOf() - moment(serverTime).valueOf()
                            const day = Math.floor(moment.duration(duration).asDays())
                            item.timeDesc = ''
                            if (day < 4) item.timeDesc = day < 1 ? '即将过期' : `${ day }天后过期`
                            return item
                        })
                        // 设置当前选中的优惠券
                        this.currentCoupon = COUPON_LIST.find(coupon => coupon.id === MAX_COUPON.id) || {}
                        // 设置推荐的优惠券
                        this.recommendCoupon = MAX_COUPON
                        // 设置奖学金列表
                        this.redEnvelopeList = RED_ENVELOP.map(item => {
                            const duration = moment(item.useEndTime).valueOf() - moment(serverTime).valueOf()
                            const day = Math.floor(moment.duration(duration).asDays())
                            item.timeDesc = ''
                            if (day < 4) item.timeDesc = day < 1 ? '即将过期' : `${ day }天后过期`
                            return item
                        })
                        this.form.cartCouponModel = this.currentCoupon.id ? { userCouponId: this.currentCoupon.id } : null
                        // 默认不选择奖学金
                        this.currentRedEnvelope = {}
                        this.form.scholarshipModel = null
                    }

                    // 初始化兑换码列表
                    const productIdList = CONFIRM_LIST.map(item => item.productId)
                    const { result: exchangeCodeMap } = await getExchangeCodeMap(productIdList)
                    for (const productId in exchangeCodeMap) {
                        for (const code of exchangeCodeMap[productId]) {
                            const duration = moment(code.endTime).valueOf() - moment(serverTime).valueOf()
                            const day = Math.floor(moment.duration(duration).asDays())
                            code.timeDesc = ''
                            if (day < 4) code.timeDesc = day < 1 ? '即将过期' : `${ day }天后过期`
                        }
                    }
                    this.exchangeCodeMap = exchangeCodeMap
                }
                // 初始化优惠信息
                await this.initDiscountModel()
            } catch (e) {
                throw e
            }
        },
        // 根据初始化的商品基本信息，获取商品详情和价格
        async getProductDetail () {
            try {
                const form = JSON.parse(JSON.stringify(this.form))
                // 使用兑换码后，修改部分参数
                if (this.exchangeCodeInfo.id) {
                    form.source = 8
                    form.activityId = this.exchangeCodeInfo.id
                }
                const { result } = await confirmOrder(form)
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
                this.setOrderPostscript(this.products, skus)
                // 将线上课归到课程中
                this.products = skus
                this.customList = skus.filter(item => item.skuCustoms.length)
            } catch (e) {
                setTimeout(() => {
                    this.$router.go(-1)
                }, 2000)
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
                const { products: CONFIRM_LIST } = this['submitOrder/orderProducts']
                if (!CONFIRM_LIST || !CONFIRM_LIST.length) {
                    return this.$router.replace({ name: 'Home' })
                }
                this.form.activityId = this.activityId
                this.form.helper = this.shareId
                this.form.source = this.activeProduct
                if (this.selectedAddress && CONFIRM_LIST.some(item => item.productType === 'PHYSICAL_GOODS')) {
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
                    sku1: item.skuCode1 || '',
                    sku2: item.skuCode2 || ''
                }))
                this.CONFIRM_LIST = CONFIRM_LIST
                return CONFIRM_LIST
            } catch (e) {
                throw e
            }
        },

        // 在订单页面, 调整订单相关信息后, 设置订单优惠信息
        setDiscountModel () {
            const params = {}
            if (this.form.cartCouponModel && this.form.cartCouponModel.userCouponId) {
                params.couponModel = this.currentCoupon
            }
            if (this.form.scholarshipModel && this.form.scholarshipModel.scholarshipId) {
                params.scholarshipModel = this.currentRedEnvelope
            }
            if (this.exchangeCodeInfo && this.exchangeCodeInfo.id) {
                params.exchangeCodeModel = this.exchangeCodeInfo
            }
            if (Object.keys(params).length) {
                this.$store.commit('submitOrder/setOrderProducts', {
                    discountModel: params
                })
            }
        },

        /* 初始化优惠信息, 如果有信息,请求confirm接口; 没有的话, 不做处理 */
        async initDiscountModel () {
            try {
                const { discountModel } = this['submitOrder/orderProducts']
                if (!discountModel) return
                const { couponModel, scholarshipModel, exchangeCodeModel } = discountModel
                await this.$nextTick()
                if (couponModel) {
                    this.currentCoupon = couponModel
                    await this.couponChange(couponModel)
                }
                if (scholarshipModel) {
                    this.currentRedEnvelope = scholarshipModel
                    await this.scholarshipChange(scholarshipModel)
                }
                if (exchangeCodeModel) await this.exchangeCodeChange(exchangeCodeModel)
            } catch (e) {
                throw e
            }
        },

        /**
         * 初始化默认兑换码信息
         *  */
        async initRedeemCode () {
            try {
                const exchangeCodeInfo = this['submitOrder/exchangeCodeInfo']
                if (exchangeCodeInfo.id)exchangeCodeInfo.isDefault = true
                this.exchangeCodeInfo = exchangeCodeInfo
            } catch (e) {
                this.couponList = []
                throw e
            }
        },

        // 设置默认选中的学生， 若没有当前规格的商品，根据个数取默认的学员数据
        async setDefaultChecked () {
            try {
                if (!this.products.some(item => item.needStudents)) return
                const { result } = await getList()
                const list = result.records || []
                const defaultStudent = list.filter(item => item.defaultStatus === 1)
                for (const item of this.products) {
                    if (!item.needStudents) continue
                    const sku = item.sku1 + item.sku2
                    const CURRENT_CHECKED_STUDENT = this['submitOrder/checkedStudents'][sku] || []
                    if (!CURRENT_CHECKED_STUDENT.length) {
                        const student = defaultStudent.slice(0, item.count)
                        item.students = student
                        this.$store.commit('submitOrder/setCheckedStudent', { sku, student })
                    }
                }
            } catch (e) {
                throw e
            }
        },

        /**
         * 修改优惠券
         * 需要注意的是，每次修改优惠券的时候，奖学金会联动的做出改变
         * @param coupon {Object} 当前优惠券
         */
        async couponChange (coupon) {
            this.form.cartCouponModel = coupon.id ? { userCouponId: coupon.id } : null
            try {
                await this.$nextTick()
                // 选择优惠券时，若 当前除去奖学金之外的总价，大于零，才可使用奖学金 + 当前优惠券支持使用奖学金
                const currentTotalAmount = this.totalAmount + (this.currentRedEnvelope.amount || 0) - (coupon.amount || 0)
                if (!(coupon.scholarship && currentTotalAmount)) {
                    this.currentRedEnvelope = {}
                }
                this.form.scholarshipModel = this.currentRedEnvelope.id ? { scholarshipId: this.currentRedEnvelope.id } : null
                // 选择优惠券后，兑换码默认不使用
                if (coupon.id) this.exchangeCodeInfo = {}
                await this.getProductDetail()
            } catch (e) {
                throw e
            }
        },
        // 修改红包
        async scholarshipChange (scholarship) {
            this.form.scholarshipModel = scholarship.id ? { scholarshipId: scholarship.id } : null
            // 选择奖学金后，兑换码默认不使用
            if (scholarship.id) this.exchangeCodeInfo = {}
            try {
                await this.getProductDetail()
            } catch (e) {
                throw e
            }
        },
        async exchangeCodeChange (item) {
            this.exchangeCodeInfo = item
            // 使用兑换码后，不可使用优惠券和奖学金
            if (item.id) {
                this.currentRedEnvelope = {}
                this.currentCoupon = {}
                this.form.scholarshipModel = null
                this.form.cartCouponModel = null
            }
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
                skus: data.orderDetails,
                companyPhone: data.receiverMobile,
                mailingMethod: data.mailingMethod,
                companyAddr: data.userAddress
            } : null
        },
        // 若商品实付款金额,因奖学金/品类券为0,发票中不能给该商品开发票
        checkInvoiceSelected (form) {
            if (!form.invoiceInfoModel) return
            const skus = form.invoiceInfoModel.skus
            // 需要移除的商品index
            const indexs = []
            for (const [index, item] of skus.entries()) {
                for (const iItem of this.products) {
                    if (item.goodsId === iItem.goodsId && item.sku1 === iItem.sku1 && item.sku2 === iItem.sku2 && iItem.amount - iItem.postageAmount === 0) {
                        indexs.push(index)
                    }
                }
            }
            // 没有需要移除的商品
            if (!indexs.length) return
            for (const i of indexs.reverse()) {
                skus.splice(i, 1)
            }
            if (skus.length) {
                form.invoiceInfoModel.skus = skus
            } else {
                form.invoiceInfoModel = null
            }
        },

        /**
         * 修改学员事件
         * @param students {Array}
         * @param product {Object} 对应的商品
         */
        studentInited ({ students, product }) {
            for (const pro of this.form.skus) {
                if (pro.goodsId === product.goodsId) {
                    pro.students = students
                }
            }
        },
        // 增加备注
        setOrderPostscript (from, to) {
            for (const pro of from) {
                if (!pro.orderPostscript) continue
                const index = to.findIndex(item => pro.goodsId === item.goodsId && pro.sku1 === item.sku1 && pro.sku2 === item.sku2)
                if (index !== -1) {
                    to[index].orderPostscript = pro.orderPostscript
                }
            }
        },

        /**
         * 修改商品数量事件
         * @param count {Number} 数量
         * @param product {Object} 对应的商品
         */
        async countChange ({ count, product, next }) {
            const cache = this.CONFIRM_LIST.find(item => item.productId === product.goodsId)
            for (const pro of this.form.skus) {
                if (pro.goodsId === product.goodsId) {
                    pro.count = count
                    break
                }
            }
            try {
                await this.getProductDetail()
                // 修改成功后需要更新缓存中的数据
                cache.count = count
                this.$store.commit('submitOrder/setOrderProducts', {
                    products: this.CONFIRM_LIST
                })
                next()
            } catch (e) {
                next(e)
                throw e
            }
        },
        // 提交订单
        async submitOrder () {
            if (!this.checkData()) {
                return
            }
            const CUSTOM_FORM_CACHE = JSON.parse(localStorage.getItem('CUSTOM_FORM_CACHE')) || {}
            for (const pro of this.form.skus) {
                pro.productCustomInfo = CUSTOM_FORM_CACHE[pro.sku1 + pro.sku2] ? JSON.stringify(CUSTOM_FORM_CACHE[pro.sku1 + pro.sku2]) : ''
            }
            try {
                this.submiting = true
                this.setOrderPostscript(this.products, this.form.skus)
                const form = JSON.parse(JSON.stringify(this.form))
                this.checkInvoiceSelected(form)
                if (this.exchangeCodeInfo.id) {
                    form.source = 8
                    form.activityId = this.exchangeCodeInfo.id
                }
                const { result: orderBatchNumber } = await submitOrder(form)
                await this.requestPayData(orderBatchNumber)
                // 在订单提交的过程中若切换页面，手动关闭订单
                this.$once('hook:beforeRouteLeave', async () => {
                    if (this.submiting) await this.handlepayError(orderBatchNumber)
                })
            } catch (e) {
                throw e
            } finally {
                this.submiting = false
            }
        },
        async requestPayData (orderBatchNumber) {
            try {
                // 每500ms请求一次支付数据，如果请求次数超过20次，就终止请求
                // 下次请求的开始时间 =  500ms + 当前请求时间
                if (this.requestPayDataCount >= 20) {
                    this.requestPayDataCount = 0
                    this.submiting = false
                    throw new Error('支付失败')
                }
                await setTimeoutSync(500)
                // 如果没有拿到请求数据，再次尝试发起请求
                // 如果有，则发起支付
                const { result: payData } = await getOrderPayData(orderBatchNumber)
                if (!payData) {
                    this.requestPayDataCount++
                    await this.requestPayData(orderBatchNumber)
                } else {
                    await this.pay(payData, payData.orderIds, payData.orderIds.length)
                }
            } catch (e) {
                this.requestPayDataCount = 0
                await this.handlepayError(orderBatchNumber)
                await this.$router.replace({ name: 'Orders', params: { status: 'ALL_ORDER' } })
                throw e
            }
        },
        // 处理支付失败的场景
        async handlepayError (orderBatchNumber) {
            try {
                const FORMALS = ['PHYSICAL_GOODS', 'VIRTUAL_GOODS', 'FORMAL_CLASS', 'EXPERIENCE_CLASS']
                const orderType = this.products.some(item => FORMALS.includes(item.goodsType))
                // 只有普通 实体/虚拟/正式课/体验课 + 非活动状态 才可二次支付不必关闭订单，其他支付失败直接关闭订单
                if (orderType && this.activeProduct === this.skuSourceKeyMap.NORMAL) return
                await cancleOrderListByBatchNumber(orderBatchNumber)
            } catch (e) {
                throw e
            }
        },

        /**
         * 支付
         * @param CREDENTIAL {Object} 支付数据
         * @param orderIds {Array} 订单Id
         * @param orderCount {Number} 订单数量
         * @returns {Promise<*>}
         */
        async pay (CREDENTIAL, orderIds, orderCount) {
            const firstOrder = orderIds[0]
            // 订单是否位课程类型
            const FORMALS = ['FORMAL_CLASS', 'EXPERIENCE_CLASS', 'KNOWLEDGE_COURSE', 'SERIES_OF_COURSE']
            const orderType = this.products.some(item => FORMALS.includes(item.goodsType))
            try {
                if (CREDENTIAL.appId) {
                    await wechatPay(CREDENTIAL)
                    this.$router.replace({ name: 'PaySuccess', params: { orderId: firstOrder, orderCount }, query: { orderType } })
                } else if (this.totalAmount === 0) {
                    this.$router.replace({ name: 'PaySuccess', params: { orderId: firstOrder, orderCount }, query: { orderType } })
                } else {
                    throw new Error('支付失败')
                }
            } catch (e) {
                throw e
            }
        },
        // 校验数据
        checkData () {
            if (this.physicalProducts.length && !this.selectedAddress.mobile) {
                this.$warning('请选择收货地址')
                return false
            }
            if (!this.physicalProducts.length && !(this.form.userAddress && this.form.userAddress.mobile)) {
                this.$warning('请填写联系人信息')
                return false
            }
            if (!this.$refs.productVeiwer.checkStudents() || !this.$refs.productVeiwer.checkCustom()) {
                return false
            }
            return true
        }
    },
    beforeRouteLeave (to, from, next) {
        const customRouteName = ['ApplyInvoice', 'Address', 'AddAddress', 'StudentList']
        if (customRouteName.includes(to.name)) {
            this.setDiscountModel()
        } else {
            this.$store.commit('submitOrder/removeOrderProducts')
            this.$store.commit('submitOrder/removeCurExchangeCode')
            this.$store.commit('submitOrder/removeInvoiceInfo')
        }
        next()
    }
}
</script>

<style module lang="scss">
    @import "scss/submit-order";
</style>
