<template>
  <div :class="$style.activity" v-if="hasJxEvent || hasInvitingEvent">
    <div :class="$style.wrapper">
      <router-link
        v-if="hasJxEvent"
        :class="{
          [$style.item]: true,
          [$style.small]: hasJxEvent && hasInvitingEvent,
          [$style.large]: hasJxEvent && !hasInvitingEvent
        }"
        tag="div"
        :to="{ name: 'RoadLearning' }"
      >
        <div :class="$style.itemLeft">
          <div :class="$style.main">
            见学之旅
          </div>
          <div :class="$style.sub">
            <span>
              惊喜大奖等你来拿
            </span>
            <span :class="$style.label" v-if="hasJxEvent && !hasInvitingEvent">
              点击进入
              <pl-svg name="icon-right" width="20" fill="#fff" />
            </span>
          </div>
        </div>
        <pl-svg v-if="hasJxEvent && hasInvitingEvent" name="icon-calendar" width="72" height="72" />
        <pl-svg v-if="hasJxEvent && !hasInvitingEvent" name="icon-calendar" width="100" height="100" />
      </router-link>
      <router-link
        v-if="hasInvitingEvent"
        :class="{
          [$style.item]: true,
          [$style.small]: hasJxEvent && hasInvitingEvent,
          [$style.large]: !hasJxEvent && hasInvitingEvent
        }"
        tag="div"
        :to="{ name: 'InviteNewcomers', params: { activityId: invitingEvent.id } }"
      >
        <div :class="$style.itemLeft">
          <div :class="$style.main">
            赢取豪礼
          </div>
          <div :class="$style.sub">
            <span>
              多种优惠不打烊
            </span>
            <div :class="$style.label" v-if="!hasJxEvent && hasInvitingEvent">
              点击进入
              <pl-svg name="icon-right" width="20" fill="#fff" />
            </div>
          </div>
        </div>
        <pl-svg v-if="hasJxEvent && hasInvitingEvent" name="icon-present" width="72" height="72" />
        <pl-svg v-if="!hasJxEvent && hasInvitingEvent" name="icon-present" width="100" height="100" />
      </router-link>
    </div>
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
      return ~[1, 2].indexOf(this.invitingEvent.status)
    },
    hasJxEvent () {
      return ~[1, 2].indexOf(this.jxEvent.status)
    }
  }
}
</script>

<style module lang="scss">
  .activity {
    .wrapper {
      display: flex;
      padding: 28px 0;
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
    }
    .item {
      flex: 1;
      width: 0;
      display: flex;
      align-items: center;
      padding: 0 24px;
      &:nth-of-type(1) {
        border-right: 2px solid #EEEEEE;
      }
      &.large {
        border: none !important;
        .item-left {
          .main {
            font-size: 42px;
            line-height: 58px;
          }
          .sub {
            display: flex;
            align-items: center;
            font-size: 30px;
            line-height: 40px;
          }
          .label {
            display: inline-flex;
            align-items: center;
            margin-left: 18px;
            padding: 0 6px;
            height: 36px;
            line-height: 36px;
            background: #F2B036;
            text-align: center;
            font-size: 22px;
            color: #FFF;
            svg {
              margin-left: 8px;
              color: #FFF;
              vertical-align: -4px;
            }
          }
        }
      }
      &.small {
        .item-left {
          .main {
            font-size: 32px;
            line-height: 44px;
          }
          .sub {
            font-size: 24px;
            line-height: 34px;
          }
        }
      }
    }
    .item-left {
      flex: 1;
      width: 0;
      .main {
        font-weight: bold;
        color: #333333;
        margin-bottom: 4px;
      }
      .sub {
        color: #999999;
      }
    }
  }
</style>
