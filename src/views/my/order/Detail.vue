<template>
    <!-- 骨架屏 -->
    <OrderDetailSkeleton v-if="loading" />
    <div v-else :class="$style.orderDetail">
        <div :class="$style.top">
            <top-text
                :title="orderStatusDesc"
                :tip="orderStatusTip"
            />
        </div>
        <!-- 核销码 -->
        <!--paymentMethod 0-线上 1-线下 -->
        <!--非售后打款阶段 + 有核销码信息 + (订单待确认/已完成 || 线下付尾款+待付尾款阶段)-->
        <div
            :class="$style.qrcodeBox"
            v-if="!isRefundsFinalStage && redeemCodeModels.length > 0 && ([orderStatuskeyMap.WAIT_RECEIVE, orderStatuskeyMap.FINISHED].includes(detail.status) || (detail.paymentMethod === 1 && orderStatuskeyMap.WAIT_PAY_TAIL_MONEY === detail.status))"
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
        <div :class="[$style.panel, $style.express]"
             v-if="detail.orderType === orderTypeKeyMap.PHYSICAL_GOODS && [orderStatuskeyMap.WAIT_SHIP, orderStatuskeyMap.WAIT_RECEIVE, orderStatuskeyMap.FINISHED].includes(detail.status) && !isClosedByCancle"
        >
            <pl-svg name="icon-express" :class="$style.icon" />
            <span :class="$style.content">
                {{ detail.status === orderStatuskeyMap.WAIT_SHIP ? '待发货' : `${shippingInfoModel.logisticsCompany}  ${shippingInfoModel.logisticsNo}` }}
            </span>
        </div>

        <div :class="$style.panel" v-if="hasExpressInfo && false">
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
                    :activity-status="activityDataStatus"
                    :activity-id="activityDataId"
                />
                <div :class="$style.buttons">
                    <!--普通订单 + 发货前实际支付大于0/发货后除运费外支付大于0 + 支持售后 + 无售后 + 订单状态为待发货/待收货 支持 申请退款-->
                    <pl-button
                        v-if="supportApplyRefund"
                        plain
                        round
                        @click="applyRefund"
                    >
                        {{ detail.refundId ? '再次申请' : '申请退款' }}
                    </pl-button>
                    <!--实际支付大于0 + 支持售后 支持 申请退款-->
                    <pl-button
                        v-if="detail.orderSource === skuSourceKeyMap.NORMAL && detail.aftersaleStatus === aftersaleStatusKeyMap.PROCESSING"
                        plain
                        round
                        @click="$router.push({ name: 'RefundDetail', params: { id: detail.refundId } })"
                    >
                        退款中
                    </pl-button>
                    <!--售后完成 支持 退款完成显示-->
                    <pl-button
                        class="refund-finish"
                        v-if="detail.orderSource === skuSourceKeyMap.NORMAL && detail.aftersaleStatus === aftersaleStatusKeyMap.PROCESSING_COMPLETED"
                        plain
                        round
                        :style="{ opacity: goodsModel.aftersaleStatusExtend === aftersaleStatusKeyMap.PROCESSING ? 0.3 : 1 }"
                        @click="goodsModel.aftersaleStatusExtend === aftersaleStatusKeyMap.PROCESSING ? '' : $router.push({ name: 'RefundDetail', params: { id: detail.refundId } })"
                    >
                        退款完成
                    </pl-button>
                    <!--退货中 支持 寄件运单号显示-->
                    <pl-button
                        :class="$style.large"
                        v-if="detail.orderSource === skuSourceKeyMap.NORMAL && detail.aftersaleStatus === aftersaleStatusKeyMap.PROCESSINGE"
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
                        @click="$router.push({ name: 'CommentOrder', params: { orderId: orderId, productImg: goodsModel.img } })"
                    >
                        晒单评价
                    </pl-button>
                </div>
                <!--只有虚拟商品/正式课/体验课 才有使用说明-->
                <div
                    :class="$style.explain"
                    v-if="[orderTypeKeyMap.VIRTUAL_GOODS, orderTypeKeyMap.FORMAL_CLASS, orderTypeKeyMap.EXPERIENCE_CLASS].includes(detail.orderType) && goodsModel.goodsDescription"
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
                        <span>定金(不退<i v-if="detail.orderIntentionAmountDouble > 1">，翻{{ detail.orderIntentionAmountDouble }}倍</i>)</span>
                        <span class="rmb">{{ detail.orderIntentionAmount | formatAmount }}</span>
                    </p>
                    <p v-if="detail.status === orderStatuskeyMap.WAIT_PAY_TAIL_MONEY">
                        <span>待付尾款</span>
                        <span class="rmb">{{ detail.orderAmountTailMoney | formatAmount }}</span>
                    </p>
                    <p v-else>
                        <span>尾款</span>
                        <span class="rmb">{{ detail.amount - detail.orderIntentionAmount * detail.orderIntentionAmountDouble - (detail.freight || 0) | formatAmount }}</span>
                    </p>
                </template>
                <!-- 其他商品价格 -->
                <p v-else>
                    <span v-text="activeProductStatus[detail.orderSource] || '金额'" />
                    <span class="rmb">{{ detail.goodsPrice | formatAmount }}</span>
                </p>
                <!--兑换码信息-->
                <p v-if="detail.exchangeCode">
                    <span>兑换码（{{ detail.exchangeCode | separator(' ', 4) }}）</span>
                    <span>-¥{{ goodsModel.sellingPrice }}</span>
                </p>
                <!--优惠券-->
                <p v-if="detail.couponAmount">
                    <span>优惠券</span>
                    <span>-¥{{ detail.couponAmount | formatAmount }}</span>
                </p>
                <!--奖学金-->
                <p v-if="detail.scholarship">
                    <span>奖学金（红包）</span>
                    <span>-¥{{ detail.scholarship | formatAmount }}</span>
                </p>
                <!--春耘减免-->
                <p v-if="detail.orderSource === skuSourceKeyMap.SPRINGPLOUGHING && detail.combinationSpecialPrice">
                    <span>春耘减免</span>
                    <span>
                        <span class="color-fe7700">{{ detail.discount / 10 }}折 </span>
                        <span>-¥{{ detail.combinationSpecialPrice | formatAmount }}</span>
                    </span>
                </p>
                <!--组合折扣-->
                <p v-if="detail.orderSource === skuSourceKeyMap.COURSEPACKAGE && detail.combinationSpecialPrice">
                    <span>组合折扣</span>
                    <span>
                        <span class="color-fe7700">{{ detail.discount / 10 }}折 </span>
                        <span>-¥{{ detail.combinationSpecialPrice | formatAmount }}</span>
                    </span>
                </p>
                <!--运费-->
                <p v-if="detail.orderType === orderTypeKeyMap.PHYSICAL_GOODS">
                    <span>运费</span>
                    <span class="rmb">{{ (detail.freight || 0) | formatAmount }}</span>
                </p>
            </div>

            <div :class="$style.amount">
                <span :class="$style.totalCount">{{ `共${detail.count}件` }}</span>
                <span class="fz-30">
                    总价：
                </span>
                <!-- 商品待付尾款时，总价 = 定金 + 尾款 -->
                <span :class="$style.totalMoney + ' fz-30 rmb'">{{ (detail.status === orderStatuskeyMap.WAIT_PAY_TAIL_MONEY ? detail.amount + detail.orderAmountTailMoney : detail.amount) | formatAmount }}</span>
            </div>
        </div>

        <!-- 实体订单 + 有收货信息 时，显示 收货人信息 -->
        <div :class="$style.panel">
            <address-item
                v-if="detail.orderType === orderTypeKeyMap.PHYSICAL_GOODS && receiverModel.address"
                :address="{
                    realName: receiverModel.name,
                    mobile: receiverModel.mobile,
                    addressPrefix: '',
                    agencyAddress: receiverModel.address
                }"
                :hide-address="detail.orderType === orderTypeKeyMap.VIRTUAL_GOODS"
                not-link
            />
        </div>

        <!-- 实体订单-用户信息 -->
        <div :class="[$style.panel, $style.customBlockField]" v-if="detail.orderType === orderTypeKeyMap.PHYSICAL_GOODS && studentInfo.length">
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
                    <div :class="$style.item" v-for="(item, i) of studentInfo[0]" :key="i">
                        <span>{{ item.fieldName }}：</span>
                        <span v-if="item.fieldValue">{{ item.fieldValue }}</span>
                        <span v-else style="color: #999;">未填写</span>
                    </div>
                </div>
            </pl-fields>
        </div>

        <!-- 虚拟订单-学员信息 -->
        <template v-if="needCodeOrderTypeList.includes(detail.orderType) && studentInfo.length">
            <div :class="[$style.panel, $style.customBlockField]" v-for="(studentItem, i) of studentInfo" :key="i">
                <pl-fields
                    size="middle"
                    :text="`学员信息${i + 1}`"
                    :right-text="i < redeemCodeModels.length && redeemCodeModels[i].code ? `核销码：${localSeparator(redeemCodeModels[i].code,' ', 4)}`: ''"
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
        <div :class="[$style.panel, $style.contact]" v-if="detail.orderType !== orderTypeKeyMap.PHYSICAL_GOODS && receiverModel.name && receiverModel.mobile">
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
                    <span class="fz-28">
                        {{ receiverModel.mobile | formatAccount }}
                    </span>
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
                    v-if="detail.orderType === orderTypeKeyMap.PHYSICAL_GOODS && detail.status === orderStatuskeyMap.WAIT_RECEIVE && !isClosedByCancle"
                    title="配送方式："
                    :content="shippingInfoModel.logisticsCompany"
                />
                <pl-list
                    v-if="detail.orderType === orderTypeKeyMap.PHYSICAL_GOODS && detail.status === orderStatuskeyMap.WAIT_RECEIVE && !isClosedByCancle"
                    title="发货时间："
                    :content="shippingInfoModel.operatorTime"
                />
            </div>
            <div :class="$style.infoBottom" v-if="detail.orderPostscript">
                <pl-list
                    title="订单备注："
                    :content="detail.orderPostscript"
                />
            </div>
        </div>

        <!-- 发票信息：0元 + 不支持开发票 不显示 -->
        <div v-if=" detail.orderSource === skuSourceKeyMap.NORMAL &&
            (detail.amount - detail.freight) > 0 &&
            detail.supportInvoice " :class="[$style.panel, $style.invoice]">
            <div :class="$style.title">
                发票信息：<span :class="$style.color222" v-if="!detail.invoiceId">未开票</span>
            </div>
            <div v-if="detail.invoiceId">
                <div>
                    <span :class="$style.type" v-text="invoiceMap[invoiceModel.invoiceType].main" />
                    <span :class="$style.name" v-text="invoiceModel.invoiceTitle" />
                </div>
                <div>
                    <span v-text="invoiceMap[invoiceModel.invoiceType].sub" />
                    <!--个人发票 - 取 收货人电话； 单位发票-取 纳税人识别号 -->
                    <span v-text="invoiceModel.invoiceType === 1? invoiceModel.companyPhone : invoiceModel.taxpayerNumber" />
                </div>
            </div>
        </div>

        <!-- footer -->
        <div
            ref="footer"
            class="footer"
            :class="$style.footer"
        >
            <!-- 待付款 支持 取消订单-->
            <pl-button
                v-if="orderStatuskeyMap.WAIT_PAY === detail.status"
                round
                plain
                @click="isPickerShow = true"
            >
                取消订单
            </pl-button>
            <!--订单完成/关闭 支持 删除订单-->
            <pl-button
                v-if="[orderStatuskeyMap.FINISHED, orderStatuskeyMap.CLOSED].includes(detail.status)"
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
                v-if="hasExpressInfo && false"
                plain
                round
                @click="$router.push({ name: 'Freight', params: { orderId }, query: { img: goodsModel.img } })"
            >
                查看物流
            </pl-button>
            <!-- 支持 实付款大于0 + 订单创建后未取消 + 可申请发票 + 未申请过发票 + 无售后 支持 申请发票-->
            <pl-button
                v-if="supportApplyInvoice"
                round
                plain
                @click="applyInvoice"
            >
                申请发票
            </pl-button>
            <!--实体订单 + 待收货 + 非售后打款阶段 支持 确认收货-->
            <pl-button
                v-if="detail.orderType === orderTypeKeyMap.PHYSICAL_GOODS && (detail.status === orderStatuskeyMap.WAIT_RECEIVE) && !isRefundsFinalStage"
                round
                type="warning"
                @click="confirmReceipt"
            >
                确认收货
            </pl-button>
            <!--待付款 支持 去付款-->
            <pl-button
                v-if="detail.orderSource !== skuSourceKeyMap.SPRINGPLOUGHING && detail.orderSource !== skuSourceKeyMap.COURSEPACKAGE && detail.status === orderStatuskeyMap.WAIT_PAY"
                type="warning"
                round
                :loading="payloading"
                :disabled="payloading || finalPaymentIsEnded"
                @click="pay"
            >
                {{ finalPaymentIsEnded ? '已过期' : '去付款' }}
            </pl-button>
            <!--知识课程 + 订单完成 支持 去学习-->
            <pl-button
                v-if="(detail.orderType === orderTypeKeyMap.KNOWLEDGE_COURSE || detail.orderType === orderTypeKeyMap.SERIES_OF_COURSE) && (detail.status === orderStatuskeyMap.FINISHED)"
                type="warning"
                round
                @click="$router.push({ name: 'Courses', params: { courseType: detail.orderType === orderTypeKeyMap.KNOWLEDGE_COURSE? '1' : '2' } })"
            >
                去学习
            </pl-button>
            <!--去付尾款-->
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

        <!-- 分享核销码弹窗 -->
        <SharePoster
            :show.sync="isPosterShow"
            :poster="poster"
            @close="isPosterShow = false"
        />

        <!-- 联系我们底部弹窗 -->
        <Contact :show.sync="isPopupShow" />
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import TopText from '../../../components/common/Top-Text.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import ModuleTitle from '../../../components/common/Module-Title.vue'
import ExpressItem from '../../../components/item/Express-Item.vue'
import AddressItem from '../../../components/item/Address-Item.vue'
import OrderDetailSkeleton from './components/Order-detail-Skeleton'
import OrderCodeItem from './components/Order-Code-Item'
import SharePoster from '../../../components/common/Share-Poster'
import Contact from '../../../components/common/Contact.vue'
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

const suggestionMap = {
    WAIT_PAY: '',
    WAIT_SHIP: '请耐心等待商家发货…',
    WAIT_RECEIVE: '',
    FINISHED: '本次交易已完成，期待下次光临',
    CLOSED: '订单取消',
    WAIT_PAY_REPAYMENT: ''
}
const invoiceMap = {
    1: { main: '个人', sub: '手机号：' },
    2: { main: '单位', sub: '纳税人识别号：' }
}

export default {
    name: 'OrderDetail',
    components: {
        TopText,
        ModuleTitle,
        OrderItem,
        ExpressItem,
        AddressItem,
        OrderCodeItem,
        OrderDetailSkeleton,
        Contact,
        SharePoster
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
            // 当前是否正在支付
            payloading: false,
            // 显示联系我们
            isPopupShow: false,
            // 显示取消退款原因选项
            isPickerShow: false,
            // 订单详情
            detail: {},
            // 退款中/退款成功 已经进入 微信打款阶段，不可再 确认收货/核销
            isRefundsFinalStage: false,
            // 商品详情
            goodsModel: {},
            // 订单最后一次交易记录
            orderLastPayInfo: {},
            // TODO.20200513物流详情 暂时不显示，发货后直接显示已发货
            logisticsInfoModel: {},
            // 发票信息
            invoiceModel: {},
            // 联系人信息
            receiverModel: {},
            // 核销码
            redeemCodeModels: [],
            // 物流信息
            shippingInfoModel: {},
            //  实体订单-用户信息 / 虚拟订单-学员信息
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
            activeProductStatus: { 2: '团购金额', 3: '限时秒杀', 4: '定金' },
            // 需要核销的订单类型
            needCodeOrderTypeList: []
        }
    },
    computed: {
        ...mapGetters(['skuSourceKeyMap', 'orderStatusMap', 'orderStatuskeyMap', 'orderTypeKeyMap', 'aftersaleStatusKeyMap', 'orderActionMap']),
        orderStatusDesc () {
            // 虚拟订单 待收货 改为 待使用； 订单完成 还未评价的 待评价
            return [this.orderTypeKeyMap.VIRTUAL_GOODS, this.orderTypeKeyMap.FORMAL_CLASS, this.orderTypeKeyMap.EXPERIENCE_CLASS].includes(this.detail.orderType) &&
        this.orderStatuskeyMap.WAIT_RECEIVE === this.detail.status
                ? this.orderStatusMap[this.orderStatuskeyMap.WAIT_RECEIVE_OF_VIRTUAL] : this.isCommentBtnShow ? '待评价' : this.orderStatusMap[this.detail.status]
        },
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
        // 是否显示评价按钮 实体/虚拟/正式课/体验课 + 订单完成 + 无售后 + 未评论
        isCommentBtnShow () {
            return this.detail.status === this.orderStatuskeyMap.FINISHED &&
              this.detail.aftersaleStatus === this.aftersaleStatusKeyMap.NO_AFTER_SALES &&
              !this.detail.commented &&
              [this.orderTypeKeyMap.PHYSICAL_GOODS, this.orderTypeKeyMap.VIRTUAL_GOODS, this.orderTypeKeyMap.FORMAL_CLASS, this.orderTypeKeyMap.EXPERIENCE_CLASS].includes(this.detail.orderType)
        },
        // 是否支持申请发票
        supportApplyInvoice () {
            /*
            * 普通商品
            * 商品本身支持发票
            * 未开具过发票
            * 除运费外的实付款大于0
            * 待发货/待收货/订单已完成
            * 商品不在售后中
            * */
            return this.detail.orderSource === this.skuSourceKeyMap.NORMAL &&
              this.detail.supportInvoice &&
              !this.detail.invoiceId &&
            (this.detail.amount - this.detail.freight) > 0 &&
            [this.orderStatuskeyMap.WAIT_SHIP, this.orderStatuskeyMap.WAIT_RECEIVE, this.orderStatuskeyMap.FINISHED].includes(this.detail.status) &&
              this.detail.aftersaleStatus === this.aftersaleStatusKeyMap.NO_AFTER_SALES
        },
        physicaSupportApplyRefund () {
            // 实体商品 + (未发货前，运费可退 || 待确认/已完成 除运费外的金额大于0 ) 可售后
            return this.orderTypeKeyMap.PHYSICAL_GOODS === this.detail.orderType &&
            (
                (this.orderStatuskeyMap.WAIT_SHIP === this.detail.status && this.detail.amount) ||
              ([this.orderStatuskeyMap.WAIT_RECEIVE, this.orderStatuskeyMap.FINISHED].includes(this.detail.status) && (this.detail.amount - this.detail.freight) > 0)
            )
        },
        virtualSupportApplyRefund () {
            // 虚拟商品/正式课/体验课 + 实付款 + (待发货(其实没有该状态) || 待核销，核销码均未使用)  可售后
            return [this.orderTypeKeyMap.VIRTUAL_GOODS, this.orderTypeKeyMap.FORMAL_CLASS, this.orderTypeKeyMap.FORMAL_CLASS].includes(this.detail.orderType) &&
              this.detail.amount &&
              (
                  this.orderStatuskeyMap.WAIT_SHIP === this.detail.status ||
                (this.orderStatuskeyMap.WAIT_RECEIVE === this.detail.status && this.redeemCodeModels.length === this.usefulCodeNumber)
              )
        },
        // 是否支持申请售后
        supportApplyRefund () {
            /*
            * 普通商品
            * 商品支持售后
            * 没有正在进行中/已完成的售后
            * 待发货，可退运费 / （实体订单待确认/已完成 除运费外可退  || 虚拟/正式课/体验课，全部均未核销 可退）
            * */
            return this.detail.orderSource === this.skuSourceKeyMap.NORMAL &&
              this.detail.supportAfterSales &&
              this.detail.aftersaleStatus === this.aftersaleStatusKeyMap.NO_AFTER_SALES &&
              (this.physicaSupportApplyRefund || this.virtualSupportApplyRefund)
        }
    },
    async activated () {
        try {
            this.loading = true
            this.needCodeOrderTypeList = [this.orderTypeKeyMap.VIRTUAL_GOODS, this.orderTypeKeyMap.FORMAL_CLASS, this.orderTypeKeyMap.EXPERIENCE_CLASS]
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
        ...mapMutations([`submitOrder/setInvoiceProducts`, 'setOrderOperatedList']),
        async getDetail () {
            try {
                const { result } = await getOrderDetail(this.orderId)
                const { goodsModel, orderPayTransInfos, redeemCodeModels, productCustomInfo, invoiceInfoModel, shippingInfoModel } = result
                result.refundId = (result.orderRefundsModel && result.orderRefundsModel.id) || ''
                // 组合折扣  = 商品总价 - 运费 - 实际付款值
                result.combinationSpecialPrice = (result.goodsPrice || 0) - (result.freight || 0) - (result.amount || 0)
                this.detail = result
                goodsModel.sellingPrice = filter.formatAmount(goodsModel.sellingPrice)
                // // orderRefundsModel.businessStatus 退换货状态 1:待退货 2:待收货 3:退货完成 4:待退款 5:退款中 6:退款成功 7:退款失败
                this.isRefundsFinalStage = result.orderRefundsModel && [5, 6].includes(result.orderRefundsModel.businessStatus)
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
                this.shippingInfoModel = shippingInfoModel
                // 物流信息
                this.logisticsInfoModel = {}
                // 发票信息
                this.invoiceModel = invoiceInfoModel || {}
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
                // 设置订单文案: 待支付/待付尾款订单显示倒计时描述， 其他订单状态显示如下
                if (![this.orderStatuskeyMap.WAIT_PAY, this.orderStatuskeyMap.WAIT_PAY_TAIL_MONEY].includes(this.detail.status)) {
                    let tip = ''
                    tip = suggestionMap[result.status]
                    if (this.detail.aftersaleStatus === this.aftersaleStatusKeyMap.PROCESSING_COMPLETED) {
                        tip = '退款完成'
                    }
                    if (redeemCodeModels.length) {
                        // 虚拟商品 + 待收货 显示有效期信息
                        if (result.status === this.orderStatuskeyMap.WAIT_RECEIVE) {
                            const { expirationStartTime, expirationEndTime } = redeemCodeModels[0]
                            // 虚拟商品/正式课/体验课 使用有效期
                            if ([this.orderTypeKeyMap.VIRTUAL_GOODS, this.orderTypeKeyMap.FORMAL_CLASS, this.orderTypeKeyMap.EXPERIENCE_CLASS].includes(result.orderType)) {
                                if (expirationStartTime) {
                                    const start = moment(expirationStartTime).format('YYYY-MM-DD')
                                    const end = moment(expirationEndTime).format('YYYY-MM-DD')
                                    tip = (start === end) ? `有效期 ${ start }` : `有效期 ${ start } 至 ${ end }`
                                } else {
                                    tip = '长期有效'
                                }
                            }
                        }
                    }
                    this.orderStatusTip = tip
                }
                // 自定义表单信息/学员信息
                {
                    /*
                      虚拟订单-学员信息有两种来源： 1-核销码上携带的默认填写的学员信息 2-自定义表单
                      实体订单-用户信息 来源于： 自定义表单
                    */
                    const newStudentInfo = productCustomInfo ? JSON.parse(productCustomInfo) : []
                    if (!newStudentInfo.length && this.needCodeOrderTypeList.includes(result.orderType)) {
                        this.redeemCodeModels.forEach(item => {
                            if (item.userName || item.userMobile) {
                                newStudentInfo.push([
                                    { fieldName: '姓名', fieldValue: item.userName },
                                    { fieldName: '电话', fieldValue: item.userMobile }
                                ])
                            }
                        })
                    }
                    this.studentInfo = newStudentInfo
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
            // 只有 待付款 / 待付尾款 有支付倒计时 + 实体订单 有 确认收货倒计时
            if ((![this.orderStatuskeyMap.WAIT_PAY, this.orderStatuskeyMap.WAIT_PAY_TAIL_MONEY].includes(this.detail.status)) &&
              !(this.orderStatuskeyMap.WAIT_RECEIVE === this.detail.status && this.detail.orderType === this.orderTypeKeyMap.PHYSICAL_GOODS)
            ) return
            // 春耘 / 组合聚惠学 不显示支付倒计时
            if (this.detail.orderSource === this.skuSourceKeyMap.SPRINGPLOUGHING || this.detail.orderSource === this.skuSourceKeyMap.COURSEPACKAGE) return
            // 服务器时间
            const now = moment((this.detail.currentServerTime)).valueOf()
            if (this.orderStatuskeyMap.WAIT_RECEIVE === this.detail.status) {
                // 默认自动收货时间为10天
                const maxReceive = moment((this.shippingInfoModel.operatorTime)).add(10, 'days')
                const endTime = moment(maxReceive).valueOf()
                if (endTime > now) this.countDown(endTime - now)
            } else {
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
        setOrderOperatedList (action) {
            this.$store.commit('setOrderOperatedList', { id: this.orderId, action })
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
                this.setOrderOperatedList(this.orderActionMap.pay)
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
                this.setOrderOperatedList(this.orderActionMap.receive)
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
                await this.getDetail()
                this.setOrderOperatedList(this.orderActionMap.cancel)
            } catch (e) {
                throw e
            }
        },
        // 删除订单
        async deleteOrder () {
            try {
                await this.$confirm('是否删除当前订单？ 删除后不可找回')
                await deleteOrder(this.orderId)
                this.$success('删除成功')
                this.setOrderOperatedList(this.orderActionMap.delete)
                setTimeout(() => {
                    this.$router.go(-1)
                }, 2000)
            } catch (e) {
                throw e
            }
        },
        // 申请发票
        applyInvoice () {
            const { img, goodsType, count } = this.goodsModel
            this.$store.commit('submitOrder/setInvoiceProducts', {
                products: [{
                    goodsId: this.detail.goodId,
                    goodsImage: img,
                    goodsType,
                    count
                }],
                fromRoute: {
                    name: this.$route.name,
                    params: this.$route.params,
                    query: this.$route.query
                }
            })
            if (this.receiverModel.mobile) {
                this.$router.push({
                    name: 'ApplyInvoice',
                    query: {
                        orderId: this.orderId,
                        orderType: this.detail.orderType,
                        receiveMobile: this.receiverModel.mobile,
                        receiveName: this.receiverModel.name
                    }
                })
            } else {
                this.$router.push({ name: 'ApplyInvoice' })
            }
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

  /*物流信息*/
  .express {
    padding: 0 24px;
    line-height: 80px;
    .icon {
      width: 64px;
      height: 64px;
      margin-top: -3px;
      margin-right: 28px;
      vertical-align: middle;
      fill: $--warning-color;
    }
    .content {
      font-size: 26px;
      color: #666666;
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
    font-size: 28px;
    .title {
      margin-bottom: 20px;
      color: #666;
    }
    > div {
      color: #222;
      > div {
        margin-top: 12px;
        .type {
          display: inline-block;
          width: 74px;
          height: 32px;
          margin-right: 12px;
          border-radius: 4px;
          line-height: 32px;
          text-align: center;
          font-size: 24px;
          background-color: #FDEFD6;
          color: #FE7700;
        }
        .name {
          line-height: 40px;
          font-weight: bold;
          color: #2E2E2E;
        }
      }
    }
    .color-222{
      color: #222;
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
  .color-fe7700 {
    color: #fe7700;
  }
</style>
