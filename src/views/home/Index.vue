<template>
    <div :class="$style.home">
        <template v-if="allLoaded">
            <TemplateB
                v-if="~[3, 4].indexOf(type)"
                :type="type"
                :skin-id="skinId"
                :data="modules"
            />
            <TemplateC
                v-if="type === -1"
                :type="type"
                :skin-id="skinId"
                :data="modules"
            />
            <TemplateD
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
import InviteNewcomersHomeEntry from '../double-twelve-day/invitenewcomers/InviteNewcomersHomeEntry.vue'
import NewcomersHomeEntry from '../double-twelve-day/newcomers/NewcomersHomeEntry.vue'
import NewYearNewcomersHomeEntry from '../new-year/newcomers/NewcomersHomeEntry.vue'
import SplitBurse from './../../components/common/Split-Burse.vue'
import SendLive from './../../components/common/Send-Live.vue'
import { getTemplate } from '../../apis/home'
import { getReportActivity, getBookActivity } from '../../apis/fight-epidemic'
import { SET_CAMPAIGN_REPORT, SET_CAMPAIGN_BOOK } from '../../store/mutation-type'

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
            // dataMoonLightBox: {},
            // 820用户注册次数
            // registerCountFor820: 0,
            isReportShow: false,
            isBookShow: false,
            reportId: '',
            bookId: ''
        }
    },
    computed: {
        ...mapGetters(['mallId', 'serverTime', 'agentUser', 'userId', 'isActivityAuth', 'skinId', 'liveInfo', 'courseInfo', 'invitingEvent', 'jxEvent', 'nwEvent', 'mallDomain']),
        allLoaded () {
            let result
            if (this.type === 3) {
                result = this.loaded &&
                this.skinId !== null &&
                (this.liveInfo !== null && !!this.liveInfo) &&
                (this.courseInfo !== null && !!this.courseInfo)
            }
            if (this.type === 4) {
                result = this.loaded &&
                this.skinId !== null &&
                (this.liveInfo !== null && !!this.liveInfo) &&
                (this.courseInfo !== null && !!this.courseInfo) &&
                (this.invitingEvent !== null && !!this.invitingEvent) &&
                (this.jxEvent !== null && !!this.jxEvent)
            }
            if (this.type === -1 || this.type === 9) {
                result = this.loaded &&
                this.skinId !== null &&
                (this.liveInfo !== null && !!this.liveInfo) &&
                (this.courseInfo !== null && !!this.courseInfo) &&
                (this.nwEvent !== null && !!this.nwEvent)
            }
            return result
        }
    },
    watch: {
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
                    modules.BANNER = moduleModels[0]
                    modules.POPULAR = moduleModels[1]
                    modules.APPOINTMENT = moduleModels[2]
                    modules.PROPAGATE = moduleModels[3]
                    modules.CLASS = moduleModels[4]
                    modules.RECOMMEND = moduleModels[5]
                }
                if (type === 4) {
                    modules.BANNER = moduleModels[0]
                    modules.ADV = moduleModels[1]
                    modules.POPULAR = moduleModels[2]
                    modules.APPOINTMENT = moduleModels[3]
                    modules.PROPAGATE = moduleModels[4]
                    modules.CLASS = moduleModels[5]
                    modules.RECOMMEND = moduleModels[6]
                }
                if (type === -1) {
                    modules.PROPAGATE = moduleModels[0]
                    modules.APPOINTMENT = moduleModels[1]
                    modules.POPULAR = moduleModels[2]
                    modules.TEACHERS = moduleModels[3]
                    modules.CLASS = moduleModels[4]
                    modules.RECOMMEND = moduleModels[5]
                }
                if (type === 9) {
                    modules.BANNER = moduleModels[0]
                    modules.COUPON = moduleModels[1]
                    modules.ACTIVITY = moduleModels[2]
                    modules.APPOINTMENT = moduleModels[3]
                    modules.POPULAR = moduleModels[4]
                    modules.PACKAGE = moduleModels[5]
                    modules.CLASS = moduleModels[6]
                    modules.PROPAGATE = moduleModels[7]
                    modules.RECOMMEND = moduleModels[8]
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
