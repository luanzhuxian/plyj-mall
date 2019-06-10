<template>
  <div
    v-if="loaded"
    :class="$style.orderDetail"
  >
    <div :class="$style.top">
      <top-text
        :title="orderStatusMap[orderStatus]"
        :tip="orderType === 'VIRTUAL' ? '' : suggestionMap[orderStatus]"
      />
      <!-- <a :href="`tel:${supportPhone}`">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
      </a> -->
    </div>

    <div
      :class="$style.panel"
      v-if="orderType === 'PHYSICAL' && (orderStatus === 'WAIT_RECEIVE' || orderStatus === 'FINISHED')"
    >
      <express-item
        :order-id="orderId"
        :express-name="logisticsInfoModel && logisticsInfoModel.courierCompany"
        :express-number="logisticsInfoModel && logisticsInfoModel.courierNo"
        :express-status="logisticsInfoModel && logisticsInfoModel.logisticTrackModels[logisticsInfoModel.logisticTrackModels.length-1].content"
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
          :img="item.productImg"
          :name="item.productName"
          :count="item.count"
          :option="item.optionName"
          :price="item.price"
          route-name="Lesson"
        />
        <div :class="$style.buttons">
          <pl-button
            v-if="canApplyRefund && item.afterSalesStatus === 0"
            plain
            round
            @click="$router.push({ name: 'Refund', params: { orderId, productId: item.productId } })"
          >
            申请退款
          </pl-button>
          <pl-button
            v-if="canApplyRefund && item.afterSalesStatus === 1"
            plain
            round
            @click="$router.push({ name: 'RefundDetail', params: { orderId } })"
          >
            退款中
          </pl-button>
          <pl-button
            class="refund-finish"
            v-if="canApplyRefund && item.afterSalesStatus === 2"
            plain
            round
            @click="$router.push({ name: 'RefundDetail', params: { orderId } })"
          >
            退款完成
          </pl-button>
          <pl-button
            v-if="orderStatus === 'FINISHED' && item.assessmentStatus === 0"
            type="warning"
            plain
            round
            @click="$router.push({ name: 'CommentOrder', params: { orderId: orderId, productId: item.productId } })"
          >
            晒单评价
          </pl-button>
        </div>
        <div
          :class="$style.explain"
          v-if="orderType === 'VIRTUAL'"
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
          class="fz-30 rmb"
          v-text="productInfoModel.amount || 0"
        />
      </div>
    </div>

    <div :class="$style.panel">
      <address-item
        :address="shippingAddress"
        not-link
      />
    </div>

    <div :class="[$style.panel, $style.otherInfo]">
      <div :class="$style.infoTop">
        <pl-list
          title="下单时间："
          :content="tradingInfoModel.createTime"
        />
        <pl-list
          title="订单编号："
          :content="tradingInfoModel.serialNo"
        />
        <pl-list
          v-if="orderStatus === 'WAIT_SHIP' || orderStatus === 'WAIT_RECEIVE' || orderStatus === 'FINISHED'"
          title="支付方式："
          :content="tradingInfoModel.payMethod"
        />
        <pl-list
          v-if="orderStatus === 'WAIT_SHIP' || orderStatus === 'WAIT_RECEIVE' || orderStatus === 'FINISHED'"
          title="支付时间："
          :content="tradingInfoModel.payTime"
        />
        <pl-list
          v-if="orderStatus === 'WAIT_RECEIVE' || orderStatus === 'FINISHED'"
          title="配送方式："
          :content="logisticsInfoModel && logisticsInfoModel.courierCompany"
        />
        <pl-list
          v-if="orderStatus === 'WAIT_RECEIVE' || orderStatus === 'FINISHED'"
          title="发货时间："
          :content="logisticsInfoModel && logisticsInfoModel.shipTime"
        />
      </div>
      <div :class="$style.infoBottom">
        <collapse v-model="collepseActiveNames">
          <template
            v-for="(item, i) of invoiceModelList"
          >
            <collapse-item
              name="1"
              :key="i"
            >
              <template slot="title">
                <div>
                  <span :class="$style.invoiceTitle">发票信息：</span>
                  <span v-text="invoiceMap[item.invoiceType].type" />
                </div>
              </template>
              <div
                :class="$style.invoiceName"
                v-text="item.invoiceTitle"
              />
              <div
                :class="$style.invoiceNumber"
                v-text="item[invoiceMap[item.invoiceType].fields]"
              />
              <template slot="right-icon">
                <pl-button
                  v-if="canIApplyInvoice"
                  round
                  plain
                  @click="applyInvoice"
                >
                  立即申请
                </pl-button>
                <span v-else />
              </template>
            </collapse-item>
          </template>
        </collapse>
      </div>
    </div>

    <div :class="$style.footer">
      <pl-button
        v-if="orderStatus === 'WAIT_PAY'"
        round
        plain
        @click="isPickerShow = true"
      >
        取消订单
      </pl-button>
      <pl-button
        v-if="orderStatus === 'FINISHED' || orderStatus === 'CLOSED'"
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
        v-if="orderStatus === 'FINISHED' || orderStatus === 'WAIT_RECEIVE'"
        plain
        round
        @click="$router.push({ name: 'Freight', params: { orderId } })"
      >
        查看物流
      </pl-button>
      <pl-button
        v-if="orderStatus === 'WAIT_RECEIVE'"
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
            />
          </div>
          <a :href="`tel: ${supportPhone}`">
            <pl-button
              size="larger"
              background-color="#387AF6"
              prefix-icon="mobile-blue"
              @click="call"
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
      @confirm="onPickerConfirm"
    />
  </div>

  <div
    v-else
    :class="$style.skeleton"
  >
    <div :class="$style.skeleton1 + ' ' + $style.skeAnimation" />
    <div :class="$style.skeleton2 + ' ' + $style.skeAnimation" />
    <div :class="$style.skeleton3">
      <AddressItemSkeleton />
      <AddressItemSkeleton />
    </div>
    <div :class="$style.skeleton4">
      <div :class="$style.skeleton41 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton42 + ' ' + $style.skeAnimation" />
      <OrderItemSkeleton />
      <div :class="$style.skeleton44 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton45 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton46 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton47 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton48 + ' ' + $style.skeAnimation" />
    </div>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import ModuleTitle from '../../../components/Module-Title.vue'
import ExpressItem from '../../../components/item/Express-Item.vue'
import AddressItem from '../../../components/item/Address-Item.vue'
import OrderItemSkeleton from '../../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../../components/skeleton/Address-Item.vue'
import Collapse from '../../../components/penglai-ui/collapse/Collapse.vue'
import CollapseItem from '../../../components/penglai-ui/collapse/Collapse-Item.vue'
import {
  getOrderDetail,
  getAwaitPayInfo,
  confirmReceipt,
  cancelOrder,
  deleteOrder
} from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
import { mapGetters } from 'vuex'
import Moment from 'moment'

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
      supplierOrder: true, // 是否是供应商订单
      orderType: '',
      orderStatus: '',
      detail: {},
      receiverModel: {},
      logisticsInfoModel: {},
      productInfoModel: {},
      tradingInfoModel: [],
      invoiceModelList: [],
      noInvoiceProList: [], // 未申请发票的商品
      operationRecordModel: {},
      shippingAddress: {
        realName: ' ',
        mobile: ' ',
        addressPrefix: ' ',
        agencyAddress: ' '
      },
      currentPayId: '',
      timer: 0,
      loaded: false,
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
      suggestionMap: {
        WAIT_PAY: '',
        WAIT_SHIP: '请耐心等待商家发货…',
        WAIT_RECEIVE: '',
        FINISHED: '本次交易已完成，感谢下次光临',
        CLOSED: '订单取消'
      },
      invoiceMap: {
        '1': {
          type: '个人',
          fields: 'receiverMobile' // 要显示的字段名称
        },
        '2': {
          type: '单位',
          fields: 'tin' // 要显示的字段名称
        }
      },
      resolve: null
    }
  },
  computed: {
    ...mapGetters(['orderStatusMap', 'address', 'supportPhone']),
    // 是否可以申请售后
    canApplyRefund () {
      return (this.orderStatus === 'WAIT_SHIP' || this.orderStatus === 'WAIT_RECEIVE' || this.orderStatus === 'FINISHED') && this.orderType !== 'VIRTUAL_GOODS'
    },
    // 是否可以申请发票
    canIApplyInvoice () {
      return this.orderStatus !== 'WAIT_PAY' &&
        this.orderStatus !== 'CLOSED' &&
        this.invoiceModelList.length < this.productInfoModel.productDetailModels.length
    }
  },
  async activated () {
    try {
      await this.getDetail()
    } catch (e) {
      throw e
    }
  },
  deactivated () {
    this.logisticsInfoModel = null
  },
  methods: {
    getDetail () {
      const counter = array => key => array.reduce((total, current) => total + current[key], 0)
      const checkIsRefundSuccessful = products => {
        const array = products.filter(product => product.afterSalesStatus === 3)
        return products.length === array.length
      }
      return new Promise(async (resolve, reject) => {
        try {
          this.loaded = false
          let { result } = await getOrderDetail(this.orderId)
          const {
            orderStatus,
            orderType,
            receiverModel,
            logisticsInfoModel,
            productInfoModel,
            tradingInfoModel,
            invoiceModelList,
            operationRecordModel
          } = result
          this.detail = result
          this.orderStatus = orderStatus
          this.orderType = orderType
          this.receiverModel = receiverModel
          this.logisticsInfoModel = logisticsInfoModel
          this.productInfoModel = productInfoModel
          this.tradingInfoModel = tradingInfoModel
          this.invoiceModelList = invoiceModelList
          this.operationRecordModel = operationRecordModel
          this.productInfoModel.totalCount = counter(productInfoModel.productDetailModels)('count')
          this.shippingAddress.realName = receiverModel.name
          this.shippingAddress.mobile = receiverModel.mobile
          this.shippingAddress.agencyAddress = receiverModel.address
          if (result.orderStatus === 'CLOSED') {
            if (checkIsRefundSuccessful(productInfoModel.productDetailModels)) {
              this.suggestionMap['CLOSED'] = '退款完成'
            }
          }
          // invoiceStatus 2 未开票， 3 已开票
          this.noInvoiceProList = productInfoModel.productDetailModels.filter(item => item.invoiceStatus === 2)

          let now = Moment((result.currentServerTime)).valueOf() // 服务器时间
          if (result.orderStatus === 'WAIT_PAY') {
            let startTime = Moment((tradingInfoModel.createTime)).valueOf()
            if (now - startTime < 24 * 60 * 60 * 1000) {
              this.countDown(24 * 60 * 60 * 1000 + startTime - now + 2000, 'WAIT_PAY')
            }
          } else if (result.orderStatus === 'WAIT_RECEIVE') {
            let startTime = Moment((tradingInfoModel.createTime)).valueOf()
            if (now - startTime < 24 * 60 * 60 * 1000) {
              this.countDown(10 * 24 * 60 * 60 * 1000 + startTime - now + 2000, 'WAIT_RECEIVE')
            }
          }
          resolve()
          this.loaded = true
        } catch (e) {
          reject(e)
        }
      })
    },
    async pay () {
      const { orderId } = this
      this.payloading = true
      this.currentPayId = orderId
      try {
        const { result } = await getAwaitPayInfo(orderId)
        // 调用微信支付api
        await wechatPay(result)
        this.$router.push({ name: 'PaySuccess', params: { orderId } })
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
        setTimeout(() => {
          this.$router.push({ name: 'OrderComplete', params: { orderId } })
        }, 2000)
      } catch (e) {
        throw e
      }
    },
    async cancelOrder (reason) {
      try {
        await this.$confirm('订单一旦取消，将无法恢复 确认要取消订单？')
        await cancelOrder(this.orderId)
        this.$success('订单取消成功')
        this.getDetail()
      } catch (e) {
        throw e
      }
    },
    async deleteOrder () {
      const { orderId } = this
      try {
        await this.$confirm('订单一旦删除，将无法恢复 确认要删除订单？')
        await deleteOrder(orderId)
        this.$success('订单删除成功')
        setTimeout(() => {
          this.$router.push({ name: 'Orders', params: { status: 'ALL_ORDER' } })
        }, 2000)
      } catch (e) {
        throw e
      }
    },
    // 倒计时
    countDown (remanent, flag) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        let { _data } = Moment.duration(remanent)
        let d = String(_data.days)
        let h = String(_data.hours)
        let m = String(_data.minutes)
        let s = String(_data.seconds)
        remanent -= 1000
        if (remanent <= 0) {
          this.suggestionMap[flag] = ''
          clearInterval(this.timer)
          this.suggestionMap.WAIT_PAY = ''
          this.suggestionMap.WAIT_RECEIVE = ''
          this.getDetail()
          return
        }
        if (flag === 'WAIT_RECEIVE') this.suggestionMap.WAIT_RECEIVE = `还剩${d}天${h.padStart(2, '0')}时${m.padStart(2, '0')}分${s.padStart(2, '0')}秒后自动收货`
        if (flag === 'WAIT_PAY') this.suggestionMap.WAIT_PAY = `还剩${h.padStart(2, '0')}小时${m.padStart(2, '0')}分${s.padStart(2, '0')}秒 订单自动关闭`
      }, 1000)
    },
    onPickerConfirm (selected) {
      this.cancelOrder(selected[0])
    },
    // 拨打客服电话
    call () {
      window.location.href = `tel://${this.supportPhone}`
    },
    // 申请发票
    applyInvoice () {
      localStorage.setItem('APPLY_INVOICE', JSON.stringify({ physicalProducts: this.noInvoiceProList }))
      localStorage.setItem('APPLY_INVOICE_FROM', JSON.stringify(this.$route))
      const { mobile, name } = this.receiverModel
      this.$router.push({
        name: 'ApplyInvoice',
        query: {
          orderId: this.orderId,
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
  // .call-me {
  //   position: absolute;
  //   top: -28px;
  //   right: 40px;
  //   width: 38px;
  //   height: 80px;
  // }
  .panel {
    background-color: #fff;
    border-radius: $--radius1;
    margin-bottom: 20px;
  }
  .other-info {
    position: relative;
    line-height: 34px;
    font-size: 24px;
    .info-top {
      padding: 24px 24px 16px;
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
    }
    .invoice-title {
      color: #666666;
    }
    .invoice-name {
      font-size: 28px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: #2E2E2E;
      line-height: 40px;
      margin-bottom: 12px;
    }
    .invoice-number {
      font-size: 24px;
      font-family: Helvetica;
      line-height: 28px;
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
    &:after {
      @include border-half-top(#e7e7e7)
    }
  }
  .explain-box {
    margin-top: 14px;
    margin-right: 24px;
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
    &:after {
      @include border-half-top(#e7e7e7);
    }
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
    > span {
      &:nth-of-type(1) {
        color: #999999;
        margin-right: 12px;
      }
      &:nth-last-of-type(1) {
        color: $--primary-color;
      }
    }
  }
  .buttons {
    position: relative;
    text-align: right;
    > button {
      margin-top: 0;
      margin-left: 24px;
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
    }
  }

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
    margin-top: 28px;
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
  }
  .skeleton4-2 {
    width: 214px;
    height: 32px;
    margin-top: 8px;
  }
  .skeleton4-4 {
    width: 112px;
    height: 37px;
    margin-top: 80px;
  }
  .skeleton4-5 {
    width: 300px;
    height: 40px;
    margin-top: 12px;
  }
  .skeleton4-6 {
    width: 150px;
    height: 37px;
    margin-top: 50px;
  }
  .skeleton4-7 {
    width: 250px;
    height: 37px;
    margin-top: 14px;
  }
  .skeleton4-8 {
    width: 350px;
    height: 40px;
    margin-top: 50px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
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
</style>
