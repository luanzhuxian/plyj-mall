<template>
  <transition name="fade">
    <div :class="$style.poster" v-if="localShow">
      <img :src="poster" alt="">
      <pl-svg name="icon-shibai" width="40" @click="close" />
    </div>
  </transition>
</template>

<script>
import { loadImage, cutArcImage, createText, cutImageCenter, generateQrcode } from '../../../assets/js/util'
import { mapGetters } from 'vuex'
import moment from 'moment'
const POSTER_BG = 'https://mallcdn.youpenglai.com/static/beat-plague/10e5dd4e-a4f4-48cf-869d-6f270bfe273f.png'
export default {
  name: 'Poster',
  data () {
    return {
      localShow: false,
      poster: ''
    }
  },
  props: {
    show: Boolean,
    hasLogo: {
      type: Number,
      default: 0
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.createPoster()
      } else {
        this.localShow = false
      }
    }
  },
  computed: {
    ...mapGetters(['avatar', 'userName', 'logoUrl', 'mallUrl'])
  },
  methods: {
    close () {
      this.$emit('update:show', false)
    },
    async createPoster () {
      const CVS = document.createElement('canvas')
      if (this.poster) {
        this.localShow = true
        return
      }
      try {
        const CTX = CVS.getContext('2d')
        const BG = await loadImage(POSTER_BG)
        const W = BG.naturalWidth
        const H = BG.naturalHeight
        const TEXT1 = `${this.userName} 健康打卡报平安`
        const TEXT2 = '加油中国！加油武汉！'
        const TEXT3 = '共携手 抗战“疫”'
        const TEXT4 = moment().format('YYYY.MM.DD-HH.mm')
        const TEXT5 = '长按识别二维码或保存海报，分享给朋友'
        CVS.height = H
        CVS.width = W
        CTX.drawImage(BG, 0, 0)
        CTX.font = '28px Microsoft YaHei'
        CTX.fillStyle = '#fff'
        CTX.textBaseline = 'hanging'
        createText(CTX, 148, 350, TEXT1, 40, 434, 1)
        createText(CTX, 148, 390, TEXT2, 40, 434, 1)
        CTX.fillStyle = '#000'
        createText(CTX, 144, 806, TEXT3, 40, 280, 1)
        createText(CTX, 144, 846, TEXT4, 40, 280, 1)
        CTX.font = '20px Microsoft YaHei'
        createText(CTX, 44, 902, TEXT5, 28, 400, 1)

        let qrcode = await generateQrcode(300, `${this.mallUrl}/fight-epidemic/sign-in`, 0, null, 0, 'canvas')
        CTX.drawImage(qrcode, 462, 806, 124, 124)
        let AVATAR = await loadImage(this.avatar)
        AVATAR = cutArcImage(AVATAR)
        CTX.drawImage(AVATAR, 48, 350, 80, 80)
        if (this.hasLogo) {
          let LOGO = await loadImage(this.logoUrl)
          LOGO = cutImageCenter(LOGO, 20)
          CTX.drawImage(LOGO, 44, 806, 80, 80)
        }
      } catch (e) {
        this.$error(e.message)
      } finally {
        this.poster = CVS.toDataURL('image/jpeg')
        this.localShow = true
      }
    }
  }
}
</script>

<style module lang="scss">
  .poster {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
    > img {
      width: 500px;
    }
    > svg {
      margin-top: 20px;
    }
  }
</style>
