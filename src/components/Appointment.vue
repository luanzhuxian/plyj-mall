<template>
  <div
    :class="$style.appointment + ' radius-20'"
    @click="handleClick"
  >
    <!--预约礼-->
    <div>
      <pl-svg name="yuyue" />
    </div>
    <div>免费试听：2小时外教课</div>
    <div>领取 <pl-svg name="right" /></div>

    <transition name="fade">
      <div
        :class="$style.makeAnAppointment"
        v-show="show"
        @click.stop.self="show = false"
      >
        <div :class="$style.content">
          <h3>预约试听</h3>
          <p>请留下您的联系方式，方便商家稍后联系您</p>
          <p :class="$style.tel + ' radius-20'">
            <input
              v-model="phone"
              type="tel"
              maxlength="11"
            >
          </p>
          <p><pl-svg name="safe" />号码仅此商家可见</p>
          <p>
            <pl-button
              size="large"
              type="warning"
              :text="success ? '预约成功' : '立即预约'"
              :prefix-icon="success ? 'success' : ''"
              :loading="loading"
              @click="now"
            />
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { isPhone } from '../assets/js/validate'
export default {
  name: 'Appointment',
  data () {
    return {
      show: false,
      phone: '',
      success: false,
      loading: false
    }
  },
  methods: {
    handleClick () {
      this.show = true
    },
    now () {
      if (!this.phone) {
        return this.$toast('请输入手机号')
      }
      if (!isPhone(this.phone)) {
        return this.$toast('请输入正确的手机号')
      }
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.success = true
        setTimeout(() => {
          this.success = this.show = false
          this.phone = ''
        }, 2000)
      }, 2000)
    }
  }
}
</script>

<style module lang="scss">
  .appointment {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    padding: 0 28px;
    margin-top: 106px;
    margin-bottom: 60px;
    background-color: #fff;
    > div {
      &:nth-of-type(1) {
        display: inline-flex;
        align-items: center;
        width: 114px;
        padding-right: 24px;
        background-clip: content-box;
        white-space: nowrap;
        svg {
          width: 90px;
        }
      }
      &:nth-of-type(2) {
        flex: 1;
        padding-left: 24px;
        font-size: 28px;
        color: #666;
        border-left: 1px solid #e7e7e7;
      }
      &:nth-of-type(3) {
        display: inline-flex;
        align-items: center;
        font-size: 20px;
        color: #F24724;
        svg {
          width: 24px;
          fill: #bbb;
          margin-left: 10px;
        }
      }
    }
  }
  .make-an-appointment {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
    z-index: 8889;
  }
  .content {
    position: absolute;
    left: 0;
    bottom: 0;
    width: calc(100% - 80px);
    padding: 0 40px 20px;
    line-height: 80px;
    background-color: #fff;
    h3 {
      position: relative;
      font-size: 30px;
      text-align: center;
      &:after {
        @include border-half-bottom(#e7e7e7);
      }
    }
    p {
      font-size: 26px;
      color: #999;
      &:nth-last-of-type(1) {
        font-size: 24px;
        color: #333;
      }
      svg {
        width: 25px;
        margin-right: 12px;
        vertical-align: -4px;
      }
    }
  }
  .tel {
    padding: 0 20px;
    background-color: #f4f5f9;
    input {
      background-color: transparent;
      width: 100%;
      font-size: 32px;
    }
  }
</style>
