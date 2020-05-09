<template>
    <div
        :class="{
            [$style.customBlock]: true
        }"
    >
        <pl-fields
            size="middle"
            :text="label"
            :icon="icon"
            :icon-gap="12"
            left-text-weight="bold"
        >
            <ul :class="$style.customList">
                <li
                    :class="$style.customItem"
                    v-for="([proId, form], i) of formData.formList"
                    :key="i"
                    @click="editStudent(proId)"
                >
                    <div :class="$style.field">
                        {{ label }}<i v-if="formData.formList && formData.formList.size > 1">{{ i + 1 }}</i>
                    </div>
                    <div :class="$style.value">
                        <span v-if="Object.keys(form).some(k => formData.rules.get(proId)[k][0].required && !form[k])">未填写</span>
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
import { checkLength } from '../../../assets/js/validate'

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
            // 自定义表单的所有信息，包括字段值和字段描述
            formData: {}
        }
    },
    props: {
        label: {
            type: String,
            default: '用户信息'
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
        products: {
            handler (val) {
                if (val.length) {
                    this.setFormData()
                }
            },
            immediate: true
        }
    },
    methods: {

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
        setFormData () {
            const CUSTOM_FORM_CACHE = JSON.parse(localStorage.getItem('CUSTOM_FORM_CACHE')) || {}
            const formList = new Map()
            const rules = new Map()
            for (const pro of this.products) {
                const form = {}
                const rule = {}
                // 缓存的表单字段属性和值的列表
                const CACHE_FORM = CUSTOM_FORM_CACHE[pro.goodsId] || []
                for (const custom of pro.skuCustoms) {
                    // 获取具体某个字段值对象
                    const CACHE_VALUE = CACHE_FORM.find(item => item.fieldName === custom.fieldName)
                    const RULE = [
                        {
                            required: Boolean(custom.required),
                            message: `请输入${ custom.fieldName }`,
                            trigger: 'none'
                        },
                        {
                            validator: checkLength(custom.length),
                            message: `最多输入${ custom.length }个字符`,
                            trigger: 'none'
                        }
                    ]
                    form[custom.fieldName] = CACHE_VALUE ? CACHE_VALUE.fieldValue || '' : ''
                    // form.valueType = ''
                    // form.required = ''
                    // form.length = ''
                    // form.sort = ''
                    Object.defineProperties(RULE, {
                        valueType: {
                            enumerable: false,
                            value: custom.valueType
                        },
                        required: {
                            enumerable: false,
                            value: custom.required
                        },
                        maxLength: {
                            enumerable: false,
                            value: custom.length
                        },
                        sort: {
                            enumerable: false,
                            value: custom.sort
                        }
                    })
                    rule[custom.fieldName] = RULE
                }
                formList.set(pro.goodsId, form)
                rules.set(pro.goodsId, rule)
            }
            this.formData = {
                rules,
                formList
            }
            this.confirm()
        },
        // 编辑某个信息
        editStudent (proId) {
            this.currentForm = this.formData.formList.get(proId)
            this.currentRules = this.formData.rules.get(proId)
            this.showForm = true
        },

        /**
         * 提交多个实体商品，提交的时候要拆分
         * 拆分时要注意一点，表单中的每个字段，要转成一个对象，对象包括 fieldName， fieldValue 属性
         * 所以会形成如下的数据结构
         * {
         *   [proId]: [{ fieldName: 'field1', fieldValue: 'a', reuqired: 1  }, { fieldName: 'field2', fieldValue: 'b', reuqired: 1  }]
         * }
         */
        confirm () {
            /*
              将数据缓存起来，以便下次遇到相同商品时使用
              每组数据与之商品id一一对应
             */
            const CONFIRM_FORM = {}
            const RULES = this.formData.rules
            for (const [proId, form] of this.formData.formList) {
                CONFIRM_FORM[proId] = []
                const rules = RULES.get(proId)
                for (const k of Object.keys(form)) {
                    const fieldRule = rules[k]
                    const FIELD = {
                        fieldName: k,
                        fieldValue: form[k],
                        valueType: fieldRule.valueType,
                        length: fieldRule.maxLength,
                        required: fieldRule.required,
                        sort: fieldRule.sort
                    }
                    CONFIRM_FORM[proId].push(FIELD)
                }
            }
            this.$emit('confirm', CONFIRM_FORM)
            this.CONFIRM_FORM = CONFIRM_FORM
            // 缓存已经填写的表单
            localStorage.setItem('CUSTOM_FORM_CACHE', JSON.stringify(CONFIRM_FORM))
        },
        checkForm () {
            for (const key of Object.keys(this.CONFIRM_FORM)) {
                for (const field of this.CONFIRM_FORM[key]) {
                    if (field.required && !field.fieldValue) {
                        this.$warning('请填写用户信息')
                        return false
                    }
                }
            }
            return true
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
