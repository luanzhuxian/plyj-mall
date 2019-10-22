<template>
  <div class="newcomers-home-entry">
    <overlay v-if="showSelf == true">
      <div class="center-box">
        <img src="../../assets/images/newcomers/newcomers-home.png">
        <div style="margin-top: 80px; text-align: center;">
          <span class="btn-goto-get" @click="gotoGet">快去领取</span>
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
import { mapGetters } from 'vuex'
import Overlay from '../invitenewcomers/components/Overlay'
import { getCurrentActivity } from '../../apis/newcomers'

export default {
  name: 'NewcomersHomeEntry',
  components: {
    Overlay
  },
  data () {
    return {
      activityInfo: { status: 0 }
    }
  },

  computed: {
    ...mapGetters(['appId', 'mallDomain', 'agentUser', 'userId', 'avatar', 'userName', 'mobile', 'mallName', 'mallDesc', 'logoUrl']),
    isNewUser () {
      return this.userId === ''
    },
    isActivityStoped () {
      return moment(this.activityInfo.activityEndTime).isBefore(moment()) || this.activityInfo.status === 0
    },
    showSelf () {
      return (!this.isActivityStoped) && this.isNewUser()
    }
  },

  async created () {
    await this.getCurrentActivity()
  },

  methods: {
    async getCurrentActivity () {
      let { result } = await getCurrentActivity()
      console.log(result)
      this.activityInfo = result
    },
    gotoGet () {
      this.$router.push({ name: 'Newcomers', params: { activityId: this.activityInfo.id } })
    },

    close () {
      this.showSelf = false
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
  }
}
</style>
