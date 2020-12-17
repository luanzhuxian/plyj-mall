<template>
    <div :class="$style.templateSpring" class="template-spring-2021-green">
        <div :class="$style.background">
            <div :class="$style.container" v-if="allLoaded">
                <!-- 直播-->
                <section :class="[$style.live, $style.module]" v-if="isLiveShow">
                    <Panel
                        custom-class="spring-2021-green-live-panel"
                        title="直播放映室"
                        @click="$router.push({ name: 'InteractiveLive' })"
                    >
                        <Live :data="Live" />
                    </Panel>
                </section>
                <!-- 抽奖 -->
                <section :class="[$style.happyLottery, $style.module]" v-if="currentLottery && currentLottery.id && ~[1, 2].indexOf(currentLottery.status)">
                    <HappyLottery :data="currentLottery" v-if="currentLottery && currentLottery.id" />
                </section>
                <!-- 福利红包 -->
                <section :class="[$style.redPackage, $style.module]" v-if="RedPackage.values.length">
                    <RedPackage :data="RedPackage" />
                </section>
                <!-- 优惠券 -->
                <section :class="[$style.coupon, $style.module]" class="spring-2021-green-coupon" v-if="Coupon.values.length">
                    <Coupon :data="Coupon" />
                </section>
                <!-- 秒杀 -->
                <section :class="[$style.miaosha, $style.module]" v-if="Miaosha.showStatue === 1 && Miaosha.values.length">
                    <Miaosha :data="Miaosha" />
                </section>
                <!-- 拼团 -->
                <section :class="[$style.pintuan, $style.module]" v-if="Pintuan.showStatue === 1 && Pintuan.values.length">
                    <Pintuan :data="Pintuan" />
                </section>
                <!-- 预购 -->
                <section :class="[$style.yugou, $style.module]" class="spring-2021-green-yugou" v-if="Yugou.showStatue === 1 && Yugou.values.length">
                    <Yugou :data="Yugou" />
                </section>
                <!-- 组合课 -->
                <section :class="[$style.package, $style.module]" v-if="Package.showStatue === 1 && Package.values.length">
                    <Package :data="Package" />
                </section>
                <!-- 精品推荐 -->
                <section :class="[$style.popular, $style.module]" v-if="Popular.showStatue === 1 && Popular.values.length">
                    <Popular :data="Popular" />
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
import { mapGetters } from 'vuex'
import Live from '../spring-2021/Live.vue'
import RedPackage from '../spring-2021/Red-Package.vue'
import Miaosha from '../spring-2021/Miaosha.vue'
import Pintuan from '../spring-2021/Pintuan.vue'
import Yugou from '../spring-2021/Yugou.vue'
import Package from '../spring-2021/Package.vue'
import Popular from '../spring-2021/Popular.vue'
import Coupon from '../double-12-2020/Coupon.vue'
import HappyLottery from '../spring-2021/Happy-Lottery.vue'
import Panel from '../double-12-2020/Panel.vue'
import BackToTop from '../../../components/activity/BackToTop.vue'

export default {
    name: 'TemplateSpring2021Green',
    inject: ['parent'],
    components: {
        Live,
        RedPackage,
        Coupon,
        Miaosha,
        Pintuan,
        Yugou,
        Package,
        Popular,
        HappyLottery,
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
    computed: {
        ...mapGetters(['currentLottery']),
        Live () {
            return this.data.Live || { values: [] }
        },
        RedPackage () {
            return this.data.RedPackage || { values: [] }
        },
        Coupon () {
            return this.data.Coupon || { values: [] }
        },
        Miaosha () {
            return this.data.Miaosha || { values: [] }
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
        Popular () {
            return this.data.Popular || { values: [] }
        },
        isLiveShow () {
            return this.Live.showStatue === 1 && this.Live.values && this.Live.values.length
        },
        allLoaded () {
            return this.parent.allLoaded
        }
    }
}
</script>

<style lang="scss">
.template-spring-2021-green {
    .spring-2021-green-live-panel {
        background: #FFC70C;
        border-radius: 16px;
        > .double-12-panel-title {
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
        > .double-12-panel-container {
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
    .spring-2021-green-coupon {
        > .coupon-wrapper {
            &::before {
                background-color: #05A19A;
            }
            &::after {
                background-color: #05A19A;
            }
            > .coupon-title {
                background: none;
            }
        }
    }
    .spring-2021-green-yugou {
        .img-wrapper::before {
            display: none;
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
.template-spring {
    background-color: #05A19A;
}
.background {
    position: relative;
    background: url(https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/bg.png) no-repeat center top;
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
    &:nth-last-of-type(1) {
        margin-bottom: 0 !important;
    }
}
.live,
.red-package,
.coupon {
    margin-bottom: 40px;
}
.miaosha,
.pintuan,
.package {
    margin-bottom: 20px;
}
.yugou {
    margin-bottom: 60px;
}
.happy-lottery {
    margin-bottom: 60px;
}

.live,
.coupon {
    padding: 0 24px;
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
