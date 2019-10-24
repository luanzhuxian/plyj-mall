<template>
  <div class="invitenewcomers">
    <div class="center">
      <board
        :start-time="startTime"
        :end-time="endTime"
        :invite-from="inviteUserInfo"
        invite-title="小手一点帮我助力"
        invite-description="你也可以参与活动拿豪礼大奖哦！"
        :invite-button-text="inviteButtonText"
        :is-stoped="isActivityStoped"
        @countdownstop="init"
        @notify="onNotify"
      />
    </div>
    <div class="center" v-if="isActivityStarted && showList.length !== 0">
      <show-orders
        :total-show="totalClaimers"
        :users="showList"
      />
    </div>
    <div class="center" />
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
    <help-success
      v-if="isShowHelperSuccess"
      @close="gotoInviteNew"
    />
  </div>
</template>

<script>
import moment from 'moment'
import Board from './components/Board'
import ShowOrders from './components/ShowOrders'
import HelpSuccess from './components/HelpSuccess'
import youLike from './../home/components/YouLike.vue'
import { mapGetters } from 'vuex'
import { getActivityInfo, helpFriend, getClaimGiftList, getUserInfo, getActivityStatisiticData, registerStatisitic } from '../../apis/invitenewcomers'
import { getCurrentActivity, claimCoupons } from '../../apis/newcomers'

export default {
  name: 'InviteNewcomers',
  components: {
    Board,
    ShowOrders,
    youLike,
    HelpSuccess
  },
  data () {
    return {
      isShowRule: false,
      isShowHelperSuccess: false,

      inviteUserId: 0,
      activityId: 0,

      inviteUserInfo: null,
      activityInfo: {},
      // 领取人列表
      showList: [],
      // 总领取数
      totalClaimers: 0
    }
  },

  computed: {
    ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
    isNewUser () {
      return !this.userId
    },
    isActivityStarted () {
      let startTime = moment(this.activityInfo.activityStartTime)
      return startTime.isSameOrAfter(new Date())
    },
    isActivityEnd () {
      let endTime = moment(this.activityInfo.activityEndTime)
      return endTime.isBefore(new Date())
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
    inviteButtonText () {
      if (this.isActivityEnd || this.isActivityStoped) {
        return '参与更多精彩活动'
      }
      return '助好友，得豪礼'
    },
    activityBrief () {
      return (this.activityInfo.activityBrief || '').replace(/\n/g, '<br>')
    }
  },

  created () {
    this.inviteUserId = this.$route.params.userId
    this.activityId = this.$route.params.activityId
  },

  async activated () {
    await this.init()
  },

  methods: {
    // 初始化分享数据
    // share () {
    //   share({
    //     appId: this.appId,
    //     title: '请好友一起翻礼品',
    //     desc: '快来帮我助力一起领取大礼哦。',
    //     link: window.location.href,
    //     // TODO: image url
    //     imgUrl: ''
    //   })
    // },
    async init () {
      let requests = []

      requests.push((() => this.getInviteUserInfo())())

      await this.getActivityInfo()
      if (this.isActivityStarted) {
        requests.push((() => this.getOrdersShow())())
      }

      // this.share()
      if (requests.length) {
        await Promise.all(requests)
      }

      // 新用户注册返回后，继续后续的助力操作
      this.helpMyFriend(true)
    },

    gotoInviteNew () {
      this.$router.push({ name: 'InviteNewcomers', params: { activityId: this.activityId } })
    },

    async onNotify () {
      if (this.isActivityStarted) {
        this.showReady()
      }
      if (this.isActivityEnd) {
        this.showGameOver()
      }

      this.helpMyFriend(false)
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

    // 获取邀请助力用户信息
    async getInviteUserInfo () {
      let { result } = await getUserInfo(this.inviteUserId)
      this.inviteUserInfo = {
        name: result.nickName,
        avatar: result.headImgUrl
      }
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

    saveHelpState () {
      sessionStorage.setItem('INVITE_NEW_USER', 'true')
    },

    restoreHelpState () {
      let state = sessionStorage.getItem('INVITE_NEW_USER')

      sessionStorage.removeItem('INVITE_NEW_USER')
      return state
    },

    // 绑定手机
    bindMobile () {
      sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
        name: this.$route.name,
        params: this.$route.params,
        query: this.$route.query
      }))
      this.$router.push({ name: 'BindMobile' })
    },
    // 帮助
    async helpMyFriend (isRestore) {
      let helpState = this.restoreHelpState()
      // 开始助力
      if (helpState === 'true') {
        // 如果之前是助力状态，直接进行助力
        // TODO: 错误处理
        await helpFriend(this.activityId, this.inviteUserId)
        await registerStatisitic(this.activityId)
        await this.doClaimAll()
        this.isShowHelperSuccess = true
        return
      }

      if (isRestore) {
        return
      }

      if (this.isNewUser) {
        // 新用户，先注册（绑定手机）
        this.saveHelpState()
        // 跳转到绑定手机页面，手机绑定完成之后返回继续操作
        try {
          await this.$confirm({
            viceMessage: '注册会员，助力好友',
            message: '快来注册为会员，帮助好友进行助力返红包',
            confirmText: '注册会员',
            cancelText: '取消'
          })

          this.bindMobile()
        } catch (e) {
          console.log('canceled', e.message)
        }
      } else {
        // 不是新用户
        await this.$alert({
          message: '感谢你帮我助力哦~ 邀你一起参与翻豪礼',
          viceMessage: '您可以直接发起活动，邀请好友助力帮你翻豪礼',
          confirmText: '我也想翻豪礼'
        })

        // 跳转到邀新有礼
        this.gotoInviteNew()
      }
    },
    async doClaimAll () {
      let { result: newComersActivity } = await getCurrentActivity()
      if (!newComersActivity) {
        return
      }
      // 活动已经终止或结束，不能领取
      if (moment(newComersActivity.activityEndTime).isBefore(moment()) || newComersActivity.status === 0) {
        return
      }
      let { status } = await claimCoupons(newComersActivity.activityId, (newComersActivity.couponModels || []).map(m => m.id))
      if (status !== 200) {
        // TODO: add code here
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
