<template>
  <div :class="$style.personalCenter">
    <div :class="$style.top">
      <img :src="avatar" alt="头像">
      <div :class="$style.basicInfo">
        <span :class="$style.main" v-text="userName" />
        <div :class="$style.sub">
          <span :class="$style.level" v-text="roleName" />
          <router-link
            v-if="isApplyBtnShow"
            :class="$style.applyBtn"
            :to="{ name: 'ApplyHelper' }"
          >
            <pl-svg name="helper-apply" />
          </router-link>
          <div v-if="!agentUser && isApplied" :class="$style.progress">
            <span
              v-if="applyStatus === 'AWAIT'"
              :class="$style.progressLeft"
              v-text="'Helper审核中...'"
            />
            <span
              :class="$style.progressRight"
              @click="isModalShow = true"
              v-text="'查看进度'"
            />
          </div>
        </div>
      </div>
      <div :class="$style.setting">
        <router-link v-if="!isAdmin" :to="{ name: 'Setting' }">
          <pl-svg name="setting-white" />
        </router-link>
      </div>
    </div>

    <div :class="$style.content">
      <!-- 金库 -->
      <router-link
        v-if="agentUser"
        :class="[$style.panel, $style.finance]"
        :to="{ name: 'Coffers' }"
      >
        <div>
          <p>可提现润笔（元）</p>
          <p>
            <span v-text="balance || '0.00'" />
            <!-- <span :class="$style.withdrawTip">提现</span> -->
          </p>
        </div>
        <div>
          <p>今日润笔（元）</p>
          <p v-text="currentBalance || '0.00'" />
        </div>
        <pl-svg :class="$style.myRight" name="my-right" />
      </router-link>
      <!-- 我的订单 -->
      <div :class="$style.panel">
        <div :class="$style.orderStatus">
          <router-link :to="{ name: 'Orders', params: { status: 'WAIT_PAY' } }">
            <pl-svg name="wait-pay" />
            <span
              :class="{ [$style.badge]: true, [$style.oval]: count.WAIT_PAY > 99 }"
              v-if="count.WAIT_PAY"
              v-text="count.WAIT_PAY > 99 ? '99+' : count.WAIT_PAY"
            />
          </router-link>
          <router-link :to="{ name: 'Orders', params: { status: 'WAIT_SHIP' } }">
            <pl-svg name="wait-ship" />
            <span
              :class="{ [$style.badge]: true, [$style.oval]: count.WAIT_SHIP > 99 }"
              v-if="count.WAIT_SHIP"
              v-text="count.WAIT_SHIP > 99 ? '99+' : count.WAIT_SHIP"
            />
          </router-link>
          <router-link :to="{ name: 'Orders', params: { status: 'WAIT_RECEIVE' } }">
            <pl-svg name="wait-receive" />
            <span
              :class="{ [$style.badge]: true, [$style.oval]: count.WAIT_RECEIVE > 99 }"
              v-if="count.WAIT_RECEIVE"
              v-text="count.WAIT_RECEIVE > 99 ? '99+' : count.WAIT_RECEIVE"
            />
          </router-link>
          <router-link :to="{ name: 'RefundList', params: { status: 'ALL_ORDER' } }">
            <pl-svg name="after-sale" />
            <span
              :class="{ [$style.badge]: true, [$style.badgeAfterSale]: true, [$style.oval]: count.AFTER_SALE > 99 }"
              v-if="count.AFTER_SALE"
              v-text="count.AFTER_SALE > 99 ? '99+' : count.AFTER_SALE"
            />
          </router-link>
          <div :class="$style.segmentation">
            <pl-svg name="my-segmentation" />
          </div>
          <router-link :to="{ name: 'Orders', params: { status: 'ALL_ORDER' } }">
            <pl-svg name="my-order-list" />
          </router-link>
        </div>
        <div v-if="newFreight.length > 0" :class="$style.newLogistics">
          <div :class="$style.logisticsTitle">
            最新物流
          </div>
          <swiper :options="swiperOption" style="overflow: hidden;">
            <swiper-slide
              :class="$style.swiperSlide"
              v-for="(item, i) of newFreight"
              :key="i"
            >
              <router-link
                :class="$style.logisticsContent"
                :to="{ name: 'Freight', params: { orderId: item.orderId }, query: { img: item.productImageUrls[0] } }"
              >
                <div :class="$style.contentLeft">
                  <img v-img-error :src="item.productImageUrls[0]">
                </div>
                <div :class="$style.contentRight">
                  <div :class="$style.deliveryStatus">
                    派送中
                  </div>
                  <div :class="$style.deliveryDetails" v-text="item.orderLogisticTrackModel.content" />
                </div>
              </router-link>
            </swiper-slide>
          </swiper>
        </div>
      </div>
      <router-link
        v-if="isApplyBtnShow"
        :class="[$style.panel, $style.tip]"
        :to="{ name: 'WhatsHelper' }"
      >
        <span :class="$style.tipCircle" />
        <span>成为Helper，第一桶金从这里开始>></span>
      </router-link>
      <you-like :class="$style.recommend" :is-my="true" />
    </div>
    <modal
      ref="modal"
      :show.sync="isModalShow"
      title="Helper认证审核进度"
      title-align="left"
      hide-footer
      close-on-click-overlay
    >
      <Progress
        :class="$style.progressModal"
        :steps="progress"
        :active="0"
      />
    </modal>

  </div>
</template>

<script>
import youLike from './../home/components/YouLike.vue'
import Modal from '../../components/penglai-ui/Modal.vue'
import Progress from './components/Progress.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { orderPhysicalorderSummary, getHelperApplicationProgress } from '../../apis/order-manager'
import { getNewFreight } from '../../apis/my'
import { mapGetters } from 'vuex'

const orderStatusMapCamel = {
  new: 'NEW',
  waitPayment: 'WAIT_PAY',
  waitDelivery: 'WAIT_SHIP',
  waitCollect: 'WAIT_RECEIVE',
  comment: 'FINISHED',
  afterSale: 'AFTER_SALE'
}

export default {
  name: 'My',
  components: {
    youLike,
    Modal,
    Progress,
    swiper,
    swiperSlide
  },
  data () {
    return {
      count: {
        WAIT_PAY: 0,
        WAIT_SHIP: 0,
        WAIT_RECEIVE: 0,
        FINISHED: 0,
        AFTER_SALE: 0
      },
      swiperOption: {
        direction: 'vertical',
        autoHeight: true,
        autoplay: true,
        height: window.innerWidth / 750 * 88
      },
      newFreight: [],
      progress: [],
      applyStatus: 'NOT_APPLY',
      isModalShow: false
    }
  },
  computed: {
    ...mapGetters(['avatar', 'userName', 'agentUser', 'isAdmin', 'userId', 'currentBalance', 'balance', 'roleName', 'roleCode']),
    isApplyBtnShow () {
      return this.roleCode === 'VISITOR' ||
        (!this.agentUser && this.roleCode === 'MEMBERSHIP' && (this.applyStatus === 'NOT_APPLY' || this.applyStatus === 'REJECT'))
    },
    // 是否申请过helper
    isApplied () {
      return this.applyStatus === 'AWAIT' ||
        this.applyStatus === 'REJECT'
    }
  },
  async activated () {
    try {
      this.orderPhysicalorderSummary()
      this.getProgress()
      if (this.roleCode === 'VISITOR') {
        await this.$confirm({ message: '为了您的账号安全，请绑定手机号', confirmText: '去绑定', closeOnClickMask: false })
        setTimeout(() => {
          this.$router.push({ name: 'BindMobile' })
        }, 1000)
      } else {
        this.getNewFreight()
      }
    } catch (e) {
      throw e
    }
  },
  deactivated () {
    this.isModalShow = false
    this.progress = []
    this.newFreight = []
  },
  methods: {
    async getNewFreight () {
      try {
        const { result } = await getNewFreight()
        this.newFreight = result
      } catch (e) {
        throw e
      }
    },
    // 获取各个状态订单数量
    async orderPhysicalorderSummary () {
      try {
        const { result } = await orderPhysicalorderSummary(this.userId)
        for (let key of Object.keys(result)) {
          if (orderStatusMapCamel.hasOwnProperty(key)) {
            this.count[orderStatusMapCamel[key]] = result[key] > 99 ? '99+' : result[key]
          }
        }
      } catch (e) {
        throw e
      }
    },
    // 获取helper申请进度
    async getProgress () {
      try {
        const { result } = await getHelperApplicationProgress()
        this.applyStatus = (result && result.status) ? result.status : 'NOT_APPLY'
        if (!result) return
        if (result.status === 'AWAIT') {
          this.progress = [{
            text: '正在审核认证资料；', desc: '审核时间为1-3个工作日'
          }, {
            text: '提交Helper认证资料；', desc: result.applyTime.replace(/-/g, '.')
          }]
        } else if (result.status === 'REJECT') {
          this.progress = [{
            text: 'Helper认证资料被驳回', desc: result.auditTime.replace(/-/g, '.')
          }, {
            text: '正在审核认证资料；', desc: '审核时间为1-3个工作日'
          }, {
            text: '提交Helper认证资料；', desc: result.applyTime.replace(/-/g, '.')
          }]
        }
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .personal-center {
    box-sizing: border-box;
    min-height: 100vh;
    padding-bottom: 90px;
  }
  .content {
    position: relative;
    top: -24px;
    padding: 0 24px 40px;
  }
  .panel {
    position: relative;
    background: #fff;
    border-radius: 20px;
    margin-bottom: 24px;
    overflow: hidden;
   }

  /* 头部 starts */
  .top {
    position: relative;
    display: flex;
    align-items: center;
    padding: 16px 32px 54px 46px;
    background-color: #F2B036;
    img {
      width: 110px;
      height: 110px;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  .basic-info {
    flex: 1;
    padding-left: 32px;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    .main {
      font-size: 42px;
      font-weight: bold;
      margin-bottom: 8px;
      padding-bottom: 20rpx;
      font-size: 42rpx;
      font-weight: bold;
      color: #fff;
      line-height: 52rpx;
    }
    .sub {
      display: flex;
      align-items: center;
      line-height: 44px;
    }
    .level {
      font-size: 20px;
      font-weight: bolder;
      color: #FFF;
      &:before {
        content: 'Lv';
        margin-right: 8px;
      }
    }
    .apply-btn {
      margin-left: 32px;
      margin-right: -16px;
      height: 44px;
      line-height: 44px;
      svg {
        width: 158px;
      }
    }
    .progress {
      display: flex;
      margin-left: 32px;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid #FFF;
      span,
      a {
        display: inline-block;
        height: 44px;
        line-height: 44px;
        font-size: 20px;
        text-align: center;
      }
      .progress-left {
        padding: 0 10px;
        background-color: #FFF;
        color: #FE7700;
      }
      .progress-right {
        display: inline-block;
        width: 120px;
        background-color: #F2B036;
        color: #FFF;
      }
    }
  }
  .setting {
    position: absolute;
    top: 36px;
    right: 32px;
    svg {
      width: 42px;
    }
  }
  /* 头部 ends */

  /* 小金库 starts */
  .finance {
    display: flex;
    align-items: center;
    padding: 28px 28px 32px 40px;
    background-color: #fff;
    > div {
      flex: 1;
      display: inline-flex;
      flex-direction: column;
      color: #999;
      > p {
        &:nth-of-type(1) {
          font-size: 26px;
          margin-bottom: 8px;
        }
        &:nth-of-type(2) {
          font-size: 46px;
        }
      }
    }
    > svg{
      width: 18px;
      height: 26px;
    }
  }
  // .withdraw-tip {
  //   margin-left: 48px;
  //   line-height: 44px;
  //   font-weight: normal;
  //   font-size: 28px;
  //   color: #85A5FF;
  // }
  /* 小金库 ends */

  /* 订单 starts */
  .order-status {
    padding: 30px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    a {
      position: relative;
      font-size: 20px;
      &:nth-last-of-type(1) .badge {
        right: -14px;
      }
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
      width: 50px;
      height: 50px;
      line-height: 48px;
      font-size: 28px;
      transform: scale(.5);
      transform-origin: 0 0;
      color: #fff;
      // background: url("../../assets/images/my/circle.png") no-repeat center center;
      background-color: #F2B036;
      background-size: 100%;
      border-radius: 50%;
      &.badge-after-sale {
        right: -10px;
      }
      &.oval {
        padding: 0 10px;
        width: auto;
        right: -40px;
      }
    }
    .segmentation {
      position: absolute;
      right: 160px;
    }
  }

  .new-logistics {
    padding: 16px 32px 24px;
    background-color: #FBFBFB;
    .swiperSlide {
      height: 146px;
    }
    .logistics-title {
      font-size: 24px;
      color: #666666;
      line-height: 34px;
      margin-bottom: 16px;
    }
    .logistics-content {
      display: flex;
      flex-direction: row;
      .content-left {
        width: 88px;
        height: 88px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .content-right {
        padding-left: 24px;
        .delivery-status {
          font-size: 28px;
          font-weight: 400;
          color: #1890FF;
          line-height: 40px;
        }
        .delivery-details {
          margin-top: 14px;
          font-size: 24px;
          color: #666666;
          line-height: 34px;
        }
      }
    }
  }
  /* 订单 ends */

  /* tip starts */
  .tip {
    display: flex;
    align-items: center;
    padding: 0 30px;
    height: 88px;
    line-height: 56px;
    font-size: 26px;
    color: #98832E;
    background-color: #FCF0DE;
  }
  .tip-circle {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #98832E;
    margin-right: 20px;
  }
  /* tip ends */

  .recommend {
    margin-top: 32px;
    padding: 0 !important;
  }

  .progress-modal {
    box-sizing: border-box;
    padding-top: 40px;
    height: 600px;
  }
</style>
