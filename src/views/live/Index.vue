<template>
  <div :class="$style.liveRoom">
    <div ref="demoPlayer" id="player" :class="$style.playerBox" />
    <canvas width="400" height="500" ref="canvas" />
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
          <pl-button @click="play">播放</pl-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import crypto from 'crypto-js'
import axios from 'axios'
let video = null
let cvs = null
let ctx = null
export default {
  name: 'Live',
  data () {
    return {
      channelId: '393112',
      appId: 'fgpe9p5979',
      userId: 'ea0c93b91e',
      message: ''
    }
  },
  computed: {
    cvs () {
      return this.$refs.canvas
    },
    ctx () {
      return this.cvs.getContext('2d')
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
    cvs = this.$refs.canvas
    ctx = cvs.getContext('2d')
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
          // pptEl: '#ppt',
          el: '#player',
          type: 'auto',
          controller: false
        })
        setTimeout(() => {
          video = liveSdk.player.player.video
        }, 2000)
      })
      // 监听流状态变化刷新播放器
      liveSdk.on(window.PolyvLiveSdk.EVENTS.STREAM_UPDATE, function () {
        liveSdk.reloadPlayer()
      })
      this.liveSdk = liveSdk
    },
    play () {
      ctx.drawImage(video, 0, 0)
      window.requestAnimationFrame(this.play)
    },
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
    display: none;
    height: 500px !important;
  }
  .chat-room {
  }
</style>
