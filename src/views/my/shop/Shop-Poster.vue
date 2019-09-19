<template>
  <div :class="$style.shopPost">
    <img :src="post" alt="">
    <p :class="$style.description">请长按海报图片分享或保存到相册</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { generateQrcode } from '../../../assets/js/util'
export default {
  name: 'ShopPoster',
  data () {
    return {
      url: 'baidu.com',
      post: '',
      qrcode: ''
    }
  },
  computed: {
    ...mapGetters(['mallName', 'mallUrl'])
  },
  created () {
    this.drawPost()
  },
  methods: {
    async drawPost () {
      let canImg = new Image()
      canImg.crossOrigin = ''
      canImg.src = `https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/C%E7%AB%AF/store-haibao.jpg?time=${Date.now()}`
      canImg.onload = async () => {
        let canvas = document.createElement('canvas')
        canvas.width = canImg.width
        canvas.height = canImg.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(canImg, 0, 0, canvas.width, canvas.height)
        ctx.font = 'bold 84px Georgia'
        ctx.textAlign = 'center'
        ctx.fillText(this.mallName, 500, 150)
        let qrcode = await generateQrcode(500, this.mallUrl, 0, null, null, 'url')
        let qrCodeImg = new Image()
        qrCodeImg.src = qrcode
        qrCodeImg.onload = () => {
          ctx.drawImage(qrCodeImg, 663, 1147, 200, 200)
          let post = canvas.toDataURL('image/jpeg', 0.7)
          this.post = post
        }
      }
    }
  }
}
</script>

<style module lang="scss">
  .shop-post {
    padding: 40px;
    img{
      width: 100%;
    }
    .description{
      margin-top: 40px;
      color: #999999;
      text-align: center;
      font-size: 24px;
    }
  }
</style>
