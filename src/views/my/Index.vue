<template>
  <div :class="$style.my">
    <div :class="$style.top">
      <img :src="avatar" alt="头像">
      <!-- 未登录 -->
      <!--<pl-svg :class="$style.dafaultFace" name="default-face" />-->
      <div :class="$style.baseInfo">
        <span :class="$style.name" v-text="userName" />
        <span :class="$style.level" v-text="roleName"></span>
        <!-- 未登录 -->
        <!--<pl-svg :class="$style.loginBtn" name="login-btn" />-->
      </div>
      <!-- 申请helper -->
      <router-link v-if="!agentUser && !isAdmin" :to="{ name: 'ApplyHelper' }" :class="$style.apply">
        <pl-svg name="apply-helper"></pl-svg>
      </router-link>
    </div>
    <div :class="$style.tip">
      如果您还不了解什么是Helper，请点击查看 <router-link :to="{ name: 'WhatsHelper' }">什么是Helper？</router-link><pl-svg name="right"></pl-svg>
    </div>

    <!-- 金库 -->
    <div :class="$style.myMoney">
      <router-link tag="div" :to="{ name: 'WithdrawCash' }">
        <p>可提现润笔（元）</p>
        <p v-text="balance" />
      </router-link>
      <div>
        <p>今日润笔（元）</p>
        <p v-text="currentBalance" />
      </div>
    </div>

    <!-- 我的订单 -->
    <div :class="$style.myOrders">
      <ModuleTitle title="我的订单" tip="全部订单" suffix-icon="right" :route="{ name: 'Orders' }" />
      <div :class="$style.orderStatus">
        <router-link :to="{ name: 'Orders', params: { status: 'WAIT_PAY' } }">
          <pl-svg name="wait-pay"></pl-svg>
          <span :class="$style.badge" v-if="count.WAIT_PAY" v-text="count.WAIT_PAY" />
        </router-link>
        <router-link :to="{ name: 'Orders', params: { status: 'WAIT_SHIP' } }">
          <pl-svg name="wait-ship"></pl-svg>
          <span :class="$style.badge" v-if="count.WAIT_SHIP" v-text="count.WAIT_SHIP"></span>
        </router-link>
        <router-link :to="{ name: 'Orders', params: { status: 'WAIT_RECEIVE' } }">
          <pl-svg name="wait-receive"></pl-svg>
          <span :class="$style.badge" v-if="count.WAIT_RECEIVE" v-text="count.WAIT_RECEIVE"></span>
        </router-link>
        <router-link :to="{ name: 'Orders', params: { status: 'FINISHED' } }">
          <pl-svg name="wait-comment"></pl-svg>
          <span :class="$style.badge" v-if="count.FINISHED" v-text="count.FINISHED"></span>
        </router-link>
        <router-link :to="{ name: 'RefundList' }">
          <pl-svg name="after-sale"></pl-svg>
          <span :class="$style.badge" v-if="count.POST_SALE_SERVICE" v-text="count.POST_SALE_SERVICE" />
        </router-link>
      </div>
    </div>

    <div :class="$style.setting + ' radius-20'">
      <pl-fields icon="coffers" :icon-gap="16" text="小金库" :route="{ name: 'Coffers' }"></pl-fields>
      <pl-fields icon="address" :icon-gap="16" text="地址管理" :route="{ name: 'Address' }"></pl-fields>
      <pl-fields icon="setting" :icon-gap="16" text="账号设置" :route="{ name: 'Setting' }"></pl-fields>
    </div>
  </div>
</template>

<script>
import ModuleTitle from '../../components/Module-Title.vue'
import { orderPhysicalorderSummary } from '../../apis/order-manager'
import { mapGetters } from 'vuex'
export default {
  name: 'My',
  components: {
    ModuleTitle
  },
  data () {
    return {
      count: {
        FINISHED: 0,
        POST_SALE_SERVICE: 0,
        WAIT_PAY: 0,
        WAIT_RECEIVE: 0,
        WAIT_SHIP: 0
      }
    }
  },
  computed: {
    ...mapGetters(['avatar', 'userName', 'agentUser', 'isAdmin', 'userId', 'currentBalance', 'balance', 'roleName'])
  },
  activated () {
    this.getCount()
  },
  methods: {
    // 获取未处理订单的数量
    async getCount () {
      try {
        const data = await orderPhysicalorderSummary(this.userId)
        this.count = data.result
        for (let k of Object.keys(this.count)) {
          if (this.count[k] > 99) this.count[k] = '99+'
        }
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .my {
    margin-bottom: 120px;
  }
  .top {
    display: flex;
    align-items: center;
    height: 200px;
    padding: 0 28px;
    background-color: #fff;
    img {
      width: 120px;
      height: 120px;
      object-fit: cover;
      border-radius: 50%;
    }
    .dafault-face {
      width: 120px;
    }
    .login-btn {
      width: 200px;
    }
  }
  .base-info {
    margin-left: 28px;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }
  .name {
    font-size: 42px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .level {
    font-size: 22px;
    font-weight: bolder;
    color: #b8b8b8;
    &:before {
      content: 'Lv';
      margin-right: 8px;
      font-family: PingFang SC;
    }
  }
  .tip {
    height: 56px;
    padding: 0 28px;
    line-height: 56px;
    font-size: 22px;
    color: #fe7700;
    background-color: #fff7e6;
    a {
      font-weight: bolder;
      color: #fe7700;
      border-bottom: 2px solid #fe7700;
    }
    svg {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      padding: 4px;
      margin-left: 8px;
      vertical-align: -4px;
      border-radius: 50%;
      background-color: #fe7700;
      fill: #fff;
      box-sizing: border-box;
    }
  }
  .apply {
    svg {
      width: 166px;
    }
  }
  .my-money {
    display: flex;
    > div {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      flex: 1;
      padding: 28px;
      color: #999;
      background-color: #fff;
      > p {
        &:nth-of-type(1) {
          font-size: 26px;
          margin-bottom: 10px;
        }
        &:nth-of-type(2) {
          font-size: 44px;
          font-weight: bold;
        }
      }
    }
  }
  .my-orders {
    padding: 20px 28px;
    margin-top: 16px;
    background-color: #fff;
  }
  .order-status {
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
    a {
      position: relative;
      font-size: 20px;
    }
    svg {
      height: 85px;
    }
    .badge {
      display: inline-flex;
      justify-content: center;
      position: absolute;
      top: -14px;
      right: -28px;
      width: 56px;
      height: 56px;
      line-height: 54px;
      font-size: 28px;
      transform: scale(.5);
      transform-origin: 0 0;
      color: #fff;
      background: url("../../assets/images/my/circle.png") no-repeat center center;
      background-size: 100%;
    }
    a:nth-last-of-type(1) .badge {
      right: -14px;
    }
  }
  .setting {
    width: 642px;
    margin: 30px auto 0;
    padding-left: 28px;
    background-color: #fff;
    overflow: hidden;
  }
</style>
