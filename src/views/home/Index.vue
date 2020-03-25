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
            <send-live />
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
import { mapGetters } from 'vuex'
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
            modules: {
                BANNER: null,
                ADV: null,
                POPULAR: null,
                APPOINTMENT: null,
                PROPAGATE: null,
                CLASS: null,
                RECOMMEND: null
            },
            // dataMoonLightBox: {},
            // 820用户注册次数
            // registerCountFor820: 0,
            isReportShow: false,
            isBookShow: false,
            reportId: '',
            bookId: ''
        }
    },
    async created () {
        try {
            // 疫情战报
            getReportActivity().then(({ result }) => {
                this.isReportShow = result ? !!result.status : false
                this.reportId = result ? result.id : ''
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
                this.isBookShow = isActive
                    ? Number(systemTime) >= Number(startTime) && Number(systemTime) < Number(endTime)
                    : false
                this.bookId = activityId
            })
            this.getTemplate()
        } catch (e) {
            throw e
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
        isActivityAuth: {
            handler (val) {
                if (val === true && !this.$router.currentRoute.meta.from) {
                    window.myAssign(`/${ this.mallDomain }/activity`)
                }
            },
            immediate: true
        }
    },
    methods: {
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
                if (type === 3) {
                    this.modules.BANNER = moduleModels[0]
                    this.modules.POPULAR = moduleModels[1]
                    this.modules.APPOINTMENT = moduleModels[2]
                    this.modules.PROPAGATE = moduleModels[3]
                    this.modules.CLASS = moduleModels[4]
                    this.modules.RECOMMEND = moduleModels[5]
                }
                if (type === 4) {
                    this.modules.BANNER = moduleModels[0]
                    this.modules.ADV = moduleModels[1]
                    this.modules.POPULAR = moduleModels[2]
                    this.modules.APPOINTMENT = moduleModels[3]
                    this.modules.PROPAGATE = moduleModels[4]
                    this.modules.CLASS = moduleModels[5]
                    this.modules.RECOMMEND = moduleModels[6]
                }
                if (type === -1) {
                    this.modules.PROPAGATE = moduleModels[0]
                    this.modules.APPOINTMENT = moduleModels[1]
                    this.modules.POPULAR = moduleModels[2]
                    this.modules.TEACHERS = moduleModels[3]
                    this.modules.CLASS = moduleModels[4]
                    this.modules.RECOMMEND = moduleModels[5]
                }
                if (type === 9) {
                    this.modules.BANNER = moduleModels[0]
                    this.modules.COUPON = moduleModels[1]
                    this.modules.ACTIVITY = moduleModels[2]
                    this.modules.APPOINTMENT = moduleModels[3]
                    this.modules.POPULAR = moduleModels[4]
                    this.modules.PACKAGE = moduleModels[5]
                    this.modules.CLASS = moduleModels[6]
                    this.modules.PROPAGATE = moduleModels[7]
                    this.modules.RECOMMEND = moduleModels[8]
                }
                this.type = type

                // this.skinId = skinStatus
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
      @include skeAnimation(#eee)
    }
    .skeleton-b {
      width: 50vw;
      height: 40px;
      margin-top: 20px;
      @include skeAnimation(#eee)
    }
    .skeleton-c {
      height: 320px;
      margin-top: 20px;
      margin-bottom: 20px;
      border-radius: 20px;
      @include skeAnimation(#eee)
    }
  }
</style>
