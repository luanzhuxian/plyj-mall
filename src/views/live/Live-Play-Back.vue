<template>
  <div :class="$style.livePlayBack">
    <div :class="$style.videoBox">
      <PaidPlayer :src="videoMes.url" />
      <!--<video preload controls x5-video-player-type="h5-page" width="100%" :src="videoMes.url" />-->
      <div>商品</div>
    </div>
    <div :class="$style.productList" v-if="productList.length">
      <div :class="$style.tabTitle">
        精选商品（{{ productList.length }}件）
      </div>
      <div
        v-for="(item, i) of productList"
        :key="i"
        :class="$style.product"
        @click="$router.push({ name: 'Product', params: { productId: item.id } })"
      >
        <img :src="item.productMainImage" alt="">
        <div :class="$style.left">
          <div :class="$style.name" v-text="item.productName" />
          <div :class="$style.price">
            ￥{{ item.price }}元
          </div>
          <!--<div :class="$style.count">3</div>-->
        </div>
        <div :class="$style.vieFor">
          <pl-svg name="icon-vie-for" fill="#fff" width="40" height="70" />
        </div>
      </div>
    </div>
    <!-- 支付弹框 -->
    <transition name="fade">
      <div :class="$style.payWrap" v-if="needPay">
        <div :class="$style.payBox">
          <div :class="$style.title">
            支付提示
          </div>
          <div :class="$style.message">
            该直播视频需支付￥{{ payCount }}后可观看回放，确认要观看吗？
          </div>
          <div :class="$style.buttons">
            <pl-button size="middle" plain @click="cancelPay">我再想想</pl-button>
            <pl-button size="middle" type="warning" @click="submitOrder">立即付款</pl-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getActiveCompleteInfo, getVideoMesById, hasPied, pay, cancelOrder } from '../../apis/live.js'
import wechatPay from '../../assets/js/wechat/wechat-pay'
import PaidPlayer from '../../components/common/Paid-Player.vue'
export default {
  name: 'LivePlayBack',
  components: {
    PaidPlayer
  },
  data () {
    return {
      activityId: '',
      id: '',
      needPay: false,
      payCount: 0,
      productList: [], // 商品列表
      videoMes: {}
    }
  },
  async activated () {
    try {
      this.activityId = this.$route.params.activityId // 直播活动id
      this.payCount = this.$route.params.payCount || 0 // 直播活动价格
      this.id = this.$route.params.id // 视频id
      if (this.activityId) {
        // 查看录播前，查看是否需要付款
        await this.isNeedPay()
      } else {
        this.getVideoMes()
        this.getDetail()
      }
    } catch (e) {
      throw e
    }
  },
  methods: {
    async isNeedPay () {
      let payCount = await hasPied(this.activityId)
      // 返回为0-未购买， 其他数值-当时购买的价格
      if (!payCount && this.payCount) { // 此视频有价格但是未付款时，弹出支付弹框
        // 还没支付
        this.needPay = true
      }
      if (!this.needPay) {
        this.getVideoMes()
        this.getDetail()
      }
    },
    async getDetail () {
      try {
        let mes = await getActiveCompleteInfo()
        if (mes) {
          this.productList = mes.productList || []
        }
      } catch (e) { throw e }
    },
    async getVideoMes () {
      try {
        let mes = await getVideoMesById(this.id)
        if (mes) {
          this.videoMes = mes
        }
      } catch (e) { throw e }
    },
    async submitOrder () {
      try {
        let res = await pay(this.activityId)
        await this.pay(res)
      } catch (e) {
        throw e
      }
    },
    async pay (CREDENTIAL) {
      return new Promise(async (resolve, reject) => {
        try {
          await wechatPay(CREDENTIAL)
          this.getDetail()
          this.getVideoMes()
          this.$success('付款成功立即观看')
          this.needPay = false
        } catch (e) {
          this.needPay = false
          this.$confirm({
            message: '支付失败',
            viceMessage: '<p>若要正常观看</p><p>请重新发起支付</p>',
            confirmText: '重新支付',
            useDangersHtml: true
          }).then(() => {
            this.needPay = true
          }).catch(() => {
            this.cancelPay()
          })
          await cancelOrder(this.activityId).then(res => {
            reject(e)
          }).catch(err => {
            reject(err)
          })
        }
      })
    },
    cancelPay () {
      this.$router.back()
    }
  },
  deactivated () {
    this.needPay = false
    this.productList = []
    this.videoMes = {}
  }
}
</script>

<style lang='scss' module scoped>

  .live-play-back {
    > .video-box {
      width: 100%;
      > video {
        object-fit:fill;
        width: 100%;
        height: 442px;
      }
      > div {
        background: #fff;
        font-size: 26px;
        padding: 0 24px;
        line-height: 68px;
      }
    }
    > .product-list {
      padding: 12px 24px;
      height: calc(100vh -  522px);
      overflow: auto;
      > .tab-title {
        font-size: 32px;
        line-height: 44px;
        margin-bottom: 12px;
      }
      > .product {
        position: relative;
        display: flex;
        height: 262px;
        margin-bottom: 20px;
        padding: 16px;
        background-color: #fff;
        border-radius: 20px;
        box-sizing: border-box;
        > .vie-for {
          position: absolute;
          bottom: 20px;
          right: 16px;
          width: 72px;
          height: 72px;
          line-height: 72px;
          text-align: center;
          background-color: #fe7700;
          border-radius: 36px;
        }
        > img {
          width: 314px;
          height: 208px;
          margin-right: 20px;
          object-fit: cover;
          border-radius: 16px;
        }
        > .left {
          display: flex;
          flex-direction: column;
          margin-top: 10px;
          > .name {
            line-height: 38px;
            font-size: 28px;
            @include elps-wrap(2);
          }
          > .price {
            margin-top: 28px;
            font-size: 36px;
            line-height: 50px;
            color: #fe7700;
            font-weight: bold;
          }
          > .count {
            margin-top: 4px;
            font-size: 24px;
            color: #999;
            line-height: 34px;
          }
        }
      }
    }
  }

  .pay-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2002;
    background-color: rgba(0, 0, 0, .65);
  }
  .pay-box {
    width: 500px;
    box-sizing: border-box;
    margin: 280px auto 0;
    padding: 22px 24px;
    background-color: #fff;
    text-align: center;
    .title{
      padding-bottom: 22px;
      font-size:28px;
      font-weight:bold;
      color:#000;
    }
    .message{
      padding-bottom: 22px;
      font-size:20px;
      line-height:26px;
      color:#999;
    }
    > .buttons {
      > button {
        margin-left: 20px;
      }
    }
  }

</style>
