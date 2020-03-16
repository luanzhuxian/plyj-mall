<template>
    <div :class="$style.templateXinchun">
        <div :class="$style.background">
            <div :class="$style.container" v-if="allLoaded">
                <div
                    v-if="parent.xinchunCouponTotal"
                    :class="$style.btnTop"
                    @click="$router.push({ name: 'MyCoupon' })"
                >
                    <div :class="$style.btnTopBg">
                        您有优惠券可使用！
                    </div>
                    <pl-svg name="icon-jinru" width="116" />
                </div>
                <!-- 直播-->
                <div :class="[$style.live, $style.module]" v-if="isLiveShow">
                    <live :data="parent.liveInfo" />
                </div>
                <!-- 活动-->
                <activity
                    v-if="isNwEventShow"
                    :class="[$style.activity, $style.module]"
                    background="#FFFAE6"
                    box-shadow="0px 8px 12px rgba(121, 30, 5, 0.2)"
                />
                <!-- 品宣 -->
                <div :class="[$style.propagate, $style.module]" v-if="PIN_XUAN && PIN_XUAN.showStatue === 1">
                    <propagate :data="PIN_XUAN" />
                </div>
                <!-- 领券 -->
                <div :class="[$style.coupon, $style.module]" v-if="COUPON.values && COUPON.values.length">
                    <coupon :data="COUPON" />
                </div>
                <!-- 春耘 -->
                <div :class="[$style.chunyun, $style.module]" v-if="!!CHUN_YUN.otherValue && CHUN_YUN.values && CHUN_YUN.values.length">
                    <chunyun :data="CHUN_YUN" />
                </div>
                <!-- 拼团 -->
                <div :class="[$style.pintuan, $style.module]" v-if="PIN_TUAN.values && PIN_TUAN.values.length">
                    <pintuan :data="PIN_TUAN" />
                </div>
                <!-- 预购 -->
                <div :class="[$style.yugou, $style.module]" v-if="YU_GOU.values && YU_GOU.values.length">
                    <yugou :data="YU_GOU" />
                </div>
                <!-- 疯抢 -->
                <div :class="[$style.fengqiang, $style.module]" v-if="FENG_QIANG.values && FENG_QIANG.values.length">
                    <div :class="$style.title">
                        — 新春优惠感恩大回馈 —
                    </div>
                    <best-recommend :data="FENG_QIANG">
                        <template v-slot:price="{ price }">
                            <div :class="$style.priceWrapper">
                                <pl-svg name="icon-fengqiangjia" width="80" height="44" fill="#FE3C5E" />
                                <span :class="$style.price" v-text="price" />
                            </div>
                        </template>
                    </best-recommend>
                </div>
                <footer :class="$style.footer">
                    — 技术支持 朋来科技 —
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import Live from './xin-chun/Live.vue'
import Activity from './xin-chun/Activity.vue'
import Propagate from './xin-chun/Propagate.vue'
import Coupon from './xin-chun/Coupon.vue'
import Chunyun from './xin-chun/Chunyun.vue'
import Pintuan from './xin-chun/Pintuan.vue'
import Yugou from './xin-chun/Yugou.vue'
import BestRecommend from '../home/components/Best-Recommend.vue'

export default {
    name: 'TemplateXinchun',
    inject: ['parent'],
    components: {
        Live,
        Activity,
        Propagate,
        Coupon,
        Chunyun,
        Pintuan,
        Yugou,
        BestRecommend
    },
    data () {
        return {}
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
        PIN_XUAN () {
            return this.data.PIN_XUAN || {}
        },
        COUPON () {
            return this.data.COUPON || {}
        },
        CHUN_YUN () {
            return this.data.CHUN_YUN || {}
        },
        PIN_TUAN () {
            return this.data.PIN_TUAN || {}
        },
        YU_GOU () {
            return this.data.YU_GOU || {}
        },
        FENG_QIANG () {
            return this.data.FENG_QIANG || {}
        },
        isLiveShow () {
            const { liveInfo } = this.parent
            return liveInfo && liveInfo.liveModel && (liveInfo.liveModel.statue === 4 || (liveInfo.liveModel.statue === 2 && liveInfo.liveModel.hasNotice))
        },
        isNwEventShow () {
            return this.parent.nwEvent && this.parent.nwEvent.permissionStatus
        },
        allLoaded () {
            return this.parent.allLoaded
        }
    }
}
</script>

<style module lang="scss">
.template-xinchun {
  background-color: #F2D04A;
}
.background {
  position: relative;
  background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/df2dd58e-5cad-42af-9965-19cffcadf064.png") no-repeat center top;
  background-size: 100% auto;
  min-height: 100vh;
}
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 700px 0 88px;
  > .module {
    &:nth-of-type(1) {
      padding-top: 0 !important;
    }
  }
}

.btn-top {
  position: relative;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 12px;
  width: 658px;
  height: 100px;
  background: #FFF;
  border-radius: 20px;
  box-shadow: 0px 16px 24px rgba(121, 30, 5, 0.2);
  &-bg {
    background: linear-gradient(180deg, rgba(255, 193, 74, 1) 0%, rgba(255, 113, 56, 1) 100%);
    border-radius: 10px;
    font-size: 40px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 76px;
    color: #FFF;
    letter-spacing: 4px;
    text-align: center;
  }
  svg {
    position: absolute;
    top: -2px;
    right: -45px;
  }
}

.live {
  padding: 54px 24px 0;
}

.activity,
.propagate,
.coupon {
  padding: 32px 24px 0;
}

.chunyun {
  padding: 48px 0 0;
}

.pintuan,
.yugou {
  padding: 32px 0 0;
}

.fengqiang {
  padding: 34px 24px 0;
  background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/9f67ef6c-6a54-4e6b-ac11-090b8853a1ba.png") no-repeat right top;
  background-size: 200px auto;
  .title {
    padding: 8px 0 32px;
    text-align: center;
    color: #9D8218;
    font-size: 40px;
    font-weight: bolder;
    letter-spacing: 4px;
  }
  .price-wrapper {
    flex: 1;
    width: 0;
    display: flex;
    align-items: flex-end;
    @include elps();
  }
  .price {
    margin-left: 10px;
    font-size: 44px;
    font-family: Helvetica;
    font-weight: bold;
    color: #FE3C5E;
    &:before {
      content: '¥';
      font-size: 22px;
    }
  }
}

footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
  color: #FFF;
  font-size: 26px;
  font-weight: 600;
}
</style>
