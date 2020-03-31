<template>
    <div :class="$style.coursePackage">
        <div :class="$style.background">
            <div :class="$style.topCountdown" v-if="count.s">
                <template v-if="!count.wasEnded">
                    <span v-if="count.wasStarted">距活动结束: </span>
                    <span v-else>距活动开始: </span>
                    <span :class="$style.val + ' ' + $style.day" v-text="count.d" />
                    <span :class="$style.unit">天</span>
                    <span :class="$style.val" v-text="count.h" />
                    <span :class="$style.unit">:</span>
                    <span :class="$style.val" v-text="count.m" />
                    <span :class="$style.unit">:</span>
                    <span :class="$style.val" v-text="count.s" />
                </template>
                <span v-else>活动已结束</span>
            </div>
            <div :class="$style.topRight" @click="showRules = true">活动规则</div>
            <div :class="$style.topRight" @click="createPoster">活动海报</div>
        </div>
        <div
            :class="$style.activity"
            v-for="(activity, index) of list"
            :key="index"
        >
            <div :class="$style.activityName">
                <div :class="$style.front">
                    <div :class="$style.frontTop" />
                    <div :class="$style.frontFront" v-text="activity.activityName" />
                </div>
                <div :class="$style.back" />
            </div>
            <div
                :class="$style.content"
                v-for="(item, i) of activity.models"
                :key="index + '-' + i"
            >
                <!-- <div :class="$style.groupName" v-text="item.activityName" /> -->
                <div :class="$style.discount">
                    <span>组合打包{{ item.discount }}折起</span>
                    <span>|</span>
                    <span>{{ item.purchaseQuantity }}人已购</span>
                </div>
                <div :class="$style.packageCountdown">
                    <template v-if="!item.wasEnded">
                        <span v-if="item.wasStarted">距活动结束: </span>
                        <span v-else>距活动开始: </span>
                        <span :class="$style.val" v-text="item.d" />
                        <span :class="$style.unit">天</span>
                        <span :class="$style.val" v-text="item.h" />
                        <span :class="$style.unit">:</span>
                        <span :class="$style.val" v-text="item.m" />
                        <span :class="$style.unit">:</span>
                        <span :class="$style.val" v-text="item.s" />
                    </template>
                    <span v-else>已结束</span>
                </div>
                <div :class="$style.proList">
                    <SpringPloughingProItem
                        v-for="(pro, j) of item.products"
                        :key="index + '-' + i + '-' + j"
                        :data="pro"
                        color="yellow"
                    />
                </div>
                <div :class="$style.giftList" v-if="item.gifts.length">
                    <div :class="$style.title">
                        更享更多伴手礼
                    </div>
                    <SpringPloughingGiftItem
                        v-for="(gift, k) of item.gifts"
                        :key="index + '-' + i + '-' + k"
                        :data="gift"
                        color="yellow"
                    />
                </div>
                <button v-if="!item.stock" :class="$style.button">
                    太火爆了，都被抢空了
                </button>
                <button
                    v-else-if="item.wasStarted && !item.wasEnded"
                    :class="$style.button"
                    @click="buy(item)"
                >
                    点击购买 组合到手<i v-text="item.amount" />元
                </button>
                <button v-else-if="!item.wasStarted" :class="$style.button">
                    暂未开启，敬请期待
                </button>
                <button v-else-if="item.wasEnded" :class="$style.button">
                    暂未开启，敬请期待
                </button>
            </div>
        </div>

        <pl-popup :show.sync="showRules" title="活动规则">
            <ul :class="$style.rules">
                <li>1. 设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖</li>
                <li>2. 活动期间不支持退款，不支持线上发票</li>
                <li>3. 仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠</li>
                <li>4. 结束以活动截止时间为准</li>
            </ul>
        </pl-popup>

        <transition name="fade">
            <div v-if="showPoster" :class="$style.poster">
                <img :src="poster" alt="" style="width: 80%;">
                <pl-svg name="icon-close3" width="36" @click="showPoster = false" />
            </div>
        </transition>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import SpringPloughingProItem from './components/Spring-Ploughing-Pro-Item.vue'
import SpringPloughingGiftItem from './components/Spring-Ploughing-Gift-Item.vue'
import { getSpringCombination } from '../../apis/product'
import {
    generateQrcode,
    createText,
    cutArcImage,
    loadImage,
    Countdown
} from '../../assets/js/util'
import share from '../../assets/js/wechat/wechat-share'
import { SET_SHARE_ID } from '../../store/mutation-type'

export default {
    name: 'SpringPloughing',
    components: {
        SpringPloughingProItem,
        SpringPloughingGiftItem
    },
    data () {
        return {
            showRules: false,
            showPoster: false,
            poster: '',
            creating: false,
            list: [],
            // 倒计时实例列表
            countInstaceList: [],
            count: {
                d: '',
                h: '',
                m: '',
                s: '',
                wasStarted: false,
                wasEnded: false
            }
        }
    },
    props: {
        // 分享人id
        brokerId: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['avatar', 'userName', 'mobile', 'appId', 'userId', 'mallUrl', 'shareId'])
    },
    mounted () {
        // 全局缓存分享人id
        this.$store.commit(SET_SHARE_ID, this.brokerId)
    },
    async activated () {
        try {
            await this.getSpringCombination()
            const t = await Countdown.getServerTime()
            console.log(t)
        } catch (e) {
            throw e
        }
    },
    deactivated () {
        this.showRules = false
        this.showPoster = false
        this.countInstaceList.map(item => item.stop())
        this.countInstaceList = []
    },
    methods: {
        // batchType 1: 组合课 2: 春耘
        async getSpringCombination () {
            const getLatestEndTime = (data = []) => {
                const list = data.map(item => moment(item.activityEndTime).valueOf())
                return Math.max.apply(null, list)
            }

            try {
                const { result } = await getSpringCombination({
                    current: 1,
                    size: 60,
                    batchType: 1
                })
                if (!result.records.length) {
                    this.$alert({
                        message: '您无法参与活动',
                        viceMessage: '返回首页，更多活动等您开启',
                        confirmText: '去首页'
                    })
                        .finally(() => {
                            this.$router.push({ name: 'Home' })
                        })
                    return
                }
                for (const activity of result.records) {
                    activity.models.sort((a, b) => moment(a.activityStartTime).valueOf() - moment(b.activityStartTime).valueOf())
                    for (const group of activity.models) {
                        // 添加倒计时相关字段
                        group.d = ''
                        group.h = ''
                        group.m = ''
                        group.s = ''
                        const activityStartTime = moment(group.activityStartTime).valueOf()
                        const activityEndTime = moment(group.activityEndTime).valueOf()
                        const now = Date.now()
                        // 是否开始
                        group.wasStarted = now - activityStartTime >= 0
                        // 是否结束
                        group.wasEnded = now - activityEndTime >= 0
                        // 未开始倒计时(距离开始)
                        if (!group.wasStarted) {
                            this.setCountdownTime(group, activityStartTime - now)
                        }
                        // 开始倒计时(距离结束)
                        if (group.wasStarted && !group.wasEnded) {
                            this.setCountdownTime(group, activityEndTime - now)
                        }
                    }
                }
                this.list = result.records
                const lastStartTime = moment(this.list[0].activityStartTime).valueOf()
                const lastEndTime = getLatestEndTime(this.list)
                const now = Date.now()
                this.count.wasStarted = now - lastStartTime >= 0
                this.count.wasEnded = now - lastEndTime >= 0
                // // 未开始倒计时(距离开始)
                if (!this.count.wasStarted) {
                    this.setCountdownTime(this.count, lastStartTime - now)
                }
                // 开始倒计时(距离结束)
                if (this.count.wasStarted && !this.count.wasEnded) {
                    this.setCountdownTime(this.count, lastEndTime - now)
                }
                this.share()
            } catch (e) {
                throw e
            }
        },

        /**
         * 设置倒计时时间
         * @param data {object} 每组数据
         * @param duration {number} 倒计时时长
         */
        setCountdownTime (data, duration) {
            const countdown = new Countdown(duration, async countdownData => {
                if (!countdownData) {
                    // 倒计时结束，刷新数据
                    await this.getSpringCombination()
                    return
                }
                const d = String(countdownData.days)
                const h = String(countdownData.hours)
                const m = String(countdownData.minutes)
                const s = String(countdownData.seconds)
                data.d = d.padStart(2, '0')
                data.h = h.padStart(2, '0')
                data.m = m.padStart(2, '0')
                data.s = s.padStart(2, '0')
            })
            this.countInstaceList.push(countdown)
            countdown.start()
        },
        async buy (data) {
            if (!this.hasBind()) return
            const confirmList = []
            for (const pro of data.products) {
                confirmList.push({
                    productId: pro.goodsId,
                    skuCode1: pro.sku1,
                    skuCode2: pro.sku2,
                    count: pro.count,
                    price: pro.amount,
                    agentUser: this.shareId
                })
            }
            sessionStorage.setItem('CONFIRM_LIST', JSON.stringify(confirmList))
            await this.$router.push({
                name: 'SubmitOrder',
                query: {
                    isCart: 'YES',
                    activeProduct: 6,
                    preActivity: 2,
                    activityId: data.activityId
                }
            })
        },
        // 判断绑定手机
        hasBind () {
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
        async createPoster () {
            const POSTER_BG = 'https://mallcdn.youpenglai.com/static/mall/2.8.0/package-poster.jpg'

            if (this.creating) {
                return
            }
            if (this.poster) {
                this.showPoster = true
                return
            }
            this.creating = true
            const cvs = document.createElement('canvas')
            const ctx = cvs.getContext('2d')
            const Result = await Promise.all([
                loadImage(POSTER_BG),
                loadImage(this.avatar)
            ])
            const BG = Result[0]
            const AVATAR = await cutArcImage(Result[1])
            cvs.width = 638
            cvs.height = 1134
            ctx.fillStyle = '#EA7635'
            ctx.fillRect(0, 0, 638, 88)
            ctx.drawImage(AVATAR, 20, 12, 64, 64)
            ctx.font = '24px Microsoft YaHei UI'
            ctx.fillStyle = '#fff'
            ctx.textBaseline = 'hanging'
            createText(ctx, 100, 32, `${ this.userName } 邀您参加组合聚惠学`, 34, 510, 1)
            ctx.drawImage(BG, 0, 88, 638, 1046)
            const QR = await generateQrcode(200, this.shareUrl, 0, null, 0, 'canvas')
            ctx.drawImage(QR, 204, 730, 238, 238)
            this.poster = cvs.toDataURL('image/jpeg', 0.9)
            this.showPoster = true
            this.creating = false
        },
        share () {
            let shareUrl = ''
            let img
            const { appId, mallUrl, userId } = this
            if (userId) {
                shareUrl = `${ mallUrl }/course-package/${ userId }?noCache=${ Date.now() }`
            } else {
                shareUrl = `${ mallUrl }/course-package?noCache=${ Date.now() }`
            }
            this.shareUrl = shareUrl
            if (this.list.length) {
                img = this.list[0].models[0].image
            }
            share({
                appId,
                title: `${ this.userName } 邀您参加组合聚惠学`,
                desc: '组合好课，全面发展，起飞在起跑线上',
                link: shareUrl,
                imgUrl: img
            })
        }
    }
}
</script>

<style lang="scss" module>
.course-package {
    display: flex;
    flex-direction: column;
    padding-bottom: 35px;
    background: #f5c36c;
}
.background {
    position: relative;
    height: 560px;
    background: url('https://mallcdn.youpenglai.com/static/mall/2.8.0/package-bg.jpg') no-repeat center top;
    background-size: 100% auto;
    > .top-right {
        position: absolute;
        right: 0;
        bottom: -16px;
        width: 128px;
        font-size: 24px;
        color: #fff;
        text-align: center;
        line-height: 50px;
        background-color: #ea7635;
        border-radius: 40px 0 0 40px;
        &:nth-of-type(2) {
            bottom: 50px;
        }
    }
}
.activity {
    padding: 0 18px;
    margin-bottom: 38px;
}
.activity-name {
    position: relative;
    bottom: -30px;
    padding: 7.5px 0 6px;
    z-index: 1;
    .front {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        &-top {
            border: 12px solid;
            border-bottom: 7.5px solid;
            border-top: none;
            border-color: transparent transparent #c94828 transparent;
        }
        &-front {
            box-sizing: border-box;
            padding: 0 20px;
            width: 600px;
            line-height: 68px;
            background: #ea7635;
            border-top: 1px solid #f5c36c;
            text-align: center;
            font-size: 30px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #fff;
            letter-spacing: 2px;
            @include elps();
        }
    }
    .back {
        width: 712px;
        height: 60px;
        background: #c94828;
        border-radius: 10px;
        z-index: 1;
    }
}
.content {
    position: relative;
    padding: 48px 24px;
    margin: 14px auto 48px;
    background-color: #fbefd7;
    border-radius: 20px;
    box-sizing: border-box;
    &:nth-last-of-type(1) {
        margin-bottom: 0;
    }
}
.discount {
    margin-bottom: 20px;
    text-align: center;
    color: #663a15;
    font-size: 24px;
    > span:nth-of-type(2) {
        margin: 0 12px;
        vertical-align: 2px;
    }
}
.package-countdown {
    margin: 0 auto;
    width: 400px;
    line-height: 80px;
    text-align: center;
    font-size: 24px;
    color: #fbefd7;
    background-color: #df5b2f;
    border-radius: 20px;
    > .unit {
        padding: 0 4px;
    }
    > .val {
        display: inline-block;
        box-sizing: border-box;
        padding: 4px;
        min-width: 38px;
        line-height: 30px;
        color: #df5b2f;
        background-color: #fbefd7;
        border-radius: 6px;
    }
}
.top-countdown {
    margin: 340px auto 0;
    width: 455px;
    line-height: 60px;
    text-align: center;
    font-size: 28px;
    color: #663a15;
    background-color: #f5c36c;
    border-radius: 40px;
    > .unit {
        padding: 0 8px;
    }
    > .val {
        display: inline-block;
        box-sizing: border-box;
        padding: 0 4px;
        min-width: 42px;
        line-height: 40px;
        color: #fff;
        background-color: #e97f40;
        border-radius: 6px;
    }
}
.pro-list {
    margin-top: 32px;
}
.gift-list {
    padding: 0 14px;
    .title {
        margin: 24px 0;
        font-weight: bold;
        font-size: 40px;
        color: #ea7635;
        &:before {
            display: inline-block;
            content: '';
            width: 8px;
            height: 40px;
            vertical-align: -6px;
            border-radius: 4px;
            background-color: #ea7635;
        }
    }
}
.button {
    display: block;
    min-width: 400px;
    margin: 46px auto 0;
    padding: 0 20px;
    line-height: 78px;
    font-size: 32px;
    color: #fff;
    background-color: #fe782f;
    border-radius: 39px;
    font-weight: bold;
    box-shadow: 0 6px 12px rgba(132, 0, 0, .16);
}
.rules {
    padding: 24px 24px 60px;
    font-size: 26px;
    line-height: 56px;
}
.poster {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    z-index: 10;
    > img {
        margin-top: 20px;
    }
    > svg {
        margin-top: 20px;
    }
}

</style>
