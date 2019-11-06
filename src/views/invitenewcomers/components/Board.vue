<template>
  <div :class="$style.inviteNewcomersBoard">
    <div :class="$style.top">
      <div :class="$style.timer">
        <template v-if="status !== 0">
          <div :class="$style.timerTip" v-text="countdownStatus[status]" />
          <div :class="$style.timerContent">
            <div>
              <span v-for="(dd, i) of d" :key="i" v-text="dd" />
            </div>
            <span>天</span>
            <div>
              <span v-for="(hh, i) of h" :key="i" v-text="hh" />
            </div>
            <span>:</span>
            <div>
              <span v-for="(mm, i) of m" :key="i" v-text="mm" />
            </div>
            <span>:</span>
            <div>
              <span v-for="(ss, i) of s" :key="i" v-text="ss" />
            </div>
          </div>
        </template>
        <div v-else :class="$style.timeEnd">
          活动时间已结束
        </div>
      </div>
      <template v-if="friendUserId">
        <div v-if="friendUserId" :class="$style.inviteFriends">
          小手一点帮我助力
        </div>
        <div :class="$style.shortOf">
          你也可以参与活动拿豪礼大奖哦！
        </div>
      </template>
      <template v-else>
        <div :class="$style.inviteFriends">
          邀请好友，赢豪礼大奖
        </div>
        <div v-if="inviteDescription > 0" :class="$style.shortOf">
          还差<i v-text="inviteDescription" />个好友助力，即可开豪礼
        </div>
        <div v-else :class="$style.shortOf">
          已成功邀请<i v-text="totalHelpers" />个好友助力，立即开豪礼
        </div>
      </template>
      <button :class="$style.button" v-if="canOpenGiftPackage" @click="openGift">开豪礼</button>
      <button :class="$style.button" v-else-if="status === 1">活动暂未开始,尽请期待</button>
      <button :class="$style.button" v-else-if="status === 2 && friendUserId && !hasHelped" @click="help">助好友，得好礼</button>
      <button :class="$style.button" v-else-if="status === 2 && friendUserId">助力成功</button>
      <button :class="$style.button" v-else-if="status === 2" @click="showShare = true">邀请好友</button>
      <button :class="$style.button" v-else-if="status === 0">参与更多精彩活动</button>
    </div>
    <!-- 助力过的好友列表 -->
    <HelperList :helpers="helpers" />
    <!-- 可获得的礼品列表 -->
    <Trophy
      :gifts="invitingEventsGiftEntities"
      :conpons="mallInvitingEventsCouponEntities"
    />
    <!-- 分享引导浮层 -->
    <ShareLayer v-show="showShare" @close="showShare = false" />
    <!-- 开豪礼弹框 -->
    <MessageBox
      :title="hasGift ? '恭喜您获得' : '领取失败'"
      :message="hasGift ? '满减券已自动存入您的现金卡包中您可在现金卡包中查看' : '很遗憾，礼物与您擦肩而过，再接再厉哦！'"
      confirm-text="继续开豪礼"
      :show.sync="showGotGift"
      @close="giftConfirm"
      @confirm="giftConfirm"
    >
      <!-- 优惠券 -->
      <div :class="$style.couponList" v-if="mallCouponEntity">
        <div :class="$style.couponItem">
          <div :class="$style.price" v-text="mallCouponEntity.amount" />
          <div :class="$style.couponPrice">
            <div :class="$style.desc">
              满{{ mallCouponEntity.useLimitAmount }}减{{ mallCouponEntity.amount }}
            </div>
            <div :class="$style.name" v-text="mallCouponEntity.couponName" />
          </div>
          <div :class="$style.couponType">
            满减券
          </div>
        </div>
      </div>
      <!-- 礼品 -->
      <div :class="$style.giftList" v-if="mallInvitingEventsGiftEntity">
        <div :class="$style.giftItem">
          <div :class="$style.left">
            <img :src="mallInvitingEventsGiftEntity.giftImage" alt="">
          </div>
          <div :class="$style.right">
            <div :class="$style.name" v-text="mallInvitingEventsGiftEntity.giftName" />
            <div :class="$style.desc">砍价活动礼品兑换券</div>
            <div :class="$style.date">有效期：{{ mallInvitingEventsGiftEntity.useStartTime | dateFormat('YYYY-MM-DD') }}-{{ mallInvitingEventsGiftEntity.useEndTime | dateFormat('YYYY-MM-DD') }}</div>
          </div>
        </div>
      </div>
    </MessageBox>

    <MessageBox
      title="助力成功"
      message="感谢你的好友助力，您也可发起邀新有礼活动领取豪礼大奖哦！"
      confirm-text="我也来翻豪礼"
      :message-width="438"
      :show.sync="helpeSuccess"
      @confirm="IWantToGetAGiftToo"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { countdown } from '../../../assets/js/util'
import Trophy from './Trophy'
import ShareLayer from './ShareLayer.vue'
import HelperList from './Helper-List.vue'
import MessageBox from './Message-Box.vue'
import {
  openGift,
  helpFriend,
  canClaimGift,
  getHelpers
} from '../../../apis/invitenewcomers'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'InviteNewcomersBoard',
  components: {
    Trophy,
    ShareLayer,
    HelperList,
    MessageBox
  },
  data () {
    return {
      status: '',
      showShare: false,
      // 是否已主力
      hasHelped: false,
      // 显示礼物弹框
      showGotGift: false,
      // 是否助力成功
      helpeSuccess: false,
      // 是否可开豪礼
      canOpenGiftPackage: false,
      // 开出的优惠券
      mallCouponEntity: null,
      // 开始的实体礼品
      mallInvitingEventsGiftEntity: null,
      d: '00',
      h: '00',
      m: '00',
      s: '00',
      helpers: [],
      totalHelpers: 0,
      countdownStatus: ['已经结束', '距离开始', '距离结束'],
      invitingEventsGiftEntities: [],
      mallInvitingEventsCouponEntities: []
    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return null
      }
    },
    activeId: {
      type: String,
      default: '',
      required: true
    }
  },
  computed: {
    ...mapGetters(['userId']),
    // 还差多少个好友
    inviteDescription () {
      if (this.data) {
        let invitedPeopleNumber = this.data.invitingEventsEntity.invitedPeopleNumber
        return invitedPeopleNumber - this.totalHelpers
      }
      return 0
    },
    friendUserId () {
      return this.$route.params.userId
    },
    // 是否领到了豪礼
    hasGift () {
      return this.mallInvitingEventsGiftEntity || this.mallCouponEntity
    }
  },
  watch: {
    data: {
      handler (val) {
        if (val) {
          this.init(val)
          this.canClaimGift()
        }
      },
      immediate: true
    },
    helpeSuccess (val) {
      if (!val) {

      }
    }
  },
  deactivated () {
    if (this.timer) {
      this.timer.stop()
    }
  },
  beforeDestroy () {
    if (this.timer) {
      this.timer.stop()
    }
  },
  methods: {
    async init () {
      if (this.timer) {
        this.timer.stop()
      }
      let {
        invitingEventsEntity,
        invitingEventsGiftEntities,
        mallInvitingEventsCouponEntities
      } = this.data
      this.invitingEventsGiftEntities = invitingEventsGiftEntities || null
      this.mallInvitingEventsCouponEntities = mallInvitingEventsCouponEntities || null
      let now = moment(this.currentSystemDate).valueOf()
      let {
        activityEndTime,
        activityStartTime,
        status
      } = invitingEventsEntity
      activityEndTime = moment(activityEndTime).valueOf()
      activityStartTime = moment(activityStartTime).valueOf()
      /* eslint-disable */
      if (status === 1) {
        // 未开始
        this.timer = new countdown(activityStartTime - now, this.setTime)
        this.timer.start()
      } else if (status === 2) {
        // 已开始
        this.timer = new countdown(activityEndTime - now, this.setTime)
        this.timer.start()
      }
      this.status = status
      await this.getHelpers()
    },
    setTime (data) {
      let { months, days, hours, minutes, seconds } = data
      this.d = String(months * moment().daysInMonth() + days).padStart(2, '0')
      this.h = String(hours).padStart(2, '0')
      this.m = String(minutes).padStart(2, '0')
      this.s = String(seconds).padStart(2, '0')
    },
    // 查询是否可以领取豪礼
    async canClaimGift () {
      let { result } = await canClaimGift(this.activeId)
      this.canOpenGiftPackage = result
    },
    async getHelpers () {
      try {
        let { result } = await getHelpers(this.activeId, this.userId)
        result = result || []
        this.totalHelpers = result.length
        this.helpers = result.slice(0, 6)
      } catch (e) {
        throw e
      }
    },
    async openGift () {
      try {
        this.showGotGift = true
        let { result } = await openGift(this.activeId)
        let {
          mallCouponEntity,
          mallInvitingEventsGiftEntity
        } = result
        this.mallCouponEntity = mallCouponEntity || null
        this.mallInvitingEventsGiftEntity = mallInvitingEventsGiftEntity || null
      } catch (e) {
        throw e
      }
    },
    async help () {
      try {
        await helpFriend(this.activeId, this.friendUserId)
        this.helpeSuccess = true
        this.hasHelped = true
      } catch (e) {
        throw e
      }
    },
    async getMore () {
      // await this.init()
      // this.isShowGotGift = false
    },
    // 确定豪礼弹框
    giftConfirm () {
      this.mallCouponEntity = null
      this.mallInvitingEventsGiftEntity = null
      this.canClaimGift()
      this.$emit('gift-is-opened') // 礼物已打开事件，外部需要刷新数据
    },
    // 我也想反豪礼
    IWantToGetAGiftToo () {
      this.$router.replace({ name: 'InviteNewcomers', params: { activityId: this.activeId } })
      this.$emit('i-want-to-get-gift-too') // 礼物已打开事件，外部需要刷新数据
    }
  }
}
</script>

<style lang="scss" module>
  .invite-newcomers-board {
    background-color: #FA4D2F;
    border-radius: 20px;
    overflow: hidden;
  }
  .top {
    padding: 32px 24px;
  }
  .timer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 126px;
    padding: 0 80px;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/countdown-panel%402x.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .timer-tip {
    width: 68px;
    line-height: 41px;
    color: #A56113;
    font-size: 34px;
    font-family: HYLiLiangHeiJ;
  }
  .time-end {
    flex: 1;
    text-align: center;
    line-height: 76px;
    color: #A56113;
    font-size: 60px;
    font-family: HYLiLiangHeiJ;
  }
  .timer-content {
    display: flex;
    align-items: center;
    > div {
      display: inline-flex;
      justify-content: space-between;
      width: 76px;
      > span {
        width: 36px;
        font-size: 36px;
        color: #fff;
        text-align: center;
        line-height: 60px;
        background: linear-gradient(180deg, rgba(44,42,40,1) 0%, rgba(97,93,93,1) 52%, rgba(49,48,49,1) 100%);
        border-radius: 4px;
      }
    }
    > span {
      display: inline-block;
      margin: 0 10px;
      font-size: 34px;
      line-height: 48px;
      color: #6B78D7;
      font-weight: bold;
      font-family: HYLiLiangHeiJ !important;
    }
  }
  .invite-friends {
    margin: 48px 0 26px 0;
    font-weight: bold;
    text-align: center;
    color: #fff;
    font-size: 44px;
  }
  .short-of {
    text-align: center;
    font-size: 36px;
    color: #fff;
    > i {
      color: #F6F4B4;
    }
  }
  .button {
    display: block;
    min-width: 425px;
    margin: 64px auto;
    line-height: 110px;
    padding: 0 42px;
    color: #A56113;
    font-weight: bold;
    font-size: 36px;
    letter-spacing: 3px;
    background-color: #FECD4C;
    border-radius: 55px;
  }
  .coupon-list {
    margin-bottom: 48px;
    > .coupon-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 474px;
      height: 166px;
      padding: 30px 24px;
      box-sizing: border-box;
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/coupon-bg.jpg") no-repeat center center;
      background-size: 474px 100%;
      > .price {
        display: inline-block;
        position: relative;
        font-size: 42px;
        color: #D8574B;
        font-weight: bold;
        line-height: 86px;
        &:after {
          position: absolute;
          bottom: 20px;
          right: -16px;
          display: inline-block;
          content: '元';
          font-size: 14px;
          width: 24px;
          height: 24px;
          line-height: 20px;
          color: #fff;
          border: 2px solid #fff;
          box-sizing: border-box;
          border-radius: 12px;
          background-color: #D8574B;
        }
      }
    }
    .coupon-price {
      flex: 1;
      margin-left: 34px;
      text-align: left;
      .desc {
        font-size: 24px;
        font-weight: bold;
      }
      .name {
        font-size: 16px;
      }
    }
    .coupon-type {
      width: 26px;
      padding: 0 18px;
      font-size: 26px;
      color: #fff;
      font-weight: bold;
    }
  }
  .gift-list {
    margin-bottom: 48px;
    .gift-item {
      display: flex;
      width: 474px;
      height: 96px;
      background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/gift-bg.png") no-repeat;
      background-size: 100% 100%;
      .left {
        padding: 6px 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
          width: 126px;
          height: 84px;
          object-fit: cover;
        }
      }
      .right {
        flex: 1;
        text-align: left;
        padding: 10px 0;
        margin-left: 18px;
        > .name {
          width: 288px;
          font-size: 18px;
          line-height: 26px;
          @include elps();
        }
        > .desc {
          width: 288px;
          font-size: 16px;
          line-height: 22px;
          color: #e1622d;
          @include elps();
        }
        > .date {
          margin-top: 8px;
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
</style>
