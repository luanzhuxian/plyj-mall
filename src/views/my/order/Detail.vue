<template>
  <div
    v-if="loaded"
    :class="$style.orderDetail"
  >
    <div :class="$style.top">
      <top-text
        :title="orderStatusAlias"
        :tip="suggestionMap[orderStatus]"
      />
    </div>

    <!-- 核销码 -->
    <div
      :class="$style.qrcodeBox"
      v-if="redeemCodeModels.length > 0 && orderStatus !== 'WAIT_PAY'"
    >
      <img :src="qrImg" alt="" v-imger:QR="qrImg" :style="{ opacity: isAllCodeUseless ? 0.4 : 1 }">
      <div
        :class="{
          [$style.codeListBox]: true,
          [$style.collapse]: collapseQrCode
        }"
      >
        <h2 :class="$style.title">
          核销码
        </h2>
        <pl-svg
          v-if="isArrowShow"
          :class="{ [$style.collapse]: collapseQrCode }"
          name="right"
          color="#999"
          @click="() => { isArrowShow ? collapseQrCode = !collapseQrCode : '' }"
        />
        <ul :class="$style.codeList">
          <template v-for="(item, i) of redeemCodeModels">
            <li :class="{ [$style.codeItem]: true, [$style.used]: item.statusCode !== 0 }" :key="i" v-show="collapseQrCode ? i === 0 : true">
              <div>
                <div :class="$style.codeBox">
                  <code :class="$style.codeValue">
                    {{ item.redeemCode | separator(' ', 4) }}
                  </code>
                  <span :class="$style.codeStatus" v-text="item.status" />
                </div>
                <div :class="$style.whoUse" v-show="!collapseQrCode && item.name">
                  <pl-svg name="name-card" :color="item.statusCode !== 0 ? '#e1e1e1' : '#ccc'" />
                  <span :class="{ [$style.name]: true }" v-text="item.name" />
                  <span :class="{ [$style.phone]: true }" v-text="item.mobile" />
                </div>
              </div>
              <div :class="$style.shareCode" v-if="item.statusCode === 0">
                <div :class="$style.shareButton" @click="drawPost(item)">分享</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <div :class="$style.panel" v-if="hasExpressInfo">
      <express-item
        :order-id="orderId"
        :express-name="logisticsInfoModel && logisticsInfoModel.courierCompany"
        :express-number="logisticsInfoModel && logisticsInfoModel.courierNo"
        :express-status="logisticsInfoModel && logisticsInfoModel.logisticTrackModels.length ? logisticsInfoModel.logisticTrackModels[logisticsInfoModel.logisticTrackModels.length-1].content : ''"
        :img="productInfoModel.productDetailModels[0].productImg"
      />
    </div>

    <div :class="$style.panel">
      <div
        :class="$style.orderInfo"
        v-for="(item, i) of productInfoModel.productDetailModels"
        :key="i"
      >
        <order-item
          size="small"
          :img="item.productImg + '?x-oss-process=style/thum'"
          :name="item.productName"
          :price="item.price"
          :count="item.count"
          :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
          :product-id="item.productId"
          route-name="Lesson"
        />
        <div :class="$style.buttons">
          <pl-button
            v-if="isRefundBtnShow(item) && canApplyRefund"
            plain
            round
            @click="$router.push({
              name: 'Refund',
              params: { orderId, orderProductRId: item.orderProductRId },
              query: {
                orderStatus,
                orderType,
                productId: item.productId,
                productImg: item.productImg,
                productName: item.productName,
                skuCode1Name: item.skuCode1Name,
                skuCode2Name: item.skuCode2Name,
                count: orderType === 'PHYSICAL' ? item.count : usefulCodeCount
              }
             })"
          >
            {{ (item.afterSalesStatus === 3 || item.afterSalesStatus === 6) ? '再次申请' : '申请退款' }}
          </pl-button>
          <pl-button
            v-if="~[1, 4, 9].indexOf(item.afterSalesStatus)"
            plain
            round
            @click="$router.push({ name: 'RefundDetail', params: { id: item.mallRefundId } })"
          >
            退款中
          </pl-button>
          <pl-button
            class="refund-finish"
            v-if="item.afterSalesStatus === 2"
            plain
            round
            :style="{ opacity: item.afterSalesStatusExtend === 5 ? 0.3 : 1 }"
            @click="item.afterSalesStatusExtend === 5 ? '' : $router.push({ name: 'RefundDetail', params: { id: item.mallRefundId } })"
          >
            退款完成
          </pl-button>
          <pl-button
            :class="$style.large"
            v-if="item.afterSalesStatus === 5"
            type="warning"
            plain
            round
            @click="$router.push({ name: 'RefundDetail', params: { id: item.mallRefundId } })"
          >
            寄件运单号
          </pl-button>
          <pl-button
            v-if="isCommentBtnShow(item)"
            type="warning"
            plain
            round
            @click="$router.push({ name: 'CommentOrder', params: { orderId: orderId, productId: item.productId }, query: { productImg: item.productImg, skuCode1: item.skuCode1, skuCode2: item.skuCode2 } })"
          >
            晒单评价
          </pl-button>
        </div>
        <div
          :class="$style.explain"
          v-if="orderType !== 'PHYSICAL'"
        >
          <ModuleTitle
            title="使用说明"
            size="mini"
          />
          <div
            :class="$style.explainBox"
            v-text="item.productUseMethod"
          />
        </div>
      </div>

      <div :class="$style.productPrice">
        <p>
          <span>商品金额</span>
          <span
            class="rmb"
            v-text="productInfoModel.productsTotalAmount || 0"
          />
        </p>
        <p v-if="productInfoModel.couponDeduction > 0">
          <span>优惠券</span>
          <span
            class="rmb"
            v-text="'-' + productInfoModel.couponDeduction || 0"
          />
        </p>
        <p v-if="orderType === 'PHYSICAL'">
          <span>运费</span>
          <span
            class="rmb"
            v-text="productInfoModel.freight || 0"
          />
        </p>
      </div>

      <div :class="$style.amount">
        <span :class="$style.totalCount">{{ `共${productInfoModel.totalCount}件` }}</span>
        <span class="fz-30">
          总价：
        </span>
        <span
          :class="$style.totalMoney + ' fz-30 rmb'"
          v-text="productInfoModel.actuallyAmount || 0"
        />
      </div>
    </div>

    <div :class="$style.panel">
      <address-item
        v-if="shippingAddress.agencyAddress"
        :address="shippingAddress"
        :hide-address="orderType === 'VIRTUAL'"
        not-link
      />
    </div>

    <!-- <div :class="$style.panelPadding" v-if="studentInfoModels.length > 0">
      <pl-fields
        size="middle"
        text="学员信息"
        icon="name-card"
        :icon-gap="12"
        can-collapse
        show-right-icon
        :right-text="`已选${studentInfoModels.length}人`"
        left-text-weight="bold"
      >
        <ul :class="$style.studentList">
          <li :class="$style.studentItem" v-for="(item, i) of studentInfoModels" :key="i">
            <p :class="$style.studentName">
              <span>姓名</span>
              <span v-text="item.name" />
            </p>
            <p :class="$style.studentPhone">
              <span>电话</span>
              <span v-text="item.mobile" />
            </p>
          </li>
        </ul>
      </pl-fields>
    </div> -->

    <div :class="[$style.panel, $style.contact]" v-if="!shippingAddress.agencyAddress">
      <pl-fields
        size="middle"
        text="联系人信息"
        icon="contact"
        :icon-gap="12"
        left-text-weight="bold"
      >
        <div :class="$style.contactDetail">
          <span class="fz-28" v-text="shippingAddress.realName" />
          <span class="fz-28" v-text="shippingAddress.mobile" />
        </div>
      </pl-fields>
    </div>

    <div :class="[$style.panel, $style.otherInfo]">
      <div :class="$style.infoTop">
        <pl-list
          title="下单时间："
          :content="tradingInfoModel.createTime"
        />
        <pl-list
          title="订单编号："
          :content="orderId"
        />
        <pl-list
          v-if="orderStatus !== 'WAIT_PAY' && !isClosedByCancle"
          title="支付方式："
          :content="tradingInfoModel.payMethod"
        />
        <pl-list
          v-if="orderStatus !== 'WAIT_PAY' && !isClosedByCancle"
          title="支付时间："
          :content="tradingInfoModel.payTime"
        />
        <pl-list
          v-if="orderStatus !== 'WAIT_PAY' && !isClosedByCancle && hasExpressInfo"
          title="配送方式："
          :content="logisticsInfoModel && logisticsInfoModel.courierCompany"
        />
        <pl-list
          v-if="orderStatus !== 'WAIT_PAY' && !isClosedByCancle && hasExpressInfo"
          title="发货时间："
          :content="logisticsInfoModel && logisticsInfoModel.shipTime"
        />
      </div>
      <div :class="$style.infoBottom" v-if="message">
        <pl-list
          title="订单备注："
          :content="message"
        />
      </div>
    </div>

    <div
      v-if="orderType === 'PHYSICAL'"
      :class="[$style.panel, $style.invoice]"
    >
      <collapse v-model="collepseActiveNames">
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
          <collapse-item
            name="1"
            disabled
          >
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

    <div
      ref="footer"
      class="footer"
      :class="$style.footer"
    >
      <pl-button
        v-if="orderStatus === 'WAIT_PAY'"
        round
        plain
        @click="isPickerShow = true"
      >
        取消订单
      </pl-button>
      <pl-button
        v-if="(orderStatus === 'FINISHED' || orderStatus === 'CLOSED') && isDeleteBtnShow"
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
      <pl-button
        v-if="hasExpressInfo"
        plain
        round
        @click="$router.push({ name: 'Freight', params: { orderId }, query: { img: productInfoModel.productDetailModels[0].productImg } })"
      >
        查看物流
      </pl-button>
      <pl-button
        v-if="canApplyInvoice"
        round
        plain
        @click="applyInvoice"
      >
        申请发票
      </pl-button>
      <pl-button
        v-if="orderType === 'PHYSICAL' && orderStatus === 'WAIT_RECEIVE'"
        round
        type="warning"
        @click="confirmReceipt"
      >
        确认收货
      </pl-button>
      <pl-button
        v-if="orderStatus === 'WAIT_PAY'"
        type="warning"
        round
        :loading="payloading && currentPayId === orderId"
        :disabled="payloading"
        @click="pay"
      >
        去付款
      </pl-button>
    </div>
    <pl-popup
      ref="contact"
      :show.sync="isPopupShow"
    >
      <template name="title">
        <div :class="$style.popupTitle">
          <pl-svg
            :class="$style.popupTitleIcon"
            name="rows"
          />
          <span>联系我们</span>
        </div>
      </template>
      <template>
        <div :class="$style.popupContent">
          <div :class="$style.popupAddress">
            <pl-svg
              :class="$style.popupAddressLeftIcon"
              name="address-blue"
            />
            <span
              :class="$style.popupAddressText"
              v-text="address"
            />
            <pl-svg
              :class="$style.popupAddressRightIcon"
              name="copy"
              @click="doCopy"
            />
          </div>
          <a :href="`tel: ${supportPhone}`">
            <pl-button
              size="larger"
              background-color="#387AF6"
              prefix-icon="mobile-blue"
              round
            >
              立即拨打
            </pl-button>
          </a>
        </div>
      </template>
    </pl-popup>
    <pl-picker
      :show.sync="isPickerShow"
      :slots="pickerColumns"
      @confirm="(selected) => { cancelOrder(selected[0]) }"
    />

    <div :class="$style.shareImgBox" v-if="postShow">
      <div :class="$style.imgBox">
        <img :src="post" alt="">
      </div>
      <div :class="$style.description">
        <p>长按保存分享给好友</p>
        <pl-svg name="close3" color="#fff" width="80" @click="postShow = false" />
      </div>
    </div>
  </div>

  <div
    v-else
    :class="$style.skeleton"
  >
    <div :class="[$style.skeleton1, $style.skeAnimation]" />
    <div :class="[$style.skeleton2, $style.skeAnimation]" />
    <div :class="$style.skeleton3">
      <AddressItemSkeleton />
    </div>
    <div :class="$style.skeleton4">
      <OrderItemSkeleton :class="$style.skeletionOrder" />
      <div :class="[$style.skeleton41, $style.skeAnimation]" />
      <div :class="[$style.skeleton42, $style.skeAnimation]" />
    </div>
    <div :class="$style.skeleton3">
      <AddressItemSkeleton />
    </div>
    <div :class="$style.skeleton4">
      <div :class="[$style.skeleton41, $style.skeAnimation]" />
      <div :class="[$style.skeleton42, $style.skeAnimation]" />
      <div :class="[$style.skeleton41, $style.skeAnimation]" />
      <div :class="[$style.skeleton42, $style.skeAnimation]" />
      <div :class="[$style.skeleton41, $style.skeAnimation]" />
      <div :class="[$style.skeleton42, $style.skeAnimation]" />
      <div :class="[$style.skeleton41, $style.skeAnimation]" />
      <div :class="[$style.skeleton42, $style.skeAnimation]" />
    </div>
  </div>
</template>

<script>
import filter from '../../../filter/index'
import { createText } from '../../../assets/js/validate'
import moment from 'moment'
import TopText from '../../../components/Top-Text.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import ModuleTitle from '../../../components/Module-Title.vue'
import ExpressItem from '../../../components/item/Express-Item.vue'
import AddressItem from '../../../components/item/Address-Item.vue'
import Collapse from '../../../components/penglai-ui/collapse/Collapse.vue'
import CollapseItem from '../../../components/penglai-ui/collapse/Collapse-Item.vue'
import OrderItemSkeleton from '../../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../../components/skeleton/Address-Item.vue'
import { upload, deleteImage } from '../../../assets/js/upload-image'
import {
  getOrderDetail,
  getAwaitPayInfo,
  confirmReceipt,
  cancelOrder,
  deleteOrder,
  getVerificationStatus,
  setVerificationStatus
} from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
import { generateQrcode } from '../../../assets/js/util'
import { mapGetters } from 'vuex'

function updateLocalStorage (key, value) {
  const arr = JSON.parse(localStorage.getItem(key) || '[]')
  arr.push(value)
  localStorage.setItem(key, JSON.stringify(arr))
}

const suggestionMap = {
  WAIT_PAY: '',
  WAIT_SHIP: '请耐心等待商家发货…',
  WAIT_RECEIVE: '',
  FINISHED: '本次交易已完成，期待下次光临',
  CLOSED: '订单取消'
}
const invoiceMap = {
  '1': {
    main: '个人',
    sub: '手机号：',
    fields: 'receiverMobile'
  },
  '2': {
    main: '单位',
    sub: '纳税人识别号：',
    fields: 'tin'
  }
}
// 上传到服务器的二维码，离开页面后要删除
let qrcodeKey = ''

export default {
  name: 'OrderDetail',
  components: {
    TopText,
    OrderItem,
    ModuleTitle,
    ExpressItem,
    AddressItem,
    OrderItemSkeleton,
    AddressItemSkeleton,
    Collapse,
    CollapseItem
  },
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loaded: false,
      collapseQrCode: true,
      orderType: '',
      orderStatus: '',
      message: '',
      detail: {},
      receiverModel: {},
      logisticsInfoModel: {},
      productInfoModel: {},
      tradingInfoModel: [],
      invoiceModelList: [],
      studentInfoModels: [],
      redeemCodeModels: [],
      orderStatusAlias: '',
      shippingAddress: {
        realName: ' ',
        mobile: ' ',
        addressPrefix: ' ',
        agencyAddress: ' '
      },
      timer: 0,
      currentPayId: '',
      payloading: false,
      isPopupShow: false,
      isPickerShow: false,
      pickerColumns: [
        {
          flex: 1,
          values: ['不想买了', '信息填写错误，重新拍', '线下自提', '其他原因'],
          textAlign: 'center'
        }
      ],
      collepseActiveNames: [],
      suggestionMap,
      invoiceMap,
      qrImg: '',
      // 海报
      post: '',
      postShow: false
    }
  },
  computed: {
    ...mapGetters(['address', 'supportPhone']),
    isClosedByCancle () {
      return this.orderStatus === 'CLOSED' && !this.tradingInfoModel.payTime
    },
    // isClosedByRefund () {
    //   return this.orderStatus === 'CLOSED' && this.tradingInfoModel.payTime && this.isAllProductRefund
    // },
    isAllProductRefund () {
      return this.productInfoModel.productDetailModels.every(product => product.afterSalesStatus === 2)
    },
    isDeleteBtnShow () {
      // 只要有一个商品在售后状态则不显示删除按钮
      return this.productInfoModel.productDetailModels.every(product => [0, 2, 3, 6].includes(product.afterSalesStatus))
    },
    hasExpressInfo () {
      return this.orderType === 'PHYSICAL' && this.logisticsInfoModel && this.logisticsInfoModel.courierNo
      // (this.orderStatus === 'WAIT_RECEIVE' || this.orderStatus === 'FINISHED' || this.isClosedByRefund)
    },
    // 是否可以申请售后
    canApplyRefund () {
      return (this.orderStatus === 'WAIT_SHIP' || this.orderStatus === 'WAIT_RECEIVE' || (this.orderStatus === 'FINISHED' && this.orderType === 'PHYSICAL')) &&
      this.productInfoModel.actuallyAmount > 0 &&
      (this.orderType === 'PHYSICAL' || this.usefulCodeCount > 0)
    },
    // 是否可以申请发票，invoiceStatus： 8:'可申请' 1:'已申请' 3:'已开票' 7:'不支持'
    canApplyInvoice () {
      return this.orderType === 'PHYSICAL' &&
        this.orderStatus !== 'WAIT_PAY' &&
        this.orderStatus !== 'CLOSED' &&
        this.productInfoModel.productsTotalAmount - this.productInfoModel.couponDeduction > 0 &&
        this.productInfoModel.productDetailModels.some(item => {
          return item.price > 0 && item.invoiceStatus === 8 && ~[0, 3, 6].indexOf(item.afterSalesStatus)
        })
    },
    noInvoiceProList () {
      return this.productInfoModel.productDetailModels.filter(item => {
        return item.invoiceStatus === 8 && ~[0, 3, 6].indexOf(item.afterSalesStatus)
      })
    },
    // 核销码状: 0 待使用 1 已使用 2 退款中 3已退款 4已过期
    // 核销码全部过期或核销
    isAllCodeUseless () {
      return this.redeemCodeModels.every(item => item.statusCode === 1 || item.statusCode === 3 || item.statusCode === 4)
    },
    usefulCodeCount () {
      return this.redeemCodeModels.filter(item => item.statusCode === 0).length
    },
    isArrowShow () {
      return this.studentInfoModels.length || this.redeemCodeModels.length > 1
    }
  },
  async activated () {
    try {
      this.loaded = false
      await this.getDetail()
      this.loaded = true
    } catch (e) {
      throw e
    }
  },
  async deactivated () {
    this.post = ''
    this.postShow = false
    this.collepseActiveNames = []
    this.logisticsInfoModel = null
    this.suggestionMap.WAIT_RECEIVE = this.suggestionMap.WAIT_PAY = ''
    this.collapseQrCode = true
    this.isPopupShow = false
    this.isPickerShow = false
    clearInterval(this.timer)
    clearInterval(this.timer2)
    await deleteImage([qrcodeKey])
  },
  methods: {
    async drawPost (item) {
      this.postShow = true
      console.log(item)
      console.log(this.productInfoModel.productDetailModels[0])
      let canImg = new Image()
      canImg.crossOrigin = ''
      canImg.src = `https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/0C18FB91-C64E-4364-A391-1532CD691009.png?time=${Date.now()}`
      let qrcode = await generateQrcode(300, `${item.redeemCode}`, 0, null, null, 'url')
      let qrCodeImg = new Image()
      qrCodeImg.crossOrigin = ''
      qrCodeImg.src = qrcode
      let productImg = new Image()
      productImg.crossOrigin = ''
      productImg.src = `${this.productInfoModel.productDetailModels[0].productImg}?time=${Date.now()}&x-oss-process=style/thum`
      const start = this.productInfoModel.productDetailModels[0].validityPeriodStart.split(' ')[0]
      const end = this.productInfoModel.productDetailModels[0].validityPeriodEnd.split(' ')[0]
      canImg.onload = async () => {
        let canvas = document.createElement('canvas')
        canvas.width = canImg.width
        canvas.height = canImg.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(canImg, 0, 0, canvas.width, canvas.height)
        ctx.font = 'bold 42px Microsoft YaHei'
        ctx.fillStyle = '#666'
        if (!start && !end) {
          ctx.fillText(`使用有效期 长期有效`, 65, 210)
        } else if (start === end) {
          ctx.fillText(`使用有效期至 ${start}`, 65, 210)
        } else {
          ctx.fillText(`使用有效期至 ${start} 至 ${end}`, 65, 210)
        }
        ctx.font = 'bold 78px Microsoft YaHei'
        ctx.fillStyle = '#333'
        ctx.textAlign = 'center'
        ctx.fillText(`${filter.separator(item.redeemCode, ' ', 4)}`, 526, 880)
        ctx.font = '42px Microsoft YaHei'
        ctx.fillStyle = '#666'
        ctx.textAlign = 'left'
        ctx.fillText(`学员姓名：`, 265, 990)
        ctx.font = '600 42px Microsoft YaHei'
        ctx.fillStyle = '#333'
        ctx.fillText(`${item.name}`, 475, 990)
        ctx.font = '42px Microsoft YaHei'
        ctx.fillStyle = '#666'
        ctx.textAlign = 'left'
        ctx.fillText(`学员电话：`, 265, 1070)
        ctx.font = '600 42px Microsoft YaHei'
        ctx.fillStyle = '#333'
        ctx.fillText(`${item.mobile}`, 475, 1070)
        ctx.font = '33px Microsoft YaHei'
        ctx.fillStyle = '#333'
        createText(ctx, 330, 1250, `${this.productInfoModel.productDetailModels[0].productName}`, 50, 500, 2)
        // ctx.fillText(`${this.productInfoModel.productDetailModels[0].productName}`, 330, 1250)
        ctx.font = '33px Microsoft YaHei'
        ctx.fillStyle = '#333'
        ctx.textAlign = 'right'
        ctx.fillText(`￥${this.productInfoModel.productDetailModels[0].price}`, 990, 1250)
        ctx.fillStyle = '#999'
        ctx.fillText(`x${this.productInfoModel.productDetailModels[0].count}`, 990, 1300)
        ctx.fillStyle = '#f9f9f9'
        ctx.fillRect(330, 1340, 600, 60)
        let skuText = this.productInfoModel.productDetailModels[0].skuCode2Name ? this.productInfoModel.productDetailModels[0].skuCode1Name + this.productInfoModel.productDetailModels[0].skuCode2Name : this.productInfoModel.productDetailModels[0].skuCode1Name
        ctx.textAlign = 'left'
        ctx.fillStyle = '#999'
        ctx.fillText(`${skuText}`, 350, 1380)
        if (!item.name) {
          ctx.fillStyle = '#fff'
          ctx.fillRect(210, 920, 700, 200)
        }
        ctx.drawImage(qrCodeImg, 330, 350, 400, 400)
        ctx.drawImage(productImg, 60, 1215, 248, 248)
        let post = canvas.toDataURL('image/jpeg', 0.7)
        this.post = post
      }
    },
    // afterSalesStatus 0：无售后，1 退款中待审核，2 退款成功，3 退款驳回，4 退换货-已退货，5 退换货-待退货，6 退款取消
    isCommentBtnShow (item) {
      return this.orderStatus === 'FINISHED' &&
      item.assessmentStatus === 0 &&
      ((this.orderType === 'PHYSICAL' && ~[0, 3, 6].indexOf(item.afterSalesStatus)) || (this.orderType !== 'PHYSICAL' && this.redeemCodeModels.some(item => item.statusCode === 1)))
    },
    isRefundBtnShow (item) {
      return item.supportRefund && Number(item.refundPrice) > 0 && ~[0, 3, 6].indexOf(item.afterSalesStatus)
    },
    // 倒计时
    countDown (remanent, orderStatus) {
      this.timer = setInterval(() => {
        let { _data } = moment.duration(remanent)
        let d = String(_data.days)
        let h = String(_data.hours)
        let m = String(_data.minutes)
        let s = String(_data.seconds)
        remanent -= 1000
        if (remanent <= 0) {
          clearInterval(this.timer)
          this.suggestionMap.WAIT_PAY = this.suggestionMap.WAIT_RECEIVE = ''
          this.getDetail()
          return
        }
        if (orderStatus === 'WAIT_PAY') this.suggestionMap.WAIT_PAY = `还剩${h.padStart(2, '0')}小时${m.padStart(2, '0')}分${s.padStart(2, '0')}秒 订单自动关闭`
        if (orderStatus === 'WAIT_RECEIVE') this.suggestionMap.WAIT_RECEIVE = `还剩${d}天${h.padStart(2, '0')}时${m.padStart(2, '0')}分${s.padStart(2, '0')}秒后自动收货`
      }, 1000)
    },
    setTime (result, orderStatus) {
      let time = orderStatus === 'WAIT_PAY' ? result.tradingInfoModel.createTime : result.logisticsInfoModel.shipTime
      let duration = orderStatus === 'WAIT_PAY' ? (24 * 60 * 60 * 1000) : (10 * 24 * 60 * 60 * 1000)
      let now = moment((result.currentServerTime)).valueOf() // 服务器时间
      let startTime = moment(time).valueOf()
      if (now - startTime < duration) {
        this.countDown(duration + startTime - now - 2000, orderStatus)
      }
    },
    getDetail () {
      return new Promise(async (resolve, reject) => {
        try {
          let { result } = await getOrderDetail(this.orderId)
          const {
            orderStatus,
            orderId,
            orderType,
            message,
            receiverModel,
            logisticsInfoModel,
            productInfoModel,
            tradingInfoModel,
            invoiceModelList,
            studentInfoModels,
            orderStatusAlias,
            redeemCodeModels
          } = result
          this.detail = result
          this.orderStatus = orderStatus
          this.orderType = orderType
          this.message = message
          this.receiverModel = receiverModel
          this.logisticsInfoModel = logisticsInfoModel
          this.productInfoModel = productInfoModel
          this.tradingInfoModel = tradingInfoModel
          this.invoiceModelList = invoiceModelList
          this.studentInfoModels = studentInfoModels || []
          this.redeemCodeModels = redeemCodeModels || []
          this.orderStatusAlias = orderStatusAlias
          this.productInfoModel.totalCount = productInfoModel.productDetailModels.reduce((total, current) => {
            return total + current['count']
          }, 0);  // eslint-disable-line
          ({
            name: this.shippingAddress.realName,
            mobile: this.shippingAddress.mobile,
            address: this.shippingAddress.agencyAddress
          } = receiverModel)
          if (orderType !== 'PHYSICAL' && redeemCodeModels.length > 0) {
            if (orderStatus !== 'WAIT_PAY') {
              // 生成核销码二维码
              // 不使用await
              this.generateQrcode(orderId)
            }
            if (orderStatus !== 'CLOSED') {
              await setVerificationStatus(orderId)
              this.updateQrcode()
            }
          }

          if (orderStatus === 'CLOSED') {
            this.suggestionMap['CLOSED'] = this.isAllProductRefund ? '退款完成' : '订单取消'
          }
          if (orderStatus === 'WAIT_PAY') {
            this.setTime(result, 'WAIT_PAY')
          }
          if (orderStatus === 'WAIT_RECEIVE') {
            if (orderType === 'PHYSICAL') {
              this.setTime(result, 'WAIT_RECEIVE')
            } else {
              let { validityPeriodStart, validityPeriodEnd } = productInfoModel.productDetailModels[0]
              if (validityPeriodStart) {
                const start = validityPeriodStart.split(' ')[0]
                const end = validityPeriodEnd.split(' ')[0]
                this.suggestionMap.WAIT_RECEIVE = (start === end)
                  ? `有效期 ${start}`
                  : `有效期 ${start} 至 ${end}`
              } else {
                this.suggestionMap.WAIT_RECEIVE = '长期有效'
              }
            }
          }
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    },
    generateQrcode (orderId) {
      generateQrcode(300, orderId, 34, null, null, 'blob')
        .then(async (blob) => {
          try {
            let { name, url } = await upload(blob)
            qrcodeKey = name
            this.qrImg = url
          } catch (e) {
            this.$error('生成二维码失败')
          }
        })
        .catch(() => {
          this.$error('生成二维码失败')
        })
    },
    async pay () {
      try {
        const { orderId } = this
        this.currentPayId = orderId
        this.payloading = true
        const { result } = await getAwaitPayInfo(orderId)
        // 调用微信支付api
        await wechatPay(result)
        updateLocalStorage('UPDATE_ORDER_LIST', { id: orderId, action: 'pay' })
        this.$router.push({ name: 'PaySuccess', params: { orderId }, query: { orderType: this.orderType } })
      } catch (e) {
        throw e
      } finally {
        this.payloading = false
      }
    },
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
    async cancelOrder (reason) {
      try {
        await this.$confirm('订单一旦取消，将无法恢复，确认要取消订单？')
        await cancelOrder(this.orderId, reason)
        this.$success('交易关闭')
        this.getDetail()
        updateLocalStorage('UPDATE_ORDER_LIST', { id: this.orderId, action: 'cancel' })
      } catch (e) {
        throw e
      }
    },
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
      const physicalProducts = this.noInvoiceProList.filter(item => item.price > 0)
      localStorage.setItem('APPLY_INVOICE', JSON.stringify({ physicalProducts }))
      localStorage.setItem('APPLY_INVOICE_FROM', JSON.stringify({
        name: this.$route.name,
        params: this.$route.params,
        query: this.$route.query
      }))
      const { mobile, name } = this.receiverModel
      this.$router.push({
        name: 'ApplyInvoice',
        query: {
          orderId: this.orderId,
          receiveMobile: mobile,
          receiveName: name
        }
      })
    },
    doCopy () {
      this.$copyText(this.address)
        .then(e => {
          this.$success('复制成功')
        }, e => {
          console.error(e)
        })
    },
    // 定时器，实时刷新核销状态，如果有核销的话
    updateQrcode () {
      clearInterval(this.timer2)
      if (this.redeemCodeModels.some(item => item.statusCode === 0)) {
        this.timer2 = setInterval(async () => {
          try {
            let { result } = await getVerificationStatus(this.orderId)
            if (result) {
              this.getDetail()
            }
          } catch (e) {
            clearInterval(this.timer2)
          }
        }, 3000)
      }
    }
  }
}
</script>

<style module lang="scss">
  .order-detail {
    padding: 28px 24px 140px;
  }
  .shareImgBox{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:rgba(0,0,0,0.65);
    .img-box{
      padding: 72px 96px 34px 96px;
      img{
        width: 100%;
      }
    }
    .description{
      font-size:32px;
      font-weight:400;
      color: #FFFFFF;
      text-align: center;
      svg{
        margin-top: 26px;
      }
    }
  }
  .top {
    position: relative;
    margin-bottom: 28px;
    padding: 0 16px;
  }
  .qrcodeBox {
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
    .codeListBox {
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
        transform: rotate(-90deg);
        transition: transform .2s linear;
        &.collapse {
          transform: rotate(90deg);
        }
      }
    }
    .codeList {
      flex: 1;
      margin-top: -2px;
      .codeItem {
        display: flex;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e7e7e7;
        .share-code{
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 20px;
          .share-button{
            color: #FFFFFF;
            font-size:24px;
            font-weight:400;
            padding: 2px 10px;
            background:#FE7700;
            border-radius:4px;
          }
        }
        &:nth-last-of-type(1) {
          border-bottom: none;
          margin: 0;
          padding: 0;
        }
        &.used {
          .code-value {
            color: #ccc;
          }
          .code-status {
            color: #ccc;
          }
          .who-use {
            > span {
              color: #ccc;
            }
          }
        }
      }
    }
    .codeBox {
      .code-value {
        font-size: 32px;
      }
      .code-status {
        margin-left: 5px;
        font-size: 24px;
        vertical-align: 2px;
      }
    }
    .who-use {
      margin-top: 6px;
      line-height: 34px;
      > svg {
        width: 34px;
        margin-right: 8px;
        vertical-align: -4px;
      }
      > span {
        font-size: 24px;
        color: #666;
        &.name {
          margin-right: 20px;
        }
      }
    }

  }
  .panel {
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: $--radius1;
    overflow: hidden;
  }

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

  /** 联系我们底部弹窗 **/
  .popup-title {
    padding: 40px 42px 32px;
    display: flex;
    align-items: center;
    font-size:40px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: #000000;
    line-height: 56px;
  }
  .popup-title-icon {
    width: 26px;
    margin-right: 26px
  }
  .popup-content {
    padding: 35px 30px;
  }
  .popup-address {
    padding: 20px 30px;
    margin-bottom: 20px;
    background-color: #F9F9F9;
    display: flex;
    align-items: center;
    font-size: 28px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #000;
    line-height: 40px;
    border-radius: 10px;
  }
  .popup-address-text {
    flex: 1;
  }
  .popup-address-left-icon {
    width: 36px;
    margin-right: 24px
  }
  .popup-address-right-icon {
    width: 39px;
    margin-left: 40px
  }

  /** skeleton start **/
  .skeleton {
    padding: 28px 40px;
  }
  .skeleton1 {
    width: 200px;
    height: 53px;
  }
  .skeleton2 {
    width: 500px;
    height: 37px;
    margin-top: 14px;
  }
  .skeleton3 {
    margin-top: 30px;
    background-color: #fff;
  }
  .skeleton4 {
    margin-top: 30px;
    padding: 24px 28px;
    background-color: #fff;
  }
  .skeleton4-1 {
    width: 364px;
    height: 32px;
    margin-bottom: 8px;
  }
  .skeleton4-2 {
    width: 214px;
    height: 32px;
    margin-bottom: 20px;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
  }
  .skeletion-order {
    margin-top: 0px;
    margin-bottom: 20px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
  /** skeleton end **/
</style>

<style lang="scss">
  .refund-finish {
    .pl-button__default.plain {
      color: #CCC;
    }
    .pl-button__small.plain:after {
      border: 1px solid #CCC;
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
    background-color: #FFF;
    border: 1px solid #FE7700;
    color: #FE7700;
  }
</style>
