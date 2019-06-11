<template>
  <div
    class="refund-apply"
    :class="$style.refundApply"
  >
    <section :class="$style.orderInfo">
      <order-item
        :img="productInfo.productImg"
        :name="productInfo.productName"
        :option="productInfo.optionName"
        hide-price
      />
    </section>

    <section :class="$style.content">
      <div :class="[$style.panel, $style.panelTop]">
        <pl-fields
          class="right-text--bold"
          text="服务类型："
          :right-text="refundTypeMap[refundType]"
        />
        <pl-fields
          text="货物状态："
          :right-text="radio.goodsStatusText || '请选择'"
          show-right-icon
          @click="showPopup('goodsStatus')"
        />
        <pl-fields
          text="请选择退货原因："
          :right-text="radio.refundReasonText || '请选择'"
          show-right-icon
          @click="showPopup('refundReason')"
        />
        <div :class="$style.item">
          <span :class="$style.itemLeft">
            退款金额：
          </span>
          <span :class="$style.itemRight">
            <div :class="$style.price">
              {{ `￥${form.actualRefund}` }}
            </div>
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
            <!-- <textarea
              v-model="form.reson"
              placeholder="请填写您的原因"
              name="reson"
              rows="8"
              cols="80"
              maxlength="400"
            /> -->
            <pl-input
              v-model="form.applyContent"
              type="textarea"
              placeholder="请填写您的原因"
              :maxlength="400"
              :min-rows="8"
            />
          </label>
        </div>
        <div :class="$style.images">
          <pl-upload-img
            :count="9"
            :size="0.5"
            :images.sync="imgList"
            @remove="removeImg"
            @success="uploaded"
          />
        </div>
      </div>
    </section>

    <div :class="$style.footer">
      <pl-button
        size="larger"
        type="warning"
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
          <radio-group-component
            v-model="radio[currentPopupName]"
            @change="onRadioChange"
          >
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
import { getOrderDetail, applyRefund, getMap as getRefundReasonMap } from '../../../apis/order-manager'
import { resetForm } from '../../../assets/js/util'
import { mapGetters } from 'vuex'

const receiveStatusMap = [
  {
    dictDataKey: '1',
    dictDataValue: '已收到货'
  }, {
    dictDataKey: '2',
    dictDataValue: '未收到货'
  }
]

const refundReasonKeyMap = {
  'WAIT_SHIP': 'REASONBUYERPAID',
  'WAIT_RECEIVE': 'REASONSNOTRECEIVEDGOODS',
  'FINISHED': 'REASONSRECEIVEDGOODS'
}

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
    refundType: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'APPLY'
    }
  },
  data () {
    return {
      refundReasonKeyMap,
      orderStatus: '',
      operationType: '', // 在何种情况下退款,
      productInfo: {},
      form: {
        orderDetailId: this.orderProductRId,
        refundType: '',
        actualRefund: 200.36,
        applyContent: '',
        pictures: []
      },
      radio: {
        goodsStatus: '',
        goodsStatusText: '',
        refundReason: '',
        refundReasonText: ''
      },
      goodsStatusInfo: {
        title: '货物状态',
        options: receiveStatusMap
      },
      refundReasonInfo: {
        title: '退款原因',
        options: []
      },
      isPopupShow: false,
      currentPopupName: '',
      popupTitle: '',
      popupOptions: [],
      imgList: []
    }
  },
  computed: {
    ...mapGetters(['refundTypeMap'])
  },
  created () {
    this.form.orderDetailId = this.orderProductRId
    this.getOrderDetail()
    if (this.type === 'EDIT') {
      this.get()
    }
    console.log(this.type)
  },
  methods: {
    async getOrderDetail () {
      const { result } = await getOrderDetail(this.orderId)
      this.productInfo = result.productInfoModel.productDetailModels.filter(product => product.orderProductRId === this.orderProductRId)[0] || {}
      this.orderStatus = result.orderStatus
      this.operationType = refundReasonKeyMap[result.orderStatus]
      this.form.refundType = this.refundType
      this.form.actualRefund = result.productInfoModel.productsTotalAmount
      const { result: refundReasonMap } = await getRefundReasonMap(this.operationType)
      this.refundReasonInfo.options = refundReasonMap
    },
    async get () {
    },
    showPopup (name) {
      this.currentPopupName = name
      this.popupTitle = this[`${name}Info`].title
      this.popupOptions = this[`${name}Info`].options
      this.$nextTick(() => {
        this.isPopupShow = true
      })
    },
    handleRadioClick (item) {
      let { currentPopupName, radio } = this
      radio[currentPopupName] = item.dictDataKey
      radio[`${currentPopupName}Text`] = item.dictDataValue
    },
    onRadioChange (value) {
      console.log(value)
    },
    uploaded (res) {
      if (res.res.status === 200) {
        // let ossModel = {
        //   mediaType: 'image',
        //   mediaFilename: res.name.split('/').splice(-1, 1)[0],
        //   mediaUrl: res.url
        // }
        this.form.pictures.push(res.url)
        this.imgList.push(res.url)
      }
    },
    removeImg (index, list) {
      this.imgList.splice(index, 1)
      this.form.pictures.splice(index, 1)
    },
    async confirm () {
      if (!this.radio.refundReason) {
        this.$toast('请选择退货原因')
      } else {
        this.request()
      }
    },
    async request () {
      try {
        const params = {
          ...this.form,
          receiveStatus: this.radio.goodsStatus,
          applyReason: this.radio.refundReason
        }
        await this.$confirm('确定提交吗？')
        await applyRefund(params)
        resetForm(this.form, {
          refundType: '1'
        })
        this.imgList = []
        this.$success('申请售后成功，请等待卖家反馈')
        setTimeout(() => {
          this.$router.replace({ name: 'RefundList', params: { status: 'ALL_ORDER' } })
        }, 2000)
      } catch (e) {
        throw e
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
      // width: 100%;
      // height: 222px;
      // border: none;
      // outline: none;
      // resize: none;
      // padding-top: 12px;
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
  .price {
    color: #FE7700;
    font-family: HelveticaNeue-Medium;
    font-weight: 500;
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
