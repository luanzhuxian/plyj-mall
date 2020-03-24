<template>
    <div
        :class="{
            [$style.customBlock]: true,
            [$style.error]: errorItemId === product.productId || products.some(item => item.productId === errorItemId)
        }"
    >
        <pl-fields
            size="middle"
            :text="label"
            :icon="icon"
            :icon-gap="12"
            left-text-weight="bold"
        >
            <ul
                v-if="formData.formList && formData.formList.length"
                :class="{
                    [$style.customList]: true
                }"
            >
                <li
                    :class="$style.customItem"
                    v-for="(form, i) of formData.formList"
                    :key="i"
                    @click="editStudent(i)"
                >
                    <div :class="$style.field">{{ label }}<i v-if="formData.formList && formData.formList.length > 1">{{
                        i + 1 }}</i></div>
                    <div :class="$style.value">
                        <span
                            v-if="Object.keys(form).some(key => formData.rules[i][key].required && !form[key])">未填写</span>
                        <span v-else v-text="form[Object.keys(form)[0]]" />
                        <pl-svg :class="$style.rightArrow" name="icon-right" fill="#ccc" height="24" />
                    </div>
                </li>
            </ul>

            <ul v-else :class="$style.customList">
                <li
                    :class="$style.customItem"
                    v-for="(form, i) of formData2.formList"
                    :key="i"
                    @click="editStudent(i)"
                >
                    <div :class="$style.field">{{ label }}<i v-if="formData2.formList && formData2.formList.length > 1">{{
                        i + 1 }}</i></div>
                    <div :class="$style.value">
                        <span v-if="Object.keys(form).some(key => formData2.rules[i][key][0].required && !form[key])">未填写</span>
                        <span v-else v-text="form[Object.keys(form)[0]]" />
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
        },
        errorItemId: {
            type: String,
            default: ''
        }
    },
    watch: {
        product: {
            handler (val) {
                if (val.productId) {
                    this.setFormData()
                }
            },
            immediate: true
        },
        products: {
            handler (val) {
                if (val.length) {
                    this.setFormData2()
                }
            },
            immediate: true
        },
        count () {
            this.setFormData()
        },
        errorItemId () {
            this.$nextTick(() => {
                const list = document.querySelector(`.${ this.$style.error }`)
                if (list) {
                    list.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    })
                }
            })
        }
    },
    activated () {
    },
    methods: {

        /**
             * 单商品生存表单，虚拟商品取决于数量
             * 如下，每一个商品都有一个表单对象，比如2个商品，formList 就有2个元素
             * {
             *   formList: [{ field1: '', field2: '', field3: '' }, { field1: '', field2: '', field3: '' }],
             *   rules: []
             * }
             */
        setFormData () {
            const formList = []
            const rules = []
            // 实体商品的自定义表单不受商品数量的影响
            const count = this.product.productType === 'PHYSICAL_GOODS' ? 1 : this.count

            // 获取上次填写的数据，尝试回填
            const oldFormList = JSON.parse(sessionStorage.getItem(`CUSTOM_FORM_${ this.product.productId }`)) || []
            for (let i = 0; i < count; i++) {
                const form = {}
                const rule = {}
                for (const cus of this.customList) {
                    const key = cus.fieldName

                    // 回填数据
                    if (oldFormList[i]) {
                        form[key] = oldFormList[i][key] || ''
                    } else {
                        form[key] = ''
                    }
                    rule[key] = [{
                        required: Boolean(cus.required),
                        message: `请输入${ cus.fieldName }`,
                        trigger: 'none'
                    }]
                }
                formList.push(form)
                rules.push(rule)
            }
            this.formData = { formList, rules }
            this.confirm()
        },

        /**
             * 提交多个实体商品
             * 多个实体商品要将每个商品的自定义表单进行合并，最终只得到一个表单，就像对待一个商品那样
             * 最后提交时会按照每个商品需要的自定义字段进行拆分，不考虑商品数量
             * 数据结构如：
             * {
             *   formList: [{ field1: '', field2: '', field3: '' }],
             *   rules: []
             * }
             */
        setFormData2 () {
            if (!this.products.length) {
                return
            }

            // 获取上次填写的数据，尝试回填
            const oldFormList = JSON.parse(sessionStorage.getItem(`CUSTOM_FORM_${ this.products[0].productId }`)) || null
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
                // 合并多个实体商品的自定义表单的时候，字段可能重复，此时要判断重复的字段的必填性，以必填为准
                if (Reflect.has(rule, key) && cus.required) {
                    rule[key] = [{ required: true, message: `请输入${ cus.fieldName }`, trigger: 'none' }]
                } else {
                    rule[key] = [{
                        required: Boolean(cus.required),
                        message: `请输入${ cus.fieldName }`,
                        trigger: 'none'
                    }]
                }
            }
            formList.push(form)
            rules.push(rule)
            this.formData2 = { formList, rules }
            this.confirm()
        },
        editStudent (index) {
            if (this.formData.formList && this.formData.formList.length) {
                this.currentForm = this.formData.formList[index]
                this.currentRules = this.formData.rules[index]
            } else {
                this.currentForm = this.formData2.formList[index]
                this.currentRules = this.formData2.rules[index]
            }
            this.showForm = true
        },
        async isError (index) {
            let form
            let rule
            if (this.formData.formList && this.formData.formList.length) {
                form = this.formData.formList[index]
                rule = this.formData.rules[index]
            } else {
                form = this.formData2.formList[index]
                rule = this.formData2.rules[index]
            }
            for (const key of Object.keys(form)) {
                if (rule[key][0].required && !form[key]) {
                    console.log(true)
                    return true
                }
            }
            return false
        },

        /**
             * 提交单个非实体商品，提交的时候要拆分
             * 拆分时要注意一点，表单中的每个字段，要转成一个对象，对象包括 fieldName， fieldValue 属性
             * 所以会形成如下的数据结构
             * [
             *  // 第一个商品的表单
             *  [
             *    { fieldName: 'field1', fieldValue: 'a' },
             *    { fieldName: 'field2', fieldValue: 'b' }
             *  ],
             *  // 第二个商品的表单
             *  [
             *    { fieldName: 'field1', fieldValue: 'aa' },
             *    { fieldName: 'field2', fieldValue: 'bb' }
             *  ]
             * ]
             */
        confirm (e) {
            if (this.products.length) {
                this.confirmMultipleProduct()
                return
            }
            const { formList, rules } = this.formData
            const data = []
            for (const [i, form] of formList.entries()) {
                const fields = []
                for (const key of Object.keys(form)) {
                    fields.push({
                        fieldName: key,
                        fieldValue: form[key],
                        required: Number(rules[i][key][0].required)
                    })
                }
                data.push(fields)
            }
            this.product.customForm = data

            // 确定后，将当前表单列表保存起来，用当前商品ID作为区别
            sessionStorage.setItem(`CUSTOM_FORM_${ this.product.productId }`, JSON.stringify(this.formData.formList))
            this.$emit('confirm', e)
        },

        /**
             * 提交多个实体商品，提交的时候要拆分
             * 拆分时要注意一点，表单中的每个字段，要转成一个对象，对象包括 fieldName， fieldValue 属性
             * 所以会形成如下的数据结构
             * [[{ fieldName: 'field1', fieldValue: 'a'  }, { fieldName: 'field2', fieldValue: 'b'  }]]
             */
        confirmMultipleProduct () {
            const form = this.formData2.formList[0]
            for (const pro of this.products) {
                pro.customForm = []
                const fields = []
                for (const cus of pro.formEntityList) {
                    const key = cus.fieldName
                    fields.push({
                        fieldName: key,
                        fieldValue: form[key],
                        required: cus.required
                    })
                }
                pro.customForm.push(fields)
            }

            // 确定后，将当前表单列表保存起来，用第一个商品ID做区别
            sessionStorage.setItem(`CUSTOM_FORM_${ this.products[0].productId }`, JSON.stringify(this.formData2.formList))
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

        &.error {
            border: 1px solid red;
            animation: bordrFlicker .15s ease;
            animation-iteration-count: 10;
        }
    }
    @keyframes bordrFlicker {
        0% { border-color: #F24724 }
        50% { border-color: transparent }
        100% { border-color: #F24724 }
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
