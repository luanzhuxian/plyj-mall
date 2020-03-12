<template>
  <div :class="$style.customBlock">
    <pl-fields
      size="middle"
      :text="label"
      :icon="icon"
      :icon-gap="12"
      left-text-weight="bold"
    >
      <ul v-if="formData.formList && formData.formList.length" :class="$style.customList">
        <li
          :class="$style.customItem"
          v-for="(item, i) of formData.formList"
          :key="i"
          @click="editStudent(i)"
        >
          <div :class="$style.field">{{ label }}{{ i + 1 }}</div>
          <div :class="$style.value">
            <span v-if="isError(i)">未填写</span>
            <span v-else v-text="item[Object.keys(item)[0]]" />
            <pl-svg :class="$style.rightArrow" name="icon-right" fill="#ccc" height="24" />
          </div>
        </li>
      </ul>

      <ul v-else :class="$style.customList">
        <li
          :class="$style.customItem"
          v-for="(item, i) of formData2.formList"
          :key="i"
          @click="editStudent(i)"
        >
          <div :class="$style.field">{{ label }}{{ i + 1 }}</div>
          <div :class="$style.value">
            <span v-if="isError(i)">未填写</span>
            <span v-else v-text="item[Object.keys(item)[0]]" />
            <pl-svg :class="$style.rightArrow" name="icon-right" fill="#ccc" height="24" />
          </div>
        </li>
      </ul>
    </pl-fields>

    <CustomForm
      :show.sync="showForm"
      :form="currentForm"
      :rules="currentRules"
      @confirm="confirm"
      :title="label"
    />
  </div>
</template>

<script>
import CustomForm from './Custom-Form.vue'
export default {
  name: 'CustomBlock',
  components: {
    CustomForm
  },
  data () {
    return {
      showForm: false,
      currentForm: {},
      currentRules: {},
      formData: {},
      formData2: {}
    }
  },
  props: {
    label: {
      type: String,
      default: '学员信息'
    },
    icon: {
      type: String,
      default: 'icon-name-card'
    },
    product: {
      type: Object,
      default () {
        return {}
      }
    },
    customList: {
      type: Array,
      default () {
        return []
      }
    },
    count: {
      type: Number,
      default: 0
    },
    // 如果传入的商品是数组，则说明是实体商品，需要特殊处理
    products: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    product: {
      handler () {
        this.setFormData()
      },
      immediate: true
    },
    products: {
      handler () {
        this.setFormData2()
      },
      immediate: true
    }
  },
  activated () {
  },
  methods: {
    // 单商品
    setFormData () {
      const formList = []
      const rules = []
      const count = this.product.productType === 'PHYSICAL_GOODS' ? 1 : this.count
      // 获取上次填写的数据，尝试回填
      const oldFormList = JSON.parse(sessionStorage.getItem(`CUSTOM_FORM_${this.product.productId}`)) || []
      for (let i = 0; i < count; i++) {
        const form = {}
        const rule = {}
        for (const cus of this.customList) {
          const key = cus.fieldName
          // 回填数据
          if (oldFormList.length) {
            form[key] = oldFormList[i][key] || ''
          } else {
            form[key] = ''
          }
          rule[key] = [{ required: Boolean(cus.required), message: `请输入${cus.fieldName}`, trigger: 'blur' }]
        }
        formList.push(form)
        rules.push(rule)
      }
      this.formData = { formList, rules }
      if (oldFormList.length) {
        this.confirm()
      }
    },
    // 用于实体多商品，实体商品需要整合所有自定义为一个表单，最后提交时再拆分，不考虑商品数量
    setFormData2 () {
      if (!this.products.length) {
        return {}
      }
      // 获取上次填写的数据，尝试回填
      const oldFormList = JSON.parse(sessionStorage.getItem(`CUSTOM_FORM_${this.products[0].productId}`)) || null
      const oldForm = oldFormList ? oldFormList[0] : null
      const formList = []
      const rules = []
      const formEntityList = []
      for (const pro of this.products) {
        for (const cus of pro.formEntityList) {
          formEntityList.push(cus)
        }
      }
      const form = {}
      const rule = {}
      for (const cus of formEntityList) {
        const key = cus.fieldName
        // 回填数据
        form[key] = oldForm ? oldForm[key] : ''
        rule[key] = [{ required: Boolean(cus.required), message: `请输入${cus.fieldName}`, trigger: 'blur' }]
      }
      formList.push(form)
      rules.push(rule)
      this.formData2 = { formList, rules }
      if (oldForm) {
        this.confirm()
      }
    },
    editStudent (index) {
      if (this.formData.formList.length) {
        this.currentForm = this.formData.formList[index]
        this.currentRules = this.formData.rules[index]
      } else {
        this.currentForm = this.formData2.formList[index]
        this.currentRules = this.formData2.rules[index]
      }
      this.showForm = true
    },
    isError (index) {
      let form
      let rule
      if (this.formData.formList.length) {
        form = this.formData.formList[index]
        rule = this.formData.rules[index]
      } else {
        form = this.formData2.formList[index]
        rule = this.formData2.rules[index]
      }
      for (let key of Object.keys(form)) {
        if (rule[key][0].required && !form[key]) {
          return true
        }
      }
    },
    confirm (e) {
      if (this.products.length) {
        this.confirmMultipleProduct()
        return
      }
      const formList = this.formData.formList
      const rules = this.formData.rules
      const data = []
      for (const [i, form] of formList.entries()) {
        const fields = []
        for (const key of Object.keys(form)) {
          fields.push({
            fieldName: key,
            fieldValue: form[key],
            required: rules[i][key][0].required
          })
        }
        data.push(fields)
      }
      this.product.customForm = data
      // 确定后，将当前表单列表保存起来，用当前商品ID作为区别
      sessionStorage.setItem(`CUSTOM_FORM_${this.product.productId}`, JSON.stringify(this.formData.formList))
      this.$emit('confirm', e)
    },
    // 提交多个实体商品
    confirmMultipleProduct () {
      const form = this.formData2.formList[0]
      const rules = this.formData2.rules[0]
      for (const pro of this.products) {
        pro.customForm = []
        const fields = []
        for (const cus of pro.formEntityList) {
          const key = cus.fieldName
          fields.push({
            fieldName: key,
            fieldValue: form[key],
            required: rules[key][0].required
          })
        }
        pro.customForm.push(fields)
      }
      // 确定后，将当前表单列表保存起来，用第一个商品ID做区别
      sessionStorage.setItem(`CUSTOM_FORM_${this.products[0].productId}`, JSON.stringify(this.formData2.formList))
    }
  }
}
</script>

<style module lang="scss">
  .customBlock {
    margin-bottom: 20px;
    padding-left: 24px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
  }
  .customList {
    margin-top: 20px;
    margin-bottom: 32px;
    padding-right: 24px;
  }
  .customItem {
    display: flex;
    align-content: center;
    justify-content: space-between;
    margin-bottom: 48px;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
  }
  .field {
    font-size: 26px;
  }
  .value {
    font-size: 26px;
    color: #999;
    > svg {
      margin-left: 10px;
      vertical-align: -4px;
    }
  }
</style>
