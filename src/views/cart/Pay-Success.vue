<template>
  <div :class="$style.paySuccess">
    <div :class="$style.top">
      <pl-svg
        :class="$style.icon"
        :name="orderType === 'FORMAL_CLASS' ? 'icon-signup-success' : 'icon-pay-success'"
      />
      <p :class="$style.tip1">
        <span v-if="orderType === 'FORMAL_CLASS'">报名/学习成功</span>
        <span v-else>订单支付成功</span>
      </p>
      <p :class="$style.tip2" v-if="orderType !== 'FORMAL_CLASS'">
        请保持手机通畅，以便于我们为您提供服务！
      </p>
      <router-link
        :class="$style.tip3"
        :replace="true"
        :to="
          orderCount === 1
            ? { name: 'OrderDetail', params: { orderId } }
            : { name: 'Orders', params: { status: 'ALL_ORDER' } }
        "
      >
        查看订单
      </router-link>
      <pl-button
        size="huge"
        type="warning"
        @click="$router.replace({ name: 'Home' })"
      >
        完成，返回首页
      </pl-button>
    </div>
    <transition name="fade">
      <div :class="$style.haibao" v-if="haibao">
        <img @click="haibao = ''" :src="haibao" alt="">
      </div>
    </transition>
    <!--<img
      v-if="showMoonCake"
      style="width: 100%; display: block; margin-top: 46px;"
      src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/moon-cake/pay-success.jpg" alt=""
      @click="$router.replace({ name: 'SignUp' })"
    >-->
    <!-- 820 -->
    <!--<WWEC :show.sync="show820" />-->
    <you-like :is-my="true" />
  </div>
</template>

<script>
import youLike from './../home/components/YouLike.vue'
// import WWEC from './../../components/WWEC.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'PaySuccess',
  components: {
    youLike
    // WWEC
  },
  data () {
    return {
      haibao: '',
      // show820: false,
      data88: {
        '1530139721': {
          haibao: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/hansi_haibao.jpg',
          pop: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/hansi_pop.jpg',
          gif: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/han_si_bo.gif',
          startTime: 1564588800000, // 2019-08-01 00:00:00
          endTime: 1568563199000 // 2019-09-15 23:59:59
        },
        '1532969341': {
          haibao: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/zhide_haibao.jpg',
          pop: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/zhide_pop.jpg',
          gif: 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/88/zhi_de_shuo.gif',
          startTime: 1564588800000, // 2019-08-01 00:00:00
          endTime: 1567267199000 // 2019-08-31 23:59:59
        }
      }
    }
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    orderCount: {
      type: [Number, String],
      default: 1
    }
  },
  activated () {
    this.showPop(500)
    // if (this.mallId === '1057573777392603136') {
    //   this.show820 = true
    // }
  },
  computed: {
    ...mapGetters(['mallId', 'serverTime']),
    orderType () {
      return this.$route.query.orderType
    }
    // showMoonCake () {
    //   return this.mallId === '1057573777392603136'
    // }
  },
  methods: {
    showPop (delay) {
      let serverTime = moment(this.serverTime).valueOf()
      let mallId = this.mallId
      let data = this.data88[mallId]
      if (data && data.startTime <= serverTime && data.endTime >= serverTime) {
        setTimeout(() => {
          this.haibao = this.data88[mallId].haibao
        }, delay)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    let { orderId } = to.params
    if (orderId) {
      next()
    } else {
      next({ name: 'Home' })
    }
  }
}
</script>

<style module lang="scss">
.paySuccess {
  display: flex;
  padding: 64px 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #fff;
}
.top {
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
.icon {
  width: 148px;
  height: 148px;
}
.tip1 {
  margin-top: 20px;
  font-size: 36px;
  font-weight: bold;
}
.tip2 {
  margin-top: 24px;
  font-size: 28px;
  color: #999;
}
.tip3 {
  display: block;
  margin: 48px 0;
  font-size: 30px;
  color: #387af6;
}
.haibao {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, .5);
  text-align: center;
  overflow: auto;
  z-index: 5;
  > img {
    width: 90%;
    justify-items: flex-start !important;
  }
}
</style>
