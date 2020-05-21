<template>
    <div :class="$style.templateDragonGate">
        <div :class="$style.background">
            <div :class="$style.container" v-if="allLoaded">
                <!-- 优惠券 -->
                <div :class="[$style.coupon, $style.module]" v-if="COUPON.values.length">
                    <coupon :data="COUPON" />
                </div>
                <!-- 直播-->
                <div :class="[$style.live, $style.module]" v-if="isLiveShow">
                    <live :data="parent.liveInfo" />
                </div>
                <!-- 公益-->
                <div :class="[$style.charity, $style.module]" v-if="CHARITY.showStatue === 1 && CHARITY.values.length">
                    <charity :data="CHARITY" />
                </div>
                <!-- 活动-->
                <div :class="[$style.activity, $style.module]" v-if="ACTIVITY.showStatue === 1 && ACTIVITY.values.length && (ACTIVITY.values[0].haveSigninActivity || ACTIVITY.values[0].haveLuckDrawActivity)">
                    <activity :data="ACTIVITY" />
                </div>
                <!-- 秒杀 -->
                <div :class="[$style.miaosha, $style.module]" v-if="MIAO_SHA.showStatue === 1 && MIAO_SHA.values.length">
                    <miaosha :data="MIAO_SHA" />
                </div>
                <!-- 分销 -->
                <div :class="[$style.distribution, $style.module]" v-if="DISTRIBUTION.showStatue === 1 && DISTRIBUTION.values.length">
                    <distribution :data="DISTRIBUTION" />
                </div>
                <!-- 拼团 -->
                <div :class="[$style.pintuan, $style.module]" v-if="PIN_TUAN.showStatue === 1 && PIN_TUAN.values.length">
                    <pintuan :data="PIN_TUAN" />
                </div>
                <!-- 预购 -->
                <div :class="[$style.yugou, $style.module]" v-if="YU_GOU.showStatue === 1 && YU_GOU.values.length">
                    <yugou :data="YU_GOU" />
                </div>
                <!-- 组合课 -->
                <div :class="[$style.package, $style.module]" v-if="PACKAGE.showStatue === 1 && PACKAGE.values.length">
                    <package :data="PACKAGE" />
                </div>
                <!-- 精品推荐 -->
                <div :class="[$style.recommend, $style.module]" v-if="RECOMMEND.values.length">
                    <panel :custom-class="$style.panel" :title="panelTitle" hide-button>
                        <recommend :data="RECOMMEND" btn-color="#FF341B" border="4px solid #222222" />
                    </panel>
                </div>
                <footer :class="$style.footer">
                    — 技术支持 朋来科技 —
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import Live from '../dragon-gate/Live.vue'
import Coupon from '../dragon-gate/Coupon.vue'
import Charity from '../dragon-gate/Charity.vue'
import Activity from '../dragon-gate/Activity.vue'
import Miaosha from '../dragon-gate/Miaosha.vue'
import Distribution from '../dragon-gate/Distribution.vue'
import Pintuan from '../dragon-gate/Pintuan.vue'
import Yugou from '../dragon-gate/Yugou.vue'
import Package from '../dragon-gate/Package.vue'
import Recommend from '../../home/components/Recommend.vue'
import Panel from '../dragon-gate/Panel.vue'

export default {
    name: 'TemplateDragonGate',
    inject: ['parent'],
    components: {
        Live,
        Coupon,
        Charity,
        Activity,
        Miaosha,
        Distribution,
        Pintuan,
        Yugou,
        Package,
        Recommend,
        Panel
    },
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        type: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            panelTitle: {
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/jptj.png',
                width: 326,
                height: 80
            }
        }
    },
    computed: {
        COUPON () {
            return this.data.COUPON || { values: [] }
        },
        CHARITY () {
            return this.data.CHARITY || { values: [] }
        },
        ACTIVITY () {
            return this.data.ACTIVITY || { values: [] }
        },
        MIAO_SHA () {
            return this.data.MIAO_SHA || { values: [] }
        },
        DISTRIBUTION () {
            return this.data.DISTRIBUTION || { values: [] }
        },
        PIN_TUAN () {
            return this.data.PIN_TUAN || { values: [] }
        },
        YU_GOU () {
            return this.data.YU_GOU || { values: [] }
        },
        PACKAGE () {
            return this.data.PACKAGE || { values: [] }
        },
        RECOMMEND () {
            return this.data.RECOMMEND || { values: [] }
        },
        isLiveShow () {
            const { liveInfo } = this.parent
            if (!liveInfo.liveModel || !liveInfo.liveModel.length) {
                return false
            }
            const list = liveInfo.liveModel.filter(item => item.statue === 0 || item.statue === 4 || (item.statue === 2 && item.hasNotice))
            return !!list.length
        },
        allLoaded () {
            return this.parent.allLoaded
        }
    }
}
</script>

<style module lang="scss">
.template-dragon-gate {
    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/main-bg.png') repeat center;
    background-size: 100%;
}
.background {
    position: relative;
    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/main-top.png') no-repeat center top;
    background-size: 100% auto;
    min-height: 100vh;
}
.container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 520px 0 88px;
}
.module {
    padding: 80px 24px 0;
    &:nth-of-type(1) {
        padding-top: 0 !important;
    }
}
.coupon {
    padding: 0 ;
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    color: #fff;
    font-size: 26px;
    font-weight: 600;
}

.panel {
    padding-top: 64px;
}

</style>
