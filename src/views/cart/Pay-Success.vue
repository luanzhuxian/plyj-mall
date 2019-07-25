<template>
  <div :class="$style.paySuccess">
    <div :class="$style.top">
      <pl-svg
        :class="$style.icon"
        :name="orderType === 'FORMAL_CLASS' ? 'signup-success' : 'pay-success'"
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
        <pl-svg name="close3" @click="haibao = ''" color="#fff" />
        <img @click="haibao = ''" :src="haibao" alt="">
      </div>
    </transition>
    <you-like :is-my="true" />
  </div>
</template>

<script>
import youLike from './../home/components/YouLike.vue'
export default {
  name: 'PaySuccess',
  components: {
    youLike
  },
  data () {
    return {
      haibao: ''
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
    this.showHaibao()
  },
  computed: {
    orderType () {
      return this.$route.query.orderType
    }
  },
  methods: {
    showHaibao () {
      this.haibao = this.$store.state.data88[this.$store.getters.mallId].haibao
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
  margin-top: 64px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.top {
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
.icon {
  width: 148px;
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
  > svg {
    position: absolute;
    top: 70px;
    left: 50px;
    width: 48px;
    margin-top: 64px;
    z-index: 10;
  }
}
</style>
