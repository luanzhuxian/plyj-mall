<template>
  <div
    :class="{
      [$style.infoItem]: true,
    }"
  >
    <div :class="$style.content">
      <span :class="$style.itemLabel">{{ label }}</span>
      <div
        :class="{ [$style.collapse]: collapse }"
        @click="collapse = !collapse"
      >
        <span>请填写</span>
        <pl-svg
          :class="{ [$style.rightArrow]: true }"
          name="icon-right" fill="#ccc" height="24"
        />
      </div>
    </div>

    <ul
      :class="{ [$style.list]: true, [$style.collapse]: collapse }"
      v-if="formData.formList"
    >
      <li
        v-for="(item, i) of formData.formList"
        :key="i"
        @click="editStudent(i)"
      >
        <div>{{ label }}{{ i + 1 }}</div>
        <div>
          <span v-if="isError(i)">未填写</span>
          <span v-else v-text="item[Object.keys(item)[0]]" />
          <pl-svg :class="$style.rightArrow" name="icon-right" fill="#ccc" height="24" />
        </div>
      </li>
    </ul>

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
  name: 'CustomInline',
  components: {
    CustomForm
  },
  data () {
    return {
      collapse: false,
      showForm: false,
      currentForm: {},
      currentRules: {}
    }
  },
  props: {
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
    label: {
      type: String,
      default: '学员信息'
    },
    count: {
      type: Number,
      default: 0
    }
  },
  watch: {
  },
  computed: {
    formData () {
      const formList = []
      const rules = []
      for (let i = 0; i < this.count; i++) {
        const form = {}
        const rule = {}
        for (const cus of this.customList) {
          const key = cus.fieldName
          form[key] = ''
          rule[key] = [{ required: Boolean(cus.required), message: `请输入${cus.fieldName}`, trigger: 'blur' }]
        }
        formList.push(form)
        rules.push(rule)
      }
      return { formList, rules }
    }
  },
  methods: {
    selectStudent () {
      const product = this.product
      sessionStorage.setItem('SELECT_STUDENT_FROM', JSON.stringify({
        name: this.$route.name,
        query: this.$route.query,
        params: this.$route.params
      }))
      this.$router.push({
        name: 'StudentList',
        query: {
          select: 'YES',
          sku: product.skuCode1 + product.skuCode2,
          count: product.count
        }
      })
    },
    editStudent (index) {
      this.currentForm = this.formData.formList[index]
      this.currentRules = this.formData.rules[index]
      this.showForm = true
    },
    isError (index) {
      const form = this.formData.formList[index]
      const rule = this.formData.rules[index]
      for (let key of Object.keys(form)) {
        if (rule[key][0].required && !form[key]) {
          return true
        }
      }
    },
    confirm (e) {
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
      localStorage.setItem(`CUSTOM_FORM_${this.product.productId}`, JSON.stringify(data))
      this.$emit('confirm', e)
    }
  }
}
</script>

<style module lang="scss">
  .infoItem {
    line-height: 88px;
    font-size: 24px;
    border: 2px solid #fff;
  }
  .rightArrow {
    margin-left: 10px;
    vertical-align: -4px;
    transition: transform .2s linear;
    transform: rotate(90deg);
  }
  .collapse {
    > .rightArrow {
      transform: rotate(0);
    }
  }
  .list {
    padding: 0 24px 0 88px;
    background-color: #F8F8F8;
    overflow: hidden;
    transition: max-height .2s linear;
    > li {
      display: flex;
      flex: 1;
      justify-content: space-between;
      line-height: 116px;
      .rightArrow {
        transform: rotate(0);
      }
    }
    &.collapse {
      height: 0;
    }
  }
  .content {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding-left: 68px;
    padding-right: 28px;
  }
</style>
