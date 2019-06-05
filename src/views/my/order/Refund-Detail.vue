<template>
  <div
    class="refund-detail"
    :class="$style.refundDetail"
  >
    <div style="position: relative;">
      <top-text
        title="退换货"
        tip="请根据商家收货地址，将商品寄回"
      />
      <!--<top-text title="退款成功" tip="2018年7月23日 17:31:32" />-->
      <!--<top-text title="退款失败" tip="2018年7月23日 17:31:32" />-->
      <a :href="`tel:${$store.getters.supportPhone}`">
        <pl-svg
          :class="$style.callMe"
          name="phone2"
        />
      </a>
    </div>

    <section :class="[$style.panel, $style.expressPanel]">
      <div :class="$style.expressItem">
        <pl-svg
          :class="$style.expressIcon"
          name="express"
        />
        <div :class="$style.right">
          <div :class="[$style.main, $style.bold]">
            顺丰快递
          </div>
          <div :class="$style.sub">
            运单号：123467890890
          </div>
        </div>
      </div>
      <div :class="$style.expressItem">
        <pl-svg
          :class="$style.expressIcon"
          name="express"
        />
        <div :class="$style.right">
          <div :class="$style.main">
            <span
              :class="$style.name"
              v-text="'退货信息：王五'"
            />
            <span
              :class="$style.phone"
              v-text="'136****8888'"
            />
          </div>
          <div :class="$style.sub">
            陕西省 西安市 新城区 xx街道 撒大大大说的的的阿斯顿为峰峰
          </div>
        </div>
      </div>
    </section>

    <section :class="[$style.panel, $style.expressInfoPanel]">
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
            <div :class="$style.price">
              ￥76.64
            </div>
            <div :class="$style.tips">
              运费不可退，如有疑问，请联系商家协商
            </div>
            <div :class="$style.tips">
              <div>退款返还您的实际付款金额，优惠劵将不予退回</div>
              <div>退款到帐时间，请查看您的付款账户</div>
            </div>
          </span>
        </div>
        <div :class="[$style.item, $style.larger]">
          <span :class="[$style.itemLeft, $style.bold]">
            实退金额：
          </span>
          <span :class="[$style.itemRight, $style.price]">
            ￥20.00
          </span>
        </div>
      </div>
      <div
        v-if="1"
        :class="$style.bottom"
      >
        <collapse v-model="collepseActiveNames">
          <collapse-item
            name="1"
            title="退款进度"
          >
            <template slot="default">
              您的退款申请已受理完成，到账周期请查看退款明细
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
          :img="'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/S1TG7SeB-NNr5dAtb-lbBjEtQX-pB9jMx6w_1556513907615.png'"
          :name="'McQ Alexander McQueen 2018春夏新款棉氨男士…'"
          :option="'课程：英语互动'"
          hide-price
        />
        <!-- <order-item
          v-for="(item, i) of productsDetail"
          :key="i"
          :img="item.mediaInfoModels[0].mediaUrl"
          :name="'McQ Alexander McQueen 2018春夏新款棉氨男士…'"
          :option="'课程：英语互动'"
          count="12"
          price="123"
          route-name="Lesson"
          :product-seq="item.productSeq"
        /> -->
      </div>
      <div :class="$style.infoList">
        <pl-list
          title="退单编号："
          :content="'2938794686'"
        />
        <pl-list
          title="服务类型："
          :content="'退款退货'"
        />
        <pl-list
          title="货物状态："
          :content="'未收到货'"
        />
        <pl-list
          title="退款原因："
          :content="'质量问题'"
        />
        <pl-list
          title="申请件数："
          :content="'1件'"
        />
        <pl-list
          title="申请时间："
          :content="'2017-12-18 10:5'"
        />
        <pl-list
          :class="$style.imgListWrapper"
          title="问题描述："
        >
          <div :class="$style.imgList">
            <img
              v-for="(img, i) of imgList"
              :key="i"
              :src="img"
              v-gallery
              v-img-error
              alt="退款图片"
            >
          </div>
        </pl-list>
        <pl-list
          title="问题描述："
          :content="'质量有问题'"
        />
      </div>
    </div>

    <div
      v-if="1"
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
        @click="deleteOrder"
      >
        删除订单
      </pl-button>
      <pl-button
        round
        plain
        @click="() => {}"
      >
        联系我们
      </pl-button>
      <pl-button
        round
        plain
      >
        更改退单
      </pl-button>
      <pl-button
        round
        plain
        @click="cancel"
      >
        取消申请
      </pl-button>
      <!-- <pl-button
        round
        plain
      >
        重新申请
      </pl-button> -->
    </div>

    <pl-popup
      ref="picker"
      :show.sync="isPickerShow"
      :show-close-icon="false"
    >
      <picker
        show-toolbar
        :columns="pickerColumns"
        @change="onPickerChange"
        @confirm="onPickerConfirm"
        @cancel="onPickerCancel"
      />
    </pl-popup>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import ModuleTitle from '../../../components/Module-Title.vue'
import OrderItem from '../../../components/item/Order-Item.vue'
import Collapse from '../../../components/penglai-ui/collapse/Collapse.vue'
import CollapseItem from '../../../components/penglai-ui/collapse/Collapse-Item.vue'
import Picker from '../../../components/penglai-ui/picker/Picker.vue'
import { getRefundDetail } from '../../../apis/order-manager'

const express = {
  '顺丰快递': ['1', '2', '3', '4'],
  '韵达快递': ['11', '22', '33', '44'],
  '圆通快递': ['111', '222', '333', '444'],
  '申通快递': ['1111', '2222', '3333', '4444']
}

const pickerColumns = [
  {
    values: Object.keys(express),
    className: 'column1'
  },
  {
    values: express['顺丰快递'],
    className: 'column2',
    defaultIndex: 2
  }
]

export default {
  name: 'RefundDetail',
  components: {
    TopText,
    ModuleTitle,
    OrderItem,
    Collapse,
    CollapseItem,
    Picker
  },
  data () {
    return {
      serviceType: '',
      refundId: '',
      applyDate: '',
      problemDesc: '',
      refundAmount: '',
      productsDetail: [],
      problemImages: [],
      form: {
        expressName: '',
        expressNo: ''
      },
      isPickerShow: false,
      pickerColumns,
      collepseActiveNames: [],
      imgList: [
        'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/S1TG7SeB-NNr5dAtb-lbBjEtQX-pB9jMx6w_1556513907615.png',
        'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/S1TG7SeB-NNr5dAtb-lbBjEtQX-pB9jMx6w_1556513907615.png',
        'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/S1TG7SeB-NNr5dAtb-lbBjEtQX-pB9jMx6w_1556513907615.png',
        'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/S1TG7SeB-NNr5dAtb-lbBjEtQX-pB9jMx6w_1556513907615.png',
        'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/S1TG7SeB-NNr5dAtb-lbBjEtQX-pB9jMx6w_1556513907615.png',
        'http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/S1TG7SeB-NNr5dAtb-lbBjEtQX-pB9jMx6w_1556513907615.png'
      ]
    }
  },
  props: {
    orderSn: {
      type: String,
      default: null
    }
  },
  activated () {
    // this.getDetail()
  },
  methods: {
    async getDetail () {
      try {
        let { result } = await getRefundDetail(this.orderSn)
        let { serviceType, refundId, applyDate, problemDesc, refundAmount, productsDetail, problemImages } = result
        this.serviceType = serviceType
        this.refundId = refundId
        this.applyDate = applyDate
        this.problemDesc = problemDesc
        this.refundAmount = Number(refundAmount) || 0
        this.productsDetail = productsDetail || []
        this.problemImages = problemImages || []
      } catch (e) {
        throw e
      }
    },
    showPicker () {
    },
    onPickerChange (picker, value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`)
      picker.setColumnValues(1, express[value[0]])
    },
    onPickerConfirm (picker, value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`)
      this.form.expressName = value[0]
      this.isPickerShow = false
    },
    onPickerCancel () {
      this.isPickerShow = false
    },
    submit () {
      if (!this.form.expressName.trim()) return this.$toast('请选择物流公司')
    },
    async deleteOrder () {
      await this.$confirm('确认删除订单？')
    },
    async cancel () {
      await this.$confirm('确认要关闭退货申请？')
    }
  }
}
</script>

<style module lang="scss">
  .refund-detail {
    padding: 28px 24px 140px;
  }
  .call-me {
    position: absolute;
    top: -28px;
    right: 40px;
    width: 38px;
    height: 80px;
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
      margin-top: 10px;
      font-size: 34px;
      .price {
        font-size: 36px;
      }
    }
    .tips {
      font-size: 22px;
      line-height: 32px;
      margin-top: 10px;
      color: #999999
    }
    .price {
      color: #FE7700;
      font-family: HelveticaNeue-Medium;
      font-size: 34px;
      font-weight: 500;
    }
  }

  .refund-info-panel {
    padding: 20px 24px 20px;
    .product-info {
      position: relative;
      padding: 20px 0;
      margin-top: 20px;
      &:before {
        @include border-half-top(#e7e7e7);
      }
    }
    .img-list-wrapper {
      position: relative;
      padding-top: 22px;
      margin-top: 4px;
      &:before {
        @include border-half-top(#F0F0F0);
      }
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

  .bold {
    font-weight: bold;
  }
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
