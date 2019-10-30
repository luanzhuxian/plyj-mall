<template>
  <div :class="$style.invoiceDetail">
    <div style="position: relative;">
      <top-text
        title="已完成"
        tip="2019年02月11日"
      />
      <a :href="`tel:${$store.getters.supportPhone}`">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
      </a>
    </div>

    <div :class="$style.addressInfo + ' mt-28 radius-20 bg-white'">
      <pl-svg name="address3" />
      <div :class="$style.right + ' fz-24 gray-2'">
        <div :class="$style.name">
          收货人：<i v-text="InvoiceDetail.recvName" />&nbsp;<i
            class="bold"
            v-text="InvoiceDetail.recvMobile"
          />
        </div>
        <div
          :class="$style.address"
          v-text="InvoiceDetail.recvAddr"
        />
      </div>
    </div>

    <div :class="$style.invoices + ' radius-20'">
      <div :class="$style.title">
        增值税普通发票
      </div>
      <div :class="$style.invoicesContent">
        <ul class="invoice-list">
          <li :class="$style.invoiceItem">
            <span>发票形式</span>
            <span v-text="InvoiceDetail.invoiceFormText" />
          </li>
          <li :class="$style.invoiceItem">
            <span>发票类型</span>
            <span v-text="InvoiceDetail.invoiceTypeText" />
          </li>
          <li :class="$style.invoiceItem">
            <span>发票抬头</span>
            <span v-text="InvoiceDetail.invoiceTitle" />
          </li>
          <li
            :class="$style.invoiceItem"
            v-if="InvoiceDetail.idNo"
          >
            <span>纳税人识别号</span>
            <span v-text="InvoiceDetail.idNo" />
          </li>
          <li
            :class="$style.invoiceItem"
            v-if="InvoiceDetail.bankName"
          >
            <span>开户银行</span>
            <span v-text="InvoiceDetail.bankName" />
          </li>
          <li
            :class="$style.invoiceItem"
            v-if="InvoiceDetail.bankAccount"
          >
            <span>银行账户</span>
            <span v-text="InvoiceDetail.bankAccount" />
          </li>
          <li
            :class="$style.invoiceItem"
            v-if="InvoiceDetail.companyName"
          >
            <span>企业名称</span>
            <span v-text="InvoiceDetail.companyName" />
          </li>
          <li
            :class="$style.invoiceItem"
            v-if="InvoiceDetail.companyAddr"
          >
            <span>企业地址</span>
            <span v-text="InvoiceDetail.companyAddr" />
          </li>
          <li
            :class="$style.invoiceItem"
            v-if="InvoiceDetail.companyPhone"
          >
            <span>企业电话</span>
            <span v-text="InvoiceDetail.companyPhone" />
          </li>
          <li
            :class="$style.invoiceItem"
            v-if="InvoiceDetail.detail"
          >
            <span>发票内容</span>
            <span v-text="InvoiceDetail.detail" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import TopText from '../../../components/common/Top-Text.vue'
import { getOrderDetail, invoiceDetail } from '../../../apis/order-manager'
export default {
  name: 'InvoiceDetail',
  components: {
    TopText
  },
  data () {
    return {
      InvoiceDetail: {
        invoiceFormText: '123'
      }
    }
  },
  props: {
    orderId: {
      type: String,
      default: null
    }
  },
  activated () {
    this.getInvoice(this.orderId)
    this.getOrderDetail(this.orderId)
  },
  methods: {
    async getInvoice (id) {
      try {
        const { result } = await invoiceDetail(id)
        this.InvoiceDetail = result
        // this.InvoiceDetail.amountDx = DX(this.InvoiceDetail.amount)
        this.InvoiceDetail.invoiceType === 0 ? this.InvoiceDetail.invoiceTypeText = '个人' : this.InvoiceDetail.invoiceTypeText = '企业'
        this.InvoiceDetail.invoiceForm === 0 ? this.InvoiceDetail.invoiceFormText = '纸质发票' : this.InvoiceDetail.invoiceFormText = '电子发票'
      } catch (e) {
        throw e
      }
    },
    async getOrderDetail (id) {
      try {
        const { result } = await getOrderDetail(id)
        const { orderDetailModel, orderInfoModel, relationModel } = result
        this.orderDetailModel = orderDetailModel
        this.orderInfoModel = orderInfoModel
        this.relationModel = relationModel
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .invoice-detail {
    padding: 28px 40px;
  }
  .call-me {
    position: absolute;
    top: -28px;
    right: 40px;
    width: 38px;
    height: 80px;
  }
  .addressInfo {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px;
    svg {
      width: 64px;
      height: 64px;
      fill: $--warning-color;
    }
  }
  .right {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-left: 28px;
    .name {
      margin-bottom: 15px;
    }
  }

  .invoices {
    margin-top: 27px;
    padding: 20px 30px;
    box-shadow: 0 4px 20px 0 rgba(0,0,0,.1);
    background-color: #fff;
    .title {
      width: 100%;
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 28px;
      color: #666;
      background: #fff url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/my/fapiao.png") no-repeat center center;
      background-size: auto 100%;
    }
  }
  .invoice-list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .invoice-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    padding: 15px 0;
    font-size: 24px;
    text-align: left;
    border-bottom: 1px solid #f3f3f3;
    span {
      &:nth-of-type(1) {
        width: 160px;

      }
      &:nth-of-type(2) {
        flex: 1;
      }
    }
  }
</style>
