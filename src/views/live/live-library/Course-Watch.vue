<template>
  <div :class="$style.courseWatch">
    <PaidPlayer
      :src.sync="detail.url"
      @loadeddata="loadeddata"
      @ended="videoEnded"
      @playing="playing"
      :video-id="liveId"
      :resource-name="detail.name"
      :current-time="currentTime"
      ref="paidPlayer"
      back-route-name="MyCourses"
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
      detail: {
        url: ''
      },
      timer: null// 定时器
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
      this.currentTime = 0
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
        if (!mes) {
          this.$alert('视频加载错误，请联系机构管理人员')
            .finally(() => {
              this.$router.replace({ name: 'MyCourses' })
            })
          return
        }
        // mes.url = 'https://oss-live-1.videocc.net/record/record/recordf/1ff6dda78b20191021185719049/2020-02-08-15-34-36_2020-02-08-15-39-07.mp4'
        this.detail = mes
      } catch (e) { throw e }
    },
    // 向后台存储播放进度，两分钟更新一次进度
    async updateProgress () {
      if (this.duration === 0) return
      clearTimeout(this.timer)
      // 视频短的取用十分之一播放时长调用
      let times = (this.duration / 10) || 0
      times = times > 10e4 ? 10e4 : times
      this.timer = setTimeout(async () => {
        try {
          let videoTime = this.$refs.paidPlayer.video.currentTime || 0
          let progress = parseInt((videoTime / this.duration) * 100)
          progress = progress > 100 ? 100 : progress
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
      }, times * 1000)
    },
    // 统计观看次数，只有第一次播放时统计
    async setStudyCount () {
      try {
        await setStudyCount(this.liveId)
      } catch (e) { throw e }
    },
    // 进来首次播放调用
    async updateProgressOnce () {
      try {
        // 依此用于已购买的课程列表显示,课程详情页面的显示
        let videoTime = this.$refs.paidPlayer.video.currentTime || 1
        await Promise.all([setCourseProgress(this.orderId, 1), setStudyTime(this.liveId, Number.parseInt(videoTime))])
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
          this.isStudy = true
          await this.setStudyCount()
          await this.updateProgressOnce()
        }
      } catch (e) { throw e }
    },
    async videoEnded () {
      try {
        if (this.isStudy) {
          let videoTime = this.$refs.paidPlayer.video.currentTime || 0
          // 依此用于已购买的课程列表显示,课程详情页面的显示
          await Promise.all([setCourseProgress(this.orderId, 100), setStudyTime(this.liveId, Number.parseInt(videoTime))])
        }
      } catch (e) { throw e }
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
