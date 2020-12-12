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
import { loadImage } from '../../../../../assets/js/util'
export default {
    name: 'HappyLotteryPoster',
    data () {
        return {
            show: false,
            poster: ''
        }
    },
    methods: {
        async create () {
            this.show = true
            if (this.poster) {
                return
            }
            const bg = await loadImage('https://mallcdn.youpenglai.com/static/mall/lottery/poster-bg-1.png')
            const cvs = document.createElement('canvas')
            cvs.width = 1200
            cvs.height = 1910
            const ctx = cvs.getContext('2d')
            ctx.drawImage(bg, 0, 0, 1200, 1910)

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
