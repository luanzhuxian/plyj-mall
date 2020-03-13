<template>
  <div :class="$style.courseWatch">
    <PaidPlayer
      v-if="playerFlag"
      :src.sync="detail.url"
      @ended="videoEnded"
      @playing="playing"
      :video-id="liveId"
      :resource-name="detail.name"
      :current-time="currentTime"
      :resource-id="courseId"
      ref="paidPlayer"
      auto-height
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
      playerFlag: false, // 微信会缓存上个视频 currentTime，每次重新实例化播放组件
      detail: {
        url: ''
      },
      setStudyTimer: null,
      setProgressTimer: null
    }
  },
  computed: {
    liveId () {
      return this.$route.query.liveId
    },
    orderId () {
      return this.$route.query.orderId || 1
    },
    progress () {
      return Number(this.$route.query.progress) || 0
    },
    courseId () {
      return this.$route.query.courseId
    }
  },
  async activated () {
    try {
      this.playerFlag = true
      this.isStudy = false
      this.currentTime = 0
      await this.getCourseDetail()
    } catch (e) { throw e }
  },
  deactivated () {
    try {
      this.playerFlag = false
      window.clearTimeout(this.setProgressTimer)
      window.clearTimeout(this.setStudyTimer)
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
        if (!mes) {
          this.$alert({
            message: '视频加载错误',
            viceMessage: '请联系机构管理人员'
          }).finally(() => {
            if (window.history.length > 1) {
              this.$router.go(-1)
            } else {
              this.$router.replace({ name: 'Home' })
            }
          })
          return
        }
        // mes.url = 'https://oss-live-1.videocc.net/record/record/recordf/1ff6dda78b20191021185719049/2020-02-08-15-34-36_2020-02-08-15-39-07.mp4'
        mes.fileSize = Number(mes.fileSize) || 0
        this.detail = mes
      } catch (e) { throw e }
    },
    // 向后台存储播放进度
    async updateProgress () {
      if (this.duration === 0) return
      window.clearTimeout(this.setProgressTimer)
      // 视频短的取用十分之一播放时长调用
      let times = (this.duration / 10) || 0
      times = times > 10e4 ? 10e4 : times
      this.setProgressTimer = window.setTimeout(async () => {
        try {
          let videoTime = (this.$refs.paidPlayer && this.$refs.paidPlayer.video && this.$refs.paidPlayer.video.currentTime) || 0
          let progress = parseInt((videoTime / this.duration) * 100)
          // 有时会有缓存，这行是必须的
          progress = progress > 100 ? 100 : progress
          // 用于已购买的课程列表显示
          if (progress > 0) {
            await setCourseProgress(this.orderId, progress)
          }
        } catch (e) {
          this.error(e)
        } finally {
          this.updateProgress()
        }
      }, times * 1000)
    },
    // 向后台存储观看时长
    updateStudyTime () {
      if (this.duration === 0) return
      window.clearTimeout(this.setStudyTimer)
      // 视频短的取用十分之一播放时长调用
      let times = (this.duration / 10) || 0
      times = times > 10e4 ? 10e4 : times
      this.setStudyTimer = window.setTimeout(async () => {
        try {
          let videoTime = (this.$refs.paidPlayer && this.$refs.paidPlayer.video && this.$refs.paidPlayer.video.currentTime) || 0
          // 用于课程详情页面的显示
          await this.setStudyTime(Number.parseInt(videoTime))
        } catch (e) {
          this.error(e)
        } finally {
          this.updateStudyTime()
        }
      }, times * 1000)
    },
    // 进来首次播放调用
    async updateProgressOnce () {
      try {
        // 用于已购买的课程列表显示
        await setCourseProgress(this.orderId, 1)
      } catch (e) { throw e }
    },
    // 统计观看次数，只有第一次播放时统计
    async setStudyCount () {
      try {
        await setStudyCount(this.liveId)
      } catch (e) { throw e }
    },
    // 开始播放时做一些事
    async playing (e) {
      try {
        if (!this.isStudy) {
          const video = e.target
          this.duration = video.duration
          const playTime = this.progress === 100 ? 0 : ((this.progress / 100) * this.duration)
          this.setStudyTime = this.returnSetStudyTime(playTime || 0)
          if (this.progress < 100) {
            this.currentTime = playTime
            // 更新观看进度
            this.updateProgress()
          }
          this.isStudy = true
          this.updateStudyTime()
          await this.setStudyCount()
          await this.updateProgressOnce()
        }
      } catch (e) { throw e }
    },
    async videoEnded () {
      try {
        if (this.isStudy) {
          window.clearTimeout(this.setProgressTimer)
          window.clearTimeout(this.setStudyTimer)
          let videoTime = (this.$refs.paidPlayer && this.$refs.paidPlayer.video && this.$refs.paidPlayer.video.currentTime) || 0
          // 依此用于已购买的课程列表显示,课程详情页面的显示
          await Promise.all([setCourseProgress(this.orderId, 100), this.setStudyTime(Number.parseInt(videoTime))])
        }
      } catch (e) { throw e }
    },
    // 设置更新进度
    returnSetProgress (preProgress) {
      let setProgress = async (currentProgress) => {
        try {
          if (currentProgress > preProgress) {
            await setCourseProgress(this.orderId, currentProgress)
          }
        } catch (e) { throw e }
      }
      return setProgress
    },
    // 设置观看时长
    returnSetStudyTime (preTime) {
      let setStydyTime = async (currentTime) => {
        try {
          if (currentTime > preTime) {
            let duration = Number.parseInt(currentTime - preTime) || 0
            await setStudyTime(this.liveId, duration)
          }
          preTime = currentTime
        } catch (e) { throw e }
      }
      return setStydyTime
    },
    error (e) {
      if (e.name === 'ResponseError') {
        this.$error(JSON.parse(e.message).message)
      } else {
        this.$error(e.message)
      }
    }
  }
}
</script>

<style module lang='scss'>
  .course-watch {
    display: flex;
    align-items: center;
    height: 100vh;
    background-color: #000;
  }
</style>
