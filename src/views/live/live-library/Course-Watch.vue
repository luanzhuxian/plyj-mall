<template>
  <div :class="$style.courseWatch">
    <PaidPlayer
      :src.sync="detail.url"
      @loadeddata="loadeddata"
      @ended="videoEnded"
      @playing="playing"
      @error="error"
      :current-time="currentTime"
      ref="paidPlayer"
      :size="detail.fileSize"
    />
  </div>
</template>

<script>
import {
  getCourseDetail,
  getPermission,
  setCourseProgress,
  setStudyCount,
  setStudyTime
} from './../../../apis/live-library'
import PaidPlayer from '../../../components/common/Paid-Player.vue'
export default {
  name: 'CourseWatch',
  components: {
    PaidPlayer
  },
  data () {
    return {
      duration: 0, // 视频总时长
      currentTime: 0,
      detail: {}
    }
  },
  computed: {
    liveId () {
      return this.$route.query.liveId
    },
    orderId () {
      return this.$route.query.orderId
    }
  },
  async activated () {
    try {
      await this.getCourseDetail()
      await this.$nextTick()
      // 没看完请求
      if (this.$route.query.progress < 100) {
        window.addEventListener('unload', this.updateProgress)
      }
    } catch (e) { throw e }
  },
  deactivated () {
    try {
      window.removeEventListener('unload', this.updateProgress)
      this.updateProgress()
      this.hasSetStudyCount = false
    } catch (e) { throw e }
  },
  methods: {
    // 获取课程信息
    async getCourseDetail () {
      try {
        let courseId = this.$route.params.id
        let { result } = await getPermission(courseId)
        if (!result) {
          await this.$warning('请先购买课程')
          this.$router.push({ name: 'Curriculum', params: { productId: courseId } })
          return
        }
        let { result: mes } = await getCourseDetail(this.liveId)
        // mes.url = 'https://oss-live-1.videocc.net/record/record/recordf/1ff6dda78b20191021185719049/2020-02-08-15-34-36_2020-02-08-15-39-07.mp4'
        this.detail = mes
      } catch (e) { throw e }
    },
    // 向后台存储播放进度
    async updateProgress () {
      try {
        if (this.duration === 0) return
        let videoTime = this.$refs.paidPlayer.video.currentTime || 0
        let progress = parseInt((videoTime / this.duration) * 100)
        // 用于已购买的课程列表显示
        await setCourseProgress(this.orderId, progress)
        // 用于课程详情页面的显示
        await setStudyTime(this.liveId, videoTime)
      } catch (e) { throw e }
    },
    // 统计观看次数
    async setStudyCount () {
      if (this.hasSetStudyCount) {
        // 已经统计过了，不再统计
        return
      }
      try {
        await setStudyCount(this.liveId)
        // 标记为已设置过观看次数，再次触发事件，将不统计，只有第一次播放时统计
        this.hasSetStudyCount = true
      } catch (e) {
        throw e
      }
    },
    loadeddata (e) {
      const video = e.target
      this.duration = video.duration
      const progress = this.$route.query.progress
      const playTime = (progress / 100) * this.duration
      this.currentTime = playTime
    },
    // 开始播放时做一些事，如：统计观看次数
    async playing () {
      try {
        await this.setStudyCount()
      } catch (e) {
        throw e
      }
    },
    async videoEnded () {
      try {
        await setCourseProgress(this.orderId, 100)
      } catch (e) { throw e }
    },
    error (e) {
      this.$error('视频已被删除')
    }
  }
}
</script>

<style module lang='scss'>
  .course-watch {
  }
</style>
