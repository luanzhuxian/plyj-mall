<template>
    <!-- 骨架屏 -->
    <OrderDetailSkeleton v-if="loading" />
    <div v-else :class="$style.orderDetail">
        <div :class="$style.top">
            <top-text
                :title="orderStatusMap[detail.status]"
                :tip="orderStatusTip"
            />
        </div>
        <!-- 核销码 -->
        <div
            :class="$style.qrcodeBox"
            v-if="redeemCodeModels.length > 0 && detail.status !== orderStatuskeyMap.WAIT_PAY && detail.status !== orderStatuskeyMap.CLOSED"
        >
            <img v-imgError :src="qrImg" alt="" v-imger:QR="qrImg" :style="{ opacity: isAllCodeUseless ? 0.4 : 1 }">
            <div :class="{[$style.codeListBox]: true, [$style.collapse]: collapseQrCode}">
                <h2 :class="$style.title">核销码</h2>
                <pl-svg
                    v-if="redeemCodeModels.length > 1"
                    :class="{ [$style.collapse]: collapseQrCode }"
                    name="icon-right"
                    fill="#999"
                    @click="() => { redeemCodeModels.length > 1 ? collapseQrCode = !collapseQrCode : '' }"
                />
                <div :class="$style.codeList">
                    <template v-for="(item, i) of redeemCodeModels">
                        <div v-show="collapseQrCode ? i === 0 : true"
                             :key="i">
                            <OrderCodeItem
                                :collapse-qr-code="collapseQrCode"
                                :detail="item"
                                :goods-model="goodsModel"
                                :status="item.status"
                                :redeem-code="item.code"
                                :name="item.userName"
                                :mobile="item.userMobile"
                                @drawPoster="drawPoster"
                            />
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!-- 物流信息 -->
        <div :class="$style.panel" v-if="hasExpressInfo">
            <express-item
                :order-id="orderId"
                :express-name="logisticsInfoModel.courierCompany"
                :express-number="logisticsInfoModel.courierNo"
                :express-status="logisticsInfoModel.logisticTrackModels.length ? logisticsInfoModel.logisticTrackModels[logisticsInfoModel.logisticTrackModels.length-1].content : ''"
                :img="goodsModel.img"
            />
        </div>

        <!-- 订单信息 -->
        <div :class="$style.panel">
            <div :class="$style.orderInfo">
                <order-item
                    size="small"
                    :img="goodsModel.img"
                    :name="goodsModel.name"
                    :price="goodsModel.sellingPrice"
                    :count="goodsModel.count"
                    :option="goodsModel.subSku ? `${goodsModel.sku},${goodsModel.subSku}` : goodsModel.sku"
                    :product-id="detail.goodId"
                    :order-type="detail.orderType"
                    :support-refund="detail.supportAfterSales"
                    :allow-invoice="detail.supportInvoice"
                    :active-product="detail.orderSource"
                    :pre-active="2"
                    :route-name="detail.orderType === 'KNOWLEDGE_COURSE' ? 'Curriculum' : 'Product'"
                    :activity-status="activityDataStatus"
                    :activity-id="activityDataId"
                />
                <div :class="$style.buttons">
                    <!--实际支付大于0 + 支持售后 支持 申请退款-->
                    <pl-button
                        v-if="detail.amount && !detail.supportAfterSales"
                        plain
                        round
                        @click="applyRefund"
                    >
                        {{ detail.refundId ? '再次申请' : '申请退款' }}
                    </pl-button>
                    <!--实际支付大于0 + 支持售后 支持 申请退款-->
                    <pl-button
                        v-if="detail.aftersaleStatus === aftersaleStatusKeyMap.PROCESSING"
                        plain
                        round
                        @click="$router.push({ name: 'RefundDetail', params: { id: detail.refundId } })"
                    >
                        退款中
                    </pl-button>
                    <!--售后完成 支持 退款完成显示-->
                    <pl-button
                        class="refund-finish"
                        v-if="detail.afterSalesStatus === aftersaleStatusKeyMap.PROCESSING_COMPLETED"
                        plain
                        round
                        :style="{ opacity: goodsModel.afterSalesStatusExtend === aftersaleStatusKeyMap.PROCESSING ? 0.3 : 1 }"
                        @click="goodsModel.afterSalesStatusExtend === aftersaleStatusKeyMap.PROCESSING ? '' : $router.push({ name: 'RefundDetail', params: { id: detail.refundId } })"
                    >
                        退款完成
                    </pl-button>
                    <!--待收货 支持 寄件运单号显示-->
                    <pl-button
                        :class="$style.large"
                        v-if="detail.orderType === orderStatuskeyMap.WAIT_RECEIVE"
                        type="warning"
                        plain
                        round
                        @click="$router.push({ name: 'RefundDetail', params: { id: detail.refundId } })"
                    >
                        寄件运单号
                    </pl-button>
                    <!--订单完成并且未评论 + 实体订单无售后时 + 虚拟订单核销码已使用 支持 寄件运单号显示-->
                    <pl-button
                        v-if="isCommentBtnShow"
                        type="warning"
                        plain
                        round
                        @click="$router.push({ name: 'CommentOrder', params: { orderId: orderId, productId: goodsModel.id }, query: { productImg: goodsModel.img, skuCode1: goodsModel.sku, skuCode2: goodsModel.subSku } })"
                    >
                        晒单评价
                    </pl-button>
                </div>
                <div
                    :class="$style.explain"
                    v-if="detail.orderType !== orderTypeKeyMap.PHYSICAL_GOODS && goodsModel.goodsDescription"
                >
                    <ModuleTitle
                        title="使用说明"
                        size="mini"
                    />
                    <div
                        :class="$style.explainBox"
                        v-text="goodsModel.goodsDescription"
                    />
                </div>
            </div>

            <div :class="$style.productPrice">
                <!-- 预购商品价格 -->
                <template v-if="detail.orderSource === skuSourceKeyMap.BOOKING">
                    <p>
                        <span>待付尾款</span>
                        <span
                            class="rmb"
                            v-text="detail.orderAmountTailMoney || 0"
                        />
                    </p>
                    <p>
                        <span>定金(不退<i v-if="detail.orderIntentionAmountDouble > 1">，翻{{ detail.orderIntentionAmountDouble }}倍</i>)</span>
                        <span
                            class="rmb"
                            v-text="detail.orderIntentionAmount || 0"
                        />
                    </p>
                </template>
                <!-- 其他商品价格 -->
                <p v-else>
                    <span v-text="activeProductStatus[detail.orderSource] || '商品金额'" />
                    <span
                        class="rmb"
                        v-text="detail.amount || 0"
                    />
                </p>
                <!--优惠券-->
                <p v-if="detail.couponeAmount">
                    <span>优惠券</span>
                    <span class="rmb" v-text="'-' + detail.couponeAmount" />
                    <span v-text="'-¥' + detail.couponeAmount" />
                </p>
                <!--奖学金-->
                <p v-if="detail.scholarship">
                    <span>奖学金（红包）</span>
                    <span v-text="'-¥' + detail.scholarship" />
                </p>
                <!--春耘减免-->
                <p v-if="detail.orderSource === skuSourceKeyMap.SPRINGPLOUGHING">
                    <span>春耘减免</span>
                    <span v-text="'-¥' + (detail.combinationSpecialPrice || 0)" />
                </p>
                <!--组合折扣-->
                <p v-if="detail.orderSource === skuSourceKeyMap.COURSEPACKAGE">
                    <span>组合折扣</span>
                    <span v-text="'-¥' + (detail.combinationSpecialPrice || 0)" />
                </p>
                <!--运费-->
                <p v-if="detail.freight">
                    <span>运费</span>
                    <span class="rmb" v-text="detail.freight" />
                </p>
            </div>

            <div :class="$style.amount">
                <span :class="$style.totalCount">{{ `共${detail.count}件` }}</span>
                <span class="fz-30">
                    总价：
                </span>
                <!-- 预购商品时，总价 = 定金 + 尾款 -->
                <span
                    :class="$style.totalMoney + ' fz-30 rmb'"
                    v-text="detail.amount || 0"
                />
            </div>
        </div>

        <!-- 收货人信息 -->
        <div :class="$style.panel">
            <address-item
                v-if="receiverModel.address"
                :address="{
                    realName: receiverModel.name,
                    mobile: receiverModel.mobile,
                    addressPrefix: '',
                    agencyAddress: receiverModel.address
                }"
                :hide-address="detail.orderType === 'VIRTUAL'"
                not-link
            />
        </div>

        <!-- 用户信息 -->
        <div :class="[$style.panel, $style.customBlockField]" v-if="userInfo.length">
            <pl-fields
                size="middle"
                text="用户信息"
                icon="icon-user-7bd73"
                title-color="#F2B036"
                :icon-width="40"
                :icon-gap="12"
                left-text-weight="bold"
            >
                <div :class="$style.detail">
                    <div :class="$style.item" v-for="(item, i) of userInfo" :key="i">
                        <span>{{ item.fieldName }}：</span>
                        <span v-if="item.fieldValue">{{ item.fieldValue }}</span>
                        <span v-else style="color: #999;">未填写</span>
                    </div>
                </div>
            </pl-fields>
        </div>

        <!-- 学员信息 -->
        <template v-if="studentInfo.length">
            <div :class="[$style.panel, $style.customBlockField]" v-for="(studentItem, i) of studentInfo" :key="i">
                <pl-fields
                    size="middle"
                    :text="`学员信息${i + 1}`"
                    :right-text="i < studentItem.code ? `核销码：${localSeparator(studentItem.code,' ', 4)}`: ''"
                    icon="icon-name-card"
                    title-color="#F2B036"
                    :icon-width="40"
                    :icon-gap="12"
                    left-text-weight="bold"
                >
                    <div :class="$style.detail">
                        <div :class="$style.item" v-for="(item, j) of studentItem" :key="j">
                            <span>{{ item.fieldName }}：</span>
                            <span v-if="item.fieldValue">{{ item.fieldValue }}</span>
                            <span v-else style="color: #999;">未填写</span>
                        </div>
                    </div>
                </pl-fields>
            </div>
        </template>

        <!-- 联系人信息 -->
        <div :class="[$style.panel, $style.contact]" v-if="!receiverModel.address">
            <pl-fields
                size="middle"
                text="联系人信息"
                icon="icon-contact"
                :icon-width="40"
                :icon-gap="12"
                left-text-weight="bold"
            >
                <div :class="$style.contactDetail">
                    <span class="fz-28" v-text="receiverModel.name" />
                    <span class="fz-28" v-text="receiverModel.mobile" />
                </div>
            </pl-fields>
        </div>

        <!-- 交易信息 -->
        <div :class="[$style.panel, $style.otherInfo]">
            <div :class="$style.infoTop">
                <pl-list
                    title="下单时间："
                    :content="detail.createTime"
                />
                <pl-list
                    title="订单编号："
                    :content="orderId"
                />
                <pl-list
                    v-if="detail.status !== orderStatuskeyMap.WAIT_PAY && !isClosedByCancle"
                    title="支付方式："
                    :content="orderLastPayInfo.paymentMethod === 'WX'? '微信支付' : ''"
                />
                <!--orderLastPayInfo最终支付信息-->
                <pl-list
                    v-if="detail.status !== orderStatuskeyMap.WAIT_PAY && !isClosedByCancle"
                    title="支付时间："
                    :content="orderLastPayInfo.callbackTime"
                />
                <pl-list
                    v-if="detail.status !== orderStatuskeyMap.WAIT_PAY && !isClosedByCancle && hasExpressInfo"
                    title="配送方式："
                    :content="detail.courierCompany"
                />
                <pl-list
                    v-if="detail.status !== orderStatuskeyMap.WAIT_PAY && !isClosedByCancle && hasExpressInfo"
                    title="发货时间："
                    :content="detail.shipTime"
                />
            </div>
            <div :class="$style.infoBottom" v-if="detail.orderPostscript">
                <pl-list
                    title="订单备注："
                    :content="detail.orderPostscript"
                />
            </div>
        </div>

        <!-- 发票信息 -->
        <div v-if="detail.supportInvoice" :class="[$style.panel, $style.invoice]">
            <collapse>
                <template v-if="invoiceModelList && invoiceModelList.length">
                    <collapse-item>
                        <template slot="title">
                            <div>
                                <span :class="$style.invoiceTitle">发票信息：{{ invoiceModelList.length }}个</span>
                            </div>
                        </template>
                        <div :class="$style.item" v-for="(item, i) of invoiceModelList" :key="i">
                            <div>
                                <span :class="$style.type" v-text="invoiceMap[item.invoiceType].main" />
                                <span :class="$style.name" v-text="item.invoiceTitle" />
                            </div>
                            <div>
                                <span v-text="invoiceMap[item.invoiceType].sub" />
                                <span v-text="item[invoiceMap[item.invoiceType].fields]" />
                            </div>
                        </div>
                    </collapse-item>
                </template>
                <template v-else>
                    <collapse-item disabled>
                        <template slot="title">
                            <div>
                                <span :class="$style.invoiceTitle">发票信息：</span>
                                <span>未开票</span>
                            </div>
                        </template>
                    </collapse-item>
                </template>
            </collapse>
        </div>

        <!-- footer -->
        <div
            ref="footer"
            class="footer"
            :class="$style.footer"
        >
            <!-- 待付款/待付尾款 支持 取消订单-->
            <pl-button
                v-if="detail.status === orderStatuskeyMap.WAIT_PAY || detail.status === orderStatuskeyMap.WAIT_PAY_TAIL_MONEY"
                round
                plain
                @click="isPickerShow = true"
            >
                取消订单
            </pl-button>
            <!--售后非处理中 支持 删除订单-->
            <pl-button
                v-if="detail.aftersaleStatus !== aftersaleStatusKeyMap.PROCESSING"
                plain
                round
                @click="deleteOrder"
            >
                删除订单
            </pl-button>
            <pl-button
                plain
                round
                @click="isPopupShow=true"
            >
                联系我们
            </pl-button>
            <!-- 实体订单 + 有物流信息 支持 查看物流-->
            <pl-button
                v-if="hasExpressInfo"
                plain
                round
                @click="$router.push({ name: 'Freight', params: { orderId }, query: { img: goodsModel.img } })"
            >
                查看物流
            </pl-button>
            <!-- 支持申请发票 + 无发票id 支持 申请发票-->
            <pl-button
                v-if="detail.supportInvoice && !detail.invoiceId"
                round
                plain
                @click="applyInvoice"
            >
                申请发票
            </pl-button>
            <!--实体订单 + 待收货 支持 确认收货-->
            <pl-button
                v-if="detail.orderType === orderTypeKeyMap.PHYSICAL_GOODS && detail.status === orderStatuskeyMap.WAIT_RECEIVE"
                round
                type="warning"
                @click="confirmReceipt"
            >
                确认收货
            </pl-button>
            <!--待付款 支持 去付款-->
            <pl-button
                v-if="detail.status === orderStatuskeyMap.WAIT_PAY"
                type="warning"
                round
                :loading="payloading"
                @click="pay"
            >
                去付款
            </pl-button>
            <!--知识课程 + 订单完成 支持 去学习-->
            <pl-button
                v-if="detail.orderType === orderTypeKeyMap.KNOWLEDGE_COURSE && detail.status === orderStatuskeyMap.FINISHED"
                type="warning"
                round
                @click="$router.push({ name: 'Courses', params: { courseType: '1' } })"
            >
                去学习
            </pl-button>
            <!--知识课程 + 订单完成 支持 去学习-->
            <pl-button
                v-if="detail.status === orderStatuskeyMap.WAIT_PAY_TAIL_MONEY"
                type="warning"
                round
                :loading="payloading"
                :disabled="payloading || finalPaymentIsEnded || !finalPaymentIsStarted"
                @click="pay"
            >
                {{ finalPaymentIsEnded ? '已过期' : finalPaymentIsStarted ? '去付尾款' : '未开始付尾款' }}
            </pl-button>
        </div>

        <!-- picker -->
        <pl-picker
            :show.sync="isPickerShow"
            :slots="pickerColumns"
            @confirm="(selected) => { cancelOrder(selected[0]) }"
        />

        <!-- 联系我们底部弹窗 -->
        <pl-popup :show.sync="isPopupShow">
            <ContantPop
                ref="contact"
                :show.sync="isPopupShow"
                @callUs="callUs"
            />
        </pl-popup>

        <!-- 分享核销码弹窗 -->
        <SharePoster
            :show.sync="isPosterShow"
            :poster="poster"
            @close="isPosterShow = false"
        />

        <!--拨号-->
        <Contact :show.sync="showContact" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import TopText from '../../../components/common/Top-Text.vue'
import Contact from '../../../components/common/Contact.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import ModuleTitle from '../../../components/common/Module-Title.vue'
import ExpressItem from '../../../components/item/Express-Item.vue'
import AddressItem from '../../../components/item/Address-Item.vue'
import Collapse from '../../../components/penglai-ui/collapse/Collapse.vue'
import CollapseItem from '../../../components/penglai-ui/collapse/Collapse-Item.vue'
import OrderDetailSkeleton from './components/Order-detail-Skeleton'
import OrderCodeItem from './components/Order-Code-Item'
import SharePoster from '../../../components/common/Share-Poster'
import ContantPop from './components/Contant-Pop'
import {
    getOrderDetail,
    getAwaitPayInfo,
    getAwaitTailPayInfo,
    confirmReceipt,
    cancelOrder,
    deleteOrder,
    getVerificationStatus,
    setVerificationStatus
} from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
import { generateQrcode } from '../../../assets/js/util'
import Countdown from '../../../assets/js/Countdown'
import filter from '../../../filter/index'

const updateLocalStorage = (key, value) => {
    const arr = JSON.parse(localStorage.getItem(key) || '[]')
    arr.push(value)
    localStorage.setItem(key, JSON.stringify(arr))
}

const suggestionMap = {
    WAIT_PAY: '',
    WAIT_SHIP: '请耐心等待商家发货…',
    WAIT_RECEIVE: '',
    FINISHED: '本次交易已完成，期待下次光临',
    CLOSED: '订单取消',
    WAIT_PAY_REPAYMENT: ''
}
const invoiceMap = {
    1: { main: '个人', sub: '手机号：', fields: 'receiverMobile' },
    2: { main: '单位', sub: '纳税人识别号：', fields: 'tin' }
}

export default {
    name: 'OrderDetail',
    components: {
        TopText,
        ModuleTitle,
        OrderItem,
        ExpressItem,
        AddressItem,
        CollapseItem,
        OrderCodeItem,
        OrderDetailSkeleton,
        Collapse,
        Contact,
        SharePoster,
        ContantPop
    },
    props: {
        orderId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            localSeparator: filter.separator,
            loading: false,
            // 显示拨号
            showContact: false,
            // 当前是否正在支付
            payloading: false,
            // 显示联系我们
            isPopupShow: false,
            // 显示取消退款原因选项
            isPickerShow: false,
            // 订单详情
            detail: {},
            // 商品详情
            goodsModel: {},
            // 订单最后一次交易记录
            orderLastPayInfo: {},
            // 物流详情
            logisticsInfoModel: {},
            // 发票信息
            invoiceModelList: [],
            // 联系人信息
            receiverModel: {},
            // 核销码
            redeemCodeModels: [],
            // 实体订单-用户信息
            userInfo: [],
            // 虚拟订单-学员信息
            studentInfo: [],
            activityDataStatus: 1,
            activityDataId: '',
            // 预购商品是否已到付尾款时间
            finalPaymentIsStarted: false,
            // 预购商品付尾款时间已过
            finalPaymentIsEnded: false,
            timerId: 0,
            timerId2: 0,
            pickerColumns: [
                {
                    flex: 1,
                    values: ['不想买了', '信息填写错误，重新拍', '线下自提', '其他原因'],
                    textAlign: 'center'
                }
            ],
            orderStatusTip: '',
            invoiceMap,
            // 核销码
            collapseQrCode: true,
            qrImg: '',
            // 海报
            isPosterShow: false,
            poster: '',
            activeProductStatus: { 2: '团购金额', 3: '限时秒杀', 4: '定金' }
        }
    },
    computed: {
        ...mapGetters(['address', 'servicePhoneModels', 'skuSourceKeyMap', 'orderStatusMap', 'orderStatuskeyMap', 'orderTypeKeyMap', 'aftersaleStatusKeyMap']),
        // 订单是否因取消而关闭
        isClosedByCancle () {
            return this.detail.status === this.orderStatuskeyMap.CLOSED && !(this.orderLastPayInfo.callbackTime)
        },
        // 有物流信息
        hasExpressInfo () {
            // 实体订单 + 有物流信息
            return this.detail.orderType === this.orderTypeKeyMap.PHYSICAL_GOODS && this.logisticsInfoModel && this.logisticsInfoModel.courierNo
        },
        // 核销码全部过期或核销，status: 0 待使用 1 已使用 2 退款中 3已退款 4已过期
        isAllCodeUseless () {
            return this.redeemCodeModels.every(item => [1, 3, 4].includes(item.status))
        },
        // 当前可用的核销码数量
        usefulCodeNumber () {
            return this.redeemCodeModels.filter(item => item.status === 0).length
        },
        // 是否显示评价按钮
        isCommentBtnShow () {
            return this.detail.status === this.orderStatuskeyMap.FINISHED && this.goodsModel.assessmentStatus === 0 &&
          (((this.detail.orderType === this.orderTypeKeyMap.PHYSICAL_GOODS) && (this.detail.afterSalesStatus === this.aftersaleStatusKeyMap.NO_AFTER_SALES)) ||
            ([this.orderTypeKeyMap.VIRTUAL_GOODS, this.orderTypeKeyMap.FORMAL_CLASS, this.orderTypeKeyMap.EXPERIENCE_CLASS].includes(this.detail.orderType) && this.redeemCodeModels.some(item => item.status === 1)))
        }
    },
    async activated () {
        try {
            this.loading = true
            await this.getDetail()
            this.loading = false
        } catch (e) {
            throw e
        }
    },
    async deactivated () {
        this.poster = ''
        this.orderStatusTip = ''
        this.collapseQrCode = true
        this.isPopupShow = false
        this.isPickerShow = false
        this.isPosterShow = false
        this.logisticsInfoModel = null
        clearInterval(this.timerId)
        clearInterval(this.timerId2)
        if (this.countdownInstance) {
            this.countdownInstance.stop()
        }
    },
    beforeDestroy () {
        if (this.countdownInstance) {
            this.countdownInstance.stop()
        }
    },
    methods: {
        async getDetail () {
            try {
                const { result } = await getOrderDetail(this.orderId)
                const { goodsModel, orderPayTransInfos, redeemCodeModels } = result
                this.detail = result
                // 商品详情
                this.goodsModel = goodsModel
                // 支付信息
                this.orderLastPayInfo = orderPayTransInfos[orderPayTransInfos.length - 1] || {}
                // 联系人信息
                this.receiverModel = {
                    name: result.consigneeName,
                    mobile: result.consigneeMobile,
                    address: result.address
                }
                // 物流信息
                this.logisticsInfoModel = {}
                // 发票信息
                this.invoiceModelList = []
                // 核销码信息
                this.redeemCodeModels = redeemCodeModels || []
                this.setTime()

                // 虚拟商品 正式课 体验课 生成核销码
                if ([this.orderTypeKeyMap.VIRTUAL_GOODS, this.orderTypeKeyMap.FORMAL_CLASS, this.orderTypeKeyMap.EXPERIENCE_CLASS].includes(result.orderType) && this.redeemCodeModels.length) {
                    if ([this.orderStatuskeyMap.WAIT_SHIP, this.orderStatuskeyMap.WAIT_RECEIVE, this.orderStatuskeyMap.FINISHED].includes(result.status)) {
                        this.generateQrcode()
                    }
                    if (result.status !== this.orderStatuskeyMap.CLOSED) {
                        await setVerificationStatus(this.orderId)
                        this.updateQrcode()
                    }
                }
                // 设置订单文案
                {
                    let tip = ''
                    const { validityPeriodStart, validityPeriodEnd, validity } = goodsModel
                    tip = suggestionMap[result.status]
                    tip = this.detail.aftersaleStatus === this.aftersaleStatusKeyMap.PROCESSING_COMPLETED ? '退款完成' : '订单取消'
                    if (result.status === this.orderStatuskeyMap.WAIT_RECEIVE) {
                        // 知识课程/系列课程 观看有效期
                        if ([this.orderTypeKeyMap.KNOWLEDGE_COURSE, this.orderTypeKeyMap.SERIES_OF_COURSE].includes(result.orderType)) {
                            tip = validity ? `购买后${ validity }天内学完` : '购买后不限观看次数'
                        }
                        // 虚拟商品/正式课/体验课 使用有效期
                        if ([this.orderTypeKeyMap.VIRTUAL_GOODS, this.orderTypeKeyMap.FORMAL_CLASS, this.orderTypeKeyMap.EXPERIENCE_CLASS].includes(result.orderType)) {
                            if (validityPeriodStart) {
                                const start = moment(validityPeriodStart).format('YYYY-MM-DD')
                                const end = moment(validityPeriodEnd).format('YYYY-MM-DD')
                                tip = (start === end) ? `有效期 ${ start }` : `有效期 ${ start } 至 ${ end }`
                            } else {
                                tip = '长期有效'
                            }
                        }
                    }
                    this.orderStatusTip = tip
                }
                // 自定义表单信息/学员信息
                {
                    const hasCustomBlock = goodsModel.needStudentInfo === 2 ? [{}] : []
                    const newUserInfo = []
                    const obj = {}
                    let studentInfo = []
                    for (const productItem of hasCustomBlock) {
                        if (this.detail.orderType === 'PHYSICAL') {
                            for (const fields of productItem.customForm) {
                                const userInfo = [...fields]
                                // 进行字段去重，去重应注意，如果某个字段已有值了，就不要覆盖了
                                for (const field of userInfo) {
                                    obj[field.fieldName] = obj[field.fieldName] ? obj[field.fieldName] : field.fieldValue
                                }
                            }
                        } else {
                            studentInfo = [...studentInfo, ...productItem.customForm]
                        }
                    }
                    // 去重完成，将对象转为想要的数组
                    for (const key of Object.keys(obj)) {
                        newUserInfo.push({
                            fieldName: key,
                            fieldValue: obj[key]
                        })
                    }
                    // 去掉字段重复的项目
                    this.userInfo = newUserInfo
                    this.studentInfo = studentInfo
                }
            } catch (e) {
                throw e
            }
        },
        // 生成核销码二维码
        generateQrcode () {
            generateQrcode({ size: 300, text: this.orderId, padding: 34 })
                .then(async base64 => {
                    this.qrImg = base64
                })
                .catch(() => {
                    this.$error('生成二维码失败')
                })
        },
        // 设置时间
        setTime () {
            if (![this.orderStatuskeyMap.WAIT_PAY, this.orderStatuskeyMap.WAIT_PAY_TAIL_MONEY].includes(this.detail.status)) return
            // 服务器时间
            const now = Number(this.detail.currentServerTime)
            const useStartTime = moment((this.detail.startExpire)).valueOf()
            const useEndTime = moment((this.detail.endExpire)).valueOf()
            // 是否开始
            this.finalPaymentIsStarted = now >= useStartTime
            // 是否过期
            this.finalPaymentIsEnded = now >= useEndTime
            if (!this.finalPaymentIsStarted) {
                // 可以开始支付了，倒计时支付
                this.countDown(useStartTime - now)
            } else if (!this.finalPaymentIsEnded) {
                // 可以开始支付了，倒计时支付
                this.countDown(useEndTime - now)
            }
        },
        // 设置倒计时
        countDown (remanent) {
            if (this.countdownInstance) {
                this.countdownInstance.stop()
            }
            const countdownInstance = new Countdown(remanent, data => {
                if (!data) {
                    if ([this.orderStatuskeyMap.WAIT_PAY, this.orderStatuskeyMap.WAIT_RECEIVE, this.orderStatuskeyMap.WAIT_PAY_TAIL_MONEY].includes(this.detail.status)) {
                        this.orderStatusTip = ''
                    }
                    this.getDetail()
                    return
                }
                const d = String(data.days)
                const h = String(data.hours)
                const m = String(data.minutes)
                const s = String(data.seconds)
                if (this.detail.status === this.orderStatuskeyMap.WAIT_PAY) {
                    this.orderStatusTip = `还剩${ h.padStart(2, '0') }小时${ m.padStart(2, '0') }分${ s.padStart(2, '0') }秒 订单自动关闭`
                    return
                }
                if (this.detail.status === this.orderStatuskeyMap.WAIT_PAY_TAIL_MONEY) {
                    const tip = this.finalPaymentIsStarted ? '剩余尾款支付时间' : '距离开始支付时间'
                    this.orderStatusTip = `${ tip }：${ d.padStart(2, '0') }天${ h.padStart(2, '0') }小时${ m.padStart(2, '0') }分${ s.padStart(2, '0') }秒`
                    return
                }
                if (this.detail.status === this.orderStatuskeyMap.WAIT_RECEIVE) {
                    this.orderStatusTip = `还剩${ d }天${ h.padStart(2, '0') }时${ m.padStart(2, '0') }分${ s.padStart(2, '0') }秒后自动收货`
                }
            })
            countdownInstance.start()
            this.countdownInstance = countdownInstance
        },
        // 定时器，实时刷新核销状态，如果有核销的话
        updateQrcode () {
            clearInterval(this.timerId2)
            if (this.redeemCodeModels.some(item => item.status === 0)) {
                this.timerId2 = setInterval(async () => {
                    try {
                        const { result } = await getVerificationStatus(this.orderId)
                        if (result) {
                            this.getDetail()
                        }
                    } catch (e) {
                        clearInterval(this.timerId2)
                    }
                }, 3000)
            }
        },
        drawPoster (url) {
            this.poster = url
            this.isPosterShow = true
        },
        callUs () {
            this.showContact = true
            this.isPopupShow = false
        },
        // 跳转申请退款页面
        applyRefund () {
            const { goodsModel, orderId, detail } = this
            goodsModel.goodId = detail.goodId
            goodsModel.orderStatus = detail.status
            goodsModel.orderType = detail.orderType
            goodsModel.orderId = orderId
            this.$store.commit('setRefundGoods', goodsModel)
            this.$router.push({
                name: 'Refund',
                params: {
                    orderId
                }
            })
        },

        /**
         * 支付
         * @param type {number} 1: 普通支付 2: 付尾款
         * @return {Promise<void>}
         */
        async pay () {
            try {
                let result = null
                const orderStatus = this.detail.status
                this.payloading = true
                if (orderStatus === this.orderStatuskeyMap.WAIT_PAY) {
                    const { result: data } = await getAwaitPayInfo(this.orderId)
                    result = data
                }
                if (orderStatus === this.orderStatuskeyMap.WAIT_PAY_TAIL_MONEY) {
                    const { result: data } = await getAwaitTailPayInfo(this.orderId)
                    result = data
                }

                // 调用微信支付api
                await wechatPay(result)
                updateLocalStorage('UPDATE_ORDER_LIST', { id: this.orderId, action: 'pay' })
                this.$router.push({ name: 'PaySuccess', params: { orderId: this.orderId }, query: { orderType: this.detail.orderType } })
            } catch (e) {
                throw e
            } finally {
                this.payloading = false
            }
        },
        // 确认收货
        async confirmReceipt () {
            const { orderId } = this
            try {
                await this.$confirm('您确定收货吗？')
                await confirmReceipt(orderId)
                this.$success('确认收货成功')
                updateLocalStorage('UPDATE_ORDER_LIST', { id: orderId, action: 'receive' })
                setTimeout(() => {
                    this.$router.push({ name: 'OrderComplete', params: { orderId } })
                }, 2000)
            } catch (e) {
                throw e
            }
        },
        // 取消订单
        async cancelOrder (reason) {
            try {
                // 5春耘订单 6组合课订单
                const isCombinedOrder = [5, 6].includes(this.detail.orderSource)
                await this.$confirm(isCombinedOrder ? `是否取消该订单，取消后组合订单将同步取消？` : '订单一旦取消，将无法恢复 确认要取消订单？')
                await cancelOrder(this.orderId, reason)
                this.$success('交易关闭')
                this.getDetail()
                updateLocalStorage('UPDATE_ORDER_LIST', { id: this.orderId, action: 'cancel' })
            } catch (e) {
                throw e
            }
        },
        // 删除订单
        async deleteOrder () {
            const { orderId } = this
            try {
                await this.$confirm('是否删除当前订单？ 删除后不可找回')
                await deleteOrder(orderId)
                this.$success('删除成功')
                updateLocalStorage('UPDATE_ORDER_LIST', { id: orderId, action: 'delete' })
                setTimeout(() => {
                    this.$router.go(-1)
                }, 2000)
            } catch (e) {
                throw e
            }
        },
        // 申请发票
        applyInvoice () {
            sessionStorage.setItem('APPLY_INVOICE', JSON.stringify([this.goodsModel.productDetailModels]))
            sessionStorage.setItem('APPLY_INVOICE_FROM', JSON.stringify({
                name: this.$route.name,
                params: this.$route.params,
                query: this.$route.query
            }))
            const { mobile, name } = this.receiverModel
            this.$router.push({
                name: 'ApplyInvoice',
                query: {
                    orderId: this.orderId,
                    orderType: this.detail.orderType,
                    receiveMobile: mobile,
                    receiveName: name
                }
            })
        }
    }
}
</script>

<style module lang="scss">
  .order-detail {
    padding: 28px 24px 140px;
  }

  .top {
    position: relative;
    margin-bottom: 28px;
    padding: 0 16px;
  }

  .panel {
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: $--radius1;
    overflow: hidden;
  }

    .qrcode-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    padding: 48px 0 32px 0;
    background-color: #fff;
    border-radius: 20px;
    > img {
      width: 298px;
      margin-bottom: 32px;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    .title {
      margin-right: 32px;
      margin-top: 5px;
      font-size: 24px;
      color: #999;
    }
    .code-list-box {
      position: relative;
      display: flex;
      padding: 12px 20px;
      padding-right: 60px;
      background-color: #f7f7f7;
      overflow: hidden;
      &.collapse {
        height: 38px;
      }
      > svg {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 22px;
        height: 22px;
        transform: rotate(-90deg);
        transition: transform .2s linear;
        &.collapse {
          transform: rotate(90deg);
        }
      }
    }
    .code-list {
      flex: 1;
      margin-top: -2px;
    }
  }

  /** 订单信息 start **/
  .order-info {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 28px 24px 24px;
    min-height: 140px;
  }
  .explain {
    width: 100%;
    position: relative;
    margin-top: 24px;
    margin-left: 24px;
    padding-top: 16px;
    border-top: 1px solid #e7e7e7;
  }
  .explain-box {
    margin-top: 14px;
    padding: 24px 30px;
    background-color: #f3f3f3;
    border-radius: $--radius2;
    font-size: 26px;
    color: #666666;
  }
  .product-price {
    margin-left: 24px;
    position: relative;
    padding: 12px 24px 12px 0;
    line-height: 50px;
    font-size: 26px;
    color: #666666;
    border-top: 1px solid #e7e7e7;
    p {
      display: flex;
      justify-content: space-between;
    }
  }
  .amount {
    position: relative;
    display: flex;
    margin-left: 24px;
    padding: 0 24px 24px 0;
    justify-content: flex-end;
    align-items: center;
    .totalCount {
      font-size: 24px;
      color: #999999;
      margin-right: 12px;
    }
    .totalMoney {
      color: $--primary-color;
    }
  }
  .buttons {
    position: relative;
    text-align: right;
    > button {
      box-sizing: border-box;
      margin-top: 0;
      margin-left: 24px;
      width: 136px;
      padding: 0;
    }
    .large {
      width: auto;
      padding: 0 25px;
    }
  }
  /** 订单信息 end **/

  /** 联系人 **/
  .contact {
    padding-left: 24px;
    .contact-detail {
      padding: 24px 0;
      > span:nth-of-type(1) {
        margin-right: 24px;
        font-weight: 500;
      }
    }
  }
  /** 用户信息 **/
  .custom-block-field {
    padding-left: 24px;
    .detail {
      padding: 14px 24px 24px 0;
      .item {
        display: flex;
        justify-content: space-between;
        line-height:44px;
        font-size:24px;
        color:#222;
        > span:nth-of-type(1) {
          color:#999;
        }
      }
    }
  }

  /** 交易信息 **/
  .other-info {
    position: relative;
    line-height: 34px;
    font-size: 24px;
    .info-top {
      padding: 24px;
      border-bottom: 1px solid #F0F0F0;
      > div {
        margin-bottom: 20px;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
      }
    }
    .info-bottom {
      padding: 24px;
      &:nth-last-of-type(1) {
        margin-bottom: 0;
      }
    }
  }
  /** 发票信息 **/
  .invoice {
    padding: 24px;
    .invoice-title {
      color: #666666;
    }
    .item {
      font-size: 24px;
      font-family: Helvetica;
      font-weight: 400;
      line-height: 28px;
      color: #333333;
      border-bottom: 1px solid #F0F0F0;
      padding: 24px 0 14px;
      &:nth-of-type(1) {
        padding-top: 0;
      }
      &:nth-last-of-type(1) {
        border-bottom: none;
        padding-bottom: 0;
      }
      > div {
        padding-bottom: 8px;
      }
    }
    .type {
      display: inline-block;
      width: 74px;
      height: 32px;
      line-height: 32px;
      background: #FDEFD6;
      border-radius: 4px;
      font-size: 24px;
      color: #FE7700;
      text-align: center;
      margin-right: 12px;
    }
    .name {
      font-size: 28px;
      font-family: PingFangSC-Medium;
      font-weight: bold;
      color: #2E2E2E;
      line-height: 40px;
    }
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #FFF;
    display: flex;
    justify-content: flex-end;
    padding: 18px 24px;

    > button {
      margin-left: 20px;
      box-sizing: border-box;
      width: 162px;
      padding: 0;
      &:nth-of-type(1) {
        margin-left: 0;
      }
    }
  }
</style>
<style lang="scss">
.refund-finish {
    .pl-button__default.plain {
        color: #ccc;
    }
    .pl-button__small.plain:after {
        border: 1px solid #ccc;
    }
}
.pl-collapse-item {
    .pl-collapse-item__content {
        padding-bottom: 20px;
    }
    &:nth-last-of-type(1) {
        .pl-collapse-item__content {
            padding-bottom: 0;
        }
    }
}
.pl-button__warning.plain {
    background-color: #fff;
    border: 1px solid #fe7700;
    color: #fe7700;
}
</style>
