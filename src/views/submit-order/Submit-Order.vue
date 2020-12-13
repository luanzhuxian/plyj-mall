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
                :confirm-list="CONFIRM_LIST"
                :pre-activity="preActivity"
                :active-product="activeProduct"
                :is-cart="isCart"
                @exchangeCodeChange="exchangeCodeChange"
                @studentInited="studentInited"
                @countChange="countChange"
                :server-time="serverTime"
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
                    :right-text="freight ? '¥' + freight : '包邮'"
                    left-text-weight="bold"
                    :can-click="false"
                >
                    <div>
                        <pl-svg class="mr-10" name="icon-express" width="40" :vertical-align="-10" />
                        <span>普通快递</span>
                    </div>
                </pl-fields>
            </div>

            <!--知识课程暂时不支持使用优惠券-->
            <Coupon
                v-if="activeProduct === 1 && !hasKnowlegeCourse"
                :active-product="activeProduct"
                :pre-activity="preActivity"
                :coupon.sync="currentCoupon"
                :products="CONFIRM_LIST"
                :server-time="serverTime"
                @change="couponChange"
                :address-id="selectedAddress.sequenceNbr"
            />
            <!--知识课程暂时不支持使用奖学金-->
            <Scholarship
                v-if="activeProduct === 1 && !hasKnowlegeCourse"
                :active-product="activeProduct"
                :freight="freight"
                :products="CONFIRM_LIST"
                :current-red-envelope.sync="currentRedEnvelope"
                :server-time="serverTime"
                :current-coupon="currentCoupon"
                @change="scholarshipChange"
            />

            <!--除运费以外的实付款小于等于0, 不支持开发票-->
            <Invoice
                :disabled="totalAmount - freight <= 0"
                :active-product="activeProduct"
                :total-amount="totalAmount"
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
// import moment from 'moment'
// import { getExchangeCodeMap } from '../../apis/my-coupon'
import {
    confirmOrder,
    submitOrder,
    // getOrderPayData,
    cancleOrderListByBatchNumber
} from '../../apis/order-manager'
import { getList } from '../../apis/student'
import { mapGetters } from 'vuex'
import OrderItemSkeleton from '../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../components/skeleton/Address-Item.vue'
import { getServerTime } from '../../apis/base-api'
import ProductVeiwer from '../../components/submit-order/Product-Veiwer.vue'
import Coupon from '../../components/submit-order/Coupon.vue'
import Scholarship from '../../components/submit-order/Scholarship.vue'
import Invoice from '../../components/submit-order/Invoice.vue'
import ContactInfo from '../../components/submit-order/Contact-Info.vue'
import { requestPayData, pay } from '../../assets/js/wechat/submit-order'

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
            // 优惠券信息
            currentCoupon: {
                redPacket: null,
                coupon: null
            },
            // 当前默认选择的兑换码信息
            exchangeCodeInfo: null,
            // 实体商品
            physicalProducts: [],
            // 全部商品列表
            products: [],
            // 传入的商品列表（原始数据）
            CONFIRM_LIST: [],
            // 需要自定义表单的商品
            customList: [],
            // 服务器时间
            serverTime: 0,
            // 当前选中的红包
            currentRedEnvelope: null,
            form: {
                // 活动id,  source = 8 时是兑换码id
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
                // 红包
                welfareRedPackage: null,
                // 发票
                invoiceInfoModel: null
            }
        }
    },
    computed: {
        ...mapGetters(['selectedAddress', 'openId', 'mobile', 'addressList', 'realName', 'userName', 'shareId', 'orderTypeKeyMap', 'skuSourceKeyMap', 'submitOrder/orderProducts', 'submitOrder/checkedStudents']),
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
         * 7 公益
         * 8 兑换码
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
        // 知识课程包含的类型
        knowlegeCourseType () {
            const {
                KNOWLEDGE_COURSE,
                SERIES_OF_COURSE,
                GRAPHIC_DATA
            } = this.orderTypeKeyMap
            return [KNOWLEDGE_COURSE, SERIES_OF_COURSE, GRAPHIC_DATA]
        },
        // 商品中是否包含线上知识课程
        hasKnowlegeCourse () {
            return this.form.skus.some(item => this.knowlegeCourseType.includes(item.goodsType))
        }
    },
    watch: {
    },
    async mounted () {
        try {
            this.loading = true
            await this.init()
            await this.$nextTick()
            this.loading = false
        } catch (e) {
            throw e
        }
    },
    deactivated () {
    },
    methods: {
        // 初始化，执行顺序不能乱
        async init (noBack) {
            try {
                // 获取服务器时间
                const { result: serverTime } = await getServerTime()
                // 设置服务器时间
                this.serverTime = serverTime
                // 要购买的商品列表
                this.initProductInfo()
                // 设置默认学员
                await this.setDefaultChecked()
                // 商品价格及其它信息详情
                await this.getProductDetail(noBack)
            } catch (e) {
                throw e
            }
        },
        // 根据初始化的商品基本信息，获取商品详情和价格
        async getProductDetail (noBack = false) {
            try {
                const form = JSON.parse(JSON.stringify(this.form))
                const { result } = await confirmOrder(form)
                const {
                    amount,
                    freightAmount,
                    skus,
                    skusGrouping: {
                        PHYSICAL_GOODS = []
                    }
                } = result
                this.totalAmount = amount / 100
                this.freight = Number(freightAmount) / 100
                this.physicalProducts = PHYSICAL_GOODS
                this.setOrderPostscript(this.products, skus)
                // 将线上课归到课程中
                this.products = skus
                this.customList = skus.filter(item => item.skuCustoms.length)
            } catch (e) {
                if (!noBack && e.name === 'ResponseError') {
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 2000)
                }
                throw e
            }
        },
        // 初始化商品基本信息
        initProductInfo () {
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
         * @param coupon {Object | null} 当前优惠券
         * @param redPacket {Object | null} 当前红包
         */
        async couponChange ({ coupon, redPacket }) {
            console.warn('couponChange')
            this.form.cartCouponModel = coupon && coupon.id ? { userCouponId: coupon.id } : null
            this.form.welfareRedPackage = redPacket && redPacket.id ? { userCouponId: redPacket.id } : null
            // 选中时情况兑换码
            // if (coupon || redPacket) this.exchangeCodeInfo = null
            await this.$nextTick()
            await this.getProductDetail()
        },
        // 修改红包(奖学金)
        async scholarshipChange (scholarship) {
            console.warn('scholarshipChange')
            this.form.scholarshipModel = scholarship ? { scholarshipId: scholarship.id } : null
            await this.getProductDetail()
        },
        // 修改兑换码
        async exchangeCodeChange (item) {
            this.exchangeCodeInfo = item
            if (item) {
                this.form.source = 8
                this.form.activityId = item.id
            } else {
                this.form.activityId = this.activityId
                this.form.source = this.activeProduct
            }
            await this.getProductDetail()
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
            this.form.invoiceInfoModel = data ? { ...data } : null
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
                // 修改成功后需要更新缓存中的数据
                cache.count = count
                this.$store.commit('submitOrder/setOrderProducts', {
                    products: this.CONFIRM_LIST
                })
                await this.init(true)
                // 商品价格及其它信息详情
                await this.$nextTick()
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
                const { result: orderBatchNumber } = await submitOrder(form)
                const payData = await requestPayData(orderBatchNumber)
                await this.pay(payData, payData.orderIds, payData.orderIds.length, orderBatchNumber)
            } catch (e) {
                throw e
            } finally {
                this.submiting = false
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
         * @param orderBatchNumber {string} 支付批次号，支付失败时用来关闭此次订单
         * @returns {Promise<*>}
         */
        async pay (CREDENTIAL, orderIds, orderCount, orderBatchNumber) {
            const firstOrder = orderIds[0]
            // 订单是否位课程类型
            const FORMALS = ['FORMAL_CLASS', 'EXPERIENCE_CLASS', 'KNOWLEDGE_COURSE', 'SERIES_OF_COURSE']
            const orderType = this.products.some(item => FORMALS.includes(item.goodsType))
            try {
                if (CREDENTIAL.appId) {
                    await pay(CREDENTIAL)
                    this.submiting = false
                    this.$router.replace({ name: 'PaySuccess', params: { orderId: firstOrder, orderCount }, query: { orderType } })
                } else if (this.totalAmount === 0) {
                    this.submiting = false
                    this.$router.replace({ name: 'PaySuccess', params: { orderId: firstOrder, orderCount }, query: { orderType } })
                } else {
                    throw new Error('支付失败')
                }
            } catch (e) {
                await this.handlepayError(orderBatchNumber)
                throw e
            } finally {
                this.submiting = false
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
        if (!customRouteName.includes(to.name)) {
            this.$store.commit('submitOrder/removeOrderProducts')
            this.$store.commit('submitOrder/removeInvoiceInfo')
        }
        if (this.submiting) {
            return next(false)
        }
        next()
    }
}
</script>

<style module lang="scss">
    @import "submit-order";
</style>
