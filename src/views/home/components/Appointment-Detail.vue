<template>
  <div :class="$style.appointment">
    <div :class="$style.appointmentGift" @click="showPop = true">
      <pl-svg :class="$style.giftIcon" name="gift" />
      <div :class="$style.right">
        <pl-svg name="yuyue2" />
      </div>
      <div :class="$style.left">
        <p>免费试听, 2小时外教课</p>
        <p>到店礼精美礼品+外教口语体</p>
        <div :class="$style.now">
          <span>立即预约</span>
          <pl-svg name="right" color="#7E6E4D" />
        </div>
      </div>
    </div>

    <div :class="$style.content">
      <div :class="$style.top">
        <div :class="$style.left">
          <div :class="$style.title">
            吉地堡少儿英语
          </div>
          <div :class="$style.desc">
            吉的堡教育，致力于2-12岁幼儿园及英
            语培训学校。 结合全球最尖端的教育
          </div>
        </div>
        <div :class="$style.center">
          <img :src="logoUrl" alt="">
        </div>
        <div :class="$style.right">
          <pl-svg name="right" color="#ccc" />
        </div>
      </div>
      <div :class="$style.bottom">
        <div :class="$style.title">
          教育特色 :
        </div>
        <ul :class="$style.tags">
          <li>校区展示</li>
          <li>学员风采</li>
          <li>校区介绍</li>
          <li>视频宣传</li>
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
          <li>免费试听, 2小时外教课</li>
          <li>到店礼精美礼品+外教口语体</li>
          <li>到店礼精美礼品+外教口语体</li>
          <li>到店礼精美礼品+外教口语体</li>
        </ul>
      </div>
      <form :class="$style.popForm">
        <div class="fz-26 gray-3">预约后您的私人顾问将会电话联系您</div>
        <input value="123" type="text" placeholder="请输入预约手机">
        <div :class="$style.tip">
          <pl-svg name="safe" />
          <span>无强行推销</span>
          <pl-svg name="safe" />
          <span>不泄露用户手机号码</span>
        </div>
        <pl-button size="large" type="warning" @click.prevent="confirm">
          确认预约
        </pl-button>
      </form>
    </pl-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppointmentGift',
  data () {
    return {
      showPop: false
    }
  },
  computed: {
    ...mapGetters(['logoUrl'])
  },
  methods: {
    confirm () {
      this.$toast({
        type: 'success',
        message: '预约成功',
        viceMessage: '专业顾问会尽快联系您的~',
        duratio: 300000
      })
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
        > p {
          width: 380px;
          @include elps();
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
    padding: 0 24px 20px;
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
  }
</style>
