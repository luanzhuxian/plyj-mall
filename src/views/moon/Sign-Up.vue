<template>
  <div :class="$style.signUp">
    <swiper
      :options="swiperOptionBanner"
    >
      <swiperSlide>
        <img :class="$style.banner" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/moon-cake/banner1.jpg" alt="">
      </swiperSlide>
      <swiperSlide>
        <img :class="$style.banner" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/moon-cake/banner2.jpg" alt="">
      </swiperSlide>
      <swiperSlide>
        <img :class="$style.banner" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/moon-cake/banner3.jpg" alt="">
      </swiperSlide>
    </swiper>

    <div :class="$style.box">
      <div :class="$style.title">
        获得我的线上商城
      </div>
      <pl-form
        :model="form"
        :rules="rules"
        :label-width="160"
        ref="form"
      >
        <pl-form-item
          :class="$style.formItem"
          label="机构名称"
          :label-style="labelStyle"
          prop="enterpriseName"
        >
          <pl-input
            size="mini"
            placeholder="请输入机构名称"
            v-model="form.enterpriseName"
          />
        </pl-form-item>
        <pl-form-item
          :class="$style.formItem"
          label="联系人"
          :label-style="labelStyle"
          prop="contactName"
        >
          <pl-input
            size="mini"
            placeholder="请输入联系人姓名"
            v-model="form.contactName"
          />
        </pl-form-item>
        <pl-form-item
          :class="$style.formItem"
          label="联系电话"
          :label-style="labelStyle"
          prop="mobile"
        >
          <pl-input
            size="mini"
            v-model="form.mobile"
            placeholder="请输入联系人电话"
          />
        </pl-form-item>

        <pl-button
          class="mt-40"
          size="large"
          type="warning"
          round
          :loading="loading"
          @click.prevent="confirm"
        >
          立即提交
        </pl-button>
      </pl-form>
    </div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { isPhone, isName } from '../../assets/js/validate'
import { collectUserInfo } from '../../apis/base-api'
export default {
  name: 'SignUp',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      loading: false,
      swiperOptionBanner: {
        slidesPerView: 'auto',
        centeredSlides: true,
        autoplay: true,
        loop: false,
        spaceBetween: 20,
        pagination: {
          el: '.banner-pagination',
          clickable: true
        }
      },
      labelStyle: { fontWeight: 'normal', color: '#666' },
      form: {
        enterpriseName: '',
        contactName: '',
        mobile: ''
      },
      rules: {
        enterpriseName: [{ required: true, message: '请输入机构名称' }],
        contactName: [
          { required: true, message: '请输入联系人姓名' },
          { validator: isName, message: '姓名只支持中文或英文，且在2~10个字符之间' }
        ],
        mobile: [
          { required: true, message: '请输入联系人电话' },
          { validator: isPhone, message: '手机号格式错误' }
        ]
      }
    }
  },
  methods: {
    async confirm () {
      let h = this.$createElement
      let countDown = {
        time: 3000
      }
      let slot = h('p', {
        domProps: {
          innerText: countDown.time
        }
      })
      this.$toast({
        type: 'success',
        message: '报名提交成功',
        slot,
        duration: 30000000
      })
      console.log(slot)
      setInterval(() => {
        slot.data.domProps.time--
      }, 1000)
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await collectUserInfo(this.form)
          this.$success('')
        } catch (e) {
          throw e
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style module lang="scss">
  .sign-up {
    position: relative;
    height: 100vh;
    overflow: auto;
    background-color: #fff;
    .banner {
      width: 100%;
    }
    .box {
      position: absolute;
      top: 628px;
      width: 100%;
      height: calc(100vh - 628px);
      padding: 36px 48px;
      background-color: #fff;
      border-radius: 20px 20px 0 0;
      z-index: 10;
      box-sizing: border-box;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, .2);
    }
    .title {
      margin-bottom: 38px;
      text-align: center;
      font-size: 36px;
      font-weight: bold;
      color: #000;
    }
    .form-item {
      padding-left: 24px;
      margin-bottom: 16px;
      border: 1px solid #ccc;
      border-radius: 20px;
    }
  }
</style>
