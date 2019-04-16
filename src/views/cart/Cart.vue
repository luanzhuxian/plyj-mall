<template>
  <div :class="$style.cart">
    <div
      :class="$style.address + ' radius-20'"
      v-if="this.productType === 'PHYSICAL_GOODS'"
    >
      <AddressItem />
    </div>

    <div :class="$style.product + ' radius-20'">
      <div :class="$style.orderTop">
        订单信息
      </div>
      <OrderItem
        :img="detail.productImage ? detail.productImage[0].mediaUrl : ''"
        :name="detail.productName"
        :count="count"
        :option="option.optionName"
        :price="option.price"
        border
      />
      <div :class="$style.money">
        <p class="fz-28">
          <span>商品金额</span>
          <span
            class="rmb"
            v-text="form.amount"
          />
        </p>
        <p class="fz-28">
          <span>快递</span>
          <span class="rmb">
            <i
              v-if="supplierProduct && sixEnergyNewOrderReturnModel"
              v-text="sixEnergyNewOrderReturnModel.freight"
            />
            <i v-else>0</i>
          </span>
        </p>
      </div>
    </div>

    <div :class="$style.remark + ' radius-20 mt-28'">
      <div :class="$style.orderTop">
        订单备注（选填）
      </div>
      <div style="background-color: #F3F3F3;">
        <pl-input
          v-model="form.orderPostscript"
          placeholder="选填，请填写订单备注信息，并与商家协商一致"
          type="textarea"
        />
      </div>
    </div>

    <div :class="$style.confirm">
      <div>
        <span class="fz-20 gray-2">实际支付</span>
        <span
          class="rmb fz-32"
          v-text="totalMoney || 0"
        />
      </div>
      <pl-button
        :disabled="disableSubmit"
        :loading="loading"
        type="warning"
        size="large"
        @click="submitOrder"
      >
        确认付款
      </pl-button>
    </div>
  </div>
</template>

<script>
import AddressItem from '../../components/Address-Item.vue'
import OrderItem from '../../components/item/Order-Item.vue'
import {
  submitPhysicalOrder,
  submitVirtualOrder,
  getMoney,
  physicalOrderCancellation,
  virtualOrderCancellation,
  getFreightOfSupplier
} from '../../apis/order-manager'
import { getOpenIdByCode } from '../../apis/base-api'
import { getProductDetail } from '../../apis/product'
import wechatPay from '../../assets/js/wechat/wechat-pay'
import { setSession } from '../../assets/js/util'
import { mapGetters } from 'vuex'
import Qs from 'qs'
export default {
  name: 'Cart',
  components: {
    AddressItem,
    OrderItem
  },
  data () {
    return {
      disableSubmit: false, // 临时禁用提交按钮，尤其在供应商商品支付时，来回跳转的过程中有效，防止支付数据未拿到时用户点击提交按钮
      loading: false,
      detail: {},
      option: {},
      totalMoney: 0,
      productType: '',
      typeMap: {
        PHYSICAL_GOODS: submitPhysicalOrder,
        VIRTUAL_GOODS: submitVirtualOrder
      },
      typeMapOfCancel: {
        PHYSICAL_GOODS: physicalOrderCancellation,
        VIRTUAL_GOODS: virtualOrderCancellation
      },
      form: {
        agencyCode: '',
        addressSeq: '',
        mallSeq: '',
        share: '', // 根据此商品是不是经纪人分享的,来判断是否需要传此参数
        amount: '', // 总价
        products: [
          {
            optionCode: '',
            productCount: '',
            productSeq: ''
          }
        ],
        source: 'PUBLIC',
        orderType: '',
        supplierOrder: false,
        orderPostscript: '' // 备注
      },
      supplierProduct: false,
      sixEnergyNewOrderReturnModel: null
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
    ...mapGetters(['agencyCode', 'mallSeq', 'selectedAddress', 'openId', 'mobile'])
  },
  watch: {
    selectedAddress () {}
  },
  async activated () {
    let { productSeq, count, optionCode, brokerId = '' } = this

    let { result } = await getMoney(productSeq, optionCode, count)
    this.form.amount = this.totalMoney = result
    this.form.agencyCode = this.agencyCode
    this.form.mallSeq = this.mallSeq
    this.form.share = brokerId
    this.form.products[0] = {
      optionCode: optionCode,
      productCount: count,
      productSeq: productSeq
    }
    this.getProductDetail()
  },
  methods: {
    async getProductDetail () {
      try {
        this.disableSubmit = true
        let { result } = await getProductDetail(this.productSeq)
        this.detail = result
        this.form.supplierOrder = this.supplierProduct = result.supplierProduct
        this.form.orderType = this.productType = result.productType
        this.form.addressSeq = result.productType === 'PHYSICAL_GOODS' ? (this.selectedAddress.sequenceNbr || '') : ''
        this.getOption(result.priceModels)

        // 供应商获取运费, 如果出错，返回商品详情
        if (this.supplierProduct) {
          try {
            await this.getFreightOfSupplier()
          } catch (e) {
            if (/库存不足/.test(e.message)) {
              this.disableSubmit = true
              return
            } else {
              this.$router.replace({ name: 'SoldOut' })
            }
          }
        }
        this.disableSubmit = false
      } catch (e) {
        this.disableSubmit = false
        throw e
      }
    },
    /* 获取规格 */
    getOption (options) {
      this.option = options.filter(item => item.optionCode === this.optionCode)[0] || {}
    },
    async submitOrder () {
      let { name, params, query } = this.$route
      if (!this.mobile) {
        await this.$confirm('您还没有绑定手机，请先绑定手机号')
        this.$router.push({ name: 'BindMobile' })
        setSession('willBind', { name, params, query })
        return
      }
      try {
        if (this.productType === 'PHYSICAL_GOODS' && !this.form.addressSeq) {
          /* 提醒选择地址 */
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
        this.loading = true
        let { result } = await this.typeMap[this.productType](this.form)
        await this.pay(result.CREDENTIAL)
      } catch (e) {
        this.loading = false
        throw e
      }
    },
    // 获取供应商商品运费
    getFreightOfSupplier () {
      if (!this.selectedAddress || !this.selectedAddress.sequenceNbr) return
      return new Promise(async (resolve, reject) => {
        try {
          let { result } = await getFreightOfSupplier({
            productSeq: this.productSeq,
            productCount: this.count,
            addressSeq: this.selectedAddress.sequenceNbr,
            mallSeq: this.mallSeq,
            optionCode: this.optionCode
          })
          this.sixEnergyNewOrderReturnModel = result.sixEnergyNewOrderReturnModel
          // 先乘后加再除以，防止出现浮点数精度问题
          this.totalMoney = (this.totalMoney * 100 + this.sixEnergyNewOrderReturnModel.freight * 100) / 100
          this.form.sixEnergyNewOrderReturnModel = this.sixEnergyNewOrderReturnModel // 添加运费数据到表单
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
        this.loading = true
        let { result } = await getOpenIdByCode(code)
        let payData = await this.typeMap[this.productType](this.form, result)
        await this.pay(payData.result.CREDENTIAL, payData.result.orderModel.orderSn)
        delete this.form.sixEnergyNewOrderReturnModel
        delete this.form.orderSn
        delete this.form.billNo
      } catch (e) {
        this.loading = false
        delete this.form.sixEnergyNewOrderReturnModel
        delete this.form.orderSn
        delete this.form.billNo
        throw e
      }
    },
    async pay (CREDENTIAL, orderSn) {
      CREDENTIAL.packageValue = CREDENTIAL.package
      // 支付完成后的去向
      let payDone = {
        PHYSICAL_GOODS: { name: 'Orders', params: { status: 'WAIT_SHIP' } },
        VIRTUAL_GOODS: { name: 'Orders', params: { status: 'WAIT_RECEIVE' } }
      }
      return new Promise(async (resolve, reject) => {
        try {
          await wechatPay(CREDENTIAL)
          this.loading = false
          if (this.supplierProduct) { // 供应商商品支付完成后直接跳转至待收货
            this.$router.replace(payDone.VIRTUAL_GOODS)
          } else {
            this.$router.replace(payDone[this.productType]) // 跳转至待发货或待收货，这取决于商品类型
          }
          resolve()
        } catch (e) {
          this.loading = false
          if (this.supplierProduct) { // 支付失败时，如果是供应商商品，则取消订单，并跳回商品详情
            try {
              await this.typeMapOfCancel[this.productType](orderSn)
              this.$router.replace({ name: 'Lesson', params: { productSeq: this.productSeq } })
            } catch (e) {
              reject(e)
            }
          } else { // 待付款
            this.$router.replace({ name: 'Orders', params: { status: 'WAIT_PAY' } })
          }
          reject(e)
        }
      })
    }
  }
}
</script>

<style module lang="scss">
  .cart {
    padding: 20px 40px 120px;
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
      width: 200px;
    }
    > button {
      flex: 1;
    }
  }
</style>
