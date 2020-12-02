<template>
    <div class="newcomers">
        <img class="banner" src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/e2574738-c815-47d4-82f5-d8e8553906b0.jpeg">
        <div class="title-bar">
            <i class="icon-gift" />
            优惠大礼包
            <span class="rule" @click="isShowRule = true">
                <span>活动规则</span><pl-svg name="icon-double-arrow" height="24" width="13" />
            </span>
        </div>
        <div class="gift-list">
            <CouponItem
                v-for="(item, index) in activityInfo.couponModels"
                :key="index"
                :coupon-id="item.id"
                :activity-id="item.activityId"
                :name="item.couponName"
                :amount="item.amount"
                :subtract="item.amount"
                :full="item.useLimitAmount"
                :use-start-time="item.useStartTime"
                :use-end-time="item.useEndTime"
                :status="isActivityStoped ? (activityInfo.status == 0 ? '已结束' : '已停止') : ''"
                :is-show-receive="false"
                :coupon-type="item.couponType"
            />
        </div>
        <div class="get-gift" @click="tryClaim(false)">
            {{ btnClaimText }}
        </div>
        <pl-popup
            :show="isShowRule"
            title="活动细则"
            @close="isShowRule = false"
        >
            <div class="rule-content">
                <h3>1.活动时间</h3>
                <p>{{ activityInfo.activityStartTime }} 至 {{ activityInfo.activityEndTime }}</p>
                <h3>2.活动对象</h3>
                <p>新注册会员</p>
                <h3>3.活动说明</h3>
                <p v-html="activityBrief" />
            </div>
        </pl-popup>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import share from '../../../../assets/js/wechat/wechat-share'
import CouponItem from '../../../../components/my/coupon/Coupon-Item.vue'
import { getServerTime } from '../../../../apis/base-api'
import { getNewcomersDetail } from '../../../../apis/new-year'

export default {
    name: 'NewYearNewcomers',
    components: {
        CouponItem
    },
    data () {
        return {
            isShowRule: false,
            isShowDlg: true,
            activityInfo: {},
            serverTime: ''
        }
    },

    computed: {
        ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
        // 是否为新用户
        isNewUser () {
            return !this.userId
        },
        // 活动是否已结束/暂停
        isActivityStoped () {
            return moment(this.activityInfo.activityEndTime).isBefore(moment(this.serverTime)) || this.activityInfo.status === 0
        },
        btnClaimText () {
            if (this.activityInfo.status === 0) return '该活动已停止，暂不能领用礼包'
            if (moment(this.activityInfo.activityEndTime).isBefore(moment(this.serverTime))) return '该活动已结束，不能领用礼包'
            if (!this.isNewUser) return '您已成功领取礼包'
            return '一键领取'
        },
        activityBrief () {
            return (this.activityInfo.activityBrief || '').replace(/\n/g, '<br>')
        }
    },

    watch: {
        'activityInfo.hasClaim' (newVal) {
            if (newVal && (!this.isActivityStoped)) {
                this.reClaimed()
            }
        }
    },

    async activated () {
        try {
            await this.getNewcomersDetail()
            await this.tryClaim(true)
            this.share()
        } catch (e) {
            throw e
        }
    },

    methods: {

        // 初始化分享数据
        share () {
            share({
                appId: this.appId,
                title: '新人有礼优惠多多',
                desc: '快来成为新会员，即可领取优惠大礼包1份',
                link: window.location.href,
                imgUrl: this.logoUrl
            })
        },

        // 获取服务器时间
        async getServerTime () {
            try {
                const { result: serverTiem } = await getServerTime()
                this.serverTime = serverTiem || null
            } catch (e) {
                throw e
            }
        },

        // 获取活动详情
        async getNewcomersDetail () {
            try {
                const { result } = await getNewcomersDetail(this.$route.params.activityId)
                this.activityInfo = result
            } catch (e) {
                throw e
            }
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

        // 保存状态
        saveState () {
            sessionStorage.setItem('NEWCOMERS_CLAIM', 'true')
        },

        // 获取当前状态，并且清楚记录
        restoryState () {
            const state = sessionStorage.getItem('NEWCOMERS_CLAIM')
            sessionStorage.removeItem('NEWCOMERS_CLAIM')
            return state === 'true'
        },

        // 是否需要注册用户
        async needRegisterNew () {
            try {
                if (!this.userId) {
                    await this.$alert({
                        confirmText: '去注册',
                        message: '新注册会员可领取',
                        viceMessage: '优惠券大礼包已发送到您的卡包,请在有效期内使用'
                    })
                    this.saveState()
                    this.bindMobile()
                    return true
                }
                return false
            } catch (e) {
                throw e
            }
        },
        async reClaimed () {
            return this.$alert({
                confirmText: '朕知道了',
                viceMessage: '优惠券大礼包您已经领取成功，新注册会员仅可领取一次',
                message: '领取成功'
            })
        },
        async gameOver () {
            return this.$alert({
                confirmText: '朕知道了',
                viceMessage: '活动结束，感谢您参与活动',
                message: '优惠券大礼包已领完'
            })
        },
        async tryClaim (restore) {
            try {
                if (!this.isNewUser) return
                if (this.isActivityStoped) {
                    await this.gameOver()
                    return
                }
                if (restore && this.userId) {
                    if (this.restoryState()) return
                }
                const need = await this.needRegisterNew()
                if (!need) {
                    await this.$alert({
                        confirmText: '朕知道了',
                        viceMessage: '本活动仅限新注册用户参与',
                        message: '感谢您参与'
                    })
                }
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.newcomers {
  .banner {
    margin-bottom: 34px;
    width: 100%;
    height: auto;
  }

  .title-bar {
    position: relative;
    padding-left: 22px;
    margin-bottom: 34px;
    height: 44px;
    line-height: 44px;
    font-size: 32px;
  }

  .rule {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    right: 30px;
    height: 44px;
    line-height: 44px;
    font-size: 32px;
    font-weight: 800;
    color: #fe7700;
  }

  .icon-gift {
    display: inline-block;
    margin-right: 16px;
    width: 40px;
    height: 40px;
    background-image: url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/newcomers/gift@2x.png');
    background-size: 100%;
  }

  .gift-list {
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 110px;
    width: 702px;
  }

  .get-gift {
    position: fixed;
    bottom: 0;
    height: 96px;
    z-index: 1;
    line-height: 96px;
    width: 100%;
    background-color: #f2b036;
    color: white;
    font-size: 32px;
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
