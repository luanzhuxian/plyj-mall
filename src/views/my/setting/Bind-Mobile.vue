<template>
  <div :class="$style.bindMobile">
    <TopText :title="title" :tip="mobile ? '为了保障您的账户安全，请输入有效的手机号～' : '为了保障您的账户安全，请绑定手机号～'" />
    <pl-form v-if="step === 1" class="mt-28 radius-20" style="overflow: hidden;">

      <pl-form-item border>
        <pl-input
          prefix-icon="mobile"
          type="number"
          :disabled="!!mobile && (step === 1)"
          v-model="bindForm.mobile"
          placeholder="请输入您的手机号"
        />
      </pl-form-item>

      <pl-form-item>
        <pl-input prefix-icon="code" v-model="bindForm.verifyCode" placeholder="请输入验证码">
          <template v-slot:suffix>
            <get-code :mobile="bindForm.mobile" :smstype="smstype.PUBLIC_USER_INFO" />
          </template>
        </pl-input>
      </pl-form-item>

    </pl-form>

    <pl-form v-if="step === 2"
             ref="updateForm"
             :rules="rules"
             :model="updateForm"
             class="mt-28 radius-20"
             style="overflow: hidden;">

      <pl-form-item border prop="mobile">
        <pl-input
          prefix-icon="mobile"
          type="number"
          v-model="updateForm.mobile"
          placeholder="请输入您的新手机号"
        />
      </pl-form-item>

      <pl-form-item prop="verifyCode">
        <pl-input prefix-icon="code" v-model="updateForm.verifyCode" placeholder="请输入验证码">
          <template v-slot:suffix>
            <get-code :mobile="updateForm.mobile" :smstype="smstype.PUBLIC_USER_UPDATE_MOBILE" />
          </template>
        </pl-input>
      </pl-form-item>

    </pl-form>

    <div class="mt-56">
      <pl-button v-if="mobile && step === 1" :disabled="!bindForm.verifyCode" :loading="loading" size="huge" type="warning" @click="next">下一步</pl-button>
      <pl-button v-else :disabled="!bindForm.verifyCode" size="huge" type="warning" :loading="loading" @click="submit">提交</pl-button>
    </div>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import { checkMobileCode, bindMobile, updateMobile } from '../../../apis/base-api'
import { mapGetters } from 'vuex'
import { USER_INFO } from '../../../store/mutation-type'
import { getSession } from '../../../assets/js/util'
export default {
  name: 'Bind-Mobile',
  components: {
    TopText
  },
  data () {
    return {
      loading: false,
      bindForm: {
        mobile: '',
        verifyCode: '',
        openId: ''
      },
      updateForm: {
        mobile: '',
        oldVerifyCode: '',
        oldMobile: '',
        verifyCode: '',
        openId: ''
      },
      rules: {
        verifyCode: [{ required: true, message: '请输入验证码' }],
        mobile: [{ required: true, message: '请输入手机号' }]
      },
      step: 1
    }
  },
  computed: {
    ...mapGetters(['mobile', 'smstype', 'mallSeq', 'openId']),
    title: function () {
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
    this.updateForm.openId = this.bindForm.openId = this.openId
    this.updateForm.oldMobile = this.mobile || ''
  },
  deactivated () {
    for (let k of Object.keys(this.bindForm)) { this.bindForm[k] = '' }
    for (let k of Object.keys(this.updateForm)) { this.updateForm[k] = '' }
    this.step = 1
  },
  methods: {
    async next () {
      try {
        this.loading = true
        let { result } = await checkMobileCode(this.smstype.PUBLIC_USER_INFO, this.bindForm.mobile, this.bindForm.verifyCode)
        if (result) {
          this.step = 2
          this.updateForm.oldVerifyCode = this.bindForm.verifyCode
        } else {
          this.$toast('验证码输入有误')
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        throw e
      }
    },
    async submit () {
      try {
        if (this.mobile) {
          if (!this.$refs.updateForm.validate()) return
          this.loading = true
          await updateMobile(this.updateForm)
          this.$toast('修改手机号成功！')
        } else {
          this.loading = true
          await bindMobile(this.bindForm)
          let { name, params, query } = getSession('willBind')
          if (name) {
            await this.$store.dispatch(USER_INFO)
            this.$router.replace({ name, params, query })
            sessionStorage.removeItem('willBind')
            this.$toast('绑定手机号成功！')
            return
          }
        }
        await this.$store.dispatch(USER_INFO)
        this.loading = false
        this.$router.replace({ name: 'My' })
      } catch (e) {
        this.loading = false
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .bind-mobile {
    padding: 28px 40px;
  }
</style>
