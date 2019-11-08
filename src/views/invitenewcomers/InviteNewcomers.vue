<template>
  <div :class="$style.invitenewcomers">
    <div v-if="!loading" :class="$style.center">
      <board
        :data="detail"
        :active-id="activityId"
        @gift-is-opened="init"
        @i-want-to-get-gift-too="init"
        :share-user-id="shareUserId"
      />
      <AcquisitionGifts :activity-id="activityId" />
    </div>

    <!-- 骨架屏 -->
    <div v-if="loading" :class="$style.skeleton">
      <div :class="$style.skeletonA">
        <div :class="$style.skeletonB" />
        <div :class="$style.skeletonC" />
        <div :class="$style.skeletonD" />
        <div :class="$style.skeletonE" />
      </div>
    </div>

    <you-like :is-my="true" />
    <div :class="$style.ruleNav" @click="isShowRule = true">
      活动规则
    </div>
    <pl-popup
      :show="isShowRule"
      title="活动细则"
      @close="isShowRule = false"
    >
      <div :class="$style.ruleContent">
        <h3>1.活动时间</h3>
        <p>{{ startTime }} 至 {{ endTime }}</p>
        <h3>2.活动对象</h3>
        <p>所有会员</p>
        <h3>3.活动说明</h3>
        <p v-html="activityBrief" />
      </div>
    </pl-popup>
  </div>
</template>

<script>
import moment from 'moment'
import Board from './components/Board'
import AcquisitionGifts from './components/Acquisition-Gifts.vue'
import youLike from './../home/components/YouLike.vue'
import share from '../../assets/js/wechat/wechat-share'
import { mapGetters } from 'vuex'
import {
  getActiveDetail,
  inviterStatisitic
} from '../../apis/invitenewcomers'

export default {
  name: 'InviteNewcomers',
  components: {
    Board,
    youLike,
    AcquisitionGifts
  },
  data () {
    return {
      isShowRule: false,
      loading: false,
      detail: null
    }
  },

  props: {
    activityId: {
      type: String,
      default: ''
    },
    shareUserId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['appId', 'mallUrl', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
    isNewUser () {
      return this.userId === ''
    },
    startTime () {
      if (this.detail) {
        return moment(this.detail.invitingEventsEntity.activityStartTime).format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },
    endTime () {
      if (this.detail) {
        return moment(this.detail.invitingEventsEntity.activityEndTime).format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },
    activityBrief () {
      if (this.detail) {
        return (this.detail.invitingEventsEntity.activityBrief || '').replace(/\n/g, '<br>')
      }
      return ''
    }
  },
  async activated () {
    await this.init()
  },
  methods: {
    async init () {
      try {
        this.loading = true
        // 获取活动详情
        const { result } = await getActiveDetail(this.activityId)
        this.detail = result
        this.loading = false
        await this.share()
      } catch (e) {
        throw e
      }
    },
    async share () {
      let shareUrl = `${this.mallUrl}/invitenewcomers/${this.activityId}/${this.userId}`
      // 要隐藏的微信选项
      let willHide
      // 分享id和当前id相等时，不可助力
      if (this.shareUserId && this.userId === this.shareUserId) {
        this.$router.replace({ name: 'InviteNewcomers', params: { activityId: this.activityId } })
        await share({
          appId: this.appId,
          title: '请好友一起翻礼品',
          desc: '快来帮我助力一起领取大礼哦。',
          link: shareUrl,
          imgUrl: this.logoUrl
        })
        return
      }
      // 分享id存在，且和当前id不相等时，统计分享，且此时页面不可被分享
      if (!this.shareUserId) {
        willHide = []
      } else {
        willHide = ['menuItem:share:appMessage', 'menuItem:share:timeline']
        // 是别人点进来的
        await inviterStatisitic(this.activityId, this.shareUserId)
      }
      await share({
        appId: this.appId,
        title: `${this.userName}邀请你帮他助力`,
        desc: '快来帮我助力一起领取大礼哦。',
        link: shareUrl,
        imgUrl: this.logoUrl,
        willHide
      })
    }
  }
}
</script>

<style lang="scss" module>
.invitenewcomers {
  .center {
    padding: 32px 24px;
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

  .skeleton {
    padding: 32px 24px;
  }
  .skeleton-a {
    padding: 32px 24px;
    background-color: #fa4d2f;
    border-radius: 20px;
  }
  .skeleton-b {
    height: 126px;
    border-radius: 20px;
    @include skeAnimation(#feca41)
  }
  .skeleton-c {
    width: 448px;
    height: 56px;
    margin: 48px auto 0;
    border-radius: 10px;
    @include skeAnimation(#eee)
  }
  .skeleton-d {
    width: 540px;
    height: 50px;
    margin: 24px auto 0;
    border-radius: 10px;
    @include skeAnimation(#eee)
  }
  .skeleton-e {
    width: 452px;
    height: 110px;
    margin: 64px auto 0;
    border-radius: 55px;
    @include skeAnimation(#feca41)
  }
</style>
