<template>
  <transition name="fade">
    <div :class="$style.signUp" v-if="!loading">
      <div :class="$style.slogn" />
      <main :class="$style.main">
        <div :class="$style.oath">
          <img src="https://mallcdn.youpenglai.com/static/beat-plague/4baf5d68-a0cf-4cfb-814f-f8887413fd61.png" alt="">
          <div :class="$style.text">
            <p>2020年的中国春节前的一场疫情，牵动了每一位中国人的心!我们倡议大家都取消外出活动，为阻挡疫情的扩散，尽着自己的力量。</p>
            <p>在抗击疫情最关键的时刻，全国上下齐心协力、众志成城，同样，作为莘莘学子们也希望和战斗在一线逆行的先锋们携手战斗，和疫情赛跑，以自己的方式为这场战斗贡献力量。</p>
            <p>我们要相信相信的力量，相信我们共同携手一定能战胜疫情！</p>
          </div>
        </div>

        <pl-form
          :class="$style.form"
          label-width="164"
          align="right"
          ref="form"
          :model="form"
          :rules="rules"
          :label-style="{
            fontWeight: 'normal',
          }"
        >
          <p :class="$style.title">请填写报名信息，携手共同抗击疫情</p>
          <pl-form-item label="真实姓名" prop="name">
            <pl-input v-model="form.name" placeholder="请输入参与的学员姓名" />
          </pl-form-item>
          <pl-form-item label="手机号" :gap-top="20" prop="phoneNo" v-if="!mobile">
            <pl-input v-model="form.phoneNo" placeholder="请输入家长手机号" />
          </pl-form-item>
          <pl-form-item label="验证码" :gap-top="20" prop="verifyCode" v-if="!mobile">
            <pl-input v-model="form.verifyCode" placeholder="请输入验证码" />
            <template v-slot:suffix>
              <get-code
                :mobile="form.phoneNo"
                :smstype="smstype.PUBLIC_USER_INFO"
                ref="getCode"
              />
            </template>
          </pl-form-item>
          <pl-form-item label="年级" :gap-top="20" prop="grade" v-if="detail.isGrade">
            <pl-input
              placeholder="请输入所在年级"
              v-model="form.grade"
            />
          </pl-form-item>
          <pl-form-item label="所在区域" :gap-top="20" prop="area" v-if="detail.isArea">
            <pl-input
              placeholder="请选择所在地区"
              disabled
              v-model="form.area"
              @click="showCitySelector = true"
              @clear="addrClear"
              suffix-icon="icon-right"
            />
          </pl-form-item>
          <pl-form-item :label="detail.customTitle" :gap-top="20" prop="customTitle" v-if="detail.customTitle">
            <pl-input :placeholder="`请输入${detail.customTitle}`" v-model="form.customContent" />
          </pl-form-item>
        </pl-form>
      </main>

      <button :class="$style.sign" @click="signUp">立即报名</button>

      <CitySelector
        :show.sync="showCitySelector"
        @select="selectCity"
        ref="citySelector"
      />

      <!--<pl-picker
        :show.sync="showPicker"
        :slots="classes"
        @confirm="classesConfirm"
      />-->
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import CitySelector from '../../components/common/City-Selector.vue'
import { signInfo, signUp, incrAccess } from '../../apis/fight-epidemic'
export default {
  name: 'SignUp',
  components: {
    CitySelector
  },
  data () {
    return {
      showCitySelector: false,
      showPicker: false,
      loading: false,
      classes: [
        {
          values: [
            '一年级',
            '二年级',
            '三年级',
            '四年级',
            '五年级',
            '六年级'
          ],
          textAlign: 'center',
          flex: 1
        }
      ],
      form: {
        activityId: '',
        phoneNo: '',
        verifyCode: '',
        name: '',
        grade: '',
        area: '',
        customContent: ''
      },
      detail: {},
      rules: {
        name: [
          { required: true, message: '请输入姓名' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['smstype', 'mobile'])
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  async created () {
    this.form.activityId = this.id
    try {
      await this.getSingInfo()
    } catch (e) {
      throw e
    }
  },
  methods: {
    async signUp () {
      if (!this.$refs.form.validate()) {
        return
      }
      try {
        await signUp(this.form)
        incrAccess(this.id)
        // 增加访问记录
        this.$router.push({ name: 'EpidemicSignIn', params: { activityId: this.id } })
      } catch (e) {
        throw e
      }
    },
    async getSingInfo () {
      this.loading = true
      try {
        const { result } = await signInfo(this.id)
        this.detail = result
        if (result.haveSignUp) {
          return this.$router.replace({ name: 'EpidemicSignIn', params: { activityId: this.id } })
        }
        this.loading = false
        const rules = {
          grade: [
            { required: result.isGrade, message: '请选择年级' }
          ],
          area: [
            { required: result.isArea, message: '请选择区域' }
          ],
          customContent: [
            { required: result.customTitle, message: `请输入${result.customTitle}` }
          ],
          phoneNo: [
            { required: !this.mobile, message: '请输入手机号' }
          ],
          verifyCode: [
            { required: !this.mobile, message: '请输入验证码' }
          ]
        }
        this.rules = Object.assign({}, this.rules, rules)
      } catch (e) {
        throw e
      }
    },
    selectCity (val) {
      // this.form.province = val[0].code
      // this.form.city = val[1].code
      // this.form.region = val[2] ? val[2].code : ''
      // this.form.town = val[3] ? val[3].code : ''
      this.form.area =
        val[0].name +
        val[1].name +
        (val[2] ? val[2].name : '') +
        (val[3] ? val[3].name : '')
    },
    addrClear () {
      this.$refs.citySelector.clear()
    },
    classesConfirm (val) {
      this.form.grade = val[0]
    }
  }
}
</script>

<style module lang="scss">
  .sign-up {
    padding-bottom: 150px;
    background-color: #495BFF;
  }
  .slogn {
    height: 245px;
    background: url("https://mallcdn.youpenglai.com/static/beat-plague/7fc4ca52-a4f7-4a5d-a7ab-b8ed3c383aac.png") no-repeat center center;
    background-size: 100%;
  }
  .main {
    padding: 0 24px;
  }
  .oath {
    font-size: 0;
    border-radius: 20px;
    overflow: hidden;
    > img {
      width: 100%;
    }
    > .text {
      padding: 40px 30px;
      font-size: 28px;
      color: #666;
      background-color: #fff;
      > p {
        margin-bottom: 55px;
        line-height: 37px;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
      }
    }
  }
  .form {
    margin-top: 20px;
    padding: 0 24px;
    border-radius: 20px;
    overflow: hidden;
    background-color: #fff;
  }
  .title {
    font-size: 28px;
    line-height: 93px;
    border-bottom: 1px solid #e7e7e7;
  }
  .sign {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 96px;
    text-align: center;
    color: #fff;
    font-size: 32px;
    background-color: #FBA229;
  }
</style>
