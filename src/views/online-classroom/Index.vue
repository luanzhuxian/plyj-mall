<template>
    <div :class="$style.onlineClassroom">
        <div :class="$style.tabBox">
            <pl-tab
                size="middle"
                :tabs="tabs"
                :active-id.sync="activeTabId"
                @change="tabChange"
            >
                <div
                    :class="$style.tabPane"
                    v-for="(item, i) of tabs"
                    :key="i"
                    :slot="'tab-pane-' + i"
                />
            </pl-tab>
        </div>
        <div
            :class="$style.sendLive"
            v-if="unaccalimedSendCount"
            @click="isShowSendLiveDialog = true"
        >
            <span>赠送了您{{ unaccalimedSendCount }}节直播课程哦，快来学习吧~</span>
            <span>查看></span>
        </div>
        <keep-alive>
            <router-view />
        </keep-alive>
        <!--赠课弹框-->
        <send-live
            v-if="isShowSendLiveDialog"
            :show.sync="isShowSendLiveDialog"
            is-notice="1"
        />
    </div>
</template>
<script>
import { getSendLiveList } from '../../apis/online-classroom.js'
import SendLive from '../../components/common/Send-Live.vue'
export default {
    name: 'OnlineClassroomIndex',
    components: {
        SendLive
    },
    data () {
        return {
            activeTabId: 0,
            tabs: [
                { name: '互动直播', routerName: 'InteractiveLive', id: 0 },
                { name: '精选单课', routerName: 'OnlineClassroom', id: 1 },
                { name: '系列精品课', routerName: 'seriesOfCourses', id: 2 }
            ],
            unaccalimedSendCount: 0,
            isShowSendLiveDialog: false
        }
    },
    async activated () {
        this.activeTabId = this.tabs.find(item => item.routerName === this.$route.name).id
        this.getSendLiveCount()
    },
    methods: {
        async tabChange (item) {
            await this.$nextTick()
            await this.$router.replace({ name: item.routerName })
        },
        async getSendLiveCount () {
            try {
                const { result } = await getSendLiveList('1')
                this.unaccalimedSendCount = result.length
            } catch (e) {
                throw e
            }
        }
    }
}
</script>
<style lang="scss" module>
  .online-classroom {
    min-height: calc(100vh - 92px - 120px);
    padding-top: 92px;
    padding-bottom: 120px;
    background-color: #FFF;
  }
  .tab-box {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    border-bottom: 1px solid #e7e7e7;
    z-index: 10;
    :global {
      .pl-tab {
        justify-content: center;
      }
      .pl-tab__pane.active:after {
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 8px;
        border-radius: 4px;
        background-image: linear-gradient(90deg, #F3AD3C, #F7CF54);
      }
    }
  }
  .send-live {
    display: flex;
    padding: 0 32px 0 24px;
    justify-content: space-between;
    line-height: 80px;
    font-size:28px;
    background-color: #448AE1;
    color: #FFF;
  }
</style>
