<template>
  <div
    v-if="!loading"
    :class="$style.submitOrder"
  >
    <div
      :class="$style.address + ' radius-20'"
      v-if="physicalProducts.length > 0"
    >
      <AddressItem />
    </div>

    <!-- *************************实体************************* -->
    <div
      v-if="physicalProducts.length > 0"
      :class="$style.productBox"
    >
      <div :class="$style.orderItemBox">
        <OrderItem
          v-for="item of physicalProducts"
          :key="item.skuCode1"
          :img="item.productImg"
          :name="item.productName"
          :count="item.count"
          :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
          :price="item.price"
          :support-refund="Boolean(item.supportRefund)"
          :gap="32"
          :product-type="1"
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
              v-model="remark"
            >
          </div>
        </div>

        <div :class="$style.infoItem" v-if="!isCart">
          <div :class="$style.freightType">
            <span :class="$style.itemLabel">购买数量</span>
            <div :class="$style.editCount">
              <span>剩余99件</span>
              <Count
                :min="physicalProducts[0].minBuyNum"
                :max="physicalProducts[0].stock"
                :count="physicalProducts[0].count"
                @change="(count, next) => { countChange(count, physicalProducts[0], next) }"
              />
            </div>
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
        v-for="item of virtualProducts"
        :key="item.skuCode1"
        :class="$style.productBox"
      >
        <div :class="$style.orderItemBox">
          <OrderItem
            :key="item.skuCode1"
            :img="item.productImg"
            :name="item.productName"
            :count="item.count"
            :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
            :price="item.price"
            :support-refund="item.supportRefund"
            is-submit
            :gap="32"
            :product-type="2"
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
                <span>剩余99件</span>
                <Count
                  :min="item.minBuyNum"
                  :max="item.stock"
                  :count="item.count"
                  @change="(count, next) => { countChange(count, item, next) }"
                />
              </div>
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
        v-for="item of lessonList"
        :key="item.skuCode1"
        :class="$style.productBox"
      >
        <div :class="$style.orderItemBox">
          <OrderItem
            :key="item.skuCode1"
            :img="item.productImg"
            :name="item.productName"
            :count="item.count"
            :option="item.skuCode2Name ? `${item.skuCode1Name},${item.skuCode2Name}` : item.skuCode1Name"
            :price="item.price"
            :support-refund="item.supportRefund"
            is-submit
            :gap="32"
            :product-type="2"
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
                <span v-if="CHECKED_STUDENT[item.skuCode1]">已选{{ CHECKED_STUDENT[item.skuCode1].length }}人</span>
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
                <span>剩余{{ item.stock }}件</span>
                <Count
                  :min="item.minBuyNum"
                  :max="item.stock"
                  :count="item.count"
                  @change="(count, next) => { countChange(count, item, next) }"
                />
              </div>
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

    <div v-if="physicalProducts.length > 0 && amount > 0" :class="$style.itemSelector" @click="selectInvoice">
      <pl-fields
        size="middle"
        text="发票"
        icon="invoice"
        :icon-gap="12"
        show-right-icon
        :right-text="invioceType === 1 ? '不需要' : '纸质发票'"
        left-text-weight="bold"
      />
    </div>

    <div
      v-if="lessonList.length === 1 && lessonList[0].needStudentInfo && !isCart"
      :class="$style.itemSelector"
      @click.capture="selectStudent(lessonList[0])"
    >
      <pl-fields
        size="middle"
        text="学员信息"
        icon="name-card"
        :icon-gap="12"
        :right-text="`已选${getStudentCountByProId(lessonList[0].skuCode1)}人`"
        show-right-icon
        left-text-weight="bold"
      >
        <ul :class="$style.studentList" v-show="CHECKED_STUDENT[lessonList[0].skuCode1] && CHECKED_STUDENT[lessonList[0].skuCode1].length > 0">
          <li :class="$style.studentItem" v-for="(item, i) of CHECKED_STUDENT[lessonList[0].skuCode1]" :key="i">
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

    <div v-if="physicalProducts.length === 0" :class="$style.itemSelector" @click.capture="showContactPopup = true">
      <pl-fields
        size="middle"
        text="联系人信息"
        icon="contact"
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
          <button
            @click="need"
            v-if="physicalProducts.length > 0"
          >
            纸质发票
          </button>
        </div>
      </div>
    </pl-popup>
    <pl-popup
      :show.sync="showContactPopup"
      :close-on-click-modal="false"
    >
      <div :class="$style.addContact">
        <div :class="$style.addContactTop">
          联系人信息
        </div>
        <pl-form :model="contactInfoModel" :rules="rules" ref="contactForm">
          <pl-form-item prop="name" label="姓名：" :label-width="204" :gap-top="20">
            <pl-input v-model="contactInfoModel.name" />
          </pl-form-item>
          <pl-form-item prop="mobile" label="手机号码：" :label-width="204" :gap-top="20">
            <pl-input v-model="contactInfoModel.mobile" />
          </pl-form-item>
        </pl-form>
        <pl-button size="huge" type="warning" @click="useContact">
          使用
        </pl-button>
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
import wechatPay from '../../assets/js/wechat/wechat-pay'
import { mapGetters, mapActions } from 'vuex'
import { STUDENTS } from '../../store/mutation-type'
import OrderItemSkeleton from '../../components/skeleton/Order-Item.vue'
import AddressItemSkeleton from '../../components/skeleton/Address-Item.vue'
import Count from '../../components/Count.vue'
import { isName, isPhone } from '../../assets/js/validate'
import { resetForm } from '../../assets/js/util'
export default {
  name: 'SubmitOrder',
  components: {
    AddressItem,
    OrderItem,
    OrderItemSkeleton,
    AddressItemSkeleton,
    Count
  },
  data () {
    return {
      showPopup: false,
      showContactPopup: false,
      submiting: false,
      loading: false,
      freight: 0,
      totalAmount: 0,
      amount: 0,
      physicalProducts: [],
      virtualProducts: [],
      lessonList: [],
      remark: '', // 物理订单备注
      invioceType: 1,
      INVOICE_MODEL: {},
      CHECKED_STUDENT: {},
      rules: {
        name: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { validator: isName, message: '联系人姓名只支持中英文，且中文为2~10字，英文为2~20字', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系人手机号', trigger: 'blur' },
          { validator: isPhone, message: '联系人手机号格式错误', trigger: 'blur' }
        ]
      },
      contactInfoModel: {
        name: '',
        mobile: ''
      },
      lessonErrorId: '',
      lessonErrorTip: ''
    }
  },
  props: {
    productId: {
      type: String,
      default: ''
    },
    count: {
      type: [Number, String],
      default: 1
    },
    optionCode: {
      type: String,
      default: ''
    },
    brokerId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['selectedAddress', 'openId', 'mobile', 'addressList']),
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
    // 课程的总数量
    formalClassCount () {
      return this.getTotal(this.lessonList, (total, item) => {
        return total + item.count
      })
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
          localStorage.setItem('INVOICE_MODEL', JSON.stringify(this.INVOICE_MODEL))
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
    try {
      await this.getProductDetail()
      this.INVOICE_MODEL = JSON.parse(localStorage.getItem('INVOICE_MODEL')) || null
      this.CHECKED_STUDENT = JSON.parse(localStorage.getItem('CHECKED_STUDENT')) || {}
      // 填充默认学生
      if (Object.keys(this.CHECKED_STUDENT).length === 0) {
        let students = await this[STUDENTS]()
        let def = students.find(item => item.defaultStatus === 1)
        if (def) {
          for (let item of this.lessonList) {
            this.$set(this.CHECKED_STUDENT, item.skuCode1, [def])
          }
          localStorage.setItem('CHECKED_STUDENT', JSON.stringify(this.CHECKED_STUDENT))
        }
      }
      this.invioceType = this.INVOICE_MODEL ? 2 : 1
      this.lessonErrorId = ''
    } catch (e) {
      this.$router.go(-1)
      throw e
    }
  },
  deactivated () {
  },
  methods: {
    ...mapActions([STUDENTS]),
    // 计算商品总数
    getTotal (list, fn) {
      let total = 0
      for (let item of list) {
        total = fn(total, item)
      }
      return total
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
      let CONFIRM_LIST = JSON.parse(localStorage.getItem('CONFIRM_LIST'))
      let thisPro = CONFIRM_LIST.find(item => item.productId === pro.productId)
      let thisStudents = this.CHECKED_STUDENT[pro.skuCode1]
      thisPro.count = count
      localStorage.setItem('CONFIRM_LIST', JSON.stringify(CONFIRM_LIST))
      try {
        await this.getProductDetail(true)
        next()
        if (count < thisStudents.length) {
          thisStudents.pop()
          localStorage.setItem('CHECKED_STUDENT', JSON.stringify(this.CHECKED_STUDENT))
        }
      } catch (e) {
        throw e
      }
    },
    selectInvoice () {
      if (!this.selectedAddress.realName) {
        this.$warning('请先选择收货地址')
        return
      }
      this.showPopup = true
    },
    selectStudent (pro) {
      localStorage.setItem('SELECT_STUDENT_FROM', JSON.stringify({
        name: this.$route.name,
        query: this.$route.query,
        params: this.$route.params
      }))
      this.$router.push({
        name: 'StudentList',
        query: {
          select: 'YES',
          sku: pro.skuCode1,
          count: pro.count
        }
      })
    },
    useContact () {
      this.showContactPopup = false
    },
    async getProductDetail (flag) {
      const proList = JSON.parse(localStorage.getItem('CONFIRM_LIST'))
      if (!proList) {
        return this.$router.replace({ name: 'Home' })
      }
      if (!flag) this.loading = true
      try {
        // 获取订单详细数据
        const { result } = await confirmCart({
          cartProducts: proList,
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
        // 把虚拟商品中需要学生的商品移动到课程列表
        let needStudent = virtualProducts.filter(item => item.needStudentInfo)
        for (let item of needStudent) {
          virtualProducts.splice(virtualProducts.indexOf(item), 1)
        }
        this.amount = amount
        this.totalAmount = totalAmount
        this.freight = Number(freight)
        this.physicalProducts = physicalProducts
        this.virtualProducts = virtualProducts
        this.lessonList = [...formalClass, ...experienceClass, ...needStudent]
        this.loading = false
      } catch (e) {
        throw e
      }
    },
    // 提交订单
    async submitOrder () {
      const cartProducts = []
      if (this.physicalProducts.length > 0 && this.addressList <= 0) {
        this.$confirm('您还没有收货地址，请先添加收货地址')
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
          message: this.remark
        })
      }
      for (const item of this.virtualProducts) {
        const { productId, skuCode1, skuCode2, count, agentUser, remark } = item
        cartProducts.push({
          productId,
          skuCode1,
          skuCode2,
          productType: 'VIRTUAL_GOODS',
          count,
          agentUser,
          message: remark
        })
      }
      for (const item of this.lessonList) {
        const { productId, skuCode1, skuCode2, count, agentUser, remark, needStudentInfo } = item
        const currentStudent = this.CHECKED_STUDENT[skuCode1]
        if (needStudentInfo && !currentStudent) {
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
          return this.$error('请选择学员信息')
        }
        if (needStudentInfo && currentStudent && currentStudent.length < count) {
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
          return this.$error(`请选择${count}名学员信息`)
        }
        cartProducts.push({
          productId,
          skuCode1,
          skuCode2,
          productType: item.type,
          studentIds: needStudentInfo ? this.CHECKED_STUDENT[skuCode1].map(item => item.id) : null,
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
        invoiceModel: this.INVOICE_MODEL
      }
      if (this.physicalProducts.length === 0) {
        // 没有实体商品时，必须有联系人信息
        if (this.$refs.contactForm.validate()) {
          data.contactInfoModel = this.contactInfoModel
        } else {
          return
        }
      }
      try {
        this.submiting = true
        const { result } = await submitOrder(data)
        await this.pay(result, result.orderLists[0], result.orderLists.length)
      } catch (e) {
        throw e
      } finally {
        this.submiting = false
      }
    },
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
          localStorage.removeItem('INVOICE_MODEL')
          localStorage.removeItem('CONFIRM_LIST')
          resolve()
        } catch (e) {
          // 支付失败
          let vLen = this.virtualProducts.length + this.lessonList.length
          let pLen = this.physicalProducts.length
          this.submiting = false
          if (vLen > 1 || (pLen > 1 && vLen > 0)) {
            this.$router.replace({ name: 'Orders', params: { status: 'WAIT_PAY' } })
          } else {
            // 只有一种商品时，直接进入详情页
            this.$router.replace({ name: 'OrderDetail', params: { orderId } })
          }
          localStorage.removeItem('INVOICE_MODEL')
          localStorage.removeItem('CONFIRM_LIST')
          reject(e)
        }
      })
    },
    noNeed () {
      this.invioceType = 1
      this.showPopup = false
      localStorage.removeItem('INVOICE_MODEL')
    },
    // 需要发票
    need () {
      const applyInvoice = {
        physicalProducts: this.physicalProducts.filter(item => item.price !== 0)
      }
      localStorage.setItem('APPLY_INVOICE', JSON.stringify(applyInvoice))
      localStorage.setItem('APPLY_INVOICE_FROM', JSON.stringify({
        name: this.$route.name,
        params: this.$route.params,
        query: this.$route.query
      }))
      this.$router.push({ name: 'ApplyInvoice' })
      this.invioceType = 2
      this.showPopup = false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'ApplyInvoice' &&
      to.name !== 'Address' &&
      to.name !== 'AddAddress' &&
      to.name !== 'StudentList') {
      localStorage.removeItem('INVOICE_MODEL')
      localStorage.removeItem('CONFIRM_LIST')
      localStorage.removeItem('APPLY_INVOICE')
      localStorage.removeItem('CHECKED_STUDENT')
      this.remark = ''
      this.physicalProducts = []
      this.virtualProducts = []
      this.invioceType = 1
      this.INVOICE_MODEL = {}
      this.CHECKED_STUDENT = {}
      resetForm(this.contactInfoModel)
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
  @keyframes bordrFlicker {
    0% { border-color: #F24724 }
    50% { border-color: transparent }
    100% { border-color: #F24724 }
  }
</style>
