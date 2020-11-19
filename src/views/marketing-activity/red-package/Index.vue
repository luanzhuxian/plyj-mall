<template>
    <div :class="$style.redPackageMain">
        <div :class="$style.background">
            <div :class="$style.container">
                <div :class="$style.topBtnWrapper">
                    <div :class="$style.topBtn" @click="$router.push({ name: 'RedPackageIntro' })">使用说明</div>
                </div>
                <section :class="$style.gift" v-if="giftList && giftList.length">
                    <ul :class="$style.giftList">
                        <li
                            :class="[$style.giftListItem, item.isGift ? $style.small : $style.large]"
                            v-for="(item, index) of giftList"
                            :key="index"
                        >
                            <div :class="$style.imgWrapper">
                                <img :src="item.img" :alt="item.name">
                            </div>
                            <div :class="$style.info">
                                <b :class="$style.name" v-text="item.name" />
                                <div :class="$style.rule" v-if="item.rule" v-text="item.rule" />
                            </div>
                        </li>
                    </ul>
                </section>

                <section :class="$style.barrage">
                    <Barrage :list="bulletList" :get-template="getBulletTemplate" />
                </section>

                <section :class="$style.redPackage">
                    <ul :class="$style.redPackageList">
                        <Coupon :class="$style.redPackageListItem" v-for="(item, index) of 3" :key="index" />
                    </ul>
                </section>
                <button :class="$style.button" @click="share">
                    立即分享
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Barrage from '../longmen-festival/action/components/Barrage.vue'
import Coupon from './components/Coupon.vue'

const giftModel1 = {
    img: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/奖品.png',
    name: '神秘大礼一',
    rule: '',
    isGift: false
}

const giftModel2 = {
    img: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/奖品.png',
    name: '神秘大礼二',
    rule: '',
    isGift: false
}

const giftModel = {
    img: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/奖品.png',
    name: '平衡车',
    rule: '抢券抵10000',
    isGift: true
}

const bulletModel = {
    avatar: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/gift.png',
    name: '张三',
    phone: '13333331111',
    donationAmount: '0.0001'
}

const bulletList = Array(10).fill(bulletModel)

export default {
    name: 'RedPackage',
    components: {
        Barrage,
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
            giftList: [],
            bulletList: []
        }
    },
    created () {
        console.log('created', this.activityId)
        this.giftList = [
            giftModel1,
            giftModel,
            giftModel2
        ]
        this.bulletList = Object.freeze(bulletList)
    },
    methods: {
        getBulletTemplate (bullet, vm) {
            const { avatar, name, phone } = bullet
            const message = `${ name }****${ phone.slice(-4) }刚刚领取满${ 10 }元抵${ 100 }的储备金`
            const template = `
                <div class="my-bullet">
                    <div class="my-bullet__avatar">
                        <img src="${ avatar }" alt="${ name }">
                    </div>
                    <div class="my-bullet__message">
                        ${ message }
                    </div>
                </div>
            `
            return template
        },
        share () {}
    }
}
</script>

<style lang="scss">
.my-bullet {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    height: 56px;
    width: max-content;
    animation: run 3s ease-out;
    transform-origin: 0 0;
    &__avatar {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 56px;
        height: 56px;
        background: #FFFFFF;
        border-radius: 50%;
        overflow: hidden;
        z-index: 99;
        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    &__message {
        display: inline-block;
        box-sizing: border-box;
        padding: 0 26px 0 74px;
        line-height: 56px;
        background: #000000;
        opacity: .7;
        border-radius: 40px;
        font-size: 20px;
        color: #FFFFFF;
    }

    @keyframes run {
        0% {
            opacity: 0;
            transform: translate3d(0px, 100px, 0px) scale(0.8);
        }
        50% {
            opacity: 1;
            transform: translate3d(0, 0, 0px) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate3d(0, -100px, 0px) scale(1);
        }
    }
}
</style>

<style lang="scss" module>
.red-package-main {
    min-height: 100vh;
    background: #FD644C;
}

.background {
    background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/bg-main.png) no-repeat center top;
    background-size: 100% auto;
}

.container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 330px 24px 80px;
}

.top-btn-wrapper {
    position: absolute;
    top: 26px;
    right: 0;
    width: 120px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    background: #000000;
    border-radius: 48px 0px 0px 48px;
    overflow: hidden;
    opacity: .5;
    font-size: 22px;
    color: #FFFFFF;
}

.gift {
    box-sizing: border-box;
    padding: 0 40px;
    width: 100%;
    &-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-item {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            width: 90px;
            height: 115px;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            &.large {
                width: 180px;
                height: 230px;
                .img-wrapper {
                    width: 100%;
                    height: 144px;
                    overflow: hidden;
                }
                .name {
                    font-size: 22px;
                    line-height: 32px;
                }
                .rule {
                    margin-top: 4px;
                    font-size: 16px;
                }
            }
            &.small {
                width: 140px;
                height: 180px;
                .img-wrapper {
                    width: 100%;
                    height: 112px;
                    overflow: hidden;
                }
                .name {
                    font-size: 20px;
                    line-height: 26px;
                }
                .rule {
                    margin-top: 4px;
                    font-size: 14px;
                }
            }
            .img-wrapper {
                width: 100%;
                overflow: hidden;
                > img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
            .info {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: #FFF36E;
                color: #FF6407;
            }

        }
    }
}

.barrage {
    margin: 50px 0 20px;
    width: 100%;
}

.red-package {
    box-sizing: border-box;
    margin-top: 30px;
    padding: 66px 20px 36px;
    width: 100%;
    background: #FFFFFF;
    border-radius: 20px;
    &-list {
        &-item {
            margin-top: 46px;
            &:nth-of-type(1) {
                margin-top: 0;
            }
        }
    }
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
