<template>
  <div
    v-if="!loading"
    :class="$style.submitOrder"
  >
    <div
      :class="$style.address + ' radius-20'"
      v-if="physicalProducts.length > 0"
    >
      <AddressItem />
    </div>

    <div
      v-if="physicalProducts.length > 0"
      :class="$style.productBox"
    >
      <OrderItem
        v-for="(item, i) of physicalProducts"
        :key="i"
        :img="item.productImg"
        :name="item.productName"
        :count="item.count"
        :option="item.optionName"
        :price="item.price"
        is-submit
        :gap="32"
        :product-type="1"
        border
      />
      <div :class="$style.otherInfo">
        <div :class="$style.infoItem">
          <div
            :class="{
              [$style.freightType]: true,
              [$style.hasFreight]: freight > 0
            }"
          >
            <span :class="$style.itemLabel">配送方式</span>
            <span
              v-if="freight === 0"
              :class="$style.itemContent"
            >
              快递免邮
            </span>
            <span
              v-if="freight > 0"
              :class="$style.itemContent"
            >
              普通快递
            </span>
          </div>
          <span
            v-if="freight > 0"
            :class="$style.freight"
          >
            ¥ {{ freight }}
          </span>
        </div>
        <div :class="$style.infoItem">
          <div :class="$style.freightType">
            <span :class="$style.itemLabel">订单备注</span>
            <input
              :class="$style.remark"
              type="text"
              placeholder="选填"
              v-model="remark"
            >
          </div>
        </div>
      </div>

      <div :class="$style.subtotal">
        <span>小计：</span>
        <span :class="$style.subtotalPrice">￥{{ amount }}</span>
      </div>
    </div>

    <template v-if="virtualProducts.length > 0">
      <div
        v-for="(item, i) of virtualProducts"
        :key="i"
        :class="$style.productBox"
      >
        <OrderItem
          :key="i"
          :img="item.productImg"
          :name="item.productName"
          :count="item.count"
          :option="item.optionName"
          :price="item.price"
          is-submit
          :gap="32"
          :product-type="2"
          border
        />
        <div :class="$style.otherInfo">
          <div :class="$style.infoItem">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">订单备注</span>
              <input
                :class="$style.remark"
                type="text"
                placeholder="选填"
                v-model="item.remark"
              >
            </div>
          </div>
        </div>

        <div :class="$style.subtotal">
          <span>小计：</span>
          <span :class="$style.subtotalPrice">￥{{ item.amount }}</span>
        </div>
      </div>
    </template>

    <div :class="$style.confirm">
      <div>
        <span class="fz-20 gray-2">合计</span>
        <span
          class="rmb fz-32"
          v-text="totalAmount || 0"
        />
      </div>
      <pl-button
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
      :class="$style.invioce"
      @click="selectInvoice"
    >
      <div>
        <pl-svg
          :class="$style.invioceIcon"
          name="invoice"
        />
        发票
      </div>
      <div style="color: #666;">
        {{ invioceType === 1 ? '不需要' : '纸质发票' }}
        <pl-svg
          :class="$style.rightIcon"
          name="right"
          color="#ccc"
        />
      </div>
    </div>

    <pl-popup :show.sync="showPopup">
      <div :class="$style.invioceBox">
        <div :class="$style.title">
          是否需要发票？
        </div>
        <div :class="$style.content">
          <button @click="noNeed">
            不需要
          </button>
          <button
            @click="need"
            v-if="physicalProducts.length > 0"
          >
            纸质发票
          </button>
        </div>
      </div>
    </pl-popup>
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
import AddressItem from '../../components/item/Address-Item.vue'
import OrderItem from '../../components/item/Order-Item.vue'
import {
  confirmCart,
  submitOrder
} from '../../apis/shopping-cart'
import wechatPay from '../../assets/js/wechat/wechat-pay'
import { mapGetters } from 'vuex'
import OrderItemSkeleton from '../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../components/skeleton/Address-Item.vue'
export default {
  name: 'SubmitOrder',
  components: {
    AddressItem,
    OrderItem,
    OrderItemSkeleton,
    AddressItemSkeleton
  },
  data () {
    return {
      showPopup: false,
      submiting: false,
      loading: false,
      freight: 0,
      totalAmount: 0,
      amount: 0,
      physicalProducts: [],
      virtualProducts: [],
      remark: '', // 物理订单备注
      invioceType: 1,
      INVOICE_MODEL: null
    }
  },
  props: {
    productSeq: {
      type: String,
      default: ''
    },
    count: {
      type: [Number, String],
      default: 1
    },
    optionCode: {
      type: String,
      default: ''
    },
    brokerId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['selectedAddress', 'openId', 'mobile', 'addressList'])
  },
  activated () {
    this.INVOICE_MODEL = JSON.parse(localStorage.getItem('INVOICE_MODEL'))
    this.invioceType = this.INVOICE_MODEL ? 2 : 1
    this.getProductDetail()
  },
  methods: {
    selectInvoice () {
      if (!this.selectedAddress.realName) {
        this.$warning('请先选择收货地址')
        return
      }
      this.showPopup = true
    },
    async getProductDetail () {
      const proList = JSON.parse(localStorage.getItem('CONFIRM_LIST'))
      if (!proList) {
        return this.$router.replace({ name: 'Home' })
      }
      this.loading = true
      try {
        // 获取订单详细数据
        const { result } = await confirmCart({
          cartProducts: proList,
          addressSeq: this.selectedAddress.sequenceNbr
        })
        const { amount, totalAmount, freight, physicalProducts, virtualProducts } = result
        // 为每个虚拟订单都添加备注字段
        for (const p of physicalProducts) {
          p.remark = ''
        }
        this.amount = amount
        this.totalAmount = totalAmount
        this.freight = Number(freight)
        this.physicalProducts = physicalProducts
        this.virtualProducts = virtualProducts
        this.loading = false
      } catch (e) {
        throw e
      }
    },
    // 提交订单
    async submitOrder () {
      const cartProducts = []
      if (this.physicalProducts.length > 0 && this.addressList <= 0) {
        this.$confirm('您还没有收货地址，请先添加收货地址')
        return
      }
      this.submiting = true
      for (const item of this.physicalProducts) {
        const { productId, optionCode, count, agentUser } = item
        cartProducts.push({
          productId,
          optionCode,
          productType: 'PHYSICAL_GOODS',
          count,
          agentUser,
          message: this.remark
        })
      }
      for (const item of this.virtualProducts) {
        const { productId, optionCode, count, remark, agentUser } = item
        cartProducts.push({
          productId,
          optionCode,
          productType: 'VIRTUAL_GOODS',
          count,
          agentUser,
          message: remark
        })
      }
      try {
        const { result } = await submitOrder({
          addressSeq: this.selectedAddress.sequenceNbr,
          cartProducts,
          invoiceModel: this.INVOICE_MODEL
        })
        await this.pay(result, result.orderLists[0])
      } catch (e) {
        throw e
      } finally {
        this.submiting = false
      }
    },
    async pay (CREDENTIAL, orderId) {
      return new Promise(async (resolve, reject) => {
        try {
          await wechatPay(CREDENTIAL)
          this.submiting = false
          this.$router.replace({ name: 'PaySuccess', params: { orderId } })
          localStorage.removeItem('INVOICE_MODEL')
          localStorage.removeItem('CONFIRM_LIST')
          resolve()
        } catch (e) {
          // 支付失败
          this.submiting = false
          if (this.virtualProducts.length > 0 && this.physicalProducts.length > 0) {
            this.$router.replace({ name: 'Orders', params: { status: 'WAIT_PAY' } })
          } else {
            // 只有一种商品时，直接进入详情页
            this.$router.replace({ name: 'OrderDetail', params: { orderId } })
          }
          localStorage.removeItem('INVOICE_MODEL')
          localStorage.removeItem('CONFIRM_LIST')
          reject(e)
        }
      })
    },
    noNeed () {
      this.invioceType = 1
      this.showPopup = false
      localStorage.removeItem('INVOICE_MODEL')
    },
    // 需要发票
    need () {
      const applyInvoice = {
        physicalProducts: this.physicalProducts
      }
      localStorage.setItem('APPLY_INVOICE', JSON.stringify(applyInvoice))
      localStorage.setItem('APPLY_INVOICE_FROM', JSON.stringify(this.$route))
      this.$router.push({ name: 'ApplyInvoice' })
      this.invioceType = 2
      this.showPopup = false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'ApplyInvoice' && to.name !== 'Address' && to.name !== 'AddAddress') {
      localStorage.removeItem('INVOICE_MODEL')
      localStorage.removeItem('CONFIRM_LIST')
      localStorage.removeItem('APPLY_INVOICE')
    }
    next()
  }
}
</script>

<style module lang="scss">
  .submitOrder {
    padding: 20px 24px 120px;
  }
  .productBox {
    width: 100%;
    margin: 0 0 20px 0;
    padding: 32px 24px 24px 24px;
    border-radius: $--radius1;
    background-color: #fff;
    box-sizing: border-box;
  }

  .otherInfo {
    margin-top: 44px;
    padding-left: 68px;
    > .infoItem {
      display: flex;
      justify-content: space-between;
      margin-bottom: 54px;
      font-size: 24px;
      .freightType {
        flex: 1;
        display: inline-flex;
        justify-content: space-between;
        &.hasFreight{
          justify-content: flex-start;
        }
        .itemLabel {
          width: max-content;
          color: #333;
        }
        .itemContent {
          color: #666;
          margin-left: 24px;
        }
      }
      .freight {
        text-align: right;
      }
      .remark {
        flex: 1;
        height: 100%;
        padding: 0;
        margin-left: 22px;
        font-size: 24px;
      }
    }
  }
  .subtotal {
    font-size: 30px;
    font-weight: bold;
    text-align: right;
    > .subtotalPrice {
      color: #FE7700;
    }
  }
  .address {
    margin-bottom: 28px;
    background-color: #fff;
  }
  .product, .remark {
    padding: 24px 28px 18px;
    background-color: #fff;
  }
  .orderTop {
    position: relative;
    font-size: 28px;
    font-weight: bold;
    padding-bottom: 22px;
    margin-bottom: 30px;
    &:after {
      @include border-half-bottom(#e7e7e7)
    }
  }
  .money {
    position: relative;
    padding: 22px 0;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
    > p {
      display: flex;
      justify-content: space-between;
      line-height: 52px;
      &:nth-of-type(2) > span:nth-of-type(2) {
        color: $--primary-color;
      }
    }
  }
  .invioce {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height:70px;
    padding: 0 28px;
    border-radius: $--radius1;
    background-color: #fff;
    > div {
      display: inline-flex;
      align-items: center;
      font-size: 26px;
    }
  }
  .invioceIcon {
    width: 26px;
    margin-right: 20px;
  }
  .rightIcon {
    width: 20px;
    margin-left: 20px;
  }
  .invioceBox {
    .title {
      position: relative;
      height: 114px;
      line-height: 114px;
      font-size: 36px;
      padding: 0 40px;
      &:after {
        @include border-half-bottom(#e7e7e7)
      }
    }
    .content {
      padding: 62px 40px;
      > button {
        width: 100%;
        height: 88px;
        margin-bottom: 28px;
        font-size: 32px;
        color: #387AF6;
        font-weight: 500;
        background-color: #F1F0F7;
        border-radius: $--radius2;
      }
    }
  }

  .total-money {
    line-height: 66px;
    text-align: right;
    > span:nth-of-type(2) {
      color: $--primary-color;
    }
  }
  .confirm {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 40px 0 30px;
    height: 110px;
    background-color: #fff;
    box-sizing: border-box;
    > div {
      display: flex;
      flex-direction: column;
      padding-right: 20px;
      min-width: 200px;
    }
    > button {
      flex: 1;
    }
  }

  .skeleton {
    padding: 20px 40px;
  }
  .skeleton1 {
    background-color: #fff;
  }
  .skeleton2 {
    margin-top: 28px;
    padding: 20px 28px;
    background-color: #fff;
  }
  .skeleton2-1 {
    width: 112px;
    height: 37px;
  }
  .skeleton2-2 {
    width: 122px;
    height: 37px;
    margin-top: 23px;
  }
  .skeleton2-3 {
    width: 112px;
    height: 37px;
    margin-top: 13px;
  }
  .skeleton2-4 {
    width: 150px;
    height: 37px;
    margin-top: 28px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
</style>
