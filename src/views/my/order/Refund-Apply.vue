<template>
  <div
    class="refund-apply"
    :class="$style.refundApply"
  >
    <div style="position: relative; z-index: 9999;">
      <a href="tel:15091719776">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
      </a>
    </div>

    <section :class="$style.orderInfo">
      <order-item
        :img="'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/S1TG7SeB-NNr5dAtb-lbBjEtQX-pB9jMx6w_1556513907615.png'"
        :name="'McQ Alexander McQueen 2018春夏新款棉氨男士…'"
        :option="'课程：英语互动'"
        hide-price
      />
    </section>

    <section :class="$style.content">
      <div :class="[$style.panel, $style.panelTop]">
        <pl-fields
          class="right-text--bold"
          text="服务类型："
          :right-text="refundType === 'REFUND' ? '退款' : '退款退货'"
        />
        <pl-fields
          text="货物状态："
          :right-text="form.goodsStatus || '请选择'"
          show-right-icon
          @click="showPopup('goodsStatus')"
        />
        <pl-fields
          text="请选择退货原因："
          :right-text="form.refundReason || '请选择'"
          show-right-icon
          @click="showPopup('refundReason')"
        />
        <div :class="$style.item">
          <span :class="$style.itemLeft">
            退款金额：
          </span>
          <span :class="$style.itemRight">
            <div :class="$style.price">
              ￥76.64
            </div>
            <div :class="$style.tips">
              运费不可退，如有疑问，请联系商家协商
            </div>
          </span>
        </div>
      </div>

      <div :class="[$style.panel, $style.panelBottom]">
        <div :class="$style.description">
          <label for="description">
            原因描述：
            <textarea
              v-model="form.description"
              placeholder="请填写您的原因"
              name="description"
              rows="8"
              cols="80"
              maxlength="400"
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
      :show-close-icon="false"
      @close="closePopup"
    >
      <template>
        <ul :class="$style.popupContentWrapper">
          <radio-group-component
            v-model="radio"
            @change="onRadioChange"
          >
            <template>
              <div
                :class="$style.popupItem"
                v-for="(item, index) of popupOptions"
                :key="index"
                @click="handleRadioClick(item.text)"
              >
                <div :class="$style.popupItemText">
                  {{ item.text }}
                </div>
                <radio-component :name="item.text" />
              </div>
            </template>
          </radio-group-component>
        </ul>
        <div :class="$style.popupButtonWrapper">
          <pl-button
            size="larger"
            type="warning"
            @click="closePopup"
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
import { getOrderDetail } from '../../../apis/order-manager'

export default {
  name: 'Refund',
  components: {
    OrderItem
  },
  props: {
    orderId: {
      type: String,
      default: null
    },
    refundType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      statusTypeMap: {
        WAIT_SHIP: 'WAIT_SHIP_REFUND_RULE', // 待发货的待退款
        WAIT_RECEIVE: 'WAIT_RECEIVE_REFUND_RULE', // 待收货的待退款
        FINISHED: 'FINISHED_REFUND_RULE' // 待收货的待退款
      },
      orderStatus: '',
      operationType: '', // 在何种情况下退款,
      relationModel: [],
      form: {
        type: 'REFUND', // 退款类型  RETURN_REFUND REFUND
        goodsStatus: '',
        refundReason: '',
        amount: '',
        description: '',
        imgList: []
      },
      imgList: [],
      isPopupShow: false,
      currentPopupName: '',
      popupTitle: '',
      popupOptions: [],
      goodsStatusInfo: {
        title: '货物状态',
        options: [{
          name: '0',
          text: '未收到货'
        }, {
          name: '1',
          text: '已收到货'
        }]
      },
      refundReasonInfo: {
        title: '退款原因',
        options: [{
          name: '0',
          text: '质量问题'
        }, {
          name: '1',
          text: '不想要了'
        }, {
          name: '2',
          text: '商品信息填写错误'
        }, {
          name: '3',
          text: '卖家发错货'
        }, {
          name: '4',
          text: '商品与描述不符合'
        }, {
          name: '5',
          text: '收到商品少件、破损或污渍'
        }, {
          name: '6',
          text: '质量问题'
        }]
      },
      radio: ''
    }
  },
  created () {
  },
  activated () {
    this.getOrderDetail()
  },
  methods: {
    async getOrderDetail () {
      const { result } = await getOrderDetail(this.orderId)
      let { relationModel, orderInfoModel } = result
      this.relationModel = relationModel[0]
      this.orderStatus = orderInfoModel.orderStatus
      this.operationType = this.statusTypeMap[orderInfoModel.orderStatus]
    },
    showPopup (name) {
      this.currentPopupName = name
      this.popupTitle = this[`${name}Info`].title
      this.popupOptions = this[`${name}Info`].options
      this.$nextTick(() => {
        this.isPopupShow = true
      })
    },
    closePopup () {
      const { currentPopupName, radio } = this
      this.form[currentPopupName] = radio
      this.isPopupShow = false
    },
    handleRadioClick (value) {
      this.radio = value
    },
    onRadioChange (value) {
      console.log(value)
    },
    uploaded (res) {
      if (res.res.status === 200) {
        this.imgList.push(res.url)
        // let ossModel = {
        //   mediaType: 'image',
        //   mediaFilename: res.name.split('/').splice(-1, 1)[0],
        //   mediaUrl: res.url
        // }
        // this.form.imgList.push(ossModel)
      }
    },
    removeImg (index, list) {
      console.log(index, list, this.imgList)
      // this.form.imgList.splice(index, 1)
    },
    async confirm () {
      if (!this.form.refundReason) {
        this.$toast('请选择退货原因')
      } else {
        this.$router.push({ name: 'RefundList' })
      }
      if (this.form.type === 'RETURN_REFUND') {
        // 退款退货
        // if (this.$refs.form.validate()) {
        //   if (!this.form.refundModel.content) return this.$toast('请输入内容')
        //   this.request()
        // }
      } else {
        // if (!this.form.refundModel.content) return this.$toast('请输入内容')
        // // 如果是退货
        // this.form.expressInfoModel.courierCompany = ''
        // this.form.expressInfoModel.courierNo = ''
        // this.request()
      }
    },
    async request () {
      // try {
      //   await this.$confirm('确定提交吗？')
      //   await returnRequest(this.form)
      //   resetForm(this.form, {
      //     type: 'REFUND'
      //   })
      //   this.images = []
      //   this.$toast('申请售后成功，请等待卖家反馈')
      //   this.$router.replace({ name: 'RefundList' })
      // } catch (e) {
      //   throw e
      // }
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

  .call-me {
    position: absolute;
    top: -28px;
    right: 40px;
    width: 38px;
    height: 80px;
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

  .description {
    label {
      font-size: 28px;
      color: #666;
      line-height: 40px;
    }

    textarea {
      width: 100%;
      height: 222px;
      border: none;
      outline: none;
      resize: none;
      padding-top: 12px;
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
}
</style>
