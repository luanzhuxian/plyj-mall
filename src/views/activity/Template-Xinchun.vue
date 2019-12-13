<template>
  <div :class="$style.templateXinchun">
    <div :class="$style.background">
      <div :class="$style.container">
        <div
          v-if="parent.topBtnType === 1"
          :class="$style.btnTop"
          @click="$router.push({ name: 'MyCoupon' })"
        >
          <div :class="$style.btnTopBg">
            您有优惠券可使用！
          </div>
          <pl-svg name="icon-jinru" width="116" />
        </div>
        <!-- 直播-->
        <div :class="$style.live" v-if="isLiveShow">
          <live />
        </div>
        <!-- 品宣 -->
        <div :class="$style.propagate" v-if="PIN_XUAN && PIN_XUAN.showStatue === 1">
          <propagate :data="PIN_XUAN" />
        </div>
        <div :class="$style.propagate" v-if="COUPON.values && COUPON.values.length">
          <coupon
            :data="COUPON"
            :type="type"
          />
        </div>
        <div :class="$style.pintuan" v-if="PIN_TUAN.values && PIN_TUAN.values.length">
          <pintuan :data="PIN_TUAN" />
        </div>
        <div :class="$style.yugou" v-if="YU_GOU.values && YU_GOU.values.length">
          <yugou :data="YU_GOU" />
        </div>
        <div :class="$style.fengqiang" v-if="FENG_QIANG.values && FENG_QIANG.values.length">
          <div :class="$style.title">
            — 新春优惠感恩大回馈 —
          </div>
          <best-recommend :data="FENG_QIANG">
            <template v-slot:price="{ price }">
              <div :class="$style.priceWrapper">
                <pl-svg name="icon-fengqiangjia" width="80" height="26" fill="#FE3C5E" />
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
import Propagate from './xin-chun/Propagate.vue'
import Coupon from './xin-chun/Coupon.vue'
import Pintuan from './xin-chun/Pintuan.vue'
import Yugou from './xin-chun/Yugou.vue'
import BestRecommend from '../home/components/Best-Recommend.vue'

export default {
  name: 'HomeTemplateB',
  inject: ['parent'],
  components: {
    Live,
    Propagate,
    Coupon,
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
      return this.parent.liveInfo &&
      (this.parent.liveInfo.statue === 4 || (this.parent.liveInfo.statue === 2 && this.parent.liveInfo.hasNotice))
    }
  }
}
</script>

<style module lang="scss">
.template-xinchun {
  background-color: #F2D04A;
}
.background {
  background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/45a22a0e-5560-43a6-b783-485287939361.png") no-repeat center top;
  background-size: 100% auto;
  min-height: 100vh;
}
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 700px 0 88px;
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

.propagate,
.coupon {
  padding: 32px 24px 0;
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
  svg {
    margin-bottom: 8px;
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
