<template>
  <div class="invitenewcomers">
    <div class="center">
      <board
        :start-time="startTime"
        :end-time="endTime"
        :friends="helpers"
        :invite-title="inviteTitle"
        :invite-description="inviteDescription"
        :invite-button-text="inviteButtonText"
        :is-stoped="isActivityStoped"
        @notify="onNotify"
      />
    </div>
    <div class="center" v-if="isActivityStarted && showList.length !== 0">
      <show-orders
        :total-show="totalClaimers"
        :users="showList"
      />
    </div>
    <you-like :is-my="true" />
    <div class="rule-nav" @click="isShowRule = true">
      活动规则
    </div>
    <pl-popup
      :show="isShowRule"
      title="活动细则"
      @close="isShowRule = false"
    >
      <div class="rule-content">
        <h3>1.活动时间</h3>
        <p>{{ startTime }} 至 {{ endTime }}</p>
        <h3>2.活动对象</h3>
        <p>所有会员</p>
        <h3>3.活动说明</h3>
        <p v-html="activityBrief" />
      </div>
    </pl-popup>
    <got-gift
      v-if="isShowGotGift"
      @close="getMore()"
      @more="getMore()"
      :type="giftInfo.type"
      :coupon-info="giftInfo.couponInfo"
      :gift-info="giftInfo.giftInfo"
    />
    <share-layer v-if="isShowShareLayer" @close="isShowShareLayer = false" />
  </div>
</template>

<script>
import moment from 'moment'
import Board from './components/Board'
import ShowOrders from './components/ShowOrders'
import GotGift from './components/GotGift'
import ShareLayer from './components/ShareLayer'
import youLike from './../home/components/YouLike.vue'
import share from '../../assets/js/wechat/wechat-share'
import { mapGetters } from 'vuex'
import { getActivityInfo, getHelpers, canClaimGift, claimGiftOrCoupon, getClaimGiftList, getActivityStatisiticData, inviterStatisitic } from '../../apis/invitenewcomers'

export default {
  name: 'InviteNewcomers',
  components: {
    Board,
    ShowOrders,
    youLike,
    GotGift,
    ShareLayer
  },
  data () {
    return {
      isShowRule: false,
      isShowGotGift: false,
      isShowShareLayer: false,

      inviteTitle: '邀请好友，赢<span style="font-family: HYLingXinJ; color: #f6f4b4;">豪礼</span>大奖',

      activityId: 0,

      giftInfo: {
        type: 'coupon'
        // coupon info
        // gift info
      },

      activityInfo: { status: 0 },

      canClaimGift: false,

      helpers: [],
      totalHelpers: 0,
      // 领取人列表
      showList: [],
      // 总领取数
      totalClaimers: 0
    }
  },

  computed: {
    ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
    isNewUser () {
      return this.userId === ''
    },

    inviteDescription () {
      let invitedPeopleNumber = this.activityInfo.invitedPeopleNumber
      if (this.canOpenGiftPackage) {
        return `已经成功邀请${invitedPeopleNumber}个好友助力, 立即开豪礼`
      }

      return `还差${invitedPeopleNumber - this.totalHelpers % invitedPeopleNumber}个好友助力，即可开豪礼`
    },

    canOpenGiftPackage () {
      return this.totalHelpers > 0 && this.totalHelpers % this.activityInfo.invitedPeopleNumber === 0
    },

    inviteButtonText () {
      if (!this.isActivityStarted) {
        return '活动暂未开始，敬请期待'
      }
      if (this.isActivityEnd || this.isActivityStoped) {
        return '参与更多精彩活动'
      }
      if (this.canOpenGiftPackage) {
        return '开豪礼'
      }
      return '邀请好友'
    },

    isActivityStarted () {
      let startTime = moment(this.activityInfo.activityStartTime)
      return moment().isSameOrAfter(startTime)
    },
    isActivityEnd () {
      let endTime = moment(this.activityInfo.activityEndTime)
      return endTime.isBefore(moment())
    },
    isActivityStoped () {
      return this.activityInfo.status === 0
    },
    startTime () {
      return moment(this.activityInfo.activityStartTime).format('YYYY-MM-DD HH:mm:ss')
    },
    endTime () {
      return moment(this.activityInfo.activityEndTime).format('YYYY-MM-DD HH:mm:ss')
    },
    activityBrief () {
      return (this.activityInfo.activityBrief || '').replace(/\n/g, '<br>')
    }
  },

  created () {
    this.activityId = this.$route.params.activityId
  },

  async activated () {
    await this.init()
    this.share()
  },

  methods: {
    // 初始化分享数据
    share () {
      share({
        appId: this.appId,
        title: '请好友一起翻礼品',
        desc: '快来帮我助力一起领取大礼哦。',
        link: `${window.location.protocol}//${window.location.host}${window.location.pathname}/help/${this.userId}`,
        imgUrl: this.logoUrl,
        success: () => {
          inviterStatisitic(this.activityId)
        }
      })
    },

    async init () {
      let requests = []

      await this.getActivityInfo()
      if (this.isActivityStarted) {
        requests.push((() => this.getMyFriends())())
        requests.push((() => this.getOrdersShow())())
        // requests.push((() => this.testClaimGift())())
      }

      if (requests.length) {
        await Promise.all(requests)
      }
    },

    async getMore () {
      await this.init()
      this.isShowGotGift = false
    },

    // 显示分享提示
    doShare () {
      this.isShowShareLayer = true
    },

    // 活动结束
    showGameOver () {
      this.$alert({
        message: '活动已经结束啦'
      })
    },

    async onNotify () {
      if (!this.isActivityStarted) {
        this.$alert({
          message: '活动还没有开始哦'
        })
        return
      }
      if (this.isActivityEnd) {
        this.showGameOver()
        return
      }

      if (this.isNewUser) {
        try {
          await this.$confirm({
            viceMessage: '快来注册为会员，邀请好友进行助力返红包',
            message: '您还没注册会员',
            confirmText: '注册会员',
            cancelText: '取消'
          })
          this.bindMobile()
        } catch (e) {
          console.log(e)
        }

        return
      }

      if (this.canOpenGiftPackage) {
        await this.getGift()
        this.isShowGotGift = true
      } else {
        this.doShare()
      }
    },

    bindMobile () {
      sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
        name: this.$route.name,
        params: this.$route.params,
        query: this.$route.query
      }))
      this.$router.push({ name: 'BindMobile' })
    },

    // 获取活动的信息
    async getActivityInfo () {
      let { status, result } = await getActivityInfo(this.activityId)
      if (status !== 200) {
        // TODO
        return
      }

      this.activityInfo = result
    },

    // 获取助力人列表
    async getMyFriends () {
      if (!this.userId) {
        return
      }

      let { status, result } = await getHelpers(this.activityId, this.userId)
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
    },

    // 获取晒单数据
    async getOrdersShow () {
      let { result } = await getClaimGiftList(this.activityId)
      this.showList = (result || []).slice(0, 3).map((item) => {
        return {
          name: item.userName,
          avatar: item.headImgUrl,
          inviteNum: item.helperNum,
          giftInfo: item.name
        }
      })

      let { result: claimerInfo } = await getActivityStatisiticData(this.activityId)
      this.totalClaimers = claimerInfo.claimerNum
    },

    async getGift () {
      // TODO: 用户是否需要注册或登录
      let { result: { mallCouponEntity, mallInvitingEventsGiftEntity } } = await claimGiftOrCoupon(this.activityId, this.userId)
      let type = mallCouponEntity ? 'coupon' : 'gift'
      this.giftInfo.type = type
      this.giftInfo.giftInfo = mallInvitingEventsGiftEntity || {}
      this.giftInfo.couponInfo = mallCouponEntity || {}
    },

    async testClaimGift () {
      let { result } = await canClaimGift(this.activityId)
      this.canClaimGift = result
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./fonts/hyfonts-subset.css";
.invitenewcomers {
  padding-top: 32px;

  .center {
    width: 702px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 32px;
  }

  .rule-nav {
    position: fixed;
    top: 368px;
    right: 0;
    width: 120px;
    height: 50px;
    line-height: 50px;
    background: linear-gradient(90deg,rgba(255,229,115,1) 0%,rgba(255,188,45,1) 100%);
    border-radius: 48px 0px 0px 48px;
    font-size: 24px;
    font-weight: 400;
    text-align: center;
  }

  .rule-content {
    padding: 0 40px;
    h3 {
      font-size: 32px;
    }

    p {
      margin-bottom: 60px;
      font-size: 28px;
    }
  }
}
</style>
