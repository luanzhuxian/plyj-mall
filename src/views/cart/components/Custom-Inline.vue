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
            :class="{
                [$style.list]: true,
                [$style.collapse]: collapse,
                [$style.error]: errorItemId === product.productId,
            }"
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
                    <span v-else-if="Object.keys(item)[0]" v-text="item[Object.keys(item)[0]]" />
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
            currentRules: {},
            formData: {}
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
        // 报错的项目id（该项未填写）
        errorItemId: {
            type: String,
            default: ''
        },
        count: {
            type: Number,
            default: 0
        }
    },
    watch: {
        product: {
            handler () {
                this.setFormData()
            },
            immediate: true
        },
        errorItemId () {
            this.$nextTick(() => {
                const list = document.querySelector(`.${ this.$style.error }`)
                list.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                })
            })
        }
    },
    methods: {

        // 单商品
        setFormData () {
            const formList = []
            const rules = []
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
        selectStudent () {
            const { product } = this
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
            for (const key of Object.keys(form)) {
                if (rule[key][0].required && !form[key]) {
                    return true
                }
            }
        },
        confirm (e) {
            const { formList } = this.formData
            const { rules } = this.formData
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

            // 确定后，将当前表单列表保存起来
            sessionStorage.setItem(`CUSTOM_FORM_${ this.product.productId }`, JSON.stringify(this.formData.formList))
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
        padding: 40px 24px 40px 68px;
        background-color: #F8F8F8;
        overflow: hidden;
        transition: max-height .2s linear;

        > li {
            display: flex;
            flex: 1;
            justify-content: space-between;
            margin-bottom: 48px;
            line-height: 36px;

            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }

            .rightArrow {
                transform: rotate(0);
            }
        }

        &.collapse {
            height: 0;
            padding: 0;
        }

        &.error {
            animation: bordrFlicker .15s ease;
            animation-iteration-count: 8;
            border: 2px solid red;
            box-sizing: border-box;
        }
    }

    .content {
        display: flex;
        flex: 1;
        justify-content: space-between;
        padding-left: 68px;
        padding-right: 28px;
    }
    @keyframes bordrFlicker {
        0% { border-color: #F24724 }
        50% { border-color: transparent }
        100% { border-color: #F24724 }
    }
</style>
