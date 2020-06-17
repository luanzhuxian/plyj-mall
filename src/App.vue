<template>
    <div id="app">
        <keep-alive :exclude="exclude">
            <router-view v-if="logined" />
        </keep-alive>

        <navbar v-if="showNavbar.indexOf($route.name) > -1" />
        <QuickNavbar v-else />
    </div>
</template>

<script>
import Navbar from './components/common/Navbar.vue'
import QuickNavbar from './components/common/Quick-Navbar.vue'
import { mapMutations, mapActions } from 'vuex'
import {
    SET_THEME,
    USER_INFO,
    GET_MALL_INFO,
    LOGIN,
    GET_ACTIVITY_DATA,
    GET_SKIN_ID,
    SET_LIVE_INFO,
    SET_COUPON_INFO,
    SET_NW_EVENT,
    SET_DRAGON_GATE_CHARITY,
    SET_DRAGON_GATE_SIGN,
    SET_DRAGON_GATE_PLAY
} from './store/mutation-type'

import Cookie from './assets/js/storage-cookie'
import {
    getLiveInfo,
    getMyCouponInfo,
    getNianweiInfo,
    getDragonGateCharityInfo,
    getDragonGateSignInfo,
    getDragonGatePlayInfo
} from './apis/home'
import { setFirstVisit } from './apis/longmen-festival/lottery'

export default {
    components: {
        Navbar,
        QuickNavbar
    },
    data () {
        return {
            logined: false,
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
                await this.login()
            } else {
                await this.getUserInfo()
            }
            this.logined = true
            await this.getEntryData()
            await this.getActivityData()
            // 标记一天中首次访问
            setFirstVisit()
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
            setDragonGatePlay: SET_DRAGON_GATE_PLAY
        }),
        ...mapActions({
            getMallInfo: GET_MALL_INFO,
            login: LOGIN,
            getUserInfo: USER_INFO,
            getMainCenter: GET_ACTIVITY_DATA,
            getSkinId: GET_SKIN_ID
        }),
        // 获取商城主会场、皮肤数据
        async getEntryData () {
            try {
                const list = [
                    // 待领优惠券
                    getMyCouponInfo(),
                    // 获取主会场数据
                    this.getMainCenter(),
                    // 获取皮肤id
                    this.getSkinId()
                ]

                const [{ result: coupon }] = await Promise.all(list.map(p => p.catch(e => {
                    console.error(e)
                    return { result: {} }
                })))
                this.setCouponInfo(coupon)
            } catch (error) {
                throw error
            }
        },
        // 获取首页、主会场页所需活动数据
        async getActivityData () {
            try {
                const activityList = [
                    getLiveInfo(),
                    getNianweiInfo(),
                    getDragonGateCharityInfo(),
                    getDragonGateSignInfo(),
                    getDragonGatePlayInfo()
                ]

                const [
                    { result: live },
                    { result: nianwei },
                    { result: charity },
                    { result: sign },
                    { result: play }
                ] = await Promise.all(activityList.map(p => p.catch(e => {
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
