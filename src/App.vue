<template>
    <div id="app">
        <keep-alive :exclude="exclude">
            <router-view v-if="logined" />
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
import NewUserHomePop from './views/marketing-activity/newcomers/components/New-User-Home-Pop.vue'
import NewUserHomeBtn from './views/marketing-activity/newcomers/components/New-User-Home-Btn.vue'
import { mapMutations, mapActions } from 'vuex'
import {
    SET_THEME,
    GET_MALL_INFO,
    LOGIN,
    GET_ACTIVITY_DATA,
    GET_SKIN_ID,
    SET_LIVE_INFO,
    SET_COUPON_INFO,
    SET_NW_EVENT,
    SET_DRAGON_GATE_CHARITY,
    SET_DRAGON_GATE_SIGN,
    SET_DRAGON_GATE_PLAY,
    SET_MALL_QRCODE_INFO,
    USER_INFO
} from './store/mutation-type'

import Cookie from './assets/js/storage-cookie'
import {
    getLiveInfo,
    getMyCouponInfo,
    getNianweiInfo,
    getDragonGateCharityInfo,
    getDragonGateSignInfo,
    getDragonGatePlayInfo,
    getMallQRCodeInfo
} from './apis/home'
import { setFirstVisit } from './apis/longmen-festival/lottery'
// 新人有礼
import { isNewUser, getGoingInfo } from './apis/newcomers'
export default {
    components: {
        Navbar,
        QuickNavbar,
        NewUserHomePop,
        NewUserHomeBtn
    },
    data () {
        return {
            logined: false,
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
                'OnlineClassroomIndex'
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
                'InteractiveLive',
                'seriesOfCourses'
            ]
        }
    },
    async created () {
        try {
            // 切换了商城之后，清空所有登录数据
            const mallDomain = window.location.pathname.split('/')[1]
            const localOpengId = localStorage.getItem(`openId_${ mallDomain }`)
            const token = Cookie.get('token')
            // 用户切换商城的时候，清空所有登录认证信息
            if (!localOpengId) {
                localStorage.clear()
                sessionStorage.clear()
            }
            // 首先获取上传信息
            await this.getMallInfo()
            // 如果以及登录，且商城没切换，就不用重新登录
            if (!token) {
                const SUCCESS = await this.login()
                if (!SUCCESS) return
            }
            await this.getUserInfo()
            this.logined = true
            // 标记一天中首次访问
            setFirstVisit()
            await this.getEntryData()
            await this.getActivityData()
            await this.getNewUserInfo()
        } catch (e) {
            throw e
        }
    },
    methods: {
        ...mapMutations({
            setTheme: SET_THEME,
            setLiveInfo: SET_LIVE_INFO,
            setCouponInfo: SET_COUPON_INFO,
            setNwEvent: SET_NW_EVENT,
            setDragonGateCharity: SET_DRAGON_GATE_CHARITY,
            setDragonGateSign: SET_DRAGON_GATE_SIGN,
            setDragonGatePlay: SET_DRAGON_GATE_PLAY,
            setMallQRCodeInfo: SET_MALL_QRCODE_INFO
        }),
        ...mapActions({
            getMallInfo: GET_MALL_INFO,
            login: LOGIN,
            getMainCenter: GET_ACTIVITY_DATA,
            getSkinId: GET_SKIN_ID,
            getUserInfo: USER_INFO
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

                const [{ result: coupon }, { result: qrcode }] = await Promise.all(list.map(p => p.catch(e => {
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
                    // 龙门节粽粽有礼
                    getDragonGateSignInfo(),
                    // 龙门节抽奖
                    getDragonGatePlayInfo()
                ]

                const [
                    { result: live },
                    { result: nianwei },
                    { result: charity },
                    { result: sign },
                    { result: play }
                ] = await Promise.all(list.map(p => p.catch(e => {
                    console.error(e)
                    return { result: {} }
                })))
                this.setLiveInfo(live)
                this.setNwEvent(nianwei)
                this.setDragonGateCharity(charity)
                this.setDragonGateSign(sign)
                this.setDragonGatePlay(play)
            } catch (error) {
                throw error
            }
        }
    }
}
</script>
