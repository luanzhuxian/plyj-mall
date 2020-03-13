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
        <keep-alive>
            <router-view />
        </keep-alive>
    </div>
</template>
<script>
export default {
    name: 'OnlineClassroomIndex',
    data () {
        return {
            activeTabId: 0,
            tabs: [
                { name: '互动直播', routerName: 'InteractiveLive', id: 0 },
                { name: '知识课程', routerName: 'OnlineClassroom', id: 1 }]
        }
    },
    async activated () {
        this.activeTabId = this.tabs.find(item => item.routerName === this.$route.name).id
    },
    methods: {
        async tabChange (item) {
            await this.$nextTick()
            await this.$router.replace({ name: item.routerName })
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
</style>
