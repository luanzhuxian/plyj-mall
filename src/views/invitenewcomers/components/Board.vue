<template>
  <div class="invite-newcomers-board">
    <div class="who" v-if="inviteFrom !== null">
      <img class="avatar" :src="inviteFrom.avatar">
      <span class="name">{{ inviteFrom.name }}</span>
      <span class="label">邀您助力领豪礼</span>
    </div>
    <div class="main-board">
      <!-- 倒计时状态 -->
      <div class="countdown-panel" v-if="this.countdown > 0">
        <span class="status-label">{{ countdownStatus[status] }}</span>
        <number :value="+timeSplit[0]" />
        <number :value="+timeSplit[1]" />
        <span class="clock-split">天</span>
        <number :value="+timeSplit[2]" />
        <number :value="+timeSplit[3]" />
        <span class="clock-split">:</span>
        <number :value="+timeSplit[4]" />
        <number :value="+timeSplit[5]" />
        <span class="clock-split">:</span>
        <number :value="+timeSplit[6]" />
        <number :value="+timeSplit[7]" />
      </div>
      <div class="countdown-panel" v-else>
        <span class="status-stop">活动时间已截止</span>
      </div>
      <!-- 邀请文案 -->
      <div class="activity-invite-title" v-html="inviteTitle">
        <!-- 邀请好友，赢<span class="gift">豪礼</span>大奖 -->
      </div>
      <div class="activity-invite-label">
        {{ inviteDescription }}
      </div>
      <div class="activity-invite-button" @click="emitOp()">
        {{ inviteButtonText }}
      </div>
    </div>
    <div class="invite-users" v-if="friends.length > 0">
      <span class="label">助力好友</span>
      <!-- <img class="avatar" src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1369684156,4277819085&fm=26&gp=0.jpg"> -->
      <span class="user-avatar" v-for="(f, $idx) in friends" :key="$idx">
        <img class="avatar" :src="f.avatar">
        <span class="name">{{ f.nickName }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import Number from './Number'
import moment from 'moment'

const DAY = 24 * 60 * 60
const HOUR = 3600
const MIN = 60

function fmtCountDown (count) {
  let sec = Math.round(count / 1000)
  let days = Math.floor(sec / DAY)
  let hours = Math.floor((sec - DAY * days) / HOUR)
  let min = Math.floor((sec - DAY * days - hours * HOUR) / MIN)
  let ss = sec % 60

  let fmt = (n) => n > 9 ? '' + n : '0' + n
  return `${fmt(days)}${fmt(hours)}${fmt(min)}${fmt(ss)}`
}

const STATUS = {
  READY: 0,
  START: 1,
  END: 2
}

export default {
  name: 'InviteNewcomersBoard',
  components: {
    Number
  },
  props: {
    endTime: {
      type: String,
      default () {
        return '2020-01-01 00:00:00'
      }
    },
    startTime: {
      type: String,
      default () {
        return moment().format()
      }
    },
    inviteFrom: {
      type: Object,
      default: () => {
        // return {
        //   avatar: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1369684156,4277819085&fm=26&gp=0.jpg',
        //   name: '王小二'
        // }
        return null
      }
    },
    inviteTitle: {
      type: String,
      default: ''
    },
    inviteDescription: {
      type: String,
      default: ''
    },
    inviteButtonText: {
      type: String,
      default: ''
    },
    friends: {
      type: Array,
      default () {
        // [{avatar: String}]
        return []
      }
    }
  },
  data () {
    return {
      STATUS,
      countdown: (DAY + MIN + 59) * 1000,
      countdownTimer: null,
      countdownStatus: ['距离开始', '距离结束', '距离结束']
    }
  },

  computed: {
    timeSplit () {
      return fmtCountDown(this.countdown).split('')
    },

    status () {
      let now = moment()
      if (now.isBefore(moment(this.startTime))) {
        return STATUS.READY
      }
      if (moment(this.endTime).isBefore(now)) {
        return STATUS.END
      }

      return STATUS.START
    }
  },

  watch: {
    startTime () {
      this.startCountdown()
    }
  },

  created () {
    this.startCountdown()
  },

  beforeDestroy () {
    this.resetTimer()
  },

  methods: {
    emitOp () {
      this.$emit('notify')
    },

    startCountdown () {
      this.calcCountDown()

      if (this.countdown < 0) {
        this.countdown = 0
      }
      this.resetTimer()
      this.countdownTimer = setInterval(() => {
        if (this.countdown - 1000 < 0) {
          this.countdown = 0
          clearInterval(this.countdownTimer)
          return
        }
        this.countdown -= 1000
      }, 1000)
    },

    calcCountDown () {
      let endTime = new Date()
      let now = new Date()
      if (this.status === STATUS.READY) {
        endTime = moment(this.startTime)._d
      } else if (this.status === STATUS.START) {
        endTime = moment(this.endTime)._d
      } else if (this.status === STATUS.END) {
        this.countdown = 0
        return
      }

      this.countdown = endTime.getTime() - now.getTime()
    },

    resetTimer () {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
      }
      this.countdownTimer = null
    }
  }
}
</script>

<style lang="scss" scoped>
.invite-newcomers-board {
  width: 702px;
  border-radius:20px;
  box-shadow:0px 6px 20px rgba(135, 0, 0, 0.16);
  overflow: hidden;

  .who {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 96px;
    background-color: white;

    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-left: 24px;
      margin-right: 16px;
    }

    .name {
      font-size: 24px;
      font-weight: 600;
      margin-right: 14px;
    }

    .label {
      font-size: 24px;
      font-weight: 400;
      color: #666;
    }
  }

  .main-board {
    width: 702px;
    height: 542px;
    padding-top: 32px;
    background-color: #fa4d2f;

    .countdown-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      width: 654px;
      height: 126px;
      background-image: url('../../../assets/images/invitenewcomers/countdown-panel@2x.png');
      background-size: 100%;

      .clock-split {
        margin-left: 8px;
        margin-right: 8px;
        color: #6b78d7;
        font-size: 34px;
      }

      .status-label {
        display: inline-block;
        margin-right: 16px;
        width: 68px;
        height: 82px;
        line-height: 38px;
        color: #a56113;
        font-size: 34px;
        font-family: HYLiLiangHeiJ;
      }

      .status-stop {
        display: inline-block;
        color: #a56113;
        font-size: 60px;
        font-weight: 400;
        font-family: HYLiLiangHeiJ;
      }
    }
  }

  .activity-invite-title {
    margin-top: 48px;
    margin-bottom: 24px;
    color: white;
    text-align: center;
    font-size: 56px;
    font-family: HYLingXinJ;
    .gift {
      color: #f6f4b4;
    }
  }

  .activity-invite-label {
    margin-bottom: 64px;
    color: white;
    font-size: 36px;
    text-align: center;
  }

  .activity-invite-button {
    width: 452px;
    height: 110px;
    margin: 0 auto;
    line-height: 110px;
    background:rgba(254,205,76,1);
    border:2px solid rgba(255,224,157,1);
    opacity:1;
    border-radius:150px;
    color: #a56113;
    font-size: 36px;
    text-align: center;
  }

  .invite-users {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: white;
    height: 108px;

    .label {
      display: inline-block;
      width: 68px;
      height: 76px;
      margin-left: 24px;
      margin-right: 30px;
      color: #fe7700;
      font-weight: 400;
      font-size: 30px;
    }

    .user-avatar {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 24px;

      .avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        margin-right: 10px;
      }

      .name {
        display: inline-block;
        width: 97px;
        font-size: 24px;
        font-weight: 400;
        color: #666;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
</style>
