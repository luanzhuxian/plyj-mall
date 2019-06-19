<template>
  <div :class="$style.addInvoice">
    <h2
      :class="$style.title"
      v-text="id ? '编辑单位信息' : '新建单位信息'"
    />
    <p :class="$style.tips">
      重要信息，请认真填写。
    </p>
    <pl-form
      :class="$style.form"
      label-width="40"
      :model="form"
      :rules="rules"
      ref="form"
    >
      <pl-form-item
        border
        prop="entName"
      >
        <pl-input
          size="middle"
          placeholder="单位名称"
          v-model="form.entName"
        />
      </pl-form-item>
      <pl-form-item
        prop="tin"
      >
        <pl-input
          size="middle"
          placeholder="纳税人识别号"
          v-model="form.tin"
        />
        <pl-svg
          :class="$style.warningIcon"
          slot="suffix"
          name="warning"
          color="#FE7700"
          @click="showInvioceIntro = true"
        />
      </pl-form-item>
    </pl-form>

    <div
      v-if="id"
      :class="$style.remove"
      @click="remove"
    >
      删除该信息
    </div>

    <pl-button
      :loading="loading"
      size="huge"
      type="warning"
      :class="$style.confirmBtn"
      @click="addOrEdit"
    >
      保存并使用
    </pl-button>

    <pl-popup :show.sync="showInvioceIntro">
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
import {
  getInvoiceList,
  updateInvoice,
  addInvoice,
  removeInvoice
} from '../../../apis/invoice'
import { mapGetters } from 'vuex'
import { copyFields, resetForm } from '../../../assets/js/util'
import { isDutyNumber } from '../../../assets/js/validate'
export default {
  name: 'AddInvoice',
  components: {
  },
  data () {
    return {
      loading: false,
      showInvioceIntro: false,
      form: {
        entName: '',
        tin: ''
      },
      rules: {
        entName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        tin: [
          { required: true, message: '请输入纳税人识别号', trigger: 'blur' },
          { validator: isDutyNumber, message: '纳税人识别号格式错误', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  activated () {
    try {
      if (this.id) this.getInvoiceList()
    } catch (e) {
      throw e
    }
  },
  deactivated () {
    resetForm(this.form)
  },
  methods: {
    async getInvoiceList () {
      try {
        const { result } = await getInvoiceList(this.userId, this.id)
        copyFields(this.form, result[0])
      } catch (e) {
        throw e
      }
    },
    async addOrEdit () {
      if (!this.$refs.form.validate()) return
      try {
        this.loading = true
        if (this.id) {
          this.form.id = this.id
          await updateInvoice(this.form)
          this.goBack(this.id)
        } else {
          delete this.form.id
          const { result } = await addInvoice(this.form)
          this.goBack(result.id)
        }
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    async remove () {
      try {
        await this.$confirm('是否删除该发票信息？')
        await removeInvoice(this.id)
        this.goBack()
      } catch (e) {
        throw e
      }
    },
    goBack (id) {
      const EDIT_INVOICE_FROM = JSON.parse(localStorage.getItem('EDIT_INVOICE_FROM'))
      if (!EDIT_INVOICE_FROM) {
        return this.$router.go(-1)
      }
      const { name, params, query } = EDIT_INVOICE_FROM
      this.$router.replace({
        name,
        params,
        query: Object.assign(query, { id })
      })
    }
  },
  beforeRouteLeave (to, form, next) {
    localStorage.removeItem('EDIT_INVOICE_FROM')
    next()
  }
}
</script>

<style module lang="scss">
  .addInvoice {
    padding: 40px;
  }
  .title {
    font-size: 40px;
  }
  .tips {
    margin-top: 14px;
    color: $--font-color_gray3;
    font-size: 28px;
  }
  .form {
    margin-top: 34px;
    background-color: #fff;
    border-radius: $--radius1;
    overflow: hidden;
  }
  .remove {
    height: 108px;
    margin-top: 28px;
    padding: 0 40px;
    color: #F24724;
    font-size: 30px;
    line-height: 108px;
    background-color: #fff;
    border-radius: 20px;
  }
  .warningIcon {
    width: 36px;
    margin: 0 40px;
  }
  .confirmBtn {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 40px;
    width: 670px !important;
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
  .invioceIntroTitle {
    font-size: 36px;
    margin: 60px 0;
    text-align: center;
  }
</style>
