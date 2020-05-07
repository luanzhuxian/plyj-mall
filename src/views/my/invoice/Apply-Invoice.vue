<template>
    <div :class="$style.applyInvoice">
        <div :class="$style.tips">
            <div :class="$style.top">
                <pl-svg
                    :class="$style.warning"
                    name="icon-warning2"
                />
                <p v-text="type === 1 ? '自营产品订单完成后24小时内开具，点击“我的订单”查看。' : '发票将会与商品同时邮寄，单商品仅支持一次开票服务，请确保填写开票信息真实有效。'" />
            </div>
            <button
                @click="showInvioceIntro = true"
                :class="$style.button"
            >
                发票须知
            </button>
        </div>

        <div :class="$style.checkedBox">
            <div :class="$style.buttons">
                <button
                    :class="{
                        [$style.active]: type === 1
                    }"
                    @click="change(1)"
                >
                    个人
                </button>
                <span
                    :class="{
                        [$style.separator]: true,
                        [$style.active]: type === 1
                    }"
                />
                <button
                    :class="{
                        [$style.active]: type === 2
                    }"
                    @click="change(2)"
                >
                    单位
                </button>
            </div>

            <div
                :class="$style.personInvioce"
                v-show="type === 1"
            >
                <div :class="$style.personName">
                    <span>姓名：</span>
                    <span v-text="receiveName || realName" />
                </div>
                <div :class="$style.personMobile">
                    <span>手机号：</span>
                    <span>{{ mobile || receiveMobile | formatAccount }}</span>
                </div>
            </div>

            <pl-form
                :class="$style.firmInvioce"
                v-if="type === 2 && invoiceList.length === 0"
                :model="form"
                :rules="rules"
                ref="form"
            >
                <pl-form-item
                    border
                    prop="firmName"
                >
                    <pl-input
                        size="middle"
                        placeholder="单位名称"
                        v-model="form.firmName"
                    />
                </pl-form-item>
                <pl-form-item prop="tin">
                    <pl-input
                        size="middle"
                        placeholder="纳税人识别号"
                        v-model="form.tin"
                    />
                    <pl-svg
                        slot="suffix"
                        name="icon-warning"
                        fill="#FE7700"
                        style="width: 45px; margin: 0 36px;"
                        @click="showInvioceNum = true"
                    />
                </pl-form-item>
            </pl-form>

            <pl-form
                :class="$style.firmInvioce"
                v-if="type === 2 && invoiceList.length > 0"
                :model="form"
                :rules="rules"
                ref="form"
            >
                <pl-form-item
                    v-for="(item, i) of invoiceList"
                    :key="item.id"
                    border
                >
                    <pl-radio
                        :key="i"
                        :label="item.id"
                        v-model="currentInvoice"
                    >
                        <InvoiceItem :data="item" />
                    </pl-radio>
                </pl-form-item>
            </pl-form>
            <button
                :class="$style.addInvoice"
                @click="addInfo"
                v-if="invoiceList.length > 0 && type === 2"
            >
                <pl-svg
                    name="icon-add"
                    fill="#bfbfbf"
                />
                <span>添加信息</span>
            </button>
        </div>

        <div :class="$style.selectProducts">
            <p :class="$style.title">
                选择开票商品
            </p>

            <ul :class="$style.selectList">
                <li
                    v-for="(prod, i) of applyInvoice"
                    :key="i"
                >
                    <label>
                        <input
                            v-show="false"
                            type="checkbox"
                            :checked="isSelected(prod)"
                            @change="e => { selectChange(e, prod) }"
                        >
                        <img
                            :class="$style.proImg"
                            :src="prod.goodsImage"
                            v-img-error
                            alt=""
                        >
                        <pl-svg
                            :class="$style.selectIcon"
                            name="icon-success"
                            :fill="isSelected(prod) ? '#F2B036' : '#ccc'"
                        />
                    </label>
                </li>
            </ul>
        </div>
        <pl-button
            type="warning"
            size="huge"
            @click="confirm"
            :loading="loading"
        >
            确定
        </pl-button>
        <pl-popup :show.sync="showInvioceIntro">
            <h2
                :class="$style.invioceIntroTitle"
                slot="title"
            >
                发票须知
            </h2>
            <div :class="$style.invioceIntroContent">
                <p><strong>第一条：</strong>发票金额不含优惠券和其余优惠支付部分。 </p>
                <p><strong>第二条：</strong>第三方卖家销售的商品／服务的发票由卖家自行出具、提供，发票类型和内容由卖家根据实际商品、服务情况决定。 </p>
                <p><strong>第三条：</strong>实体商品发票将会与商品同时邮寄，虚拟、课程自提商品发票到店自取，单商品仅支持一次开票服务，请确保填写开票信息真实有效</p>
            </div>
        </pl-popup>

        <pl-popup :show.sync="showInvioceNum">
            <h2
                :class="$style.invioceIntroTitle"
                slot="title"
            >
                发票税号说明
            </h2>
            <div :class="$style.invioceIntroContent">
                <h3>1. 什么是纳税人识别号/统一社会信用代码？</h3>
                <p> 纳税人识别号，通常简称为“税号”，就是税务登记证上的号，每个企业的识别号都是唯一的，相当于税务局颁发给企业的“身份证”号。统一社会信用代码，是一组长度为 18 位的用于法人和其他组织身份识别的代码。统一社会信用代码由国家标准委发布。 2015 年 10 月 1 日起，国家启动将企业依次申请的工商营业执照、组织机构代码证和税务登记证三证合为一证，并将三证号码合并为统一社会信用代码。目前大部分企业均已完成合并，另有少部分企业其纳税人识别号仍然有效。请注意此公告并不适用于政府机构及事业单位中的非企业单位，因此，如贵单位属于这种类型，可无需填写纳税人识别号 l 统一社会信用代码，谨慎起见，请您与贵单位财务部门联系确认。 </p>
                <h3>2. 为什么要填写纳税人识别号/统一社会信用代码？ </h3>
                <p>根据国家税务总局 2017 年 16 号公告，从 7 月 1 日起企业（包括公司、非公司制企业法人、企业分支机构、个人独资企业、合伙企业和其他企业）索取票面带有“购买方纳税人识别号”栏目的发票时，应向销售方提供纳税人识别号或统一社会信用代码。因此，当您选择开具企业抬头增值税普通发票时，请根据提示准确填写贵单位号码，以免影响您的发票报报销。 </p>
                <h3>3. 如何获取/知晓纳税人识别号/统一社会信用代码？ </h3>
                <p> 您可向贵单位的财务部门索取；另外也可以根据单位名称在国家企业信用信息公示系统 <a href="https://www.gsxt.gov.cnlindex.html">（https://www.gsxt.gov.cnlindex.html）</a>查询统一社会信用代码。</p>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    addInvoice,
    getInvoiceList,
    applyInvoice
} from '../../../apis/invoice'
import InvoiceItem from '../../../components/item/Invoice-Item'
export default {
    name: 'ApplyInvoice',
    components: {
        InvoiceItem
    },
    data () {
        return {
            showInvioceIntro: false,
            showInvioceNum: false,
            // 待开票商品
            applyInvoice: [],
            checkedList: [],
            // 已添加的发票信息列表
            invoiceList: [],
            type: 1,
            // 当前选中的发票信息
            currentInvoice: '',
            form: {
                tin: '',
                firmName: ''
            },
            rules: {
                firmName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
                tin: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }]
            },
            loading: false
        }
    },
    computed: {
        ...mapGetters(['selectedAddress', 'userId']),
        realName () {
            return this.selectedAddress.realName
        },
        mobile () {
            return this.selectedAddress.mobile
        },
        orderId () {
            return this.$route.query.orderId || ''
        },
        orderType () {
            return this.$route.query.orderType || ''
        },
        receiveMobile () {
            return this.$route.query.receiveMobile || ''
        },
        receiveName () {
            return this.$route.query.receiveName || ''
        }
    },
    activated () {
        const APPLY_INVOICE = JSON.parse(sessionStorage.getItem('APPLY_INVOICE'))
        if (!APPLY_INVOICE) {
            this.$router.go(-1)
            this.$destroy()
            return
        }
        this.checkedList = [...APPLY_INVOICE]
        this.applyInvoice = APPLY_INVOICE
        try {
            this.getInvoiceList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        isSelected (pro) {
            return this.checkedList.some(item => item.sku1 === pro.sku1 && item.sku2 === pro.sku2)
        },
        change (type) {
            this.type = type
        },
        async getInvoiceList () {
            try {
                const { result } = await getInvoiceList(this.userId)
                this.invoiceList = result
                if (result[0]) {
                    this.currentInvoice = this.$route.query.id || this.currentInvoice || result[0].id
                } else {
                    this.currentInvoice = this.$route.query.id || this.currentInvoice
                }
            } catch (e) {
                throw e
            }
        },
        getCurrentInvoice () {
            return this.invoiceList.find(item => item.id === this.currentInvoice)
        },
        selectChange (e, prod) {
            const { checked } = e.target
            if (checked) {
                this.checkedList.push(prod)
            } else {
                this.checkedList.splice(this.checkedList.indexOf(prod), 1)
            }
        },
        addInfo () {
            localStorage.setItem('EDIT_INVOICE_FROM', JSON.stringify({
                name: this.$route.name,
                params: this.$route.params,
                query: this.$route.query
            }))
            this.$router.push({ name: 'AddInvoice' })
        },
        async confirm () {
            if (this.checkedList.length === 0) {
                this.$warning('请选择要开票的商品')
                return
            }
            let invoiceModel = null
            let invoiceAmount = 0
            const orderDetails = []
            if (this.type === 1) {
                invoiceModel = {
                    invoiceType: 1,
                    invoiceTitle: this.realName || this.receiveName,
                    receiverMobile: this.mobile || this.receiveMobile,
                    userAddressId: this.selectedAddress.sequenceNbr
                }
            } else {
                const currentInvoice = this.getCurrentInvoice()
                if (currentInvoice) {
                    this.form.tin = currentInvoice.tin
                    this.form.firmName = currentInvoice.entName
                }
                if (!this.$refs.form.validate()) return
                invoiceModel = {
                    invoiceType: 2,
                    tin: this.form.tin,
                    invoiceTitle: this.form.firmName,
                    userAddressId: this.selectedAddress.sequenceNbr
                }
                if (!currentInvoice || !currentInvoice.id) {
                    addInvoice({
                        userId: this.userId,
                        entName: this.form.firmName,
                        tin: this.form.tin
                    })
                }
            }

            for (const prod of this.checkedList) {
                invoiceAmount += Number(prod.amount) * 100
                orderDetails.push({
                    goodsId: prod.goodsId,
                    goodsType: prod.goodsType,
                    count: prod.count,
                    sku1: prod.sku1,
                    sku2: prod.sku2
                })
            }
            invoiceModel.orderDetails = orderDetails
            invoiceModel.invoiceAmount = invoiceAmount / 100

            if (this.orderId) {
                // 二次申请发票
                const orderDetailsTemp = []
                for (const item of this.checkedList) {
                    orderDetailsTemp.push({
                        orderId: this.orderId,
                        orderDetailId: item.orderProductRId
                    })
                }
                try {
                    this.loading = true
                    await applyInvoice({
                        invoiceType: this.type,
                        invoiceTitle: this.type === 1 ? this.receiveName : this.form.firmName,
                        tin: this.type === 2 ? this.form.tin : '',
                        orderDetails: orderDetailsTemp,
                        ...(this.orderType ? { logisticStatus: this.orderType === 'PHYSICAL' ? 0 : 1 } : null)
                    })
                } catch (e) {
                    throw e
                } finally {
                    this.loading = false
                }
            } else {
                sessionStorage.setItem('INVOICE_MODEL', JSON.stringify(invoiceModel))
            }

            const APPLY_INVOICE_FROM = JSON.parse(sessionStorage.getItem('APPLY_INVOICE_FROM')) || {}
            if (APPLY_INVOICE_FROM.name) {
                this.$router.replace({
                    name: APPLY_INVOICE_FROM.name,
                    query: APPLY_INVOICE_FROM.query,
                    params: APPLY_INVOICE_FROM.params
                })
            } else {
                this.$router.go(-1)
            }
        }
    },
    beforeRouteLeave (to, from, next) {
        if (to.name !== 'AddInvoice') {
            sessionStorage.removeItem('APPLY_INVOICE')
            sessionStorage.removeItem('APPLY_INVOICE_FROM')
        }
        next()
    }
}
</script>

<style module lang="scss">
  .applyInvoice {
    padding: 20px 40px;
  }
  .tips {
    display: flex;
    flex-direction: column;
    padding: 16px 32px 16px 24px;
    background-color: #fff;
    font-size: 26px;
    border-radius: $--radius1;
  }
  .top {
    display: flex;
    color: $--font-color_gray2;
    > .warning {
      width: 36px;
      height: 36px;
      margin-top: 4px;
      margin-right: 12px;
    }
    > p {
      flex: 1;
    }
  }

  .button {
    align-self: flex-end;
    margin-top: 4px;
    font-size: 24px;
    line-height: 40px;
    color: #1890FF;
    text-decoration: underline;
  }
  .checkedBox {
    margin-top: 28px;
    border-radius: $--radius1;
    background-color: #fff;
    overflow: hidden;
    > .buttons {
      position: relative;
      display: flex;
      height: 88px;
      overflow: hidden;
      .separator {
        position: absolute;
        top: -50%;
        right: 50%;
        width: 50px;
        height: 200%;
        overflow: hidden;
        z-index: 2;
        transform: rotate(-12deg);
        background-color: #fcfcfc;
        &.active {
          right: 43.5%;
          &:after {
            left: -2px;
          }

        }
        &:after {
          position: absolute;
          content: "";
          right: -5px;
          width: 5px;
          height: 100%;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        }
      }
      button {
        flex: 1;
        font-size: 32px;
        color: #ccc;
        background-color: #fcfcfc;
        &.active {
          font-weight: bold;
          color: #333;
          background-color: #fff;
        }
      }
    }
  }
  .personInvioce {
    padding-left: 40px;
    font-size: 30px;
    line-height: 108px;
    > div:nth-of-type(1) {
      position: relative;
      border-bottom: 1px solid #e7e7e7;
    }
  }
  .firmInvioce {
    padding-left: 40px;
  }
  .invioceIntroTitle {
    font-size: 36px;
    margin: 60px 0;
    text-align: center;
  }
  .addInvoice {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 90px;
    font-size: 28px;
    color: #999;
    background-color: #fcfcfc;
    border-top: 1px solid #f0f0f0;
    > svg {
      width: 38px;
      height: 38px;
      margin-right: 12px;
    }
  }
  .invioceIntroContent {
    padding: 0 40px;
    h3 {
      margin-bottom: 52px;
      font-size: 32px;
    }
    a {
      color: $--primary-color;
    }
    p {
      margin-bottom: 52px;
      font-size: 28px;
      line-height: 38px;
    }
  }
  .selectProducts {
    margin: 48px 0;
    > .title {
      font-size: 30px;
      margin-bottom: 20px;
    }
  }
  .selectList {
    display: flex;
    overflow: auto;
    > li {
      display: inline-flex;
      align-items: center;
      position: relative;
      margin-right: 16px;
      padding: 28px;
      border-radius: $--radius2;
      background-color: #fff;
      > label {
        display: inline-flex;
      }
    }
  }
  .proImg {
    width: 105px;
    height: 105px;
    object-fit: cover;
    border-radius: $--radius2;
  }
  .selectIcon {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
  }

</style>
