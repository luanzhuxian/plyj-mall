<template>
  <div :class="$style.courseWatch">
    <PaidPlayer
      :src.sync="detail.url"
      @loadeddata="loadeddata"
      @ended="videoEnded"
      :current-time="currentTime"
      ref="paidPlayer"
      :size="detail.fileSize"
    />
  </div>
</template>

<script>
import { getCourseDetail, getPermission, setCourseProgress } from './../../../apis/live-library'
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
      orderId: '',
      detail: {}
    }
  },
  async activated () {
    try {
      this.orderId = this.$route.query.orderId
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
        let liveId = this.$route.query.liveId
        let { result: mes } = await getCourseDetail(liveId)
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
        await setCourseProgress(this.orderId, progress)
      } catch (e) { throw e }
    },
    loadeddata (e) {
      const video = e.target
      this.duration = video.duration
      const progress = this.$route.query.progress
      const playTime = (progress / 100) * this.duration
      this.currentTime = playTime
    },
    async videoEnded () {
      try {
        await setCourseProgress(this.orderId, 100)
      } catch (e) { throw e }
    }
  }
}
</script>

<style module lang='scss'>
  .course-watch {
  }
</style>
