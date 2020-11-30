<template>
    <div :class="$style.home">
        <template v-if="allLoaded">
            <h3
                style="font-size: 100px"
                @click="$router.push({ name: 'RedPackage' })"
            >
                main
            </h3>
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
import { mapGetters } from 'vuex'
import 'swiper/dist/css/swiper.css'
import TemplateB from './Template-B.vue'
import TemplateC from './Template-C.vue'
import TemplateD from './Template-D.vue'
import InviteNewcomersHomeEntry from '../marketing-activity/double-12/invitenewcomers/InviteNewcomersHomeEntry.vue'
import SplitBurse from './../../components/common/Split-Burse.vue'
import SendLive from './../../components/common/Send-Live.vue'
import { getTemplate } from '../../apis/home'

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
        ...mapGetters(['mallId', 'serverTime', 'agentUser', 'userId', 'isActivityAuth', 'skinId', 'mallDomain', 'mallQRCodeInfo']),
        allLoaded () {
            return this.loaded &&
                this.skinId !== null &&
                this.mallQRCodeInfo !== null
        }
    },
    watch: {
    },
    async activated () {
        try {
            await this.getTemplate()
        } catch (e) {
            throw e
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
                    throw new Error('商城未装修，但是访问了页面')
                }

                const modules = {}
                const { type, moduleModels } = result
                const findModule = function (id) {
                    return this.find(module => module.moduleType === id)
                }.bind(moduleModels)

                if (type === 3) {
                    modules.BANNER = findModule(1)
                    modules.LIVE = findModule(20)
                    modules.COURSE = findModule(21)
                    modules.SERIES = findModule(22)
                    modules.ImageText = findModule(23)
                    modules.POPULAR = findModule(2)
                    modules.APPOINTMENT = findModule(5)
                    modules.PROPAGATE = findModule(6)
                    modules.CLASS = findModule(3)
                    modules.RECOMMEND = findModule(4)
                }
                if (type === 4) {
                    modules.BANNER = moduleModels[0]
                    modules.ADV = moduleModels[1]
                    modules.LIVE = findModule(20)
                    modules.COURSE = findModule(21)
                    modules.SERIES = findModule(22)
                    modules.ImageText = findModule(23)
                    modules.POPULAR = findModule(2)
                    modules.APPOINTMENT = findModule(5)
                    modules.PROPAGATE = findModule(6)
                    modules.CLASS = findModule(3)
                    modules.RECOMMEND = findModule(4)
                }
                if (type === -1) {
                    modules.PROPAGATE = findModule(6)
                    modules.LIVE = findModule(20)
                    modules.COURSE = findModule(21)
                    modules.SERIES = findModule(22)
                    modules.ImageText = findModule(23)
                    modules.APPOINTMENT = findModule(5)
                    modules.POPULAR = findModule(2)
                    modules.TEACHERS = findModule(12)
                    modules.CLASS = findModule(3)
                    modules.RECOMMEND = findModule(4)
                }
                if (type === 9) {
                    modules.BANNER = findModule(1)
                    modules.COUPON = findModule(9)
                    modules.ACTIVITY = findModule(15)
                    modules.LIVE = findModule(20)
                    modules.COURSE = findModule(21)
                    modules.SERIES = findModule(22)
                    modules.ImageText = findModule(23)
                    modules.APPOINTMENT = findModule(5)
                    modules.MIAO_SHA = findModule(10)
                    modules.PACKAGE = findModule(16)
                    modules.PIN_TUAN = findModule(8)
                    modules.YU_GOU = findModule(11)
                    modules.PROPAGATE = findModule(6)
                    modules.POPULAR = findModule(2)
                    modules.CLASS = findModule(3)
                    modules.RECOMMEND = findModule(4)
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
        next()
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
