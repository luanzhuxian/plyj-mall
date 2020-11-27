<template>
    <div :class="$style.redPackageMain" class="red-package-main">
        <div :class="$style.background">
            <div :class="$style.container">
                <div :class="$style.topBtnWrapper">
                    <div :class="$style.topBtn" @click="$router.push({ name: 'RedPackageIntro' })">使用说明</div>
                </div>
                <template v-if="allLoaded">
                    <!-- 商品轮播 -->
                    <section :class="$style.product" v-if="productList && productList.length">
                        <Swiper :list="productList" />
                    </section>
                    <!-- 弹幕 -->
                    <section :class="$style.barrage" v-if="bulletList && bulletList.length">
                        <Barrage ref="barrage" :list="bulletList" :template="getBulletTemplate" />
                    </section>
                    <!-- 红包 -->
                    <section :class="$style.redPackage">
                        <ul :class="$style.redPackageList">
                            <Coupon
                                :class="$style.redPackageListItem"
                                v-for="(item, index) of redPackageList"
                                :key="index"
                                :status.sync="item.activityStatus"
                                :show-countdown="[0, 1].includes(item.activityStatus)"
                                :show-stock="item.activityStatus === 1"
                                show-btn
                                :name="item.name"
                                :stock="Number(item.issueVolume) - Number(item.claimVolume)"
                                :amount="Number(item.amount)"
                                :use-limit-amount="Number(item.useLimitAmount)"
                                :price="Number(item.price)"
                                :receive-start-time="item.receiveStartTime"
                                :receive-end-time="item.receiveEndTime"
                                :use-start-time="item.useStartTime"
                                :use-end-time="item.useEndTime"
                                @click="$router.push({ name: 'RedPackageDetail', params: { activityId: item.id }})"
                            />
                        </ul>
                    </section>
                    <button :class="$style.button" @click="share">
                        立即分享
                    </button>
                </template>
                <PlSvg :class="$style.loading" name="icon-loading" fill="#FFF" width="90" v-else />
            </div>
        </div>
    </div>
</template>

<script>
import Barrage from '../longmen-festival/action/components/Barrage.vue'
import Coupon from './components/Coupon.vue'
import Swiper from './components/Swiper.vue'
import { getRedPackageList, getRedPackageBarrage } from '../../../apis/marketing-activity/red-package'

// 是否是今天
const isToday = date => {
    const today = new Date().setHours(0, 0, 0, 0)
    const tomorrow = today + (24 * 60 * 60 * 1000)
    const current = new Date(date).valueOf()
    return current >= today && current <= tomorrow
}

const productModel1 = {
    img: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/奖品.png',
    name: '神秘大礼一',
    rule: '',
    isProduct: false
}

const productModel2 = {
    img: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/奖品.png',
    name: '神秘大礼二',
    rule: '',
    isProduct: false
}

const productModel = {
    img: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/奖品.png',
    name: '平衡车',
    rule: '抢券抵10000',
    isProduct: true
}

export default {
    name: 'RedPackage',
    components: {
        Barrage,
        Coupon,
        Swiper
    },
    data () {
        return {
            // 是否数据请求完毕
            allLoaded: false,
            productList: [],
            bulletList: [],
            redPackageList: []
        }
    },
    created () {
        this.productList1 = [
            productModel1,
            productModel,
            productModel2
        ]
        this.productList = [
            productModel1,
            productModel,
            productModel2,
            productModel,
            productModel1
        ]
    },
    async activated () {
        try {
            const request = [
                this.getRedPackageList(),
                this.getRedPackageBarrage()
            ]
            await Promise.all(request.map(p => p.catch(e => console.error(e))))
            if (this.$refs.barrage) {
                this.$refs.barrage.run()
            }
        } catch (error) {
            throw error
        } finally {
            this.allLoaded = true
        }
    },
    methods: {
        async getRedPackageList () {
            try {
                const params = {
                    activityStatus: 1,
                    page: 1,
                    size: 99
                }
                const { result: { records = [] } } = await getRedPackageList(params)
                // 福利红包未隐藏且有库存
                this.redPackageList = records.filter(item => item.showStatus && (item.issueVolume > item.claimVolume))
            } catch (error) {
                throw error
            }
        },
        async getRedPackageBarrage () {
            try {
                const { result } = await getRedPackageBarrage()
                if (result.length) {
                    for (const item of result) {
                        item.phone = String(item.mobile).slice(-4)
                        item.time = isToday(item.createTime) ? '刚刚' : ''
                        item.msg = item.message ? item.message.replace(/\.\d+0+/, '') : ''
                    }
                }
                this.bulletList = Object.freeze(result)
            } catch (error) {
                throw error
            }
        },
        getBulletTemplate (bullet, vm) {
            const { userImage, userName, phone, time, msg } = bullet
            const message = `${ userName }****${ phone }${ time }领取${ msg }的储备金`
            const template = `
                <div class="my-bullet">
                    <div class="my-bullet__avatar">
                        <img src="${ userImage }" alt="${ userName }">
                    </div>
                    <div class="my-bullet__message">
                        ${ message }
                    </div>
                </div>
            `
            return template
        },
        share () {

        }
    }
}
</script>

<style lang="scss">
.red-package-main {
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
}
</style>

<style lang="scss" module>
.red-package-main {
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
    min-height: 100vh;
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

.product {
    box-sizing: border-box;
    width: 100%;
}

.barrage {
    margin: 80px 0 20px;
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

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 0 0;
    animation: rotate 1.2s linear infinite;
    z-index: 999;
}

@keyframes rotate {
    from {
        transform: rotate(0deg) translate(-50%, -50%);
    }
    to {
        transform: rotate(359deg) translate(-50%, -50%);
    }
}

</style>
