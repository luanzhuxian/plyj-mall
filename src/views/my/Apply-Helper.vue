<template>
  <div :class="$style.applyHelper">
    <TopText
      :title="form.auditStatus ? statusTitle[form.auditStatus]: '申请Helper'"
      :tip="form.auditStatus ? statusTip[form.auditStatus] : '第一桶金从这里开始'"
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
          placeholder="请输入您的姓名"
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
          :disabled="form.auditStatus === 'AWAIT' || form.auditStatus === 'PASS'"
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
            :disabled="form.auditStatus === 'AWAIT'"
            :smstype="smstype.AGENT_USER_INFO"
            :mobile="form.mobile"
          />
        </template>
      </pl-form-item>
    </pl-form>
    <pl-button
      v-if="form.auditStatus !== 'AWAIT'"
      :disabled="form.auditStatus === 'AWAIT'"
      type="warning"
      size="huge"
      :loading="loading"
      @click="confirm"
    >
      提交
    </pl-button>
    <pl-button
      v-else
      type="warning"
      size="huge"
      @click="$router.replace({ name: 'Home' })"
    >
      返回首页
    </pl-button>
  </div>
</template>

<script>
import TopText from '../../components/Top-Text.vue'
import {
  AuditCreate,
  agentUserInfoAudit,
  updateAudit
} from '../../apis/broker-manager'
import { isPhone, isName, isIdCard } from '../../assets/js/validate'
import { mapGetters } from 'vuex'
import { REFRESH_TOKEN } from '../../store/mutation-type'
export default {
  name: 'ApplyHelper',
  components: {
    TopText
  },
  data () {
    return {
      loading: false,
      form: {
        idCard: '',
        mobile: '',
        name: '',
        verificationCode: '',
        weChatNumber: '',
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
          { validator: isIdCard, message: '身份证号格式有误', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: isPhone, message: '手机号格式有误', trigger: 'blur' }
        ],
        verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      agentUser: false
    }
  },
  computed: {
    ...mapGetters(['userId', 'smstype', 'isAdmin'])
  },
  activated () {
    this.getHelperInfo()
  },
  methods: {
    async getHelperInfo () {
      try {
        let { result } = await agentUserInfoAudit(this.userId)
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
            await updateAudit(this.form.sequenceNbr, this.form)
          } else {
            await AuditCreate(this.form)
          }
          await this.$store.dispatch(REFRESH_TOKEN)
          this.loading = false
          this.$router.replace({ name: 'My' })
        } catch (e) {
          this.loading = false
          throw e
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next()
    // next(vm => {
    //   if (vm.agentUser || vm.isAdmin) {
    //     vm.$router.replace({ name: 'My' })
    //   }
    // })
  }
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
    .get-code {
      display: inline-block;
      width: 230px;
      text-align: center;
      font-size: 30px;
      color: #ccc;
      border-left: 1px solid #ccc;
      text-decoration: underline;
      &.active {
        color: $--primary-color;
      }
    }
  }
  .form {
    background-color: #fff;
  }
</style>
