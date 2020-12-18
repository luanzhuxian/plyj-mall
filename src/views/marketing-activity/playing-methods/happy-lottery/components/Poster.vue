<template>
    <div>
        <div :class="$style.poster" @click="create">分享海报</div>
        <pl-mask :show.sync="show">
            <img :class="$style.posterImg" v-if="poster" :src="poster" alt="">
            <pl-svg v-else :class="$style.loading" name="icon-loading" width="60" fill="#fff" />
        </pl-mask>
    </div>
</template>

<script>
import { loadImage, cutArcImage, createText, generateQrcode } from '../../../../../assets/js/util'
import { mapGetters } from 'vuex'
export default {
    name: 'HappyLotteryPoster',
    data () {
        return {
            show: false,
            poster: ''
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['avatar', 'userName'])
    },
    deactivated () {
        this.poster = ''
    },
    methods: {
        async create () {
            this.show = true
            if (this.poster) {
                return
            }
            const [bg, avatar] = await Promise.all([
                loadImage('https://mallcdn.youpenglai.com/static/mall/lottery/poster-bg-1.png'),
                loadImage(this.avatar)
            ])
            const cvs = document.createElement('canvas')
            cvs.width = 1200
            cvs.height = 1910
            const ctx = cvs.getContext('2d')
            ctx.drawImage(bg, 0, 0, 1200, 1910)
            ctx.drawImage(cutArcImage(avatar), 450, 740, 300, 300)
            ctx.beginPath()
            ctx.lineWidth = 4
            ctx.arc(600, 890, 152, 0, 2 * Math.PI)
            ctx.strokeStyle = '#fff'
            ctx.stroke()

            // 用户姓名
            ctx.font = '44px Microsoft YaHei'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'hanging'
            ctx.fillStyle = '#363636'
            createText({
                ctx,
                x: 600,
                y: 28 + 740 + 300,
                text: this.userName,
                width: 800
            })
            createText({
                ctx,
                x: 600,
                y: 28 + 76 + 740 + 300,
                text: '邀请你参加活动'
            })
            ctx.font = '52px Microsoft YaHei'
            ctx.fillStyle = '#E63600'
            createText({
                ctx,
                x: 600,
                y: 28 + 212 + 740 + 300,
                text: '“ 还在等什么，下一个锦鲤就是你 ”'
            })

            // 二维码
            const qrcode = await generateQrcode({
                size: 280,
                text: location.href,
                type: 'canvas'
            })
            ctx.drawImage(qrcode, 814, 1540, 280, 280)

            this.poster = cvs.toDataURL()
        }
    }
}
</script>

<style module lang="scss">
    @import "top-button";
    .poster {
        @include fixedTop();
        background: linear-gradient(180deg, #FFF0A2, #FFEFC6) no-repeat;
        color: #C36304;
    }
    .loading {
        &:global {
            animation: rotate 1.5s linear infinite;
        }
    }
    .posterImg {
        width: 600px;
    }
</style>
