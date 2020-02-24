<template>
  <div :class="$style.courseWatch">
    <div :class="$style.videoBox">
      <video ref="video" preload controls width="100%" :src="detail.url" />
    </div>
  </div>
</template>

<script>
import { getCourseDetail, getPermission, setCourseProgess } from './../../../apis/live-library'
export default {
  name: 'CourseWatch',
  data () {
    return {
      duration: 0, // 视频总时长
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
        this.watchVideoProcess()
        window.addEventListener('unload', this.updateProgress)
      }
    } catch (e) { throw e }
  },
  deactivated () {
    try {
      let video = this.$refs.video
      video.removeEventListener('play', this.videoPlay)
      video.removeEventListener('ended', this.videoEnded)
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
        let videoTime = this.$refs.video.currentTime || 0
        let progress = parseInt((videoTime / this.duration) * 100)
        await setCourseProgess(this.orderId, progress)
      } catch (e) { throw e }
    },
    // video控制
    watchVideoProcess () {
      let video = this.$refs.video
      video.addEventListener('play', this.videoPlay)
      video.addEventListener('ended', this.videoEnded)
    },
    videoPlay () {
      let video = this.$refs.video
      this.duration = video.duration
      let progress = this.$route.query.progress
      let playTime = (progress / 100) * this.duration
      video.currentTime = playTime
      video.removeEventListener('play', this.videoPlay)
    },
    async videoEnded () {
      try {
        await setCourseProgess(this.orderId, 100)
      } catch (e) { throw e }
    }
  }
}
</script>

<style module lang='scss'>
  .course-watch {
    .video-box {
      width: 100%;
      > video {
        object-fit:fill;
        width: 100%;
        height: 442px;
      }
    }
  }
</style>
