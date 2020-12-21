<template>
    <div id="app">
        <router-link
            tag="h1"
            to="/new-year-2021/sign-in/1339750621159698434"
            style="font-size: 60px;"
            v-if="$route.name !== 'NewYearSignIn'"
        >
            打卡聪明年
        </router-link>
        <router-link
            tag="h1"
            to="/happy-lottery/1337645128306774018"
            style="font-size: 60px;"
            v-if="$route.name !== 'HappyLottery'"
        >
            抽奖乐翻天
        </router-link>
        <keep-alive :exclude="exclude">
            <router-view />
        </keep-alive>

        <navbar v-if="showNavbar.indexOf($route.name) > -1" />
        <QuickNavbar v-else />
        <!-- 新人有礼浮窗 -->
        <NewUserHomePop
            v-if="$route.name === 'Home' && isNewUser"
            :show.sync="showNewUser"
            :id="newUserActiveId"
        />
        <NewUserHomeBtn
            v-if="$route.name === 'Home' && isNewUser && !showNewUser"
            :id="newUserActiveId"
        />
    </div>
</template>

<script>
import Navbar from './components/common/Navbar.vue'
import QuickNavbar from './components/common/Quick-Navbar.vue'
import NewUserHomePop from './views/marketing-activity/playing-methods/newcomers/components/New-User-Home-Pop.vue'
import NewUserHomeBtn from './views/marketing-activity/playing-methods/newcomers/components/New-User-Home-Btn.vue'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import {
    SET_THEME,
    GET_ACTIVITY_DATA,
    GET_SKIN_ID,
    SET_LIVE_INFO,
    SET_COUPON_INFO,
    SET_NW_EVENT,
    SET_DRAGON_GATE_CHARITY,
    SET_CURRENT_SIGN,
    SET_CURRENT_LOTTERY,
    SET_MALL_QRCODE_INFO
} from './store/mutation-type'
import {
    getLiveInfo,
    getMyCouponInfo,
    getNianweiInfo,
    getDragonGateCharityInfo,
    getCurrentSign,
    getCurrentLottery,
    getMallQRCodeInfo
} from './apis/home'
import { setFirstVisit } from './apis/longmen-festival/lottery'
// 新人有礼
import { isNewUser, getGoingInfo } from './apis/newcomers'
import { share } from './assets/js/wechat/wechat-share'

// 需要自定义分享的路由
const customShare = [
    'Product',
    'Curriculum',
    'LiveRoom',
    'InviteNewcomers',
    'Newcomers',
    'Classify',
    'CoursePackage',
    'SpringPloughing',
    'HappyLottery'
]
// 采取默认分享的路由，不需要自己配置分享信息，会拉取当前商城的一些信息
const shareRoutes = [
    'Home',
    'My',
    'Appointment',
    'DoubleTwelveDay',
    'Activity',
    'BattlefieldReport',
    'EpidemicSignIn',
    'LongmenLottery',
    'LongmenAction',
    'LongmenSignIn',
    'RedPackage',
    'RedPackageDetail'
]
const configShare = to => {
    if (!customShare.includes(to.name) && !shareRoutes.includes(to.name)) {
        // 禁止分享
        window.wx.hideOptionMenu()
        return false
    }
    window.wx.showOptionMenu()
    return true
}
export default {
    components: {
        Navbar,
        QuickNavbar,
        NewUserHomePop,
        NewUserHomeBtn
    },
    data () {
        return {
            isNewUser: false,
            showNewUser: true,
            // 新人有礼活动id
            newUserActiveId: '',
            exclude: [
                'ShoppingCart',
                'LiveRoom',
                'PaySuccess',
                'LongmenLottery',
                'SubmitOrderV2',
                'OnlineClassroomIndex',
                'SubmitOrder',
                'RefundApply'
            ],
            // 以下路由名称，不显示快速导航
            showNavbar: [
                'Home',
                'My',
                'ShoppingCart',
                'Classify',
                'WhatsHelper',
                'Activity',
                'InviteNewcomers',
                'SpringPloughing',
                'OnlineClassroom',
                'ImageTextList',
                'InteractiveLive',
                'seriesOfCourses'
            ]
        }
    },
    async created () {
        try {
            // 标记一天中首次访问
            setFirstVisit()
            await this.getEntryData()
            await this.getActivityData()
            await this.getNewUserInfo()
        } catch (e) {
            throw e
        }
    },
    watch: {
        $route (to) {
            const notHide = configShare(to)
            console.log(this.appId, to.name, notHide)
            if (notHide && shareRoutes.includes(to.name)) {
                console.warn('默认分享')
                share({
                    appId: this.appId,
                    title: `${ this.mallName }${ to.meta && to.meta.title ? `-${ to.meta.title }` : '' }`,
                    desc: this.mallDesc,
                    imgUrl: this.logoUrl
                })
            }
        }
    },
    computed: {
        ...mapGetters(['appId', 'logoUrl', 'mallDesc', 'mallName'])
    },
    methods: {
        ...mapMutations({
            setTheme: SET_THEME,
            setLiveInfo: SET_LIVE_INFO,
            setCouponInfo: SET_COUPON_INFO,
            setNwEvent: SET_NW_EVENT,
            setDragonGateCharity: SET_DRAGON_GATE_CHARITY,
            setCurrentSign: SET_CURRENT_SIGN,
            setCurrentLottery: SET_CURRENT_LOTTERY,
            setMallQRCodeInfo: SET_MALL_QRCODE_INFO
        }),
        ...mapActions({
            getMainCenter: GET_ACTIVITY_DATA,
            getSkinId: GET_SKIN_ID
        }),
        // 获取新人有礼数据
        async getNewUserInfo () {
            if (this.$route.name !== 'Home') {
                return
            }
            try {
                const { result: info } = await getGoingInfo()
                if (info && info.id) {
                    const { result } = await isNewUser(info.id)
                    this.isNewUser = result
                    this.newUserActiveId = info.id
                }
            } catch (e) {
                throw e
            }
        },
        // 获取首页、主会场页所需数据
        async getEntryData () {
            try {
                const list = [
                    // 待领优惠券
                    getMyCouponInfo(),
                    getMallQRCodeInfo(),
                    // 获取主会场数据
                    this.getMainCenter(),
                    // 获取皮肤id
                    this.getSkinId()
                ]

                const [{ result: coupon }, { result: qrcode = {} }] = await Promise.all(list.map(p => p.catch(e => {
                    console.error(e)
                    return { result: {} }
                })))
                this.setCouponInfo(coupon)
                this.setMallQRCodeInfo(qrcode)
            } catch (error) {
                throw error
            }
        },
        // 获取首页、主会场页所需活动数据
        async getActivityData () {
            try {
                const list = [
                    // 直播
                    getLiveInfo(),
                    // 年味
                    getNianweiInfo(),
                    // 龙门节公益棕
                    getDragonGateCharityInfo(),
                    // 当前签到
                    getCurrentSign(),
                    // 当前抽奖
                    getCurrentLottery()
                ]

                const [
                    { result: live },
                    { result: nianwei },
                    { result: charity },
                    { result: sign },
                    { result: lottery }
                ] = await Promise.all(list.map(p => p.catch(e => {
                    console.error(e)
                    return { result: {} }
                })))
                this.setLiveInfo(live)
                this.setNwEvent(nianwei)
                this.setDragonGateCharity(charity)
                this.setCurrentSign(sign)
                this.setCurrentLottery(lottery)
            } catch (error) {
                throw error
            }
        }
    }
}
</script>
