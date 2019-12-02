<template>
  <div :class="$style.liveRoom" ref="liveRoom">
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
        <div>
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
        <pl-button @click="share" type="warning" size="mini">分享海报</pl-button>
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
            <template v-for="(item, i) of couponList">
              <CouponItem
                :key="i"
                :id="item.couponId"
                :use-end-time="item.useEndTime"
                :use-start-time="item.useStartTime"
                :full="item.useLimitAmount"
                :subtract="item.amount"
                :amount="item.amount"
                :instruction="item.couponName"
                :coupon-type="item.couponType"
                :is-over-max="!item.canReceive"
                @couponClick="couponClick(item.couponId)"
                v-if="item.show"
              />
            </template>
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
            @click="$router.push({ name: 'Lesson', params: { productId: item.id } })"
          >
            <img :src="item.productMainImage" alt="">
            <div :class="$style.left">
              <div :class="$style.name" v-text="item.productName" />
              <div :class="$style.price">
                ￥{{ item.price }}元
              </div>
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
          <input
            v-model="message"
            placeholder=" 进来了说点什么呗~"
            type="text"
            @blur="messageBoxBlur"
          >
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

    <!-- 支付弹框 -->
    <transition name="fade">
      <div :class="$style.payWrap" v-if="needPay">
        <div :class="$style.payBox">
          <div :class="$style.boxTop">
            <img :src="detail.coverImg + '?x-oss-process=style/thum-middle'" alt="">
            <div :class="$style.topRight">
              <div :class="$style.title" v-text="detail.name" />
              <div :class="$style.time" v-text=" detail.liveStartTime" />
              <div :class="$style.price" v-text="detail.paidAmount" />
              <div :class="$style.liveTip">
                <p>该直播为付费项目，不支持退换，</p>
                <p>付费即可观看；一场计费一次，任何时间可观看</p>
              </div>
            </div>
          </div>
          <div :class="$style.truthPrice">
            <span>实付金额：</span>
            <i v-text="detail.paidAmount" />
          </div>
          <div :class="$style.buttons">
            <pl-button size="middle" plain @click="cancelPay">我再想想</pl-button>
            <pl-button size="middle" type="warning" @click="submitOrder">立即付款</pl-button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div :class="$style.poster" v-if="showPoster">
        <div :class="$style.posterWrap">
          <img :src="poster" alt="">
          <div>长按识别或保存二维码，分享给朋友吧！</div>
          <pl-icon name="icon-close1" size="48" color="#fff" @click="showPoster = false" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import CouponItem from '../../components/item/Coupon-Item.vue'
import share from '../../assets/js/wechat/wechat-share'
import {
  getRoomStatus,
  getActiveCompleteInfo,
  pay,
  hasPied,
  cancelOrder,
  setComeInConut
} from '../../apis/live'
import {
  receiveCouponForLive
} from '../../apis/my-coupon'
import io from 'socket.io-client'
import moment from 'moment'
import wechatPay from '../../assets/js/wechat/wechat-pay'
import {
  generateQrcode,
  cutArcImage,
  loadImage,
  createText
} from '../../assets/js/util'
import { getCurrentTemplate } from '../../apis/home'
const POSTER_BG = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/live/live-poster.png'
export default {
  name: 'LiveRoom',
  components: {
    // VueSlider,
    CouponItem
  },
  data () {
    return {
      showEmoticon: false,
      needPay: false,
      showPoster: false,
      poster: '',
      channelId: '',
      liveAppId: '',
      channeUserId: '',
      tab: 1,
      message: '',
      liveStartTime: Date.now(),
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
      productList: [],
      detail: {}

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
  async created () {
    if (this.roleCode === 'VISITOR') {
      await this.$confirm({
        message: '为了您的账号安全，请绑定手机号',
        confirmText: '去绑定',
        closeOnClickMask: false
      })
        .finally(() => {
          let { name, params, query } = this.$route
          sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({ name, query, params }))
          this.$router.push({ name: 'BindMobile' })
        })
      return
    }
    let reqs = [getRoomStatus(), this.getDetail()]
    try {
      let res = await Promise.all(reqs)
      let data = res[0]
      let detail = res[1]
      let { roomId, appId, appUserId } = data
      this.channelId = roomId
      this.liveAppId = appId
      this.channeUserId = appUserId
      // 是否需要支付
      if (detail.isPay) {
        let needPay = await hasPied(detail.id)
        if (!needPay) {
          // 还没支付
          this.needPay = true
          return
        }
        await setComeInConut({
          message: (detail.paidAmount || 0) + '元'
        })
      }
      this.initPlayer()
      this.initSocket()
    } catch (e) {
      this.$error(e.message)
      throw e
    }
  },
  methods: {
    async initPlayer () {
      let { channelId, channeUserId } = this
      let p = polyvObject('#player').livePlayer({
        wrap: '#player',
        width: '100%',
        height: '100%',
        autoplay: true,
        uid: channeUserId,
        isAutoChange: true,
        vid: channelId,
        x5: false,
        hasControl: true,
        x5FullPage: true,
        forceH5: true,
        useH5Page: true
      })
      // let timer = setInterval(() => {
      //   let video = document.querySelector('#player video')
      //   if (video) {
      //     // video.setAttribute('x5-video-player-fullscreen', true)
      //     // video.setAttribute('x5-video-player-type', 'h5-page')
      //     video.addEventListener('x5videoenterfullscreen', function (e) {
      //       // console.log('x5videoenterfullscreen')
      //       // video.style.width = window.screen.width + 'px'
      //       // video.style.height = window.screen.height + 'px'
      //     }, false)
      //     clearInterval(timer)
      //   }
      // }, 500)
    },
    /* 连接聊天服务器 */
    initSocket () {
      if (this.socket) return
      let { userName, userId, openId, avatar, channelId } = this
      let socket = io.connect('https://chat.polyv.net', {
        // query: 'token=' + chatToken, // 文档上说，暂时为空
        transports: ['websocket']
      })
      socket.on('connect', function () {
        console.warn('chantroom connect success!')
      })
      socket.on('disconnect', function (e) {
        console.error(e)
        console.error('chantroom connect error!')
      })
      socket.on('message', this.onMessage)
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
              let message = mData.values.join(',')
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
    /* 聊天发送消息 */
    async sendMessage (message) {
      try {
        let { channelId } = this
        this.socket.emit('message', JSON.stringify({
          EVENT: 'SPEAK',
          values: [message], // 发言内容
          roomId: channelId
        }))
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
        roomId: channelId, // 当前房间号
        nick: userName, // 送花人昵称
        uimg: '' // 送花人头像，为新增的属性，可不传
      }))
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
          this.liveStartTime = moment(data.liveStartTime).valueOf()
          share({
            appId: this.appId,
            title: data.name,
            desc: data.liveStartTime + ' 开始直播，快来围观哦~',
            link: window.location.href,
            imgUrl: data.coverImg
          })
          data.couponList = data.couponList || []
          for (let coupon of data.couponList) {
            coupon.show = false
          }
          if (data.couponList.length) {
            let timer = setInterval(() => {
              // 如果已经全部都显示了，停止定时器
              if (!data.couponList.some(item => !item.show)) {
                clearInterval(timer)
              }
              for (let coupon of data.couponList) {
                if (coupon.show) {
                  continue
                }
                coupon.show = this.canShowCoupon(coupon.afterMinuteShow)
              }
              this.couponList = data.couponList.filter(item => item.show)
            }, 2000)
          }

          this.productList = data.productList || []
          this.activeId = data.id
          this.detail = data
          return data
        }
      } catch (e) {
        throw e
      }
    },
    async couponClick (id) {
      try {
        await receiveCouponForLive({
          couponId: id,
          activityId: this.activeId,
          entityClassName: 'MallLiveActivityEntity'
        })
        this.$success('领取成功')
      } catch (e) {
        throw e
      }
    },
    // 判断优惠券是否到了显示时间
    canShowCoupon (afterMinuteShow) {
      let ms = afterMinuteShow * 60 * 1000
      let startTime = this.liveStartTime
      return Date.now() - startTime >= ms
    },
    messageBoxBlur (e) {
      window.scrollTo(0, 0)
    },
    /**
     * 提交订单
     */
    async submitOrder () {
      try {
        let res = await pay(this.detail.id)
        await this.pay(res)
      } catch (e) {
        throw e
      }
    },
    cancelPay () {
      getCurrentTemplate({ type: 2 })
        .then(res => {
          if (res) {
            this.$router.push({ name: 'Activity' })
          } else {
            this.$router.push({ name: 'Home' })
          }
        })
        .catch(() => {
          this.$router.push({ name: 'Home' })
        })
    },
    async share () {
      if (this.poster) {
        this.showPoster = true
        return
      }
      let {
        coverImg,
        name,
        liveStartTime,
        isPay,
        paidAmount
      } = this.detail
      // 生成二维码
      try {
        let all = [
          generateQrcode(300, location.href, 0, null, 0, 'canvas'),
          loadImage(POSTER_BG),
          loadImage(this.avatar),
          loadImage(coverImg)
        ]
        let res = await Promise.all(all)
        let qrcode = res[0]
        let bg = res[1]
        let avatar = res[2]
        let coverImgEl = res[3]
        let canvas = document.createElement('canvas')
        canvas.width = bg.width
        canvas.height = bg.height
        let ctx = canvas.getContext('2d')
        // 绘制背景
        ctx.drawImage(bg, 0, 0)
        // 绘制二维码
        ctx.drawImage(qrcode, 22, 544, 148, 148)
        // 绘制头像
        avatar = cutArcImage(avatar)
        ctx.drawImage(avatar, 20, 12, 64, 64)
        // 绘制姓名
        ctx.font = 'bold 28px Microsoft YaHei UI'
        ctx.fillStyle = '#fff'
        ctx.textBaseline = 'hanging'
        let nameWidth = createText(ctx, 100, 28, this.userName, 34, 350, 1)
        createText(ctx, 100 + nameWidth + 14, 28, '邀您观看直播', 34, 350, 1)
        // 绘制封面
        ctx.drawImage(coverImgEl, 14, 102, 610, 406)
        // 绘制直播名称
        ctx.font = 'bold 32px Microsoft YaHei UI'
        createText(ctx, 200, 534, name, 44, 400, 1)
        // 绘制直播时间
        ctx.font = '24px Microsoft YaHei UI'
        let date = moment(liveStartTime).format('YYYY-MM-DD HH:mm') + ' 开始直播'
        createText(ctx, 258, 598, date, 34)
        // 绘制价格
        if (isPay && paidAmount) {
          ctx.font = 'bold 44px Microsoft YaHei UI'
          let price = `仅需 ${paidAmount}元`
          createText(ctx, 200, 644, price, 58)
        }
        this.poster = canvas.toDataURL()
        this.showPoster = true
      } catch (e) {
        this.$error(e.message)
        console.log(e)
      }
    },
    /**
     * 调起微信支付接口
     * @param CREDENTIAL {Object} 支付数据
     * @returns {Promise<*>}
     */
    async pay (CREDENTIAL) {
      return new Promise(async (resolve, reject) => {
        try {
          await wechatPay(CREDENTIAL)
          this.initPlayer()
          this.initSocket()
          this.$success('付款成功立即观看')
          this.needPay = false
          await setComeInConut({
            message: (this.detail.paidAmount || 0) + '元'
          })
        } catch (e) {
          this.needPay = false
          this.$confirm({
            message: '支付失败',
            viceMessage: '<p>若要正常观看</p><p>请重新发起支付</p>',
            confirmText: '重新支付',
            useDangersHtml: true
          })
            .then(() => {
              this.needPay = true
            })
            .catch(() => {
              this.cancelPay()
            })
          await cancelOrder(this.detail.id)
            .then(res => {
              reject(e)
            })
            .catch(err => {
              reject(err)
            })
        }
      })
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
    justify-content: space-between;
    padding: 0 48px;
    font-size: 26px;
    background-color: #fff;
    > div {
      display: flex;
      align-items: center;
    }
    .tab-item {
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
        > .user-name {
          color: #e84655;
        }
      }
      &.gift {
        position: relative;
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

  .pay-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2002;
    background-color: rgba(0, 0, 0, .65);
  }
  .pay-box {
    width: 704px;
    box-sizing: border-box;
    margin: 280px auto 0;
    padding: 22px 24px;
    background-color: #fff;
    > .box-top {
      display: flex;
      padding-bottom: 28px;
      border-bottom: 1px solid #e7e7e7;
      > img {
        width: 224px;
        height: 164px;
        margin-right: 20px;
        object-fit: cover;
      }
      > .top-right {
        > .title {
          margin-bottom: 12px;
          font-size: 22px;
          line-height: 32px;
        }
        > .time {
          margin-bottom: 10px;
          line-height: 28px;
          font-size: 20px;
          color: #999;
          &:before {
            content: '时间：';
          }
        }
        > .price {
          margin-bottom: 4px;
          font-size: 24px;
          color: #000;
          &:before {
            content: '¥';
            font-size: 16px;
          }
        }
        > .live-tip {
          font-size: 18px;
          color: #a8a8a8;
        }
      }
    }
    > .truth-price {
      margin:  20px 0 28px 0;
      text-align: right;
      font-size: 32px;
      > span {
        color: #333;
      }
      > i {
        color: #fe7700;
        &:before {
          content: '￥';
          font-size: 20px;
        }
      }
    }
    > .buttons {
      text-align: right;
      > button {
        margin-left: 20px;
      }
    }
  }
  .poster {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 2003;
    background-color: rgba(0, 0, 0, .65);
    font-size: 0;
     > .poster-wrap {
       width: 638px;
       text-align: center;
       > img {
         width: 100%;
       }
       > div {
         line-height: 66px;
         font-size: 28px;
         color: #fff;
         text-align: center;
         background-color: #f27918;
       }
       > i {
         margin-top: 64px;
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
