<template>
    <div :class="$style.inviteNewcomersBoard">
        <div :class="$style.top">
            <div :class="$style.timer">
                <template v-if="status !== 0">
                    <div :class="$style.timerTip">
                        <pl-svg v-if="status === 2" name="icon-julijieshu" width="68" height="82" />
                        <pl-svg v-if="status === 1" name="icon-julikaishi" width="68" height="82" />
                    </div>
                    <div :class="$style.timerContent">
                        <div>
                            <span v-for="(dd, i) of d" :key="i" v-text="dd" />
                        </div>
                        <pl-svg style="margin: 0 1.333vw" name="icon-tian" width="34" height="34" />
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
                    <!--小手一点帮我助力-->
                    <pl-svg name="icon-invite-users" :width="560" height="70" />
                </div>
                <div :class="$style.shortOf">
                    你也可以参与活动拿豪礼大奖哦！
                </div>
            </template>
            <template v-else>
                <div :class="$style.inviteFriends">
                    <pl-svg name="icon-invite-users" :width="560" height="70" />
                </div>
                <!--<div v-if="inviteDescription > 0" :class="$style.shortOf">
          还差<i v-text="inviteDescription" />个好友注册
        </div>-->
                <div v-if="hasShare" :class="$style.shortOf">
                    已成功注册<i v-text="totalHelpers" />个好友，立即开豪礼
                </div>
            </template>
            <button :disabled="loading" :class="$style.button" v-if="canOpenGiftPackage && !friendUserId" @click="openGift">开豪礼</button>
            <button :class="$style.button" v-else-if="status === 1">活动暂未开始,敬请期待</button>
            <button :disabled="loading" :class="$style.button" v-else-if="status === 2 && friendUserId && !hasHelped && !userId" @click="help">立即注册，得豪礼</button>
            <button :class="$style.button" v-else-if="status === 2 && !hasShare" @click="invite">参与活动</button>
            <button :class="$style.button" v-else-if="status === 2" @click="invite">立即开奖</button>
            <button :class="$style.button" v-else-if="status === 0">参与更多精彩活动</button>
        </div>
        <!-- 助力过的好友列表 -->
        <!--<HelperList :helpers="helpers" />-->
        <!-- 可获得的礼品列表 -->
        <Trophy
            :gifts="invitingEventsGiftEntities"
            :conpons="mallInvitingEventsCouponEntities"
        />
        <!-- 分享引导浮层 -->
        <ShareLayer v-show="showShare" @close="showShare = false" />
        <!-- 开豪礼弹框 -->
        <MessageBox
            :message="hasGift ? '满减券已自动存入您的现金卡包中您可在现金卡包中查看' : '很遗憾，礼物与您擦肩而过，再接再厉哦！'"
            confirm-text="继续开豪礼"
            :show.sync="showGotGift"
            @close="giftConfirm"
            @confirm="giftConfirm"
        >
            <div slot="title">
                <pl-svg v-if="hasGift" name="icon-gongxininhuode" fill="#fff" width="60" />
                <pl-svg v-else name="icon-ganxiecanyu" fill="#fff" width="60" />
            </div>
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
            title="领取成功"
            message="恭喜您获得新人优惠大礼包"
            confirm-text="我也来翻豪礼"
            :message-width="438"
            :show.sync="helpeSuccess"
            @confirm="IWantToGetAGiftToo"
        />

        <!-- 新人自动领取礼物成功 -->
        <transition name="fade">
            <div :class="$style.successHelp" v-show="showNewUserSuccess">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.0.0/invitenewcomers/%E5%8A%A9%E5%8A%9B%2B%E6%96%B0%E4%BA%BA.png" alt="">
                <button @click="IWantToGetAGiftToo">我也想翻豪礼</button>
            </div>
        </transition>
    </div>
</template>

<script>
import moment from 'moment'
import Countdown from '../../../../assets/js/Countdown'
import Trophy from './Trophy'
import ShareLayer from './ShareLayer.vue'

// import HelperList from './Helper-List.vue'
import MessageBox from './Message-Box.vue'
import {
    openGift,
    helpFriend,
    canClaimGift,
    getHelpers,
    registerStatisitic
} from '../../../../apis/invitenewcomers'
import {
    mapGetters
} from 'vuex'
export default {
    name: 'InviteNewcomersBoard',
    components: {
        Trophy,
        ShareLayer,

        // HelperList,
        MessageBox
    },
    data () {
        return {

            // 活动状态
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

            // 新人助力成功
            showNewUserSuccess: false,

            // 开始的实体礼品
            mallInvitingEventsGiftEntity: null,
            hasShare: false,
            loading: false,
            friendUserId: '',
            d: '00',
            h: '00',
            m: '00',
            s: '00',
            helpers: [],
            totalHelpers: 0,
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
        },
        shareUserId: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['userId', 'mallUrl']),

        // 还差多少个好友
        inviteDescription () {
            if (this.data) {
                const { invitedPeopleNumber } = this.data.invitingEventsEntity
                return invitedPeopleNumber - this.totalHelpers
            }
            return 0
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
        shareUserId: {
            async handler (val) {
            },
            immediate: true
        }
    },
    async activated () {
    // 朋友(分享者)的id
        this.friendUserId = this.shareUserId || sessionStorage.getItem('INVITE_NEW_USERS_SHAERID') || ''

        // 如果是新人，且有userId,（说明是刚注册的）,且有朋友的id（说明邀新成功)，调用registerStatisitic
        const isNewUser = this.isNewUser()
        if (isNewUser && this.userId && this.userId !== this.friendUserId) {
            try {
                sessionStorage.removeItem('IS_NEW_USER')
                await Promise.all([this.help(), registerStatisitic(this.activeId)])
                sessionStorage.removeItem('INVITE_NEW_USERS_SHAERID')
                this.helpeSuccess = true

                // this.showNewUserSuccess = true
            } catch (e) {
                throw e
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
            const {
                invitingEventsEntity,
                invitingEventsGiftEntities,
                mallInvitingEventsCouponEntities
            } = this.data
            this.invitingEventsGiftEntities = invitingEventsGiftEntities || null
            this.mallInvitingEventsCouponEntities = mallInvitingEventsCouponEntities || null
            const now = moment(this.currentSystemDate).valueOf()
            /* eslint-disable */
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
        this.timer = new Countdown(activityStartTime - now, this.setTime)
        this.timer.start()
      } else if (status === 2) {
        // 已开始
        this.timer = new Countdown(activityEndTime - now, this.setTime)
        this.timer.start()
      }
      this.status = status
      await this.getHelpers()
    },
    setTime (data) {
      if (!data) {
        location.reload()
        return
      }
      let { days, hours, minutes, seconds } = data
      this.d = String(days).padStart(2, '0')
      this.h = String(hours).padStart(2, '0')
      this.m = String(minutes).padStart(2, '0')
      this.s = String(seconds).padStart(2, '0')
    },
    // 查询是否可以领取豪礼
    async canClaimGift () {
      if (!this.userId || !this.activeId) return
      let { result } = await canClaimGift(this.activeId)
      this.canOpenGiftPackage = result
    },
    async getHelpers () {
      if (!this.userId) return
      try {
        let { result } = await getHelpers(this.activeId, this.userId)
        result = result || []
        this.totalHelpers = result.length
        this.helpers = result.slice(0, 6)
      } catch (e) {
        throw e
      }
    },
    // 邀请好友
    invite () {
      if (!this.userId) {
        this.checkUser('invite')
        return
      }
      this.hasShare = true
      this.$emit('open')
      // this.showShare = true
    },
    async openGift () {
      try {
        this.showGotGift = true
        this.loading = true
        let { result } = await openGift(this.activeId)
        let {
          mallCouponEntity,
          mallInvitingEventsGiftEntity
        } = result
        this.mallCouponEntity = mallCouponEntity || null
        this.mallInvitingEventsGiftEntity = mallInvitingEventsGiftEntity || null
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    async help () {
      if (!this.userId) {
        this.checkUser('help')
        return
      }
      try {
        this.loading = true
        await helpFriend(this.activeId, this.friendUserId)
        this.helpeSuccess = true
        this.hasHelped = true
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    },
    // 确定豪礼弹框
    giftConfirm () {
      this.mallCouponEntity = null
      this.mallInvitingEventsGiftEntity = null
      this.canClaimGift()
      this.$parent.init() // 礼物已打开事件，外部需要刷新数据
      this.getHelpers()
    },
    // 我也想反豪礼（重置到分享页面）
    async IWantToGetAGiftToo () {
      location.replace(`${this.mallUrl}/yx/${this.activeId}`)
    },
    // 检查是否是新用户
    isNewUser () {
      // 已经标记为新用户了
      let IS_NEW_USER = JSON.parse(sessionStorage.getItem('IS_NEW_USER'))
      if (IS_NEW_USER) {
        return true
      }
      // 还没标记，但确实是新用户
      if (IS_NEW_USER === null && !this.userId) {
        sessionStorage.setItem('IS_NEW_USER', 'true')
        return true
      }
      // 不是新人
      if (!IS_NEW_USER && this.shareUserId && this.userId !== this.shareUserId) {
        this.$alert({
          message: '<p>老用户无法参加活动~</p>',
          useDangersHtml: true,
          confirmText: '我也想翻豪礼'
        }).finally(() =>{
          sessionStorage.removeItem('INVITE_NEW_USERS_SHAERID')
          this.IWantToGetAGiftToo()
        })
      }
      return false
    },
    /**
     * 检查用户是否绑定手机
     * @param type {String} invite or help
     */
    checkUser (type) {
      let message = {
        invite: {
          message: '注册会员，赢豪礼大奖',
          viceMessage: '快来注册为会员'
        },
        help: {
          message: '注册会员，赢豪礼大奖',
          viceMessage: '快来注册为会员'
        }
      }
      this.$confirm({
        message: message[type].message,
        viceMessage: message[type].viceMessage,
        useDangersHtml: true,
        confirmText: '注册会员'
      })
        .then(() => {
          let {
            name,
            params
          } = this.$route
          sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
            name,
            params
          }))
          this.$router.push({
            name: 'BindMobile'
          })
        })
        .catch(() => {})
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
    &:disabled {
      filter: grayscale(100%);
    }
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
  .success-help {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .65);
    z-index: 2004;
    > img {
      width: 630px;
      margin-bottom: 128px;
    }
    > button {
      width: 260px;
      line-height: 60px;
      font-size: 30px;
      color: #fff;
      background-color: #ff6310;
      border-radius: 30px;
    }
  }
</style>
