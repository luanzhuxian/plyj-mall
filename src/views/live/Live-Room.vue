<template>
    <div :class="$style.liveRoom" ref="liveRoom">
        <!--在线直播-->
        <div v-if="detail.liveType === 'live'" :class="$style.livePlayer">
            <div
                ref="playerBox"
                id="player"
                :class="{
                    [$style.playerBox]: true
                }"
            />
            <LiveMask :timestamp="livestartedDuration" :img-src="detail.coverImg" v-if="!liveStart" />
        </div>
        <!--视频直播-->
        <div v-if="detail.liveType === 'video'" :class="$style.playBackBox">
            <LiveMask :timestamp="livestartedDuration" :img-src="detail.coverImg" v-if="recorded.ended" />
            <PaidPlayer
                v-else
                :src="recorded.url"
                :resource-name="recorded.name"
                :video-id="recorded.id"
                :size="recorded.fileSize"
                @playing.once="livePlaying"
            />
        </div>
        <!-- 聊天 -->
        <div :class="$style.chatRoom">
            <div :class="$style.tabs" ref="tabs">
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
                <pl-button v-if="detail.coverImg" style="padding:0 24px" @click="share" type="warning" size="small">分享海报</pl-button>
            </div>

            <div :class="$style.chatWrap" ref="chatWrap">
                <div v-show="tab === 1" :class="$style.chatRecords" ref="chatRecords">
                    <template v-for="(item, i) of chatRecords">
                        <!-- 一般消息 -->
                        <div
                            v-if="!item.gift && !item.custom"
                            :key="i"
                            :id="`chat_item_${i}`"
                            :class="{
                                [$style.messageWrap]: true,
                                [$style.selfMessage]: item.self
                            }"
                        >
                            <span :class="$style.userName" v-text="item.name" />
                            <div :class="$style.message">
                                <span v-text="item.message" />
                                <pl-svg v-if="item.loading" :class="$style.messageLoading" name="icon-btn-loading" fill="#999" width="24" font-weight="bolder" @click="repeatSend(item, i)" />
                                <span v-if="!item.success && !item.loading" :class="$style.error">
                                    <pl-svg name="icon-warning" fill="red" width="24" @click="repeatSend(item, i)" />
                                    <i :class="$style.faild" @click="repeatSend(item, i)">发送失败</i>
                                </span>
                            </div>
                        </div>
                        <!-- 自定义消息 -->
                        <div
                            :key="i"
                            v-else-if="item.custom"
                            :id="`chat_item_${i}`"
                            :class="{
                                [$style.messageWrap]: true,
                                [$style.customMessage]: true
                            }"
                        >
                            <span :class="$style.userName" v-text="item.name" />&nbsp;
                            <div :class="$style.message">
                                <span v-text="item.message" />
                                <pl-svg v-if="item.loading" :class="$style.messageLoading" name="icon-btn-loading" fill="#999" width="16" @click="repeatSend(item, i)" />
                                <span v-if="!item.success && !item.loading" :class="$style.error">
                                    <pl-svg name="icon-warning" fill="red" width="24" @click="repeatSend(item, i)" />
                                    <i :class="$style.faild" @click="repeatSend(item, i)">发送失败</i>
                                </span>
                            </div>
                        </div>
                        <!-- 礼物消息 -->
                        <div
                            :key="i"
                            v-else-if="item.gift"
                            :id="`chat_item_${i}`"
                            :class="{
                                [$style.messageWrap]: true,
                                [$style.gift]: true
                            }"
                        >
                            <span :class="$style.userName" v-text="item.name" />
                            <span>&nbsp;赠送给老师&nbsp;</span>
                            <pl-svg v-if="item.giftType === 'flower'" name="icon-meiguihua" width="36" height="36" />
                        </div>
                    </template>
                </div>
                <div v-show="tab === 2" :class="$style.couponList">
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
                                :instruction="item.brief"
                                :coupon-type="item.couponType"
                                :is-over-max="!item.canReceive"
                                :is-claimed="receiveCouponIdList.indexOf(item.couponId) !== -1"
                                @couponClick="couponClick(item.couponId)"
                                v-if="item.show"
                            />
                        </template>
                    </div>
                </div>
                <div v-show="tab === 3" :class="$style.productList">
                    <div :class="$style.tabTitle">
                        精选商品（{{ productList.length }}件）
                    </div>
                    <div
                        v-for="(item, i) of productList"
                        :key="i"
                        :class="$style.product"
                        @click="$router.push({ name: 'Product', params: { productId: item.id } })"
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
                            <pl-svg name="icon-vie-for" fill="#fff" width="40" height="70" />
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="tab === 1" :class="$style.sendMessage">
                <form :class="$style.inputBox" @submit.prevent="messageConfirm">
                    <input
                        v-model.trim="message"
                        placeholder=" 进来了说点什么呗~"
                        type="text"
                        @blur="messageBoxBlur"
                        :disabled="!socket"
                    >
                    <button :class="$style.sendBtn">发送</button>
                </form>
                <div :class="$style.sendFlower" @click="sendFlower">
                    <pl-svg name="icon-flower" width="37" />
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
                            <div :class="$style.time" v-text=" detail.livestartedDuration" />
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
                    <pl-svg class="mt-22" name="icon-close" width="48" fill="#fff" @click="showPoster = false" />
                </div>
            </div>
        </transition>

        <!-- 直播口令 -->
        <LivePassword :activity-id="activityId" ref="livePassword" />
        <!-- 报名 -->
        <LiveSignUp :info="detail" :activity-id="activityId" ref="LiveSignUp" />

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CouponItem from '../../components/item/Coupon-Item.vue'
import PaidPlayer from '../../components/common/Paid-Player.vue'
import share from '../../assets/js/wechat/wechat-share'
// 直播口令输入
import LivePassword from './components/Live-Password'
import LiveMask from './components/Live-Mask'
import LiveSignUp from './components/Live-Sign-Up'
import {
    getRoomStatus,
    getActiveCompleteInfo,
    pay,
    hasPied,
    cancelOrder,
    setComeInConut,
    getVideoMesById,
    // 查询直播是否开始
    isLiveStart,
    sign,
    // setcCverImg,
    // 是否有权限观看
    hasPermission
    // setWarmup
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
    // throttle
} from '../../assets/js/util'
const POSTER_BG = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/live/live-poster.png'
const PolyvLiveSdk = window.PolyvLiveSdk
export default {
    name: 'LiveRoom',
    components: {
        // VueSlider,
        LiveSignUp,
        LiveMask,
        LivePassword,
        CouponItem,
        PaidPlayer
    },
    props: {
        id: {
            type: String,
            default: ''
        }
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
            // 直播开始时长
            livestartedDuration: 0,
            // 最大缓存的聊天记录条数
            maxRecords: 200,
            // 直播是否开始
            liveStart: false,
            liveStatusTimer: null,
            // 直播活动Id
            activityId: '',
            // 直播倒计时长
            timestamp: 0,
            // 是否被送课
            isGive: false,

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
            // 增加节流阀
            isCouponLoading: false,
            productList: [],
            detail: {
                liveType: 'live'
            },
            // 已领取的优惠券id列表
            receiveCouponIdList: [],
            // 录播视频信息
            recorded: {
                fileSize: 0,
                ended: true
            },
            socket: null,
            // 视频直播开播计时器
            videoLiveTimer: null
        }
    },
    computed: {
        ...mapGetters(['userName', 'avatar', 'userId', 'openId', 'roleCode', 'appId', 'isActivityAuth', 'mallDomain', 'mchId'])
    },
    async created () {
        localStorage.removeItem(`LIVE_MESSAGE_${ this.mallDomain }`)
        this.receiveCouponIdList = []
        if (this.roleCode === 'VISITOR') {
            await this.$confirm({
                message: '为了您的账号安全，请绑定手机号',
                confirmText: '去绑定',
                closeOnClickMask: false
            })
                .finally(() => {
                    const { name, params, query } = this.$route
                    sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({ name, query, params }))
                    this.$router.push({ name: 'BindMobile' })
                })
            return
        }
        try {
            const res = await Promise.all([
                this.getRoomStatus(),
                this.getDetail()
            ])
            // 当前直播是否结束  (0, "结束"), (1, "开启"), (2, "准备中"), (3, "删除"), (4,"直播中"), (99, "其它");
            if ([1, 2, 4].indexOf(res[1].statue) === -1) {
                await this.$alert('直播已结束')
                if (window.history.length > 1) {
                    this.$router.go(-1)
                } else {
                    this.$router.replace({ name: 'Home' })
                }
                return
            }
            // 下面是按照固定顺序，不可改变
            // 是否有权限观看
            await this.hasPermission()
            // 存入访问记录
            await this.setComeInConut(0)
            // 是否要报名
            await this.signUp()
            // 是否要输入口令
            await this.inputToken()
            // 是否需要支付
            await this.hasPay()
            // 根据直播状态获取播放时所需数据
            await this.handleByLiveType()
            // 初始化播放器
            this.init()
        } catch (e) {
            if (e) {
                this.$error(e.message)
                throw e
            }
        }
    },
    methods: {
        // 报名
        async signUp () {
            try {
                // 私享课
                if (this.detail.liveMode === 'private') {
                    return
                }
                // 公开课，送过课
                if (this.detail.liveMode === 'public' && this.isGive) {
                    return
                }
                // 是否要报名
                if (this.detail.isNeedSignUp === 1 && !this.detail.isHaveSignUp) {
                    await this.$nextTick()
                    await this.$refs.LiveSignUp.signUp()
                }
            } catch (e) { throw e }
        },
        // 输入口令
        async inputToken () {
            try {
                if (this.detail.needToken && !this.detail.isInputToken) {
                    await this.$nextTick()
                    await this.$refs.livePassword.validate()
                }
            } catch (e) { throw e }
        },
        // 是否送课
        async hasPermission () {
            /* eslint-disable no-throw-literal */
            try {
                // isGive 是否被送 isRange 是否有权限观看
                const { isGive, isRange } = await hasPermission(this.id)
                this.isGive = isGive
                if (!isRange) {
                    if (window.history.length > 1) {
                        this.$router.go(-1)
                    } else {
                        this.$router.replace({ name: 'Home' })
                    }
                    throw false
                }
            } catch (e) {
                throw e
            }
        },
        // 是否支付
        async hasPay () {
            /* eslint-disable no-throw-literal */
            // 已送课
            if (this.isGive) {
                throw false
            }
            if (this.detail.isPay) {
                if (!this.mchId) {
                    this.$confirm('商家未开通支付，请联系管理员')
                    throw false
                }
                try {
                    const needPay = await hasPied(this.detail.id)
                    if (!needPay) {
                        // 还没支付
                        this.needPay = true
                        throw false
                    }
                } catch (e) {
                    throw e
                }
            }
        },
        // 访问记录 0第一次插入 1修改记录信息
        async setComeInConut (type) {
            try {
                const shareUserId = this.$route.query.shareUserId || ''
                await setComeInConut({
                    id: this.detail.id,
                    shareUserId,
                    type
                })
            } catch (e) { throw e }
        },
        // 开始播放时
        async livePlaying () {
            try {
                await this.setComeInConut(1)
            } catch (e) { throw e }
        },
        // 根据直播状态获取播放时所需数据
        async handleByLiveType () {
            try {
                if (this.detail.liveType === 'live') {
                    // 监听直播是否开始
                    this.listenLiveStart(this.detail.stream)
                } else if (this.detail.liveType === 'video') {
                    // 获取录播视频详情
                    await this.getVideoMesById()
                    this.controlVideo()
                }
            } catch (e) { throw e }
        },
        // 获取直播状态
        async getRoomStatus () {
            try {
                const data = await getRoomStatus()
                const { appId, appUserId } = data
                this.liveAppId = appId
                this.channeUserId = appUserId
            } catch (e) {
                throw e
            }
        },
        // 获取直播详情
        async getDetail () {
            try {
                const data = await getActiveCompleteInfo(this.id)
                if (!data) {
                    return null
                }
                data.liveType = data.liveType || 'live'
                this.livestartedDuration = data.serviceLongTime - moment(data.liveStartTime).valueOf()
                share({
                    appId: this.appId,
                    title: data.name,
                    desc: `${ data.liveStartTime } 开始直播，快来围观哦~`,
                    link: window.location.href,
                    imgUrl: data.coverImg
                })
                data.couponList = data.couponList || []
                for (const coupon of data.couponList) {
                    coupon.show = false
                }
                if (data.couponList.length) {
                    const timer = setInterval(() => {
                        // 如果已经全部都显示了，停止定时器
                        if (!data.couponList.some(item => !item.show)) {
                            clearInterval(timer)
                        }
                        for (const coupon of data.couponList) {
                            if (coupon.show) {
                                continue
                            }
                            coupon.show = this.canShowCoupon(coupon.afterMinuteShow)
                        }
                        this.couponList = data.couponList.filter(item => item.show)
                    }, 2000)
                }
                this.productList = data.productList || []
                this.activityId = data.id
                if (data.videoLibId && data.videoLibId !== '0' && data.liveType === 'live') {
                    this.chatRecords.push({ name: '该视频支持回放', message: '（“个人中心”→“我的视频库”）', custom: true, success: true })
                }
                this.channelId = data.roomId
                this.detail = data
                return data
            } catch (e) {
                throw e
            }
        },
        // 查询直播是否开始
        async listenLiveStart (stream) {
            window.clearTimeout(this.liveStatusTimer)
            this.liveStatusTimer = window.setTimeout(async () => {
                try {
                    // end 未直播 live 正在直播
                    let result = await isLiveStart(stream)
                    result = result.trim()
                    if (result === 'live') {
                        window.clearTimeout(this.liveStatusTimer)
                        this.liveStart = true
                    } else {
                        this.liveStart = false
                        this.listenLiveStart(stream)
                    }
                } catch (e) {
                    if (e.name === 'ResponseError') {
                        this.$error(JSON.parse(e.message).message)
                    } else {
                        this.$error(e.message)
                    }
                }
            }, 5e3)
        },
        // 视频直播情况下获取视频信息
        async getVideoMesById () {
            try {
                let recorded = await getVideoMesById(this.detail.videoLibId)
                recorded = recorded || {}
                recorded.ended = true
                recorded.fileSize = Number(recorded.fileSize) || 0
                // 默认已经结束
                this.recorded = recorded
            } catch (e) {
                throw e
            }
        },
        // 播放开始跳转到固定时间,且隐藏控件
        async controlVideo () {
            let {
                liveStartTime,
                liveEndTime,
                serviceLongTime: now
            } = this.detail
            liveStartTime = moment(liveStartTime).valueOf()
            liveEndTime = moment(liveEndTime).valueOf()
            now = Number(now)
            // 已开播时长（秒）
            const startedDuration = parseInt(now - liveStartTime)
            // 已结束时长
            const endDuration = parseInt(liveEndTime - now)
            // 直播还未开始的时候，等待直播开始后，刷新页面
            if (startedDuration < 0) {
                setTimeout(() => {
                    location.reload()
                }, -startedDuration)
            } else {
                // 直播是否已结束
                this.recorded.ended = endDuration < 0
            }
        },
        // 设置封面
        // async setcCverImg (sign) {
        //     const { channelId, liveAppId: appId, detail: { coverImg } } = this
        //     const timestamp = Date.now()
        //     try {
        //         await setcCverImg(channelId, {
        //             appId,
        //             coverImage: coverImg,
        //             timestamp,
        //             sign
        //         })
        //     } catch (e) {
        //         throw e
        //     }
        // },
        init () {
            this.initSocket()
            this.initPlayer()
        },
        async initPlayer () {
            // 默认在线直播
            if (this.detail.liveType === 'live') {
                const { channelId, avatar, liveAppId: appId, userId, userName } = this
                const timestamp = Date.now()
                const signStr = await sign({
                    roomId: channelId,
                    signMsg: `appId${ appId }channelId${ channelId }timestamp${ timestamp }`
                })
                const liveSdk = new PolyvLiveSdk({
                    channelId,
                    // 频道验证签名
                    sign: signStr,
                    // 毫秒级时间戳
                    timestamp,
                    // polyv 后台的appId
                    appId,
                    chat: true,
                    controller: true,
                    barrage: false,
                    socket: this.socket,
                    type: 'live',
                    user: {
                        userId,
                        userName,
                        pic: avatar
                    }
                })
                liveSdk.on(PolyvLiveSdk.EVENTS.CHANNEL_DATA_INIT, (event, data) => {
                    liveSdk.setupPlayer({
                        el: '#player',
                        width: '100vw',
                        height: `${ 442 / 7.5 }vw`
                    })
                    this.setComeInConut(1)
                })
                this.liveSdk = liveSdk
            }
        },

        /* 连接聊天服务器 */
        initSocket () {
            if (this.socket) return
            const { userName, userId, openId, avatar, channelId } = this
            const socket = io.connect('https://chat.polyv.net', {
                // query: 'token=' + chatToken, // 文档上说，暂时为空
                transports: ['websocket']
            })
            socket.on('connect', () => {
                console.warn('chantroom connect success!')
            })
            socket.on('disconnect', e => {
                console.error(e)
                console.error('chantroom connect error!')
                this.$confirm({
                    icon: 'icon-close3',
                    message: '聊天室链接错误，请重试'
                })
                    .then(() => {
                        this.socket = null
                        this.initSocket()
                    })
                    .catch(() => {})
            })
            socket.on('message', this.onMessage)

            /* 登录到聊天服务器 */
            socket.emit('message', JSON.stringify({
                EVENT: 'LOGIN',
                // 登录用户信息，不可为空
                values: [userName, avatar, userId || openId],
                // 当前房间号
                roomId: channelId,
                // 用户类型，可为空,teacher（教师）、assistant（助教）、manager（管理员）、slice（云课堂学员）
                type: 'slice'
            }))
            this.socket = socket
            this.chatRecords = [...(JSON.parse(localStorage.getItem(`LIVE_MESSAGE_${ this.mallDomain }`)) || []), ...this.chatRecords]
        },

        /* 接收消息 */
        onMessage (data) {
            const mData = JSON.parse(data)
            if (mData && mData.EVENT) {
                const { user } = mData
                switch (mData.EVENT) {
                    case 'LOGIN':
                        this.pushMessage({
                            message: '进入了直播间',
                            name: user.nick,
                            custom: true,
                            success: true,
                            type: 'LOGIN'
                        })
                        break
                    case 'SPEAK':
                        if (this.userName !== user.nick) {
                            const message = mData.values.join(',')
                            this.pushMessage({
                                message,
                                name: user.nick,
                                success: true,
                                type: 'SPEAK'
                            })
                        }
                        break
                    case 'FLOWERS':
                        this.pushMessage({
                            message: '',
                            name: mData.nick,
                            gift: true,
                            giftType: 'flower',
                            success: true,
                            type: 'FLOWERS'
                        })
                        break
                }
                this.scrollBottom()
            }
        },

        /* 聊天发送消息 */
        async sendMessage (message) {
            try {
                const { channelId } = this
                this.socket.emit('message', JSON.stringify({
                    EVENT: 'SPEAK',
                    // 发言内容
                    values: [message],
                    roomId: channelId
                }))
            } catch (e) {
                throw e
            }
        },
        // 发送消息
        async messageConfirm () {
            if (this.hasSended) {
                this.$warning('消息发送的太频繁了，请稍后再试~')
                return
            }
            if (!this.message.trim()) {
                return this.$warning('请输入内容')
            }
            if (this.message.length > 100) {
                return this.$warning('字数不得超过100字')
            }
            // 标记为已发送过消息，下次发送必须3秒以后
            this.hasSended = true
            const o = {
                name: this.userName,
                message: this.message,
                success: false,
                loading: true,
                self: true,
                type: 'SPEAK'
            }
            try {
                // this.chatRecords.push(o)
                await this.sendMessage(this.message)
                o.success = true
                o.loading = false
            } catch (e) {
                // 配置发送失败
                o.loading = false
                o.success = false
            } finally {
                this.pushMessage(o)
                this.scrollBottom()
                this.$set(this.chatRecords, this.chatRecords.length - 1, o)
                this.message = ''
                setTimeout(() => {
                    this.hasSended = false
                }, 3000)
            }
        },
        pushMessage (msg) {
            const len = this.chatRecords.length
            const { maxRecords } = this
            if (len > maxRecords) {
                this.chatRecords = this.chatRecords.slice(len - maxRecords)
            }
            this.chatRecords.push(msg)
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
            if (this.sended) {
                this.$warning('送花频率太高了，请稍后')
                return
            }
            const { channelId, userName } = this
            this.socket.emit('message', JSON.stringify({
                EVENT: 'FLOWERS',
                // 当前房间号
                roomId: channelId,
                // 送花人昵称
                nick: userName,
                // 送花人头像，为新增的属性，可不传
                uimg: ''
            }))
            this.sended = true
            setTimeout(() => {
                this.sended = false
            }, 2000)
        },
        async scrollBottom () {
            await this.$nextTick()
            const box = this.$refs.chatWrap
            if (box) box.scrollBy(0, box.offsetHeight)
        },
        async couponClick (id) {
            if (this.isCouponLoading) return
            try {
                this.isCouponLoading = true
                await receiveCouponForLive({
                    couponId: id,
                    activityId: this.activityId,
                    entityClassName: 'MallLiveActivityEntity'
                })
                this.$success('领取成功')
                this.receiveCouponIdList.push(id)
            } catch (e) {
                throw e
            } finally {
                this.isCouponLoading = false
            }
        },
        // 判断优惠券是否到了显示时间
        canShowCoupon (afterMinuteShow) {
            const ms = afterMinuteShow * 60 * 1000
            return this.livestartedDuration >= ms
        },
        messageBoxBlur (e) {
            window.scrollTo(0, 0)
        },

        /**
         * 提交订单
         */
        async submitOrder () {
            try {
                const res = await pay(this.detail.id)
                await this.pay(res)
            } catch (e) {
                throw e
            }
        },
        //  取消播放
        cancelPay () {
            if (this.isActivityAuth) {
                this.$router.push({ name: 'Activity' })
            } else {
                this.$router.push({ name: 'Home' })
            }
        },
        async share () {
            if (this.poster) {
                this.showPoster = true
                return
            }
            const {
                coverImg,
                name,
                liveStartTime,
                isPay,
                paidAmount
            } = this.detail
            // 生成二维码
            try {
                let url = location.href
                let search = url.split('?')[1]
                const shareUserId = this.$store.getters.userId || ''
                const path = url.split('?')[0]
                search = search ? `${ search }&shareUserId=${ shareUserId }` : `shareUserId=${ shareUserId }`
                url = `${ path }?${ search }`
                const all = [
                    generateQrcode(300, url, 0, null, 0, 'canvas'),
                    loadImage(POSTER_BG),
                    loadImage(this.avatar),
                    loadImage(coverImg)
                ]
                const res = await Promise.all(all)
                const qrcode = res[0]
                const bg = res[1]
                let avatar = res[2]
                const coverImgEl = res[3]
                const canvas = document.createElement('canvas')
                canvas.width = bg.width
                canvas.height = bg.height
                const ctx = canvas.getContext('2d')
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
                const nameWidth = createText(ctx, 100, 28, this.userName, 34, 350, 1)
                createText(ctx, 100 + nameWidth + 14, 28, '邀您观看直播', 34, 350, 1)
                // 绘制封面
                ctx.drawImage(coverImgEl, 14, 102, 610, 406)
                // 绘制直播名称
                ctx.font = 'bold 32px Microsoft YaHei UI'
                createText(ctx, 200, 534, name, 44, 400, 1)
                // 绘制直播时间
                ctx.font = '24px Microsoft YaHei UI'
                const date = `${ moment(liveStartTime).format('YYYY-MM-DD HH:mm') } 开始直播`
                createText(ctx, 258, 598, date, 34)
                // 绘制价格
                if (isPay && paidAmount) {
                    ctx.font = 'bold 44px Microsoft YaHei UI'
                    const price = `仅需 ${ paidAmount }元`
                    createText(ctx, 200, 644, price, 58)
                }
                this.poster = canvas.toDataURL()
                this.showPoster = true
            } catch (e) {
                this.$error(e.message)
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
                    await this.handleByLiveType()
                    this.init()
                    this.$success('付款成功立即观看')
                    this.needPay = false
                    await this.setComeInConut(1)
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
        },
        // 判断元素是否在可视区域内
        isElementInViewport (el) {
            const rect = el.getBoundingClientRect()
            // console.log(el.parentNode.offsetHeight, this.$refs.playerBox.offsetHeight, this.$refs.tabs.offsetHeight, rect.height, rect.top)
            // console.log(window.innerHeight)
            // console.log(Math.abs(rect.height + rect.top))
            return Math.abs(rect.height + rect.top) > 1600
            // return (
            //   rect.top >= 0 &&
            //   rect.left >= 0 &&
            //   rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
            //   rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
            // )
        }
    },
    beforeDestroy () {
        window.clearInterval(this.videoLiveTimer)
        window.clearTimeout(this.liveStatusTimer)
        if (this.liveSdk) this.liveSdk.destroy(true)
    }
}
</script>

<style module lang="scss">
.live-room {
    height: 100vh;
    > .live-player {
        position: relative;
    }
    > .play-back-box {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 442px;
        background-color: #000;
        > video {
            height: 100%;
            object-fit: fill;
            background-color: #000;
        }
        > div {
            width: 100%;
            height: 100%;
        }
    }
}
.player-box {
    position: relative;
    height: 442px !important;
    > .coverImg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 442px;
        object-fit: cover;
    }
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
    padding: 0 24px;
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
            color: #f2b036;
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
                background-color: #f2b036;
                border-radius: 3px;
            }
        }
    }
}
.chat-wrap {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
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
            background-color: #fce6b7;
            border-radius: 4px;
            > .user-name {
                color: #896437;
            }
            > .message {
                color: #fe7700;
            }
        }
    }
    .user-name {
        color: #999;
        &:after {
            content: ':';
            margin-right: 10px;
        }
    }
    .message {
        flex: 1;
        width: 600px;
        word-break: break-all;
        white-space: pre-wrap;
        > span {
            &:nth-of-type(1) {
                margin-right: 10px;
            }
        }
        > .error {
            > .faild {
                font-size: 24px;
                color: red;
                opacity: .5;
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
    border: 1px solid #eee;
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
    background-color: #f2b036;
}

.send-flower {
    display: inline-flex;
    align-items: center;
    justify-content: center;
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
        flex: 1;
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
        margin: 20px 0 28px 0;
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
    z-index: 99999;
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
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

</style>
<style lang="scss">
.plv-live-player-bar {
    height: 80px!important;
}
.plv-live-cutOff {
    display: none !important;
}
.plv-live-cover__btn {
    // display: none;
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
