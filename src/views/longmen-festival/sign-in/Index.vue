<template>
    <div class="new-year-activity">
        <!-- 活动详情展示 -->
        <div class="activity-detail">
            <div class="top">
                <!--头部展示图-->
                <img class="header" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/longmen-signin-head.jpg" alt="">
                <!-- 礼品展示 -->
                <div class="present">
                    <div class="title">神秘大奖等你拿</div>
                    <div class="content">
                        <div class="one-present" v-if="presentList.length === 1">
                            <img class="gift-bg" v-if="presentList[0].show" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-large-gift.png" alt="">
                            <img class="gift-bg" v-else src="https://mallcdn.youpenglai.com/static/admall/2.9.0/large-gift.png" alt="">
                            <!--礼品图片-->
                            <img class="gift" v-if="presentList[0].show" :src="presentList[0].awardImg">
                            <span>{{ presentList[0].awardName || '粽粽大礼' }}</span>
                        </div>
                        <swiper :options="swiperOption" v-if="presentList.length > 1" class="swiper">
                            <swiper-slide v-for="(item,index) in presentList" :key="index" class="swiper-no-swiping">
                                <div class="swiper-box">
                                    <div class="img">
                                        <!--有礼品图片时的背景-->
                                        <img v-if="item.show" class="gift-bg" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-gift.png" alt="">
                                        <!--无礼品图片时的背景-->
                                        <img v-else class="gift-bg" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/small-gift-style.png" alt="">
                                        <!--礼品图片-->
                                        <img v-if="item.show" :src="item.awardImg" class="gift">
                                        <span>{{ item.awardName }}</span>
                                    </div>
                                </div>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>
                <!-- 展示海报按钮 -->
                <button class="show-poster" @click="showPoster">
                    <pl-svg name="icon-poster-512b1" fill="#fff" height="25" />
                    <span>海报</span>
                </button>
                <!-- 展示活动规则按钮 -->
                <button class="show-rule" @click="isShowRule = true">
                    活动规则
                </button>
            </div>

            <div class="bottom">
                <!-- 活动倒计时 -->
                <div class="count-down">
                    <img src="https://mallcdn.youpenglai.com/static/admall/2.9.0/obtain-gift-head.png" alt="">
                    <div class="desc">
                        <h3>
                            已有<span>{{ activeDetail.signinNumber }}</span>人参加端午粽粽有礼活动
                        </h3>
                        <div v-if="!activityIsOver">
                            距活动{{ activityIsStart? '结束' : '开始' }}仅剩<span>{{ time.d }}</span>天<span>{{ time.h }}</span>：<span>{{ time.m }}</span>：<span>{{ time.s }}</span>
                        </div>
                        <div v-else>活动已结束</div>
                    </div>
                </div>
                <!-- 参与活动 -->
                <div class="join-activity">
                    <div class="control-top">
                        <button v-if="!activityIsOver && !activityIsStart">活动未开始</button>
                        <div class="desc-control" v-else-if="!activityIsOver && activityIsStart">
                            <!-- 获得粽粽签到，显示条件: 上一个粽粽礼品已被领取 + 当前图标为粽粽有礼图标 + 当前图标未签到/已签到但是没有礼品 -->
                            <template
                                v-if="previousPresentIsReceive && currentSignIn.name && (!currentSignIn.hasSignin || (currentSignIn.hasSignin && !currentSignIn.hasAward))">
                                <p class="no-padding">
                                    <span>今日可签到参与{{ currentSignIn.hasSignin? 0 : 1 }}个端午活动</span>
                                    <span>还需签到参与{{ activeDetail.differenceNumber }}个端午活动即有机会参与抽奖</span>
                                </p>
                                <!-- 当前节点为已签到，灰化 -->
                                <button
                                    :class="{disabled: currentSignIn.hasSignin }"
                                    :disabled="currentSignIn.hasSignin"
                                    @click="getMyNewYearCard"
                                >
                                    立即签到
                                </button>
                            </template>
                            <!-- 立即领奖，显示条件: 上一个节点的礼品未领取 或者 当前节点已签到 + 当前节点有礼品 -->
                            <template v-if="(currentSignIn.hasSignin && currentSignIn.hasAward) || !previousPresentIsReceive">
                                <p>
                                    <span>{{ activeDetail.completeNumber }}人已签到参与所有端午活动</span>
                                    <span>可参与抽奖获得粽粽大礼</span>
                                </p>
                                <!-- 当前礼品已领取，按钮灰化 -->
                                <button
                                    :disabled="currentSignIn.awardType !== ''"
                                    :class="{disabled: currentSignIn.awardType !== '' }"
                                    @click="receivePresent"
                                >
                                    {{ currentSignIn.isLastIcon ? '立即抽奖' : '领取奖品' }}
                                </button>
                            </template>
                        </div>
                        <!-- 活动已结束，但上一个粽粽有礼的礼品未领取 -->
                        <button v-else-if="activityIsOver && (!previousPresentIsReceive || isGrandPrsentSignIn)"
                                @click="receivePresent">立即抽奖
                        </button>
                        <button v-else>活动已结束</button>
                    </div>
                    <div class="sign-in-icon-bottom">
                        <div class="sign-in-icon-item" v-for="(item, index) in signInIconList" :key="index">
                            <div v-if="!item.isPresent" class="icon-item"
                                 @click="drawNewYearCardPoster(item)"
                            >
                                <div class="icon">
                                    <img v-if="item.hasSignin"
                                         src="https://mallcdn.youpenglai.com/static/admall/2.9.0/did-siginin-icon.jpg">
                                    <img v-else class="not-sign"
                                         src="https://mallcdn.youpenglai.com/static/admall/2.9.0/no-signin-icon.jpg">
                                    <span v-if="!item.hasSignin" class="not-sign">{{ item.materialDesc }}</span>
                                </div>
                                <p :class="{'not-sign': !item.hasSignin}">{{ item.name }}</p>
                            </div>
                            <div v-else class="prensent-icon-item" @click="presentWarning(item)">
                                <!-- 未抽奖前普通奖品展示-->
                                <div v-if="!item.hasSignin && !item.isGrandPrsent">
                                    <pl-svg class="icon" name="icon-present" width="50" height="50" type="svg" />
                                    <img class="icon-bg" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-gift-icon.png" alt="">
                                    <p class="not-sign">礼品</p>
                                </div>
                                <!-- 未抽奖前粽粽大奖奖品展示-->
                                <div v-if="!item.hasSignin && item.isGrandPrsent">
                                    <img
                                        class="icon-bg"
                                        src="https://mallcdn.youpenglai.com/static/admall/2.9.0/small-gift-style.png">
                                    <p :class="{'not-sign': !item.hasSignin}">粽粽大礼</p>
                                </div>
                                <!-- 已抽奖,但是未抽中-->
                                <div v-if="item.hasSignin && (item.awardType === 0)">
                                    <img style="margin-left: 5px;" class="icon" src="https://mallcdn.youpenglai.com/static/admall/2.9.0/sad-zongzi.png" alt="">
                                    <img
                                        class="icon-bg"
                                        src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-signin-icon.jpg">
                                    <p>未中奖</p>
                                </div>
                                <!-- 奖品为礼品-->
                                <div v-if="item.hasSignin && (item.awardType === 1)">
                                    <img style="margin-left: 2px; margin-top: -2px;" class="icon" :src="item.awardImg || 'https://mallcdn.youpenglai.com/static/admall/2.9.0/series-course.png'">
                                    <img
                                        class="icon-bg"
                                        src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-signin-icon.jpg">
                                    <p>已获得</p>
                                </div>
                                <!-- 奖品为奖学金-->
                                <div v-if="item.hasSignin && (item.awardType === 2)">
                                    <img
                                        class="icon"
                                        src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png">
                                    <img
                                        class="icon-bg"
                                        src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-signin-icon.jpg">
                                    <p>已获得</p>
                                </div>
                                <!-- 奖品为优惠券-->
                                <div v-if="item.hasSignin && (item.awardType === 3 || item.awardType === 4)">
                                    <img
                                        class="icon"
                                        src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png">
                                    <img
                                        class="icon-bg"
                                        src="https://mallcdn.youpenglai.com/static/admall/2.9.0/empty-signin-icon.jpg">
                                    <p>已获得</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 已获得奖品展示区 -->
        <div class="present-list">
            <div class="top">
                <button @click="clickPrensentType(1)" :class="{'is-selected': presentListType === 1}">
                    <span>好礼晒单</span>
                </button>
                <div class="divider-line" />
                <button @click="clickPrensentType(2)" :class="{'is-selected': presentListType === 2}">
                    <span>我的奖品</span>
                </button>
            </div>
            <div class="bottom">
                <div class="sun-present" v-if="presentListType === 1">
                    <div class="statistics">
                        已有<span>{{ sunPresentListTotal }}人</span>获得端午礼品
                    </div>
                    <div class="no-sun-present" v-if="sunPresentList.length === 0">
                        <img
                            src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/53a110f2-9d45-4f60-95d8-99bf75e4b1c3.png">
                    </div>
                    <template v-else>
                        <template v-for="(item, index) in sunPresentList">
                            <div class="sun-present-item" v-if="index < 3 || showSunPresentListMore" :key="index">
                                <!-- 礼品展示 -->
                                <span v-if="item.awardType === 1 && item.flauntAward === 2" class="grand-present">
                                    <img class="small"
                                         src="https://mallcdn.youpenglai.com/static/admall/2.9.0/small-gift-style.png">
                                    <i> 粽粽大礼</i>
                                </span>
                                <!-- 奖学金 -->
                                <img v-else-if="item.awardType === 2"
                                     src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png">
                                <!-- 优惠券 -->
                                <img v-else-if="item.awardType === 3 || item.awardType === 4"
                                     src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png">
                                <img v-else class="small"
                                     src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/f53995cc-7c11-40ca-902c-4f34cda1d075.png">
                                <!-- 头像-->
                                <img class="avatar" :src="item.userImg" :onerror="default_avatar">
                                <!-- 礼品描述 -->
                                <h3>
                                    <p>{{ item.userName }}签到参与了<span class="orange">{{ item.signinNum }}</span>个端午活动</p>
                                    <p> 开启礼品 获得{{ item.awardName }} </p>
                                </h3>
                            </div>
                        </template>
                        <div
                            v-if="sunPresentList.length > 3 && !showSunPresentListMore"
                            class="more"
                            @click="showSunPresentListMore = true"
                        >
                            查看更多
                        </div>
                    </template>
                </div>
                <div class="my-present" v-if="presentListType === 2">
                    <div class="statistics">
                        我获得<span>{{ myPresentList.length }}个</span>端午礼品
                    </div>
                    <div class="no-sun-present" v-if="myPresentList.length === 0">
                        <img
                            src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/53a110f2-9d45-4f60-95d8-99bf75e4b1c3.png">
                    </div>
                    <template v-else>
                        <template v-for="(item, index) in myPresentList">
                            <div class="my-present-item" v-if="index < 3 || showMyPresentListMore" :key="index">
                                <!-- 礼品展示 -->
                                <span>
                                    <!-- 礼品 -->
                                    <img v-if="item.awardType === 1" :src="item.awardImg">
                                    <!-- 奖学金 -->
                                    <img v-else-if="item.awardType === 2"
                                         src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/996b630f-df02-44ae-83fb-77b3231c8a0c.png">
                                    <!-- 全场满减券/品类券 -->
                                    <img v-else-if="item.awardType === 3 || item.awardType === 4"
                                         src="https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/8d19c35d-00e9-4943-9458-d4b35a22bc72.png">
                                    <i :class="{'grand-prize': item.isGrandPrsent}">粽粽大礼</i>
                                </span>
                                <!-- 礼品描述 -->
                                <h3>
                                    <p>奖品 【{{ awardTypeDesc[item.awardType] }}】 </p>
                                    <p class="orange">{{ item.awardName }}</p>
                                </h3>
                            </div>
                        </template>
                        <div
                            v-if="myPresentList.length > 3 && !showMyPresentListMore"
                            class="more"
                            @click="showMyPresentListMore = true"
                        >
                            查看更多
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!-- 活动规则 -->
        <ActivityRule :show.sync="isShowRule" :active-detail="activeDetail" />

        <!-- 显示分享海报 -->
        <SharePoster :show.sync="isShowSharePoster" :poster="sharePoster" />

        <!-- 显示粽粽签到海报 -->
        <SharePoster :show.sync="isShowNewYearPoster" :poster="newYearPoster" @close="hiddenNewYearCardPoster" />

        <!--显示中奖信息-->
        <PresentPopup
            :show.sync="isShowPresentPopup"
            :is-last-icon="currentSignIn.isLastIcon"
            :present-stage="presentStage"
            :active-detail="activeDetail"
            :current-present-detail="currentPresentDetail"
            @close="receivePresent"
        />
    </div>
</template>

<script>
import {
    getObtainedSunPresentList,
    getPresentList,
    getSignInIconList,
    checkInCurrentNewYearIcon,
    receivePresent,
    checkIsParticipateableActivity,
    statisticsViews
} from '../../../apis/new-year'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { generateQrcode, drawRoundRect, cutArcImage, createText, Countdown } from '../../../assets/js/util'
import share from '../../../assets/js/wechat/wechat-share'
import { getServerTime } from '../../../apis/base-api'
import { mapGetters } from 'vuex'
import moment from 'moment'
import SharePoster from '../../../components/common/Share-Poster'
import PresentPopup from './components/Present-Popup.vue'
import ActivityRule from './components/Activity-Rule.vue'

const activity_member = {
    0: '所有注册用户',
    1: 'Helper用户',
    2: '普通会员',
    3: '商家指定用户'
}
const default_avatar = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/default-avatar.png'
const countdownInstanceList = []
export default {
    name: 'NewYearActivity',
    components: {
        swiper,
        swiperSlide,
        SharePoster,
        PresentPopup,
        ActivityRule
    },
    data () {
        return {
            id: '',
            // 是否为分享页面
            isShare: false,
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
            // 是否显示粽粽有礼海报
            isShowNewYearPoster: false,
            // 海报是否在加载中
            isLoading: false,
            // 是否正在获取粽粽签到
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
            // 粽粽有礼海报
            newYearPoster: '',
            // 倒计时
            time: {
                d: '',
                h: '',
                m: '',
                s: ''
            },
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
            awardTypeDesc: {
                1: '礼品',
                2: '奖学金',
                3: '全场满减券',
                4: '品类券'
            },
            default_avatar: `this.src="${ default_avatar }"`
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
                    message: '新用户无法参加粽粽有礼活动，请先绑定手机号',
                    confirmText: '去绑定手机号码'
                })
                sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                    name: this.$route.name,
                    params: { id: this.id }
                }))
                this.$router.push({ name: 'BindMobile' })
            } catch (e) {
                sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                    name: this.$route.name,
                    params: { id: this.id }
                }))
                this.$router.push({ name: 'BindMobile' })
            }
        }
        if (!this.id) {
            this.canNotJoinCurrentActivity()
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
    deactivated () {
        // 停止所有定时器
        for (const item of countdownInstanceList) {
            if ('stop' in item) {
                item.stop()
            }
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
                await this.init()
                this.share()
            } catch (e) {
                throw e
            }
        },

        // 初始化分享数据
        share () {
            share({
                appId: this.appId,
                title: '粽粽有礼, 端午安康',
                desc: '参与端午活动，赢取粽粽大礼，快来参与吧！',
                link: `${ this.mallUrl }/longmen-festival/sign-in/${ this.id ? `/${ this.id }` : '' }?noCache=${ Date.now() }`,
                imgUrl: this.logoUrl
            })
        },

        // 初始化页面
        async init () {
            try {
                // 停止所有定时器
                for (const item of countdownInstanceList) {
                    if ('stop' in item) {
                        item.stop()
                    }
                }
                await this.getObtainedSunPresentList()
                await this.getPresentList()
                await this.getSignInIconList()

                // 生成当前活动的二维码
                const qrcode = await generateQrcode({ size: 500, text: `${ this.mallUrl }/longmen-festival/sign-in${ this.id ? `/${ this.id }` : '' }?t=${ Date.now() }` })
                this.qrcode = new Image()
                this.qrcode.src = qrcode
            } catch (e) {
                throw e
            }
        },

        // 获取好友晒单奖品列表
        async getObtainedSunPresentList () {
            try {
                const { result } = await getObtainedSunPresentList(this.id, 1, 50)
                this.sunPresentListTotal = result.receiveUserNumber
                this.sunPresentList = result.flauntAwardsModels
            } catch (e) {
                throw e
            }
        },

        // 获取粽粽大奖列表
        async getPresentList () {
            try {
                const { result } = await getPresentList(this.id)
                // 神秘大奖的名称
                let index = 1
                const isMulNotShowPresent = result.filter(item => !item.show).length > 1
                // 粽粽大奖列表awardType只为1(礼品)，其他类型不可作为粽粽大奖
                this.presentList = result.map(item => {
                    item.awardName = item.show ? item.awardName : '神秘大奖'
                    if (!item.show && isMulNotShowPresent) {
                        item.awardName = `神秘大奖${ index }`
                        index++
                    }
                    return item
                })
                if (this.presentList.length === 2) {
                    this.presentList.push(this.presentList[0])
                    this.presentList.push(this.presentList[1])
                }
            } catch (e) {
                throw e
            }
        },

        // 获取粽粽签到列表
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
                    logImgUrl
                } = result

                // 获取节点是否有奖品 + 获取已领取的奖品
                this.myPresentList.length = 0
                const presentList = []
                for (let i = 0; i < notes.length; i++) {
                    const item = notes[i]

                    // awardType ''表示尚未签到 0 未抽中 1 礼品 2 奖学金 3 全场满减券 4 品类券/**/
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

                // 大奖是否被领取，是-最后一粽粽，且awardType !== ''
                this.isGrandPrsentSignIn = this.currentSignIn.isLastIcon ? this.currentSignIn.awardType !== '' : false

                // 最后一个节点已签到，但未领取粽粽大奖, 弹框提示领取最终奖品
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
                    // 积攒粽粽有礼的人数
                    signinNumber,
                    // 集齐粽粽有礼的人数
                    completeNumber,
                    // 已经签到的个数
                    signedInNumber: this.currentSignIn.hasSignin ? currentIndex + 1 : currentIndex,
                    // 还差多少个粽粽签到即可抽粽粽大奖
                    differenceNumber: this.currentSignIn.hasSignin ? notes.length - currentIndex - 1 : notes.length - currentIndex,
                    // 还差多少个签到即可参与抽奖
                    nextPresentIndex,
                    currentReceivePresentNote: this.previousPresentIsReceive ? this.currentSignIn.index : notes[currentIndex - 1].index,
                    activity_member: activity_member[userScope],
                    // 是否显示图片Logo 0-不显示，1-显示
                    isShowLog,
                    // Logo图片
                    logImgUrl
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
                    // 活动未开始
                    if (start > now) {
                        this.activityIsStart = false
                        this.countdown(start - now)
                        // 活动未结束
                    } else if (end > now) {
                        this.activityIsStart = true
                        this.countdown(end - now)
                        // 活动已结束
                    } else if (now > end) {
                        this.activityIsOver = true
                        this.activityIsStart = true
                    } else {
                        this.canNotJoinCurrentActivity()
                    }
                }
            } catch (e) {
                throw e
            }
        },

        // 获得粽粽签到
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

                // 统计签到人数
                this.activeDetail.signinNumber = this.activeDetail.nextSigninNote === 1 ? this.activeDetail.signinNumber += 1 : this.activeDetail.signinNumber
                this.isGetMyNewYearCard = false

                // 显示海报
                this.drawNewYearCardPoster(this.currentSignIn)
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

                /* 显示中奖信息弹框 */
                this.isShowPresentPopup = true
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
                if ([2].indexOf(result.awardType) !== -1) {
                    const priceList = (result.awardName).match(/(\d+\.?\d*)/gi)
                    result.price = (priceList && priceList.length && priceList[0]) || 0
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
            } catch (e) {
                throw e
            }
        },

        // 生成活动分享海报
        async showPoster () {
            try {
                if (this.isLoading) return
                if (this.sharePoster) {
                    this.isShowSharePoster = true
                    return
                }
                this.isLoading = true
                const bgImgUrl = 'https://mallcdn.youpenglai.com/static/admall/2.9.0/longmen-signin-poster.png'
                const bgImg = await this.loadImage(bgImgUrl)
                const canvas = document.createElement('canvas')
                canvas.width = bgImg.width
                canvas.height = bgImg.height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
                ctx.drawImage(this.qrcode, canvas.width / 2 - 118, canvas.height / 2 + 175, 240, 240)
                const sharePoster = canvas.toDataURL('image/jpeg', 0.7)
                this.sharePoster = sharePoster
                this.isShowSharePoster = true
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },

        // 生成粽粽有礼海报
        async drawNewYearCardPoster (item) {
            const imgUrl = item.posterUrl
            const desc = item.name

            const isSignIN = item.hasSignin
            if (!isSignIN) {
                if (!this.activityIsStart) return this.$warning('活动未开始')
                if (this.activityIsOver) return this.$warning('活动已结束')
                if (!this.currentSignIn.hasSignin) return this.$warning('今日可签到参与1个端午活动，请点击获取')
                return this.$warning('今日已签到参与1个端午活动，请明日再来~')
            }
            if (this.isLoading) return
            try {
                this.isLoading = true
                this.isShowNewYearPoster = false
                const bgImg = await this.loadImage(imgUrl)
                const canvas = document.createElement('canvas')
                canvas.width = bgImg.width
                canvas.height = bgImg.height
                const ctx = canvas.getContext('2d')

                // 绘制背景
                ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)

                // 绘制机构logo
                if (this.activeDetail.isShowLog) {
                    const logoBg = await this.loadImage('https://mallcdn.youpenglai.com/static/mall/2.0.0/new-year-activity/abcfae1b-54ff-41d1-b973-0b483847cc05.svg')
                    let logo = await this.loadImage(this.activeDetail.logImgUrl)
                    logo = await cutArcImage(logo)
                    ctx.drawImage(logoBg, 0, 0, 120, 107)
                    ctx.drawImage(logo, 10, 8, 66, 66)
                }

                // 绘制头像
                let avatar = this.avatar || default_avatar
                avatar = await this.loadImage(avatar)
                avatar = await cutArcImage(avatar)
                drawRoundRect(ctx, 24, 840, 100, 100, 50, '#038C1A', '#038C1A')
                ctx.drawImage(avatar, 25, 841, 98, 98)

                // 绘制粽粽有礼描述
                ctx.font = '20px bold'
                ctx.fillStyle = '#000'
                ctx.textBaseline = 'hanging'
                createText(ctx, 134, 860, desc, 34, 138, 1)
                createText(ctx, 134, 890, '粽粽有礼', 34, 138, 1)

                // 绘制二维码
                drawRoundRect(ctx, 250, 840, 100, 100, 10, '#038C1A', '#038C1A')
                ctx.drawImage(this.qrcode, 252, 842, 96, 96)

                // 绘制二维码旁的文字
                ctx.font = '20px bold'
                ctx.fillStyle = '#000'
                ctx.textBaseline = 'hanging'
                createText(ctx, 360, 852, '长按识别保存图片分享给好友，一起参与活动', 24, 136, 3)

                const sharePoster = canvas.toDataURL('image/jpeg', 0.7)
                this.newYearPoster = sharePoster
                this.isShowNewYearPoster = true
            } catch (e) {
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async presentWarning (item) {
        // 只有礼品支持此提示
            if (!item.isPresent) return
            // 已领取的奖品不提示
            if (item.hasSignin) return
            if (!this.activityIsStart) return this.$warning('活动未开始')
            if (this.activityIsOver) return this.$warning('活动已结束')
            if (item.isGrandPrsent) return this.$warning(`签到参与所有${ item.presentIndex + 1 }个端午活动，有机会抽取粽粽大礼~`)
            return this.$warning(`签到参与${ item.presentIndex + 1 }个端午活动，即可领取粽粽礼品~`)
        },

        // 加载图片
        async loadImage (src) {
            const img = new Image()
            img.crossOrigin = ''
            img.src = `${ src }?time=${ Date.now() }`
            return new Promise((resolve, reject) => {
                img.onload = function () {
                    resolve(img)
                }
                img.onerror = function (e) {
                    reject(e)
                }
            })
        },

        // 无法参与活动，返回
        async canNotJoinCurrentActivity () {
            this.$warning('您无法参与活动，返回首页，更多活动等您开启')
            await setTimeout(() => {
                this.backMainActivityCenter()
            }, 3000)
        },

        // 切换展示的奖品列表
        clickPrensentType (type) {
            this.presentListType = type
            this.showMyPresentListMore = false
            this.showSunPresentListMore = false
        },

        // 隐藏粽粽有礼海报
        hiddenNewYearCardPoster () {
            this.isShowNewYearPoster = false

            // 最后一个节点已签到，但未领取粽粽有礼大奖, 弹框提示领取最终奖品
            if (this.currentSignIn.isLastIcon && !this.isGrandPrsentSignIn) {
                this.isShowPresentPopup = true
                this.presentStage = 0
            }
        },

        // 返回
        backMainActivityCenter () {
            this.$router.replace({ name: 'Home' })
        },

        // 倒计时
        countdown (datetime) {
            if (datetime < 0) return
            const countdownInstance = new Countdown(datetime, data => {
                if (!data) {
                    // 倒计时结束，刷新数据
                    this.init()

                    // 清除时间残留
                    this.time.d = ''
                    return
                }
                const d = String(data.days)
                const h = String(data.hours)
                const m = String(data.minutes)
                const s = String(data.seconds)

                // 活动进行中，跨天更新当前签到信息
                if (!this.activityIsOver && this.activityIsStart && this.time.d !== '' && Number(this.time.d) !== Number(d)) {
                    this.previousPresentIsReceive = (this.currentSignIn.hasAward && this.currentSignIn.awardType !== '') || !this.currentSignIn.hasAward
                    let currentIndex = this.signInIconList.findIndex(item => item.index > this.currentSignIn.index)
                    currentIndex = currentIndex < 0 ? this.currentSignIn.index : currentIndex
                    this.currentSignIn = this.currentSignIn.hasSignin ? this.signInIconList[currentIndex] : this.currentSignIn
                    this.activeDetail.currentReceivePresentNote = this.currentSignIn.index
                }
                this.time.d = d.padStart(2, '0')
                this.time.h = h.padStart(2, '0')
                this.time.m = m.padStart(2, '0')
                this.time.s = s.padStart(2, '0')
            })
            countdownInstance.start()
            countdownInstanceList.push(countdownInstance)
        }
    }
}
</script>

<style scoped lang="scss">
  .new-year-activity {
    width: 100vw;
    background-color: #56b396;
    padding-bottom: 60px;
    position: relative;

    .activity-detail {
      background-size: contain;

      .top {
        position: relative;

        .header {
          width: 100%;
          object-fit: cover;
        }

        .present {
          position: relative;
          padding-top: 70px;

          .title {
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            width: 100%;
            padding-top: 16px;
            line-height: 150px;
            text-align: center;
            font-size: 34px;
            color: #F8F7DE;
            background: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/longmen-signin-title.png') top no-repeat;
            background-size: contain;
          }

          .content {
            position: relative;
            height: 441px;
            margin: 0 24px;
            border-radius: 15px;
            background-color: #FFFFF8;
            background-image: url('https://mallcdn.youpenglai.com/static/admall/2.9.0/spray.png');
            background-position: bottom;
            background-repeat: no-repeat;
            background-size: contain;

            .one-present {
              position: absolute;
              top: 63px;
              left: 50%;
              transform: translateX(-50%);
              text-align: center;

              .gift-bg {
                width: 354px;
                object-fit: cover;
              }

              .gift {
                position: absolute;
                top: 56px;
                left: 50%;
                transform: translateX(-50%);
                width: 150px;
                height: 150px;
                margin-left: -2px;
                border-radius: 50%;
              }

              > span {
                position: absolute;
                bottom: 12px;
                left: 50%;
                transform: translateX(-50%);
                width: 200px;
                @include elps();
                font-size: 40px;
                color: #FFF;
              }
            }
          }
        }

        .swiper {
          width: 80vw;
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);

          .swiper-no-swiping {
            .swiper-box {
              position: relative;
              width: 200px;
              height: 300px;
              border-radius: 20px;
              overflow: hidden;

              .img {
                position: relative;
                text-align: center;
                .gift-bg {
                  width: 200px;
                  text-align: center;
                  object-fit: cover;
                }
                .gift {
                  position: absolute;
                  top: 62px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 140px;
                  height: 140px;
                  border-radius: 50%;
                }
                span {
                  position: absolute;
                  bottom: 35px;
                  left: 50%;
                  transform: translateX(-50%);
                  font-size: 24px;
                  color: #56b396;
                  width: 120px;
                  @include elps();
                }
              }
            }
          }
        }

        .show-poster {
          position: absolute;
          right: 0;
          top: 306px;
          z-index: 1;
          width: 100px;
          height: 48px;
          border: 1px solid rgba(255, 159, 75, 1);
          border-right: none;
          border-radius: 24px 0 0 24px;
          line-height: 48px;
          background: linear-gradient(90deg, rgba(132, 236, 225, 1) 0%, rgba(85, 179, 148, 1) 100%);
          letter-spacing: 2px;

          > svg {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            vertical-align: middle;
          }

          > span {
            display: inline-block;
            margin-left: 32px;
            font-size: 20px;
            color: #fff;
          }
        }

        .show-rule {
          position: absolute;
          right: 0;
          top: 366px;
          width: 120px;
          height: 48px;
          border: 1px solid rgba(255, 159, 75, 1);
          border-right: none;
          border-radius: 24px 0 0 24px;
          line-height: 48px;
          background: linear-gradient(90deg, rgba(131, 234, 223, 1) 0%, rgba(85, 179, 148, 1) 100%);
          z-index: 1;
          font-size: 20px;
          color: #fff;
          text-align: right;
          padding-right: 8px;
          letter-spacing: 2px;
        }
      }

      .bottom {
        position: relative;
        margin: 60px 15px 0;
        overflow: hidden;

        .count-down {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          line-height: 140px;

          > img {
            position: absolute;
            width: 100%;
          }

          .desc {
            position: relative;
            margin-top: 100px;
            margin-left: 48px;
            text-align: center;
            line-height: 40px;

            > h3 {
              font-size: 28px;
              color: #F8F7DE;

              span {
                color: #FFC885;
              }
            }

            > div {
              margin-top: 10px;
              font-size: 26px;
              color: #FFC885;

              span {
                min-width: 32px;
                height: 36px;
                margin: 0 2px;
                padding: 0 2px;
                border-radius:4px;
                text-align: center;
                display: inline-block;
                background-color: #F8F7DE;
                color: #3E9F7F;
              }
            }
          }
        }

        .join-activity {
          margin: 175px 13px 0;
          min-height: 500px;
          background: #fff;
          border-radius: 20px;

          .control-top {
            padding: 60px 0 30px;
            display: flex;
            justify-content: center;
            box-shadow: 0 3px 6px rgba(0, 0, 0, .16);

            button {
              height: 64px;
              width: 220px;
              line-height: 64px;
              font-size: 26px;
              color: #FFF;
              background: #FF9F4B;
              border-radius: 10px;
              text-align: center;

              &.disabled {
                background: rgba(255,159,75, .5);
              }
            }

            > .desc-control {
              display: flex;
              flex-direction: row;
              justify-content: space-between;

              p {
                display: inline-block;
                padding-right: 100px;

                &.no-padding {
                  padding-right: 20px;
                }

                span {
                  display: block;
                  font-size: 26px;
                  color: #3E9F7F;

                  &:last-child {
                    font-size: 22px;
                    color: #EAA529;
                    padding-top: 10px;
                  }
                }
              }
            }
          }

          .sign-in-icon-bottom {
            padding: 20px 30px;
            margin-right: -36px;

            .sign-in-icon-item {
              display: inline-block;
              box-sizing: border-box;
              width: 20%;
              padding: 10px 0;

              .icon-item {
                display: inline-block;

                .icon {
                  position: relative;
                  text-align: center;

                  img {
                    width: 95px;
                    height: 112px;
                    object-fit: contain;
                  }

                  span {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    margin-top: -3px;
                    color: #ffe3c8;
                    font-size: 36px;

                    &.not-sign {
                      color: #fff;
                    }
                  }
                }

                > p {
                  color: #FFA659;
                  font-size: 20px;
                  line-height: 40px;
                  text-align: center;

                  &.not-sign {
                    color: #2E9472;
                  }
                }
              }

              .prensent-icon-item {
                display: inline-block;

                > div {
                  position: relative;
                  text-align: center;

                  > .icon-bg {
                    width: 95px;
                    height: 112px;
                    object-fit: contain;
                  }
                  .icon {
                    position: absolute;
                    top: 33px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    object-fit: contain;
                  }

                  > p {
                    color: #FFA659;
                    font-size: 20px;
                    line-height: 40px;

                    &.not-sign {
                      color: #2E9472;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .present-list {
      min-height: 500px;
      padding-bottom: 20px;
      margin: 14px 32px 0;
      background-color: #fff;
      border-radius: 20px;

      .top {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;

        button {
          color: #787878;
          font-size: 32px;
          position: relative;

          &.is-selected {
            font-weight:bold;
            color: #41AF8A;

            span {
              position: relative;
              z-index: 1;
            }
          }
        }

        .divider-line {
          margin: 0 100px;
          display: inline-block;
          width: 0;
          height: 34px;
          border: 2px solid rgba(201, 201, 201, 1);
        }
      }

      .bottom {
        text-align: center;

        .statistics {
          margin: 0 150px;
          height: 54px;
          line-height: 54px;
          background: #F8F7DE;
          border-radius: 34px;
          font-size: 26px;
          color: #EBAC3A;
        }

        .no-sun-present {
          margin-top: 40px;
          text-align: center;

          > img {
            width: 200px;
          }
        }

        .sun-present-item {
          display: flex;
          align-items: center;
          margin: 15px 30px;
          border-bottom: 1px solid #c9c9c9;
          padding-bottom: 15px;

          .grand-present {
            position: relative;
            display: inline-block;

            img {
              width: 200px;
              object-fit: contain;
            }

            i {
              padding: 0 8px;
              display: block;
              position: absolute;
              top: 0;
              left: 50%;
              width: 80px;
              height: 30px;
              border-radius: 20px;
              line-height: 30px;
              font-size: 20px;
              background-color: #2E9472;
              color: #fff;
            }
          }

          img {
            width: 80px;
            object-fit: contain;

            &.small {
              width: 60px;
              margin: 0 10px;
            }

            &.avatar {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              margin-left: 30px;
              object-fit: cover;
            }
          }

          h3 {
            text-align: left;
            margin-left: 25px;
            font-size: 26px;
            line-height: 40px;
            color: #333;
            font-weight: 400;

            p:last-child {
              font-size: 24px;
              color: #999;
            }

            .orange {
              color: #fa4d2f;
            }
          }
        }

        .my-present-item {
          display: flex;
          align-items: center;
          margin: 15px 30px;
          border-bottom: 1px solid #c9c9c9;
          padding-left: 20px;
          padding-bottom: 15px;

          > span {
            position: relative;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background-color: #FF9F4B;

            img {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 80px;
              height: 100px;
              border-radius: 50%;
              object-fit: contain;
            }

            i {
              display: none;
            }

            .grand-prize {
              padding: 0 8px;
              display: block;
              position: absolute;
              top: 0;
              left: 50%;
              background-color: #2E9472;
              border-radius: 20px;
              height: 30px;
              line-height: 30px;
              width: 80px;
              font-size: 20px;
              color: #FFF;
            }
          }

          h3 {
            text-align: left;
            font-size: 26px;
            font-weight: 400;
            line-height: 40px;
            color: #333;
            margin-left: 70px;

            .orange {
              color: #fa4d2f;
            }
          }
        }

        .more {
          font-size: 26px;
          line-height: 35px;
          color: #333;
        }
      }
    }
  }

</style>
