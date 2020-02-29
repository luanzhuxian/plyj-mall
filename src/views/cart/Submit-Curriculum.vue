<template>
  <div :class="$style.submitCurriculum">
    <div :class="$style.product">
      <div :class="$style.detail">
        <img :src="courseDetail.courseImg" alt="">
        <div :class="$style.right">
          <div :class="$style.name">
            {{ courseDetail.courseName }}
          </div>
          <div :class="$style.price">
            {{ courseDetail.sellingPrice }}
          </div>
          <div :class="$style.tips">
            购买后即可观看视频课程，不支持退款
            一次性收费
          </div>
        </div>
      </div>
      <div :class="$style.total">
        总计：<i>{{ courseDetail.sellingPrice }}</i>
      </div>
    </div>
    <div :class="$style.bottom">
      <div :class="$style.left">
        <div class="fz-20 gray-2">合计</div>
        <div class="fz-32">{{ courseDetail.sellingPrice }}</div>
      </div>
      <pl-button
        :class="$style.button"
        :loading="submiting"
        type="warning"
        size="large"
        @click="submitOrder"
      >
        确认提交
      </pl-button>
    </div>

    <div :class="$style.itemSelector" @click.capture="chooseContact">
      <pl-fields
        size="middle"
        text="联系人信息"
        icon="icon-contact"
        :icon-gap="12"
        show-right-icon
        left-text-weight="bold"
      >
        <div v-show="contactInfoModel.name && contactInfoModel.mobile" :class="$style.contactDetail">
          <span class="fz-28" v-text="contactInfoModel.name" />
          <span class="fz-28" v-text="contactInfoModel.mobile" />
        </div>
      </pl-fields>
    </div>

    <pl-popup
      :show.sync="showContactPopup"
      :close-on-click-modal="false"
      @close="popupClose"
    >
      <div :class="$style.addContact">
        <div :class="$style.addContactTop">
          联系人信息
        </div>
        <pl-form :model="contactInfoForm" :rules="rules" ref="contactForm">
          <pl-form-item prop="name" label="姓名：" :label-width="204" :gap-top="20">
            <pl-input v-model="contactInfoForm.name" />
          </pl-form-item>
          <pl-form-item prop="mobile" label="手机号码：" :label-width="204" :gap-top="20">
            <pl-input v-model="contactInfoForm.mobile" />
          </pl-form-item>
        </pl-form>
        <pl-button size="huge" type="warning" @click="useContact">
          使用
        </pl-button>
      </div>
    </pl-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkLength, isPhone } from '../../assets/js/validate'
import { getCourseDetail, submitOrderAndPay } from '../../apis/product'
import { setTimeoutSync } from '../../assets/js/util'
import wechatPay from '../../assets/js/wechat/wechat-pay'

export default {
  name: 'SubmitCurriculum',
  data () {
    this.requestPayDataCount = 0
    return {
      showContactPopup: false,
      submiting: false,
      courseDetail: {},
      contactInfoForm: {
        name: '',
        mobile: ''
      },
      contactInfoModel: {
        name: '',
        mobile: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入联系人姓名' },
          { validator: checkLength(12), message: '联系人姓名为1~12个字符' }
        ],
        mobile: [
          { required: true, message: '请输入联系人手机号' },
          { validator: isPhone, message: '联系人手机号格式错误' }
        ]
      }
    }
  },
  props: {
    productId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['mobile', 'userName'])
  },
  async activated () {
    // 联系人信息
    let contactModel = JSON.parse(localStorage.getItem('CONTACT_INFO_MODEL'))
    this.contactInfoModel = contactModel || { name: this.realName || this.userName, mobile: this.mobile }
    try {
      this.getCourseDetail()
    } catch (e) {
      throw e
    }
  },
  methods: {
    async getCourseDetail () {
      try {
        let { result } = await getCourseDetail(this.productId)
        result.sellingPrice = result.sellingPrice ? result.sellingPrice : 0
        this.courseDetail = result
      } catch (e) {
        throw e
      }
    },
    chooseContact () {
      this.contactInfoForm = Object.assign({}, this.contactInfoForm, this.contactInfoModel)
      this.showContactPopup = true
    },
    useContact () {
      if (this.$refs.contactForm.validate()) {
        this.showContactPopup = false
        this.contactInfoModel = Object.assign({}, this.contactInfoModel, this.contactInfoForm)
        localStorage.setItem('CONTACT_INFO_MODEL', JSON.stringify(this.contactInfoModel))
      }
    },
    popupClose () {
      this.contactInfoForm = {
        name: '',
        mobile: ''
      }
    },
    async submitOrder () {
      if (!this.contactInfoModel.name || !this.contactInfoModel.mobile) {
        this.$confirm('您还没有添加联系人信息，请先添加联系人信息')
          .then(() => {
            this.showContactPopup = true
          })
        return
      }
      this.submiting = true
      // 每500ms请求一次支付数据，如果请求次数超过20次，就终止请求
      // 下次请求的开始时间 =  500ms + 当前请求时间
      if (this.requestPayDataCount >= 20) {
        this.requestPayDataCount = 0
        this.submiting = false
        this.$error('支付失败')
        return
      }
      await setTimeoutSync(500)
      try {
        let { result: payData } = await submitOrderAndPay(this.productId, this.contactInfoModel)
        if (!payData) { // 如果没有拿到请求数据，再次尝试发起请求
          this.requestPayDataCount++
          await this.submitOrder()
        } else { // 如果有，则发起支付
          if (payData && payData.appId) { // 返回体中有appId时则为非零元课程,非0元需要调用微信支付
            await this.pay(payData)
          } else { // 0元商品无需支付
            this.$success('支付成功')
            this.submiting = false
            this.goVideoLibrary()
          }
        }
      } catch (e) {
        this.requestPayDataCount = 0
        this.submiting = false
        throw e
      }
    },
    async pay (CREDENTIAL) { // 支付
      try {
        if (CREDENTIAL.appId) {
          await wechatPay(CREDENTIAL)
          this.$success('支付成功')
          this.submiting = false
          this.goVideoLibrary()
        }
      } catch (e) {
        throw e
      }
    },
    goVideoLibrary () {
      // 支付成功，去视频库看视频
      this.$router.push({ name: 'MyCourses' })
    }
  }
}
</script>

<style module lang="scss">
  .submit-curriculum {
    color: #000;
    padding: 20px 24px 120px;
  }
  .product {
    padding: 26px 24px;
    background-color: #fff;
    border-radius: 20px;
  }
  .detail {
    display: flex;
    > img {
      width: 244px;
      height: 164px;
      margin-right: 20px;
      object-fit: cover;
    }
    > .right {
      > .name {
        height: 64px;
        margin-bottom: 20px;
        line-height: 32px;
        font-size: 22px;
        @include elps-wrap(2);
      }
      > .price {
        margin-bottom: 8px;
        font-size: 24px;
        &:before {
          content: '￥';
          font-size: 18px;
        }
      }
      > .tips {
        font-size: 18px;
        color: #A8A8A8;
      }
    }
  }
  .total {
    margin-top: 40px;
    text-align: right;
    font-size: 32px;
    font-weight: bold;
    > i {
      color: #FE7700;
      font-weight: 500;
      &:before {
        content: '￥';
        font-size: 20px;
      }
    }
  }
  .bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    padding: 0 24px 0 32px;
    background-color: #fff;
    border-top: 1px solid #e7e7e7;
    > .left {
      > div {
        &:nth-of-type(1) {
          margin-bottom: 4px;
        }
        &:nth-of-type(2):before {
          content: '￥';
          font-size: 20px;
        }
      }
    }
    > .button {
      width: 206px;
      line-height: 80px;
      color: #fff;
      font-size: 32px;
      text-align: center;
      background-color: #F2B036;
      border-radius: 20px;
    }
  }
  .item-selector {
    margin-top: 20px;
    padding-left: 24px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
  }
  .add-contact {
    padding: 40px 20px;
    .add-contact-top {
      margin-bottom: 20px;
      font-size: 40px;
      color: #000;
    }
    button {
      margin-top: 48px;
    }
    label {
      background-color: #f9f9f9 !important;
      padding-left: 32px;
      span {
        color: #999 !important;
      }
    }
  }
  .contact-detail {
    padding: 24px 0;
    > span:nth-of-type(1) {
      margin-right: 24px;
      font-weight: 500;
    }
  }
</style>
