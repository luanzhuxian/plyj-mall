<template>
  <div :class="$style.helperQrcode">
    <tab :tabs="array" :active-id.sync="activeId" :color9="true" />
    <div v-show="activeId === 1" :class="$style.helperGuidelines">
      <div :class="$style.imgBox"><img :src="post" alt=""></div>
      <div :class="$style.descriptionBox">
        <p>操作指引：</p>
        <p>1.下载店铺二维码</p>
        <p>2.将二维码放置在线下海报、宣传册、易拉宝等宣传资料中；</p>
        <p>3.地推中，出示宣传资料，用户微信扫描二维码，即可快速</p>
      </div>
    </div>
    <div v-show="activeId === 2" :class="$style.qoceBox">
      <div :class="$style.imgBox"><img :src="qrcode" alt=""></div>
      <div :class="$style.descriptionBox">
        <p>快速申请helper通道，出示二维码给用户</p>
        <pl-svg name="helper-guidelines" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tab from '../../../components/penglai-ui/Tab'
import { generateQrcode } from '../../../assets/js/util'
export default {
  name: 'HelperPoster',
  components: {
    tab
  },
  data () {
    return {
      url: 'baidu.com',
      post: '',
      qrcode: '',
      array: [{ name: '邀请海报', id: 1 }, { name: '面对面邀请', id: 2 }],
      activeId: 1
    }
  },
  computed: {
    ...mapGetters(['mallName', 'mallUrl', 'avatar', 'userName'])
  },
  created () {
    this.drawPost()
  },
  methods: {
    async drawPost () {
      let canImg = new Image()
      canImg.src = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/helper-poster.png'
      canImg.crossOrigin = ''
      let userImg = new Image()
      userImg.src = `${this.avatar}?x-oss-process=image/resize,h_100/circle,r_500/format,png`
      userImg.crossOrigin = ''
      userImg.onload = async () => {
        canImg.onload = async () => {
          this.qrcode = await generateQrcode(500, `${this.mallUrl}/my/apply-helper`, 0, '', 10, 'url')
          let qrCodeImg = new Image()
          qrCodeImg.src = this.qrcode
          let canvas = document.createElement('canvas')
          canvas.width = canImg.width
          canvas.height = canImg.height
          let ctx = canvas.getContext('2d')
          ctx.drawImage(canImg, 0, 0, canvas.width, canvas.height)
          console.log(userImg)
          ctx.drawImage(userImg, 48, 48, 74, 74)
          ctx.font = 'bold 24px Georgia'
          ctx.fillText(`${this.mallName}     ${this.userName}`, 150, 80)
          ctx.fillText(`邀请您成为Helper！`, 150, 120)
          qrCodeImg.onload = () => {
            ctx.drawImage(qrCodeImg, 70, 540, 160, 160)
            let post = canvas.toDataURL('image/jpeg', 0.7)
            this.post = post
          }
        }
      }
      userImg.onerror = (e) => {
        console.log(e)
      }
    }
  }
}
</script>

<style module lang="scss">
  .helper-qrcode {
    background-color: #F1F4F5;
    .helper-guidelines{
      padding: 40px;
      .img-box {
        margin: 0 auto;
        img {
          width: 100%;
        }
      }
      .description-box{
        margin-top: 40px;
        >p{
          color: #999999;
          font-size: 24px;
          line-height: 40px;
        }
      }
    }
    .qoce-box{
      padding: 72px 68px 40px;
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
          text-align: center;
          color: #999999;
          font-size: 24px;
          line-height: 40px;
        }
        >svg{
          margin-top: 140px;
        }
      }
    }
  }
</style>
