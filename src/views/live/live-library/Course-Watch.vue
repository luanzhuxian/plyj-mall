<template>
  <div :class="$style.courseWatch">
    <PaidPlayer
      :src.sync="detail.url"
      @loadeddata="loadeddata"
      @ended="videoEnded"
      @playing="playing"
      @error="error"
      :video-id="liveId"
      :resource-name="detail.name"
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
      isStudy: false, // 是否第一次进来点播学习
      duration: 0, // 视频总时长
      currentTime: 0,
      detail: {},
      timer: null
    }
  },
  computed: {
    liveId () {
      return this.$route.query.liveId
    },
    orderId () {
      return this.$route.query.orderId
    },
    progress () {
      return this.$route.query.progress
    }
  },
  async activated () {
    try {
      this.isStudy = false
      await this.getCourseDetail()
    } catch (e) { throw e }
  },
  deactivated () {
    try {
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
        let { result: mes } = await getCourseDetail(this.liveId)
        // mes.url = 'https://oss-live-1.videocc.net/record/record/recordf/1ff6dda78b20191021185719049/2020-02-08-15-34-36_2020-02-08-15-39-07.mp4'
        this.detail = mes
      } catch (e) { throw e }
    },
    // 向后台存储播放进度，两分钟更新一次进度
    async updateProgress () {
      if (this.duration === 0) return
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        try {
          let videoTime = this.$refs.paidPlayer.video.currentTime || 0
          let progress = parseInt((videoTime / this.duration) * 100)
          // 依此用于已购买的课程列表显示,课程详情页面的显示
          await Promise.all([setCourseProgress(this.orderId, progress), setStudyTime(this.liveId, Number.parseInt(videoTime))])
        } catch (e) {
          if (e.name === 'ResponseError') {
            this.$error(JSON.parse(e.message).message)
          } else {
            this.$error(e.message)
          }
        } finally {
          this.updateProgress()
        }
      }, 12e4)
    },
    // 统计观看次数，只有第一次播放时统计
    async setStudyCount () {
      try {
        await setStudyCount(this.liveId)
        this.isStudy = true
      } catch (e) { throw e }
    },
    loadeddata (e) {
      if (this.progress < 100) {
        const video = e.target
        this.duration = video.duration
        const playTime = (this.progress / 100) * this.duration
        this.currentTime = playTime
        // 更新观看进度
        this.updateProgress()
      }
    },
    // 开始播放时做一些事
    async playing () {
      try {
        if (!this.isStudy) {
          await this.setStudyCount()
        }
      } catch (e) { throw e }
    },
    async videoEnded () {
      try {
        if (this.isStudy) {
          let videoTime = this.$refs.paidPlayer.video.currentTime || 0
          // 依此用于已购买的课程列表显示,课程详情页面的显示
          await Promise.all([setCourseProgress(this.orderId, 100), setStudyTime(this.liveId, videoTime)])
        }
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
