<template>
    <div :class="$style.shopPost">
        <img v-imgError :src="post" alt="">
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
        drawPost () {
            const canImg = new Image()
            canImg.crossOrigin = ''
            canImg.src = `https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/1.9.4/store-haibao.jpg?time=${ Date.now() }`
            canImg.onload = async () => {
                const canvas = document.createElement('canvas')
                canvas.width = canImg.width
                canvas.height = canImg.height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(canImg, 0, 0, canvas.width, canvas.height)
                ctx.font = 'bold 84px Georgia'
                ctx.textAlign = 'center'
                ctx.fillText(this.mallName, 500, 150)
                const qrcode = await generateQrcode({ size: 500, text: this.mallUrl })
                const qrCodeImg = new Image()
                qrCodeImg.src = qrcode
                qrCodeImg.onload = () => {
                    ctx.drawImage(qrCodeImg, 663, 1147, 200, 200)
                    const post = canvas.toDataURL('image/jpeg', 0.7)
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
