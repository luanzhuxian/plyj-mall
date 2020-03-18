<template>
  <!-- 送课窗口提示 -->
  <div @click.stop="" v-show="show || showShelf" :class="$style.mask">
    <div :class="$style.container">
      <div :class="$style.main">
        <div :class="$style.head">
          <img src="https://mallcdn.youpenglai.com/static/mall/2.9.0/send-live.png">
        </div>
        <div :class="$style.title">
          <span>您获得了{{ liveList.length }}堂直播课程</span>
          <span>
            <template v-if="liveList.length === 1">
              <template v-if="isNotStart(liveList[0])">直播还未开始，请在直播开始时进入直播间学习</template>
              <template v-if="isDoing(liveList[0])">直播进行中，可点击查看直播进入直播间学习</template>
              <template v-if="isEnd(liveList[0])">直播已结束，您可看回放进行直播课程学习</template>
            </template>
            <template v-else>
              您可选择正在直播中的直播课程进行学习哦~
            </template>
          </span>
        </div>
        <div :class="$style.list">
          <!--只有一节赠课时-->
          <template v-if="liveList.length === 1">
            <div
              :class="$style.single"
              v-for="(item, index) of liveList"
              :key="index"
            >
              <img :src="item.coverImg" alt="">
              <div :class="$style.desc">
                <div :class="$style.liveTitle">{{ item.name }}</div>
                <div :class="$style.liveTime">直播时间： {{ item.liveStartTime | dateFormat('YYYY-MM-DD HH:mm') }}</div>
                <div :class="$style.bottom">
                  <span :class="$style.price" v-if="item.actuallyPaidAmount" v-text="item.actuallyPaidAmount" />
                  <span :class="$style.free" v-else>免费</span>
                  <span :class="$style.liveLecturer" v-if="item.lecturer">
                    <PlSvg name="icon-office-man-35b25" width="32" height="32" />
                    {{ item.lecturer }}
                  </span>
                </div>
                <pl-button
                  type="primary"
                  size="middle"
                  @click.capture="goToWatchLive(item)"
                >
                  {{ isEnd(item)? '看回放' : '去看直播' }}
                </pl-button>
              </div>
            </div>
          </template>
          <!--有多节赠课时-->
          <template v-if="liveList.length > 1">
            <div
              :class="$style.item"
              v-for="(item, index) of liveList"
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
                <div :class="$style.liveLecturer" v-if="item.lecturer">
                  <PlSvg name="icon-office-man-35b25" width="24" height="24" />
                  {{ item.lecturer }}
                </div>
                <div :class="$style.bottom">
                  <span :class="$style.price" v-if="item.actuallyPaidAmount" v-text="item.actuallyPaidAmount" />
                  <span :class="$style.free" v-else>免费</span>
                  <pl-button
                    type="primary"
                    size="middle"
                  >
                    {{ isEnd(item)? '看回放' : '去看直播' }}
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
    show: Boolean
  },
  data () {
    return {
      showShelf: false,
      liveList: [
        {
          name: '线上欢乐营 名师伴我学',
          coverImg: 'https://mallcdn.youpenglai.com/static/timg.jpg',
          liveStartTime: '2020.2.12  19:00',
          liveEndTime: '2020.2.12  19:00',
          lecturer: '王老师',
          actuallyPaidAmount: 3
        },
        {
          name: '线上欢乐营 名师伴我学 线上欢乐营  线上欢乐营',
          coverImg: 'https://mallcdn.youpenglai.com/static/timg.jpg',
          liveStartTime: '2020.2.12  19:00',
          liveEndTime: '2020.6.12  19:00',
          lecturer: '王老师',
          actuallyPaidAmount: 3
        },
        {
          name: '线上欢乐营 名师伴我学',
          coverImg: 'https://mallcdn.youpenglai.com/static/timg.jpg',
          liveStartTime: '2020.2.12  19:00',
          liveEndTime: '2020.2.12  19:00',
          lecturer: '王老师',
          actuallyPaidAmount: 3
        },
        {
          name: '线上欢乐营 名师伴我学',
          coverImg: 'https://mallcdn.youpenglai.com/static/timg.jpg',
          liveStartTime: '2020.2.12  19:00',
          liveEndTime: '2020.2.12  19:00',
          lecturer: '王老师',
          actuallyPaidAmount: 3
        },
        {
          name: '线上欢乐营 名师伴我学',
          coverImg: 'https://mallcdn.youpenglai.com/static/timg.jpg',
          liveStartTime: '2020.2.12  19:00',
          liveEndTime: '2020.2.12  19:00',
          lecturer: '王老师',
          actuallyPaidAmount: 3
        }
      ]
    }
  },
  async activated () {
    try {
      await this.getLiveList()
    } catch (e) {
      throw e
    }
  },
  methods: {
    async getLiveList () {
      try {
        await getSendLiveList()
        this.showShelf = !!this.liveList.length
      } catch (e) {
        throw e
      }
    },
    isNotStart (row) {
      return moment(row.liveStartTime).isAfter(moment())
    },
    isDoing (row) {
      return moment(row.liveStartTime).isBefore(moment()) && moment(row.liveEndTime).isAfter(moment())
    },
    isEnd (row) {
      return moment(row.liveEndTime).isBefore(moment())
    },
    goToWatchLive (row) {
      if (this.isEnd(row)) {
        this.$router.push({ name: 'LivePlayBack', params: { id: row.videoLibId, activityId: row.id, isValidateEndTime: 0 } })
      } else {
        this.$router.push({ name: 'LiveRoom', params: { liveId: row.id } })
      }
    },
    close () {
      this.showShelf = false
      this.$emit('update:show', false)
    }
  }
}
</script>

<style module lang='scss' scoped>
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
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;
    }
    .main {
      position: relative;
      border-radius:20px;
      width: 620px;
      min-height: 500px;
      padding: 60px 32px 64px;
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
      }
      .list {
        height: 760px;
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
            font-size: 40px;
            color: #FE7700;
            font-weight: bold;
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
            font-size:26px;
            color:#222;
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
          img {
            width:292px;
            height:194px;
            object-fit: cover;
            vertical-align: middle;
          }
          .desc {
            flex: 1;
            padding: 12px 24px 12px 16px;
            background-color: #FFF;
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
              font-size:24px;
              color:#666;
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
              font-size: 28px;
              color: #FE7700;
              &:before {
                content: '¥';
                margin-right: 4px;
                font-size: 20px;
                vertical-align: 3px;
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
    }
    .close {
      margin-top: 48px;
      width: 100%;
      > span {
        display: inline-block;
        padding: 0 10px;
      }
    }
</style>
