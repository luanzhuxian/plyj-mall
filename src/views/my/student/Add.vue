<template>
    <div :class="$style.addStudent">
        <TopText
            :title="id ? '编辑学员信息' : '添加学员信息'"
            tip="重要信息，请认真填写。"
        />

        <pl-form
            ref="form"
            :model="form"
            :class="$style.form + ' radius-20'"
            label-width="40"
            :rules="rules"
        >
            <pl-form-item
                border
                prop="stuName"
            >
                <pl-input
                    placeholder="学员姓名"
                    v-model.trim="form.stuName"
                    size="middle"
                />
            </pl-form-item>
            <pl-form-item
                border
                prop="stuMobile"
            >
                <pl-input
                    placeholder="手机号码"
                    v-model.trim="form.stuMobile"
                    size="middle"
                />
            </pl-form-item>
        </pl-form>

        <div :class="$style.setDefault + ' radius-20'">
            <span class="fz-30">设为默认学员</span>
            <pl-switch v-model="form.defaultStatus" :active-text="1" :inactive-text="0" />
        </div>

        <div
            v-if="id"
            :class="$style.remove"
            @click="remove"
        >
            删除该学员
        </div>

        <pl-button
            :class="$style.submit"
            size="huge"
            type="warning"
            :loading="loading"
            @click="confirm"
        >
            {{ canSelect ? '保存并使用' : '保存' }}
        </pl-button>
    </div>
</template>

<script>
import TopText from '../../../components/common/Top-Text.vue'
import { isPhone, isName } from '../../../assets/js/validate'
import { resetForm } from '../../../assets/js/util'
import {
    add,
    remove,
    edit,
    getDetail,
    wouldINeedOpenDefault
} from '../../../apis/student'
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'AddStudent',
    components: {
        TopText
    },
    data () {
        return {
            defaultStatus: false,
            form: {
                defaultStatus: 0,
                stuMobile: '',
                stuName: ''
            },
            rules: {
                stuName: [
                    { required: true, message: '请输入学员姓名', trigger: 'blur' },
                    { validator: isName, message: '姓名只支持中英文，且中文为2~10字，英文为2~20字', trigger: 'blur' }
                ],
                stuMobile: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { validator: isPhone, message: '手机号码格式错误', trigger: 'blur' }
                ]
            },
            loading: false
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['mobile']),
        canSelect () {
            return this.$route.query.select === 'YES'
        },
        sku () {
            return this.$route.query.sku
        },
        count () {
            return this.$route.query.count
        }
    },
    async activated () {
    },
    deactivated () {
        resetForm(this.form)
        delete this.form.id
    },
    methods: {
        ...mapMutations([`submitOrder/setCheckedStudent`, `submitOrder/removeStudent`]),
        async confirm () {
            if (this.$refs.form.validate()) {
                try {
                    this.loading = true
                    let result
                    if (this.id) {
                        const { result: res } = await edit([this.form])
                        if (res) {
                            result = res
                        }
                    } else {
                        const { result: res } = await add(this.form)
                        result = res
                    }
                    if (this.sku) {
                        this[`submitOrder/setCheckedStudent`]({ sku: this.sku, student: result, count: this.count })
                    }
                    this.$router.replace({
                        name: 'StudentList',
                        query: this.$route.query
                    })
                } catch (e) {
                    throw e
                } finally {
                    this.loading = false
                }
            }
        },
        async remove () {
            await this.$confirm({
                message: '是否删除该学员？',
                confirmText: '删除'
            })
            try {
                const { result } = await remove([this.id])
                if (result) {
                    this.$success('删除成功')
                    this.$router.replace({
                        name: 'StudentList',
                        query: this.$route.query
                    })
                    // 删除学员时，需要同步删除提交订单那边选择的学员
                    if (this.sku) {
                        this[`submitOrder/removeStudent`]({ sku: this.sku, studentId: this.id })
                    }
                }
            } catch (e) {
                throw e
            }
        }
    },
    beforeRouteLeave (to, from, next) {
        if (to.name !== 'StudentList') {
            sessionStorage.removeItem('SELECT_STUDENT_FROM')
        }
        next()
    },
    beforeRouteEnter (to, from, next) {
        next(async vm => {
            if (!vm.mobile) {
                try {
                    await vm.$confirm('请先绑定手机')
                    sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                        name: vm.$route.name,
                        params: vm.$route.params,
                        query: vm.$route.query
                    }))
                    vm.$router.replace({
                        name: 'BindMobile'
                    })
                } catch (e) {
                    vm.$router.push({
                        name: from.name,
                        query: from.query,
                        params: from.params
                    })
                }
            } else {
                const { result } = await wouldINeedOpenDefault()
                vm.form.defaultStatus = result ? 0 : 1
                if (vm.id) {
                    vm.form.id = vm.id
                    try {
                        const { result } = await getDetail(vm.id)
                        vm.form.stuName = result.stuName
                        vm.form.stuMobile = result.stuMobile
                        vm.form.defaultStatus = result.defaultStatus
                    } catch (e) {
                        throw e
                    }
                }
            }
        })
    }
}
</script>

<style module lang="scss">
  .add-student {
    padding: 28px 40px;
    .form {
      margin-top: 36px;
      overflow: hidden;
    }
  }
  .set-default {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
    padding: 23px 40px;
    background-color: #fff;
  }
  .remove {
    margin-top: 28px;
    padding: 0 40px;
    line-height: 108px;
    font-size: 30px;
    color: #F24724;
    background-color: #fff;
    border-radius: 20px;
  }
  .submit {
    position: fixed;
    bottom: 40px;
    width: 670px !important;
    margin: 120px auto 20px;
  }
</style>
