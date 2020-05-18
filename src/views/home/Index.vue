<template>
    <div :class="$style.home">
        <template v-if="allLoaded">
            <template-b
                v-if="~[3, 4].indexOf(type)"
                :type="type"
                :skin-id="skinId"
                :data="modules"
            />
            <template-c
                v-if="type === -1"
                :type="type"
                :skin-id="skinId"
                :data="modules"
            />
            <template-d
                v-if="type === 9"
                :type="type"
                :skin-id="skinId"
                :data="modules"
            />
            <invite-newcomers-home-entry />
            <newcomers-home-entry />
            <new-year-newcomers-home-entry />
            <!--瓜分奖学金-->
            <split-burse />
            <!--送课弹框-->
            <send-live is-notice="0" />
        </template>
        <div :class="$style.skeleton" v-else>
            <div :class="$style.skeletonA" />
            <div :class="$style.skeletonB" />
            <div :class="$style.skeletonC" />
            <div :class="$style.skeletonD" />
            <div :class="$style.skeletonA" />
            <div :class="$style.skeletonB" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import moment from 'moment'
import 'swiper/dist/css/swiper.css'
import TemplateB from './Template-B.vue'
import TemplateC from './Template-C.vue'
import TemplateD from './Template-D.vue'
import InviteNewcomersHomeEntry from '../marketing-activity/double-12/invitenewcomers/InviteNewcomersHomeEntry.vue'
import NewcomersHomeEntry from '../marketing-activity/double-12/newcomers/NewcomersHomeEntry.vue'
import NewYearNewcomersHomeEntry from '../marketing-activity/new-year/newcomers/NewcomersHomeEntry.vue'
import SplitBurse from './../../components/common/Split-Burse.vue'
import SendLive from './../../components/common/Send-Live.vue'
import { getTemplate } from '../../apis/home'
import { getReportActivity, getBookActivity } from '../../apis/fight-epidemic'
import { SET_CAMPAIGN_REPORT, SET_CAMPAIGN_BOOK } from '../../store/mutation-type'

/* eslint-disable func-style */
function findModule (id) {
    return this.find(module => module.moduleType === id)
}

export default {
    name: 'Home',
    provide () {
        return {
            parent: this
        }
    },
    components: {
        TemplateB,
        TemplateC,
        TemplateD,
        InviteNewcomersHomeEntry,
        NewYearNewcomersHomeEntry,
        NewcomersHomeEntry,
        SplitBurse,
        SendLive
    },
    data () {
        return {
            loaded: false,
            type: 0,
            modules: {},
            isReportShow: false,
            isBookShow: false,
            reportId: '',
            bookId: ''
        }
    },
    computed: {
        ...mapGetters(['mallId', 'serverTime', 'agentUser', 'userId', 'isActivityAuth', 'skinId', 'nwEvent', 'mallDomain']),
        allLoaded () {
            let result
            if (this.type === 3) {
                result = this.loaded &&
                this.skinId !== null
                // (this.liveInfo !== null && !!this.liveInfo) &&
                // (this.courseInfo !== null && !!this.courseInfo)
            }
            if (this.type === 4) {
                result = this.loaded &&
                this.skinId !== null
                // (this.liveInfo !== null && !!this.liveInfo) &&
                // (this.courseInfo !== null && !!this.courseInfo)
                // (this.invitingEvent !== null && !!this.invitingEvent)
                // (this.jxEvent !== null && !!this.jxEvent)
            }
            if (this.type === -1 || this.type === 9) {
                result = this.loaded &&
                this.skinId !== null &&
                // (this.liveInfo !== null && !!this.liveInfo) &&
                // (this.courseInfo !== null && !!this.courseInfo) &&
                (this.nwEvent !== null && !!this.nwEvent)
            }
            return result
        }
    },
    watch: {
        // 首次打开跳转主会场
        // isActivityAuth: {
        //     handler (val) {
        //         if (val === true && !this.$router.currentRoute.meta.from) {
        //             window.myAssign(`/${ this.mallDomain }/activity`)
        //         }
        //     },
        //     immediate: true
        // }
    },
    async created () {
        try {
            // 疫情战报
            getReportActivity().then(({ result }) => {
                result.isReportShow = result ? !!result.status : false
                this.isReportShow = result.isReportShow
                this.reportId = result ? result.id : ''
                this.setCampaignReport(result)
            })
            // 疫情签到
            getBookActivity().then(({ result }) => {
                const { systemTime, status, activityId } = result
                let { startTime, endTime } = result
                const isActive = status === 0

                if (isActive) {
                    startTime = moment(startTime, 'YYYY-MM-DD HH:mm:ss').valueOf()
                    endTime = moment(endTime, 'YYYY-MM-DD HH:mm:ss').valueOf()
                }
                result.isBookShow = isActive
                    ? Number(systemTime) >= Number(startTime) && Number(systemTime) < Number(endTime)
                    : false

                this.isBookShow = result.isBookShow
                this.bookId = activityId
                this.setCampaignBook(result)
            })
            this.getTemplate()
        } catch (e) {
            throw e
        }
    },
    methods: {
        ...mapMutations({
            setCampaignReport: SET_CAMPAIGN_REPORT,
            setCampaignBook: SET_CAMPAIGN_BOOK
        }),
        async getTemplate () {
            try {
                const { result } = await getTemplate({ type: 1 })
                if (!result) {
                    this.noFinish = true
                    this.$alert('商城还在装修中哦，请您先看看我们都有哪些商品吧 😘')
                        .finally(() => {
                            this.$router.replace({ name: 'Classify' })
                        })
                    return
                }
                const { type, moduleModels } = result
                const modules = {}
                if (type === 3) {
                    modules.BANNER = findModule.bind(moduleModels)(1)
                    modules.LIVE = findModule.bind(moduleModels)(20)
                    modules.COURSE = findModule.bind(moduleModels)(21)
                    modules.SERIES = findModule.bind(moduleModels)(22)
                    modules.POPULAR = findModule.bind(moduleModels)(2)
                    modules.APPOINTMENT = findModule.bind(moduleModels)(5)
                    modules.PROPAGATE = findModule.bind(moduleModels)(6)
                    modules.CLASS = findModule.bind(moduleModels)(3)
                    modules.RECOMMEND = findModule.bind(moduleModels)(4)
                }
                if (type === 4) {
                    modules.BANNER = moduleModels[0]
                    modules.ADV = moduleModels[1]
                    modules.LIVE = findModule.bind(moduleModels)(20)
                    modules.COURSE = findModule.bind(moduleModels)(21)
                    modules.SERIES = findModule.bind(moduleModels)(22)
                    modules.POPULAR = findModule.bind(moduleModels)(2)
                    modules.APPOINTMENT = findModule.bind(moduleModels)(5)
                    modules.PROPAGATE = findModule.bind(moduleModels)(6)
                    modules.CLASS = findModule.bind(moduleModels)(3)
                    modules.RECOMMEND = findModule.bind(moduleModels)(4)
                }
                if (type === -1) {
                    modules.PROPAGATE = findModule.bind(moduleModels)(6)
                    modules.LIVE = findModule.bind(moduleModels)(20)
                    modules.COURSE = findModule.bind(moduleModels)(21)
                    modules.SERIES = findModule.bind(moduleModels)(22)
                    modules.APPOINTMENT = findModule.bind(moduleModels)(5)
                    modules.POPULAR = findModule.bind(moduleModels)(2)
                    modules.TEACHERS = findModule.bind(moduleModels)(12)
                    modules.CLASS = findModule.bind(moduleModels)(3)
                    modules.RECOMMEND = findModule.bind(moduleModels)(4)
                }
                if (type === 9) {
                    modules.BANNER = findModule.bind(moduleModels)(1)
                    modules.COUPON = findModule.bind(moduleModels)(9)
                    modules.ACTIVITY = findModule.bind(moduleModels)(15)
                    modules.LIVE = findModule.bind(moduleModels)(20)
                    modules.COURSE = findModule.bind(moduleModels)(21)
                    modules.SERIES = findModule.bind(moduleModels)(22)
                    modules.APPOINTMENT = findModule.bind(moduleModels)(5)
                    modules.MIAO_SHA = findModule.bind(moduleModels)(10)
                    modules.PACKAGE = findModule.bind(moduleModels)(16)
                    modules.PIN_TUAN = findModule.bind(moduleModels)(8)
                    modules.YU_GOU = findModule.bind(moduleModels)(11)
                    modules.PROPAGATE = findModule.bind(moduleModels)(6)
                    modules.POPULAR = findModule.bind(moduleModels)(2)
                    modules.CLASS = findModule.bind(moduleModels)(3)
                    modules.RECOMMEND = findModule.bind(moduleModels)(4)
                }
                this.type = type
                this.modules = modules
                this.loaded = true
            } catch (e) {
                throw e
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        to.meta.from = from.name
        next(vm => {
            if (vm.noFinish) {
                vm.$alert('商城还在装修中哦，请您先看看我们都有哪些商品吧 😘')
                    .finally(() => {
                        vm.$router.replace({ name: 'Classify' })
                    })
            }
        })
    }
}
</script>
<style lang="scss" module>
.home {
    padding-bottom: 88px;
}
.skeleton {
    padding: 24px;
    .skeleton-a {
        width: 70vw;
        height: 60px;
        @include skeAnimation(#eee);
    }
    .skeleton-b {
        width: 50vw;
        height: 40px;
        margin-top: 20px;
        @include skeAnimation(#eee);
    }
    .skeleton-c {
        height: 320px;
        margin-top: 20px;
        margin-bottom: 20px;
        border-radius: 20px;
        @include skeAnimation(#eee);
    }
}

</style>
