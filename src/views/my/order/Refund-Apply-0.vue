<template>
  <div :class="$style.refundApply">
    <div style="position: relative;">
      <top-text
        title="请选择服务类型"
        tip="小主，时间宝贵，请您三思哦～"
      />
      <!--<top-text title="退款成功" tip="2018年7月23日 17:31:32" />-->
      <!--<top-text title="退款失败" tip="2018年7月23日 17:31:32" />-->
      <a href="tel:15091719776">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
      </a>
    </div>

    <div :class="$style.type">
      <span
        :class="{ [$style.active]: form.type === 'REFUND' }"
        @click="form.type = 'REFUND'"
      >退款</span>
      <!--<span
        v-if="orderStatus === 'WAIT_RECEIVE' || orderStatus === 'FINISHED'"
        :class="{ [$style.active]: form.type === 'RETURN_REFUND' }"
        @click="form.type = 'RETURN_REFUND'"
      >
        退货退款
      </span>-->
    </div>

    <div
      :class="$style.express + ' radius-20'"
      v-show="form.type === 'RETURN_REFUND'"
    >
      <pl-form
        align="right"
        :model="form.expressInfoModel"
        :rules="rules"
        ref="form"
      >
        <pl-form-item
          prop="courierCompany"
          border
          label="快递公司："
        >
          <pl-input
            v-model="form.expressInfoModel.courierCompany"
            placeholder="请输入快递公司名称"
          />
        </pl-form-item>
        <pl-form-item
          prop="courierNo"
          border
          label="快递单号："
        >
          <pl-input
            v-model="form.expressInfoModel.courierNo"
            placeholder="请输入快递单号"
          />
        </pl-form-item>
      </pl-form>
    </div>

    <main class="radius-20 bg-white mt-28">
      <div :class="$style.product">
        <template v-if="relationModel.length">
          <OrderItem
            v-for="item of relationModel"
            :key="item.productModel.contentId"
            :img="item.mediaInfoModels[0].mediaUrl"
            :name="item.productModel.productName"
            :option="item.orderProductRelationModel.optionName"
            :price="item.orderProductRelationModel.productPrice"
            :count="item.orderProductRelationModel.count"
          />
        </template>
      </div>
      <div :class="$style.content">
        <pl-input
          v-model="form.refundModel.content"
          type="textarea"
          :maxlength="500"
          placeholder="请描述你的问题"
          :min-rows="5"
          :max-rows="10"
        />
      </div>
      <div :class="$style.images">
        <pl-upload-img
          :count="6"
          :size="0.5"
          :images.sync="images"
          @remove="removeImg"
          @success="uploaded"
        />
      </div>
      <div :class="'mt-28 '+$style.submit">
        <pl-button
          round
          plain
          type="warning"
          @click="confirm"
        >
          确认提交
        </pl-button>
      </div>
    </main>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import {
  returnRequest,
  getOrderDetail
} from '../../../apis/order-manager'
import { resetForm } from '../../../assets/js/util'
export default {
  name: 'RefundApply0',
  components: {
    TopText,
    OrderItem
  },
  data () {
    return {
      images: [],
      form: {
        type: 'REFUND', // 退款类型  RETURN_REFUND REFUND
        operationType: '', // 在何种情况下退款
        refundModel: {
          content: '',
          images: []
        },
        expressInfoModel: {
          courierCompany: '',
          courierNo: ''
        }
      },
      relationModel: [],
      orderInfoModel: {},
      statusTypeMap: {
        WAIT_SHIP: 'WAIT_SHIP_REFUND_RULE', // 待发货的待退款
        WAIT_RECEIVE: 'WAIT_RECEIVE_REFUND_RULE', // 待收货的待退款
        FINISHED: 'FINISHED_REFUND_RULE' // 待收货的待退款
      },
      rules: {
        courierCompany: [{ required: true, message: '请输入快递公司', trigger: 'blur' }],
        courierNo: [{ required: true, message: '请输入快递单号', trigger: 'blur' }]
      },
      orderStatus: ''
    }
  },
  props: {
    orderId: {
      type: String,
      default: null
    }
  },
  activated () {
    this.form.refundModel.mallSeq = this.mallSeq
    this.form.orderId = this.orderId
    this.getOrderDetail()
  },
  methods: {
    async getOrderDetail () {
      const { result } = await getOrderDetail(this.orderId)
      let { relationModel, orderInfoModel } = result
      this.orderInfoModel = orderInfoModel
      this.orderStatus = orderInfoModel.orderStatus
      this.relationModel = relationModel
      this.form.operationType = this.statusTypeMap[orderInfoModel.orderStatus]
    },
    uploaded ({ url, name }) {
      this.images.push(url)
      let ossModel = {
        mediaFilename: name.split('/').splice(-1, 1)[0],
        mediaUrl: url,
        mediaType: 'image'
      }
      this.form.refundModel.images.push(ossModel)
    },
    removeImg (index) {
      this.form.refundModel.images.splice(index, 1)
    },
    async confirm () {
      if (this.form.type === 'RETURN_REFUND') {
        // 退款退货
        if (this.$refs.form.validate()) {
          if (!this.form.refundModel.content) return this.$toast('请输入内容')
          this.request()
        }
      } else {
        if (!this.form.refundModel.content) return this.$toast('请输入内容')
        // 如果是退货
        this.form.expressInfoModel.courierCompany = ''
        this.form.expressInfoModel.courierNo = ''
        this.request()
      }
    },
    async request () {
      try {
        await this.$confirm('确定提交吗？')
        await returnRequest(this.form)
        resetForm(this.form, {
          type: 'REFUND'
        })
        this.images = []
        this.$toast('申请售后成功，请等待卖家反馈')
        this.$router.replace({ name: 'RefundList' })
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .refund-apply {
    padding: 28px 40px;
    main {
      overflow: hidden;
      padding-bottom: 28px;
    }
  }
  .call-me {
    position: absolute;
    top: -28px;
    right: 40px;
    width: 38px;
    height: 80px;
  }
  .express {
    padding-left: 28px;
    background-color: #fff;
    overflow: hidden;
  }
  .type {
    margin: 45px 0 40px 0;
    font-size: 24px;
    color: #fff;
    font-weight: bold;
    text-align: left;
    span {
      display: inline-block;
      width: 160px;
      margin-right: 24px;
      line-height: 64px;
      text-align: center;
      border-radius: 32px;
      background-color: #ddd;
      &.active {
        background-color: $--warning-color;
      }
    }
  }
  .product {
    position: relative;
    margin-left: 28px;
    padding: 30px 0;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
  }
  .images {
    padding: 28px;
  }
  .submit {
    display: flex;
    justify-content: flex-end;
    position: relative;
    &:after { @include border-half-top(#e7e7e7); }
    padding-top: 28px;
    padding-right: 28px;
    margin-left: 28px;
  }
</style>
