<template>
    <div :class="$style.studentInline">
        <div :class="$style.studentList">
            <div
                v-for="(stu, i) of formList"
                :key="i"
                @click="editStudent(stu)"
                :class="$style.item"
            >
                <span v-text="label + ' ' + (i + 1)" />
                <span v-if="checkValue(stu)">已完善</span>
                <span v-else>去完善</span>
            </div>
        </div>

        <CustomForm
            :show.sync="showForm"
            :form="currentForm"
            :rules="rules"
            @confirm="confirm"
            :title="label"
        />
    </div>
</template>

<script>
import CustomForm from './Custom-Form.vue'
import { checkLength } from '../../assets/js/validate'

export default {
    name: 'CustomInline',
    components: {
        CustomForm
    },
    data () {
        return {
            showForm: false,
            currentForm: {},
            // 自定义表单的所有信息，包括字段值和字段描述
            formList: [],
            rules: {}
        }
    },
    props: {
        product: {
            type: Object,
            default () {
                return {}
            }
        },
        label: {
            type: String,
            default: '学员信息'
        }
    },
    computed: {
        count () {
            // 实体商品只需要填写一个自定义表单，其它商品按照商品数量填写多个表单
            return this.product.goodsType === 'PHYSICAL_GOODS' ? 1 : this.product.count
        },
        customList () {
            return this.product.skuCustoms || []
        }
    },
    watch: {
        count: {
            handler (val) {
                if (val) this.initFormData()
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
        initFormData () {
            const CUSTOM_FORM_CACHE = JSON.parse(localStorage.getItem('CUSTOM_FORM_CACHE')) || {}
            const formList = []
            const rules = {}
            const COUNT = this.count
            // 缓存的表单字段属性和值的列表, 这是一个二维数组
            const CACHE_FORM = CUSTOM_FORM_CACHE[this.product.sku1 + this.product.sku2] || []
            // 每个数组代表一个表单, 表单也是数组，存储着字段的所有信息
            for (const cacheForm of CACHE_FORM) {
                const form = {}
                for (const custom of this.customList) {
                    const CACHE_VALUE = cacheForm.find(item => item.fieldName === custom.fieldName)
                    form[custom.fieldName] = CACHE_VALUE ? CACHE_VALUE.fieldValue || '' : ''
                }
                formList.push(form)
                if (formList.length === COUNT) {
                    break
                }
            }
            for (const custom of this.customList) {
                rules[custom.fieldName] = [
                    {
                        required: Boolean(custom.required),
                        message: `请输入${ custom.fieldName }`,
                        trigger: 'none',
                        length: custom.length,
                        sort: custom.sort,
                        valueType: custom.valueType
                    },
                    {
                        validator: checkLength(custom.length),
                        message: `最多输入${ custom.length }个字符`,
                        trigger: 'none'
                    }
                ]
            }
            let i = 0
            const surplus = COUNT - formList.length
            for (; i < surplus; i++) {
                const form = {}
                for (const custom of this.customList) {
                    form[custom.fieldName] = ''
                }
                formList.push(form)
            }
            this.formList = formList
            this.rules = rules
            this.confirm()
        },
        // 编辑某个信息
        editStudent (stu) {
            this.currentForm = stu
            this.showForm = true
        },
        // 不管必填还是非必填，全部都填写为 已完善，否则就是 去完善
        checkValue (stu) {
            for (const k of Object.keys(stu)) {
                if (!stu[k]) {
                    return false
                }
            }
            return true
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
            const CONFIRM_FORM = []
            const CUSTOM_FORM_CACHE = JSON.parse(localStorage.getItem('CUSTOM_FORM_CACHE')) || {}
            const proId = this.product.sku1 + this.product.sku2
            for (const form of this.formList) {
                const FORM = []
                for (const k of Object.keys(form)) {
                    const rule = this.rules[k][0]
                    const FIELD = {
                        fieldName: k,
                        fieldValue: form[k],
                        required: Number(rule.required),
                        length: rule.length,
                        sort: rule.sort,
                        valueType: rule.valueType
                    }
                    FORM.push(FIELD)
                }
                CONFIRM_FORM.push(FORM)
            }
            this.$emit('confirm', this.product.goodsId, CONFIRM_FORM)
            this.CONFIRM_FORM = CONFIRM_FORM
            // 缓存已经填写的表单
            CUSTOM_FORM_CACHE[proId] = CONFIRM_FORM
            localStorage.setItem('CUSTOM_FORM_CACHE', JSON.stringify(CUSTOM_FORM_CACHE))
        },
        checkForm () {
            if (this.CONFIRM_FORM.length < this.count) {
                this.$warning(`请选择${ this.count }名学员信息`)
                return false
            }
            for (const form of this.CONFIRM_FORM) {
                for (const field of form) {
                    if (field.required && !field.fieldValue) {
                        this.$warning(`请填写${ this.label }`)
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
    .student-inline {
        .header {
            display: flex;
            justify-content: space-between;
            line-height: 50px;
        }

        .rightArrow {
            vertical-align: -4px;
        }

        .studentList {
            line-height: 50px;
            color: #999;
            > .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }
</style>
