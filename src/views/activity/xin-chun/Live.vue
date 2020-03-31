<template>
    <div class="live" :class="$style.live" @click="toLivePage">
        <div :class="$style.cover">
            <span :class="$style.status" v-if="isNoticeShow">距开始</span>
            <span :class="$style.status" v-if="live.statue === 4">正在直播</span>
            <!-- <span :class="$style.status" v-if="live.statue === 0">已结束</span> -->
            <count-down
                v-if="isNoticeShow"
                :timestamp="ts"
                size="medium"
                color="#FF4B00"
                background="#FFF"
                @done="done"
            />
            <span v-if="live.statue === 4">
                {{ `${live.visitTimes}人观看` }}
            </span>
        </div>
        <div :class="$style.imgWrapper">
            <img :src="(isNoticeShow ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-small'">
            <pl-svg name="icon-play" width="100" />
            <div :class="$style.info">
                <div :class="$style.status">
                    <span v-if="isNoticeShow">预告</span>
                    <span v-if="live.statue === 4">直播中</span>
                </div>
                <span :class="$style.name" v-text="live.name" />
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import CountDown from '../components/Count-Down.vue'

export default {
    name: 'Live',
    components: {
        CountDown
    },
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
        live () {
            return this.data.liveModel || {}
        },
        isNoticeShow () {
            return this.live.statue === 2 && this.live.hasNotice
        },
        ts () {
            const { liveStartTime, hasNotice, statue } = this.live
            let ts
            if (statue === 2 && hasNotice && liveStartTime) {
                ts = moment(liveStartTime).valueOf()
            }
            return ts
        }
    },
    methods: {
        done () {
            if (this.live.statue === 2) {
                this.live.statue = 4
            } else if (this.live.statue === 4) {
                this.live.statue = 0
            }
        },
        toLivePage () {
            // 直播已结束
            if (this.live.statue === 0) {
                if (!this.live.videoLibId) {
                    // 没有往期回放
                    this.$router.push({ name: 'InteractiveLive' })
                } else {
                    this.$router.push({
                        name: 'LivePlayBack',
                        params: {
                            id: this.live.videoLibId,
                            activityId: this.live.id,
                            isValidateEndTime: '0'
                        }
                    })
                }
            } else {
                this.$router.push({ name: 'LiveRoom', params: { id: this.live.id } })
            }
        }
    }
}
</script>

<style lang="scss" module>
  .live {
    position: relative;
    padding: 20px;
    background: #FFF;
    box-shadow: 0px 16px 24px rgba(121, 30, 5, 0.2);
    border-radius: 20px;
    .cover {
      display: flex;
      justify-content: center;
      align-items: center;
      background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/f48d1f18-3399-42d9-8d5c-c92534eb536d.png") no-repeat center;
      background-size: 100%;
      position: absolute;
      top: -22px;
      left: 50%;
      transform: translateX(-50%);
      width: 525px;
      height: 86px;
      color: #FFF;
      font-size: 28px;
      z-index: 1;
      .status {
        margin-right: 10px;
        font-size: 32px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 34px;
      }
    }
    .img-wrapper {
      position: relative;
      height: 458px;
      border-radius: 20px;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      padding-left: 20px;
      height: 80px;
      line-height: 80px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
      font-size: 28px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #FFFFFF;
      .status {
        margin-right: 12px;
        padding: 0 16px;
        height: 48px;
        background: #FFFFFF;
        border-radius: 10px;
        font-size: 24px;
        line-height: 48px;
        color: #FF6739;
        text-align: center;
      }
      .name {
        flex: 1;
        width: 0;
        @include elps();
      }
    }
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 64px;
    }
  }
</style>
<style lang="scss" scoped>
.live {
  /deep/ .count-down > .time > span {
    padding: 0 8px;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 48px;
    color: #FFF;
  }
}
</style>
