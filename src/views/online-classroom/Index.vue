<template>
  <div class="online-classroom">
    <div class="tab-box">
      <div class="pl-tab pl-tab__small">
        <div
          v-for="(item, i) of tabs"
          :key="i"
          class="pl-tab__pane color9"
          :class="{ active: item.id === activeTabId }"
          @click="handleClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
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
        { name: '线上课程', routerName: 'OnlineClassroom', id: 1 }]
    }
  },
  async activated () {
    try {
      this.activeTabId = this.tab.filter(item => item.routerName === this.$route.name)[0].id
    } catch (e) {
      throw e
    }
  },
  methods: {
    async handleClick (item) {
      try {
        this.activeTabId = item.id
        this.$router.replace({ name: item.routerName })
      } catch (e) {
        throw e
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .tab-box{
    width: 100vw;
    position: fixed;
    z-index: 9999;
    top: 0;
  }
.content{
  margin-top: 64px;
  padding: 10px 10px 20px;
  background-color: #FFF;
}
</style>
