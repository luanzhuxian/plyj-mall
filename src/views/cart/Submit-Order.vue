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
        :img="item.productImageUrls ? item.productImageUrls[0] : ''"
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
          <div :class="$style.freightType">
            <span :class="$style.itemLabel">配送方式</span>
            <span
              v-if="freight === 0"
              :class="$style.itemContent"
            >快递免邮</span>
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
          :img="item.productImageUrls ? item.productImageUrls[0] : ''"
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
        <span class="fz-20 gray-2">实际支付</span>
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
      :class="$style.invioce"
      @click="showPopup = true"
    >
      <div>
        <pl-svg
          :class="$style.invioceIcon"
          name="invoice"
        />
        发票
      </div>
      <div style="color: #666;">
        {{ invioceType }}
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
          <button @click="need">
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
// import { getOpenIdByCode } from '../../apis/base-api'
// import { getProductDetail } from '../../apis/product'
import wechatPay from '../../assets/js/wechat/wechat-pay'
// import { setSession } from '../../assets/js/util'
import { mapGetters } from 'vuex'
import OrderItemSkeleton from '../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../components/skeleton/Address-Item.vue'
// import Qs from 'qs'
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
      showPopup: true,
      submiting: false,
      loading: false,
      freight: 0,
      totalAmount: 0,
      amount: 0,
      physicalProducts: [],
      virtualProducts: [],
      remark: '', // 物理订单备注
      invioceType: '不需要'
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
    ...mapGetters(['selectedAddress', 'openId', 'mobile'])
  },
  watch: {
    selectedAddress () {}
  },
  activated () {
    this.getProductDetail()
  },
  deactivated () {
    // localStorage.removeItem('confirmList')
  },
  methods: {
    async getProductDetail () {
      const proList = JSON.parse(localStorage.getItem('confirmList'))
      this.loading = true
      try {
        const { result } = await confirmCart({ cartProducts: proList })
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
      // try {
      //   let { productSeq, count, optionCode, brokerId = '' } = this
      //   this.disableSubmit = true
      //   this.loading = true
      //   let productDetail = await getProductDetail(this.productSeq)
      //   let { supplierProduct, productType, priceModels } = productDetail.result
      //   this.detail = productDetail.result
      //   this.form.supplierOrder = this.supplierProduct = supplierProduct
      //   this.form.orderType = this.productType = productType
      //   this.form.addressSeq = productType === 'PHYSICAL_GOODS' ? (this.selectedAddress.sequenceNbr || '') : ''
      //   this.loading = false
      //   this.form.share = brokerId
      //   this.form.products[0] = {
      //     optionCode: optionCode,
      //     productCount: count,
      //     productSeq: productSeq
      //   }
      //   this.getOption(priceModels)
      //
      //   // 算钱
      //   let { result } = await getMoney(productSeq, optionCode, count, this.form.addressSeq)
      //   this.form.amount = this.totalMoney = result
      //
      //   // 获取运费
      //   await this.getFreight()
      //   this.disableSubmit = false
      // } catch (e) {
      //   this.disableSubmit = false
      //   if (/库存不足/.test(e.message)) {
      //     this.disableSubmit = true
      //   } else {
      //     this.$router.replace({ name: 'SoldOut' })
      //   }
      //   throw e
      // } finally {
      //   this.loading = false
      // }
    },
    /* 获取规格 */
    getOption (options) {
      this.option = options.filter(item => item.optionCode === this.optionCode)[0] || {}
    },
    // 提交订单
    async submitOrder () {
      this.submiting = true
      const cartProducts = []
      for (const item of this.physicalProducts) {
        const { productId, optionCode, count } = item
        cartProducts.push({
          productId,
          optionCode,
          productType: 'PHYSICAL_GOODS',
          count,
          message: this.remark
        })
      }
      for (const item of this.virtualProducts) {
        const { productId, optionCode, count, remark } = item
        cartProducts.push({
          productId,
          optionCode,
          productType: 'VIRTUAL_GOODS',
          count,
          message: remark
        })
      }
      try {
        const { result } = await submitOrder({ addressSeq: this.selectedAddress.sequenceNbr, cartProducts })
        await this.pay(result)
      } catch (e) {
        throw e
      } finally {
        this.submiting = false
      }
      /* let { name, params, query } = this.$route
      if (!this.mobile) {
        this.$confirm('您还没有绑定手机，请先绑定手机')
          .then(() => {
            this.$router.push({ name: 'BindMobile' })
            setSession('willBind', { name, params, query })
          })
        return
      }
      try {
        if (this.productType === 'PHYSICAL_GOODS' && !this.form.addressSeq) {
          /!* 提醒选择地址 *!/
          await this.$confirm('您还没有收货地址，请先添加收货地址')
          setSession('addressReturn', {
            name,
            params,
            query
          })
          this.$router.push({ name: 'AddAddress' })
          return
        }
        // 走供应商商品支付流程
        if (this.supplierProduct) {
          return this.supplierPay()
        }
        this.submiting = true
        let { result } = await this.typeMap[this.productType](this.form)
        await this.pay(result.CREDENTIAL, result.orderModel.orderSn)
      } catch (e) {
        this.submiting = false
        throw e
      } */
    },
    // 获取商品运费
    /* getFreight () {
      if (!this.selectedAddress || !this.selectedAddress.sequenceNbr) return
      return new Promise(async (resolve, reject) => {
        try {
          let { result } = await getFreight({
            productSeq: this.productSeq,
            productCount: this.count,
            addressSeq: this.selectedAddress.sequenceNbr,
            optionCode: this.optionCode
          })
          if (this.supplierProduct) {
            this.freight = result.sixEnergyNewOrderReturnModel.freight
            this.totalMoney = (this.totalMoney * 100 + this.freight * 100) / 100
            delete this.form.freight
          } else {
            this.form.freight = result.freight
            this.totalMoney = (this.totalMoney * 100 + this.form.freight * 100) / 100
          }
          // 添加六能运费数据到表单
          this.form.sixEnergyNewOrderReturnModel = result.sixEnergyNewOrderReturnModel
          if (!result.sixEnergyNewOrderReturnModel) {
            delete this.form.sixEnergyNewOrderReturnModel
          }
          this.form.orderSn = result.orderSn // 添加运费订单数据到表单
          this.form.billNo = result.billNo // 添加运费订单数据到表单
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    },
    async supplierPay () {
      let code = Qs.parse(location.search.substring(1)).code
      try {
        this.submiting = true
        let { result } = await getOpenIdByCode(code)
        let payData = await this.typeMap[this.productType](this.form, result)
        await this.pay(payData.result.CREDENTIAL, payData.result.orderModel.orderSn)
        delete this.form.sixEnergyNewOrderReturnModel
        delete this.form.orderSn
        delete this.form.billNo
      } catch (e) {
        this.submiting = false
        delete this.form.sixEnergyNewOrderReturnModel
        delete this.form.orderSn
        delete this.form.billNo
        this.$router.replace({ name: 'Lesson', params: { productSeq: this.productSeq } })
        throw e
      }
    }, */
    async pay (CREDENTIAL, orderSn) {
      CREDENTIAL.packageValue = CREDENTIAL.package
      return new Promise(async (resolve, reject) => {
        try {
          await wechatPay(CREDENTIAL)
          this.submiting = false
          this.$router.replace({ name: 'PaySuccess', params: { orderId: orderSn } })
          resolve()
        } catch (e) {
          this.submiting = false
          this.$router.replace({ name: 'Orders', params: { status: 'WAIT_PAY' } })

          // if (this.supplierProduct) { // 支付失败时，如果是供应商商品，则取消订单，并跳回商品详情
          //   try {
          //     await this.typeMapOfCancel[this.productType](orderSn)
          //     this.$router.replace({ name: 'Lesson', params: { productSeq: this.productSeq } })
          //   } catch (e) {
          //     reject(e)
          //   }
          // } else { // 待付款
          //   this.$router.replace({ name: 'Orders', params: { status: 'WAIT_PAY' } })
          // }
          reject(e)
        }
      })
    },
    // 需要发票
    noNeed () {
      this.invioceType = '不需要'
      this.showPopup = false
    },
    need () {
      this.$router.push({ name: 'ApplyInvoice' })
      this.invioceType = '纸质发票'
    }
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
      }
      .freight {
        flex: 1.7;
        text-align: right;
      }
      .itemLabel {
        color: #333;
      }
      .itemContent {
        color: #666;
      }
      .remark {
        flex: 1;
        height: 100%;
        padding: 0 0 0 22px;
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
