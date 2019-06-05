<template>
  <div :class="$style.my">
    <div :class="$style.top">
      <img
        :src="avatar"
        alt="头像"
      >
      <!-- 未登录 -->
      <!--<pl-svg :class="$style.dafaultFace" name="default-face" />-->
      <div :class="$style.baseInfo">
        <span
          :class="$style.name"
          v-text="userName"
        />
        <div :class="$style.levelapply">
          <span
            :class="$style.level"
            v-text="roleName"
          />
          <router-link
            :to="{ name: 'ApplyHelper' }"
            :class="$style.apply"
          >
            <pl-svg name="apply-helper" />
          </router-link>
        </div>
      </div>
      <div :class="$style.settingBox">
        <router-link
          v-if="!isAdmin"
          :class="$style.settingEnter"
          :to="{ name: 'Setting' }"
        >
          <pl-svg name="my-setting" />
        </router-link>
      </div>
    </div>
    <!-- 金库 -->
    <div :class="$style.myMoney">
      <router-link
        tag="div"
        :class="$style.runbi"
        :to="{ name: 'Coffers' }"
      >
        <div>
          <p>可提现润笔（元）</p>
          <p>
            <span v-text="balance" />
            <!--          <span :class="$style.withdrawTip">提现</span>-->
          </p>
        </div>
        <div>
          <p>今日润笔（元）</p>
          <p v-text="currentBalance" />
        </div>
        <pl-svg
          :class="$style.myRight"
          name="my-right"
        />
      </router-link>
    </div>

    <!-- 我的订单 -->
    <div :class="$style.myOrders">
      <div :class="$style.orderStatus">
        <router-link :to="{ name: 'Orders', params: { status: 'WAIT_PAY' } }">
          <pl-svg name="wait-pay" />
          <span
            :class="$style.badge"
            v-if="count.WAIT_PAY"
            v-text="count.WAIT_PAY"
          />
        </router-link>
        <router-link :to="{ name: 'Orders', params: { status: 'WAIT_SHIP' } }">
          <pl-svg name="wait-ship" />
          <span
            :class="$style.badge"
            v-if="count.WAIT_SHIP"
            v-text="count.WAIT_SHIP"
          />
        </router-link>
        <router-link :to="{ name: 'Orders', params: { status: 'WAIT_RECEIVE' } }">
          <pl-svg name="wait-receive" />
          <span
            :class="$style.badge"
            v-if="count.WAIT_RECEIVE"
            v-text="count.WAIT_RECEIVE"
          />
        </router-link>
        <router-link :to="{ name: 'RefundList' }">
          <pl-svg name="after-sale" />
          <span
            :class="$style.badge"
            v-if="count.AFTER_SALE"
            v-text="count.AFTER_SALE"
          />
        </router-link>
        <div :class="$style.segmentation">
          <pl-svg name="my-segmentation" />
        </div>
        <router-link :to="{ name: 'Orders', params: { status: 'ALL_ORDER' } }">
          <pl-svg name="my-order-list" />
        </router-link>
      </div>
      <router-link
        :class="$style.newLogistics"
        :to="{ name: 'Freight', params: { orderId: '1135893298540593152' } }"
      >
        <div :class="$style.logisticsTitle">
          最新物流
        </div>
        <div :class="$style.logisticsContent">
          <div :class="$style.contentLeft">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559206487599&di=882d71c63c8238a102dff133972156e6&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fblog%2F201507%2F22%2F20150722175714_LwSjG.jpeg">
          </div>
          <div :class="$style.contentRight">
            <div :class="$style.deliveryStatus">
              派送中
            </div>
            <div :class="$style.deliveryDetails">
              [西安市] 快件已在鱼化寨签收
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div :class="$style.tip">
      <span :class="$style.tipCircle" />
      <router-link :to="{ name: 'WhatsHelper' }">
        成为Helper，第一桶金从这里开始>>
      </router-link>
    </div>
    <you-like
      :is-my="true"
      style="margin-top: 16px"
    />
    <!--    <div :class="$style.setting + ' radius-20'">-->
    <!--      <pl-fields-->
    <!--        icon="coffers"-->
    <!--        :icon-gap="16"-->
    <!--        text="小金库"-->
    <!--        :route="{ name: 'Coffers' }"-->
    <!--      />-->
    <!--      <pl-fields-->
    <!--        icon="address"-->
    <!--        :icon-gap="16"-->
    <!--        text="地址管理"-->
    <!--        :route="{ name: 'Address' }"-->
    <!--      />-->
    <!--      <pl-fields-->
    <!--        icon="setting"-->
    <!--        :icon-gap="16"-->
    <!--        text="账号设置"-->
    <!--        :route="{ name: 'Setting' }"-->
    <!--      />-->
    <!--    </div>-->
  </div>
</template>

<script>
import { orderPhysicalorderSummary } from '../../apis/order-manager'
import youLike from './../old-home/YouLike.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'My',
  components: {
    youLike
  },
  data () {
    return {
      count: {
        WAIT_PAY: 0,
        WAIT_SHIP: 0,
        WAIT_RECEIVE: 0,
        FINISHED: 0,
        AFTER_SALE: 0
      }
    }
  },
  computed: {
    ...mapGetters(['avatar', 'userName', 'agentUser', 'isAdmin', 'userId', 'currentBalance', 'balance', 'roleName', 'orderStatusMapCamel'])
  },
  async activated () {
    try {
      const { orderStatusMapCamel } = this
      const { result } = await orderPhysicalorderSummary(this.userId)
      for (let key of Object.keys(result)) {
        if (orderStatusMapCamel.hasOwnProperty(key)) {
          this.count[orderStatusMapCamel[key]] = result[key] > 99 ? '99+' : result[key]
        }
      }
    } catch (e) {
      throw e
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
  }
  .name {
    font-size: 42px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .level {
    font-size: 22px;
    font-weight: bolder;
    color: #b8b8b8;
    &:before {
      content: 'Lv';
      margin-right: 8px;
    }
  }
  .tip {
    display: flex;
    align-items: center;
    height: 88px;
    padding: 0 28px;
    margin: 0 24px;
    border-radius: 20px;
    line-height: 56px;
    font-size: 26px;
    color: #fe7700;
    background-color: #FCF0DE;
    a {
      color: #98832E;
      text-decoration: none;
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
  .tip-circle{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #98832E;
    margin-right: 20px;
  }
  .apply {
    padding-left: 32px;
    svg {
      width: 158px;
    }
  }
  .levelapply{
    display: flex;
    align-items: center;
  }
  .setting-box{
    position: absolute;
    top: 36px;
    right: 32px;
  }
  .setting-enter{
    svg{
      width: 42px;
    }
  }
  .my-money {
    position: relative;
    display: flex;
  }
  .runbi {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 28px 28px 28px 48px;
    background-color: #fff;
    > div {
      display: inline-flex;
      flex-direction: column;
      flex: 1;
      color: #999;
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
    > svg{
      width: 18px;
      height: 26px;
    }
  }
  .withdraw-tip {
    margin-left: 48px;
    line-height: 44px;
    font-weight: normal;
    font-size: 28px;
    color: #85A5FF;
  }
  .my-orders {
    /*padding: 20px 28px;*/
    margin: 16px 24px 24px;
    background-color: #fff;
    border-radius: 20px;
  }
  .order-status {
    padding-top: 38px;
    display: flex;
    justify-content: space-around;
    /*margin-top: 30px;*/
    padding-bottom: 15px;
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
    .segmentation{
      position: absolute;
      right: 160px;
    }
  }
  .new-logistics{
    background-color: #FBFBFB;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    .logistics-title{
      padding-top: 16px;
      padding-left: 32px;
      font-size:24px;
      font-weight:400;
      color:rgba(102,102,102,1);
      line-height:34px;
    }
    .logistics-content{
      display: flex;
      flex-direction: row;
      padding: 16px 0 24px 32px;
      .content-left{
        width: 88px;
        height: 88px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .content-right{
        padding-left: 24px;
        .delivery-status{
          font-size:28px;
          font-weight:400;
          color:rgba(24,144,255,1);
          line-height:40px;
        }
        .delivery-details{
          margin-top: 14px;
          font-size:24px;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height:34px;
        }
      }
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
