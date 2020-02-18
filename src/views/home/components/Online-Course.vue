<template>
  <div :class="$style.onlineCourseWrapper">
    <div :class="$style.onlineCourseHead">
      <div :class="$style.onlineCourseHeadLeft">
        <div :class="$style.onlineCourseHeadLeftMain">
          <pl-svg name="icon-tv-76530" width="36" height="40" />
          <span>线上课程</span>
        </div>
        <div :class="$style.onlineCourseHeadLeftSub">
          {{ `还有${rest}个线上课程，等你来学习` }}
        </div>
      </div>
      <router-link
        :class="$style.onlineCourseHeadRight"
        :to="{ name: 'OnlineClassroom' }"
      >
        查看全部
      </router-link>
    </div>
    <router-link
      v-if="list.length"
      :class="$style.onlineCourse"
      :to="{ name: '', params: { id: course.id } }"
    >
      <div :class="$style.imgWrapper">
        <img :src="course.courseImg + '?x-oss-process=style/thum-small'">
      </div>
      <div :class="$style.info">
        <div :class="$style.top" v-text="course.courseName" />
        <div :class="$style.middle">
          {{ `主讲人：${course.lecturer}` }}
        </div>
        <div :class="$style.bottom">
          <span :class="$style.bottomPrice" v-text="course.sellingPrice " />
          <span :class="$style.bottomOrigin" v-text="course.originalPrice" />
          <div :class="$style.bottomBtn">
            立即学习
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'OnlineCourse',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    list () {
      return this.data.records ? this.data.records : []
    },
    course () {
      return this.list.length ? this.list[0] : {}
    },
    rest () {
      return this.list.length ? this.data.total - 1 : 0
    }
  },
  created () {}
}
</script>

<style module lang="scss">
  .online-course-wrapper {
    padding: 32px 20px 40px;
    background-color: #fff;
  }
  .online-course-head {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    &-left {
      flex: 1;
      width: 0;
      &-main {
        display: flex;
        align-items: end;
        margin-bottom: 12px;
        > span {
          margin-left: 16px;
          font-size: 32px;
          font-weight: bold;
          color: #333333;
        }
      }
      &-sub {
        font-size: 22px;
        height: 32px;
        line-height: 32px;
        color: #1592E6;
      }
    }
    &-right {
      width: 144px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      border: 2px solid #CCCCCC;
      border-radius: 10px;
      font-size: 24px;
      color: #666666;
    }
  }
  .online-course {
    display: flex;
    background-color: #FFF;
    border-radius: 20px;
    overflow: hidden;
  }
  .img-wrapper {
    position: relative;
    width: 280px;
    height: 186px;
    border-radius: 20px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    flex: 1;
    width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 14px 0 14px 24px;
  }
  .top {
    font-size: 28px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 36px;
    color: #333333;
    text-align: justify;
    @include elps();
  }
  .middle {
    margin-top: 12px;
    font-size: 24px;
    line-height: 34px;
    color: #666666;
    @include elps();
  }
  .bottom {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-price {
      font-size: 40px;
      font-family: San Francisco Display;
      font-weight: bold;
      line-height: 34px;
      color: #FE7700;
      &::before {
        content: '￥';
        font-size: 28px;
      }
    }
    &-origin {
      margin-left: 12px;
      font-size: 28px;
      line-height: 34px;
      color: #999999;
      text-decoration: line-through;
      &::before {
        content: '￥';
      }
    }
    &-btn {
      margin-left: auto;
      width: 124px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      background-color: #FE7700;
      border-radius: 8px;
      font-size: 26px;
      color: #FFFFFF;
    }
  }
</style>
