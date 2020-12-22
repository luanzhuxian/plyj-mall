<template>
    <div class="sign-in">
        <!-- 礼品展示开始 -->
        <div class="present" v-if="presentList.length === 1">
            <div :class="presentList[0].awardType === 2 ? 'gift-bg' : 'award-bg'">
                <div :class="presentList[0].awardType === 2 ? 'gift' : 'award'">
                    <!--礼品图片-->
                    <img class="img" v-if="presentList[0].show" :src="presentList[0].awardImg">
                    <img class="img" v-else src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/gift.png">
                </div>
                <div class="name">{{ presentList[0].show ? presentList[0].awardName : '智慧礼' }}</div>
            </div>
        </div>
        <swiper class="present" :options="swiperOption" v-if="presentList.length > 1">
            <swiper-slide v-for="(item,index) in presentList" :key="index">
                <div :class="item.awardType === 2 ? 'gift-bg' : 'award-bg'">
                    <div :class="item.awardType === 2 ? 'gift' : 'award'">
                        <!--礼品图片-->
                        <img class="img" v-if="item.show" :src="item.awardImg">
                        <img class="img" v-if="item.awardType === 2 && !item.show" src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/gift.png">
                    </div>
                    <div class="name">{{ item.show ? item.awardName : '智慧礼' }}</div>
                </div>
            </swiper-slide>
        </swiper>
        <!-- 礼品展示结束 -->
        <!-- 倒计时 -->
        <div class="count-down">
            <CountDown
                active-name="答题打卡"
                :status="activeDetail.activityStatus"
                :duration="activityDuration"
                tip-colour="#620003"
                :count="activeDetail.signinNumber"
                count-colour="#FE461F"
                time-bottom-colour="#FE461F"
                time-colour="#FFE3C8" />
        </div>
        <!-- 打卡答题 -->
        <div class="box-wrap">
            <div class="box-inner">
                <div class="head">
                    <button class="btn disabled" v-if="!activityIsOver && !activityIsStart">活动未开始</button>
                    <div class="info" v-else-if="!activityIsOver && activityIsStart">
                        <template
                            v-if="previousPresentIsReceive && currentSignIn.name && (!currentSignIn.hasSignin || (currentSignIn.hasSignin && !currentSignIn.hasAward))">

                            <div>
                                <div class="text">今日可签到打卡{{ currentSignIn.hasSignin? 0 : 1 }}次</div>
                                <div class="tips">还差{{ activeDetail.differenceNumber }}次打卡答题可参与智慧礼抽奖</div>
                            </div>
                            <button class="btn"
                                    :class="{disabled: currentSignIn.hasSignin || activityEarlyIsOver }"
                                    :disabled="currentSignIn.hasSignin || activityEarlyIsOver"
                                    @click="getMyNewYearCard">打卡答题</button>
                        </template>
                        <template v-if="(currentSignIn.hasSignin && currentSignIn.hasAward) || !previousPresentIsReceive">
                            <div>
                                <div class="text">{{ activeDetail.completeNumber }}人已完成打卡答题</div>
                                <div class="tips">可参与抽奖获得智慧礼</div>
                            </div>
                            <button
                                class="btn"
                                :disabled="currentSignIn.awardType !== ''"
                                :class="{disabled: currentSignIn.awardType !== '' }"
                                @click="receivePresent"
                            >
                                {{ currentSignIn.isLastIcon ? '立即抽奖' : '领取奖品' }}
                            </button>
                        </template>
                    </div>
                    <button class="btn" v-else-if="activityIsOver && !previousPresentIsReceive" @click="receivePresent">立即抽奖</button>
                    <button class="btn disabled" v-else>活动已结束</button>
                </div>
                <div class="sign-in-list">
                    <div class="sign-in-item" v-for="(item, index) in signInIconList" :key="index">
                        <SigninIcon
                            v-if="!item.isPresent"
                            :detail="item"
                            :has-signin="item.hasSignin"
                            :material-desc="item.materialDesc"
                            :icon-name="item.name"
                            :is-show-log="activeDetail.isShowLog"
                            :log-img-url="activeDetail.logImgUrl"
                            icon-img="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/un_checked.png"
                            icon-img-checked="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/checked.png"
                        />
                        <PresentIcon
                            v-else
                            :detail="item"
                            :has-signin="item.hasSignin"
                            :is-grand-prsent="item.isGrandPrsent"
                            :award-type="item.awardType"
                            :award-img="item.awardImg"
                            @clickHandler="presentWarning"
                            :total-signin="totalSigin"
                        />
                        <div v-if="(index !== signInIconList.length -1) && ((index + 1) % 5 !== 0)" class="underline" />
                    </div>
                </div>
            </div>
        </div>
        <Records
            action-name="打卡"
            active-name="智力题"
            record-text="小聪明的奖励"
            :my-present-list="myPresentList"
            v-if="id"
            :id="id"
        />
        <!-- 活动规则 -->
        <ActivityRule :active-detail="activeDetail" flaunt-award-name="智慧礼" />
        <!-- 分享海报 -->
        <SharePoster bgi="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/poster-bg.jpg"
                     :is-show-log="activeDetail.isShowLog" :log-img-url="activeDetail.logImgUrl" />
        <!-- 签到海报 -->
        <SigninPoster :show.sync="showSignInPoster" :poster-url="currentSignIn.posterUrl"
                      :is-show-log="activeDetail.isShowLog" :log-img-url="activeDetail.logImgUrl" />
        <!-- 中阶梯奖品弹框 -->
        <WinningGeneralPrize
            v-if="!currentSignIn.isLastIcon && presentStage === 1"
            :show.sync="isShowPresentPopup"
            :signed-in-number="activeDetail.signedInNumber"
            :award-type="currentPresentDetail.awardType"
            :award-img="currentPresentDetail.awardImg"
            :award-name="currentPresentDetail.awardName"
            :start-time="currentPresentDetail.formatStartTime"
            :end-time="currentPresentDetail.formatEndTime"
            :scholarship-amount="currentPresentDetail.scholarshipPrice"
            :amount="currentPresentDetail.price"
            :coupon-name="currentPresentDetail.couponName"
            :current-present-detail="currentPresentDetail"
            :top-bg="popUpPic"
            text-color="#ffdcb3"
            bg-color="linear-gradient(180deg, #F5651A 0%, #F01B15 100%)"
        />

        <!-- 错过阶梯奖品弹框 -->
        <MissingGeneralPrize
            v-if="!currentSignIn.isLastIcon && presentStage === 2"
            :show.sync="isShowPresentPopup"
            :need-sign-in-count="activeDetail.nextPresentIndex - activeDetail.signedInNumber"
            :active-detail="activeDetail"
            :sad-img="sadImg"
            :top-bg="popUpPic"
            text-color="#ffdcb3"
            btn-text-color="#F01516"
        />

        <!-- 中年味大奖前提示 -->
        <NoticingGrandPrize
            v-if="currentSignIn.isLastIcon && presentStage === 0"
            :show.sync="isShowPresentPopup"
            :flaunt-award-name="FLAUNT_AWARD_NAME"
            @close="receivePresent"
            text-color="#ffdcb3"
            bg-img="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/award_bg.png"
            award-img="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/smart_gift.png"
            bg-color="linear-gradient(180deg, #F5651A 0%, #F01B15 100%)"
        />

        <!-- 中年味大奖弹框 -->
        <WinningGrandPrize
            v-if="currentSignIn.isLastIcon && presentStage === 1"
            :show.sync="isShowPresentPopup"
            flaunt-award-name="智慧礼"
            :award-img="currentPresentDetail.awardImg"
            :award-name="currentPresentDetail.awardName"
            :start-time="currentPresentDetail.formatStartTime"
            :end-time="currentPresentDetail.formatEndTime"
            bg-img="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/award.png"
            text-color="#ffdcb3"
            detail-bg-color="#F01516"
            bg-color="linear-gradient(180deg, #F5651A 0%, #F01B15 100%)"
        />

        <!-- 错过年味大奖弹框 -->
        <MissingGrandPrize
            v-if="currentSignIn.isLastIcon && presentStage === 2"
            :show.sync="isShowPresentPopup"
            :sad-img="sadImg"
            :top-bg="popUpPic"
            text-color="#ffdcb3"
            btn-text-color="#F01516"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import ActivityRule from '../../../../components/marketing-activity/sign-in/Activity-Rule'
import SharePoster from '../../../../components/marketing-activity/sign-in/Poster'
import CountDown from '../../../../components/marketing-activity/sign-in/Count-Down'
import SigninIcon from '../../../../components/marketing-activity/sign-in/Signin-Icon'
import PresentIcon from '../../../../components/marketing-activity/sign-in/Present-Icon'
import Records from '../../../../components/marketing-activity/sign-in/Records'
import SigninPoster from '../../../../components/marketing-activity/sign-in/Signin-Poster'
import WinningGeneralPrize from '../../../../components/marketing-activity/sign-in/Winning-General-Prize'
import MissingGeneralPrize from '../../../../components/marketing-activity/sign-in/Missing-General-Prize'
import NoticingGrandPrize from '../../../../components/marketing-activity/sign-in/Noticing-Grand-Prize'
import WinningGrandPrize from '../../../../components/marketing-activity/sign-in/Winning-Grand-Prize'
import MissingGrandPrize from '../../../../components/marketing-activity/sign-in/Missing-Grand-Prize'
import { share } from '../../../../assets/js/wechat/wechat-share'
import { getServerTime } from '../../../../apis/base-api'
import { getSignInIconList, getPresentList, checkInCurrentNewYearIcon, statisticsViews, checkIsParticipateableActivity, receivePresent } from '../../../../apis/new-year'
const activity_member = { 0: '所有注册用户', 1: 'Helper用户', 2: '普通会员', 3: '商家指定用户' }
export default {
    components: {
        swiper,
        swiperSlide,
        ActivityRule,
        SharePoster,
        CountDown,
        SigninIcon,
        PresentIcon,
        Records,
        SigninPoster,
        WinningGeneralPrize,
        MissingGeneralPrize,
        NoticingGrandPrize,
        WinningGrandPrize,
        MissingGrandPrize
    },
    data () {
        return {
            id: '',
            // 是否为分享页面
            isShare: false,
            // 活动时间倒计时
            activityDuration: 0,
            activityEarlyIsOver: false,
            // 当前活动是否开始
            activityIsStart: false,
            // 活动是否已结束
            activityIsOver: false,
            // 是否显示分享海报
            isShowSharePoster: false,
            // 是否显示活动规则
            isShowRule: false,
            // 是否显示中奖提示
            isShowPresentPopup: false,
            // 上一个节点的礼品是否已领取
            previousPresentIsReceive: true,
            // 是否已经抽奖最终大奖
            isGrandPrsentSignIn: false,
            // 是否显示所有好友晒单列表
            showSunPresentListMore: false,
            // 是否显示所有我的奖品
            showMyPresentListMore: false,
            // 是否显示签到海报
            isShowNewYearPoster: false,
            // 海报是否在加载中
            isLoading: false,
            // 是否正在获取签到
            isGetMyNewYearCard: false,
            // 是否正在领取奖品
            isReceivePresent: false,
            activeDetail: {},
            presentList: [],
            // 签到图标表
            signInIconList: [],
            // 当前要签到节点
            currentSignIn: {},
            // 当前获得奖品的信息
            currentPresentDetail: {},
            // 好礼晒单列表
            sunPresentList: [],
            sunPresentListTotal: 0,
            // 我的礼品列表
            myPresentList: [],
            // 当前活动的二维码
            qrcode: '',
            // 分享海报
            sharePoster: '',
            // 签到海报
            newYearPoster: '',
            // 倒计时
            time: { d: '', h: '', m: '', s: '' },
            //  1- 好礼晒单 2-我的奖品
            presentListType: 1,
            // 当前获得奖品的阶段 0-领取前提示，1-中奖， 2-未中奖
            presentStage: 1,
            swiperOption: {
                direction: 'horizontal',
                effect: 'coverflow',
                speed: 1000,
                loop: true,
                slidesPerView: 3,
                spaceBetween: 24,
                autoplay: {
                    // 1秒切换一次
                    delay: 1000,
                    disableOnInteraction: false,
                    stopOnLast: false
                },
                observer: true,
                observeParents: true
            },
            FLAUNT_AWARD_NAME: '打卡聪明年',
            showSignInPoster: false,
            signInPosterBgi: '',
            totalSigin: 0,
            popUpPic: 'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/popup_top.png',
            sadImg: 'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/sad.png'
        }
    },
    computed: {
        ...mapGetters(['appId', 'logoUrl', 'avatar', 'mallUrl', 'userId'])
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if (from.name !== 'Activity') {
                vm.isShare = true
            } else {
                vm.isShare = false
            }
        })
    },
    async activated () {
        this.id = this.$route.params.id
        // 是否绑定手机,未绑定手机,去绑定手机
        if (!this.userId) {
            try {
                await this.$alert({
                    message: '新用户无法参加打卡聪明年有礼活动，请先绑定手机号',
                    confirmText: '去绑定手机号码'
                })
                sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                    name: this.$route.name,
                    params: { id: this.id }
                }))
                this.$router.push({ name: 'BindMobile' })
                return
            } catch (e) {
                sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                    name: this.$route.name,
                    params: { id: this.id }
                }))
                this.$router.push({ name: 'BindMobile' })
                return
            }
        }
        if (!this.id) {
            this.canNotJoinCurrentActivity()
            return
        }
        try {
            // 统计访问量
            await statisticsViews(this.id)
            // 是否能参与当前活动,不能参与返回
            await this.checkActivity()
        } catch (e) {
            throw e
        }
    },
    methods: {
    // 检查当前用户是否可参与当前活动
        async checkActivity () {
            try {
                const { result } = await checkIsParticipateableActivity(this.id)
                // 若当前用户无法参与当前活动直接跳到首页
                if (!result) {
                    this.canNotJoinCurrentActivity()
                    return
                }

                // 初始化页面
                await this.getPresentList()
                await this.getSignInIconList()
                this.share()
            } catch (e) {
                throw e
            }
        },
        // 初始化分享数据
        share () {
            share({
                appId: this.appId,
                title: '新春开学季, 打卡聪明年',
                desc: '参与新春开学季, 赢取聪明智慧礼，快来参与吧！',
                link: `${ this.mallUrl }/new-year-2021/sign-in${ this.id ? `/${ this.id }` : '' }?noCache=${ Date.now() }`,
                imgUrl: this.logoUrl
            })
        },
        // 无法参与活动，返回
        async canNotJoinCurrentActivity () {
            this.$warning('您无法参与活动，返回首页，更多活动等您开启')
            await setTimeout(() => {
                this.backMainActivityCenter()
            }, 3000)
        },
        // 返回
        backMainActivityCenter () {
            this.$router.replace({ name: 'Home' })
        },
        // 获取大奖列表
        async getPresentList () {
            try {
                const { result } = await getPresentList(this.id)
                this.presentList = result
                if (result.length === 2) {
                    this.presentList.push(this.presentList[0])
                    this.presentList.push(this.presentList[1])
                }
            } catch (e) {
                throw e
            }
        },
        // 获取签到列表
        async getSignInIconList () {
            try {
                const { result } = await getSignInIconList(this.id)
                const {
                    notes,
                    name,
                    userScope,
                    activityStartTime,
                    activityEndTime,
                    activityRule,
                    currentSignin,
                    nextSigninNote,
                    signinNumber,
                    completeNumber,
                    isShowLog,
                    logImgUrl,
                    activityStatus
                } = result
                this.totalSigin = notes.length
                // 活动状态 0 未开始 1 进行中  2 结束  3 已删除
                this.activityEarlyIsOver = [2, 3].indexOf(activityStatus) !== -1
                // 获取节点是否有奖品 + 获取已领取的奖品
                this.myPresentList.length = 0
                const presentList = []
                for (let i = 0; i < notes.length; i++) {
                    const item = notes[i]

                    // awardType ''表示尚未签到 0 未抽中 1 礼品 2 奖学金 3 全场满减券 4 品类券
                    // 当前节点有奖品,提取出奖品信息
                    if (item.hasAward) {
                        presentList.push({
                            presentIndex: i,
                            isPresent: true,
                            hasSignin: item.awardType !== '',
                            hasAward: item.hasAward,
                            awardImg: item.awardImg,
                            awardType: item.awardType,
                            isGrandPrsent: i === notes.length - 1
                        })
                    }

                    // item.awardType > 0,说明为当前已经的抽中奖品
                    if (item.awardType) {
                        this.myPresentList.push({
                            awardImg: item.awardImg,
                            awardType: item.awardType,
                            awardName: item.awardName,
                            isGrandPrsent: i === notes.length - 1
                        })
                    }
                }

                let currentSigninNote = currentSignin ? nextSigninNote - 1 : nextSigninNote
                currentSigninNote = nextSigninNote === '' ? notes.length : currentSigninNote
                const currentIndex = notes.findIndex(item => item.index === currentSigninNote)

                this.currentSignIn = notes[currentIndex]
                this.currentSignIn.isLastIcon = currentIndex === notes.length - 1

                // 上一个节点无礼品 或者 有礼品且awardType !== ''表示礼品已经被领取
                this.previousPresentIsReceive = currentIndex ? (notes[currentIndex - 1].hasAward && notes[currentIndex - 1].awardType !== '') || !notes[currentIndex - 1].hasAward : true

                // 大奖是否被领取，是-最后一签到，且awardType !== ''
                this.isGrandPrsentSignIn = this.currentSignIn.isLastIcon ? this.currentSignIn.awardType !== '' : false

                // 最后一个节点已签到，但未领取智慧礼, 弹框提示领取最终奖品
                if (this.currentSignIn.isLastIcon && this.currentSignIn.hasSignin && !this.isGrandPrsentSignIn) {
                    this.isShowPresentPopup = true
                    this.presentStage = 0
                }

                const nextPresentIndex = notes.findIndex((item, index) => item.hasAward && index > currentIndex)

                // 活动信息
                this.activeDetail = {
                    // 活动名称
                    name,
                    activityStartTime,
                    activityEndTime,
                    // 活动细则
                    activityRule,
                    // 今日是否已签到
                    currentSignin,
                    // 下一个要签到的节点
                    nextSigninNote,
                    // 积攒签到的人数
                    signinNumber,
                    // 集齐签到的人数
                    completeNumber,
                    // 已经签到的个数
                    signedInNumber: this.currentSignIn.hasSignin ? currentIndex + 1 : currentIndex,
                    // 还差多少个签到即可抽大奖
                    differenceNumber: this.currentSignIn.hasSignin ? notes.length - currentIndex - 1 : notes.length - currentIndex,
                    // 还差多少个签到即可参与抽奖
                    nextPresentIndex,
                    currentReceivePresentNote: this.previousPresentIsReceive ? this.currentSignIn.index : notes[currentIndex - 1].index,
                    activity_member: activity_member[userScope],
                    // 是否显示图片Logo 0-不显示，1-显示
                    isShowLog,
                    // Logo图片
                    logImgUrl,
                    activityStatus
                }

                // 将奖品信息添加到签到数组中
                for (let i = presentList.length - 1; i > -1; i--) {
                    const item = presentList[i]
                    notes.splice(item.presentIndex + 1, 0, item)
                }

                this.signInIconList = notes

                // 启动倒计时
                {
                    const { result: serverTime } = await getServerTime()
                    const now = serverTime
                    const start = moment(this.activeDetail.activityStartTime).valueOf()
                    const end = moment(this.activeDetail.activityEndTime).valueOf()
                    this.activityIsStart = now > start
                    this.activityIsOver = now > end
                    this.activityDuration = this.activityIsOver ? 0 : this.activityIsStart ? end - now : start - now
                }
            } catch (e) {
                throw e
            }
        },

        // 获得签到
        async getMyNewYearCard () {
            try {
                if (this.isGetMyNewYearCard) return
                if (this.currentSignIn.hasSignin) return
                this.isGetMyNewYearCard = true
                await checkInCurrentNewYearIcon(this.id, this.activeDetail.nextSigninNote)

                /* ********修改相应的参数，不刷新页面******** */
                this.currentSignIn.hasSignin = true
                this.currentSignIn.awardType = ''
                const currentIndex = this.signInIconList.findIndex(item => item.index === this.currentSignIn.index)
                this.signInIconList[currentIndex].hasSignin = true
                this.activeDetail.currentSignin = true
                this.activeDetail.nextSigninNote++
                this.activeDetail.completeNumber = this.currentSignIn.isLastIcon ? this.activeDetail.completeNumber += 1 : this.activeDetail.completeNumber
                this.activeDetail.currentReceivePresentNote = this.currentSignIn.index
                this.activeDetail.signedInNumber += 1
                this.activeDetail.differenceNumber -= 1
                this.isGrandPrsentSignIn = this.currentSignIn.isLastIcon ? this.currentSignIn.awardType !== '' : false

                // 统计签到人数
                this.activeDetail.signinNumber = this.activeDetail.nextSigninNote === 1 ? this.activeDetail.signinNumber += 1 : this.activeDetail.signinNumber
                this.isGetMyNewYearCard = false

                // 显示海报
                this.showSignInPoster = true
            } catch (e) {
                throw e
            }
        },

        // 领取奖品
        async receivePresent () {
            try {
                if (this.isReceivePresent) return
                this.isReceivePresent = true
                if ((!this.currentSignIn.hasAward || this.currentSignIn.awardType !== '') && this.previousPresentIsReceive) return
                const { result } = await receivePresent(this.id, this.activeDetail.currentReceivePresentNote)

                // 当前获得奖品的阶段 0-领取前提示，1-中奖， 2-未中奖
                this.presentStage = result.awardType ? 1 : 2
                // 初始化获奖信息
                result.formatStartTime = moment(result.startTime).format('YYYY-MM-DD')
                result.formatEndTime = moment(result.endTime).format('YYYY-MM-DD')
                result.price = result.awardType === 3 || result.awardType === 4 ? result.awardName.split('减')[1] : 0
                if ([3, 4].indexOf(result.awardType) !== -1) {
                    const priceList = (result.awardName).match(/(\d+\.?\d*)/gi)
                    result.price = (priceList && priceList.length > 1 && priceList[1]) || 0
                    result.couponName = `满${ priceList[0] }减${ result.price }`
                }
                this.currentPresentDetail = result

                /* ********修改相应的参数，不刷新页面******** */
                this.currentSignIn.awardType = result.awardType
                this.isGrandPrsentSignIn = this.currentSignIn.isLastIcon ? this.currentSignIn.awardType !== '' : false
                const deviation = this.previousPresentIsReceive ? 1 : -1
                const currentIndex = this.signInIconList.findIndex(item => item.index === this.currentSignIn.index)
                this.signInIconList[currentIndex + deviation].hasSignin = true
                this.signInIconList[currentIndex + deviation].awardImg = result.awardImg
                this.signInIconList[currentIndex + deviation].awardType = result.awardType
                this.signInIconList[currentIndex + deviation].isGrandPrsent = this.isGrandPrsentSignIn
                this.activeDetail.nextPresentIndex = this.signInIconList.findIndex((item, index) => item.hasAward && index > this.currentSignIn.index)
                this.previousPresentIsReceive = true
                if (this.isGrandPrsentSignIn) result.isGrandPrsent = true
                if (result.awardType) {
                    this.myPresentList.push(result)
                }
                this.isReceivePresent = false

                /* 显示中奖信息弹框 */
                this.isShowPresentPopup = true
            } catch (e) {
                throw e
            }
        },
        presentWarning (item) {
        // 只有礼品支持此提示
            if (!item.isPresent) return
            // 已领取的奖品不提示
            if (item.hasSignin) return
            if (!this.activityIsStart) return this.$warning('活动未开始')
            if (this.activityIsOver) return this.$warning('活动已结束')
            if (item.isGrandPrsent) return this.$warning(`签到参与所有${ item.presentIndex + 1 }个端午活动，有机会抽取粽粽大礼~`)
            return this.$warning(`签到参与${ item.presentIndex + 1 }个端午活动，即可领取粽粽礼品~`)
        }
    }
}
</script>

<style scoped lang="scss">
.sign-in{
  background: #C40E1A url("https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/sign_in_bg.png") no-repeat;
  background-size: 100% 553px;
  padding: 175px 0 30px;
  .present {
    margin: 0 auto;
    width: 80vw;
    height: 251px;
    display: flex;
    justify-content: center;
    .swiper-box{
      width: 197px;
      height: 251px;
      overflow: hidden;
    }
    .gift-bg{
      width: 197px;
      height: 251px;
      text-align: center;
      background: url("https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/gift_bg.png") no-repeat;
      background-size: 100% 100%;
      .gift{
        height: 178px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .award-bg{
      width: 197px;
      height: 251px;
      background: #EE4620;
      text-align: center;
      border-radius: 20px;
      .award{
        height: 178px;
        background: #FF981A;
        border-radius: 20px 20px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
      }
    }
    .img{
      width: 135px;
      height: 140px;
    }
    .name{
      width: 200px;
      @include elps();
      font-size: 28px;
      color: #fff;
    }
  }
  .count-down{
    margin-top: 17px;
    background: url("https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/count_down_bg.png") no-repeat;
    background-size: 100% 100%;
    height: 159px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-wrap{
    background: #FE461F;
    border-radius: 20px;
    margin: -20px 18px 56px;
    padding: 22px 28px 58px;
    .box-inner{
      background: #fff;
      border-radius: 20px;
      .head{
        background: #FFFAF5;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 20px 20px 0px 0px;
        height: 123px;
        display: flex;
        justify-content: center;
        align-items: center;
        .info{
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 25px;
          font-family: MicrosoftYaHei;
          .text{
            font-size: 26px;
            color: #0D0D0D;
          }
          .tips{
            margin-top: 11px;
            font-size: 22px;
            color: #313131;
          }
        }
        .btn{
          padding: 14px 40px;
          background: #FE461F;
          border-radius: 10px;
          font-size: 26px;
          color: #FFE3C8;
          &.disabled{
            background: rgba(252, 69, 33, .5);
          }
        }
      }
      .sign-in-list{
        padding: 34px 20px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .sign-in-item {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 95px;
          margin: 0 14px 30px;
          position: relative;
          .underline{
            position: absolute;
            top: 30%;
            right: -30%;
            width: 28px;
            height: 0;
            border: 1px solid #ff8a8a;
          }
        }
      }
    }
  }
}
</style>
