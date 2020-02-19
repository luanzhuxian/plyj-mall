<template>
  <div :class="$style.courseWatch">
    <div :class="$style.videoBox">
      <video ref="video" preload controls x5-video-player-type="h5-page" width="100%" :src="detail.url" />
    </div>
  </div>
</template>

<script>
import { getCourseDetail, getPermission, setCourseProgess } from './../../../apis/live-library'
export default {
  name: 'CourseWatch',
  data () {
    return {
      videoTime: 0, // 视频播放的时间
      setFlag: true, // 是否要记录 videoTime
      duration: 0, // 视频总时长
      timer: null, // 定时器
      detail: {}
    }
  },
  async activated () {
    try {
      await this.getCourseDetail()
      await this.$nextTick()
      this.watchVideoProcess()
    } catch (e) { throw e }
  },
  deactivated () {
    try {
      let video = this.$refs.video
      video.removeEventListener('timeupdate', this.timeupdate)
      video.removeEventListener('play', this.videoPlay)
      video.removeEventListener('pause', this.videoPause)
      video.removeEventListener('ended', this.videoEnded)
      clearTimeout(this.timer)
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
        mes.url = 'https://oss-live-1.videocc.net/record/record/recordf/1ff6dda78b20191021185719049/2020-02-08-15-34-36_2020-02-08-15-39-07.mp4'
        this.detail = mes
      } catch (e) { throw e }
    },
    // 每30s存储一次播放时间
    setTime () {
      this.timer = setTimeout(async () => {
        try {
          let video = this.$refs.video
          if (video && this.setFlag && video.currentTime > this.videoTime) {
            this.videoTime = parseInt(video.currentTime)
          }
          this.setTime()
          this.updateProgress()
        } catch (e) { throw e }
      }, 30000)
    },
    // 向后台存储播放进度
    async updateProgress () {
      try {
        let progess = parseInt((this.videoTime / this.duration) * 100)
        await setCourseProgess(this.$route.query.orderId, progess)
      } catch (e) { throw e }
    },
    // video控制
    watchVideoProcess () {
      let video = this.$refs.video
      video.addEventListener('timeupdate', this.timeupdate)
      video.addEventListener('play', this.videoPlay)
      video.addEventListener('pause', this.videoPause)
      video.addEventListener('ended', this.videoEnded)
    },
    // 监听视频播放
    timeupdate () {
      let video = this.$refs.video
      let currentTime = parseInt(video.currentTime) // 单位是秒
      if (this.videoTime + 30 < currentTime) {
        this.setFlag = false
        video.currentTime = this.videoTime
        video.pause()
      }
    },
    videoPlay () {
      this.setFlag = true
      this.duration = this.$refs.video.duration
      this.setTime()
    },
    videoPause () {
      this.setFlag = false
      clearTimeout(this.timer)
    },
    async videoEnded () {
      try {
        clearTimeout(this.timer)
        await setCourseProgess(this.$route.query.orderId, 100)
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
