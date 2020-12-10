<template>
    <div :class="$style.templateDragonGate">
        <div :class="$style.background">
            <div :class="$style.container" v-if="allLoaded">
                <!-- 优惠券 -->
                <div :class="[$style.coupon, $style.module]" v-if="Coupon.values.length">
                    <Coupon :data="Coupon" />
                </div>
                <!-- 直播-->
                <div :class="[$style.live, $style.module]" v-if="isLiveShow">
                    <Panel :title="livePanelTitle" @click="$router.push({ name: 'InteractiveLive' })">
                        <Live :data="parent.liveInfo" />
                    </Panel>
                </div>
                <!-- 公益-->
                <div :class="[$style.charity, $style.module]" v-if="Charity.showStatue === 1 && Charity.values.length">
                    <Charity :data="Charity" />
                </div>
                <!-- 活动-->
                <div :class="[$style.activity, $style.module]" v-if="Activity.showStatue === 1 && Activity.values.length && (Activity.values[0].haveSigninActivity || Activity.values[0].haveLuckDrawActivity)">
                    <Activity :data="Activity" />
                </div>
                <!-- 秒杀 -->
                <div :class="[$style.miaosha, $style.module]" v-if="Miaosha.showStatue === 1 && Miaosha.values.length">
                    <Miaosha :data="Miaosha" />
                </div>
                <!-- 分销 -->
                <div :class="[$style.distribution, $style.module]" v-if="Distribution.showStatue === 1 && Distribution.values.length">
                    <Distribution :data="Distribution" />
                </div>
                <!-- 拼团 -->
                <div :class="[$style.pintuan, $style.module]" v-if="Pintuan.showStatue === 1 && Pintuan.values.length">
                    <Pintuan :data="Pintuan" />
                </div>
                <!-- 预购 -->
                <div :class="[$style.yugou, $style.module]" v-if="Yugou.showStatue === 1 && Yugou.values.length">
                    <Yugou :data="Yugou" />
                </div>
                <!-- 组合课 -->
                <div :class="[$style.package, $style.module]" v-if="Package.showStatue === 1 && Package.values.length">
                    <Package :data="Package" />
                </div>
                <!-- 精品推荐 -->
                <div :class="[$style.recommend, $style.module]" v-if="Recommend.values.length">
                    <Panel :class="$style.panel" :title="recommendPanelTitle" hide-button>
                        <Recommend :data="Recommend" btn-color="#FF341B" border="4px solid #222222" />
                    </Panel>
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
            livePanelTitle: {
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/zbfys.png',
                width: 368,
                height: 80
            },
            recommendPanelTitle: {
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/jptj.png',
                width: 326,
                height: 80
            }
        }
    },
    computed: {
        Coupon () {
            return this.data.Coupon || { values: [] }
        },
        Charity () {
            return this.data.Charity || { values: [] }
        },
        Activity () {
            return this.data.Activity || { values: [] }
        },
        Miaosha () {
            return this.data.Miaosha || { values: [] }
        },
        Distribution () {
            return this.data.Distribution || { values: [] }
        },
        Pintuan () {
            return this.data.Pintuan || { values: [] }
        },
        Yugou () {
            return this.data.Yugou || { values: [] }
        },
        Package () {
            return this.data.Package || { values: [] }
        },
        Recommend () {
            return this.data.Recommend || { values: [] }
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
