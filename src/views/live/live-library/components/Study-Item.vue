<template>
    <div :class="$style.studyItem" @click="target(item)">
        <div :class="$style.img">
            <div v-if="item.validityType === 1">
                {{ item.priceType === 0 ? `${moment(item.validityDate).format('YYYY-MM-DD')} 到期` : `${item.validity} 天内完成学习` }}
            </div>
            <img :src="item.courseImg" alt="">
        </div>
        <div :class="$style.content">
            <div :class="$style.description">
                <div>{{ item.courseName }}</div>
                <div>{{ item.category2Name }}</div>
            </div>
            <div :class="$style.learn">
                <div v-show="item.lecturer">主讲人：{{ item.lecturer }}</div>
                <div>
                    <!-- 单课程学习进度 -->
                    <span v-if="courseType === '1'">已学习{{ (item.recordModels && item.recordModels[0] && item.recordModels[0].learnProgress) || 0 }}%</span>
                    <!-- 系列课学习进度 -->
                    <span v-else>已学习{{ item.learnedNumber || 0 }}节/{{ item.totalLiveNumber || 1 }}节课</span>
                </div>
                <div v-if="$route.params.learnStatus !== '3'">
                    学习课程
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    name: 'StudyItem',
    props: {
        item: {
            type: Object,
            default () {
                return {
                    // 0 不限制时间，1 限制
                    validityType: '',
                    // 图片地址
                    courseImg: '',
                    // 课程名字
                    courseName: '',
                    // 二级标签
                    category2Name: '',
                    // 主讲人
                    lecturer: '',
                    // 1 未学习 2 学习中 3 学习完
                    learnStatus: '',
                    // 进度
                    learnProgress: 0
                }
            }
        }
    },
    methods: {
        moment,
        target (item) {
            if (this.learnStatus !== '3') {
                if (this.courseType === '1') {
                    this.$router.push({
                        name: 'CourseWatch',
                        params: {
                            courseId: item.courseId
                        },
                        query: {
                            liveId: item.liveIdList && item.liveIdList[0],
                            orderId: item.orderId,
                            progress: item.learnProgress
                        }
                    })
                } else {
                    this.$router.push({ name: 'Curriculum', params: { productId: item.courseId } })
                }
            }
        }
    },
    computed: {
        courseType () {
            // 1单课 2系列课
            return this.$route.params.courseType || '1'
        },
        learnStatus () {
            // 1 未学习 2 学习中 3 已过期
            return this.$route.params.learnStatus || '1'
        }
    }
}
</script>

<style module lang='scss'>

  .study-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    background: #FFFFFF;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
    > .img {
      position: relative;
      width: 280px;
      height: 186px;
      border-radius: 20px;
      overflow: hidden;
      > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
      > div {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        font-size: 24px;
        line-height: 46px;
        text-align: center;
        color: #FFFFFF;
        background-color: #F2B036;
      }
    }
    > .content {
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      width: calc(100% - 304px);
      > .description {
        width: 100%;
        font-size: 24px;
        color: #666666;
        > div:nth-of-type(1) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 32px;
          font-weight: 800;
          color: #373737;
        }
        > div:nth-of-type(2) {
          display: inline-block;
          margin: 14px 0;
          padding: 0 14px;
          border-radius: 20px;
          line-height: 36px;
          color: #B58A48;
          background: #FFFAE6;
        }
      }
      > .learn {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
        > div:nth-of-type(1) {
          width: 100%;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 24px;
          white-space: nowrap;
          color: #666666;
        }
        > div:nth-of-type(2) {
          font-size: 28px;
          color: #F2B036;
        }
        > div:nth-of-type(3){
          font-size: 26px;
          text-align: center;
          background: #FE7700;
          color: #FFFFFF;
          width: 140px;
          line-height: 48px;
          border-radius:8px;
        }
      }
    }
  }

</style>
