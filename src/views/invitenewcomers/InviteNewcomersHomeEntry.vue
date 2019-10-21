<template>
  <div class="invite-newcomers-home-entry">
    <overlay v-if="showSelf">
      <div class="center-box">
        <div class="box">
          <div class="title">
            助力成功，快去翻<span class="title-gift">礼品</span>
          </div>
          <div class="desc">
            已经成功邀请<span class="number">{{ totalHelpers }}</span>个好友助力，立即开豪礼
          </div>
          <img src="../../assets/images/invitenewcomers/box@2x.png">
          <div>
            <span class="btn-open" @click="openGift">开豪礼<pl-icon type="icon" name="icon-arrow-right" size="34" /></span>
          </div>
        </div>
        <div style="margin-top: 64px; text-align: center;">
          <span class="btn-close" @click="close">
            <pl-icon type="icon" name="icon-close" color="white" />
          </span>
        </div>
      </div>
    </overlay>
  </div>
</template>

<script>
import moment from 'moment'
import Overlay from './components/Overlay'
import { mapGetters } from 'vuex'
import { getHelpers, getCurrentActivity } from '../../apis/invitenewcomers'

export default {
  name: 'InviteNewcomersHomeEntry',
  components: {
    Overlay
  },

  data () {
    return {
      showSelf: false,
      isShowGotGift: false,
      isShowBoard: false,

      inviteTitle: '邀请好友，赢<span style="style: #f6f4b4">豪礼</span>大奖',

      helpers: [],
      totalHelpers: 0,

      activityInfo: {},

      giftInfo: {
        type: 'coupon'
        // coupon info
        // gift info
      }
    }
  },

  computed: {
    ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
    isNewUser () {
      return this.userId === ''
    },
    isActivityStarted () {
      let startTime = moment(this.activityInfo.activityStartTime)
      return moment().isSameOrAfter(startTime)
    },
    isActivityEnd () {
      let endTime = moment(this.activityInfo.activityEndTime)
      return endTime.isBefore(moment())
    }
  },

  async created () {
    await this.getCurrentActivity()
    await this.getMyFriends()
  },

  methods: {
    async getCurrentActivity () {
      let { result } = await getCurrentActivity()
      this.activityInfo = result
    },
    // 获取助力人列表
    async getMyFriends () {
      if (!this.userId) {
        return
      }
      let { status, result } = await getHelpers(this.activityInfo.id, this.userId)
      if (status !== 200) {
        return
      }
      this.helpers = result.map((h) => {
        return {
          avatar: h.headImgUrl,
          nickName: h.nickName
        }
      })

      this.totalHelpers = result.length
      this.showSelf = this.activityInfo.invitedPeopleNumber === this.totalHelpers && (!this.isActivityEnd)
    },

    close () {
      this.showSelf = false
    },

    openGift () {
      this.$router.push({ name: 'InviteNewcomers', params: { activityId: this.activityInfo.id } })
    }
  }
}
</script>

<style lang="scss" scoped>
.invite-newcomers-home-entry {
  .center-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .box {
    width: 702px;
    height: 678px;
    background: rgba(250,77,47,1);
    border-radius: 20px;
    text-align: center;

    .title {
      margin-bottom: 24px;
      padding-top: 40px;
      height: 56px;;
      font-size: 56px;
      text-align: center;
      color: white;

      .title-gift {
        color: #f6f4b4;
      }
    }

    .desc {
      margin-bottom: 80px;
      font-size: 38px;
      color: white;
      text-align: center;
      .number {
        color: #f6f4b4;
      }
    }

    .btn-open {
      position: relative;
      top: -26px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      width: 390px;
      height: 110px;
      line-height: 110px;
      border: 2px solid rgba(255,224,157,1);
      background: linear-gradient(180deg,rgba(255,234,180,1) 0%,rgba(254,205,76,1) 100%);
      box-shadow: 0px 6px 20px rgba(117,1,1,0.16);
      border-radius:150px;
      font-size: 44px;
      color: #a56113;
    }
  }

  .btn-close {
    display: inline-block;
    width: 48px;
    height: 48px;
    line-height: 48px;
    border: 1px solid white;
    border-radius: 50%;
  }
}
</style>
