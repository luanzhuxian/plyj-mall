<template>
    <div :class="$style.activity">
        <!-- 双十二 2019 -->
        <div :class="$style.d12" v-if="~[5, 6, 7].indexOf(type)">
            <div :class="$style.background">
                <Search placeholder="搜索商品" />
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
                    <TemplateFengqiang
                        v-if="type === 5"
                        :data="modules"
                        :type="type"
                    />
                    <TemplateBaofa
                        v-if="type === 6"
                        :data="modules"
                        :type="type"
                    />
                    <TemplateFanchang
                        v-if="type === 7"
                        :data="modules"
                        :type="type"
                    />
                </div>
            </div>
            <InviteNewcomersHomeEntry />
        </div>
        <!-- 新春 -->
        <TemplateSpring2020
            v-if="type === 8"
            :data="modules"
            :type="type"
        />
        <!-- 龙门节 -->
        <TemplateDragonGate
            v-if="type === 10"
            :data="modules"
            :type="type"
        />
        <!-- 双十二 2020 -->
        <TemplateDouble122020
            v-if="type === 11"
            :data="modules"
            :type="type"
        />
        <!-- 新春 2021 -->
        <TemplateSpring2021
            v-if="type === 12"
            :data="modules"
            :type="type"
        />
        <PlSvg :class="$style.loading" name="icon-loading" fill="#FFF" width="90" v-if="!allLoaded" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Search from '../../components/activity/Search.vue'
import TemplateFengqiang from './templates/template-double-12-2019/Template-Fengqiang.vue'
import TemplateBaofa from './templates/template-double-12-2019/Template-Baofa.vue'
import TemplateFanchang from './templates/template-double-12-2019/Template-Fanchang.vue'
import TemplateSpring2020 from './templates/Template-Spring-2020.vue'
import TemplateDragonGate from './templates/Template-Dragon-Gate.vue'
import TemplateDouble122020 from './templates/Template-Double-12-2020.vue'
import TemplateSpring2021 from './templates/Template-Spring-2021-Green.vue'
import InviteNewcomersHomeEntry from '../marketing-activity/double-12/invitenewcomers/InviteNewcomersHomeEntry.vue'
import { GET_ACTIVITY_DATA } from '../../store/mutation-type'

export default {
    name: 'Activity',
    components: {
        Search,
        TemplateFengqiang,
        TemplateBaofa,
        TemplateFanchang,
        TemplateSpring2020,
        TemplateDragonGate,
        TemplateDouble122020,
        TemplateSpring2021,
        InviteNewcomersHomeEntry
    },
    provide () {
        return {
            parent: this
        }
    },
    data () {
        return {
            type: 0,
            modules: {}
        }
    },
    computed: {
        ...mapGetters(['activityData', 'activityId', 'liveInfo', 'couponToReceive', 'currentLottery']),
        topBtnType () {
            if (this.couponToReceive === null) return false
            return this.couponToReceive ? 1 : 2
        },
        allLoaded () {
            let result = false

            // 双十二2019
            if ([5, 6, 7].includes(this.activityId)) {
                result = (this.liveInfo !== null && !!this.liveInfo) &&
                this.couponToReceive !== null
            }

            // 新春2020
            if (this.activityId === 8) {
                result = (this.liveInfo !== null && !!this.liveInfo) &&
                this.couponToReceive !== null
            }

            // 龙门节、双十二2020
            if (this.activityId === 10 || this.activityId === 11) {
                result = (this.liveInfo !== null && !!this.liveInfo)
            }
            // 新春2021
            if (this.activityId === 12) {
                result = true
            }
            return result
        }
    },
    watch: {
        activityId: {
            async handler (id) {
                if (!id && id !== 0) return
                await this.getTemplate()
            },
            immediate: true
        }
    },
    activated () {
        if (this.activityId) {
            this.getMainCenter()
        }
    },
    methods: {
        ...mapActions({ getMainCenter: GET_ACTIVITY_DATA }),
        getTemplate () {
            try {
                const { activityId, activityData } = this
                const { type, moduleModels } = activityData
                // 找到指定模块
                const findModule = function (modules) {
                    return function (id) {
                        return modules.find(module => module.moduleType === id)
                    }
                }
                const findModuleById = findModule(moduleModels)

                if (activityId === 0) {
                    this.noFinish = true
                    this.$alert('主会场还在装修中哦，请您先看看我们都有哪些商品吧 😘')
                        .finally(() => {
                            this.$router.replace({ name: 'Classify' })
                        })
                    return false
                }

                if (type === 5) {
                    this.modules.Miaosha = moduleModels[0]
                    this.modules.Pintuan = moduleModels[1]
                    this.modules.Maisong = moduleModels[2]
                    this.modules.Coupon = moduleModels[3]
                    this.modules.Yugou = moduleModels[4]
                    this.modules.Fengqiang = moduleModels[5]
                    this.modules.Recommend = moduleModels[6]
                }
                if (type === 6) {
                    this.modules.Coupon = moduleModels[0]
                    this.modules.Maisong = moduleModels[1]
                    this.modules.Miaosha = moduleModels[2]
                    this.modules.Pintuan = moduleModels[3]
                    this.modules.Fengqiang = moduleModels[4]
                    this.modules.Miaosha.values.forEach((item, index) => {
                        if (!item.goodsInfo || !Array.isArray(item.goodsInfo)) {
                            item.goodsInfo = []
                        }
                        this.$set(item, 'range', item.valueName.split(','))
                    })
                }
                if (type === 7) {
                    this.modules.Maisong = moduleModels[0]
                    this.modules.Miaosha = moduleModels[1]
                    this.modules.Pintuan = moduleModels[2]
                    this.modules.Fengqiang = moduleModels[3]
                    this.modules.Recommend = moduleModels[4]
                }
                if (type === 8) {
                    this.modules.Propagate = moduleModels[0]
                    this.modules.Coupon = moduleModels[1]
                    this.modules.Chunyun = moduleModels[2]
                    this.modules.Pintuan = moduleModels[3]
                    this.modules.Yugou = moduleModels[4]
                    this.modules.Fengqiang = moduleModels[5]
                }
                if (type === 10) {
                    this.modules.Coupon = moduleModels[0]
                    this.modules.Charity = moduleModels[1]
                    this.modules.Activity = moduleModels[2]
                    this.modules.Miaosha = moduleModels[3]
                    this.modules.Distribution = moduleModels[4]
                    this.modules.Pintuan = moduleModels[5]
                    this.modules.Yugou = moduleModels[6]
                    this.modules.Package = moduleModels[7]
                    this.modules.Recommend = moduleModels[8]
                }
                if (type === 11) {
                    this.modules.Coupon = findModuleById(9)
                    this.modules.Miaosha = findModuleById(10)
                    this.modules.Pintuan = findModuleById(8)
                    this.modules.Yugou = findModuleById(11)
                    this.modules.Package = findModuleById(16)
                    this.modules.Popular = findModuleById(2)
                }
                if (type === 12) {
                    this.modules.Live = findModuleById(20)
                    this.modules.RedPackage = findModuleById(24)
                    this.modules.Coupon = findModuleById(9)
                    this.modules.Miaosha = findModuleById(10)
                    this.modules.Pintuan = findModuleById(8)
                    this.modules.Yugou = findModuleById(11)
                    this.modules.Package = findModuleById(16)
                    this.modules.Popular = findModuleById(2)
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
