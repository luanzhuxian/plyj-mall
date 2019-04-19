<template>
  <div :class="$style.invoice">
    <Address-Item />

    <div :class="$style.orderInfo + ' radius-20 mt-28'">
      <img
        v-img-error
        :src="orderInfoModel.img"
        alt=""
      >
      <div :class="$style.right">
        <div>
          <span class="fz-28">订单编号 </span>
          <span
            class="fz-24"
            v-text="orderId"
          />
        </div>
        <div>
          <span class="fz-28">开票金额 </span>
          <span
            :class="'rmb fz-26 '+$style.money"
            v-text="form.amount"
          />
        </div>
      </div>
    </div>

    <div :class="$style.invoiceInfo+' radius-20 mt-28'">
      <div :class="$style.invoiceType">
        <span class="fz-28 bold">发票类型：</span>
        <span class="fz-24">纸质发票</span>
      </div>

      <pl-form
        :class="{ [$style.invoiceForm]: true, [$style.hidden]: form.invoiceType === 0 }"
        align="right"
        ref="form"
        :rules="rules"
        :model="form"
      >
        <pl-form-item
          label="抬头类型："
          border
        >
          <pl-radio
            v-model="form.invoiceType"
            :label="0"
          >
            个人或事业单位
          </pl-radio>
          <pl-radio
            v-model="form.invoiceType"
            :label="1"
          >
            企业
          </pl-radio>
        </pl-form-item>
        <pl-form-item
          prop="invoiceTitle"
          label="发票抬头："
          border
        >
          <pl-input
            v-model="form.invoiceTitle"
            placeholder="抬头名"
          />
        </pl-form-item>
        <pl-form-item
          prop="idNo"
          label="纳税人识别号："
          border
        >
          <pl-input
            v-model="form.idNo"
            placeholder="请输入纳税人识别号"
          />
        </pl-form-item>
        <pl-form-item
          prop="bankName"
          label="开户银行："
          border
        >
          <pl-input
            v-model="form.bankName"
            placeholder="选填"
          />
        </pl-form-item>
        <pl-form-item
          prop="bankAccount"
          label="银行账号："
          border
        >
          <pl-input
            v-model="form.bankAccount"
            placeholder="选填"
          />
        </pl-form-item>
        <pl-form-item
          prop="companyAddr"
          label="企业地址："
          border
        >
          <pl-input
            v-model="form.companyAddr"
            placeholder="选填"
          />
        </pl-form-item>
        <pl-form-item
          prop="companyPhone"
          label="企业电话："
          border
        >
          <pl-input
            v-model="form.companyPhone"
            placeholder="选填"
          />
        </pl-form-item>
      </pl-form>
    </div>
    <div
      class="radius-20 mt-28 bg-white"
      style="overflow: hidden; padding-left: 28px;"
    >
      <pl-fields
        text="发票内容"
        right-text-weight="bold"
        icon="warning"
        icon-position="right"
        icon-color="#999"
        :right-text="content"
        :icon-gap="10"
        :route="{ name: 'InvoiceContent', params: { id: orderId } }"
      />
    </div>
    <pl-button
      class="mt-28"
      size="large"
      type="warning"
      @click="confirm"
    >
      提交
    </pl-button>
  </div>
</template>

<script>
import { applyOrderInvoice, getOrderDetail } from '../../../apis/order-manager'
import { checkLength } from '../../../assets/js/validate'
import { mapGetters } from 'vuex'
import AddressItem from '../../../components/Address-Item.vue'
export default {
  name: 'Invoice',
  components: {
    AddressItem
  },
  data () {
    return {
      form: {
        amount: '',
        bankAccount: '',
        bankName: '',
        companyAddr: '',
        companyName: '',
        companyPhone: '',
        idNo: '', // 纳税人识别号
        invoiceTitle: '',
        invoiceType: 0, // 个人0 或企业1
        recvAddr: '',
        recvMobile: '',
        recvName: '',
        sequenceNbr: '',
        deliveryCast: '到付',
        invoiceForm: 0, // 默认纸质发票 0
        userId: '',
        orderSn: '',
        detail: ''
      },
      rules: {
        invoiceTitle: [
          { required: true, message: '请输入发票抬头', trigger: 'blur' }
        ],
        idNo: [
          { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
          { validator: checkLength(20), message: '不得超过20个字符', trigger: 'blur' }
        ],
        bankName: [
          { required: false, trigger: 'blur' },
          { validator: checkLength(30), message: '银行名称不得超过30个字符', trigger: 'blur' }
        ],
        bankAccount: [
          { required: false, trigger: 'blur' },
          { validator: checkLength(20), message: '银行账号不得超过20个字符', trigger: 'blur' }
        ],
        companyAddr: [
          { required: false, trigger: 'blur' },
          { validator: checkLength(100), message: '地址过长', trigger: 'blur' }
        ],
        companyPhone: [
          { required: false, trigger: 'blur' },
          { validator: checkLength(20), message: '电话号码过长', trigger: 'blur' }
        ]
      },
      orderInfoModel: {}
    }
  },
  props: {
    orderId: {
      type: String,
      default: null
    }
  },
  computed: {
    content: function () {
      return this.$route.query.content || '明细'
    },
    ...mapGetters(['userId', 'selectedAddress'])
  },
  async activated () {
    await this.getOrderDetail()
  },
  methods: {
    async confirm () {
      try {
        if (this.form.invoiceType === 1) {
          if (!this.$refs.form.validate()) return
        }
        if (this.form.invoiceType === 0) {
          if (!this.form.invoiceTitle.trim()) return this.$toast('请输入发票抬头')
        }
        this.form.detail = this.content
        this.form.orderSn = this.orderId
        this.form.userId = this.userId
        this.form.recvAddr = this.selectedAddress.addressPrefix + this.selectedAddress.agencyAddress
        this.form.recvMobile = this.selectedAddress.mobile
        this.form.recvName = this.selectedAddress.realName
        if (!this.form.recvMobile || !this.form.recvMobile) {
          this.$toast('请选择发票邮寄地址')
          return
        }
        await this.$confirm('检查无误并确定提交？')
        await applyOrderInvoice(this.form)
        this.$destroy()
        this.$router.replace({ name: 'AllOrders' })
      } catch (e) {
        throw e
      }
    },
    async getOrderDetail () {
      this.form.orderSn = this.orderId
      this.form.userId = this.userId
      try {
        const { result } = await getOrderDetail(this.form.orderSn)
        this.orderInfoModel = result.orderInfoModel
        this.form.amount = this.orderInfoModel.amount
        this.orderInfoModel.img = result.relationModel[0].mediaInfoModels[0].mediaUrl
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .invoice {
    padding: 20px 40px;
  }
  .no-address {
    display: flex;
    justify-content: space-between;
    padding: 34px 40px;
    background-color: $--warning-color;
    color: #fff;
    svg {
      width: 40px;
      height: 40px;
    }
  }
  .order-info {
    display: flex;
    padding: 28px;
    background-color: #fff;
    img {
      width: 106px;
      height: 106px;
      margin-right: 25px;
      object-fit: cover;
    }
    .right {
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      .money {
        color: $--primary-color;
        &:before {
          font-size: 20px;
        }
      }
    }
  }
  .invoice-info {
    overflow: hidden;
    background-color: #fff;
  }
  .invoice-type {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 108px;
    line-height: 108px;
    padding: 0 28px;
    &:after{
      @include border-half-bottom(#e7e7e7)
    }
    span:nth-of-type(2) {
      position: relative;
      display: inline-block;
      width: 132px;
      text-align: center;
      line-height: 52px;
      color: $--warning-color;
      &:after {
        @include border-half($--warning-color, 53px)
      }
    }
  }
  .invoice-form {
    margin-left: 28px;
    height: 767px;
    overflow: hidden;
    transition: height .5s ease-in-out;
    &.hidden {
      height: 218px;
    }
  }
</style>
