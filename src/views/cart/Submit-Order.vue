<template>
  <div
    v-if="!loading"
    :class="$style.submitOrder"
  >
    <div
      :class="$style.address + ' radius-20'"
      v-if="physicalProducts.length > 0"
    >
      <AddressItem ref="addAddressItem" />
    </div>

    <!-- *************************实体************************* -->
    <div
      v-if="physicalProducts.length > 0"
      :class="$style.productBox"
    >
      <div :class="$style.orderItemBox">
        <OrderItem
          v-for="(item, index) of physicalProducts"
          :key="index"
          :img="item.productImg"
          :name="item.productName"
          :count="item.count"
          :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
          :price="item.price"
          :support-refund="item.supportRefund"
          :gap="32"
          :product-type="1"
          :active-product="activeProduct"
          :allow-invoice="item.showInvoice"
          border
        />
      </div>

      <div :class="$style.otherInfo">
        <div :class="$style.infoItem">
          <div
            :class="{
              [$style.freightType]: true,
              [$style.hasFreight]: freight > 0
            }"
          >
            <span :class="$style.itemLabel">配送方式</span>
            <span v-if="freight === 0" :class="$style.itemContent">
              快递免邮
            </span>
            <span v-if="freight > 0" :class="$style.itemContent">
              普通快递
            </span>
          </div>
          <span v-if="freight > 0" :class="$style.freight">
            ¥ {{ freight }}
          </span>
        </div>
        <div :class="$style.infoItem" v-if="isCart">
          <div :class="$style.freightType">
            <span :class="$style.itemLabel">订单备注</span>
            <input
              :class="$style.remark"
              type="text"
              placeholder="选填"
              v-model="physicalRemark"
            >
          </div>
        </div>

        <div :class="$style.infoItem" v-if="!isCart">
          <div :class="$style.freightType">
            <span :class="$style.itemLabel">购买数量</span>
            <div :class="$style.editCount">
              <span>剩余{{ activeAllResidue === 1 ? physicalProducts[0].activeStock : physicalProducts[0].stock }}件</span>
              <Count
                :min="physicalProducts[0].minBuyNum"
                :max="physicalProducts[0].purchaseQuantity || physicalProducts[0].stock"
                :count="physicalProducts[0].count"
                @change="(count, next) => { countChange(count, physicalProducts[0], next) }"
              />
            </div>
          </div>
        </div>
        <div :class="$style.infoItem" v-if="coupon.amount && !isCart && activeProduct === 1" @click="showCoupon = true">
          <div :class="$style.freightType">
            <span :class="$style.itemLabel">优惠券</span>
            <span :class="$style.subtotalPrice">-¥{{ coupon.amount }}  <pl-icon name="icon-arrow-right" color="#ccc" size="22" /></span>
          </div>
        </div>

        <div :class="$style.infoItem">
          <div :class="$style.freightType">
            <span :class="$style.itemLabel">商品金额</span>
            <span :class="$style.subtotalPrice + ' rmb'">{{ amount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- *************************虚拟************************* -->
    <template v-if="virtualProducts.length > 0">
      <div
        v-for="(item, index) of virtualProducts"
        :key="item.skuCode1"
        :class="$style.productBox"
      >
        <div :class="$style.orderItemBox">
          <OrderItem
            :key="index"
            :img="item.productImg"
            :name="item.productName"
            :count="item.count"
            :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
            :price="item.price"
            :support-refund="item.supportRefund"
            is-submit
            :gap="32"
            :product-type="2"
            :active-product="activeProduct"
            :allow-invoice="item.showInvoice"
            border
          />
        </div>
        <div :class="$style.otherInfo">
          <div :class="$style.infoItem">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">使用时间</span>
              <p class="fz-24" v-if="item.validityPeriodStart">
                <span>
                  {{ item.validityPeriodStart | dateFormat('YYYY.MM.DD') }}
                </span>
                <template v-if="item.validityPeriodStart.split(' ')[0] !== item.validityPeriodEnd.split(' ')[0]">
                  -
                  <span>
                    {{ item.validityPeriodEnd | dateFormat('YYYY.MM.DD') }}
                  </span>
                </template>
              </p>
              <p v-else class="fz-24">
                长期有效
              </p>
            </div>
          </div>

          <div
            :class="{
              [$style.infoItem]: true,
              [$style.lessonError]: lessonErrorId === item.skuCode1
            }"
            v-if="isCart && item.needStudentInfo" @click="selectStudent(item)"
          >
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">学员信息</span>
              <div :class="$style.lessonErrorTip" v-if="lessonErrorId === item.skuCode1">
                <pl-svg name="warning" color="#F24724" />
                <span v-text="lessonErrorTip" />
              </div>
              <div>
                <span v-if="CHECKED_STUDENT[item.skuCode1 + item.skuCode2]">已选{{ CHECKED_STUDENT[item.skuCode1 + item.skuCode2].length }}人</span>
                <span v-else>已选0人</span>
                <pl-svg :class="$style.rightArrow" name="right" color="#ccc" />
              </div>
            </div>
          </div>

          <div :class="$style.infoItem" v-if="isCart">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">订单备注</span>
              <input
                :class="$style.remark"
                type="text"
                placeholder="选填"
                v-model="item.remark"
              >
            </div>
          </div>
          <div :class="$style.infoItem" v-if="!isCart">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">购买数量</span>
              <div :class="$style.editCount">
                <!-- 活动商品的库存需要特殊处理 -->
                <span>剩余{{ activeProduct !== 1 && preActived === 2 ? item.activeStock : item.stock }}件</span>
                <!-- activeProduct = 3（秒杀商品，需要使用秒杀商品的限购数） -->
                <Count
                  :min="item.minBuyNum"
                  :max="(activeProduct === 3 && preActived === 2 && item.activityLimit) ? item.activityLimit : (item.purchaseQuantity || item.stock)"
                  :count="item.count"
                  @change="(count, next) => { countChange(count, item, next) }"
                />
              </div>
            </div>
          </div>
          <div :class="$style.infoItem" v-if="coupon.amount && !isCart && activeProduct === 1" @click="showCoupon = true">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">优惠券</span>
              <span :class="$style.subtotalPrice">-¥{{ coupon.amount }}  <pl-icon name="icon-arrow-right" color="#ccc" size="22" /></span>
            </div>
          </div>

          <div :class="$style.infoItem">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">商品金额</span>
              <span :class="$style.subtotalPrice + ' rmb'">{{ item.amount }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- *************************课程************************* -->
    <template v-if="lessonList.length > 0">
      <div
        v-for="(item, index) of lessonList"
        :key="index"
        :class="$style.productBox"
      >
        <div :class="$style.orderItemBox">
          <OrderItem
            :key="index"
            :img="item.productImg"
            :name="item.productName"
            :count="item.count"
            :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
            :price="item.price"
            :support-refund="item.supportRefund"
            is-submit
            :gap="32"
            :product-type="2"
            :active-product="activeProduct"
            :allow-invoice="item.showInvoice"
            border
          />
        </div>
        <div :class="$style.otherInfo">
          <div :class="$style.infoItem">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">使用时间</span>
              <p class="fz-24" v-if="item.validityPeriodStart">
                <span>
                  {{ item.validityPeriodStart | dateFormat('YYYY.MM.DD') }}
                </span>
                <template v-if="item.validityPeriodStart.split(' ')[0] !== item.validityPeriodEnd.split(' ')[0]">
                  -
                  <span>
                    {{ item.validityPeriodEnd | dateFormat('YYYY.MM.DD') }}
                  </span>
                </template>
              </p>
              <p v-else class="fz-24">
                长期有效
              </p>
            </div>
          </div>

          <div
            :class="{
              [$style.infoItem]: true,
              [$style.lessonError]: lessonErrorId === item.skuCode1
            }"
            v-if="isCart && item.needStudentInfo" @click="selectStudent(item)"
          >
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">学员信息</span>
              <div :class="$style.lessonErrorTip" v-if="lessonErrorId === item.skuCode1">
                <pl-svg name="warning" color="#F24724" />
                <span v-text="lessonErrorTip" />
              </div>
              <div>
                <span v-if="CHECKED_STUDENT[item.skuCode1 + item.skuCode2]">已选{{ CHECKED_STUDENT[item.skuCode1 + item.skuCode2].length }}人</span>
                <span v-else>已选0人</span>
                <pl-svg :class="$style.rightArrow" name="right" color="#ccc" />
              </div>
            </div>
          </div>

          <div :class="$style.infoItem" v-if="isCart">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">订单备注</span>
              <input
                :class="$style.remark"
                type="text"
                placeholder="选填"
                v-model="item.remark"
              >
            </div>
          </div>

          <div :class="$style.infoItem" v-if="!isCart">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">购买数量</span>
              <div :class="$style.editCount">
                <span>剩余{{ activeProduct !== 1 && preActived === 2 ? item.activeStock : item.stock }}件</span>
                <Count
                  :min="item.minBuyNum"
                  :max="(activeProduct === 3 && preActived === 2 && item.activityLimit) ? item.activityLimit : (item.purchaseQuantity || item.stock)"
                  :count="item.count"
                  @change="(count, next) => { countChange(count, item, next) }"
                />
              </div>
            </div>
          </div>
          <div :class="$style.infoItem" v-if="coupon.amount && !isCart && activeProduct === 1" @click="showCoupon = true">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">优惠券</span>
              <span :class="$style.subtotalPrice">-¥{{ coupon.amount }}  <pl-icon name="icon-arrow-right" color="#ccc" size="22" /></span>
            </div>
          </div>

          <div :class="$style.infoItem">
            <div :class="$style.freightType">
              <span :class="$style.itemLabel">商品金额</span>
              <span :class="$style.subtotalPrice + ' rmb'">{{ item.amount }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div :class="$style.confirm">
      <div>
        <span class="fz-20 gray-2">合计</span>
        <span
          class="rmb fz-32"
          v-text="totalAmount || 0"
        />
      </div>
      <pl-button
        style="width: 28vw;"
        :loading="submiting"
        type="warning"
        size="large"
        @click="submitOrder"
      >
        确认付款
      </pl-button>
    </div>

    <div
      v-if="coupon.amount && isCart && activeProduct === 1"
      :class="$style.itemSelector"
      @click.capture="showCoupon = true"
    >
      <pl-fields
        size="middle"
        text="优惠"
        icon="icon-coupon1"
        :icon-gap="12"
        show-right-icon
        :right-text="'-¥' + coupon.amount"
        left-text-weight="bold"
      />
    </div>

    <div
      v-if="totalAmount > 0 && showInvoiceSelector && activeProduct === 1"
      :class="$style.itemSelector" @click.capture="selectInvoice"
    >
      <pl-fields
        size="middle"
        text="发票"
        icon="icon-invoice"
        :icon-gap="12"
        show-right-icon
        :right-text="invioceType === 0 ? '不需要' : '纸质发票'"
        left-text-weight="bold"
      />
    </div>

    <div
      v-if="needStudentList.length === 1 && needStudentList[0].needStudentInfo && !isCart"
      :class="$style.itemSelector"
      @click.capture="selectStudent(needStudentList[0])"
    >
      <pl-fields
        size="middle"
        text="学员信息"
        icon="icon-name-card"
        :icon-gap="12"
        :right-text="`已选${getStudentCountByProId(needStudentList[0].skuCode1 + needStudentList[0].skuCode2)}人`"
        show-right-icon
        left-text-weight="bold"
      >
        <ul :class="$style.studentList" v-show="CHECKED_STUDENT[needStudentList[0].skuCode1 + needStudentList[0].skuCode2] && CHECKED_STUDENT[needStudentList[0].skuCode1 + needStudentList[0].skuCode2].length > 0">
          <li :class="$style.studentItem" v-for="(item, i) of CHECKED_STUDENT[needStudentList[0].skuCode1 + needStudentList[0].skuCode2]" :key="i">
            <p :class="$style.studentName">
              <span>姓名</span>
              <span v-text="item.stuName" />
            </p>
            <p :class="$style.studentPhone">
              <span>电话</span>
              <span v-text="item.stuMobile" />
            </p>
          </li>
        </ul>
      </pl-fields>
    </div>
    <div v-if="physicalProducts.length === 0" :class="$style.itemSelector" @click.capture="chooseContact">
      <pl-fields
        size="middle"
        text="联系人信息"
        icon="icon-contact"
        :icon-gap="12"
        :right-text="contactInfoModel.name && contactInfoModel.mobile ? '已选择' : `未选择`"
        show-right-icon
        left-text-weight="bold"
      >
        <div v-show="contactInfoModel.name && contactInfoModel.mobile" :class="$style.contactDetail">
          <span class="fz-28" v-text="contactInfoModel.name" />
          <span class="fz-28" v-text="contactInfoModel.mobile" />
        </div>
      </pl-fields>
    </div>

    <!-- 订单备注（只有一个商品时显示） -->
    <div :class="$style.oneProductMark" v-if="!isCart">
      <span>订单备注</span>
      <input type="text" placeholder="请和商家协商一致后填写" v-model="remark">
    </div>

    <pl-popup :show.sync="showPopup">
      <div :class="$style.invioceBox">
        <div :class="$style.title">
          是否需要发票？
        </div>
        <div :class="$style.content">
          <button @click="noNeed">
            不需要
          </button>
          <button @click="need">
            纸质发票
          </button>
        </div>
      </div>
    </pl-popup>

    <pl-popup
      :show.sync="showContactPopup"
      :close-on-click-modal="false"
      @close="contactInfoForm.name = ''; contactInfoForm.mobile = '';"
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

    <!-- 优惠券弹框 -->
    <pl-popup
      :show.sync="showCoupon"
      title="领取优惠券"
      title-align="left"
    >
      <div :class="$style.coupon">
        <p class="fz-28 gray-3">先领优惠券，购物更划算</p>
        <div :class="$style.couponList">
          <template v-for="(item, i) of couponList">
            <CouponItem
              :key="i"
              :name="item.couponName"
              :amount="item.amount"
              :full="item.useLimitAmount"
              :subtract="item.amount"
              :instruction="item.brief"
              :use-end-time="item.useEndTime"
              :use-start-time="item.useStartTime"
              :receive-count="item.count"
              :can-go-classify="false"
              is-available-status
              @couponClick="couponClick(item)"
            />
          </template>
        </div>
      </div>
    </pl-popup>
  </div>

  <div
    :class="$style.skeleton"
    v-else
  >
    <div :class="$style.skeleton1">
      <AddressItemSkeleton />
    </div>
    <div :class="$style.skeleton2">
      <div :class="$style.skeleton21 + ' ' + $style.skeAnimation" />
      <OrderItemSkeleton />
      <div :class="$style.skeleton22 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton23 + ' ' + $style.skeAnimation" />
      <div :class="$style.skeleton24 + ' ' + $style.skeAnimation" />
    </div>
  </div>
</template>

<script>
import AddressItem from '../../components/item/Address-Item.vue'
import OrderItem from '../../components/item/Order-Item.vue'
import {
  confirmCart,
  submitOrder
} from '../../apis/shopping-cart'
import { getCouponOfMax, getCouponByPrice } from '../../apis/my-coupon'
import wechatPay from '../../assets/js/wechat/wechat-pay'
import { mapGetters, mapActions } from 'vuex'
import { STUDENTS } from '../../store/mutation-type'
import OrderItemSkeleton from '../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../components/skeleton/Address-Item.vue'
import Count from '../../components/common/Count.vue'
import CouponItem from '../../components/item/Coupon-Item.vue'
import { checkLength, isPhone } from '../../assets/js/validate'
import { resetForm } from '../../assets/js/util'
export default {
  name: 'SubmitOrder',
  components: {
    AddressItem,
    OrderItem,
    OrderItemSkeleton,
    AddressItemSkeleton,
    Count,
    CouponItem
  },
  data () {
    return {
      showPopup: false,
      showContactPopup: false,
      submiting: false,
      loading: false,
      showCoupon: false,
      showInvoiceSelector: false, // 是否显示选择发票
      freight: 0,
      totalAmount: 0,
      amount: 0,
      coupon: {}, // 优惠券信息
      couponList: [], // 优惠券信息
      physicalProducts: [],
      virtualProducts: [],
      lessonList: [],
      needStudentList: [],
      remark: '', // 单商品备注
      physicalRemark: '', // 物理订单备注
      invioceType: 0,
      INVOICE_MODEL: {},
      CHECKED_STUDENT: {},
      rules: {
        name: [
          { required: true, message: '请输入联系人姓名' },
          { validator: checkLength(12), message: '联系人姓名为1~12个字符' }
        ],
        mobile: [
          { required: true, message: '请输入联系人手机号' },
          { validator: isPhone, message: '联系人手机号格式错误' }
        ]
      },
      contactInfoModel: {
        name: '',
        mobile: ''
      },
      contactInfoForm: {
        name: '',
        mobile: ''
      },
      lessonErrorId: '',
      lessonErrorTip: ''
    }
  },
  computed: {
    ...mapGetters(['selectedAddress', 'openId', 'mobile', 'addressList', 'realName', 'userName']),
    // 是否只有一个商品
    isAloneProduct () {
      return this.physicalProducts.length + this.virtualProducts.length + this.lessonList.length === 1
    },
    // 只有一个商品时，返回这个商品
    aloneProduct () {
      if (this.isAloneProduct) {
        return this.lessonList[0] || this.physicalProducts[0] || this.virtualProducts[0]
      } else {
        return null
      }
    },
    isCart () {
      return this.$route.query.isCart === 'YES'
    },
    // 传入的活动类型
    activeProduct () {
      return Number(this.$route.query.activeProduct) || 1
    },
    // 传入的活动状态 2 为进行中
    preActived () {
      return Number(this.$route.query.preActived) || 1
    },
    activityId () {
      return this.$route.query.activityId || ''
    }
  },
  watch: {
    selectedAddress: {
      handler (val) {
        // 地址变化时，如果已经选择了发票，且发票类型为个人，将改变发票信息为当前地址信息
        if (this.INVOICE_MODEL && this.INVOICE_MODEL.invoiceType === 1) {
          this.INVOICE_MODEL.userAddressId = val.sequenceNbr
          this.INVOICE_MODEL.receiverMobile = val.mobile
          this.INVOICE_MODEL.invoiceTitle = val.realName
          sessionStorage.setItem('INVOICE_MODEL', JSON.stringify(this.INVOICE_MODEL))
        }
      },
      deep: true
    },
    remark (val) {
      // 但是底部的备注绑定是共用的备注数据，所以，要将这个共用的备注数据写入到单独商品的备注字段中
      if (this.isAloneProduct) {
        this.aloneProduct.remark = val
      }
    }
  },
  async activated () {
    let selectedStudents // 已选择的学员的key
    let students // 已有学员列表
    let defStudent // 默认学员
    try {
      // 获取商品详情
      await this.getProductDetail()
      // 选择的发票信息（如果有的话）
      this.INVOICE_MODEL = JSON.parse(sessionStorage.getItem('INVOICE_MODEL')) || null
      // 选择的学员信息（如果有的话）
      this.CHECKED_STUDENT = JSON.parse(sessionStorage.getItem('CHECKED_STUDENT')) || {}
      // 每个商品选择的学员信息是一个数组，为了保证这个数组正确的与商品对应起来，CHECKED_STUDENT对象的key都是商品的规格id组成
      selectedStudents = Object.keys(this.CHECKED_STUDENT)
      students = await this[STUDENTS]()
      defStudent = students.find(item => item.defaultStatus === 1)
      // 如果有默认学员，则缓存默认学员，并自动显示
      if (defStudent) {
        for (let item of this.needStudentList) {
          if (selectedStudents.indexOf(item.skuCode1 + item.skuCode2) === -1) { // 如果当前商品没有选择学生
            this.$set(this.CHECKED_STUDENT, item.skuCode1 + item.skuCode2, [defStudent])
          }
        }
        sessionStorage.setItem('CHECKED_STUDENT', JSON.stringify(this.CHECKED_STUDENT))
      }
      this.invioceType = this.INVOICE_MODEL ? 1 : 0
      this.lessonErrorId = ''

      // 联系人信息
      let contactModel = JSON.parse(localStorage.getItem('CONTACT_INFO_MODEL'))
      if (contactModel) {
        this.contactInfoModel.name = contactModel.name || this.userName
        this.contactInfoModel.mobile = contactModel.mobile || this.mobile
      } else {
        this.contactInfoModel.name = this.realName || this.userName
        this.contactInfoModel.mobile = this.mobile
      }
    } catch (e) {
      this.$router.go(-1)
      throw e
    }
  },
  deactivated () {
  },
  methods: {
    ...mapActions([STUDENTS]),
    async getProductDetail (flag) {
      const proList = JSON.parse(sessionStorage.getItem('CONFIRM_LIST'))
      let coupon = {}
      if (this.activeProduct === 1) {
        coupon = await this.getCouponByAmount(proList) // 获取合适的优惠券
      }
      if (!proList || !proList.length) {
        return this.$router.replace({ name: 'Home' })
      }
      if (!flag) this.loading = true
      try {
        // 获取订单详细数据
        const { result } = await confirmCart({
          activeProduct: this.activeProduct,
          activityId: this.activityId,
          cartProducts: proList,
          userCouponId: coupon.id || '',
          addressSeq: this.selectedAddress.sequenceNbr
        })
        const { amount, totalAmount, freight, physicalProducts, virtualProducts, formalClass, experienceClass } = result
        // 为每个虚拟订单都添加备注字段
        for (const p of physicalProducts) {
          p.remark = ''
        }
        formalClass.map(item => { item.type = 'FORMAL_CLASS' })
        experienceClass.map(item => { item.type = 'EXPERIENCE_CLASS' })
        virtualProducts.map(item => { item.type = 'VIRTUAL_GOODS' })
        this.amount = amount
        this.totalAmount = totalAmount
        this.freight = Number(freight)
        this.physicalProducts = physicalProducts
        this.virtualProducts = virtualProducts
        this.lessonList = [...formalClass, ...experienceClass]
        // 是否显示学员选择栏，只要有一个商品允许（item.needStudentInfo === 1）就显示
        this.needStudentList = [...formalClass, ...experienceClass, ...virtualProducts.filter(item => item.needStudentInfo === 1)]
        // 是否显示发票选择栏，只要有一个商品允许（item.showInvoice === 1）就显示
        this.showInvoiceSelector = [...physicalProducts, ...virtualProducts, ...formalClass, ...experienceClass].some(item => item.showInvoice === 1)
        this.loading = false
        // 处理课程和虚拟商品中【预购】商品的使用时间
        for (let item of this.virtualProducts) {
          if (this.activeProduct === 4 && this.preActived === 2) {
            item.validityPeriodStart = item.useStartTime
            item.validityPeriodEnd = item.useEndTime
          }
        }
      } catch (e) {
        throw e
      }
    },
    // 获取当前课程选择的学员数量
    getStudentCountByProId (proId) {
      let currentStudents = this.CHECKED_STUDENT[proId]
      if (currentStudents) {
        return currentStudents.length
      }
      return 0
    },
    // 修改数量
    async countChange (count, pro, next) {
      let CONFIRM_LIST = JSON.parse(sessionStorage.getItem('CONFIRM_LIST'))
      let thisPro = CONFIRM_LIST.find(item => item.productId === pro.productId)
      let thisStudents = this.CHECKED_STUDENT[pro.skuCode1 + pro.skuCode2]
      thisPro.count = count
      sessionStorage.setItem('CONFIRM_LIST', JSON.stringify(CONFIRM_LIST))
      try {
        await this.getProductDetail(true)
        next()
        if (thisStudents && count < thisStudents.length) {
          thisStudents.pop()
          sessionStorage.setItem('CHECKED_STUDENT', JSON.stringify(this.CHECKED_STUDENT))
        }
      } catch (e) {
        throw e
      }
    },
    selectInvoice () {
      if (!this.physicalProducts.length && !this.contactInfoModel.name) {
        this.$warning('请先填写联系人信息')
        return
      }
      this.showPopup = true
    },
    // 根据购买总价获取合适的优惠券
    async getCouponByAmount (proList = []) {
      // 获取优惠券信息
      let amount = proList.map(item => item.price * item.count).reduce((total, price) => {
        return total + price
      })
      const { result } = await getCouponOfMax(amount || 0)
      if (this.activeProduct === 1) {
        await this.getCouponList(amount)
      }
      this.coupon = result
      return result
    },
    selectStudent (pro) {
      sessionStorage.setItem('SELECT_STUDENT_FROM', JSON.stringify({
        name: this.$route.name,
        query: this.$route.query,
        params: this.$route.params
      }))
      this.$router.push({
        name: 'StudentList',
        query: {
          select: 'YES',
          sku: pro.skuCode1 + pro.skuCode2,
          count: pro.count
        }
      })
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
    // 选择优惠券
    async couponClick (item) {
      this.coupon = item
      this.showCoupon = false
      await this.getProductDetail(true, item)
    },
    // 获取优惠券
    async getCouponList (amount) {
      try {
        let { result } = await getCouponByPrice(amount)
        this.couponList = result
      } catch (e) {
        throw e
      }
    },
    // 提交订单
    async submitOrder () {
      const cartProducts = []
      if (this.physicalProducts.length > 0 && this.addressList <= 0) {
        this.$confirm('您还没有收货地址，请先添加收货地址')
          .then(() => {
            this.$refs.addAddressItem.addAddress()
          })
        return
      }
      for (const item of this.physicalProducts) {
        const { productId, skuCode1, skuCode2, count, agentUser } = item
        cartProducts.push({
          productId,
          skuCode1,
          skuCode2,
          productType: 'PHYSICAL_GOODS',
          count,
          agentUser,
          message: this.physicalRemark || this.remark
        })
      }
      for (const item of this.virtualProducts) {
        const { productId, skuCode1, skuCode2, count, agentUser, remark = this.remark, needStudentInfo } = item
        const currentStudent = this.CHECKED_STUDENT[skuCode1 + skuCode2]
        if (!this.hasStudents(needStudentInfo, currentStudent, skuCode1, count)) return
        cartProducts.push({
          productId,
          skuCode1,
          skuCode2,
          productType: 'VIRTUAL_GOODS',
          count,
          agentUser,
          message: remark,
          studentIds: needStudentInfo ? this.CHECKED_STUDENT[skuCode1 + skuCode2].map(item => item.id) : null
        })
      }
      for (const item of this.lessonList) {
        const { productId, skuCode1, skuCode2, count, agentUser, remark = this.remark, needStudentInfo } = item
        const currentStudent = this.CHECKED_STUDENT[skuCode1 + skuCode2]
        if (!this.hasStudents(needStudentInfo, currentStudent, skuCode1, count)) return
        cartProducts.push({
          productId,
          skuCode1,
          skuCode2,
          productType: item.type,
          studentIds: needStudentInfo ? this.CHECKED_STUDENT[skuCode1 + skuCode2].map(item => item.id) : null,
          count,
          agentUser,
          message: remark
        })
      }
      // contactInfoModel
      const data = {
        addressSeq: this.physicalProducts.length > 0 ? this.selectedAddress.sequenceNbr : '',
        cartProducts,
        cartSource: this.isCart,
        invoiceModel: this.INVOICE_MODEL,
        activeProduct: this.isCart ? 1 : this.activeProduct,
        activityId: this.activityId,
        userCouponId: this.coupon.id || ''
      }
      if (this.physicalProducts.length === 0) {
        // 没有实体商品时，必须有联系人信息
        if (!this.contactInfoModel.name || !this.contactInfoModel.mobile) {
          this.$warning('请填写联系人信息')
          return
        }
        data.contactInfoModel = this.contactInfoModel
      }
      try {
        this.submiting = true
        const { result } = await submitOrder(data)
        await this.pay(result, result.orderLists[0], result.orderLists.length)
      } catch (e) {
        if (e.message !== '取消支付') {
          throw e
        }
      } finally {
        this.submiting = false
      }
    },
    /**
     * 判断是否选择了学生
     * @param needStudent {Boolean} 是否需要学员
     * @param currentStudent {Array} 已选学生列表
     * @param skuCode1 {string} 规格1的id，作为每个单独商品学员数据存储的key
     * @param count {Number} 商品数量，用来判断学生数量
     */
    hasStudents (needStudent, currentStudent, skuCode1, count) {
      if (needStudent && !currentStudent) {
        if (this.isCart) {
          this.lessonErrorId = skuCode1
          this.$nextTick(() => {
            let errorEl = document.querySelector('.' + this.$style.lessonError)
            errorEl.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            })
            this.lessonErrorTip = '请选择学员信息'
          })
        }
        this.$error('请选择学员信息')
        return false
      }
      if (needStudent && currentStudent && currentStudent.length < count) {
        if (this.isCart) {
          this.lessonErrorId = skuCode1
          this.$nextTick(() => {
            let errorEl = document.querySelector('.' + this.$style.lessonError)
            errorEl.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            })
            this.lessonErrorTip = `请选择${count}名学员信息`
          })
        }
        this.$error(`请选择${count}名学员信息`)
        return false
      }
      return true
    },
    /**
     * 支付
     * @param CREDENTIAL {Object} 支付数据
     * @param orderId {String} 订单Id
     * @param orderCount {Number} 订单数量
     * @returns {Promise<*>}
     */
    async pay (CREDENTIAL, orderId, orderCount) {
      let orderType = ''
      if (this.lessonList.length > 0 && this.physicalProducts.length === 0 && this.virtualProducts.length === 0) {
        orderType = 'FORMAL_CLASS'
      }
      return new Promise(async (resolve, reject) => {
        try {
          if (CREDENTIAL.appId) {
            await wechatPay(CREDENTIAL)
          }
          this.submiting = false
          this.$router.replace({ name: 'PaySuccess', params: { orderId, orderCount }, query: { orderType } })
          sessionStorage.removeItem('INVOICE_MODEL')
          sessionStorage.removeItem('CONFIRM_LIST')
          resolve()
        } catch (e) {
          // 支付失败
          let vLen = this.virtualProducts.length
          let pLen = this.physicalProducts.length
          this.submiting = false
          if (vLen > 1 || (pLen > 1 && vLen > 0)) {
            this.$router.replace({ name: 'Orders', params: { status: 'WAIT_PAY' } })
          } else {
            // 只有一种商品时，直接进入详情页
            this.$router.replace({ name: 'OrderDetail', params: { orderId } })
          }
          sessionStorage.removeItem('INVOICE_MODEL')
          sessionStorage.removeItem('CONFIRM_LIST')
          reject(e)
        }
      })
    },
    noNeed () {
      this.invioceType = 0
      this.showPopup = false
      sessionStorage.removeItem('INVOICE_MODEL')
    },
    // 需要发票
    need () {
      const applyInvoice = [
        ...this.physicalProducts.filter(item => item.price !== 0 && item.showInvoice === 1),
        ...this.virtualProducts.filter(item => item.price !== 0 && item.showInvoice === 1),
        ...this.lessonList.filter(item => item.price !== 0 && item.showInvoice === 1)
      ]
      sessionStorage.setItem('APPLY_INVOICE', JSON.stringify(applyInvoice))
      sessionStorage.setItem('APPLY_INVOICE_FROM', JSON.stringify({
        name: this.$route.name,
        params: this.$route.params,
        query: this.$route.query
      }))
      if (this.contactInfoModel.mobile) {
        this.$router.push({
          name: 'ApplyInvoice',
          query: {
            receiveMobile: this.contactInfoModel.mobile,
            receiveName: this.contactInfoModel.name
          }
        })
      } else {
        this.$router.push({ name: 'ApplyInvoice' })
      }
      this.showPopup = false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'ApplyInvoice' &&
      to.name !== 'Address' &&
      to.name !== 'AddAddress' &&
      to.name !== 'StudentList') {
      sessionStorage.removeItem('INVOICE_MODEL')
      sessionStorage.removeItem('CONFIRM_LIST')
      sessionStorage.removeItem('APPLY_INVOICE')
      sessionStorage.removeItem('CHECKED_STUDENT')
      localStorage.removeItem('CONTACT_INFO_MODEL')
      this.remark = ''
      this.physicalProducts = []
      this.virtualProducts = []
      this.invioceType = 1
      this.INVOICE_MODEL = {}
      this.CHECKED_STUDENT = {}
      resetForm(this.contactInfoModel)
      resetForm(this.contactInfoForm)
    }
    next()
  }
}
</script>

<style module lang="scss">
  .submitOrder {
    padding: 20px 24px 120px;
  }
  .productBox {
    width: 100%;
    margin: 0 0 20px 0;
    padding: 32px 0 24px 0;
    border-radius: $--radius1;
    background-color: #fff;
    box-sizing: border-box;
    .orderItemBox {
      padding: 0 24px;
    }
  }

  .otherInfo {
    margin-top: 44px;
    > .infoItem {
      display: flex;
      padding-left: 68px;
      padding-right: 28px;
      justify-content: space-between;
      line-height: 88px;
      font-size: 24px;
      border: 2px solid #fff;
      &.lessonError {
        animation: bordrFlicker .15s ease;
        animation-iteration-count: 5;
        border: 2px solid #F24724;
        .lessonErrorTip {
          flex: 1;
          display: inline-flex;
          align-items: center;
          margin-left: 22px;
          color: #F24724;
          > svg {
            width: 32px;
          }
        }
      }
      .freightType {
        flex: 1;
        display: inline-flex;
        justify-content: space-between;
        &.hasFreight{
          justify-content: flex-start;
        }
        .itemLabel {
          width: max-content;
          color: #333;
        }
        .itemContent {
          color: #666;
          margin-left: 24px;
        }
        .edit-count {
          display: flex;
          align-items: center;
          > span {
            margin-right: 16px;
            font-size: 20px;
            color: #999;
          }
        }
      }
      .freight {
        text-align: right;
      }
      .remark {
        flex: 1;
        height: 100%;
        padding: 0;
        margin-left: 22px;
        font-size: 24px;
      }
    }
  }
  .subtotalPrice {
    font-size: 24px;
    color: #000;
  }
  .address {
    margin-bottom: 28px;
    background-color: #fff;
  }
  .product, .remark {
    padding: 24px 28px 18px;
    background-color: #fff;
  }
  .orderTop {
    position: relative;
    font-size: 28px;
    font-weight: bold;
    padding-bottom: 22px;
    margin-bottom: 30px;
    border-bottom: 1px solid #e7e7e7;
  }
  .money {
    position: relative;
    padding: 22px 0;
    border-bottom: 1px solid #e7e7e7;
    > p {
      display: flex;
      justify-content: space-between;
      line-height: 52px;
      &:nth-of-type(2) > span:nth-of-type(2) {
        color: $--primary-color;
      }
    }
  }
  .item-selector {
    margin-bottom: 20px;
    padding-left: 24px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
  }
  .invioceBox {
    .title {
      position: relative;
      height: 114px;
      line-height: 114px;
      font-size: 36px;
      padding: 0 40px;
      border-bottom: 1px solid #e7e7e7;
    }
    .content {
      padding: 62px 40px;
      > button {
        width: 100%;
        height: 88px;
        margin-bottom: 28px;
        font-size: 32px;
        color: #387AF6;
        font-weight: 500;
        background-color: #F1F0F7;
        border-radius: $--radius2;
      }
    }
  }

  .total-money {
    line-height: 66px;
    text-align: right;
    > span:nth-of-type(2) {
      color: $--primary-color;
    }
  }
  .confirm {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 24px;
    height: 110px;
    background-color: #fff;
    box-sizing: border-box;
    z-index: 2;
    > div {
      display: flex;
      flex-direction: column;
      padding-right: 20px;
      min-width: 200px;
    }
  }

  .skeleton {
    padding: 20px 40px;
  }
  .skeleton1 {
    background-color: #fff;
  }
  .skeleton2 {
    margin-top: 28px;
    padding: 20px 28px;
    background-color: #fff;
  }
  .skeleton2-1 {
    width: 112px;
    height: 37px;
  }
  .skeleton2-2 {
    width: 122px;
    height: 37px;
    margin-top: 23px;
  }
  .skeleton2-3 {
    width: 112px;
    height: 37px;
    margin-top: 13px;
  }
  .skeleton2-4 {
    width: 150px;
    height: 37px;
    margin-top: 28px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
  .oneProductMark {
    display: flex;
    margin-top: 20px;
    padding: 0 28px;
    line-height: 88px;
    font-size: 28px;
    background-color: #fff;
    border-radius: 20px;
    > input {
      flex: 1;
      margin-left: 68px;
      background-color: transparent;
    }
  }
  .right-arrow {
    width: 24px;
    margin-left: 12px;
    vertical-align: -3px;
  }
  .student-list {
    background-color: #fff;
    padding-right: 24px;
    .student-item {
      padding: 24px 0;
      font-size: 28px;
      line-height: 40px;
      border-bottom: 1px solid #e7e7e7;
      &:nth-last-of-type(1) {
        border-bottom: none;
      }
      > .student-name {
        display: flex;
        justify-content: space-between;
        margin-bottom: 26px;
      }
      > .student-phone {
        display: flex;
        justify-content: space-between;
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
  .coupon {
    padding: 0 24px;
    > .coupon-list {
      margin-top: 48px;
    }
  }
  @keyframes bordrFlicker {
    0% { border-color: #F24724 }
    50% { border-color: transparent }
    100% { border-color: #F24724 }
  }
</style>
