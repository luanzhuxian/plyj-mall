<template>
  <div :class="$style.liveRoom">
    <div
      ref="playerBox"
      id="player"
      :class="{
        [$style.playerBox]: true
      }"
    />
    <div :class="$style.chatRoom">
      <div :class="$style.tabs">
        <div
          :class="{
            [$style.tabItem]: true,
            [$style.active]: tab === 1
          }"
          @click="tab = 1"
        >
          聊天
        </div>
        <div
          :class="{
            [$style.tabItem]: true,
            [$style.active]: tab === 2
          }"
          @click="tab = 2"
        >
          优惠券<i>(24)</i>
        </div>
        <div
          :class="{
            [$style.tabItem]: true,
            [$style.active]: tab === 3
          }"
          @click="tab = 3"
        >
          商品<i>(24)</i>
        </div>
      </div>

      <div :class="$style.chatWrap" ref="chatRecords">
        <div :class="$style.chatRecords">
          <div
            v-for="(item, i) of chatRecords"
            :key="i"
            :class="{
              [$style.messageWrap]: true,
              [$style.customMessage]: item.type === 1
            }"
          >
            <span :class="$style.userName" v-text="item.name + '：'" />
            <span :class="$style.message" v-text="item.message" />
          </div>
        </div>
      </div>

      <div :class="$style.sendMessage">
        <form :class="$style.inputBox" @submit.prevent="messageConfirm">
          <pl-icon name="icon-biaoqing" size="42" color="#a8a8a8" />
          <input v-model="message" placeholder=" 进来了说点什么呗~" type="text">
        </form>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import crypto from 'crypto-js'
  import axios from 'axios'
  import VueSlider from 'vue-slider-component'
  import 'vue-slider-component/theme/default.css'
  import { CanvasBarrage } from '../../assets/js/canvasBarrage'
  import { mapGetters } from 'vuex'
  import {
    sendMessage,
    sendCustomMessage
  } from '../../apis/live'
  let barrage = null
  export default {
    name: 'Live',
    components: {
      VueSlider
    },
    data () {
      return {
        channelId: '393112',
        appId: 'fgpe9p5979',
        userId: 'ea0c93b91e',
        tab: 1,
        message: '',
        maxRecords: 500, // 最大缓存的聊天记录条数
        chatRecords: [
          {
            message: '9q28375289736',
            name: '客家话1',
            type: 1
          },
          {
            message: 'asdg ',
            name: '客家话2',
            type: 2
          },
          {
            message: 'asdghsdfh打三分和',
            name: '客家话3'
          },
          {
            message: '发达国家而围绕太阳',
            name: '客家话4'
          }
        ]
      }
    },
    computed: {
      ...mapGetters(['userName', 'avatar'])
    },
    watch: {
      soundValue (val) {
        this.liveSdk.player.setVolume(val / 100)
      }
    },
    activated () {
    },
    async mounted () {
      let { channelId, appId, userId } = this
      var player = polyvLivePlayer({
        wrap: "#player",
        width:'100%',
        height:'100%',
        uid:userId,
        isAutoChange:true,
        vid :channelId,
        x5: false,
        hasControl: true,
        x5FullPage: true,
        forceH5: true,
        useH5Page: true
      });
      let timer = setInterval(() => {
        let video = document.querySelector('#player video')
        if (video) {
          // video.setAttribute('x5-video-player-fullscreen', true)
          // video.setAttribute('x5-video-player-type', 'h5-page')
          video.addEventListener("x5videoenterfullscreen", function() {
            video.style.width = window.screen.width + 'px'
            video.style.height = window.screen.height + 'px'
          }, false)
          console.log(video)
          clearInterval(timer)
        }
        console.log(polyvObject('video'))
      }, 500)
    },
    methods: {
      async messageConfirm () {
        let box = this.$refs.chatRecords
        let scrollHeight = box.scrollHeight
        let { channelId, appId, userId, avatar, userName, message } = this
        let timestamp = Date.now()
        let signStr = `4cd6afe4d5d6498a8e92e062eb34af46appId${appId}channelId${channelId}msg${message}nickName${userName}pic${avatar}timestamp${timestamp}4cd6afe4d5d6498a8e92e062eb34af46`
        let sign = crypto.MD5(signStr).toString().toUpperCase()
        let messageConfig = {
          appId,
          timestamp,
          channelId,
          msg: message,
          pic: avatar,
          nickName: userName,
          sign
          // adminIndex
          // actor
          // freeReview
        }
        try {
          let { data } = await sendMessage(messageConfig)
          console.log(data)
        } catch (e) {
          console.log(e)
        }
        if (this.chatRecords.length > this.maxRecords) {
          this.chatRecords.shift()
        }
        this.chatRecords.push({
          name: '客家话',
          message: this.message
        })
        this.message = ''
        box.scrollBy(0, scrollHeight)
      },
      // 自定义消息 ( 屏幕中间 )
      async customMessage (content) {
        let { channelId, appId, userId } = this
        let t = Date.now()
        let signStr = `4cd6afe4d5d6498a8e92e062eb34af46appId${appId}channelId${channelId}timestamp${t}4cd6afe4d5d6498a8e92e062eb34af46`
        let sign = crypto.MD5(signStr).toString().toUpperCase()
        let formData = new FormData()
        formData.append('userId', userId)
        formData.append('appId', appId)
        formData.append('sign', sign)
        formData.append('content', content)
        try {
          let data = await axios.post(`/live/v1/channelSetting/${channelId}/send-chat`, formData)
          console.log(data)
        } catch (e) {
          throw e
        }
      },
      getMessage (data) {
        console.log(data.content)
        barrage.add({
          value: data.content,
          color: '#ff0000',
          time: this.liveSdk.player.currentTime
        })
      },
      initPlayerSdk () {
        let { channelId, appId, userId } = this
        let t = Date.now()
        let signStr = `4cd6afe4d5d6498a8e92e062eb34af46appId${appId}channelId${channelId}timestamp${t}4cd6afe4d5d6498a8e92e062eb34af46`
        let liveSdk = new window.PolyvLiveSdk({
          channelId: channelId,
          sign: crypto.MD5(signStr).toString().toUpperCase(), // 频道验证签名
          timestamp: t, // 毫秒级时间戳
          appId: appId, // polyv 后台的appId
          user: {
            userId,
            userName: 'polyv-test',
            pic: '//livestatic.videocc.net/assets/wimages/missing_face.png'
          },
          chat: true
        })
        /* 接收聊天消息 */
        liveSdk.on(PolyvLiveSdk.EVENTS.SPEAK, (e, data) => {
          this.getMessage(data)
        })
        // 监听频道信息并初始化播放器
        liveSdk.on(window.PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, (event, data) => {
          liveSdk.setupPlayer({
            el: '#player',
            type: 'auto'
          })

          /* 视频数据已加载，可以播放了 */
          liveSdk.player.on("loadedmetadata", async e => {
            let video = liveSdk.player.player.video
            let p = video.parentNode
            let newVideo = video.cloneNode(true)
            console.log(video.videoTracks)
            // p.removeChild(video)
            // p.appendChild(newVideo)
            liveSdk.player.player.video = newVideo
            video = liveSdk.player.player.video
            // console.log(video)
            // let videoStmp = video.cloneNode(true)
            // videoStmp.controls = true
            // document.body.appendChild(video)
            // video.style.display = 'none'
            setInterval(() => {
              console.log(1)
              video.setAttribute('x5-video-player-fullscreen', true)
              video.setAttribute('x5-video-player-type', 'h5-page')
            }, 2000)
            // video.setAttribute('controls', '')
            // video.setAttribute('preload', '')
            // video.setAttribute('loop', 'loop')
            video.setAttribute('x5-playsinline', '')
            // video.setAttribute('webkit-playsinline', '')
            let { videoWidth, videoHeight } = video
            if (videoWidth && videoHeight) {
              this.videoWidth = videoWidth
              this.videoHeight = videoHeight
            }
            console.log(video.src)
            this.src = video.src
            this.currentLine = liveSdk.player.line
            this.lines = liveSdk.player.lines
          });
          /* 监听线路改变 */
          liveSdk.player.on("lineChanged", line => {
            this.currentLine = line
            this.showLineList = false
          });
          liveSdk.player.on('playing', () => {
            this.isPlaying = true
          })
          liveSdk.player.on('pause',  () => {
            this.isPlaying = false
          })
          liveSdk.player.on('ended',  () => {
            this.isPlaying = false
          })
          /* 初始化弹幕 */
          barrage = new CanvasBarrage(this.$refs.buttle, liveSdk.player)
        })
        // 频道信息获取完成 data为频道信息
        liveSdk.on(window.PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, function () {
        })
        // 监听流状态变化刷新播放器
        liveSdk.on(window.PolyvLiveSdk.EVENTS.STREAM_UPDATE, function () {
          liveSdk.reloadPlayer()
        })
        this.liveSdk = liveSdk
      }
    }
  }
</script>

<style module lang="scss">
  .live-room {
    height: 100vh;
  }
  .player-box {
    position: relative;
    height: 442px !important;
    video {
      object-position: center top;
    }
  }
  .chat-room {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 442px) !important;
  }
  .tabs {
    display: flex;
    align-items: center;
    padding: 0 48px;
    font-size: 26px;
    background-color: #fff;
    > .tab-item {
      position: relative;
      margin-right: 70px;
      line-height: 68px;
      > i {
        font-size: 22px;
        color: #F2B036;
      }
      &:nth-last-of-type(1) {
        margin-right: 0;
      }
      &.active {
        &:after {
          position: absolute;
          left: 0;
          bottom: 0;
          content: '';
          width: 100%;
          height: 6px;
          background-color: #F2B036;
          border-radius: 3px;
        }
      }
    }
  }
  .chat-wrap {
    flex: 1;
    overflow: auto;
  }
  .chat-records {
    display: flex;
    min-height: 100%;
    flex-direction: column;
    justify-content: flex-end;
    padding: 12px 16px;
    box-sizing: border-box;
    > .message-wrap {
      display: flex;
      margin-top: 30px;
      line-height: 36px;
      font-size: 26px;
      &.custom-message {
        padding: 0 8px;
        line-height: 48px;
        background-color: #FCE6B7;
        border-radius: 4px;
        > .user-name {
          color: #896437;
        }
        > .message {
          color: #FE7700;
        }
      }
      > .user-name {
        width: max-content;
        color: #999;
        font-weight: bold;
      }
      > .message {
        flex: 1;
        word-break: break-all;
        white-space: pre-line;
      }
    }
  }
  .send-message {
    padding: 12px 16px;
    background-color: #fff;
  }
  .input-box {
    display: inline-flex;
    align-items: center;
    width: 606px;
    height: 74px;
    padding: 0 16px;
    line-height: 74px;
    background-color: #f7f7f7;
    border: 1px solid #EEEEEE;
    border-radius: 8px;
    box-sizing: border-box;
    > input {
      display: inline-block;
      margin-left: 16px;
      font-size: 26px;
      line-height: 36px;
      background-color: transparent;
    }
  }
</style>
<style lang="scss">
  .plv-live-player-bar {
    height: 80px!important;
  }
  .plv_controls {
    height: max-content !important;
    padding: 20px;
    box-sizing: border-box !important;
    span:not([display=none]) {
      display: inline-block;
      min-width: 40px !important;
      height: 40px !important;
      line-height: 40px !important;
      font-size: 20px !important;
    }
  }
  .plv-line-select-mask > span {
    width: 180px !important;
    height: 60px !important;
    line-height: 60px !important;
    font-size: 20px !important;
    border-radius: 30px !important;
  }
</style>
