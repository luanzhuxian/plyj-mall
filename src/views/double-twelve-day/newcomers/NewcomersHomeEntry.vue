<template>
    <div class="newcomers-home-entry">
        <overlay v-if="showSelf">
            <div class="center-box">
                <img src="https://mallcdn.youpenglai.com/static/admall/2.8.0/新人大礼包.png">
                <div style="margin-top: 80px; text-align: center;">
                    <span class="btn-goto-get" @click="gotoGet">快去领取</span>
                </div>
                <div style="margin-top: 64px; text-align: center;">
                    <span class="btn-close" @click="close">
                        <pl-svg name="icon-close" fill="white" width="24" height="24" />
                    </span>
                </div>
            </div>
        </overlay>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import Overlay from '../invitenewcomers/components/Overlay'
import { getCurrentActivity } from '../../../apis/newcomers'

export default {
    name: 'NewcomersHomeEntry',
    components: {
        Overlay
    },
    data () {
        return {
            activityInfo: { status: 0 },
            isShowSelf: true
        }
    },

    computed: {
        ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
        isNewUser () {
            return this.userId === ''
        },
        isActivityStoped () {
            if (this.activityInfo === null) {
                return true
            }
            return moment(this.activityInfo.activityEndTime).isBefore(moment()) || this.activityInfo.status === 0
        },
        isActivityStart () {
            if (this.activityInfo === null) {
                return false
            }
            return moment().isAfter(moment(this.activityInfo.activityStartTime))
        },
        showSelf () {
            // packageType 1双十二 + 2新春
            return this.isActivityStart && (!this.isActivityStoped) && this.isNewUser && this.isShowSelf
        }
    },

    async created () {
        try {
            await this.getCurrentActivity()
        } catch (e) {
            throw e
        }
    },

    methods: {
        async getCurrentActivity () {
            try {
                const { result } = await getCurrentActivity()
                this.activityInfo = result || null
            } catch (e) {
                throw e
            }
        },
        gotoGet () {
            this.$router.push({ name: 'Newcomers', params: { activityId: this.activityInfo.id } })
        },

        close () {
            this.isShowSelf = false
        }
    }
}
</script>

<style lang="scss" scoped>
.newcomers-home-entry {
  .center-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .btn-goto-get {
    display: inline-block;
    width:346px;
    height:74px;
    line-height:74px;
    background:rgba(255,99,16,1);
    border-radius:276px;
    color: white;
    font-size:26px;
    font-weight:bold;
    color:rgba(255,255,255,1);
    text-shadow:0px 1px 1px rgba(0,0,0,0.28);
  }

  .btn-close {
    display: inline-block;
    width: 48px;
    height: 48px;
    line-height: 48px;
    border: 1px solid white;
    border-radius: 50%;
    svg {
      vertical-align: middle;
    }
  }
}
</style>
