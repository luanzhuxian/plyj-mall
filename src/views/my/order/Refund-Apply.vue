<template>
  <div
    class="refund-apply"
    :class="$style.refundApply"
  >
    <section :class="$style.orderInfo">
      <order-item
        :img="productInfo.productImg + '?x-oss-process=style/thum'"
        :name="productInfo.productName"
        :option="productInfo.skuCode2Name ? `${productInfo.skuCode1Name}；${productInfo.skuCode2Name}` : productInfo.skuCode1Name"
        :product-seq="productInfo.productId"
        hide-price
        route-name="Lesson"
      />
    </section>

    <section :class="$style.content">
      <div :class="[$style.panel, $style.panelTop]">
        <pl-fields
          class="right-text--bold"
          text="服务类型："
          :right-text="radio.refundTypeText || '请选择'"
          :show-right-icon="canRefundTypeChange"
          @click="() => {canRefundTypeChange ? showPopup('refundType') : ''}"
        />
        <pl-fields
          text="货物状态："
          :right-text="radio.goodsStatusText || '请选择'"
          show-right-icon
          @click="() => {canGoodsStatusChange ? showPopup('goodsStatus') : ''}"
        />
        <pl-fields
          text="退货原因："
          :right-text="radio.refundReasonText || '请选择'"
          show-right-icon
          @click="() => {canRefundReasonChange ? showPopup('refundReason') : ''}"
        />
        <div :class="$style.item">
          <span :class="$style.itemLeft">
            退款金额：
          </span>
          <span :class="$style.itemRight">
            <div :class="$style.priceWrapper">
              <div
                id="edit"
                :class="$style.price + ' rmb'"
                contenteditable
                v-text="form.actualRefund"
                @input="onInput"
              />
            </div>
            <!-- <pl-input
              v-model="form.actualRefund"
              type="number"
              placeholder="请输入"
              align="right"
            /> -->
            <div :class="$style.tips">
              运费不可退，如有疑问，请联系商家协商
            </div>
          </span>
        </div>
      </div>
      <div :class="[$style.panel, $style.panelBottom]">
        <div :class="$style.reson">
          <label for="reson">
            原因描述：
            <pl-input
              v-model="form.applyContent"
              type="textarea"
              placeholder="请填写您的原因"
              :maxlength="maxLength"
              :min-rows="8"
            />
          </label>
        </div>
        <div :class="$style.images">
          <pl-upload-img
            :count="9"
            :size="0.5"
            v-model="form.pictures"
            multiple
          />
        </div>
      </div>
    </section>

    <div :class="$style.footer">
      <pl-button
        size="larger"
        type="warning"
        :loading="loading"
        :disabled="loading"
        @click="confirm"
      >
        提交申请
      </pl-button>
    </div>

    <!-- 弹窗 -->
    <pl-popup
      ref="popup"
      :title="popupTitle"
      :show.sync="isPopupShow"
      hide-close-icon
      @close="isPopupShow = false"
    >
      <template>
        <ul :class="$style.popupContentWrapper">
          <radio-group-component v-model="radio[currentPopupName]">
            <template>
              <div
                :class="$style.popupItem"
                v-for="(item, index) of popupOptions"
                :key="index"
                @click="handleRadioClick(item)"
              >
                <div
                  :class="$style.popupItemText"
                  v-text="item.dictDataValue"
                />
                <radio-component :name="item.dictDataKey" />
              </div>
            </template>
          </radio-group-component>
        </ul>
        <div :class="$style.popupButtonWrapper">
          <pl-button
            size="larger"
            type="warning"
            @click="isPopupShow = false"
          >
            关闭
          </pl-button>
        </div>
      </template>
    </pl-popup>
  </div>
</template>

<script>
import OrderItem from '../../../components/item/Order-Item.vue'
import { getOrderDetail, getRefundOrderDetail, applyRefund, modifyRefund, getMap as getRefundReasonMap } from '../../../apis/order-manager'
import { resetForm } from '../../../assets/js/util'
import { isPositive } from '../../../assets/js/validate'
import { mapGetters } from 'vuex'

const refundTypeOptions = [
  {
    dictDataKey: '1',
    dictDataValue: '退款'
  }, {
    dictDataKey: '2',
    dictDataValue: '退款退货'
  }
]

const goodsStatusOptions = [
  {
    dictDataKey: '1',
    dictDataValue: '已收到货'
  }, {
    dictDataKey: '2',
    dictDataValue: '未收到货'
  }
]

const goodsStatusMap = {
  '1': '已收到货',
  '2': '未收到货'
}

// const refundReasonKeyMap = {
//   'WAIT_SHIP': 'REASONBUYERPAID',
//   'WAIT_RECEIVE': {
//     '1': {
//       '1': 'REASONSRECEIVEDGOODS',
//       '2': 'REASONSNOTRECEIVEDGOODS'
//     },
//     '2': 'REASONSRECEIVEDGOODS'
//   },
//   'FINISHED': 'REASONSRECEIVEDGOODS'
// }

export default {
  name: 'RefundApply',
  components: {
    OrderItem
  },
  props: {
    orderId: {
      type: String,
      default: null
    },
    orderProductRId: {
      type: String,
      default: null
    },
    // 1: '退款', 2: '退款退货'
    refundType: {
      type: [String, Number],
      default: null
    },
    // APPLY, MODIFY
    type: {
      type: String,
      default: 'APPLY'
    },
    refundId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      loading: false,
      orderStatus: '',
      productInfo: {},
      form: {
        orderDetailId: this.orderProductRId,
        actualRefund: '',
        applyContent: '',
        pictures: []
      },
      radio: {
        refundType: '',
        refundTypeText: '',
        goodsStatus: '',
        goodsStatusText: '',
        refundReason: '',
        refundReasonText: ''
      },
      refundTypeInfo: {
        title: '服务类型',
        options: refundTypeOptions
      },
      goodsStatusInfo: {
        title: '货物状态',
        options: goodsStatusOptions
      },
      refundReasonInfo: {
        title: '退款原因',
        options: []
      },
      maxLength: 400,
      isPopupShow: false,
      currentPopupName: '',
      popupTitle: '',
      popupOptions: []
    }
  },
  computed: {
    ...mapGetters(['refundTypeMap']),
    isWaitShip () {
      return this.orderStatus === 'WAIT_SHIP'
    },
    // 退款退货，货物状态默认为已收到货，不可修改
    isRefundGoods () {
      return this.radio.refundType === '2'
    },
    canRefundTypeChange () {
      return !this.isWaitShip && this.type === 'MODIFY'
    },
    canGoodsStatusChange () {
      return !this.isWaitShip && !this.isRefundGoods
    },
    canRefundReasonChange () {
      return this.radio.goodsStatus && this.radio.goodsStatusText
    },
    refundReasonCode () {
      return (
        this.orderStatus === 'WAIT_SHIP'
          ? 'REASONBUYERPAID'
          : (this.orderStatus === 'WAIT_RECEIVE' || this.orderStatus === 'FINISHED')
            ? this.radio.refundType === '1'
              ? this.radio.goodsStatus === '1'
                ? 'REASONSRECEIVEDGOODS'
                : 'REASONSNOTRECEIVEDGOODS'
              : 'REASONSRECEIVEDGOODS'
            : '')
    }
  },
  watch: {
    'form.applyContent' (value) {
      if (value.length === this.maxLength) {
        this.$toast(`最多输入${this.maxLength}个字`)
      }
    }
  },
  activated () {
    this.form.orderDetailId = this.orderProductRId
    this.radio.refundType = String(this.refundType)
    this.radio.refundTypeText = this.refundTypeMap[this.refundType]
    if (this.isRefundGoods) {
      this.radio.goodsStatus = '1'
      this.radio.goodsStatusText = '已收到货'
    }
    this.getOrderDetail()
    if (this.type === 'MODIFY') {
      this.getRefundInfo()
    }
  },
  deactivated () {
    resetForm(this.form)
    resetForm(this.radio)
    this.isPopupShow = false
  },
  methods: {
    onInput (e) {
      const selection = window.getSelection()
      const lastAnchorOffset = selection.anchorOffset
      this.form.actualRefund = e.target.innerText
      this.$nextTick(() => {
        if (lastAnchorOffset) {
          selection.collapse(document.getElementById('edit').firstChild, lastAnchorOffset)
        }
      })
    },
    async getOrderDetail () {
      const { result } = await getOrderDetail(this.orderId)
      this.orderStatus = result.orderStatus
      this.productInfo = result.productInfoModel.productDetailModels.filter(product => product.orderProductRId === this.orderProductRId)[0] || {}
      // 待发货状态默认为未收到货
      if (result.orderStatus === 'WAIT_SHIP') {
        this.radio.goodsStatus = '2'
        this.radio.goodsStatusText = '未收到货'
      }
      if (this.type === 'APPLY') this.form.actualRefund = this.productInfo.amount;  // eslint-disable-line
      // 获取数据字典
      ({ result: this.refundReasonInfo.options } = await getRefundReasonMap(this.refundReasonCode))
    },
    getRefundInfo () {
      return new Promise(async (resolve, reject) => {
        try {
          const { result } = await getRefundOrderDetail({ id: this.refundId })
          this.form.actualRefund = result.actualRefund
          this.form.applyContent = result.applyContent
          this.form.pictures = [...result.pictures]
          this.imgList = [...result.pictures]
          this.radio.refundReason = String(result.applyReason)
          this.radio.refundReasonText = result.applyReasonText
          // 待发货状态默认为未收到货
          if (result.orderStatus !== 'WAIT_SHIP') {
            this.radio.goodsStatus = String(result.receiveStatus)
            this.radio.goodsStatusText = goodsStatusMap[result.receiveStatus]
          }
          resolve(true)
        } catch (e) {
          reject(e)
        }
      })
    },
    showPopup (name) {
      this.currentPopupName = name
      this.popupTitle = this[`${name}Info`].title
      this.popupOptions = this[`${name}Info`].options
      this.$nextTick(() => {
        this.isPopupShow = true
      })
    },
    async handleRadioClick (item) {
      let { currentPopupName, radio } = this
      radio[currentPopupName] = item.dictDataKey
      radio[`${currentPopupName}Text`] = item.dictDataValue
      if (currentPopupName === 'refundType') {
        this.radio.goodsStatus = this.isRefundGoods ? '1' : ''
        this.radio.goodsStatusText = this.isRefundGoods ? '已收到货' : ''
        this.radio.refundReason = ''
        this.radio.refundReasonText = '';  // eslint-disable-line
        ({ result: this.refundReasonInfo.options } = await getRefundReasonMap(this.refundReasonCode))
      }
      if (currentPopupName === 'goodsStatus') {
        this.radio.refundReason = ''
        this.radio.refundReasonText = '';  // eslint-disable-line
        ({ result: this.refundReasonInfo.options } = await getRefundReasonMap(this.refundReasonCode))
      }
    },
    async confirm () {
      if (!this.radio.goodsStatus) return this.$warning('请选择货物状态')
      if (!this.radio.refundReason) return this.$warning('请选择退货原因')
      if (!isPositive(this.form.actualRefund)) return this.$warning('退款金额必须大于零，小数点后最多两位')
      if (this.form.actualRefund > this.productInfo.amount) return this.$warning('退款金额大于最大退款金额，请修改')
      try {
        this.loading = true
        const { type, form: { actualRefund, ...rest } } = this
        const params = {
          ...rest,
          actualRefund: Number(actualRefund),
          refundType: this.radio.refundType,
          receiveStatus: this.radio.goodsStatus,
          applyReason: this.radio.refundReason,
          ...(type === 'MODIFY' ? { id: this.refundId } : null)
        }
        const fn = type === 'MODIFY' ? modifyRefund : applyRefund
        const message = type === 'MODIFY' ? '更改退单成功，请等待卖家反馈' : '申请售后成功，请等待卖家反馈'
        await this.$confirm('确定提交吗？')
        const { result } = await fn(params)
        this.loading = false
        this.$success(message)
        setTimeout(() => {
          this.type === 'APPLY'
            ? this.$router.replace({ name: 'RefundDetail', params: { id: result.id } })
            : this.$router.go(-1)
        }, 2000)
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style module lang="scss">
  .refund-apply {
    box-sizing: border-box;
    min-height: 100vh;
    padding-bottom: 122px;
  }

  .order-info {
    padding: 24px;
    background-color: #FFF;
    display: flex;
  }

  .content {
    padding: 20px 24px;
  }

  .panel {
    border-radius: 20px;
    background-color: #fff;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .panel-top {
    padding-left: 28px;
  }
  .panel-bottom {
    padding: 20px 28px;
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 28px;
    color: #666666;
    line-height: 40px;
    padding: 34px 28px 34px 0;
    .item-right {
      display: block;
      text-align: right;
      flex: 1;
    }
  }

  .reson {
    margin-bottom: 20px;
    label {
      font-size: 28px;
      color: #666;
      line-height: 40px;
    }

    textarea {
      &::-webkit-input-placeholder {
        font-size: 26px;
        color: #ccc;
      }
    }
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px 24px;
    background-color: #FFF;
  }

  .popup-content-wrapper {
    padding: 28px 0 0 24px;
    background-color: #FFF;
    height: 526px;
    overflow-y: scroll;
  }
  .popup-button-wrapper {
    padding: 16px 24px;
    background-color: #FFF;
    border-top: 1px solid #F0F0F0;
  }
  .popup-item {
    display: flex;
    align-items: center;
    flex: 1;
    font-size: 30px;
    color: #000000;
    line-height: 88px;
    border-bottom: 1px solid #F0F0F0;
    padding-right: 24px;
    &:nth-last-of-type(1) {
      border-bottom: none;
    }
  }
  .popup-item-text {
    flex: 1;
  }

  .tips {
    font-size:22px;
    line-height: 32px;
    margin-top: 10px;
  }
  .price-wrapper {
    max-width: 500px;
    overflow: scroll;
  }
  .price {
    display: inline-block;
    color: #FE7700;
    font-family: HelveticaNeue-Medium;
    font-weight: 500;
    outline: none;
    text-align: right;
  }
</style>

<style lang="scss">
.refund-apply {
  .pl-fields {
    &:nth-last-of-type(1):after {
      display: block;
    }
  }
  .pl-fields_box {
    &.large {
      height: 108px;
    }
  }
  .pl-fields_text {
    color: #666;
  }
  .pl-fields_right > .pl-fields_right_icon {
    fill: #DEDEDE;
  }
  .right-text--bold {
    .pl-fields_right > .pl-fields_right_text {
      color: #000;
      font-weight: bold;
    }
  }

  .pl-input.pl-input-small {
    min-height: auto;
  }
  .pl-input > .pl-input_box > input {
    text-align: right;
    color: #FE7700;
    font-family: HelveticaNeue-Medium;
    font-weight: 500;
  }

  .pl-textarea_box {
    padding-left: 0;
    > .pl-input-textarea {
      &::-webkit-input-placeholder {
        font-size: 28px;
        color: #CCCCCC;
        line-height: 38px;
      }
    }
    > .pl-input__word-count {
      color: #CCCCCC !important;
      > i {
        color: #CCCCCC !important;
      }
    }
  }
}
</style>
