<template>
    <div :class="$style.redPackageMain">
        <div :class="$style.background">
            <div :class="$style.container">
                <div :class="$style.topBtnWrapper">
                    <div :class="$style.topBtn" @click="$router.push({ name: 'RedPackageIntro' })">使用说明</div>
                </div>
                <div :class="$style.subtitle">
                    小金额 大额券 边逛边优惠
                </div>
                <section :class="$style.redPackage">
                    <ul :class="$style.redPackageList">
                        <Coupon :class="$style.redPackageListItem" v-for="(ite, index) of 3" :key="index" />
                    </ul>
                </section>
                <div :class="$style.buttonWrapper">
                    <button :class="$style.button" @click="share">
                        立即分享
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Coupon from './components/Coupon.vue'

export default {
    name: 'RedPackage',
    components: {
        Coupon
    },
    props: {
        activityId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {

        }
    },
    created () {
        console.log('created', this.activityId)
    },
    activited  () {
        console.log('activited')
    },
    methods: {
        share () {}
    }
}
</script>

<style lang="scss" module>
.red-package-main {
    min-height: 100vh;
    background: #FD644C;
}
.background {
    background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-detail-red.png) no-repeat center top;
    background-size: 100% auto;
}
.container {
    position: relative;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    box-sizing: border-box;
    padding: 330px 24px 100px;
}
.top-btn-wrapper {
    position: absolute;
    top: 26px;
    right: 0;
    width: 120px;
    border-radius: 48px 0px 0px 48px;
    overflow: hidden;
}
.top-btn-wrapper {
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: #000000;
    opacity: .5;
    font-size: 22px;
    color: #FFFFFF;
}
.subtitle {
    position: absolute;
    top: 134px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 36px;
    color: #ffef7e;
}
.red-package {
    padding: 66px 20px 36px;
    // width: 100%;
    background: #FFFFFF;
    border-radius: 20px;
    &-list {
        // margin-top: 44px;
        // padding: 0 20px;
        &-item {
            margin-top: 46px;
            &:nth-of-type(1) {
                margin-top: 0;
            }
        }
    }
}
.button-wrapper {
    text-align: center;
}
.button {
    margin: 54px;
    width: 600px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    background: #FFF36E;
    border-radius: 60px;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #F23D00;
}

</style>
