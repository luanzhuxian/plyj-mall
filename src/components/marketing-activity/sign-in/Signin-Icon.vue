<template>
    <div>
        <div class="icon-item"
             @click="clickHandler"
        >
            <div class="icon"
                 :class="{'disabled': !hasSignin}"
                 :style="{backgroundImage: 'url(' + (hasSignin ? 'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/checked.png' : 'https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/un_checked.png') + ')' }">
                {{ materialDesc }}
            </div>
            <p :class="{'not-sign': !hasSignin}">{{ iconName }}</p>
        </div>
        <pl-mask :show.sync="show">
            <img style="height: 70vh;" v-if="!loading" :src="bgi" alt="">
            <pl-svg v-else class="loading" name="icon-loading" fill="#fff" height="45" />
        </pl-mask>
    </div>
</template>

<script>
import { loadImage, createCanvas, generateQrcode } from '../../../assets/js/util'
export default {
    name: 'SigninIcon',
    data () {
        return {
            poster: '',
            show: false,
            loading: false
        }
    },
    props: {
        // 签到节点详情
        detail: {
            type: Object,
            default () {
                return {}
            }
        },
        // 当前签到节点是否签到
        hasSignin: Boolean,
        // 当前签到节点关键字
        materialDesc: {
            type: String,
            default: ''
        },
        // 当前签到节点名称
        iconName: {
            type: String,
            default: ''
        },
        // 海报背景图片，建议尺寸 1500 * 2269, 格式为jpg
        bgi: {
            type: String,
            default: ''
        },
        // 海报的宽高
        w: {
            type: Number,
            default: 1500
        },
        h: {
            type: Number,
            default: 2668
        }
    },
    methods: {
        async clickHandler () {
            if (!this.detail.hasSignin) return
            this.show = true
            this.loading = true
            if (!this.poster) {
                await this.createPoster()
            }
            this.loading = false
        },
        async createPoster () {
            const { cvs, ctx } = createCanvas(this.w, this.h)
            const bg = await loadImage(this.bgi)
            ctx.drawImage(bg, 0, 0, this.w, 2269)
            const qrcode = await generateQrcode({
                size: 300,
                text: location.href,
                type: 'canvas'
            })
            ctx.drawImage(qrcode, 522, 2300, 480, 480)
            this.poster = cvs.toDataURL('image/jpeg', 0.8)
        }
    }
}
</script>

<style scoped lang="scss">
  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95px;
    margin-bottom: 30px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    color: #FFE3C8;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 82px;
    height: 68px;
    &.disabled{
      color: #fff;
    }
  }

  p {
    line-height: 40px;
    text-align: center;
    font-size: 20px;
    color: #F60000;

    &.not-sign {
      color: #373737;
    }
  }
  .loading {
    &:global {
      animation: rotate 2s linear infinite;
    }
  }
</style>
