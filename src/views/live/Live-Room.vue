<template>
  <div :class="$style.liveRoom">
    <div
      ref="playerBox"
      id="player"
      :class="{
        [$style.playerBox]: true
      }"
    />
    <!-- 聊天 -->
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
          优惠券<i>({{ couponList.length }})</i>
        </div>
        <div
          :class="{
            [$style.tabItem]: true,
            [$style.active]: tab === 3
          }"
          @click="tab = 3"
        >
          商品<i>({{ productList.length }})</i>
        </div>
      </div>

      <div :class="$style.chatWrap" ref="chatRecords">
        <div v-if="tab === 1" :class="$style.chatRecords">
          <template v-for="(item, i) of chatRecords">
            <!-- 一半消息 -->
            <div
              v-if="!item.gift && !item.custom"
              :key="i"
              :class="{
                [$style.messageWrap]: true,
                [$style.selfMessage]: item.self
              }"
            >
              <span :class="$style.userName" v-text="item.name + '：'" />
              <div :class="$style.message">
                <span v-text="item.message" />
                <pl-icon v-if="item.loading" :class="$style.messageLoading" name="icon-btn-loading" color="#999" size="24" font-weight="bolder" @click="repeatSend(item, i)" />
                <span v-if="!item.success && !item.loading" :class="$style.error">
                  <pl-icon name="icon-warning2" color="red" size="24" font-weight="bolder" @click="repeatSend(item, i)" />
                  <i :class="$style.faild" @click="repeatSend(item, i)">发送失败</i>
                </span>
              </div>
            </div>
            <!-- 自定义消息 -->
            <div
              :key="i"
              v-else-if="item.custom"
              :class="{
                [$style.messageWrap]: true,
                [$style.customMessage]: true
              }"
            >
              <span :class="$style.userName" v-text="item.name" />&nbsp;
              <div :class="$style.message">
                <span v-text="item.message" />
                <pl-icon v-if="item.loading" :class="$style.messageLoading" name="icon-btn-loading" color="#999" size="16" font-weight="bolder" @click="repeatSend(item, i)" />
                <span v-if="!item.success && !item.loading" :class="$style.error">
                  <pl-icon name="icon-warning2" color="red" size="24" font-weight="bolder" @click="repeatSend(item, i)" />
                  <i :class="$style.faild" @click="repeatSend(item, i)">发送失败</i>
                </span>
              </div>
            </div>
            <!-- 礼物消息 -->
            <div
              :key="i"
              v-else-if="item.gift"
              :class="{
                [$style.messageWrap]: true,
                [$style.gift]: true
              }"
            >
              <span :class="$style.userName" v-text="item.name" />
              <span>&nbsp;赠送给老师&nbsp;</span>
              <pl-icon v-if="item.giftType === 'flower'" name="icon-meiguihua" type="svg" width="36" height="36" />
            </div>
          </template>
        </div>
        <div v-if="tab === 2" :class="$style.couponList">
          <div :class="$style.tabTitle">
            可用优惠券（{{ couponList.length }}张）
          </div>
          <div>
            <CouponItem
              v-for="(item, i) of couponList"
              :key="i"
              :id="item.couponId"
              :use-end-time="item.useEndTime"
              :use-start-time="item.useStartTime"
              :full="item.limitNum"
              :subtract="item.grantNum"
              :status="item.status"
              :instruction="item.couponName"
              @couponClick="couponClick(item.couponId)"
            />
          </div>
        </div>
        <div v-if="tab === 3" :class="$style.productList">
          <div :class="$style.tabTitle">
            精选商品（{{ productList.length }}件）
          </div>
          <div
            v-for="(item, i) of productList"
            :key="i"
            :class="$style.product"
            @click="$router.push({ name: 'Lesson', params: { productId: item.id, brokerId, userId } })"
          >
            <img :src="item.productMainImage" alt="">
            <div :class="$style.left">
              <div :class="$style.name" v-text="item.productName" />
              <div :class="$style.price" v-text="item.price" />
              <!--<div :class="$style.count">3</div>-->
            </div>
            <div :class="$style.vieFor">
              <pl-icon name="icon-vie-for" color="#fff" size="40" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="tab === 1" :class="$style.sendMessage">
        <form :class="$style.inputBox" @submit.prevent="messageConfirm">
          <!--<pl-icon name="icon-biaoqing" size="42" color="#a8a8a8" @click="showEmoticon = !showEmoticon" />-->
          <input v-model="message" placeholder=" 进来了说点什么呗~" type="text">
          <button :class="$style.sendBtn">发送</button>
        </form>
        <div :class="$style.sendFlower" @click="sendFlower">
          <pl-icon name="icon-flower" size="37" color="#F9DD54" />
        </div>

        <!--<transition name="fade">
          <div v-if="showEmoticon" :class="$style.emoticon">
            <img
              v-for="(item, i) of emoticon"
              :key="i"
              :src="item.url"
              @click="selectEmotion(item.title)"
            >
          </div>
        </transition>-->
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// import crypto from 'crypto-js'
// import axios from 'axios'
// import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
// import { CanvasBarrage } from '../../assets/js/canvasBarrage'
import { mapGetters } from 'vuex'
// import emoticon from '../../../static/json/emoticon'
import CouponItem from '../../components/item/Coupon-Item.vue'
import share from '../../assets/js/wechat/wechat-share'
import {
  sendMessage,
  sendCustomMessage,
  getRoomStatus,
  getActiveCompleteInfo,
  sign
} from '../../apis/live'
import {
  receiveCoupon
} from '../../apis/my-coupon'
import io from 'socket.io-client'
export default {
  name: 'Live',
  components: {
    // VueSlider,
    CouponItem
  },
  data () {
    return {
      showEmoticon: false,
      channelId: '',
      appId: '',
      channeUserId: '',
      tab: 1,
      message: '',
      maxRecords: 400, // 最大缓存的聊天记录条数
      /**
       * 聊天信息记录
       * {
       *   name:, // 用户姓名
       *   message, // 要发送的消息
       *   gift { Boolean }, // 礼物
       *   giftType: { String }, // flower
       *   teacher: { Boolean }, 是否为讲师发送的消息
       *   custom: { Boolean }, 是否为自定义消息
       *   success { Boolean }, 是否发送成功
       *   loading: { Boolean },  是否发送中
       *   self: { Boolean },  是否是自己发送的
       * }
       */
      chatRecords: [],
      couponList: [],
      productList: []

      // emoticon
    }
  },
  computed: {
    ...mapGetters(['userName', 'avatar', 'userId', 'opendId', 'roleCode', 'appId'])
  },
  watch: {
    soundValue (val) {
      this.liveSdk.player.setVolume(val / 100)
    }
  },
  async activated () {
    if (this.roleCode === 'VISITOR') {
      try {
        await this.$confirm({
          message: '为了您的账号安全，请绑定手机号',
          confirmText: '去绑定',
          closeOnClickMask: false
        })
      } catch (e) {

      } finally {
        this.$router.push({ name: 'BindMobile' })
      }

    }
  },
  async mounted () {
    try {
      let data = await getRoomStatus()
      let { roomId, appId, appUserId } = data
      this.channelId = roomId
      this.appId = appId
      this.channeUserId = appUserId
      this.initPlayer()
      this.initSocket()
      this.getDetail()
    } catch (e) {
      this.$error(e.message)
      throw e
    }
  },
  methods: {
    initPlayer () {
      let { channelId, appId, channeUserId } = this
      let player = polyvLivePlayer({
        wrap: "#player",
        width:'100%',
        height:'100%',
        uid:channeUserId,
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
          video.addEventListener("x5videoenterfullscreen", function(e) {
            // console.log('x5videoenterfullscreen')
            // video.style.width = window.screen.width + 'px'
            // video.style.height = window.screen.height + 'px'
          }, false)
          clearInterval(timer)
        }
      }, 500)
    },
    /* 连接聊天服务器 */
    initSocket () {
      let { userName, userId, openId, avatar, channelId } = this
      let socket = io.connect('https://chat.polyv.net', {
        // query: 'token=' + chatToken, // 文档上说，暂时为空
        transports : ['websocket']
      })
      socket.on('connect', function() {
        console.warn('chantroom connect success!')
      })
      socket.on('disconnect', function() {
        console.error('chantroom connect error!')
      })
      socket.on('message' , this.onMessage)
      /* 登录到聊天服务器 */
      socket.emit('message', JSON.stringify({
        EVENT: 'LOGIN',
        values: [userName, avatar, userId || openId], // 登录用户信息，不可为空
        roomId: channelId, // 当前房间号
        type: 'slice' // 用户类型，可为空,teacher（教师）、assistant（助教）、manager（管理员）、slice（云课堂学员）
      }))
      this.socket = socket
    },
    /* 接收消息 */
    onMessage (data) {
      let mData = JSON.parse(data)
      if (mData && mData.EVENT) {
        let user = mData.user
        switch (mData.EVENT) {
          case 'LOGIN':
            this.chatRecords.push({
              message: '进入了直播间',
              name: user.nick,
              custom: true,
              success: true
            })
            break
          case 'SPEAK':
            if (this.userName !== user.nick) {
              let message =  mData.values.join(',')
              // let emo = /\[.+\]/.exec(message)
              // console.log(message)
              // for (let e of emo) {
              //   console.log(e)
              // }
              this.chatRecords.push({
                message,
                name: user.nick,
                success: true
              })
            }
            break
          case 'FLOWERS':
            this.chatRecords.push({
              message: '',
              name: mData.nick,
              gift: true,
              giftType: 'flower',
              success: true
            })
            break
        }
        this.scrollBottom()
      }
    },
    async sendMessage (message) {
      try {
        let { channelId, appId, userId, avatar, userName } = this
        let timestamp = Date.now()
        let result = await sign({
          signMsg: `appId${appId}channelId${channelId}msg${message}nickName${userName}pic${avatar}timestamp${timestamp}`,
          roomId: channelId
        })
        let messageConfig = {
          appId,
          timestamp,
          channelId,
          msg: message,
          pic: avatar,
          nickName: userName,
          sign: result
          // adminIndex
          // actor
          // freeReview
        }
        let data = await sendMessage(messageConfig)
        return data
      } catch (e) {
        throw e
      }
    },
    async messageConfirm () {
      if (!this.message.trim()) {
        return this.$warning('请输入内容')
      }
      let o = {
        name: this.userName,
        message: this.message,
        success: false,
        loading: true,
        self: true
      }
      try {
        this.chatRecords.push(o)
        this.scrollBottom()
        await this.sendMessage(this.message)
        o.success = true
      } catch (e) {
        // 配置发送失败
        o.success = false
      } finally {
        o.loading = false
        this.$set(this.chatRecords, this.chatRecords.length - 1, o)
        if (this.chatRecords.length > this.maxRecords) {
          this.chatRecords.shift()
        }
        this.message = ''
      }
    },
    /* 重新发送 */
    async repeatSend (item, i) {
      try {
        item.loading = true
        this.$set(this.chatRecords, i, item)
        await this.sendMessage(item.message)
        item.success = true
      } catch (e) {
        this.$error(e.message)
        item.success = false
      } finally {
        item.loading = false
        this.$set(this.chatRecords, i, item)
      }
    },
    // 送花
    sendFlower () {
      let { channelId, userName } = this
      this.socket.emit('message', JSON.stringify({
        EVENT: 'FLOWERS',
        roomId: channelId,// 当前房间号
        nick: userName,// 送花人昵称
        uimg: '' // 送花人头像，为新增的属性，可不传
      }))
    },
    // 选择表情
    selectEmotion (name) {
      console.log(name)
    },
    async scrollBottom () {
      let box = this.$refs.chatRecords
      let scrollHeight = box.scrollHeight
      await this.$nextTick()
      box.scrollBy(0, scrollHeight)
    },
    async getDetail () {
      try {
        let data = await getActiveCompleteInfo()
        if (data) {
          this.couponList = data.couponList
          this.productList = data.productList
          share({
            appId: this.appId,
            title: data.name,
            desc: data.liveStartTime + '开始直播，快来围观哦~',
            link: window.location.href,
            imgUrl: data.coverImg + '?x-oss-process=style/thum'
          })
        }
      } catch (e) {

      }
    },
    async couponClick (id) {
      try {
        await receiveCoupon(id)
        this.$success('领取成功')
      } catch (e) {
        throw e
      }
    },
    fullScreen () {
      let isFullScreen = false
      let element = document.documentElement;
      if (!isFullScreen) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        }
        isFullScreen = true
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
        isFullScreen = false
      }
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
      /*object-position: center top;*/
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
      &.self-message {
        direction: rtl;
      }
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
    }
    .user-name {
      width: max-content;
      color: #999;
    }
    .message {
      flex: 1;
      word-break: break-all;
      white-space: pre-line;
      > span {
        &:nth-of-type(1) {
          margin-right: 10px;
        }
      }
      > .error {
        > .faild {
          font-size: 24px;
          color: red;
          opacity: 0.5;
        }
      }
    }
    .message-loading {
      margin: 0 5px;
      animation: rotate 2s linear infinite;
    }
  }
  .send-message {
    position: relative;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background-color: #fff;
  }
  .emoticon {
    position: absolute;
    left: 0;
    display: grid;
    grid-template-columns: repeat(12, 50px);
    justify-content: space-between;
    bottom: 100px;
    width: 100%;
    height: 500px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    z-index: 2002;
    box-shadow: 0 -5px 10px rgba(100, 100, 100, .1);
    > img {
      width: 50px;
      height: 50px;
    }
  }
  .input-box {
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 606px;
    height: 74px;
    padding: 0 140px 0 16px;
    line-height: 74px;
    background-color: #f7f7f7;
    border: 1px solid #EEEEEE;
    border-radius: 8px;
    box-sizing: border-box;
    > input {
      display: inline-block;
      width: 100%;
      margin-left: 16px;
      font-size: 26px;
      line-height: 36px;
      background-color: transparent;
    }
  }

  .send-btn {
    position: absolute;
    top: -1;
    right: 0;
    width: 124px;
    line-height: 76px;
    text-align: center;
    color: #fff;
    font-size: 28px;
    border-bottom-right-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #F2B036;
  }

  .send-flower {
    width: 72px;
    height: 72px;
    line-height: 72px;
    margin-left: 24px;
    text-align: center;
    border-radius: 36px;
    background: linear-gradient(180deg, #ee7f62, #eb5a36);
  }

  .coupon-list {
    padding: 22px 24px 0 24px;
  }
  .product-list {
    padding: 22px 24px 0 24px;
  }
  .tab-title {
    margin-bottom: 32px;
    font-size: 32px;
    line-height: 44px;
  }
  .product {
    position: relative;
    display: flex;
    height: 262px;
    margin-bottom: 20px;
    padding: 16px;
    background-color: #fff;
    border-radius: 20px;
    box-sizing: border-box;
    > .vie-for {
      position: absolute;
      bottom: 20px;
      right: 16px;
      width: 72px;
      height: 72px;
      line-height: 72px;
      text-align: center;
      background-color: #fe7700;
      border-radius: 36px;
    }
    > img {
      width: 314px;
      height: 208px;
      margin-right: 20px;
      object-fit: cover;
      border-radius: 16px;
    }
    > .left {
      display: flex;
      flex-direction: column;
      margin-top: 10px;
      > .name {
        line-height: 38px;
        font-size: 28px;
        @include elps-wrap(2);
      }
      > .price {
        margin-top: 28px;
        font-size: 36px;
        line-height: 50px;
        color: #fe7700;
        font-weight: bold;
      }
      > .count {
        margin-top: 4px;
        font-size: 24px;
        color: #999;
        line-height: 34px;
      }
    }
  }

  @keyframes rotate {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
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
