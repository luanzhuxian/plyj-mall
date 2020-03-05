<template>
  <div :class="$style.livePlayBack">
    <div :class="$style.videoBox">
      <video preload controls x5-video-player-type="h5-page" width="100%" :src="videoMes.url" />
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
            <button :class="$style.cancelBtn" @click="cancelPay">取消</button>
            <button @click="submitOrder">确定</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getActiveCompleteInfo, getVideoMesById, pay, cancelOrder } from '../../apis/live.js'
import { hasPied } from './../../apis/live-library'
import wechatPay from '../../assets/js/wechat/wechat-pay'
export default {
  name: 'LivePlayBack',
  data () {
    return {
      id: '',
      activityId: '',
      needPay: false,
      payCount: 0, // 价格
      productList: [], // 商品列表
      videoMes: {}
    }
  },
  async activated () {
    try {
      this.needPay = false
      this.id = this.$route.params.id // 视频id
      this.activityId = this.$route.params.activityId // 活动id
      this.needPay = await this.isNeedPay()
      if (!this.needPay) {
        this.getVideoMes()
        this.getDetail()
      }
    } catch (e) { throw e }
  },
  methods: {
    async isNeedPay () {
      try {
      // needPay 是否需要付费 1需要  0不需要
        let { result: { needPay, needPaidAmount, paidAmount } } = await hasPied(this.activityId)
        this.payCount = needPaidAmount / 100 // 单位分转为元
        return needPay === 1 && paidAmount === 0
      } catch (e) { throw e }
    },
    async getDetail () {
      try {
        let { productList } = await getActiveCompleteInfo()
        this.productList = productList || []
      } catch (e) { throw e }
    },
    async getVideoMes () {
      try {
        let mes = await getVideoMesById(this.id)
        this.videoMes = mes
      } catch (e) { throw e }
    },
    async submitOrder () {
      try {
        let mes = await pay(this.activityId)
        await this.pay(mes)
      } catch (e) { throw e }
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
    width: 540px;
    box-sizing: border-box;
    margin: 30vh auto 0;
    border-radius: 10px;
    overflow: hidden;
    text-align: center;
    background-color: #fff;
    .title{
      padding: 40px 0 12px 0;
      font-size:34px;
      font-weight:bold;
      color:#000;
    }
    .message{
      padding: 0 24px 40px;
      font-size:28px;
      line-height:36px;
      color:#999;
    }
    > .buttons {
      display: flex;
      border-top: 2px solid #D3D1D2;
      > button {
        flex: 1;
        font-size:34px;
        line-height: 100px;
        text-align: center;
        color: #FE7700;
      }
      > .cancelBtn {
        border-right: 2px solid #D3D1D2;
        color: #666;
      }
    }
  }

</style>
