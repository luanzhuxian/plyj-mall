<template>
    <div :class="$style.springPloughing">
        <div :class="$style.countdown">
            <div :class="$style.globalEndCountdown" v-if="allEnd.s">
                <template v-if="!allEnd.wasEnded">
                    <span v-if="allEnd.wasStarted">距活动结束: </span>
                    <span v-else>距活动开始: </span>
                    <span :class="$style.val + ' ' + $style.day" v-text="allEnd.d" />
                    <span :class="$style.unit">天</span>
                    <span :class="$style.val" v-text="allEnd.h" />
                    <span :class="$style.unit">:</span>
                    <span :class="$style.val" v-text="allEnd.m" />
                    <span :class="$style.unit">:</span>
                    <span :class="$style.val" v-text="allEnd.s" />
                </template>
                <span v-else>已结束</span>
            </div>
            <div :class="$style.topRight" @click="createPoster">活动海报</div>
            <div :class="$style.topRight" @click="showRules = true">活动规则</div>
            <pl-svg
                v-if="list.length && list[0].quarterVersion"
                :name="`icon-${map[list[0].quarterVersion]}`"
                width="50"
                height="105"
            />
        </div>

        <div
            :class="$style.activity"
            v-for="(activity, a) of list"
            :key="a"
        >
            <div :class="$style.activityName" v-text="activity.activityName" />
            <div
                :class="$style.content"
                v-for="(item, i) of activity.models"
                :key="a + '-' + i"
            >
                <div :class="$style.groupName" v-text="item.activityName" />
                <div :class="$style.discount">
                    <span>组合打包{{ item.discount }}折起</span>
                    <span>|</span>
                    <span>{{ item.purchaseQuantity }}人已购</span>
                </div>
                <div :class="$style.endCountdown">
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
                        :key="a + '-' + i + '-' + j"
                        :data="pro"
                    />
                </div>
                <div :class="$style.giftList" v-if="item.gifts.length">
                    <div :class="$style.title">
                        更享更多伴手礼
                    </div>
                    <SpringPloughingGiftItem
                        v-for="(gift, k) of item.gifts"
                        :key="a + '-' + i + '-' + k"
                        :data="gift"
                    />
                </div>
                <button v-if="!item.stock" :class="$style.buy">
                    太火爆了，都被抢空了
                </button>
                <button v-else-if="item.wasStarted && !item.wasEnded" :class="$style.buy" @click="buy(item)">
                    点击购买 组合到手<i v-text="item.amount" />元
                </button>
                <button v-else-if="!item.wasStarted" :class="$style.buy + ' ' + $style.notStart">
                    暂未开启，敬请期待
                </button>
                <button v-else-if="item.wasEnded" :class="$style.buy + ' ' + $style.ended">
                    暂未开启，敬请期待
                </button>
                <div :class="$style.corner + ' ' + $style.topLeft" />
                <div :class="$style.corner + ' ' + $style.topRight" />
                <div :class="$style.corner + ' ' + $style.bottomLeft" />
                <div :class="$style.corner + ' ' + $style.bottomRight" />
            </div>
        </div>

        <pl-popup
            :show.sync="showRules"
            title="活动规则"
        >
            <ul :class="$style.rules">
                <li>1. 设置活动，活动期间该页面展示的所有组合购买商品均以组合折扣价位售卖</li>
                <li>2. 活动期间商品不退款，不支持线上发票</li>
                <li>3. 仅在该页面下单可享受优惠，其他页面点击或购物车购买不享受优惠</li>
                <li>4. 结束以时间和数量购买完截止结束</li>
            </ul>
        </pl-popup>

        <transition name="fade">
            <div v-if="showPoster" :class="$style.poster">
                <img v-imgError :src="poster" alt="" style="width: 80%;">
                <pl-svg name="icon-close3" width="36" @click="showPoster = false" />
            </div>
        </transition>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import SpringPloughingProItem from '../components/Spring-Ploughing-Pro-Item.vue'
import SpringPloughingGiftItem from '../components/Spring-Ploughing-Gift-Item.vue'
import { getSpringCombination } from '../../../apis/product'
import {
    generateQrcode,
    createText,
    cutArcImage,
    loadImage
} from '../../../assets/js/util'
import Countdown from '../../../assets/js/Countdown'

const POSTER_BG = 'https://mallcdn.youpenglai.com/static/mall/2.0.0/activity/4b676734-b0c9-4aca-942d-ce62e481ebcf.jpeg'

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
            // 全部结束
            allEnd: {
                d: '',
                h: '',
                m: '',
                s: '',
                wasStarted: false,
                wasEnded: false
            },
            map: {
                第一季: 'diyiji-adbb7',
                第二季: 'dierji-bbdb7',
                第三季: 'disanji-b8ae3',
                第四季: 'disiji-5d233',
                第五季: 'diwuji-af921'
            }
        }
    },
    computed: {
        ...mapGetters(['avatar', 'userName', 'mobile'])
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
        this.countInstaceList.map(item => item.stop())
        this.countInstaceList = []
    },
    methods: {
        // batchType 1: 组合课 2: 春耘
        async getSpringCombination () {
            try {
                const { result } = await getSpringCombination({
                    current: 1,
                    size: 60,
                    batchType: 2
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
                const lastEndTime = moment(this.list[0].activityEndTime).valueOf()
                const lastStartTime = moment(this.list[0].activityStartTime).valueOf()
                const now = Date.now()
                this.allEnd.wasStarted = now - lastStartTime >= 0
                this.allEnd.wasEnded = now - lastEndTime >= 0
                // // 未开始倒计时(距离开始)
                if (!this.allEnd.wasStarted) {
                    this.setCountdownTime(this.allEnd, lastStartTime - now)
                }
                // 开始倒计时(距离结束)
                if (this.allEnd.wasStarted && !this.allEnd.wasEnded) {
                    this.setCountdownTime(this.allEnd, lastEndTime - now)
                }
            } catch (e) {
                throw e
            }
        },

        /**
         * 设置到计时时间
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
                    agentUser: '',
                    productType: pro.productType
                })
            }
            sessionStorage.setItem('CONFIRM_LIST', JSON.stringify(confirmList))
            await this.$router.push({
                name: 'SubmitOrder',
                query: {
                    isCart: 'YES',
                    activeProduct: 5,
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
            ctx.fillStyle = '#397432'
            ctx.fillRect(0, 0, 638, 88)
            ctx.drawImage(AVATAR, 20, 12, 64, 64)
            ctx.font = '24px Microsoft YaHei UI'
            ctx.fillStyle = '#fff'
            ctx.textBaseline = 'hanging'
            createText(ctx, 100, 32, `${ this.userName } 邀你一起春耘计划`, 34, 510, 1)
            ctx.drawImage(BG, 0, 88, 638, 1046)
            const QR = await generateQrcode({ size: 200, text: location.href, type: 'canvas' })
            ctx.drawImage(QR, 216, 826, 204, 204)
            this.poster = cvs.toDataURL('image/jpeg', 0.9)
            this.showPoster = true
            this.creating = false
        }
    }
}
</script>

<style module lang="scss">
.spring-ploughing {
    display: flex;
    flex-direction: column;
    padding-bottom: 182px;
    background-color: #8dc607;
}
.countdown {
    position: relative;
    height: 674px;
    padding-top: 20px;
    background: #f9dfbe url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/c6bd4a18-d557-4dbd-9270-edab7a0f30b1.png') no-repeat center 20px;
    background-size: 100%;
    > .top-right {
        position: absolute;
        right: 0;
        top: 16px;
        width: 128px;
        font-size: 24px;
        color: #88de9e;
        text-align: center;
        line-height: 50px;
        background-color: rgba(0, 0, 0, .5);
        border-radius: 40px 0 0 40px;
        &:nth-of-type(2) {
            margin-top: 66px;
        }
    }
    > svg {
        position: absolute;
        top: 175px;
        right: 95px;
    }
}
.content {
    position: relative;
    width: 686px;
    padding: 24px;
    margin: 14px auto 48px;
    background-color: #428b42;
    box-shadow: 0 0 0 2px #a3d816 inset;
    box-sizing: border-box;
}
.activity-name {
    position: relative;
    width: max-content;
    margin: 26px auto 32px;
    font-size: 36px;
    text-align: center;
    color: #fff;
    font-weight: bold;
    &:before {
        content: '';
        position: absolute;
        left: -86px;
        top: 50%;
        width: 54px;
        height: 42px;
        transform: rotate(180deg) translateY(50%);
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/78c17f27-4fa9-4a18-a821-e4202e7aa0a1.png') no-repeat center center;
        background-size: 100%;
    }
    &:after {
        content: '';
        position: absolute;
        right: -86px;
        top: 50%;
        width: 54px;
        height: 42px;
        transform: translateY(-50%);
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/78c17f27-4fa9-4a18-a821-e4202e7aa0a1.png') no-repeat center center;
        background-size: 100%;
    }
}
.group-name {
    max-width: 458px;
    margin: 16px auto;
    padding: 16px 100px;
    font-size: 28px;
    line-height: 36px;
    color: #dcfd8c;
    text-align: center;
    font-weight: bold;
    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/e009100a-579a-4369-8238-db258fb2d91b.png') no-repeat center center;
    background-size: 100% 100%;
    background-clip: border-box;
}
.discount {
    margin-bottom: 20px;
    text-align: center;
    color: #88de9e;
    font-size: 24px;
    > span:nth-of-type(2) {
        margin: 0 12px;
        vertical-align: 2px;
    }
}

.end-countdown,
.global-end-countdown {
    width: 400px;
    margin: 0 auto;
    line-height: 80px;
    font-size: 24px;
    text-align: center;
    color: #88de9e;
    background-color: #397432;
    border-radius: 20px;
    > .unit {
        padding: 0 4px;
    }
    > .val {
        display: inline-block;
        padding: 4px;
        line-height: 30px;
        color: #184b28;
        background-color: #8de5a8;
        border-radius: 6px;
    }
}
.global-end-countdown {
    margin-top: 286px;
    background: none;
    > .val {
        background-color: #ffd6a7;
        &.day {
            background-color: #8de5a8;
        }
    }
}

.gift-list {
    .title {
        margin: 24px 0;
        font-weight: bold;
        font-size: 40px;
        color: #fae47f;
        &:before {
            display: inline-block;
            content: '';
            width: 8px;
            height: 40px;
            vertical-align: -6px;
            border-radius: 4px;
            background-color: #fae47f;
        }
    }
}

.buy {
    display: block;
    min-width: 400px;
    margin: 48px auto 36px;
    padding: 0 20px;
    line-height: 78px;
    font-size: 32px;
    color: #184b28;
    background-color: #8de5a8;
    border-radius: 39px;
    font-weight: bold;
    box-shadow: 0 6px 12px rgba(132, 0 ,0, .16);
    &.not-start {
        font-weight: normal;
        color: #a6482f;
    }
    &.ended {
        color: #184b28;
        font-weight: normal;
        background-color: #67b875;
    }
}
.corner {
    position: absolute;
    width: 46px;
    height: 42px;
    z-index: 1;
    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/1c11b4a5-091d-4f8d-a88c-e8334dfc9d88.png') no-repeat center center;
    background-size: 100% 100%;
    &.top-left {
        top: 0;
        left: 0;
    }
    &.top-right {
        top: 0;
        right: 0;
        transform: rotateY(180deg);
    }
    &.bottom-right {
        bottom: 0;
        right: 0;
        transform: rotateY(180deg) rotateX(180deg);
    }
    &.bottom-left {
        bottom: 0;
        left: 0;
        transform: rotateX(180deg);
    }
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
