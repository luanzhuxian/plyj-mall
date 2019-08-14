<template>
  <div :class="$style.wwec">
    <div :class="$style.top">
      <div :class="$style.count">
        <pl-svg name="laba" color="#fff" />
        <span>目前已有{{ submitCount }}家机构提交线上教育商城申请</span>
      </div>
      <div :class="$style.list" v-show="infoList.length">
        <swiper
          :options="swiperOptionBanner"
          :class="$style.swiper + ' swiper-no-swiping'"
          ref="swiper"
        >
          <swiper-slide
            :class="$style.swiperSlide"
            v-for="(item, i) of infoList"
            :key="i + Math.random()"
          >
            <pl-svg name="hot" color="#fff" />
            <span :class="$style.companyName">{{ item }}成功抢占一个名额</span>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div :class="$style.form">
      <pl-form
        :label-width="184"
        :model="form"
        ref="form"
        :rules="rules"
      >
        <pl-form-item
          :label-style="labelStyle"
          :class="$style.formItem"
          label="姓名"
          :gap-top="16"
          prop="contactName"
        >
          <pl-input v-model="form.contactName" size="mini" placeholder="请输入联系人真实姓名" />
        </pl-form-item>
        <pl-form-item
          :label-style="labelStyle"
          :class="$style.formItem"
          label="手机号"
          :gap-top="16"
          prop="mobile"
        >
          <pl-input v-model="form.mobile" size="mini" placeholder="请输入联系人手机号" />
        </pl-form-item>
        <pl-form-item
          :label-style="labelStyle"
          :class="$style.formItem"
          label="机构名称"
          :gap-top="16"
          prop="enterpriseName"
        >
          <pl-input v-model="form.enterpriseName" size="mini" placeholder="请输入机构名称" />
        </pl-form-item>
      </pl-form>

      <p :class="$style.title">职位</p>
      <div :class="$style.types" @change="jobChange">
        <label>
          <input type="radio" name="job" value="校长" v-show="false">
          <span>校长</span>
        </label>
        <label>
          <input type="radio" name="job" value="市场老师" v-show="false">
          <span>市场老师</span>
        </label>
        <label>
          <input type="radio" name="job" value="咨询顾问" v-show="false">
          <span>咨询顾问</span>
        </label>
        <label>
          <input type="radio" name="job" value="其它" checked v-show="false">
          <span>其它</span>
        </label>
      </div>
      <p :class="$style.title">经营类型</p>
      <div :class="$style.types" @change="typesChange">
        <label>
          <input type="radio" name="types" value="K12教育" v-show="false">
          <span>K12教育</span>
        </label>
        <label>
          <input type="radio" name="types" value="语言培训" v-show="false">
          <span>语言培训</span>
        </label>
        <label>
          <input type="radio" name="types" value="兴趣特长" v-show="false">
          <span>兴趣特长</span>
        </label>
        <label>
          <input type="radio" name="types" value="早教幼教" v-show="false">
          <span>早教幼教</span>
        </label>
        <label>
          <input type="radio" name="types" value="职称技能" v-show="false">
          <span>职称技能</span>
        </label>
        <label>
          <input type="radio" name="types" value="公务求职" v-show="false">
          <span>公务求职</span>
        </label>
        <label>
          <input type="radio" name="types" value="留学考试" v-show="false">
          <span>留学考试</span>
        </label>
        <label>
          <input type="radio" name="types" value="其它" checked v-show="false">
          <span>其它</span>
        </label>
      </div>
      <button :class="$style.confirm" @click="getNow">一键领取免费名额</button>
    </div>
    <img style="width: 100%;" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/820/820.jpg" alt="">
    <div :class="$style.success">
      <p>
        <pl-svg name="success-example" />
      </p>
      <ul :class="$style.successList">
        <li>
          <a href="http://mall.youpenglai.com/xhedu">
            <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/820/xiaohe.jpg" alt="">
            <p>小荷教育</p>
          </a>
        </li>
        <li>
          <a href="http://mall.youpenglai.com/zendo">
            <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/820/zhentu.jpg" alt="">
            <p>真途户外</p>
          </a>
        </li>
        <li>
          <a href="http://mall.youpenglai.com/stouch">
            <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/820/xiaotaoqi.jpg" alt="">
            <p>小淘气</p>
          </a>
        </li>
        <li>
          <a href="http://mall.youpenglai.com/demo/home">
            <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/820/demoxiao.jpg" alt="">
            <p>demo校</p>
          </a>
        </li>
      </ul>
    </div>

    <call-us />
  </div>
</template>

<script>
import CallUs from '../../components/Call-Us.vue'
import { Loading } from '../../components/penglai-ui'
import {
  getInfo,
  getRegisterInfo
} from '../../apis/wwec'
import { resetForm } from '../../assets/js/util'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { isName, checkLength, isPhone } from '../../assets/js/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'Wwec',
  components: {
    CallUs,
    swiper,
    swiperSlide
  },
  data () {
    return {
      labelStyle: {
        fontWeight: 'normal',
        color: '#666'
      },
      swiperOptionBanner: {
        direction: 'vertical',
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, // 修改swiper的父元素时，自动初始化swiper
        autoplay: true,
        stopOnLastSlide: false
      },
      form: {
        businessScope: '其它',
        contactName: '',
        enterpriseName: '',
        mobile: '',
        position: '其它',
        status: 1,
        id: ''
      },
      infoList: [],
      submitCount: 0,
      rules: {
        contactName: [
          { required: true, message: '请输入联系人姓名' },
          { validator: isName, message: '姓名为2~50个中文或英文字符' }
        ],
        mobile: [
          { required: true, message: '请输入联系人手机号' },
          { validator: isPhone, message: '手机号格式错误' }
        ],
        enterpriseName: [
          { required: true, message: '请输入机构名称' },
          { validator: checkLength(50), message: '机构名称不难超过50个字符' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['mobile', 'realName', 'userName'])
  },
  async activated () {
    this.$refs.swiper.swiper.autoplay.start()
    this.form.mobile = this.mobile || ''
    this.form.contactName = this.realName || this.userName
    try {
      this.getInfoList()
    } catch (e) {
      throw e
    }
  },
  deactivated () {
    resetForm(this.form, {
      businessScope: '其它',
      position: '其它',
      status: 1
    })
    this.$refs.swiper.swiper.autoplay.stop()
  },
  methods: {
    jobChange (e) {
      let { target } = e
      this.form.position = target.value
    },
    typesChange (e) {
      let { target } = e
      this.form.businessScope = target.value
    },
    async getInfoList () {
      try {
        let { result } = await getRegisterInfo()
        this.infoList = result.list
        this.submitCount = result.submitCount
      } catch (e) {
        throw e
      }
    },
    async getNow () {
      if (!this.$refs.form.validate()) {
        return
      }
      let a = Loading({
        message: '正在生成您的兑换码请耐心等待',
        mask: true
      })
      let start = Date.now()
      let duration = 2000
      let timeout = 0
      try {
        let { result } = await getInfo(this.form)
        timeout = duration - (Date.now() - start)
        // Code820
        if (timeout > 0) {
          setTimeout(() => {
            a.close()
            this.$router.push({
              name: 'Code820',
              params: {
                id: result.id,
                code: result.exchangeCode
              }
            })
          }, timeout)
        } else {
          a.close()
          this.$router.push({
            name: 'Code820',
            params: {
              id: result.id,
              code: result.exchangeCode
            }
          })
        }
      } catch (e) {
        a.close()
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .wwec {
    padding-bottom: 140px;
    background-color: #0b1344;
    font-size: 0;
  }
  .top {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 306px;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/820/wwec1.png") no-repeat;
    background-size: 100%;
    > .count {
      padding: 0 24px;
      font-size: 24px;
      color: #fff;
      line-height: 62px;
      background-color: rgba(0, 0, 0, .6);
      > svg {
        width: 30px;
        margin-right: 12px;
        vertical-align: -6px;
      }
    }
    > .list {
      height: 56px;
      width: 600px;
      margin-left: 12px;
      margin-bottom: 12px;
      padding: 0 28px;
      font-size: 24px;
      color: #fff;
      background-color: rgba(0, 0, 0, .6);
      border-radius: 28px;
      svg {
        width: 30px;
        transform: scaleY(1.3);
        vertical-align: 18px;
      }
      .swiper {
        height: 56px;
        line-height: 56px;
      }
      .swiper-slide {
        height: 56px;
      }
      .company-name {
        display: inline-block;
        width: 570px;
        @include elps();
        &:before {
          display: inline-block;
          content: '|';
          margin: 0 10px;
          color: #e7e7e7;
          font-weight: lighter;
          vertical-align: 2px;
        }
      }
    }
  }
  .form {
    padding: 48px 46px;
    background-color: #fff;
    border-radius: 20px;
    .form-item {
      border: 1px solid #ccc;
      padding-left: 24px;
      border-radius: 20px;
    }
    .title {
      font-size: 28px;
      line-height: 78px;
      color: #000;
      font-weight: bold;
    }
  }
  .types {
    display: grid;
    grid-template-columns: repeat(4, 152px);
    grid-template-rows: repeat(auto-fill, 58px);
    grid-gap: 20px;
    font-size: 28px;
    text-align: center;
    > label {
      > span {
        display: block;
        border: 1px solid #ccc;
        line-height: 56px;
        border-radius: 29px;
      }
      > input:checked + span {
        border: none;
        line-height: 58px;
        color: #fff;
        background-color: #598BF8;
      }
    }
  }
  .confirm {
    width: 100%;
    height: 88px;
    letter-spacing: 2px;
    margin-top: 32px;
    font-size: 32px;
    color: #fff;
    background-color: #598BF8;
    border-radius: 20px;
  }
  .success {
    padding-top: 80px;
    background: linear-gradient(180deg, #100f37, #0b1344);
    > p {
      position: relative;
      font-size: 48px;
      line-height: 72px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      > svg {
        width: 500px;
      }
    }
  }
  .success-list {
    width: 100%;
    margin-top: 32px;
    justify-content: flex-start;
    white-space: nowrap;
    overflow: auto;
    > li {
      display: inline-block;
      margin-left: 20px;
      background-color: #fff;
      border-radius: 20px;
      &:nth-last-of-type(1) {
        margin-right: 20px;
      }
      > a {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 202px;
        height: 250px;
        padding: 32px 18px;
        box-sizing: border-box;
        color: #333;
      }
      p {
        width: 100%;
        font-size: 28px;
        line-height: 50px;
        text-align: center;
        word-break: break-all;
        white-space: pre-wrap;
        @include elps-wrap(2);
      }
      img {
        width: 102px;
        height: 102px;
        object-fit: cover;
        border-radius: 51px;
      }
    }
  }
</style>
