<template>
  <div :class="$style.appointment">
    <div :class="$style.appointmentGift">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AppointmentGift',
  computed: {
    ...mapGetters(['logoUrl'])
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
      .gift-icon {
        position: absolute;
        top: 0;
        left: 0;
        width: 80px;
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
</style>
