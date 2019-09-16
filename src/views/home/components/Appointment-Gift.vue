<template>
  <div :class="$style.appointment">
    <div
      v-if="data.YUYUE.showStatue === 1 && data.YUYUE && data.YUYUE.values.length"
      :class="$style.appointmentGift"
      @click="yuyueNow"
    >
      <pl-svg :class="$style.giftIcon" name="gift" />
      <div :class="$style.left">
        <pl-svg name="yuyue2" />
      </div>
      <div :class="$style.right">
        <swiper ref="swiper" :options="swiperOptionBanner" :class="$style.swiper + ' swiper-no-swiping'">
          <swiper-slide :class="$style.swiperSlide" v-for="(item, i) of data.YUYUE.values" :key="i">
            <p v-text="item.value" />
          </swiper-slide>
        </swiper>
        <div :class="$style.now">
          <span>立即预约</span>
          <pl-svg name="right" color="#7E6E4D" />
        </div>
      </div>
    </div>

    <div
      :class="$style.content"
      v-if="data.PINGXUAN.showStatue === 1 && data.PINGXUAN && data.PINGXUAN.values.length"
      @click="clickPingXuan"
    >
      <div :class="$style.top" @click="$router.push({ name: 'Appointment', query: { showStatus: 'NOT_ALL' } })">
        <div :class="$style.left">
          <div :class="$style.title" v-text="PINGXUAN.values[0].mallName" />
          <div :class="$style.desc" v-text="PINGXUAN.values[0].mallDesc" />
        </div>
        <div :class="$style.center">
          <img :src="logoUrl" alt="">
        </div>
        <div :class="$style.right">
          <pl-svg name="right" color="#ccc" />
        </div>
      </div>
      <div :class="$style.bottom" v-if="mallBrandingRequestModels.length">
        <div :class="$style.title">
          教育特色 :
        </div>
        <ul :class="$style.tags">
          <template v-for="(item, i) of mallBrandingRequestModels">
            <li
              v-if="item.titleName"
              :key="i"
              v-text="item.titleName"
              @click="jump(item)"
            />
          </template>
        </ul>
      </div>
    </div>

    <pl-popup :show.sync="showPop" title="在线预约">
      <div :class="$style.popContent">
        <pl-svg :class="$style.giftIcon" name="gift" />
        <div :class="$style.right">
          <pl-svg name="yuyue2" />
        </div>
        <ul :class="$style.left">
          <li
            v-for="(item, i) of data.YUYUE.values"
            :key="i"
            v-text="item.value"
          />
        </ul>
      </div>
      <form :class="$style.popForm">
        <div class="fz-26 gray-3">预约后您的私人顾问将会电话联系您</div>
        <label>
          <input v-model="appointmentname" type="text" placeholder="请输入预约姓名">
          <pl-svg v-show="appointmentname" @click="appointmentname = ''" :class="$style.clean" name="close2" color="#ccc" />
        </label>
        <label>
          <input v-model="appointmentMobile" type="text" placeholder="请输入预约手机">
          <pl-svg v-show="appointmentMobile" @click="appointmentMobile = ''" :class="$style.clean" name="close2" color="#ccc" />
        </label>
        <div :class="$style.tip">
          <pl-svg name="safe" />
          <span>无强行推销</span>
          <pl-svg name="safe" />
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
    ...mapGetters(['logoUrl', 'openId', 'mobile']),
    YUYUE () {
      return this.data.YUYUE || {}
    },
    PINGXUAN () {
      return this.data.PINGXUAN || {}
    },
    mallBrandingRequestModels () {
      return this.PINGXUAN.values.length ? this.PINGXUAN.values[0].mallBrandingRequestModels.filter(item => item.show === 1) : []
    }
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
    this.$refs.swiper.swiper.autoplay.start()
  },
  deactivated () {
    this.$refs.swiper.swiper.autoplay.stop()
  },
  methods: {
    yuyueNow () {
      if (!this.mobile) {
        this.$confirm('您还没绑定手机，请先绑定手机')
          .then(() => {
            localStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
              name: this.$route.name,
              params: this.$route.params,
              query: this.$route.query
            }))
            this.$router.push({ name: 'BindMobile' })
          })
        return
      }
      this.showPop = true
    },
    clickPingXuan () {
      localStorage.removeItem('PINGXUAN')
    },
    jump (item) {
      if (item.type === 1) {
        this.$router.push({ name: 'SchoolShow' })
        return
      }
      if (item.type === 2) {
        this.$router.push({ name: 'StudentShow' })
        return
      }
      this.$router.push({ name: 'Appointment', hash: `#${item.type}` })
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
    padding: 20px 24px;
    background-color: #f4f5f9;
    > .appointment-gift {
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
        > svg {
          width: 94px;
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
          > svg {
            width: 25px;
            margin-left: 10px;
            vertical-align: -4px;
          }
        }
      }
    }
    > .content {
      display: flex;
      flex-direction: column;
      margin-top: 28px;
      padding: 24px;
      background-color: #fff;
      border-radius: 20px;
      > .top {
        display: flex;
        justify-content: space-between;
        padding-bottom: 24px;
        border-bottom: 1px solid #e7e7e7;
        > .left {
          > .title {
            font-size: 36px;
            font-weight: bold;
          }
          > .desc {
            width: 418px;
            margin-top: 16px;
            font-size: 24px;
            color: #999;
            @include elps-wrap(2);
          }
        }
        > .center {
          > img {
            width: 128px !important;
            height: 128px !important;
            object-fit: cover;
            border-radius: 64px;
          }
        }
        > .right {
          display: inline-flex;
          align-items: center;
          > svg {
            width: 30px;
          }
        }
      }
      > .bottom {
        display: flex;
        font-size: 24px;
        overflow: hidden;
        .title {
          margin-top: 24px;
          color: #666;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          color: #999;
          > li {
            margin-left: 16px;
            margin-top: 16px;
            padding: 0 20px;
            line-height: 50px;
            background-color: #F2F4F5;
            border-radius: 25px;
          }
        }
      }
    }
  }
  .gift-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
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
    .gift-icon {
      width: 100px;
    }
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
      > svg {
        width: 94px;
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
        width: 20px;
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
      width: 30px;
      height: 30px;
    }
  }
</style>
