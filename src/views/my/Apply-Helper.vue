<template>
  <div
    class="apply-helper"
    :class="$style.applyHelper"
    v-if="visible"
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
        v-if="isYaji"
        prop="name"
        border
      >
        <pl-input
          :disabled="true"
          placeholder="请选择您的君区"
          v-model="area"
          prefix-icon="name"
          size="middle"
          @click="showPicker = true"
        />
      </pl-form-item>
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
            ref="getCode"
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
    <div class="agree">
      提交即代表您已阅读并同意 <a @click.prevent="showInvioceIntro = true">《Helper产品购买协议》</a>
    </div>
    <pl-picker
      :show.sync="showPicker"
      :slots="areas"
      @confirm="areaConfirm"
    />
    <pl-popup :show.sync="showInvioceIntro">
      <h2
        class="invioceIntroTitle"
        slot="title"
      >
        Helper产品购买协议
      </h2>
      <div class="invioceIntroContent">
        <h3>一、声明与承诺</h3>
        <p>1.1 欢迎您申请成为本机构的分销人员（以下称“helper”）。以下所述条款和条件即构成您与朋来雅集入驻的机构就使用helper所达成的协议（下称“本协议”）。您确认本协议，即表示您已接受了以下所述的条款和条件。如果您不同意接受全部的条款和条件，那么您将无法成为helper，享有helper的功能和权限，您可以退出申请helper的界面。</p>
        <p>1.2朋来雅集有权随时修改本协议条款，并遵守法定程序将其公示于网站，但无需征得您事先同意。修改后的条款应于公示或通知时立刻生效。在修改本协议后，您继续使用本功能则被视作您已接受了修改后的条款。</p>
        <h3>二、定义</h3>
        <p>2.1 商家机构（以下或称为“商家”）：指在成功注册，入驻成功的机构等注册成功，并在朋来雅集平台上或使用朋来雅集的产品，并开设机构商城的公司、个人、以及其他合法组织。</p>
        <p>2.2 分销人员（以下或称“helper”）：指帮助商家推广商城，参与分享商品并推荐买家购买成功后，可根据商品参与的营销活动，获得商品的相应佣金的用户。</p>
        <p>2.3 佣金（以下简称为“润笔”）：指helper分享商家商城中的商品，并推荐买家购买成功后，可根据营销活动获取到的相应的佣金金额，并可以现金的形式进行提现；</p>
        <h3>三、helper功能的申请、开通和终止</h3>
        <p>3.1 商家将与您同意本协议相关内容后，提交helper申请后，有权对您的资质进行审核；</p>
        <p>3.2商家在对您的资质进行审核时，如果审核通过，则您将成为helper，并享有helper的权限，并参与商家设置的helper活动；</p>
        <p>3.3 您成为helper，分享商品链接产生的润笔，您可以在个人中心的小金库进行查看，并支持提现，通过微信发红包；</p>
        <p>3.4helper的权限一旦开启，商家有权根据自身的营销策略，对目前的helper用户进行单方面的解除合作的权限；解除后，您想要享有helper的权限，必须要重新进行申请；</p>
        <p>3.5您同意您的helper功能可能于下述任一情形下中止和（或）终止，且商家有权单方终止本协议：</p>
        <p>
          (a)商家认定您不再符合helper的使用条件；<br>
          (b)您主动向机构申请停止使用helper的；<br>
          (c)您违反朋来雅集的任何协议或规则，被朋来雅集或商家清退的；<br>
          (d)其它商家认为需终止服务的情况。<br>
          无论本协议因何原因中止或终止，在协议中止或终止前的行为所导致的任何赔偿和责任，您必须完全且独立地承担责任，且非因商家或朋来雅集过错致本协议终止的，商家均有权不同意您的提现申请。
        </p>
        <h3>四、helper提现</h3>
        <p>4.1您同意本协议相关内容后，helper获得润笔后，商家有权对您获得的润笔进行审核；</p>
        <p>4.2在商家未通过审核之前，仅支持查看功能，待审核的润笔不可进行提现操作；商家对润笔审核通过后，helper可进行提现申请；</p>
        <p>4.3您同意本协议相关内容后，helper提现润笔时，商家有权对您提现的金额进行审核；</p>
        <p>4.4在商家未通过审核之前，提现金额不可进行提现；商家对提现金额审核通过后，即可通过发红包的方式，发送给helper；</p>
        <p>4.5您同意本协议中的内容，即同意商家采用微信企业发红包的方案，为您发送提现金额限制范围之内的红包；如果您在24小时内，未领取红包，视为放弃领取，则商家有权将红包金额返还到您的可提现金额中，您如还需提现需重新发起提现申请；</p>
        <h3>五、商家的义务</h3>
        <p>5.1 商家对您对使用helper功能的效果应有合理预估，商家不对您使用该功能后的访问量、产品销量、返利金额等作任何明示或暗示的承诺。</p>
        <p>5.2 您成为该商家的helper后，与商家店铺就分销商品佣金的比例以及发放情况产生争议，由您与商家自行解决，朋来雅集不对此承担任何责任。</p>
        <p>5.3 helper仅支持一级分销，若商家发现您违规使用helper功能，则有权终止您使用helper功能。</p>
        <p>5.4 商家有权对helper营销活动的返润笔金额进行自定义设置。商家设置的规则可能会对helper的佣金分配以及分销规则产生影响，helper同意协议即视为同意商家设置对获得润笔产生的影响。</p>
        <h3>六、朋来雅集的责任限制和免责</h3>
        <p>6.1 朋来雅集在此明确声明对朋来雅集helper功能不作任何明示或暗示的保证，包括但不限于对服务的可适用性、没有错误或疏漏、持续性、准确性、可靠性、适用于某一特定用途之类的保证、声明或承诺。</p>
        <p>6.2 朋来雅集对helper功能所涉的技术和信息的有效性，准确性，正确性，可靠性，质量，稳定，完整和及时性均不作承诺和保证。</p>
        <p>6.3朋来雅集对商家的任何通知，不论是口头还是书面的，均不表示朋来雅集做出在本协议陈述以外的任何担保责任。</p>
        <p>
          6.4对下列情形，朋来雅集不承担任何责任：<br>
          (a)并非由于朋来雅集的故意或过失而导致helper功能未能提供的；<br>
          (b)由于您的故意或过失导致您及/或任何第三方遭受损失的；<br>
          (c)您违反本协议，或违反朋来雅集的其它协议、合同、约定、及/或规则。<br>
          (d)因不可抗力导致朋来雅集不能履行其义务的。
        </p>
        <h3>七、 知识产权</h3>
        <p>7.1 朋来雅集是朋来雅集微商城、程序、helper的版权拥有者。软件包含商业秘密和全世界范围内的版权和其它知识产权。上述软件的知识产权将由朋来雅集保留。</p>
        <p>7.2 若您需要使用朋来雅集已经享有商标权的品牌，需事先经过朋来雅集书面同意。</p>
        <h3>八、协议的修改和解释</h3>
        <p>8.1朋来雅集有权随时根据中华人民共和国有关法律、法规的变化、互联网的发展以及公司经营状况和经营策略的调整等情况修改本协议、新增或取消部分功能等，此种情况下，朋来雅集会通知您，您有必要对最新的协议条款和服务规则等进行仔细阅读和重新确认，当发生有关争议时，以最新的协议条款和服务规则为准。如果您不同意所改动的内容，您应不再申请或使用本插件。</p>
        <p>8.2 您同意，鉴于互联网相关技术、业务模式等发展迅速：朋来雅集有权根据需要不时地制定、修改本协议及/或各类规则。</p>
        <p>8.3 如发生协议条款与中华人民共和国法律相抵触时，则这些条款将完全按法律规定重新解释，而其它条款则依旧对用户有约束力。</p>
        <h3>九、其他</h3>
        <p>9.1 本协议取代双方就有关本协议所载任何事项于先前以口头及书面达成的共识。</p>
        <p>9.2 如本协议的任何条款被视作无效或无法执行，则上述条款可被分离，其余部份则仍具有法律效力。</p>
        <p>9.3  本协议的标题仅为方便阅读所设，非对条款的定义、限制、解释或描述其范围或界限。</p>
        <p>9.4 朋来雅集于您过失或违约时放弃本协议规定的权利的，不得视为其对您的其他或以后同类之过失或违约行为弃权。</p>
      </div>
    </pl-popup>
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
      showInvioceIntro: false,
      loading: false,
      showPicker: false,
      visible: false,
      form: {
        name: '',
        idCard: '',
        mobile: '',
        verificationCode: '',
        auditStatus: '',
        shareUserId: ''
      },
      area: '',
      statusTip: {
        REJECT: '您的申请被拒绝，您可以选择重新申请',
        AWAIT: '审核中不可修改，请您耐心等待1-3个工作日'
      },
      statusTitle: {
        REJECT: '已拒绝',
        PASS: '已通过',
        AWAIT: '审核中...'
      },
      rules: {
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { validator: isName, message: '姓名只支持中英文，且中文为2~10字，英文为2~50字', trigger: 'blur' }
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
      agentUser: false,
      areas: [
        {
          values: [
            '西安分公司',
            '郑州分公司',
            '成都分公司',
            '沈阳分公司',
            '济南分公司',
            '广州分公司',
            '合肥分公司',
            '武汉分公司',
            '长沙分公司',
            '江苏君区',
            '浙江君区',
            '君学书院',
            '课程中心',
            '客服中心',
            '管理咨询中心',
            '教育产业研究院',
            '商务中心',
            '其他'
          ],
          textAlign: 'center',
          flex: 1
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['smstype', 'isAdmin', 'mobile', 'mallId', 'roleCode']),
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
    },
    isYaji () {
      return this.mallId === '1057573777392603136'
    }
  },
  mounted () {
  },
  activated () {
    this.getHelperInfo()
    this.form.mobile = this.mobile
  },
  deactivated () {
    this.showInvioceIntro = false
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
        let str = this.form.name.split('-')
        this.form.name = str[1] || str[0]
        this.area = str[1] && str[0] ? str[0] : ''
        this.form.shareUserId = this.form.shareUserId || this.$route.query.shareUserId
      } catch (e) {
        throw e
      }
    },
    areaConfirm (val) {
      this.area = val[0]
    },
    async confirm () {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          if (this.isYaji) {
            if (!this.area) return this.$warning('请选择君区')
            this.form.name = this.area === '其他' ? this.form.name : (this.area + '-' + this.form.name)
          }
          if (this.form.auditStatus === 'REJECT') {
            await updateAudit(this.form.id, this.form)
          } else {
            await AuditCreate(this.form)
          }
          await this.$store.dispatch(REFRESH_TOKEN)
          this.$success('已成功提交认证 请耐心等待审核')
          this.$refs.getCode.finishCountDown()
          setTimeout(() => {
            this.loading = false
            this.$router.replace({ name: 'My' })
          }, 2000)
        } catch (e) {
          this.loading = false
          throw e
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.mobile || vm.roleCode !== 'MEMBERSHIP') {
        if (from.name) {
          vm.$router.replace({
            name: from.name,
            query: from.query,
            params: from.params
          })
        } else {
          vm.$router.replace({ name: 'My' })
        }
      } else {
        vm.visible = true
      }
    })
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
  .agree{
    position: fixed;
    text-align: center;
    bottom: 40px;
    font-size: 24px;
    color: #999;
    width: 90vw;
    a{
      color: #598BF8;
    }
  }
  .invioceIntroContent {
    padding: 0 40px;
    h3 {
      margin-bottom: 52px;
      font-size: 32px;
    }
    a {
      color: $--primary-color;
    }
    p {
      margin-bottom: 52px;
      font-size: 28px;
      line-height: 38px;
    }
  }
  .invioceIntroTitle {
    font-size: 36px;
    margin: 60px 0;
    text-align: center;
  }
</style>
