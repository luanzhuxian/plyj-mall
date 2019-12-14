<template>
  <div :class="$style.activity" v-if="hasJxEvent || hasInvitingEvent">
    <router-link
      v-if="hasJxEvent"
      :class="{
        [$style.item]: true,
        [$style.left]: true,
        [$style.small]: hasJxEvent && hasInvitingEvent,
        [$style.large]: hasJxEvent && !hasInvitingEvent
      }"
      tag="div"
      :to="{ name: 'RoadLearning' }"
    >
      <div :class="$style.imgWrapper">
        <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/9ef6c14b-4943-4295-8bdb-a3b16f76ca03.png" alt="">
      </div>
      <div :class="$style.info">
        <div :class="$style.sub">
          翻开记忆的味道
        </div>
        <pl-svg name="icon-lao-dai-xin" width="264" height="54" />
        <div :class="$style.btn">
          立即参加
        </div>
      </div>
    </router-link>

    <router-link
      v-if="hasInvitingEvent"
      :class="{
        [$style.item]: true,
        [$style.right]: true,
        [$style.small]: hasJxEvent && hasInvitingEvent,
        [$style.large]: !hasJxEvent && hasInvitingEvent
      }"
      tag="div"
      :to="{ name: 'InviteNewcomers', params: { activityId: invitingEvent.id } }"
    >
      <div :class="$style.imgWrapper">
        <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/2545d06c-3ae5-431b-926e-0feb36572222.png" alt="">
      </div>
      <div :class="$style.info">
        <div :class="$style.sub">
          快来领取
        </div>
        <pl-svg name="icon-lao-dai-xin" width="264" height="54" />
        <div :class="$style.btn">
          立即查看
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Activity',
  inject: ['parent'],
  data () {
    return {}
  },
  computed: {
    invitingEvent () {
      return (this.parent && this.parent.invitingEvent) || {}
    },
    jxEvent () {
      return (this.parent && this.parent.jxEvent) || {}
    },
    hasInvitingEvent () {
      return !~[1, 2].indexOf(this.invitingEvent.status)
    },
    hasJxEvent () {
      return !~[1, 2].indexOf(this.jxEvent.status)
    }
  }
}
</script>

<style module lang="scss">
  .activity {
    display: flex;
    justify-content: space-between;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .item {
    box-sizing: border-box;
    background: #FFFAE6;
    box-shadow: 0px 8px 12px rgba(121, 30, 5, 0.2);
    border-radius: 20px;
    // &.large {
    //   border: none !important;
    //   .item-left {
    //     .main {
    //       font-size: 42px;
    //       line-height: 58px;
    //     }
    //     .sub {
    //       display: flex;
    //       align-items: center;
    //       font-size: 30px;
    //       line-height: 40px;
    //     }
    //     .label {
    //       display: inline-flex;
    //       align-items: center;
    //       margin-left: 18px;
    //       padding: 0 6px;
    //       height: 36px;
    //       line-height: 36px;
    //       background: #F2B036;
    //       text-align: center;
    //       font-size: 22px;
    //       color: #FFF;
    //       svg {
    //         margin-left: 8px;
    //         color: #FFF;
    //         vertical-align: -4px;
    //       }
    //     }
    //   }
    // }
    &.small {
      &.left {
        .img-wrapper {
          width: 156px;
          height: 164px;
          overflow: hidden;
        }
      }
      &.right {
        .img-wrapper {
          width: 176px;
          height: 140px;
          overflow: hidden;
        }
      }
      &.item {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 24px 0px 40px;
        width: 332px;
        height: 422px;
      }
      .info {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .sub {
        margin-bottom: 8px;
        font-size: 24px;
        font-family: PingFang SC;
        color: #B48A64;
      }
      .btn {
        position: relative;
        margin-top: 28px;
        width: 232px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: linear-gradient(180deg, #FB873A 0%, #F64C1B 100%);
        border-radius: 16px;
        font-size: 28px;
        font-weight: bold;
        color: #FFFFFF;
        &:after {
          position: absolute;
          top: 50%;
          right: 30px;
          transform: translateY(-50%);
          content: '';
          width: 0;
          height: 0;
          border-width: 10px;
          border-color: transparent transparent transparent #FFFFFF;
          border-style: solid;
          border-radius: 4px;
        }
      }
    }
  }
</style>
