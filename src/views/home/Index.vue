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
            <!-- <HomeTemplateComponent
                :type="type"
                :skin-id="skinId"
                :data="modules"
            /> -->
            <InviteNewcomersHomeEntry />
            <!--瓜分奖学金-->
            <SplitBurse />
            <!--送课弹框-->
            <SendLive is-notice="0" />
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
// import TemplateB from './Template-B.vue'
// import TemplateC from './Template-C.vue'
// import TemplateD from './Template-D.vue'
import InviteNewcomersHomeEntry from '../marketing-activity/double-12/invitenewcomers/InviteNewcomersHomeEntry.vue'
import SplitBurse from './../../components/common/Split-Burse.vue'
import SendLive from './../../components/common/Send-Live.vue'
import { getTemplate } from '../../apis/home'
import { getRedPackageListAfterSort } from '../../apis/marketing-activity/red-package'

export default {
    name: 'Home',
    provide () {
        return {
            parent: this
        }
    },
    components: {
        TemplateB: () => import('./Template-B.vue'),
        TemplateC: () => import('./Template-C.vue'),
        TemplateD: () => import('./Template-D.vue'),
        InviteNewcomersHomeEntry,
        SplitBurse,
        SendLive
    },
    data () {
        return {
            loaded: false,
            type: 0,
            modules: {},
            isRedPackageShow: false
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
    async activated () {
        try {
            const requests = [
                this.getTemplate(),
                this.getRedPackage()
            ]
            await Promise.all(requests.map(p => p.catch(e => console.error(e))))
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
                const findModuleById = function (id) {
                    return this.find(module => module.moduleType === id)
                }.bind(moduleModels)

                if (type === 3) {
                    modules.Banner = findModuleById(1)
                    modules.Live = findModuleById(20)
                    modules.SingleCourse = findModuleById(21)
                    modules.SeriesCourse = findModuleById(22)
                    modules.ImageText = findModuleById(23)
                    modules.Popular = findModuleById(2)
                    modules.Appointment = findModuleById(5)
                    modules.Propagate = findModuleById(6)
                    modules.Class = findModuleById(3)
                    modules.Recommend = findModuleById(4)
                }
                if (type === 4) {
                    modules.Banner = moduleModels[0]
                    modules.Adv = moduleModels[1]
                    modules.Live = findModuleById(20)
                    modules.SingleCourse = findModuleById(21)
                    modules.SeriesCourse = findModuleById(22)
                    modules.ImageText = findModuleById(23)
                    modules.Popular = findModuleById(2)
                    modules.Appointment = findModuleById(5)
                    modules.Propagate = findModuleById(6)
                    modules.Class = findModuleById(3)
                    modules.Recommend = findModuleById(4)
                }
                if (type === -1) {
                    modules.Propagate = findModuleById(6)
                    modules.Live = findModuleById(20)
                    modules.SingleCourse = findModuleById(21)
                    modules.SeriesCourse = findModuleById(22)
                    modules.ImageText = findModuleById(23)
                    modules.Appointment = findModuleById(5)
                    modules.Popular = findModuleById(2)
                    modules.Teachers = findModuleById(12)
                    modules.Class = findModuleById(3)
                    modules.Recommend = findModuleById(4)
                }
                if (type === 9) {
                    modules.Banner = findModuleById(1)
                    modules.Classify = findModuleById(25)
                    modules.Coupon = findModuleById(9)
                    modules.Activity = findModuleById(15)
                    modules.Live = findModuleById(20)
                    modules.SingleCourse = findModuleById(21)
                    modules.SeriesCourse = findModuleById(22)
                    modules.ImageText = findModuleById(23)
                    modules.Appointment = findModuleById(5)
                    modules.Miaosha = findModuleById(10)
                    modules.Package = findModuleById(16)
                    modules.Pintuan = findModuleById(8)
                    modules.Yugou = findModuleById(11)
                    modules.Propagate = findModuleById(6)
                    modules.Popular = findModuleById(2)
                    modules.Class = findModuleById(3)
                    modules.Recommend = findModuleById(4)
                }
                this.type = type
                this.modules = modules
                this.loaded = true
            } catch (e) {
                throw e
            }
        },
        async getRedPackage () {
            try {
                const { result } = await getRedPackageListAfterSort()
                // 过滤未开始/进行中、未隐藏且有库存的福利红包
                const redPackageList = result.filter(item => ~[0, 1].indexOf(item.activityStatus) && item.showStatus && item.issueVolume)
                this.isRedPackageShow = !!(redPackageList && redPackageList.length)
            } catch (error) {
                throw error
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
