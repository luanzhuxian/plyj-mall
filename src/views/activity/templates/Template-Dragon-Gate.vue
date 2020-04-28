<template>
    <div :class="$style.templateDragonGate">
        <div :class="$style.background">
            <div :class="$style.container" v-if="allLoaded">
                <!-- 优惠券 -->
                <div :class="[$style.coupon, $style.module]" v-if="COUPON.values && COUPON.values.length">
                    <coupon :data="COUPON" />
                </div>
                <!-- 直播-->
                <div :class="[$style.live, $style.module]" v-if="isLiveShow">
                    <live :data="parent.liveInfo" />
                </div>
                <!-- 公益-->
                <div :class="[$style.charity, $style.module]" v-if="CHARITY.values && CHARITY.values.length">
                    <charity :data="CHARITY" />
                </div>
                <!-- 活动-->
                <div :class="[$style.activity, $style.module]" v-if="ACTIVITY.values && ACTIVITY.values.length">
                    <activity :data="ACTIVITY" />
                </div>
                <!-- 春耘 -->
                <!-- <div :class="[$style.chunyun, $style.module]" v-if="!!CHUN_YUN.otherValue && CHUN_YUN.values && CHUN_YUN.values.length">
                    <chunyun :data="CHUN_YUN" />
                </div> -->
                <!-- 拼团 -->
                <!-- <div :class="[$style.pintuan, $style.module]" v-if="PIN_TUAN.values && PIN_TUAN.values.length">
                    <pintuan :data="PIN_TUAN" />
                </div> -->
                <!-- 预购 -->
                <!-- <div :class="[$style.yugou, $style.module]" v-if="YU_GOU.values && YU_GOU.values.length">
                    <yugou :data="YU_GOU" />
                </div> -->
                <!-- 精品推荐 -->
                <div :class="[$style.recommend, $style.module]" v-if="RECOMMEND.values && RECOMMEND.values.length">
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
// import Miaosha from '../dragon-gate/Miaosha.vue'
// import Distribution from '../dragon-gate/Distribution.vue'
// import Pintuan from '../dragon-gate/Pintuan.vue'
// import Yugou from '../dragon-gate/Yugou.vue'
// import Package from '../dragon-gate/Package.vue'
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
        // Miaosha,
        // Distribution,
        // Pintuan,
        // Yugou,
        // Package,
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
                name: 'icon-jptj-71d47',
                width: 326,
                height: 80
            }
        }
    },
    computed: {
        COUPON () {
            return this.data.COUPON || {}
        },
        CHARITY () {
            return this.data.CHARITY || {}
        },
        ACTIVITY () {
            return this.data.ACTIVITY || {}
        },
        MIAO_SHA () {
            return this.data.MIAO_SHA || {}
        },
        DISTRIBUTION () {
            return this.data.DISTRIBUTION || {}
        },
        PIN_TUAN () {
            return this.data.PIN_TUAN || {}
        },
        YU_GOU () {
            return this.data.YU_GOU || {}
        },
        PACKAGE () {
            return this.data.PACKAGE || {}
        },
        RECOMMEND () {
            return this.data.RECOMMEND || {}
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
