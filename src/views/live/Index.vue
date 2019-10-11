<template>
  <div :class="$style.liveRoom">
    <div ref="demoPlayer" id="player" :class="$style.playerBox">
      <div :class="$style.myController">
        <div :class="$style.playBtn">
          <pl-icon v-if="paused" name="icon-bofang" size="30" color="#fff" @click="togglePlay" />
          <pl-icon v-else name="icon-paush" size="30" color="#fff" @click="togglePlay" />
        </div>
        <div :class="$style.controllerRight">
          <div :class="$style.lines">
            <span>线路 <i :class="$style.current + 1" v-text="currentLine" /></span>
          </div>
          <div :class="$style.bullet" />
          <div :class="$style.sound">
            <pl-icon v-if="soundValue === 0" name="icon-yinliang-guan" size="30" color="#fff" @click="togglePlay" />
            <pl-icon v-if="soundValue > 50" name="icon-yinliang-gao" size="30" color="#fff" @click="togglePlay" />
            <pl-icon v-if="soundValue > 0 && soundValue <= 50" name="icon-yinliang-di" size="30" color="#fff" @click="togglePlay" />
            <div :class="$style.soundValue">
              <vue-slider v-model="soundValue" height="20vw" direction="btt" />
            </div>
          </div>
          <div :class="$style.fullscreen" />
        </div>
      </div>
    </div>
    <!--<canvas width="750" height="400" ref="canvas" />-->
    <div :class="$style.chatRoom">
      <ul>
        <li>
          <input v-model="message" type="text">
        </li>
        <li>
          <pl-button @click="showBtn">showBtn</pl-button>
        </li>
        <li>
          <pl-button @click="sendBtn">sendBtn</pl-button>
        </li>
        <li>
          <pl-button @click="hideBtn">hideBtn</pl-button>
        </li>
        <li>
          <pl-button @click="sendMessage">发送消息</pl-button>
        </li>
        <li>
          <!--<pl-button @click="play">播放</pl-button>-->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import crypto from 'crypto-js'
import axios from 'axios'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
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
      paused: true,
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
      console.log(val)
      this.liveSdk.player.setVolume(val / 100)
    }
  },
  async mounted () {
    // window.s2j_broadcastBarrageMsg = function(e) {
    //   var str = '[{"msg":"'+ e +'","fontSize":"24","fontColor":"0xCCCC00","fontMode":"roll"}]';
    //   this.player.j2s_addBarrageMessage(str);
    //   this.message = ''
    // };
    this.initPlayerSdk()
    // this.initPlayer()
    // this.initChatRoom()
    // cvs = this.$refs.canvas
    // ctx = cvs.getContext('2d')
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
    initPlayer () {
      // this.player = polyvObject('#player').livePlayer({
      //   width: '498',
      //   height: '409',
      //   uid: 'ea0c93b91e',
      //   vid: '393112',
      //   flashvars: { "is_barrage": "on" },
      //   isBarrage: 'on',
      //   forceH5: true
      // })
      // setTimeout(() => {
      //   video = this.player.video
      // }, 2000)
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
        console.log(data)
      })
      // 监听频道信息并初始化播放器
      liveSdk.on(window.PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, (event, data) => {
        liveSdk.setupPlayer({
          el: '#player',
          type: 'live',
          controller: false, // 是否显示控制栏
          pptNav: false // 是否显示ppt控制控件
        })
        /* 视频数据已加载，可以播放了 */
        liveSdk.player.on("loadedmetadata", e => {
          let video = liveSdk.player.player.video
          let { videoWidth, videoHeight } = video
          if (videoWidth && videoHeight) {
            this.videoWidth = videoWidth
            this.videoHeight = videoHeight
          }
          console.log(liveSdk.player.line)
          this.currentLine = liveSdk.player.line
          this.lines = liveSdk.player.lines
        });
        liveSdk.player.on("lineChanged", line => {
          console.warn(`线路切换为${line}`)
          this.currentLine = line
        });
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
    play () {
      this.playing = true
    },
    pause () {
      this.liveSdk.player.pause()
      this.playing = false
    },
    // runPlay () {
    //   ctx.drawImage(video, 0, 0, 500, 400)
    //   window.requestAnimationFrame(this.play)
    // },
    sendMessage () {
      this.liveSdk.send(this.message)
      this.sendBtn(this.message)
    },
    showBtn () {
      this.player.j2s_showBarrage();
    },
    sendBtn (msg) {
      var str = '[{"msg":"'+ (this.message || msg)+'","fontSize":"24","fontColor":"0xCCCC00","fontMode":"roll"}]';
      this.player.j2s_addBarrageMessage(str);
      this.message = ''
    },
    hideBtn () {
      this.player.j2s_hideBarrage();
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
    width: 100vw !important;
    height: 500px !important;
    overflow: hidden;
    &.full-screen {
      height: 100vw;
      width: 100vh;
    }
    &:hover .my-controller {
      transform: translateY(0);
    }
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
    z-index: 100;
    box-sizing: border-box;
    transition: transform .2s linear;
    /*transform: translateY(100%);*/
    > .play-btn {
      flex: 1;
      > i {
        color: #fff;
      }
    }
    > .controller-right {
      display: inline-flex;
      flex: 1;
      align-items: center;
    }
    .lines {
      margin-right: 10px;
      font-size: 16px;
      color: #fff;
      .current {
        color: $--primary-color;
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
        left: -2px;
        display: none;
        width: 40px;
        height: max-content;
        text-align: center;
        transform: translateY(-100%);
      }
    }
  }

  .chat-room {
  }
  /* 横屏 */
  @media all and (orientation : landscape) {
    background-color: #000;
  }
  /* 竖屏 */
  @media all and (orientation : portrait){
    .live-room {
      background-color: red;
    }
  }
</style>
<style>
  .plv-live-player-big-play-btn {
    display: none !important;
  }
</style>
