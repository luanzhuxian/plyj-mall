<template>
    <pl-mask :show="show" @close="close">
        <div class="qrcode-modal-modal">
            <h4>长按识别二维码关注</h4>
            <p v-if="mallQRCodeInfo.name">{{ mallQRCodeInfo.name }}</p>
            <div class="qrcode-modal-img-wrapper">
                <img v-imgError :src="mallQRCodeInfo.qrCodeImgUrl" alt="">
            </div>
            <p class="qrcode-modal-bottom" v-if="mallQRCodeInfo.description">{{ mallQRCodeInfo.description }}</p>
        </div>
    </pl-mask>
</template>

<script>
export default {
    name: 'QRCodeModal',
    data () {
        return {
            show: false,
            mallQRCodeInfo: {}
        }
    },
    created () {
        this.mallQRCodeInfo = this.$store.state.mallQRCodeInfo || {}
    },
    methods: {
        close () {
            this.show = false
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss">
.qrcode-modal {
    &-modal {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        padding: 40px 30px 50px;
        width: 540px;
        height: 586px;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        > h4 {
            font-size: 34px;
            line-height: 56px;
            color: #000;
        }
        > p {
            margin-top: 20px;
            font-size: 26px;
            font-family: Microsoft YaHei;
            line-height: 34px;
            color: #666;
            width: 100%;
            text-align: center;
            @include elps();
        }
        > .botttom {
            margin-top: 26px;
        }
    }
    &-img-wrapper {
        box-sizing: border-box;
        margin-top: 34px;
        padding: 30px;
        width: 300px;
        height: 300px;
        border: 2px solid #f2b036;
        border-radius: 10px;
        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}

</style>
