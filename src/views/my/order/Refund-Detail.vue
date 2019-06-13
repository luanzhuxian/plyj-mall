<template>
  <div
    v-if="loaded"
    class="refund-detail"
    :class="$style.refundDetail"
  >
    <div :class="$style.title">
      <top-text
        :title="refundStatusMap[refundStatus]"
        :tip="refundStatus === 'REFUND_PRODUCT' ? refundDetail.shipSn ? suggestionMap[refundStatus][1] : suggestionMap[refundStatus][0] : suggestionMap[refundStatus]"
      />
    </div>

    <section
      v-if="refundStatus === 'REFUND_PRODUCT'"
      :class="[$style.panel, $style.expressPanel]"
    >
      <div
        v-if="refundDetail.shipSn"
        :class="$style.expressItem"
      >
        <pl-svg
          :class="$style.expressIcon"
          name="express"
        />
        <div :class="$style.right">
          <div
            :class="[$style.main, $style.bold]"
            v-text="refundDetail.shipChannelText"
          />
          <div
            :class="$style.sub"
            v-text="`运单号：${refundDetail.shipSn}`"
          />
        </div>
      </div>
      <div :class="$style.expressItem">
        <pl-svg
          :class="$style.expressIcon"
          name="express-receive"
        />
        <div :class="$style.right">
          <div :class="$style.main">
            <span
              :class="$style.name"
              v-text="`退货信息：${refundDetail.refundUserName}`"
            />
            <span
              :class="$style.phone"
              v-text="refundDetail.refundMobile"
            />
          </div>
          <div
            :class="$style.sub"
            v-text="refundDetail.refundAddress"
          />
        </div>
      </div>
    </section>

    <section
      v-if="refundStatus === 'REFUND_PRODUCT' && !refundDetail.shipSn"
      :class="[$style.panel, $style.expressInfoPanel]"
    >
      <pl-fields
        text="快递公司："
        :right-text="form.expressName || '请选择'"
        right-text-weight="bold"
        show-right-icon
        @click="isPickerShow=true"
      />
      <pl-form-item>
        <label
          for="expressNo"
          :class="$style.expressNo"
        >
          快递单号：
        </label>
        <pl-input
          type="text"
          v-model="form.expressNo"
          placeholder="请输入快递单号"
          align="right"
        />
      </pl-form-item>
    </section>

    <section :class="[$style.panel, $style.amountPanel]">
      <div :class="$style.top">
        <div :class="$style.item">
          <span :class="[$style.itemLeft, $style.bold]">
            应退金额：
          </span>
          <span :class="$style.itemRight">
            <div
              v-if="refundDetail.actualPayAmount"
              :class="$style.price"
              v-text="`￥${refundDetail.shouldRefund}`"
            />
          </span>
        </div>
        <div
          v-if="refundStatus==='WAIT_CHECK' || (refundStatus==='REFUND_PRODUCT' && refundDetail.shipSn)"
          :class="[$style.item, $style.larger]"
        >
          <span :class="[$style.itemLeft, $style.bold]">
            实退金额：
          </span>
          <span
            v-if="refundDetail.actualRefund"
            :class="[$style.itemRight, $style.price]"
            v-text="`￥${refundDetail.actualRefund}`"
          />
        </div>
        <div
          v-if="refundStatus==='WAIT_CHECK'"
          :class="$style.tips"
        >
          运费不可退，如有疑问，请联系商家协商
        </div>
        <div
          v-if="refundStatus==='FINISHED' || refundStatus==='CANCEL'"
          :class="$style.tips"
        >
          <div>退款返还您的实际付款金额，优惠劵将不予退回</div>
          <div>退款到帐时间，请查看您的付款账户</div>
        </div>
      </div>
      <div :class="$style.bottom">
        <collapse v-model="collepseActiveNames">
          <collapse-item
            name="1"
            title="退款进度"
          >
            <template slot="default">
              <ul :class="$style.refundProgressList">
                <li
                  v-for="(item, index) of refundProgress"
                  :key="index"
                  :class="$style.refundProgressItem"
                >
                  <div :class="$style.datetime">
                    <span :class="$style.date">
                      {{ item.createTimeArray[0] }}
                    </span>
                    <span :class="$style.time">
                      {{ item.createTimeArray[1] }}
                    </span>
                  </div>
                  <div
                    :class="$style.refundProgressContent"
                    v-text="item.operatingLog"
                  />
                </li>
              </ul>
            </template>
          </collapse-item>
        </collapse>
      </div>
    </section>

    <div :class="[$style.panel, $style.refundInfoPanel]">
      <module-title
        title="退款信息"
        size="mini"
      />
      <div :class="$style.productInfo">
        <order-item
          :img="refundDetail.productPic"
          :name="refundDetail.productName"
          :option="refundDetail.skuName"
          route-name="Lesson"
          :product-seq="refundDetail.productId"
          hide-price
        />
      </div>
      <div :class="$style.infoList">
        <pl-list
          title="退单编号："
          :content="refundDetail.id"
        />
        <pl-list
          title="服务类型："
          :content="refundTypeMap[refundDetail.refundType]"
        />
        <pl-list
          v-if="refundDetail.refundType===1"
          title="货物状态："
          :content="receiveStatusMap[refundDetail.receiveStatus]"
        />
        <pl-list
          title="退款原因："
          :content="refundDetail.applyReasonText"
        />
        <pl-list
          title="申请件数："
          :content="`${refundDetail.productCount}件`"
        />
        <pl-list
          title="申请时间："
          :content="refundDetail.applyTime"
        />
      </div>
      <div :class="[$style.infoList, $style.borderTop]">
        <pl-list
          :class="$style.imgListWrapper"
          title="问题描述："
        >
          <div :class="$style.imgList">
            <img
              v-for="(img, i) of refundDetail.pictures"
              :key="i"
              :src="img"
              v-gallery:image
              v-img-error
              alt="退款图片"
            >
          </div>
        </pl-list>
        <pl-list
          title="问题描述："
          :content="refundDetail.applyContent"
        />
      </div>
    </div>

    <div
      v-if="refundStatus === 'REFUND_PRODUCT' && !refundDetail.shipSn"
      :class="$style.footerSubmit"
    >
      <pl-button
        size="larger"
        type="warning"
        @click="submit"
      >
        提交申请
      </pl-button>
    </div>
    <div
      v-else
      :class="$style.footer"
    >
      <pl-button
        round
        plain
        @click="isPopupShow=true"
      >
        联系我们
      </pl-button>
      <pl-button
        v-if="refundStatus==='WAIT_CHECK'"
        round
        plain
        @click="$router.push({ name: 'RefundApply', params: { orderId: refundDetail.orderId, orderProductRId: refundDetail.orderDetailId, refundType: refundDetail.refundType, type: 'MODIFY', refundId: refundDetail.id } })"
      >
        更改退单
      </pl-button>
      <pl-button
        v-if="refundStatus==='WAIT_CHECK'"
        round
        plain
        @click="cancelApplication"
      >
        取消申请
      </pl-button>
      <pl-button
        v-if="false"
        round
        plain
        @click="$router.push({ name: 'Refund', params: { orderId: refundDetail.orderId, orderProductRId: refundDetail.orderDetailId } })"
      >
        重新申请
      </pl-button>
    </div>
    <pl-popup
      ref="contact"
      :show.sync="isPopupShow"
    >
      <template name="title">
        <div :class="$style.popupTitle">
          <pl-svg
            :class="$style.popupTitleIcon"
            name="rows"
          />
          <span>联系我们</span>
        </div>
      </template>
      <template>
        <div :class="$style.popupContent">
          <div :class="$style.popupAddress">
            <pl-svg
              :class="$style.popupAddressLeftIcon"
              name="address-blue"
            />
            <span
              :class="$style.popupAddressText"
              v-text="address"
            />
            <pl-svg
              :class="$style.popupAddressRightIcon"
              name="copy"
              @click="doCopy"
            />
          </div>
          <a :href="`tel: ${supportPhone}`">
            <pl-button
              size="larger"
              background-color="#387AF6"
              prefix-icon="mobile-blue"
              round
            >
              立即拨打
            </pl-button>
          </a>
        </div>
      </template>
    </pl-popup>
    <pl-picker
      :show.sync="isPickerShow"
      :slots="pickerColumns"
      @confirm="onPickerConfirm"
    />
  </div>

  <div
    v-else
    :class="$style.skeleton"
  >
    <div :class="$style.skeleton1 + ' ' + $style.skeAnimation" />
    <div :class="$style.skeleton2 + ' ' + $style.skeAnimation" />
    <div :class="$style.skeleton3">
      <AddressItemSkeleton />
      <AddressItemSkeleton />
    </div>
    <div :class="$style.skeleton4">
      <div :class="$style.skeleton41 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton42 + ' ' + $style.skeAnimation" />
      <OrderItemSkeleton />
      <div :class="$style.skeleton44 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton45 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton46 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton47 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton48 + ' ' + $style.skeAnimation" />
    </div>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import ModuleTitle from '../../../components/Module-Title.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import Collapse from '../../../components/penglai-ui/collapse/Collapse.vue'
import CollapseItem from '../../../components/penglai-ui/collapse/Collapse-Item.vue'
import OrderItemSkeleton from '../../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../../components/skeleton/Address-Item.vue'
import { getRefundOrderDetail, getMap as getExpressMap, submitExpressInfo, cancelRefundApplication } from '../../../apis/order-manager'
import { resetForm } from '../../../assets/js/util'
import { mapGetters } from 'vuex'

const expressMapCode = 'KYYQJKDGS'

const suggestionMap = {
  WAIT_CHECK: '请耐心等待商家审核，如有问题请联系客服',
  REFUND_PRODUCT: ['请根据商家收货地址，将商品寄回', '请耐心等待商家收货'],
  FINISHED: '您的退款申请已受理完成',
  CLOSED: '因为您超时操作，本次退款申请已关闭',
  CANCEL: '您已撤销退款申请，退款已关闭',
  REJECT: '商家驳回您的退款申请，如有问题请尽快与商家协商'
}

const receiveStatusMap = {
  '1': '已收到货',
  '2': '未收到货'
}

function rebuildDate (list) {
  let array = list.split(' ')
  array[0] = array[0].slice(array[0].indexOf('-') + 1)
  array[1] = array[1].slice(0, array[1].lastIndexOf(':'))
  return array
}

function replaceMobile (mobile) {
  return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

export default {
  name: 'RefundDetail',
  components: {
    TopText,
    ModuleTitle,
    OrderItem,
    OrderItemSkeleton,
    AddressItemSkeleton,
    Collapse,
    CollapseItem
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      loaded: false,
      refundStatus: '',
      refundDetail: {},
      form: {
        expressName: '',
        expressNo: ''
      },
      refundProgress: [],
      isPopupShow: false,
      isPickerShow: false,
      pickerColumns: [
        {
          flex: 1,
          textAlign: 'center',
          values: []
        }
      ],
      collepseActiveNames: [],
      suggestionMap,
      receiveStatusMap,
      expressMap: []
    }
  },
  computed: {
    ...mapGetters(['refundStatusMap', 'refundTypeMap', 'address', 'supportPhone'])
  },
  activated () {
    this.getDetail()
    this.getExpressMap()
  },
  deactivated () {
    resetForm(this.form)
    this.collepseActiveNames = []
  },
  methods: {
    async getDetail () {
      try {
        this.loaded = false
        const { id, refundDetail } = this
        const { result } = await getRefundOrderDetail({ id })
        this.refundStatus = result.returnStatus;  // eslint-disable-line
        ({
          id: refundDetail.id,
          orderId: refundDetail.orderId,
          orderDetailId: refundDetail.orderDetailId,
          refundType: refundDetail.refundType,
          receiveStatus: refundDetail.receiveStatus,
          shipSn: refundDetail.shipSn,
          shipChannelText: refundDetail.shipChannelText,
          refundUserName: refundDetail.refundUserName,
          refundMobile: refundDetail.refundMobile,
          refundAddress: refundDetail.refundAddress,
          actualPayAmount: refundDetail.actualPayAmount,
          shouldRefund: refundDetail.shouldRefund,
          productId: refundDetail.productId,
          productPic: refundDetail.productPic,
          productName: refundDetail.productName,
          productCount: refundDetail.productCount,
          skuName: refundDetail.skuName,
          applyReasonText: refundDetail.applyReasonText,
          applyTime: refundDetail.applyTime,
          applyContent: refundDetail.applyContent,
          pictures: refundDetail.pictures
        } = result)
        if (result.refundMobile) {
          this.refundDetail.refundMobile = replaceMobile(result.refundMobile)
        }
        this.refundProgress = result.operations.map(item => {
          item.createTimeArray = rebuildDate(item.createTime)
          return item
        })
        this.loaded = true
      } catch (e) {
        throw e
      }
    },
    // 获取快递公司数据字典
    async getExpressMap () {
      const { result: expressMap } = await getExpressMap(expressMapCode)
      this.expressMap = expressMap
      this.pickerColumns[0].values = expressMap.map(item => item.dictDataValue)
    },
    onPickerConfirm (selected) {
      this.form.expressName = selected[0]
      this.isPickerShow = false
    },
    async submit () {
      try {
        if (!this.form.expressName) return this.$toast('请选择物流公司')
        if (!this.form.expressNo.trim()) return this.$toast('请输入快递单号')
        const { dictDataKey: shipChannel } = this.expressMap.find(item => item.dictDataValue === this.form.expressName)
        const params = {
          id: this.id,
          shipChannel,
          shipSn: this.form.expressNo
        }
        await submitExpressInfo(params)
        this.$success('提交申请成功')
        this.getDetail()
      } catch (e) {
        throw e
      }
    },
    async cancelApplication () {
      try {
        const { id } = this
        await this.$confirm('退单正在审核中，确定要取消？')
        await cancelRefundApplication({ id })
        this.$success('取消申请成功')
        this.getDetail()
      } catch (e) {
        throw e
      }
    },
    doCopy () {
      this.$copyText(this.address)
        .then(e => {
          this.$toast('复制成功')
        }, e => {
          console.log(e)
        })
    }
  }
}
</script>

<style module lang="scss">
  .refund-detail {
    padding: 28px 24px 140px;
  }
  .title {
    margin-bottom: 28px;
  }
  .panel {
    background-color: #fff;
    border-radius: $--radius1;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .express-panel {
    margin-top: 25px;
    .express-item {
      padding: 28px 24px;
      display: flex;
      align-items: center;
      border-top: 1px solid #F0F0F0;

      &:nth-of-type(1) {
        border: none;
      }
    }
    .express-icon {
      width: 64px;
    }
    .right {
      flex: 1;
      width: 64px;
      padding-left: 28px;
    }
    .main {
      font-size: 28px;
      color: #2E2E2E;
      line-height: 40px;
      margin-bottom: 10px;
    }
    .sub {
      font-size: 24px;
      color: #333333;
      line-height: 34px;
    }
    .phone {
      padding-left: 16px;
    }
    .bold {
      font-family: HelveticaNeue-Medium;
      font-weight: 500;
    }
  }

  .express-info-panel {
    padding-left: 28px;
    .express-no {
      font-size: 28px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: #333333;
      line-height: 40px;
    }
  }

  .amount-panel {
    .top {
      padding: 28px 24px;
    }
    .bottom {
      padding: 24px;
      border-top: 1px solid #F0F0F0;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 30px;
      color: #333;
      line-height: 40px;
      .item-right {
        display: block;
        text-align: right;
      }
    }
    .larger {
      margin-top: 14px;
      font-size: 34px;
      .price {
        font-size: 36px;
      }
    }
    .tips {
      font-size: 22px;
      line-height: 32px;
      margin-top: 14px;
      color: #999999;
      text-align: right;
    }
    .price {
      color: #FE7700;
      font-family: HelveticaNeue-Medium;
      font-size: 34px;
      font-weight: 500;
    }
  }

  .refund-info-panel {
    padding: 20px 0 20px 24px;
    .product-info {
      position: relative;
      padding: 20px 24px 24px 0;
      margin-top: 20px;
      &:before {
        @include border-half-top(#e7e7e7);
      }
    }
    .info-list {
      padding-right: 24px;
    }
    .img-list-wrapper {
      padding-top: 22px;
      margin-top: 4px;
    }
    .img-list {
      display: grid;
      grid-template-columns: 144px 144px 144px;
      grid-gap: 14px;
      padding-bottom: 20px;
      > img {
        width: 144px;
        height: 144px;
        object-fit: cover;
      }
    }
  }

  .footer-submit {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px 24px;
    background-color: #FFF;
  }

  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 18px 24px 18px 0;
    background-color: #FFF;
    display: flex;
    justify-content: flex-end;
    > button {
      margin-left: 20px;
    }
  }

  .border-top {
    position: relative;
    &:before {
      @include border-half-top(#F0F0F0);
    }
  }
  .bold {
    font-weight: bold;
  }

  /** popup start **/
  .popup-title {
    padding: 40px 42px 32px;
    display: flex;
    align-items: center;
    font-size:40px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: #000000;
    line-height: 56px;
  }
  .popup-title-icon {
    width: 26px;
    margin-right: 26px
  }
  .popup-content {
    padding: 35px 30px;
  }
  .popup-address {
    padding: 20px 30px;
    margin-bottom: 20px;
    background-color: #F9F9F9;
    display: flex;
    align-items: center;
    font-size: 28px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #000;
    line-height: 40px;
    border-radius: 10px;
  }
  .popup-address-text {
    flex: 1;
  }
  .popup-address-left-icon {
    width: 36px;
    margin-right: 24px
  }
  .popup-address-right-icon {
    width: 39px;
    margin-left: 40px
  }
  /** popup end **/

  /** progress start **/
  .refundProgressList {
    padding: 28px 0 8px;
  }
  .refundProgressItem {
    display: flex;
    padding-bottom: 30px;
    &:nth-of-type(1) {
      .datetime {
        color: #333;
      }
      .refundProgressContent {
        color: #333;
        &:before {
          background: linear-gradient(180deg, #FFAF00, #FE7700);
        }
      }
    }
    &:nth-last-of-type(1) {
      padding-bottom: 0;
      > .refundProgressContent {
        &:after {
          display: none;
        }
      }
    }
  }
  .datetime {
    display: inline-flex;
    flex-direction: column;
    text-align: right;
    color: #999;
    > .date {
      font-size: 22px;
      line-height: 32px;
    }
    > .time {
      font-size: 18px;
      line-height: 26px;
    }
  }
  .refundProgressContent {
    position: relative;
    flex: 1;
    padding-left: 62px;
    font-size: 22px;
    line-height: 32px;
    color: #999;
    &:before {
      position: absolute;
      content: '';
      left: 24px;
      top: 10px;
      width: 14px;
      height: 14px;
      border-radius: 7px;
      background: #D8D8D8;
      z-index: 2;
    }
    &:after {
      position: absolute;
      content: '';
      left: 31px;
      top: 24px;
      width: 1px;
      height: 150%;
      border-radius: 7px;
      background-color: #D8D8D8;
      z-index: 1;
    }
  }
  /** progress end **/

  /** skeleton start **/
  .skeleton {
    padding: 28px 40px;
  }
  .skeleton1 {
    width: 200px;
    height: 53px;
  }
  .skeleton2 {
    width: 500px;
    height: 37px;
    margin-top: 14px;
  }
  .skeleton3 {
    margin-top: 28px;
    background-color: #fff;
  }
  .skeleton4 {
    margin-top: 30px;
    padding: 24px 28px;
    background-color: #fff;
  }
  .skeleton4-1 {
    width: 364px;
    height: 32px;
  }
  .skeleton4-2 {
    width: 214px;
    height: 32px;
    margin-top: 8px;
  }
  .skeleton4-4 {
    width: 112px;
    height: 37px;
    margin-top: 80px;
  }
  .skeleton4-5 {
    width: 300px;
    height: 40px;
    margin-top: 12px;
  }
  .skeleton4-6 {
    width: 150px;
    height: 37px;
    margin-top: 50px;
  }
  .skeleton4-7 {
    width: 250px;
    height: 37px;
    margin-top: 14px;
  }
  .skeleton4-8 {
    width: 350px;
    height: 40px;
    margin-top: 50px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
  /** skeleton end **/
</style>

<style lang="scss">
.refund-detail {
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
    color: #333333;
    line-height: 40px;
  }
  .pl-fields_right > .pl-fields_right_icon {
    fill: #DEDEDE;
  }
  .pl-fields_right > .pl-fields_right_text {
    color: #000000;
  }

  .pl-form-item .pl-form-item_content {
    height: 108px;
    padding-right: 28px;
  }

  .pl-input > .pl-input_box > input {
    &::-webkit-input-placeholder {
      text-align: right;
      font-size: 26px;
      color: #CCCCCC;
      line-height: 36px;
    }
  }

  .pl-list {
    line-height: 34px;
    margin-bottom: 20px;
  }

  .pl-collapse-item__title {
    font-size: 24px;
    color: #666666;
    line-height: 34px;
  }
}
</style>
