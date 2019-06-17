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
export default {
  name: 'AddInvoice',
  components: {
  },
  data () {
    return {
      loading: false,
      form: {
        entName: '',
        tin: ''
      },
      rules: {
        entName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        tin: [{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }]
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
</style>
