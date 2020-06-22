<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div :class="$style.bindMobile">
        <TopText
            :title="title"
            :tip="mobile ? '为了保障您的账户安全，请输入有效的手机号～' : '为了保障您的账户安全，请绑定手机号～'"
        />
        <pl-form
            v-if="step === 1"
            class="mt-28 radius-20"
            style="overflow: hidden;"
            label-width="40px"
        >
            <pl-form-item border>
                <pl-input
                    prefix-icon="icon-mobile"
                    type="number"
                    :disabled="!!mobile && (step === 1)"
                    v-model="bindForm.mobile"
                    placeholder="请输入您的手机号"
                />
            </pl-form-item>

            <pl-form-item>
                <pl-input
                    prefix-icon="icon-code"
                    v-model="bindForm.verifyCode"
                    placeholder="请输入验证码"
                />
                <template v-slot:suffix>
                    <get-code
                        :mobile="bindForm.mobile"
                        :smstype="smstype.PUBLIC_USER_INFO"
                        ref="getCode"
                    />
                </template>
            </pl-form-item>
        </pl-form>

        <pl-form
            v-if="step === 2"
            ref="updateForm"
            :rules="rules"
            :model="updateForm"
            class="mt-28 radius-20"
            style="overflow: hidden;"
        >
            <pl-form-item
                border
                prop="mobile"
            >
                <pl-input
                    prefix-icon="icon-mobile"
                    type="number"
                    v-model="updateForm.mobile"
                    placeholder="请输入您的新手机号"
                />
            </pl-form-item>

            <pl-form-item prop="verifyCode">
                <pl-input
                    prefix-icon="icon-code"
                    v-model="updateForm.verifyCode"
                    placeholder="请输入验证码"
                />
                <template v-slot:suffix>
                    <get-code
                        :mobile="updateForm.mobile"
                        :smstype="smstype.PUBLIC_USER_UPDATE_MOBILE"
                    />
                </template>
            </pl-form-item>
        </pl-form>

        <div class="mt-56">
            <pl-button
                v-if="mobile && step === 1"
                :disabled="!bindForm.verifyCode"
                :loading="loading"
                size="huge"
                type="warning"
                @click="next"
            >
                下一步
            </pl-button>
            <pl-button
                v-else
                :disabled="!bindForm.verifyCode"
                size="huge"
                type="warning"
                :loading="loading"
                @click="confirm"
            >
                提交
            </pl-button>
        </div>
    </div>
</template>

<script>
import TopText from '../../../components/common/Top-Text.vue'
import { checkMobileCode, bindMobile, updateMobile } from '../../../apis/base-api'
import { getGoingInfo, isNewUser } from '../../../apis/newcomers'
import { mapGetters } from 'vuex'
import { LOGIN, USER_INFO } from '../../../store/mutation-type'
import { resetForm } from '../../../assets/js/util'
import { isPhone } from '../../../assets/js/validate'
import Cookie from '../../../assets/js/storage-cookie'
export default {
    name: 'BindMobile',
    components: {
        TopText
    },
    data () {
        return {
            loading: false,
            bindForm: {
                mobile: '',
                verifyCode: ''
            },
            updateForm: {
                mobile: '',
                oldVerifyCode: '',
                oldMobile: '',
                verifyCode: ''
            },
            rules: {
                verifyCode: [{ required: true, message: '请输入验证码' }],
                mobile: [
                    { required: true, message: '请输入手机号' },
                    { validator: isPhone, message: '手机号格式错误' }
                ]
            },
            step: 1
        }
    },
    computed: {
        ...mapGetters(['mobile', 'smstype', 'openId']),
        title () {
            if (this.step === 1 && this.mobile) {
                return '修改手机'
            }
            if (this.step === 1 && !this.mobile) {
                return '绑定手机'
            }
            if (this.step === 2) {
                return '请输入新手机'
            }
            return ''
        }
    },
    activated () {
        this.bindForm.mobile = this.mobile || ''
        this.updateForm.oldMobile = this.mobile || ''
    },
    deactivated () {
        // 重置表单
        resetForm(this.bindForm)
        resetForm(this.updateForm)
        this.step = 1
    },
    methods: {
        async next () {
            try {
                this.loading = true
                const { result } = await checkMobileCode(this.smstype.PUBLIC_USER_INFO, this.bindForm.mobile, this.bindForm.verifyCode)
                if (result) {
                    this.step = 2
                    this.updateForm.oldVerifyCode = this.bindForm.verifyCode
                } else {
                    this.$warning('验证码输入有误')
                }
                this.loading = false
            } catch (e) {
                this.loading = false
                throw e
            } finally {
                this.$refs.getCode.finishCountDown()
            }
        },
        async confirm () {
            try {
                if (this.mobile) {
                    if (!this.$refs.updateForm.validate()) return
                    this.loading = true
                    await updateMobile(this.updateForm)
                    this.$success('修改手机号成功！')
                } else {
                    this.loading = true
                    await bindMobile(this.bindForm)
                    this.$success('绑定手机号成功！')
                    const { name, params, query } = JSON.parse(sessionStorage.getItem('BIND_MOBILE_FROM')) || {}
                    if (name) {
                        // 新用户助力标识
                        sessionStorage.setItem('INVITE_NEW_USER', 'true')
                        await this.refreshLogin()
                        await this.$router.replace({
                            name,
                            params,
                            query
                        })
                        this.$refs.getCode.finishCountDown()
                        return
                    }
                }
                await this.refreshLogin()
                await this.$router.replace({ name: 'My' })
            } catch (e) {
                if (e) throw e
            } finally {
                this.loading = false
            }
        },
        async refreshLogin () {
            try {
                const DISPATCH = this.$store.dispatch
                Cookie.remove('refresh_token')
                Cookie.remove('token')
                await DISPATCH(LOGIN)
                await DISPATCH(USER_INFO)
                await this.goToNewUserPage()
            } catch (e) {
                throw e
            }
        },

        /**
         * 跳转至新人有礼页面
         */
        async goToNewUserPage () {
            try {
                const { result } = await getGoingInfo()
                const { result: isNew } = await isNewUser(result.id)
                if (result && isNew) {
                    // 有进行中的新人有礼活动，跳转回该页面
                    this.$router.replace({ name: 'Newcomers', params: { id: result.id } })
                    // 抛出一个false错误，终止后续操作
                    /* eslint-disable no-throw-literal */
                    throw false
                }
            } catch (e) {
                throw e
            }
        }
    },
    beforeRouteLeave (to, from, next) {
        sessionStorage.removeItem('BIND_MOBILE_FROM')
        next()
    }
}
</script>

<style module lang="scss">
  .bind-mobile {
    padding: 28px 40px;
  }
</style>
