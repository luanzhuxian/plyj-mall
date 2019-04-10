<template>
  <div :class="$style.orderDetail">
    <div :class="$style.top">
      <!-- 已完成 本次交易已完成，感谢下次光临 -->
      <!-- 待付款 等待买家付款… -->
      <!-- 待收货 还剩14天24时后自动确认… -->
      <top-text
        :title="orderStatusMap[orderInfoModel.orderStatus]"
        :tip="tips[orderInfoModel.orderStatus]"
      />
      <a :href="`tel:${supportPhone}`">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
      </a>
    </div>

    <div :class="$style.receivingInfo">
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <express-item
          v-if="orderExpressInfoModel"
          :express-name="orderExpressInfoModel.courierCompany"
          :express-number="orderExpressInfoModel.courierNo"
        />
      </transition>
      <address-item
        v-if="address.realName"
        :address="address"
      />
    </div>

    <div :class="$style.detail">
      <div :class="'fz-24 '+$style.createTime">
        <pl-list
          title="下单时间："
          :content="orderInfoModel.createTime"
        />
        <pl-list
          title="订单编号："
          :content="orderInfoModel.orderSn"
        />
      </div>

      <div
        :class="$style.orderInfo"
        v-for="item of relationModel"
        :key="item.productModel.contentId"
      >
        <order-item
          :img="item.mediaInfoModels[0].mediaUrl"
          :name="item.productModel.productName"
          :count="item.orderProductRelationModel.count"
          :option="item.orderProductRelationModel.optionName"
          :price="item.orderProductRelationModel.productPrice"
          route-name="Lesson"
          :product-seq="item.orderProductRelationModel.productSeq"
        />

        <pl-button
          v-if="canIApplyService && !supplierOrder"
          plain
          round
          @click="$router.push({ name: 'RefundApply', params: { orderId } })"
        >
          申请售后
        </pl-button>

        <div
          :class="$style.explain"
          v-if="item.productModel.productType === 'VIRTUAL_GOODS'"
        >
          <ModuleTitle title="使用说明" />
          <div
            :class="$style.explainBox + ' fz-26 gray-2'"
            v-text="item.productModel.productUseMethod"
          />
        </div>
      </div>

      <div :class="$style.productMoney + ' fz-28 gray-3'">
        <p>
          <span>商品金额</span>
          <span
            class="rmb"
            v-text="orderInfoModel.productAmount"
          />
        </p>
        <p>
          <span>运费（快递）</span>
          <span
            class="rmb"
            v-text="orderInfoModel.freight"
          />
        </p>
      </div>

      <div :class="$style.truthMoney">
        <p class="fz-30">
          实际支付：
        </p>
        <p
          class="fz-30 rmb"
          v-text="orderInfoModel.amount + orderInfoModel.freight"
        />
      </div>

      <div
        :class="$style.buttons"
        v-if="orderInfoModel.orderStatus !== 'CLOSED' && orderInfoModel.orderStatus !== 'FINISHED'"
      >
        <pl-button
          round
          plain
          @click="cancel"
          v-if="orderInfoModel.orderStatus === 'WAIT_PAY'"
        >
          取消订单
        </pl-button>
        <pl-button
          round
          plain
          type="warning"
          v-if="orderInfoModel.assessment === 'NO' && orderInfoModel.orderStatus === 'FINISHED'"
          @click="$router.push({ name: 'CommentOrder', params: { orderId } })"
        >
          去评价
        </pl-button>
        <pl-button
          round
          type="warning"
          v-if="orderInfoModel.orderStatus === 'WAIT_RECEIVE'"
          @click="confirmGet(orderInfoModel.orderType)"
        >
          确认收货
        </pl-button>
        <pl-button
          v-if="orderInfoModel.orderStatus === 'FINISHED' && !orderInvoiceModel && !supplierOrder"
          plain
          round
          @click="$router.push({ name: 'Invoice', params: { orderId } })"
        >
          申请发票
        </pl-button>
        <pl-button
          v-if="orderInvoiceModel && !supplierOrder"
          plain
          round
          @click="$router.push({ name: 'InvoiceDetail', params: { orderId } })"
        >
          查看发票
        </pl-button>
      </div>
    </div>

    <div :class="$style.remark + ' radius-20 mt-28'">
      <div :class="$style.remarkTop">
        <span>订单备注（选填）</span>
        <pl-svg :class="$style.remarkIcon" name="warning"></pl-svg>
      </div>
      <div :class="$style.remarkContent">
        123
      </div>
    </div>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import ModuleTitle from '../../../components/Module-Title.vue'
import ExpressItem from '../../../components/item/Express-Item.vue'
import AddressItem from '../../../components/Address-Item.vue'
import {
  getOrderDetail,
  physicalOrderCancellation,
  virtualOrderCancellation,
  physicalorderReceiving,
  physicalorderReceivingForVirtual
} from '../../../apis/order-manager'
import { copyFields } from '../../../assets/js/util'
import { mapGetters } from 'vuex'
import Moment from 'moment'

export default {
  name: 'OrderDetail',
  components: {
    TopText,
    OrderItem,
    ModuleTitle,
    ExpressItem,
    AddressItem
  },
  data () {
    return {
      detail: {},
      supplierOrder: true, // 是否是供应商订单
      address: {
        realName: ' ',
        mobile: ' ',
        addressPrefix: ' ',
        agencyAddress: ' '
      },
      supportPhone: '',
      tips: {
        WAIT_PAY: '',
        WAIT_SHIP: '',
        WAIT_RECEIVE: ''
      },
      cancelFnMap: {
        PHYSICAL_GOODS: physicalOrderCancellation,
        VIRTUAL_GOODS: virtualOrderCancellation
      },
      orderInfoModel: {},
      orderDetailModel: {},
      relationModel: [],
      orderExpressInfoModel: null,
      orderInvoiceModel: null,
      currentStatus: '',
      orderType: '',
      timer: 0
    }
  },
  props: ['orderId'],
  computed: {
    ...mapGetters(['orderStatusMap']),
    // 是否可以申请售后
    canIApplyService: function () {
      return (this.currentStatus === 'FINISHED' || this.currentStatus === 'WAIT_RECEIVE' || this.currentStatus === 'WAIT_SHIP') && this.orderType !== 'VIRTUAL_GOODS'
    }
  },
  activated () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      clearInterval(this.timer)
      let { result } = await getOrderDetail(this.orderId)
      let { orderInfoModel, orderDetailModel, relationModel, supportPhone, orderExpressInfoModel, orderInvoiceModel, supplierOrder } = result
      this.detail = result
      this.supplierOrder = supplierOrder
      this.orderInfoModel = orderInfoModel
      this.orderDetailModel = orderDetailModel
      this.relationModel = relationModel
      this.orderInvoiceModel = orderInvoiceModel
      this.orderExpressInfoModel = orderExpressInfoModel && orderExpressInfoModel.filter(val => {
        return val.orderStatus === 'WAIT_RECEIVE'
      })[0]

      this.currentStatus = orderInfoModel.orderStatus
      this.supportPhone = supportPhone
      this.orderType = orderInfoModel.orderType

      copyFields(this.address, result.orderDetailModel)

      let now = Number(result.currentServerTime) // 服务器时间
      if (orderInfoModel.orderStatus === 'WAIT_PAY') {
        let startTime = Moment((this.orderInfoModel.createTime)).valueOf()
        this.countDown(24 * 60 * 60 * 1000 - now + startTime + 2000, 'WAIT_PAY')
      } else if (orderInfoModel.orderStatus === 'WAIT_RECEIVE') {
        let startTime = Number(result.sendTime)
        this.countDown(10 * 24 * 60 * 60 * 1000 - now + startTime + 2000, 'WAIT_RECEIVE')
      }
    },
    // 确定收货
    async confirmGet (orderType) {
      try {
        await this.$confirm('您确定收货吗？')
        if (orderType === 'PHYSICAL_GOODS') {
          await physicalorderReceiving(this.orderId)
        } else {
          await physicalorderReceivingForVirtual(this.orderId)
        }
        // 跳转至待评价
        this.$router.push({ name: 'waitComment' })
      } catch (e) {
        throw e
      }
    },
    async cancel () {
      try {
        await this.$confirm('您确定取消订单吗？')
        await this.cancelFnMap[this.orderType](this.orderId)
        this.getDetail()
      } catch (e) {
        throw e
      }
    },
    // 倒计时
    countDown (remanent, flag) {
      this.timer = setInterval(() => {
        let { _data } = Moment.duration(remanent)
        let d = String(_data.days)
        let h = String(_data.hours)
        let m = String(_data.minutes)
        let s = String(_data.seconds)
        remanent -= 1000
        if (remanent <= 0) {
          this.tips[flag] = ''
          clearInterval(this.timer)
          this.tips.WAIT_PAY = ''
          this.tips.WAIT_RECEIVE = ''
          // this.getDetail()
          return
        }
        if (flag === 'WAIT_RECEIVE') this.tips.WAIT_RECEIVE = `还剩${d}天${h.padStart(2, '0')}时${m.padStart(2, '0')}分${s.padStart(2, '0')}秒后自动收货`
        if (flag === 'WAIT_PAY') this.tips.WAIT_PAY = `还剩${h.padStart(2, '0')}小时${m.padStart(2, '0')}分${s.padStart(2, '0')}秒后自动取消`
      }, 1000)
    }
  }
}
</script>

<style module lang="scss">
  .order-detail {
    padding: 28px 40px;
  }
  .top {
    position: relative;
  }
  .call-me {
    position: absolute;
    top: -28px;
    right: 40px;
    width: 38px;
    height: 80px;
  }
  .receiving-info {
    margin-top: 28px;
    background-color: #fff;
    border-radius: $--radius1;
  }
  .detail {
    margin-top: 28px;
    padding: 24px 0;
    border-radius: $--radius1;
    background-color: #fff;
    .create-time {
      position: relative;
      margin-left: 28px;
      padding-bottom: 24px;
      line-height: 38px;
      &:after {
        @include border-half-bottom(#e7e7e7);
      }
    }
  }
  .order-info {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 32px 0 32px 28px;
    min-height: 140px;
    button {
      margin-top: 28px;
    }
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
  }
  .explain {
    width: 100%;
    position: relative;
    margin-top: 32px;
    margin-left: 28px;
    padding-top: 20px;
    &:after {
      @include border-half-top(#e7e7e7)
    }
  }
  .explain-box {
    margin-top: 16px;
    margin-right: 28px;
    padding: 24px 30px;
    background-color: #f3f3f3;
    border-radius: $--radius2;
  }
  .product-money {
    margin-left: 28px;
    position: relative;
    padding: 8px 28px 8px 0;
    line-height: 50px;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
    p {
      display: flex;
      justify-content: space-between;
    }
  }
  .truth-money {
    position: relative;
    display: flex;
    margin-left: 28px;
    padding-right: 28px;
    justify-content: space-between;
    align-items: center;
    height: 76px;
    > p:nth-of-type(2) {
      color: $--primary-color;
    }
  }
  .buttons {
    position: relative;
    padding: 0 28px 0 28px;
    text-align: right;
    > button {
      margin-top: 24px;
      margin-left: 20px;
    }
    &:before {
      @include border-half-bottom(#e7e7e7);
    }
  }

  .remark {
    padding: 24px 28px 18px;
    background-color: #fff;
  }
  .remarkTop {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28px;
    font-weight: bold;
    padding-bottom: 22px;
    &:after {
      @include border-half-bottom(#e7e7e7)
    }
  }
  .remarkIcon {
    width: 28px;
  }
  .remarkContent {
    padding: 20px 0;
    font-size: 26px;
    color: #666;
  }
</style>
