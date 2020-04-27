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
    SET_COURSE_INFO,
    SET_COUPON_INFO,
    SET_NW_EVENT,
    SET_DRAGON_GATE_CHARITY,
    SET_DRAGON_GATE_SIGN,
    SET_DRAGON_GATE_PLAY
    // SET_INVITING_EVENT,
    // SET_JX_EVENT,
} from './store/mutation-type'

import Cookie from './assets/js/storage-cookie'
import {
    getLiveInfo,
    getNianweiInfo,
    getMyCouponInfo,
    getDragonGateCharityInfo,
    getDragonGateSignInfo,
    getDragonGatePlayInfo
} from './apis/home'
import { setFirstVisit } from './apis/longmen-festival/lottery'
import { getCourse as getCourseInfo } from './apis/online-classroom'
// import { getCurrentActivity as getInvitingEvent } from './apis/invitenewcomers'

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
                'PaySuccess'
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
            // 用户切换商城的时候，清空所有登录认证信息
            if (!localOpengId) {
                localStorage.clear()
            }
            await this.getMallInfo()
            const mallId = Cookie.get('mallId')
            const token = Cookie.get('token')
            const lastMallId = localStorage.getItem('lastMallId')

            // 如果以及登录，且商城没切换，就不用重新登录
            if (token && mallId === lastMallId) {
                await this.getUserInfo()
            } else {
                await this.login()
                await this.getUserInfo()
            }
            this.logined = true
            this.getEntryData()
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
            setCourseInfo: SET_COURSE_INFO,
            setCouponInfo: SET_COUPON_INFO,
            setNwEvent: SET_NW_EVENT,
            setDragonGateCharity: SET_DRAGON_GATE_CHARITY,
            setDragonGateSign: SET_DRAGON_GATE_SIGN,
            setDragonGatePlay: SET_DRAGON_GATE_PLAY
            // setInvitingEvent: SET_INVITING_EVENT,
            // setJxEvent: SET_JX_EVENT,
        }),
        ...mapActions({
            getUserInfo: USER_INFO,
            getMallInfo: GET_MALL_INFO,
            login: LOGIN,
            getActivityData: GET_ACTIVITY_DATA,
            getSkinId: GET_SKIN_ID
        }),
        // 获取首页、主会场页所需数据
        async getEntryData () {
            try {
                // 获取皮肤id
                this.getSkinId()
                this.getActivityData()

                const activityList = [
                    getLiveInfo(),
                    getCourseInfo(),
                    getNianweiInfo(),
                    getMyCouponInfo(),
                    getDragonGateCharityInfo(),
                    getDragonGateSignInfo(),
                    getDragonGatePlayInfo()
                ]

                const [
                    { result: live },
                    { result: course },
                    { result: nianwei },
                    { result: coupon },
                    { result: charity },
                    { result: sign },
                    { result: play }
                ] = await Promise.all(activityList.map(p => p.catch(e => ({ result: {} }))))
                this.setLiveInfo(live)
                this.setCourseInfo(course)
                this.setNwEvent(nianwei)
                this.setCouponInfo(coupon)
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
<style module lang="scss"></style>
