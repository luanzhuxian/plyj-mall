<template>
    <!-- 送课窗口提示 -->
    <div @click.stop="" v-show="show || showShelf" :class="$style.mask">
        <div :class="$style.container">
            <div :class="$style.main">
                <div :class="$style.head">
                    <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/send-live.png">
                </div>
                <div :class="$style.title">
                    <span>
                        <template v-if="courseList.length === 1">您免费获得了1节{{ courseType[courseList[0].courseType ] }}</template>
                        <template v-else>您免费获得了{{ courseList.length }}节课程</template>
                    </span>
                    <span>
                        <template v-if="(courseList.length === 1) && (courseList[0].courseType === 1)">
                            <!--直播未开始-->
                            <template v-if="isNotStart(courseList[0])">直播还未开始，请在直播开始时进入直播间学习</template>
                            <!--有videoLibId，说明直播已结束，可回放-->
                            <template v-else-if="courseList[0].videoLibId && courseList[0].videoLibId !== '0'">直播已结束，您可看回放进行直播课程学习</template>
                            <template v-else>直播进行中，可点击查看直播进入直播间学习</template>
                        </template>
                        <template v-else-if="currentCourseTypeCount(1) === courseList.length">
                            您可选择正在直播中的直播课程进行学习哦~
                        </template>
                        <template v-else>
                            <div :class="$style.count">
                                <b v-if="currentCourseTypeCount(1)">互动直播 {{ currentCourseTypeCount(1) }} </b>
                                <b v-if="currentCourseTypeCount(2)">精选单课 {{ currentCourseTypeCount(2) }} </b>
                                <b v-if="currentCourseTypeCount(3)">精选系列课 {{ currentCourseTypeCount(3) }} </b>
                            </div>
                        </template>
                    </span>
                </div>
                <div :class="$style.list">
                    <!--只有一节赠课时-->
                    <template v-if="courseList.length === 1">
                        <div
                            v-for="(item, index) of courseList"
                            :key="index"
                            :class="{
                                [$style.single]: true,
                                [$style.icon]: true,
                                [$style.isLiveCourse]: item.courseType === 1,
                                [$style.isSingleCourse]: item.courseType === 2,
                                [$style.isSeriesCourse]: item.courseType === 3
                            }"
                        >
                            <img :src="item.coverImg" alt="">
                            <div :class="$style.desc">
                                <div :class="$style.liveTitle">{{ item.name }}</div>
                                <div :class="$style.liveTime">直播时间： {{ item.liveStartTime | dateFormat('YYYY-MM-DD HH:mm') }}</div>
                                <div :class="$style.bottom">
                                    <span :class="$style.free">
                                        赠送
                                        <span :class="$style.price" v-if="item.actuallyPaidAmount" v-text="item.actuallyPaidAmount" />
                                    </span>
                                    <span :class="$style.liveLecturer" v-if="item.lecturerName">
                                        <PlSvg name="icon-office-man-35b25" width="32" height="32" />
                                        {{ item.lecturerName }}
                                    </span>
                                </div>
                                <pl-button
                                    type="primary"
                                    size="middle"
                                    @click.capture="goToWatchLive(item)"
                                >
                                    立即观看
                                </pl-button>
                            </div>
                        </div>
                    </template>
                    <!--有多节赠课时-->
                    <template v-if="courseList.length > 1">
                        <div
                            :class="{
                                [$style.item]: true,
                                [$style.icon]: true,
                                [$style.isLiveCourse]: item.courseType === 1,
                                [$style.isSingleCourse]: item.courseType === 2,
                                [$style.isSeriesCourse]: item.courseType === 3
                            }"
                            v-for="(item, index) of courseList"
                            :key="index"
                            @click.capture="goToWatchLive(item)"
                        >
                            <img :src="item.coverImg" alt="">
                            <div :class="$style.desc">
                                <div :class="$style.liveTitle">{{ item.name }}</div>
                                <div :class="$style.liveTime">
                                    <PlSvg name="icon-time-machine-ff547" width="24" height="24" />
                                    {{ item.liveStartTime | dateFormat('YYYY-MM-DD HH:mm') }}
                                </div>
                                <div :class="$style.liveLecturer" v-if="item.lecturerName">
                                    <PlSvg name="icon-office-man-35b25" width="24" height="24" />
                                    {{ item.lecturerName }}
                                </div>
                                <div :class="$style.bottom">
                                    <span :class="$style.free">
                                        赠送
                                        <span :class="$style.price" v-if="item.actuallyPaidAmount" v-text="item.actuallyPaidAmount" />
                                    </span>
                                    <pl-button
                                        type="primary"
                                        size="middle"
                                    >
                                        立即观看
                                    </pl-button>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div :class="$style.close" @click="close">
                <span>
                    <pl-svg name="icon-close3" fill="#fff" width="40" />
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { getSendLiveList } from '../../apis/online-classroom.js'
export default {
    name: 'SendLive',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        isNotice: {
            type: String,
            default: '0'
        }
    },
    data () {
        return {
            showShelf: false,

            /*
                数据结构
                {
                    name: '线上欢乐营 名师伴我学',
                    coverImg: 'https://mallcdn.youpenglai.com/static/timg.jpg',
                    liveStartTime: '2020.2.12  19:00',
                    liveEndTime: '2020.2.12  19:00',
                    lecturerName: '名师伴我学名师伴我学名师伴我学名师伴我学',
                    paidAmount: 3
                }
             */
            courseList: [],
            courseType: {
                1: '互动直播',
                2: '知识课程',
                3: '系列课'
            },
            isAlreadyNotice: false
        }
    },
    async activated () {
        try {
            await this.getcourseList()
        } catch (e) {
            throw e
        }
    },
    async created () {
        try {
            await this.getcourseList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        async getcourseList () {
            if (this.isNotice === '0' && this.isAlreadyNotice) return
            this.isAlreadyNotice = this.isAlreadyNotice === '0'
            try {
                const { result } = await getSendLiveList(this.isNotice)
                this.courseList = this.addAttr(result)
                this.showShelf = !!this.courseList.length
            } catch (e) {
                throw e
            }
        },
        addAttr (list) {
        // 后台返回的paidAmount单位为分，要转换为元
            list.forEach(item => {
                item.actuallyPaidAmount = Number(Number(item.paidAmount / 100).toFixed(2))
                item.courseType = 1
            })
            return list
        },
        isNotStart (row) {
            return moment(row.liveStartTime).isAfter(moment())
        },
        currentCourseTypeCount (type) {
            return this.courseList.filter(item => item.courseType === type).length
        },
        goToWatchLive (row) {
            if (row.liveCloseTime && moment(row.liveCloseTime).isBefore(moment())) {
                if (row.videoLibId && row.videoLibId !== '0') {
                    this.$router.push({ name: 'LivePlayBack', params: { id: row.videoLibId, activityId: row.id, isValidateEndTime: '0' } })
                } else {
                    this.$error('该视频无法观看')
                }
            } else {
                this.$router.push({ name: 'LiveRoom', params: { id: row.id } })
            }
        },
        close () {
            this.showShelf = false
            this.$emit('update:show', false)
        }
    }
}
</script>

<style module lang='scss'>
    .mask {
      position: fixed;
      z-index: 999;
      left: 0;
      top: 0;
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      background: rgba(0, 0, 0, 0.65);
    }
    .container{
      display: flex;
      margin-top: 40px;
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;
    }
    .main {
      position: relative;
      border-radius:20px;
      width: 620px;
      min-height: 500px;
      padding: 50px 32px 32px;
      background:linear-gradient(180deg,#FF7542 0%,#F96C38 100%);
      .head {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        > img {
          width: 346px;
        }
      }
      .title {
        text-align: center;
        font-size:48px;
        color: #FFF;
        span:nth-child(2){
          display: block;
          margin-top: 12px;
          font-size:28px;
        }
        .count {
          b {
            padding: 6px 0; /*视觉上，垂直方向的padding不起作用，但是可以增加点击区域*/
            font-weight: normal;
            &:first-child:before {
              padding: 0;
            }
            &:before {
              content: '';
              font-size: 0;
              padding: 24px 12px 2px;
              margin-left: 18px;
              border-left: 2px solid rgba(255,255,255, 0.8);
            }
          }
        }
      }
      .list {
        max-height: 760px;
        margin-top: 40px;
        overflow: auto;
        text-align: left;
        .single {
          padding: 0 12px;
          >img {
            width: 100%;
            height: 420px;
            border-radius:20px 20px 0px 0px;
            vertical-align: middle;
            object-fit: cover;
          }
          .desc {
            padding: 20px 36px 32px;
            border-radius:0 0 20px 20px;
            background-color: #FFF;
          }
          .live-title {
            width: 100%;
            font-size:36px;
            color:#222;
            @include elps();
          }
          .live-time{
            margin: 8px 0 24px;
            font-size:26px;
            color:#666;
          }
          .bottom {
            display: flex;
            justify-content: space-between;
          }
          .price {
            margin-left: 10px;
            font-size: 40px;
            color: #FE7700;
            font-weight: bold;
            text-decoration: line-through;
            &:before {
              content: '¥';
              margin-right: 4px;
              font-size: 20px;
              vertical-align: 3px;
            }
          }
          .free {
            font-size: 40px;
            color: #FE7700;
            font-weight: bold;
          }
          .live-lecturer {
            width: 200px;
            font-size:26px;
            color:#222;
            @include elps();
            > svg {
              vertical-align: -4px;
            }
          }
           button {
            width:100%;
            height:100px;
            margin-top: 20px;
            border-radius:10px;
            font-size:36px;
            word-spacing: 2px;
            background:#F2B036;
          }
        }
        .item {
          display: flex;
          margin-bottom: 16px;
          border-radius:20px;
          overflow: hidden;
          background-color: #FFF;
          img {
            width:292px;
            height:194px;
            object-fit: cover;
            vertical-align: middle;
          }
          .desc {
            flex: 1;
            padding: 12px 24px 12px 16px;
            .live-title {
              width: 250px;
              font-size:28px;
              color:#222;
              @include elps();
            }
            .live-time {
              margin: 10px 0 4px;
              font-size:24px;
              color:#666;
              > svg {
                vertical-align: -4px;
              }
            }
            .live-lecturer {
              width: 250px;
              font-size:24px;
              color:#666;
              @include elps();
              > svg {
                vertical-align: -4px;
              }
            }
            .bottom {
              display: flex;
              margin-top: 14px;
              justify-content: space-between;
            }
            .price {
              margin-left: 10px;
              font-size: 28px;
              color: #FE7700;
              text-decoration: line-through;
              &:before {
                content: '¥';
                margin-right: 4px;
                font-size: 20px;
              }
            }
            .free {
              font-size: 28px;
              color: #FE7700;
            }
            button {
              width:140px;
              line-height: 42px;
              border-radius:4px;
              font-size:24px;
              background:#F2B036;
            }
          }
        }
      }
      .is-single-course {
        position: relative;
        &:before {
          content: '单课';
          position: absolute;
          top: 0;
          left: 0;
          width:100px;
          border-radius:20px 0px 20px 0px;
          background-color:#F2B036;
          line-height:42px;
          text-align: center;
          font-size:24px;
          color: #fff;
        }
      }
      .icon {
        position: relative;
        &.is-single-course:before {
          content: '单课';
        }
        &.is-series-course:before {
          content: '系列课';
        }
        &.is-live-course:before {
          content: '直播';
        }
        &:before {
          position: absolute;
          top: 0;
          left: 0;
          width:100px;
          border-radius:20px 0px 20px 0px;
          background-color:#F2B036;
          line-height:42px;
          text-align: center;
          font-size:24px;
          color: #fff;
        }
      }
    }
    .close {
      margin-top: 10px;
      width: 100%;
      > span {
        display: inline-block;
        padding: 0 10px;
      }
    }
</style>
