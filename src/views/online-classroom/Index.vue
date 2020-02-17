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
      <InteractiveLive v-if="activeTabId === 0" />
      <OnlineClassroom v-if="activeTabId === 1" />
    </div>
  </div>
</template>
<script>
import InteractiveLive from './Interactive-Live.vue'
import OnlineClassroom from './Online-Classroom.vue'
export default {
  name: 'OnlineClassroomIndex',
  components: {
    InteractiveLive,
    OnlineClassroom
  },
  data () {
    return {
      activeTabId: 0,
      tabs: [
        { name: '互动直播', id: 0 },
        { name: '线上课程', id: 1 }]
    }
  },
  async activated () {
    try {
      this.activeTabId = this.$route.params.activeTabId || 0
    } catch (e) {
      throw e
    }
  },
  methods: {
    async handleClick (item) {
      try {
        this.activeTabId = item.id
      } catch (e) {
        throw e
      }
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
.content{
  padding: 0 10px 20px;
}
</style>
