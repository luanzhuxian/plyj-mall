<template>
    <transition name="fade">
        <div class="qrcode-modal-mask" v-if="show">
            <div class="qrcode-modal-modal">
                <h4>长按识别二维码关注</h4>
                <p v-if="mallQRCodeInfo.name">{{ mallQRCodeInfo.name }}</p>
                <pl-svg
                    name="icon-close"
                    width="26"
                    fill="#999999"
                    class="qrcode-modal-close"
                    @click.stop="close"
                    @transitionend="onTransitionend"
                />
                <div class="qrcode-modal-img-wrapper">
                    <img v-imgError :src="mallQRCodeInfo.qrCodeImgUrl" alt="">
                </div>
                <p class="qrcode-modal-bottom" v-if="mallQRCodeInfo.description">{{ mallQRCodeInfo.description }}</p>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'MallQRCodeModal',
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
        },
        onTransitionend () {
            if (!this.show) {
                this.$destroy()
                document.body.removeChild(this.$el)
            }
        }
    }
}
</script>
<style lang="scss">
.qrcode-modal {
    &-mask {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, .6);
        z-index: 999;
    }
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
    &-close {
        position: absolute;
        top: 22px;
        right: 22px;
        z-index: 1;
    }
}

</style>
