<template>
    <div :class="$style.redPackageMain" class="red-package-main">
        <div :class="$style.background">
            <div :class="$style.container">
                <div :class="$style.topBtnWrapper" @click="$router.push({ name: 'RedPackageIntro' })">
                    <span>使用说明</span>
                </div>
                <template v-if="allLoaded && redPackageList && redPackageList.length">
                    <!-- 商品轮播 -->
                    <section :class="$style.product" v-if="productList && productList.length">
                        <Swiper :list="productList" />
                    </section>
                    <!-- 弹幕 -->
                    <section :class="$style.barrage" v-if="bulletList && bulletList.length">
                        <Barrage ref="barrage" :list="bulletList" :template="getBulletTemplate" :gap="2" />
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
                                :stock="Number(item.issueVolume)"
                                :amount="Number(item.amount)"
                                :use-limit-amount="Number(item.useLimitAmount)"
                                :price="Number(item.price)"
                                :receive-start-time="item.receiveStartTime"
                                :receive-end-time="item.receiveEndTime"
                                :use-start-time="item.useStartTime"
                                :use-end-time="item.useEndTime"
                                @click="handleClick(item.id)"
                            />
                        </ul>
                    </section>
                    <button :class="$style.button" @click="createPoster">
                        <PlSvg v-show="creatingPoster" name="icon-btn-loading" fill="#F23D00" width="35" class="rotate" />
                        立即分享
                    </button>
                </template>
                <PlSvg :class="$style.loading" name="icon-loading" fill="#FFF" width="90" v-else />
            </div>
        </div>
        <Poster ref="poster" :share-url="shareUrl" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Swiper from './components/Swiper.vue'
import Barrage from '../../longmen-festival-2020/action/components/Barrage.vue'
import Coupon from './components/Coupon.vue'
import Poster from './components/Poster.vue'
import { getRedPackageListAfterSort, getRedPackageBarrage } from '../../../../apis/marketing-activity/red-package'
import { getBulletTemplate, isToday, fenToYuan } from './utils'
import share from '../../../../assets/js/wechat/wechat-share'
import { SET_SHARE_ID } from '../../../../store/mutation-type'

const productModel = {
    goodsImage: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/奖品.png',
    goodsName: '特惠福利',
    redPackages: [],
    isProduct: false
}

export default {
    name: 'RedPackage',
    components: {
        Swiper,
        Barrage,
        Coupon,
        Poster
    },
    data () {
        return {
            // 是否数据请求完毕
            allLoaded: false,
            bulletList: [],
            productList: [],
            redPackageList: [],
            creatingPoster: false,
            shareUrl: ''
        }
    },
    computed: {
        ...mapGetters(['userId', 'userName', 'mobile', 'appId', 'mallUrl', 'isActivityAuth'])
    },
    async activated () {
        try {
            // 保存分享人
            if (this.$route.query.shareUserId) {
                this.$store.commit(SET_SHARE_ID, this.$route.query.shareUserId)
            }
            const request = [
                this.getRedPackageList(),
                this.getRedPackageBarrage()
            ]
            const [redPackageList, bulletList] = await Promise.all(request.map(p => p.catch(e => console.error(e))))

            // 过滤未隐藏且有库存的福利红包
            this.redPackageList = redPackageList
                .filter(item => item.showStatus && item.issueVolume)
                .map(item => {
                    item.price = fenToYuan(item.price)
                    return item
                })

            // 没有可用红包返回上一页
            if (!this.redPackageList.length) {
                this.$alert('很遗憾，该活动已结束，请查看更多活动')
                    .finally(() => {
                        this.$router.push({ name: this.isActivityAuth ? 'Activity' : 'Home' })
                    })
                return false
            }

            this.productList = this.getProduct()
            this.bulletList = Object.freeze(bulletList)

            if (this.$refs.barrage) {
                this.$refs.barrage.run()
            }
            this.share()
        } catch (error) {
            throw error
        } finally {
            this.allLoaded = true
        }
    },
    deactivated () {
        this.creatingPoster = false
    },
    methods: {
        // 获取红包弹幕模板
        getBulletTemplate,
        sort (list) {
            if (list.length) {
                for (const product of list) {
                    product.redPackages.sort((a, b) => b.amount - a.amount)
                }
                // 商品排序按照抵用红包金额从大到小排序
                list.sort((a, b) => b.redPackages[0].amount - a.redPackages[0].amount)
            }
        },
        // 重新组装商品列表，填充占位图
        rebuid (list) {
            switch (list.length) {
                case 0:
                    list = [productModel, productModel, productModel]
                    break
                case 1:
                    list = [productModel, list[0], productModel]
                    break
                case 2:
                    list = [list[0], list[1], productModel, productModel, productModel]
                    break
                case 3:
                    list = [list[0], list[1], list[2], productModel, productModel]
                    break
                case 4:
                    list = [...list, productModel]
                    break
                default:
                    break
            }
            return list
        },
        // 获取红包活动列表
        async getRedPackageList () {
            try {
                // 0 未开始 1 进行中 2 暂停 3 结束
                const params = {
                    activityStatus: '0, 1',
                    page: 1,
                    size: 99
                }

                const { result } = await getRedPackageListAfterSort(params)
                return result
            } catch (error) {
                throw error
            }
        },
        // 获取红包弹幕
        async getRedPackageBarrage () {
            try {
                const { result } = await getRedPackageBarrage()
                if (result.length) {
                    for (const item of result) {
                        item.time = isToday(item.createTime) ? '刚刚' : ''
                        // item.msg = item.message ? item.message.replace(/\.\d+0+/g, '') : ''
                    }
                }
                return result
            } catch (error) {
                throw error
            }
        },
        // 获取商品
        getProduct () {
            let productList = []
            const map = new Map()

            for (const redPackage of this.redPackageList) {
                if (redPackage.goodsVOS && redPackage.goodsVOS.length) {
                    for (const product of redPackage.goodsVOS) {
                        if (map.has(product.goodsId)) {
                            const prod = map.get(product.goodsId)
                            prod.redPackages.push({
                                activityId: redPackage.id,
                                amount: redPackage.amount
                            })
                            map.set(product.goodsId, prod)
                        } else {
                            map.set(product.goodsId, {
                                ...product,
                                isProduct: true,
                                redPackages: [{
                                    activityId: redPackage.id,
                                    amount: redPackage.amount
                                }]
                            })
                        }
                    }
                }
            }
            productList = [...map.values()]
            // 排序
            this.sort(productList)
            // 长度不够，填充占位图
            return productList.length <= 4 ? this.rebuid(productList) : productList.slice(0, 20)
        },
        // 检查是否绑定手机号
        checkMobile () {
            if (!this.mobile) {
                this.$confirm('您还没有绑定手机，请先绑定手机')
                    .then(() => {
                        sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                            name: this.$route.name,
                            params: this.$route.params,
                            query: this.$route.query
                        }))
                        this.$router.push({ name: 'BindMobile' })
                    })
                    .catch(() => {})
                return false
            }
            return true
        },
        handleClick (activityId) {
            if (!this.checkMobile()) return
            this.$router.push({
                name: 'RedPackageDetail',
                params: { activityId }
            })
        },
        share () {
            const { appId, mallUrl } = this
            this.shareUrl = `${ mallUrl }/red-package/home?shareUserId=${ this.userId }&t=${ Date.now() }`
            share({
                appId,
                title: '福利红包 抢先领',
                desc: '小金额，大额券，边逛边优惠！',
                link: this.shareUrl,
                imgUrl: 'https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/share-new.jpg'
            })
        },
        // 创建海报
        async createPoster () {
            try {
                if (this.creatingPoster) {
                    return
                }

                this.creatingPoster = true
                await this.$nextTick()
                await this.$refs.poster.createPoster()
            } catch (error) {
                throw error
            } finally {
                this.creatingPoster = false
            }
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
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 54px;
    width: 600px;
    height: 80px;
    background: #FFF36E;
    border-radius: 60px;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #F23D00;
    > svg {
        margin-right: 10px;
    }
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
