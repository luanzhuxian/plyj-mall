<template>
    <div :class="$style.activity">
        <template-xinchun
            v-if="type === 8"
            :data="modules"
            :type="type"
        />
        <template-dragon-gate
            v-if="type === 10"
            :data="modules"
            :type="type"
        />
        <div :class="$style.d12" v-if="~[5, 6, 7].indexOf(type)">
            <div :class="$style.background">
                <search placeholder="搜索商品" />
                <div :class="$style.container" v-if="allLoaded">
                    <router-link
                        :class="{
                            [$style.btnTop]: true,
                            [$style.coupon]: topBtnType === 1,
                            [$style.default]: topBtnType === 2,
                        }"
                        tag="div"
                        :to="{ name: topBtnType === 1 ? 'MyCoupon' : '' }"
                    />
                    <template-fengqiang
                        v-if="type === 5"
                        :data="modules"
                        :type="type"
                    />
                    <template-baofa
                        v-if="type === 6"
                        :data="modules"
                        :type="type"
                    />
                    <template-fanchang
                        v-if="type === 7"
                        :data="modules"
                        :type="type"
                    />
                </div>
            </div>
            <invite-newcomers-home-entry />
        </div>
        <!-- 双十二-新人有礼 -->
        <newcomers-home-entry />
        <!-- 新春开学季-新人有礼 -->
        <new-year-newcomers-home-entry />
        <pl-svg :class="$style.loading" name="icon-loading" fill="#FFF" width="90" v-if="!allLoaded" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Search from './components/Search.vue'
import TemplateFengqiang from './templates/Template-Fengqiang.vue'
import TemplateBaofa from './templates/Template-Baofa.vue'
import TemplateFanchang from './templates/Template-Fanchang.vue'
import TemplateXinchun from './templates/Template-Xinchun.vue'
import TemplateDragonGate from './templates/Template-Dragon-Gate.vue'
import InviteNewcomersHomeEntry from '../marketing-activity/double-12/invitenewcomers/InviteNewcomersHomeEntry.vue'
import NewcomersHomeEntry from '../marketing-activity/double-12/newcomers/NewcomersHomeEntry.vue'
import NewYearNewcomersHomeEntry from '../marketing-activity/new-year/newcomers/NewcomersHomeEntry.vue'

export default {
    name: 'Activity',
    components: {
        Search,
        TemplateFengqiang,
        TemplateBaofa,
        TemplateFanchang,
        TemplateXinchun,
        TemplateDragonGate,
        InviteNewcomersHomeEntry,
        NewcomersHomeEntry,
        NewYearNewcomersHomeEntry
    },
    provide () {
        return {
            parent: this
        }
    },
    data () {
        return {
            type: 0,
            modules: {
                COUPON: null,
                MAI_SONG: null,
                PIN_TUAN: null,
                YU_GOU: null,
                MIAO_SHA: null,
                FENG_QIANG: null,
                RECOMMEND: null
            }
        }
    },
    computed: {
        ...mapGetters(['activityData', 'activityId', 'liveInfo', 'couponToReceive']),
        topBtnType () {
            if (this.couponToReceive === null) return false
            return this.couponToReceive ? 1 : 2
        },
        allLoaded () {
            let result

            // 双十二
            if ([5, 6, 7].includes(this.activityId)) {
                result = (this.liveInfo !== null && !!this.liveInfo) &&
                this.couponToReceive !== null
            }

            // 新春
            if (this.activityId === 8) {
                result = (this.liveInfo !== null && !!this.liveInfo) &&
                this.couponToReceive !== null
            }

            // 龙门节
            if (this.activityId === 10) {
                result = (this.liveInfo !== null && !!this.liveInfo)
            }
            return result
        }
    },
    watch: {
        activityId: {
            handler (id) {
                if (!id && id !== 0) return
                this.getTemplate()
            },
            immediate: true
        }
    },
    async created () {},
    methods: {
        async getTemplate () {
            try {
                const { activityId, activityData } = this
                const { type, moduleModels } = activityData

                if (activityId === 0) {
                    this.noFinish = true
                    this.$alert('主会场还在装修中哦，请您先看看我们都有哪些商品吧 😘')
                        .finally(() => {
                            this.$router.replace({ name: 'Classify' })
                        })
                    return false
                }

                if (type === 5) {
                    this.modules.MIAO_SHA = moduleModels[0]
                    this.modules.PIN_TUAN = moduleModels[1]
                    this.modules.MAI_SONG = moduleModels[2]
                    this.modules.COUPON = moduleModels[3]
                    this.modules.YU_GOU = moduleModels[4]
                    this.modules.FENG_QIANG = moduleModels[5]
                    this.modules.RECOMMEND = moduleModels[6]
                }
                if (type === 6) {
                    this.modules.COUPON = moduleModels[0]
                    this.modules.MAI_SONG = moduleModels[1]
                    this.modules.MIAO_SHA = moduleModels[2]
                    this.modules.PIN_TUAN = moduleModels[3]
                    this.modules.FENG_QIANG = moduleModels[4]
                    this.modules.MIAO_SHA.values.forEach((item, index) => {
                        if (!item.goodsInfo || !Array.isArray(item.goodsInfo)) {
                            item.goodsInfo = []
                        }
                        this.$set(item, 'range', item.valueName.split(','))
                    })
                }
                if (type === 7) {
                    this.modules.MAI_SONG = moduleModels[0]
                    this.modules.MIAO_SHA = moduleModels[1]
                    this.modules.PIN_TUAN = moduleModels[2]
                    this.modules.FENG_QIANG = moduleModels[3]
                    this.modules.RECOMMEND = moduleModels[4]
                }
                if (type === 8) {
                    this.modules.PIN_XUAN = moduleModels[0]
                    this.modules.COUPON = moduleModels[1]
                    this.modules.CHUN_YUN = moduleModels[2]
                    this.modules.PIN_TUAN = moduleModels[3]
                    this.modules.YU_GOU = moduleModels[4]
                    this.modules.FENG_QIANG = moduleModels[5]
                }
                if (type === 10) {
                    this.modules.COUPON = moduleModels[0]
                    this.modules.CHARITY = moduleModels[1]
                    this.modules.ACTIVITY = moduleModels[2]
                    this.modules.MIAO_SHA = moduleModels[3]
                    this.modules.DISTRIBUTION = moduleModels[4]
                    this.modules.PIN_TUAN = moduleModels[5]
                    this.modules.YU_GOU = moduleModels[6]
                    this.modules.PACKAGE = moduleModels[7]
                    this.modules.RECOMMEND = moduleModels[8]
                }
                this.type = type
            } catch (e) {
                throw e
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if (vm.noFinish) {
                vm.$alert('主会场还在装修中哦，请您先看看我们都有哪些商品吧 😘')
                    .finally(() => {
                        vm.$router.replace({ name: 'Classify' })
                    })
            }
        })
    }
}
</script>
<style module lang="scss">
.activity {
    position: relative;
}
.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 0 0;
    animation: rotate 1.2s linear infinite;
    z-index: 999;
}
@keyframes rotate {
    from {
        transform: rotate(0deg) translate(-50%, -50%);
    }
    to {
        transform: rotate(359deg) translate(-50%, -50%);
    }
}
.d12 {
    position: relative;
    background: #d20001;
    .background {
        background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/admall/2.0.0/main-bg.jpg') no-repeat center top;
        background-size: 100% auto;
        min-height: 100vh;
    }
    .container {
        padding: 236px 24px 176px;
    }
    .btn-top {
        width: 520px;
        height: 78px;
        border-radius: 70px;
        margin: 0 auto 28px;
        &.coupon {
            background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/button-top.png') no-repeat center center;
            background-size: 100% auto;
            box-shadow: 18px 6px 25px #800f0f;
        }
        &.default {
            background: url('http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/Button 4.png') no-repeat center center;
            background-size: 100% auto;
            box-shadow: 18px 6px 25px #800f0f;
        }
    }
}

</style>
