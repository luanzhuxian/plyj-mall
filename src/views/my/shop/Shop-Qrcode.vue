<template>
  <div :class="$style.shopQrcode">
    <span :class="$style.titleText">{{ mallName }}</span>
    <div :class="$style.imgBox"><img :src="qrcode" alt=""></div>
    <div :class="$style.descriptionBox">
      <p>操作指引：</p>
      <ol>
        <li>下载店铺二维码</li>
        <li>将二维码放置在线下海报、宣传册、易拉宝等宣传资料中；</li>
        <li>地推中，出示宣传资料，用户微信扫描二维码，即可快速进入机构店铺，查看活动和课程</li>
      </ol>
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
      this.qrcode = await generateQrcode(500, this.mallUrl, 0, null, null, 'url')
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
      color: #999999;
      font-size: 24px;
      line-height: 40px;
      > ol {
        counter-reset: num;
        > li {
          &:before {
            counter-increment: num;
            content: counter(num) '. ';
          }
        }
      }
    }
  }
</style>
