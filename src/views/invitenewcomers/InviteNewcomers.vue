<template>
  <div class="invitenewcomers">
    <div class="center">
      <board
        :data="detail"
        :active-id="activityId"
        @gift-is-opened="init"
        @i-want-to-get-gift-too="init"
      />
      <AcquisitionGifts :activity-id="activityId" />
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
  getActiveDetail
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
      currentSystemDate: '',
      isShowRule: false,
      isShowShareLayer: false,
      isGotGiftSuccess: false,

      inviteTitle: '邀请好友，赢<span style="font-family: HYLingXinJ; color: #f6f4b4;">豪礼</span>大奖',

      giftInfo: {
        type: 'coupon'
        // coupon info
        // gift info
      },

      detail: null,

      canClaimGift: false,

      // 总领取数
      totalClaimers: 0
    }
  },

  props: {
    activityId: {
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
    // let shareUrl = `${this.mallUrl}/invitenewcomers/${this.activityId}/help/${this.userId}`
    let shareUrl = `${this.mallUrl}/invitenewcomers/${this.activityId}/${this.userId}`
    await share({
      appId: this.appId,
      title: '请好友一起翻礼品',
      desc: '快来帮我助力一起领取大礼哦。',
      link: shareUrl,
      imgUrl: this.logoUrl
    })
  },
  methods: {
    async init () {
      try {
        // 获取活动详情
        const { result } = await getActiveDetail(this.activityId)
        this.detail = result
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./fonts/hyfonts-subset.css";
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
</style>
