<template>
    <div :class="$style.templateDouble12" class="template-double-12">
        <div :class="$style.background">
            <div :class="$style.container" v-if="allLoaded">
                <!-- 直播-->
                <section :class="[$style.live, $style.module]" v-if="isLiveShow">
                    <Panel custom-class="live-panel" title="直播放映室" @click="$router.push({ name: 'InteractiveLive' })">
                        <Live :data="parent.liveInfo" />
                    </Panel>
                </section>
                <!-- 优惠券 -->
                <section :class="[$style.coupon, $style.module]" v-if="COUPON.values.length">
                    <Coupon :data="COUPON" />
                </section>
                <!-- 秒杀 -->
                <section :class="[$style.miaosha, $style.module]" v-if="MIAO_SHA.showStatue === 1 && MIAO_SHA.values.length">
                    <Miaosha :data="MIAO_SHA" />
                </section>
                <!-- 拼团 -->
                <section :class="[$style.pintuan, $style.module]" v-if="PIN_TUAN.showStatue === 1 && PIN_TUAN.values.length">
                    <Pintuan :data="PIN_TUAN" />
                </section>
                <!-- 预购 -->
                <section :class="[$style.yugou, $style.module]" v-if="YU_GOU.showStatue === 1 && YU_GOU.values.length">
                    <Yugou :data="YU_GOU" />
                </section>
                <!-- 组合课 -->
                <section :class="[$style.package, $style.module]" v-if="PACKAGE.showStatue === 1 && PACKAGE.values.length">
                    <Package :data="PACKAGE" />
                </section>
                <!-- 精品推荐 -->
                <section :class="[$style.popular, $style.module]" v-if="POPULAR.showStatue === 1 && POPULAR.values.length">
                    <Popular :data="POPULAR" />
                </section>
                <footer :class="$style.footer">
                    — 技术支持 朋来科技 —
                </footer>
                <BackToTop ref="backToTop">
                    <img class="back-to-top__icon" src="https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/arrow-up-orange.png" alt="">
                </BackToTop>
            </div>
        </div>
    </div>
</template>

<script>
import Live from '../dragon-gate/Live.vue'
import Coupon from '../double-12-2020/Coupon.vue'
import Miaosha from '../double-12-2020/Miaosha.vue'
import Pintuan from '../double-12-2020/Pintuan.vue'
import Yugou from '../double-12-2020/Yugou.vue'
import Package from '../double-12-2020/Package.vue'
import Popular from '../double-12-2020/Popular.vue'
import Panel from '../double-12-2020/Panel.vue'
import BackToTop from '../../../components/activity/BackToTop.vue'

export default {
    name: 'TemplateDragonGate',
    inject: ['parent'],
    components: {
        Live,
        Coupon,
        Miaosha,
        Pintuan,
        Yugou,
        Package,
        Popular,
        Panel,
        BackToTop
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
        return {}
    },
    computed: {
        COUPON () {
            return this.data.COUPON || { values: [] }
        },
        MIAO_SHA () {
            return this.data.MIAO_SHA || { values: [] }
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
        POPULAR () {
            return this.data.POPULAR || { values: [] }
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
    // mounted () {
    //     const SCREEN_HEIGHT = window.innerHeight
    //     const DPR = window.devicePixelRatio
    //     const BTN_BOTTOM = 60 * 2
    //     const BTN_HEIGHT = 48 * 2
    //     const transform = val => val * (window.innerWidth / 750) * DPR
    //     this.threshold = SCREEN_HEIGHT - transform(BTN_BOTTOM + BTN_HEIGHT)
    // }
}
</script>

<style lang="scss">
.template-double-12 {
    .live-panel {
        background: #FFC70C;
        border-radius: 16px;
        .double-12-panel-title {
            padding-top: 20px;
            height: auto;
            background: transparent;
            ::before {
                position: absolute;
                left: 72px;
                bottom: 20px;
                display: block;
                content: '';
                width: 44px;
                height: 12px;
                background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/diandian.png') no-repeat center;
                background-size: 100%;
                transform: rotateY(180deg);
            }
            ::after {
                position: absolute;
                right: 72px;
                bottom: 20px;
                display: block;
                content: '';
                width: 44px;
                height: 12px;
                background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/diandian.png') no-repeat center;
                background-size: 100%;
            }
            > span {
                font-family: Microsoft YaHei;
                font-weight: 600;
                color: #7A1417;
            }
        }
        .double-12-panel-container {
            padding-top: 0px;
            > ul {
                > li:nth-of-type(1) {
                    border: none;
                }
                > li:not(:nth-of-type(1)) {
                    border: 4px solid #ffffff;
                    > label {
                        border: none;
                    }
                }
            }
        }
        .double-12-panel-button {
            border: 2px solid #7A1417;
            color: #7A1417;
        }
    }
    .back-to-top {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 96px;
        height: 96px;
        background: #FFFFFF;
        border-radius: 50%;
        &__icon {
            width: 40.6px;
            height: 45.5px;
        }
    }
}
</style>
<style module lang="scss">
.template-double-12 {
    background-color: #DB451B;
}
.background {
    position: relative;
    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/bg.png') no-repeat center top;
    background-size: 100% auto;
    min-height: 100vh;
}
.container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 494px 0 88px;
}
.module {
    margin-top: 80px;
    padding: 0 24px;
    &:nth-of-type(1) {
        margin-top: 0 !important;
    }
}

.coupon,
.yugou,
.popular {
    margin-top: 40px;
}

.miaosha,
.pintuan,
.yugou,
.package,
.popular {
    padding-left: 0;
    padding-right: 0;
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    color: #FEECC7;
    font-size: 26px;
    font-weight: 600;
}

</style>
