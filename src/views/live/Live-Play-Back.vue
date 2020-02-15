<template>
  <div :class="$style.livePlayBack">
    <div :class="$style.videoBox">
      <video preload controls x5-video-player-type="h5-page" width="100%" :src="videoMes.url" />
      <div>商品</div>
    </div>
    <div :class="$style.productList">
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
  </div>
</template>

<script>
import { getActiveCompleteInfo, getVideoMesById } from '../../apis/live.js'
export default {
  name: 'LivePlayBack',
  data () {
    return {
      productList: [], // 商品列表
      videoMes: {}
    }
  },
  activated () {
    this.getVideoMes()
    this.getDetail()
  },
  methods: {
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
        let mes = await getVideoMesById(this.$route.params.id)
        if (mes) {
          this.videoMes = mes
        }
      } catch (e) { throw e }
    }
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

</style>
