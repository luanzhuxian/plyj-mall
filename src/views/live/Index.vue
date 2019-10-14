<template>
  <div :class="$style.liveRoom">
    <div
      :class="{
        [$style.playerWrap]: true,
        [$style.fullscreen]: isFullscreen,
        [$style.isPlaying]: isPlaying
      }"
    >
      <!--<div v-show="true" :class="$style.myController">
        <div :class="$style.playBtn">
          <pl-icon v-if="paused" name="icon-bofang" size="30" color="#fff" @click="togglePlay" />
          <pl-icon v-else name="icon-paush" size="30" color="#fff" @click="togglePlay" />
        </div>
        <div :class="$style.controllerRight">
          <div :class="$style.lines">
            <span @click="showLineList = !showLineList">线路 <i :class="$style.current" v-text="currentLine + 1" /></span>
            <transition name="fade">
              <ul v-show="showLineList" :class="$style.linesList">
                <li v-for="i of lines" :key="i" @click="selectLine(i - 1)">
                  <span>线路 <i :class="$style.current" v-text="i" /></span>
                </li>
              </ul>
            </transition>
          </div>
          <div :class="$style.sound">
            <pl-icon v-show="soundValue === 0" name="icon-yinliang-guan" size="30" color="#fff" />
            <pl-icon v-show="soundValue > 50" name="icon-yinliang-gao" size="30" color="#fff" />
            <pl-icon v-show="soundValue > 0 && soundValue <= 50" name="icon-yinliang-di" size="30" color="#fff" />
            <div :class="$style.soundValue">
              <vue-slider v-model="soundValue" dot-size="40" height="20vw" width="1vw" direction="btt" />
            </div>
          </div>
          <label
            :class="{
              [$style.plSwitch]: true,
              [$style.on]: showBarrage
            }"
          >
            <input
              type="checkbox"
              v-show="false"
              v-model="showBarrage"
            >
            <span
              :class="{
                [$style.plSwitchInner]: true,
                [$style.plSwitchOn]: showBarrage,
                [$style.plSwitchOff]: !showBarrage
              }"
            >
              弹
            </span>
          </label>
          <div :class="$style.fullscreen" @click="fullscreen">
            <pl-icon name="icon-quanpingxianshi" size="25" color="#fff" />
            <pl-icon name="icon-icon-quanpingsuoxiao" size="25" color="#fff" />
          </div>
        </div>
      </div>-->
      <!--<div v-show="isFullscreen" :class="{
        [$style.myController]: true,
        [$style.myControllerFullscreen]: true
      }"
      >
        <div :class="$style.playBtn">
          <pl-icon v-if="paused" name="icon-bofang" size="30" color="#fff" @click="togglePlay" />
          <pl-icon v-else name="icon-paush" size="30" color="#fff" @click="togglePlay" />
        </div>
        <div :class="$style.controllerRight">
          <div :class="$style.lines">
            <span @click="showLineList = !showLineList">线路 <i :class="$style.current" v-text="currentLine + 1" /></span>
            <transition name="fade">
              <ul v-show="showLineList" :class="$style.linesList">
                <li v-for="i of lines" :key="i" @click="selectLine(i - 1)">
                  <span>线路 <i :class="$style.current" v-text="i" /></span>
                </li>
              </ul>
            </transition>
          </div>
          <div :class="$style.sound">
            <pl-icon v-show="soundValue === 0" name="icon-yinliang-guan" size="30" color="#fff" />
            <pl-icon v-show="soundValue > 50" name="icon-yinliang-gao" size="30" color="#fff" />
            <pl-icon v-show="soundValue > 0 && soundValue <= 50" name="icon-yinliang-di" size="30" color="#fff" />
            <div :class="$style.soundValue">
              <vue-slider v-model="soundValue" dot-size="40" height="20vw" width="1vw" direction="btt" />
            </div>
          </div>
          <label
            :class="{
              [$style.plSwitch]: true,
              [$style.on]: showBarrage
            }"
          >
            <input
              type="checkbox"
              v-show="false"
              v-model="showBarrage"
            >
            <span
              :class="{
                [$style.plSwitchInner]: true,
                [$style.plSwitchOn]: showBarrage,
                [$style.plSwitchOff]: !showBarrage
              }"
            >
              弹
            </span>
          </label>
          <div :class="$style.fullscreen" @click="fullscreen">
            <pl-icon name="icon-quanpingxianshi" size="25" color="#fff" />
            <pl-icon name="icon-icon-quanpingsuoxiao" size="25" color="#fff" />
          </div>
        </div>
      </div>-->
      <!-- 用于播放视频和弹幕 -->
      <canvas ref="buttle" :class="$style.buttleCanvas" :width="videoWidth" :height="videoHeight" />
      <div
        ref="playerBox"
        id="player"
        :class="{
          [$style.playerBox]: true
        }"
      />
    </div>
    <!--<div id="player" v-show="false" />-->
    <!--<div id="player" />-->
    <div :class="$style.chatRoom">
      <ul>
        <li>
          <input v-model="message" type="text">
        </li>
        <!--<li>
          <pl-button @click="showBtn">showBtn</pl-button>
        </li>
        <li>
          <pl-button @click="sendBtn">sendBtn</pl-button>
        </li>
        <li>
          <pl-button @click="hideBtn">hideBtn</pl-button>
        </li>-->
        <li>
          <pl-button @click="sendMessage">发送消息</pl-button>
        </li>
        <li>
          <!--<pl-button @click="play">播放</pl-button>-->
        </li>
      </ul>
    </div>
    <div style="position: relative;">
      <video ref="video" controls preload width="600" height="300" x5-video-player-type="h5-page" src="http://cdn.tencent.neigou.com/Public/Home/mobileAsset/images/tencent2018/video5.mp4" />
      <!--<video ref="video" controls preload width="600" height="300" x5-video-player-type="h5-page" />-->
      <div style="position: absolute; top: 0; font-size: 10vw; color: #fff;">覆盖video</div>
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
let barrage = null
// let video = null
// let cvs = null
// let ctx = null
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
      message: '',
      videoWidth: 0,
      videoHeight: 0,
      src: '',
      paused: true,
      showLineList: false,
      showBarrage: true,
      isFullscreen: false,
      isPlaying: false,
      soundValue: 0,
      lines: 1, // 线路数量
      currentLine: 0 // 当前线路
    }
  },
  computed: {
    // cvs () {
    //   return this.$refs.canvas
    // },
    // ctx () {
    //   return this.cvs.getContext('2d')
    // }
  },
  watch: {
    soundValue (val) {
      this.liveSdk.player.setVolume(val / 100)
    }
  },
  activated () {
    // setTimeout(() => {
    //   confirm('领红包！')
    //   this.$confirm('领红包！')
    // }, 8000)
  },
  async mounted () {
    this.initPlayerSdk()
  },
  methods: {
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
          type: 'live'
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
          // setInterval(() => {
          //   console.log(1)
          //   video.setAttribute('x5-video-player-type', 'h5-page')
          // }, 2000)
          // video.setAttribute('controls', '')
          // video.setAttribute('preload', '')
          // video.setAttribute('loop', 'loop')
          // video.setAttribute('x5-video-player-fullscreen', true)
          // video.setAttribute('x5-playsinline', '')
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
    },
    togglePlay () {
      let player = this.liveSdk.player
      player.togglePlay()
      this.paused = player.paused
    },
    // 选择线路
    selectLine (line) {
      this.liveSdk.player.switchLine(line)
    },
    sendMessage () {
      this.liveSdk.send(this.message)
      barrage.add({
        value: this.message,
        time: this.liveSdk.player.currentTime
      })
    },
    fullscreen () {
      console.dir(this.$refs.playerBox)
      this.isFullscreen = !this.isFullscreen
      let element = document.documentElement;
      if (!this.isFullScreen) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        }
        this.isFullScreen = true
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        this.isFullScreen = false
      }
    }
  }
}
</script>

<style module lang="scss">
  .live-room {
    height: 100vh;
  }
  .player-wrap {
    position: relative;
    width: 100vw !important;
    height: calc(100vw * 3 / 4) !important;
    &.fullscreen {
      position: fixed;
      z-index: 9998;
    }
    &:hover .my-controller {
      transform: translateY(0);
    }
    &.isPlaying {
      > .player-box {
        z-index: -1;
      }
    }
  }
  .player-box {
    position: relative;
    width: 100vw !important;
    height: calc(100vw * 3 / 4) !important;
    overflow: hidden;
  }
  .buttle-canvas {
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    z-index: 1;
  }
  .my-controller {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 0 20px;
    background-color: rgba(0, 0, 0, .7);
    z-index: 100 !important;
    box-sizing: border-box;
    transition: transform .2s linear;
    /*transform: translateY(100%);*/
    > .play-btn {
      flex: 1;
      > i {
        color: #fff;
      }
    }
    &.my-controller-fullscreen {
      flex-direction: column;
      height: 100vh;
      width: 50px;
      padding: 20px 0;
      transform: rotate(90deg);
    }
    > .controller-right {
      display: inline-flex;
      align-items: center;
    }
    .lines {
      position: relative;
      margin-right: 10px;
      font-size: 16px;
      color: #fff;
      .current {
        color: $--primary-color;
      }
    }
    .lines-list {
      position: absolute;
      bottom: 25px;
      left: 50%;
      width: max-content;
      color: #fff;
      background-color: rgba(0, 0, 0, .3);
      border-radius: 3px;
      transform: translate(-50%);
      box-shadow: 3px 3px 5px rgba(50, 50, 50, .2);
      > li {
        padding: 0 12px;
        line-height: 30px;
        border-bottom: 1px solid #e7e7e7;
        &:nth-last-of-type(1) {
          border-bottom: none;
        }
      }
    }
    .sound {
      position: relative;
      width: max-content;
      text-align: center;
      &:hover {
        > .sound-value {
          display: inline-flex;
          justify-content: center;
        }
      }
      > .sound-value {
        position: absolute;
        top: 0;
        left: 50%;
        display: none;
        width: 40px;
        height: max-content;
        text-align: center;
        transform: translate(-50%, -100%);
      }
    }
    .fullscreen {
      margin-left: 10px;
    }
  }

  .chat-room {
  }
  /* 横屏 */
  @media all and (orientation : landscape) {
    background-color: #000;
    .player-wrap {
      &.fullscreen {
        width: 100vw !important;
        height: 100vh !important;
        > .player-box {
          /*position: absolute;*/
          width: 100vw !important;
          height: 100vh !important;
        }
      }
    }
  }
  /* 竖屏 */
  @media all and (orientation : portrait){
    .player-wrap {
      &.fullscreen {
        /* 锁定方向情况下竖屏 */
        width: 100vw !important;
        height: 100vh !important;
        background-color: red;
        > .player-box {
          /*position: absolute;*/
          width: 100vh !important;
          height: 100vw !important;
          /*top: 0;*/
          transform-origin: 0 0;
          transform: translate(100vw, 0vw) rotate(90deg);
        }
      }
    }
    /*.player-box {
      &.fullscreen {
        !* 竖屏下的全屏 (针对部分手机锁定方向的情况) *!
        height: 100vw !important;
        width: 100vh !important;
        transform: rotate(90deg);
        transform-origin: 50% 50%;
      }
    }*/
  }

  .pl-switch {
    position: relative;
    width: 40px;
    height: 26px;
    margin-left: 10px;
    background-color: #757575;
    border-radius: 13px;
    transition: background-color .2s ease-in-out;
    &.on {
      background-color: $--primary-color;
    }
    .pl-switch-inner {
      position: absolute;
      top: 50%;
      left: 3px;
      transform: translateY(-50%);
      display: inline-block;
      font-size: 10px;
      width: 20px;
      line-height: 20px;
      text-align: center;
      background-color: #fff;
      border-radius: 10px;
      transition: left .2s ease-in-out, color .2s ease-in-out;
    }
    .pl-switch-on {
      left: 17px;
      color: $--primary-color;

    }
    .pl-switch-off {
      color: #757575;
    }
  }
</style>
<style>
  .plv-live-player-big-play-btn {
    display: none !important;
  }
</style>
