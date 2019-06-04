<template>
  <div :class="$style.refundApply">
    <div style="position: relative;">
      <a href="tel:15091719776">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
      </a>
    </div>

    <section
      v-if="relationModel.mediaInfoModels"
      :class="$style.order"
    >
      <img
        :class="$style.orderPicture"
        v-lazy="relationModel.mediaInfoModels[0].mediaUrl"
        alt="商品图片"
      >
      <div :class="$style.orderInfo">
        <div :class="$style.orderInfoName">
          {{ relationModel.productModel.productName }}
        </div>
        <div :class="$style.orderInfoOption">
          {{ relationModel.productModel.optionName }}
        </div>
      </div>
    </section>

    <section :class="$style.content">
      <ul :class="[$style.panel, $style.panelTop]">
        <li :class="$style.item">
          <div :class="$style.itemLeft">
            服务类型：
          </div>
          <div :class="[$style.itemRight, $style.bold]">
            {{ refundType === 'REFUND' ? '退款' : '退款退货' }}
          </div>
        </li>
        <li
          :class="$style.item"
          @click="showPopup('goodsStatus')"
        >
          <div :class="$style.itemLeft">
            货物状态：
          </div>
          <div :class="$style.itemRight">
            <span v-if="form.goodsStatus">
              {{ form.goodsStatus }}
            </span>
            <span v-else>
              请选择
              <pl-svg
                :class="$style.itemIcon"
                name="right"
                color="#DEDEDE"
              />
            </span>
          </div>
        </li>
        <li
          :class="$style.item"
          @click="showPopup('refundReason')"
        >
          <div :class="$style.itemLeft">
            请选择退货原因：
          </div>
          <div :class="$style.itemRight">
            <span v-if="form.refundReason">
              {{ form.refundReason }}
            </span>
            <span v-else>
              请选择
              <pl-svg
                :class="$style.itemIcon"
                name="right"
                color="#DEDEDE"
              />
            </span>
          </div>
        </li>
        <li :class="$style.item">
          <div :class="$style.itemLeft">
            退款金额：
          </div>
          <div :class="$style.itemRight">
            <div :class="$style.price">
              ￥76.64
            </div>
            <div :class="$style.tips">
              运费不可退，如有疑问，请联系商家协商
            </div>
          </div>
        </li>
      </ul>

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

    <div :class="$style.buttonWrapper">
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
import {
  getOrderDetail
  // returnRequest
} from '../../../apis/order-manager'

export default {
  name: 'Refund',
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

  .order {
    padding: 24px;
    background-color: #FFF;
    display: flex;
  }
  .order-picture {
    width: 140px;
    height: 140px;
    margin-right: 16px;
  }
  .order-info {
    flex: 1;
  }
  .order-info-name {
    font-size: 22px;
    line-height: 26px;
    margin-bottom: 8px;
    height: 52px;
    @include elps-wrap(2);
  }
  .order-info-option {
    font-size: 20px;
    line-height: 28px;
    color: #999999;
    @include elps-wrap(1);
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
    align-items: center;
    height: 108px;
    border-bottom: 1px solid #F0F0F0;
    font-size: 28px;
    color: #666666;
    line-height: 40px;
    padding-right: 28px;

    &:nth-last-of-type(1) {
      border: none;
      height: auto;
      padding: 34px 28px 34px 0;
      align-items: flex-start;

      .item-right {
        display: block;
        text-align: right;
      }
    }
  }

  .item-right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #999999;
  }

  .item-icon {
    width: 22px;
    // margin-left: 12px;
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

  .button-wrapper {
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

  .bold {
    color: #000;
    font-weight: bold;
  }

  .tips {
    font-size:22px;
    line-height: 32px;
    margin-top: 10px;
  }

  .price {
    color: #FE7700;
    font-family: Helvetica;
  }

</style>
