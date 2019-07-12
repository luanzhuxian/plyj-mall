<template>
  <div
    class="apply-helper"
    :class="$style.applyHelper"
  >
    <TopText
      :title="form.auditStatus ? statusTitle[form.auditStatus]: '自购省钱，分享赚钱'"
      :tip="form.auditStatus ? statusTip[form.auditStatus] : '开启全民分享模式，第一桶金从这里开始'"
    />
    <pl-form
      ref="form"
      :model="form"
      :rules="rules"
      :class="$style.form + ' radius-20'"
      :label-width="44"
    >
      <pl-form-item
        prop="name"
        border
      >
        <pl-input
          :disabled="form.auditStatus === 'AWAIT' || form.auditStatus === 'PASS'"
          placeholder="请输入您的真实姓名"
          v-model="form.name"
          prefix-icon="name"
          size="middle"
        />
      </pl-form-item>
      <pl-form-item
        prop="idCard"
        border
      >
        <pl-input
          :disabled="form.auditStatus === 'AWAIT' || form.auditStatus === 'PASS'"
          placeholder="请输入您的身份证号"
          prefix-icon="id-card"
          v-model="form.idCard"
          size="middle"
        />
      </pl-form-item>
      <pl-form-item
        prop="mobile"
        border
      >
        <pl-input
          :disabled="form.auditStatus === 'AWAIT' || form.auditStatus === 'PASS' || Boolean(mobile)"
          placeholder="请输入您的手机号"
          prefix-icon="mobile"
          v-model="form.mobile"
          size="middle"
        />
      </pl-form-item>
      <pl-form-item
        prop="verificationCode"
        v-if="!form.auditStatus || (form.auditStatus === 'REJECT')"
      >
        <pl-input
          :disabled="form.auditStatus === 'AWAIT'"
          placeholder="请输入验证码"
          prefix-icon="code"
          v-model="form.verificationCode"
          size="middle"
        />
        <template v-slot:suffix>
          <get-code
            :disabled="form.auditStatus === 'AWAIT' || !isMobileValid"
            :smstype="smstype.AGENT_USER_INFO"
            :mobile="form.mobile"
          />
        </template>
      </pl-form-item>
    </pl-form>
    <pl-button
      v-if="form.auditStatus !== 'AWAIT'"
      :disabled="form.auditStatus === 'AWAIT' || isBtnDisable"
      type="warning"
      size="huge"
      :loading="loading"
      @click="confirm"
    >
      提交认证
    </pl-button>
    <pl-button
      v-else
      type="warning"
      size="huge"
      @click="$router.replace({ name: 'Home' })"
    >
      返回首页
    </pl-button>
    <div :class="$style.suggestion">
      <p>申请helper流程：</p>
      <p>1.填写完善Helper资料信息；</p>
      <p>2.提交认证后，需商家审核，审核时间为1-3个工作日；</p>
      <p>3.审核通过后，即可拥有Helper的权益；</p>
    </div>
  </div>
</template>

<script>
import TopText from '../../components/Top-Text.vue'
import {
  AuditCreate,
  agentUserInfoAudit,
  updateAudit
} from '../../apis/broker-manager'
import { hasValue, isPhone, isName, isIdCard } from '../../assets/js/validate'
import { mapGetters } from 'vuex'
import { REFRESH_TOKEN, USER_INFO } from '../../store/mutation-type'

const isCode = (code) => code.length === 4

export default {
  name: 'ApplyHelper',
  components: {
    TopText
  },
  data () {
    return {
      loading: false,
      form: {
        name: '',
        idCard: '',
        mobile: '',
        verificationCode: '',
        auditStatus: ''
      },
      statusTip: {
        REJECT: '您的申请被拒绝，您可以选择重新申请',
        AWAIT: '审核中不可修改，请您耐心等待1-3个工作日'
      },
      statusTitle: {
        REJECT: '已拒绝',
        AWAIT: '审核中...'
      },
      rules: {
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { validator: isName, message: '姓名只支持中英文，且中文为2~10字，英文为2~20字', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { validator: isIdCard, message: '请填写正确的身份证号', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: isPhone, message: '手机号不正确', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { validator: isCode, message: '请填写正确的4位验证码', trigger: 'blur' }
        ]
      },
      agentUser: false
    }
  },
  computed: {
    ...mapGetters(['smstype', 'isAdmin', 'mobile']),
    isNameValid () {
      return hasValue(this.form.name) && isName(this.form.name)
    },
    isIDValid () {
      return hasValue(this.form.idCard) && isIdCard(this.form.idCard)
    },
    isMobileValid () {
      return hasValue(this.form.mobile) && isPhone(this.form.mobile)
    },
    isCodeValid () {
      return hasValue(this.form.verificationCode) && isCode(this.form.verificationCode)
    },
    isBtnDisable () {
      return !this.isNameValid || !this.isIDValid || !this.isMobileValid || !this.isCodeValid
    }
  },
  activated () {
    this.getHelperInfo()
    this.form.mobile = this.mobile
  },
  methods: {
    async getHelperInfo () {
      try {
        let { result } = await agentUserInfoAudit()
        if (result.auditStatus === 'PASS') {
          // 如果审核通过，刷新一下用户信息
          await this.$store.dispatch(USER_INFO)
        }
        Object.assign(this.form, result)
      } catch (e) {
        throw e
      }
    },
    async confirm () {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          if (this.form.auditStatus === 'REJECT') {
            await updateAudit(this.form.id, this.form)
          } else {
            await AuditCreate(this.form)
          }
          await this.$store.dispatch(REFRESH_TOKEN)
          this.loading = false
          this.$success('已成功提交认证 请耐心等待审核')
          setTimeout(() => {
            this.$router.replace({ name: 'My' })
          }, 2000)
        } catch (e) {
          this.loading = false
          throw e
        }
      }
    }
  }
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     if (vm.agentUser || vm.isAdmin) {
  //       vm.$router.replace({ name: 'My' })
  //     }
  //   })
  // }
}
</script>

<style module lang="scss">
  .apply-helper {
    padding: 28px 40px;
    form {
      margin-top: 36px;
      margin-bottom: 56px;
      overflow: hidden;
    }
  }
  .form {
    background-color: #fff;
  }
  .suggestion {
    margin-top: 32px;
    font-size: 26px;
    color: #999999;
    line-height: 52px;
  }
</style>
<style lang="scss">
  .apply-helper {
    .pl-get-code {
      border-left: 2px solid #E7E7E7;
    }
  }
</style>
