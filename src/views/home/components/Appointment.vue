<template>
  <div :class="$style.appointment">
    <div
      v-if="data.showStatue === 1 && data.values.length"
      :class="$style.content"
      @click="yuyueNow"
    >
      <pl-svg :class="$style.giftIcon" name="icon-gift" width="70" height="50" />
      <div :class="$style.left">
        <pl-svg name="icon-yuyue2" width="94" height="50" />
      </div>
      <div :class="$style.right">
        <swiper ref="swiper" :options="swiperOptionBanner" :class="$style.swiper + ' swiper-no-swiping'">
          <swiper-slide :class="$style.swiperSlide" v-for="(item, i) of data.values" :key="i">
            <p v-text="item.value" />
          </swiper-slide>
        </swiper>
        <div :class="$style.now">
          <span>立即预约</span>
          <pl-svg name="icon-right" width="25" height="20" fill="#7E6E4D" />
        </div>
      </div>
    </div>

    <pl-popup :show.sync="showPop" title="在线预约">
      <div :class="$style.popContent">
        <pl-svg :class="$style.giftIcon" name="icon-gift" width="70" height="50" />
        <div :class="$style.right">
          <pl-svg name="icon-yuyueli" width="94" height="50" />
        </div>
        <ul :class="$style.left">
          <li
            v-for="(item, i) of data.values"
            :key="i"
            v-text="item.value"
          />
        </ul>
      </div>
      <form :class="$style.popForm">
        <div class="fz-26 gray-3">预约后您的私人顾问将会电话联系您</div>
        <label>
          <input v-model="appointmentname" type="text" placeholder="请输入预约姓名">
          <pl-svg v-show="appointmentname" @click="appointmentname = ''" :class="$style.clean" name="icon-close2" fill="#ccc" height="30" />
        </label>
        <label>
          <input v-model="appointmentMobile" type="text" placeholder="请输入预约手机">
          <pl-svg v-show="appointmentMobile" @click="appointmentMobile = ''" :class="$style.clean" name="icon-close2" fill="#ccc" height="30" />
        </label>
        <div :class="$style.tip">
          <pl-svg name="icon-safe" width="25" height="25" />
          <span>无强行推销</span>
          <pl-svg name="icon-safe" width="25" height="25" />
          <span>不泄露用户手机号码</span>
        </div>
        <pl-button :loading="loading" size="large" type="warning" @click.prevent="confirm">
          确认预约
        </pl-button>
      </form>
    </pl-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { yuyue } from '../../../apis/appointment'
import { isPhone, isName } from '../../../assets/js/validate'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'AppointmentGift',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      showPop: false,
      loading: false,
      appointmentMobile: '',
      appointmentname: '',
      swiperOptionBanner: {
        direction: 'vertical',
        speed: 1000,
        slidesPerView: 2,
        slidesPerGroup: 2,
        autoplay: {
          delay: 2000
        },
        loop: false,
        pagination: {
          el: '.banner-pagination',
          clickable: true
        }
      }
    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['openId', 'mobile'])
  },
  watch: {
    showPop (val) {
      if (!val) {
        this.appointmentMobile = this.mobile || ''
        this.appointmentname = ''
      }
    }
  },
  mounted () {
    this.appointmentMobile = this.mobile || ''
  },
  activated () {
    if (this.$refs.swiper) {
      this.$refs.swiper.swiper.autoplay.start()
    }
  },
  deactivated () {
    if (this.$refs.swiper) {
      this.$refs.swiper.swiper.autoplay.stop()
    }
  },
  methods: {
    yuyueNow () {
      this.showPop = true
    },
    async confirm () {
      try {
        if (!isPhone(this.appointmentMobile)) {
          return this.$error('请输入正确的手机号')
        }
        if (!isName(this.appointmentname)) {
          return this.$error('请输入正确的姓名')
        }
        this.loading = true
        await yuyue({
          reservationName: this.appointmentname,
          mobile: this.appointmentMobile || this.mobile || '',
          openId: this.openId
        })
        this.$toast({
          type: 'success',
          message: '预约成功',
          viceMessage: '专业顾问会尽快联系您的~'
        })
        this.showPop = false
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style module lang="scss">
  .appointment {
    > .content {
      position: relative;
      display: flex;
      align-items: center;
      height: 76px;
      padding: 20px 24px;
      background: linear-gradient(90deg, #FEEFD1, #E7D79C);
      border-radius: 20px;
      > .left {
        position: relative;
        display: inline-flex;
        align-items: center;
        width: 94px;
        height: 34px;
        padding-right: 20px;
        &:after {
          position: absolute;
          right: 0;
          content: '';
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, #F3D488, #EAB665);
        }
      }
      > .right {
        position: relative;
        flex: 1;
        padding-left: 20px;
        font-size: 28px;
        color: #AB8F58;
        .swiper {
          height: 80px !important;
          .swiper-slide {
            > p {
              width: 350px;
              line-height: 40px;
              @include elps()
            }
          }
        }
        > .now {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          font-size: 24px;
          color: #7e6e4d;
        }
      }
    }
  }
  .gift-icon {
    position: absolute;
    top: 0;
    left: 0;
  }
  .pop-title {
    margin-top: 10px;
    line-height: 80px;
    font-size: 30px;
    text-align: center;
  }
  .pop-content {
    position: relative;
    display: flex;
    margin-bottom: 26px;
    align-items: center;
    padding: 32px 64px;
    background-color: #feefd1;
    > .right {
      position: relative;
      display: inline-flex;
      align-items: center;
      width: 94px;
      height: 34px;
      padding-right: 20px;
      &:after {
        position: absolute;
        right: 0;
        content: '';
        width: 2px;
        height: 100%;
        background: linear-gradient(180deg, #F3D488, #EAB665);
      }
    }
    > .left {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      height: 100%;
      padding-left: 20px;
      font-size: 28px;
      color: #AB8F58;
      > li {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
        &:before {
          position: relative;
          display: inline-block;
          content: '';
          width: 12px;
          height: 12px;
          margin-right: 12px;
          background-color: #AB8F58;
          border-radius: 6px;
        }
      }
    }
  }
  .pop-form {
    position: relative;
    padding: 0 24px 20px;
    > label {
      position: relative;
      display: block;
      > input {
        width: 100%;
        height: 80px;
        margin-top: 26px;
        margin-bottom: 20px;
        padding: 0 20px;
        border: 1px solid #ccc;
        font-size: 32px;
        border-radius: 20px;
        background-color: #F4F5F9;
      }
    }
    > .tip {
      font-size: 24px;
      margin-bottom: 44px;
      > svg {
        margin-right: 15px;
        vertical-align: -2px;
      }
      > span {
        margin-right: 15px;
      }
    }
    .clean {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
