<template>
  <div :class="$style.shopQrcode">
    <span :class="$style.titleText">{{ mallName }}</span>
    <div :class="$style.imgBox"><img :src="qrcode" alt=""></div>
    <div :class="$style.descriptionBox">
      <p>操作指引：</p>
      <p>1.下载店铺二维码</p>
      <p>2.将二维码放置在线下海报、宣传册、易拉宝等宣传资料中；</p>
      <p>3.地推中，出示宣传资料，用户微信扫描二维码，即可快速</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { generateQrcode } from '../../../assets/js/util'
export default {
  name: 'ShopQrcode',
  data () {
    return {
      qrcode: ''
    }
  },
  computed: {
    ...mapGetters(['mallName', 'mallUrl'])
  },
  mounted () {
    this.drawQrCode()
  },
  methods: {
    async drawQrCode () {
      this.qrcode = await generateQrcode(500, this.mallUrl, 0, '', 10, 'url')
    }
  }
}
</script>

<style module lang="scss">
    .shop-qrcode {
        padding: 40px 68px;
        background-color: #F1F4F5;
      .title-text{
        display: flex;
        justify-content: center;
        font-size: 56px;font-weight: bold
      }
      .img-box{
        box-sizing: border-box;
        width: 526px;
        height: 526px;
        margin: 29px auto 64px;
        padding: 38px;
        background-color: #FFFFFF;
        img{
          width: 100%;
        }
      }
      .description-box{
        >p{
          color: #999999;
          font-size: 24px;
          line-height: 40px;
        }
      }
    }
</style>
