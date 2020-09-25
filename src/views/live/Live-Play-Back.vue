<template>
    <div :class="$style.livePlayBack">
        <div :class="$style.videoBox">
            <PaidPlayer
                :size="videoMes.fileSize"
                :src="videoMes.url"
                :video-id="id"
                :resource-id="activityId"
                :resource-name="activityName"
                @playing.once="livePlaying"
            />
            <div>商品和课程</div>
        </div>
        <div :class="$style.productList" v-if="productList.length">
            <div :class="$style.tabTitle">
                商品和课程（{{ productList.length }}）
            </div>
            <LiveGoods v-for="(item,index) in productList" :key="index" :item="item" />
        </div>
        <!-- 支付弹框 -->
        <transition name="fade">
            <div :class="$style.payWrap" v-if="needPay">
                <div :class="$style.payBox">
                    <div :class="$style.title">
                        支付提示
                    </div>
                    <div :class="$style.message">
                        该直播视频需支付￥{{ payCount }}后可观看回放，确认要观看吗？
                    </div>
                    <div :class="$style.buttons">
                        <button :class="$style.cancelBtn" @click="cancelPay">取消</button>
                        <button @click="submitOrder">确定</button>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 密令弹窗 -->
        <LivePassword :activity-id="activityId" ref="livePassword" />
        <!-- 报名 -->
        <LiveSignUp :info="detail" :activity-id="activityId" ref="LiveSignUp" />
    </div>
</template>

<script>
import {
    getPlayBackActiveCompleteInfo as getActiveCompleteInfo,
    getVideoMesById,
    setComeInConut,
    // 是否有权限观看
    hasPermission,
    hasPied
} from '../../apis/live.js'
import {
    submitOrder,
    getOrderPayData,
    cancleOrderListByBatchNumber
} from '../../apis/order-manager'
import { setTimeoutSync } from '../../assets/js/util'
import { getLivePlayBackInfo } from './../../apis/live-library'
import wechatPay from '../../assets/js/wechat/wechat-pay'
import PaidPlayer from '../../components/common/Paid-Player.vue'
import LivePassword from './components/Live-Password'
import LiveSignUp from './components/Live-Sign-Up'
import LiveGoods from './components/Live-goods'
import { mapGetters } from 'vuex'
export default {
    name: 'LivePlayBack',
    components: {
        PaidPlayer,
        LivePassword,
        LiveSignUp,
        LiveGoods
    },
    props: {
        activityId: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        },
        // 是否需要后台校验直播结束时间，我的直播-需要校验 互动直播-无需校验
        isValidateEndTime: {
            type: String,
            default: ''
        }
    },
    data () {
        this.requestPayDataCount = 0
        return {
            submiting: false,
            activityName: '',
            needPay: false,
            // 价格
            payCount: 0,
            // 商品列表
            productList: [],
            // 是否被送课
            isGive: false,
            detail: {},
            videoMes: {
                fileSize: 0
            }
        }
    },
    async activated () {
        try {
            this.needPay = false
            if (this.roleCode === 'VISITOR') {
                await this.$confirm({
                    message: '为了您的账号安全，请绑定手机号',
                    confirmText: '去绑定',
                    closeOnClickMask: false
                }).finally(() => {
                    const { name, params, query } = this.$route
                    sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({ name, query, params }))
                    this.$router.push({ name: 'BindMobile' })
                })
                return
            }
            await this.getLivePlayBackInfo()
            await this.getPromission()
        } catch (e) { throw e }
    },
    deactivated () {
        this.needPay = false
        this.productList = []
        this.videoMes = {}
    },
    methods: {
        // 开始播放时
        async livePlaying () {
            try {
                await this.setComeInConut(1)
            } catch (e) { throw e }
        },
        // 获取回看的信息
        async getLivePlayBackInfo () {
            try {
                const { result } = await getLivePlayBackInfo(this.activityId, this.isValidateEndTime === '1')
                this.detail = result
                // 单位分转为元
                this.payCount = result.needPaidAmount / 100
                this.activityName = result.activityName
            } catch (e) {
                if (window.history.length > 1) {
                    this.$router.go(-1)
                } else {
                    this.$router.replace({ name: 'Home' })
                }
                throw e
            }
        },
        // 是否有权限观看
        async getPromission () {
            try {
                // 下面顺序不可改变
                // 获取活动信息
                await this.getDetail()
                // 是否有权限观看
                await this.hasPermission()
                // 存入访问记录
                await this.setComeInConut(0)
                // 是否要报名
                await this.signUp()
                // 是否要输入口令
                await this.inputToken()
                // 是否支付
                this.hasPay()
                // 是否要付费
                if (!this.needPay) {
                    await this.getVideoMes()
                }
            } catch (e) {
                if (e) throw e
            }
        },
        // 是否有权限观看
        async hasPermission () {
            try {
                // isGive 是否被送 isRange 是否有权限观看
                const { isGive, isRange } = await hasPermission(this.activityId)
                this.isGive = isGive
                if (!isRange) {
                    await this.$warning('您没有权限观看该场直播')
                    if (window.history.length > 1) {
                        this.$router.go(-1)
                    } else {
                        this.$router.replace({ name: 'Home' })
                    }
                    // eslint-disable-next-line no-throw-literal
                    throw false
                }
            } catch (e) { throw e }
        },
        // 是否要报名
        async signUp () {
            // 私享课
            if (this.detail.liveMode === 'private') {
                return
            }
            // 公开课，送过课
            if (this.detail.liveMode === 'public' && this.isGive) {
                return
            }
            if (this.detail.isNeedSignUp === 1 && !this.detail.isHaveSignUp) {
                await this.$nextTick()
                await this.$refs.LiveSignUp.signUp()
            }
        },
        // 是否输入口令
        async inputToken () {
            if (this.detail.isHaveToken && !this.detail.isInputToken) {
                await this.$nextTick()
                await this.$refs.livePassword.validate()
            }
        },
        // 访问记录 0第一次插入 1修改记录信息
        async setComeInConut (type) {
            try {
                let shareUserId = this.$route.query.shareUserId || ''
                shareUserId = Array.isArray(shareUserId) ? shareUserId.slice(-1)[0] : shareUserId
                await setComeInConut({
                    id: this.activityId,
                    shareUserId,
                    type
                })
            } catch (e) { throw e }
        },
        // 是否支付
        async hasPay () {
            // 已送课
            if (this.isGive) {
                return
            }
            // 免费直播也需要产生订单
            /* if (!this.mchId) {
                this.$confirm('商家未开通支付，请联系管理员')
            } */
            try {
                const needPay = await hasPied(this.activityId)
                if (!needPay) {
                    // 还没支付
                    this.needPay = true
                }
            } catch (e) {
                throw e
            }
        },
        async getDetail () {
            try {
                const result = await getActiveCompleteInfo(this.activityId)
                // 直播已经删除
                if (result.statue === 3) {
                    await this.$warning('该直播已经删除')
                    if (window.history.length > 1) {
                        this.$router.go(-1)
                    } else {
                        this.$router.replace({ name: 'Home' })
                    }
                    // eslint-disable-next-line no-throw-literal
                    throw false
                }
                this.productList = result.productList && result.courseList && result.productList.concat(result.courseList)
            } catch (e) { throw e }
        },
        async getVideoMes () {
            try {
                const mes = await getVideoMesById(this.id)
                mes.fileSize = Number(mes.fileSize) || 0
                this.videoMes = mes
            } catch (e) { throw e }
        },
        async submitOrder () {
            try {
                if (this.submiting) return
                this.submiting = true
                const form = {
                    activityId: '',
                    helper: '',
                    // 商品来源：1 正常购买下单， 2 团购商品购买下单，3秒杀商品购买下单，4.预购商品下单确认，5春耘，6组合商品，7公益， 8兑换码
                    source: 1,
                    // 其中的goodType包括: PHYSICAL_GOODS VIRTUAL_GOODS SERIES_OF_COURSE EXPERIENCE_CLASS KNOWLEDGE_COURSE SERIES_OF_COURSE LIVE_GOODS
                    skus: [
                        {
                            count: 1,
                            goodsId: this.detail.activityId,
                            goodsType: this.detail.liveType === 'live' ? 'LIVE_GOODS' : 'VIDEO_GOODS',
                            productCustomInfo: '',
                            sku1: '',
                            sku2: '',
                            // 留言
                            orderPostscript: ''
                        }
                    ],
                    // 地址信息
                    userAddress: null,
                    // 奖学金
                    scholarshipModel: null,
                    // 优惠券
                    cartCouponModel: null,
                    // 发票
                    invoiceInfoModel: null
                }
                const { result: orderBatchNumber } = await submitOrder(form)
                await this.requestPayData(orderBatchNumber)
                // 在订单提交的过程中若切换页面，手动关闭订单
                this.$once('hook:beforeRouteLeave', async () => {
                    if (this.submiting) await this.handlepayError(orderBatchNumber)
                })
            } catch (e) {
                throw e
            } finally {
                this.submiting = false
            }
        },
        async requestPayData (orderBatchNumber) {
            try {
                // 每500ms请求一次支付数据，如果请求次数超过20次，就终止请求
                // 下次请求的开始时间 =  500ms + 当前请求时间
                if (this.requestPayDataCount >= 20) {
                    this.requestPayDataCount = 0
                    this.submiting = false
                    throw new Error('支付失败')
                }
                await setTimeoutSync(500)
                // 如果没有拿到请求数据，再次尝试发起请求
                // 如果有，则发起支付
                const { result: payData } = await getOrderPayData(orderBatchNumber)
                if (!payData) {
                    this.requestPayDataCount++
                    await this.requestPayData(orderBatchNumber)
                } else {
                    await this.pay(payData)
                }
            } catch (e) {
                this.requestPayDataCount = 0
                await this.handlepayError(orderBatchNumber)
                throw e
            }
        },

        /**
       * 支付
       * @param CREDENTIAL {Object} 支付数据
       * @returns {Promise<*>}
       */
        async pay (CREDENTIAL) {
            try {
                if (CREDENTIAL.appId) {
                    await wechatPay(CREDENTIAL)
                    this.$success('支付成功')
                    await this.getLivePlayBackInfo()
                    this.submiting = false
                    this.needPay = false
                } else if (this.detail.paidAmount === 0) {
                    this.$success('支付成功')
                    await this.getLivePlayBackInfo()
                    this.submiting = false
                    this.needPay = false
                } else {
                    throw new Error('支付失败')
                }
            } catch (e) {
                throw e
            }
        },
        // 处理支付失败的场景
        async handlepayError (orderBatchNumber) {
            try {
                await cancleOrderListByBatchNumber(orderBatchNumber)
                this.submiting = false
            } catch (e) {
                throw e
            }
        },
        cancelPay () {
            this.$router.back()
        }
    },
    computed: {
        ...mapGetters(['mallDomain', 'roleCode', 'mchId'])
    }
}
</script>

<style lang='scss' module>

  .live-play-back {
    > .video-box {
      width: 100%;
      > video {
        object-fit:fill;
        width: 100%;
        height: 442px;
      }
      > div {
        background: #fff;
        font-size: 26px;
        padding: 0 24px;
        line-height: 68px;
      }
    }
    > .product-list {
      padding: 12px 24px;
      height: calc(100vh -  522px);
      overflow: auto;
      > .tab-title {
        font-size: 32px;
        line-height: 44px;
        margin-bottom: 12px;
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
    width: 540px;
    box-sizing: border-box;
    margin: 30vh auto 0;
    border-radius: 10px;
    overflow: hidden;
    text-align: center;
    background-color: #fff;
    .title{
      padding: 40px 0 12px 0;
      font-size:34px;
      font-weight:bold;
      color:#000;
    }
    .message{
      padding: 0 24px 40px;
      font-size:28px;
      line-height:36px;
      color:#999;
    }
    > .buttons {
      display: flex;
      border-top: 2px solid #D3D1D2;
      > button {
        flex: 1;
        font-size:34px;
        line-height: 100px;
        text-align: center;
        color: #FE7700;
      }
      > .cancelBtn {
        border-right: 2px solid #D3D1D2;
        color: #666;
      }
    }
  }

</style>
