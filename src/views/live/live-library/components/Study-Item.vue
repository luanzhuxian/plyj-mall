<template>
  <div :class="$style.studyItem" @click="target">
    <div :class="$style.img">
      <div v-if="item.validityType === 1">{{ item.validity }}天内完成学习</div>
      <img :src="item.courseImg" alt="">
    </div>
    <div :class="$style.content">
      <div :class="$style.description">
        <div>{{ item.courseName }}</div>
        <div>{{ item.category2Name }}</div>
      </div>
      <div :class="$style.learn">
        <div>主讲人：{{ item.lecturer }}</div>
        <div>
          <span>已学习</span><span>{{ item.learnProgress || 0 }}%</span>
        </div>
        <div v-if="$route.params.learnStatus !== '3'">
          学习课程
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudyItem',
  props: {
    item: {
      type: Object,
      default () {
        return {
          validityType: '', // 0 不限制时间，1 限制
          courseImg: '', // 图片地址
          courseName: '', // 课程名字
          category2Name: '', // 二级标签
          lecturer: '', // 主讲人
          learnStatus: '', // 1 未学习 2 学习中 3 学习完
          learnProgress: 0// 进度
        }
      }
    }
  },
  methods: {
    target () {
      let item = this.item
      if (this.$route.params.learnStatus !== '3') {
        this.$router.push({
          name: 'CourseWatch',
          params: {
            id: item.courseId
          },
          query: {
            liveId: item.liveId,
            orderId: item.orderId,
            progress: item.learnProgress,
            courseId: item.courseId
          }
        })
      }
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
      width: 280px;
      height: 186px;
      position: relative;
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
