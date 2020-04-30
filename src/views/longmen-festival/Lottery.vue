<template>
    <div :class="$style.lottery">
        <div :class="$style.container">
            <div :class="$style.lotteryBox">
                <div :class="$style.baseInfo">
                    <div :class="$style.status" v-if="status === 2">距活动结束</div>
                    <div v-if="status === 3 || status === 4" :class="{ [$style.status]: true, [$style.end]: true }">活动已结束</div>
                    <div :class="$style.status" v-if="status === 1">距活动开始</div>
                    <div :class="$style.time" v-if="status === 1 || status === 2">
                        <span v-if="date.days" v-text="date.days" style="--unit: '天'" />
                        <span v-text="date.hours" style="--unit: '小时'" />
                        <span v-text="date.minutes" style="--unit: '分'" />
                        <span v-text="date.seconds" style="--unit: '秒'" />
                    </div>
                    <div :class="$style.viewer">已有{{ detail.joinUserNumber }}人关注</div>
                    <div :class="$style.chance">您还有{{ count }}次抽奖机会</div>
                </div>
                <div :class="$style.turntable" v-if="turntableAwards.length">
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 0 }" :style="{ backgroundImage: `url('https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (1).png')` }">
                        {{ turntableAwards[0].grade }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 1 }" :style="{ backgroundImage: `url('https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (2).png')` }">
                        {{ turntableAwards[1].grade }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 2 }" :style="{ backgroundImage: `url('https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (3).png')` }">
                        {{ turntableAwards[2].grade }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 3 }" :style="{ backgroundImage: `url('https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (4).png')` }">
                        {{ turntableAwards[3].grade }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 7 }" :style="{ backgroundImage: `url('https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (5).png')` }">
                        {{ turntableAwards[7].grade }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 6 }" :style="{ backgroundImage: `url('https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (6).png')` }">
                        {{ turntableAwards[6].grade }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 5 }" :style="{ backgroundImage: `url('https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (7).png')` }">
                        {{ turntableAwards[5].grade }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 4 }" :style="{ backgroundImage: `url('https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (8).png')` }">
                        {{ turntableAwards[4].grade }}
                    </div>
                </div>
                <div :class="$style.buttons">
                    <button v-if="status === 2 && count <= 0" style="background-image: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/点击框(用完).png');" />
                    <button v-else-if="status === 2 && count > 0" @click="drawLottery" style="background-image: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/点击框.png');" />
                    <button v-else-if="status === 3 || status === 4" style="background-image: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/点击框 3.png');" />
                    <button v-else style="background-image: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/点击框 2.png');" />
                </div>
            </div>
            <div :class="$style.awards">
                <div :class="$style.title">
                    <pl-svg name="icon-present-6233e" width="32" />活动奖品
                </div>
                <div :class="$style.awardsBox">
                    <div :class="$style.inner" ref="inner">
                        <div :class="$style.content">
                            <div
                                v-for="(item, i) of awardList"
                                :class="$style.gift"
                                :key="i"
                            >
                                <img v-if="Number(item.awardType) === 2" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/scholarship.png" alt="">
                                <img v-else-if="Number(item.awardType) === 3 || Number(item.awardType) === 4" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/coupon.png" alt="">
                                <img v-else :src="item.giftImage" alt="">
                                <div>
                                    <div :class="$style.level" v-text="item.grade" />
                                    <div
                                        :class="$style.name"
                                        v-if="Number(item.awardType) === 3"
                                        v-text="`满减券${ item.favorablePrice }元`"
                                    />
                                    <div
                                        :class="$style.name"
                                        v-else-if="Number(item.awardType) === 2"
                                        v-text="`奖学金${ item.scholarshipPrice }元`"
                                    />
                                    <div
                                        :class="$style.name"
                                        v-else
                                        v-text="item.awardName"
                                    />
                                </div>
                            </div>
                        </div>
                        <!-- 灯 -->
                        <canvas ref="canvas" :class="$style.lights" />
                    </div>
                </div>
            </div>

            <div :class="$style.myAwards">
                <div :class="$style.tabs">
                    <div :class="{ [$style.tab]: true, [$style.active]: tab === 0 }" @click="slide(0)">获奖记录</div>
                    <div :class="{ [$style.tab]: true, [$style.active]: tab === 1 }" @click="slide(1)">我的奖品</div>
                </div>
                <div :class="{ [$style.wrap]: true, [$style.noContent]: (tab === 0 && !lotteryRecords.length) || (tab === 1 && !awardRecords.length) }">
                    <swiper :options="swiperOption" ref="swiper" @slideChangeTransitionEnd="slideChangeTransitionEnd">
                        <swiperSlide>
                            <table :class="$style.records" v-if="lotteryRecords.length">
                                <thead>
                                    <th>头像</th>
                                    <th>昵称</th>
                                    <th>奖品</th>
                                    <th>获奖时间</th>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(item, i) of lotteryRecords"
                                        :key="i"
                                    >
                                        <td>
                                            <img :class="$style.avatar" :src="item.userImg" alt="">
                                        </td>
                                        <td class="fz-20" :class="$style.nickname" v-text="item.userName" />
                                        <td class="fz-20 primary-color" :class="$style.awardName" v-text="item.awardName" />
                                        <td class="fz-20" v-text="item.awardTime" />
                                    </tr>
                                </tbody>
                            </table>
                            <img height="300" v-else src="https://mallcdn.youpenglai.com/static/mall/2.9.0/no-awards.png" alt="">
                        </swiperSlide>
                        <swiperSlide>
                            <ul :class="$style.awardList" v-if="awardRecords.length">
                                <li
                                    v-for="(item, i) of awardRecords"
                                    :class="$style.awardItem"
                                    :key="i"
                                >
                                    <img v-if="Number(item.awardType) === 2" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/scholarship.png" alt="">
                                    <img v-else-if="Number(item.awardType) === 3 || Number(item.awardType) === 4" src="https://mallcdn.youpenglai.com/static/mall/2.9.0/coupon.png" alt="">
                                    <img v-else :src="item.giftImg" alt="">
                                    <div>
                                        <div :class="$style.name" v-text="item.awardName" />
                                        <div :class="$style.date" v-text="item.awardTime" />
                                    </div>
                                </li>
                            </ul>
                            <img height="300" v-else src="https://mallcdn.youpenglai.com/static/mall/2.9.0/no-award-2.png" alt="">
                        </swiperSlide>
                    </swiper>
                </div>
            </div>
        </div>

        <div :class="$style.share" @click="generatePoster">
            <pl-svg v-if="creating" class="rotate" name="icon-btn-loading" width="24" />
            <pl-svg v-else name="icon-poster-512b1" width="24" />
            海报
        </div>

        <div :class="$style.rule" @click="showRule = true">
            活动锦囊
        </div>

        <pl-mask :show.sync="showPoster">
            <img :src="poster" style="width: 70vw;" alt="">
        </pl-mask>

        <pl-popup
            :show.sync="showRule"
            title="活动说明"
        >
            <dl :class="$style.ruleContent">
                <dt class="fz-28">1. 活动时间</dt>
                <dd class="fz-24 gray-2 mb-48">{{ detail.startTime }} 至 {{ detail.endTime }}</dd>
                <dt class="fz-28">2. 活动对象</dt>
                <dd class="fz-24 gray-2" :class="Number(detail.userRange) !== 3 && 'mb-48'" v-text="userGroupMap[detail.userRange]" />
                <dd class="fz-24 gray-2 mb-48" v-if="Number(detail.userRange) === 3">
                    <span :class="$style.tag" v-for="item of detail.userGroups" :key="item.groupName" v-text="item.groupName" />
                </dd>
                <dt class="fz-28">3. 抽奖条件</dt>
                <dd
                    class="fz-24 gray-2"
                    v-for="(item, i) of detail.terms"
                    :key="i"
                >
                    <span>用户 {{ ['', '首次注册', '每天进入商城', '单笔订单实际支付满'][item.luckDrawType] }}</span>
                    <template v-if="item.luckDrawType === 3">
                        <span v-text="item.money" />
                        <span> 元，</span>
                    </template>
                    <span> 即可获得 </span>
                    <span v-text="item.availableLuckDrawNumber" />
                    <span> 次抽奖机会</span>
                </dd>
                <dt class="fz-28 mt-40">4. 活动说明</dt>
                <dd class="fz-24 gray-2" style="word-break: break-all; white-space: pre-line;" v-text="detail.activityRule" />
            </dl>
        </pl-popup>

        <!--<gift-pop-up
            :show.sync="showGift"
            button-left-text="继续抽奖"
            button-right-text="开心收下"
            title="恭喜您获得一等奖"
            message="奖品已自动存入您的我的礼品中您可在我的礼品中查看"
        >
            <div />
        </gift-pop-up>-->

        <gift-pop-up
            v-if="showGift"
            :show.sync="showGift"
            :button-left-text="lotteryResult.leftButtonText"
            :button-right-text="lotteryResult.rightButtonText"
            :title="lotteryResult.title"
            :message="lotteryResult.message"
            dangerous-render-html
            @buttonLeftClick="lotteryResult.leftButtonHandler"
            @buttonRightClick="lotteryResult.rightButtonHadnler"
        >
            <GiftItem
                v-if="lotteryResult.awardType === 1"
                :name="lottery.awardName"
                :active-desc="lottery.giftBrief"
                :start-time="lottery.giftUseStartTime"
                :end-time="lottery.giftUseEndTime"
                :gift-image="lottery.giftImage"
            />
            <div v-else-if="lotteryResult.awardType === 2" style="text-align: center; color: #FDEC5A;">
                <strong class="fz-60" v-text="lottery.scholarshipPrice" />
                <span class="fz-30">元</span>
            </div>
            <CouponItemViewer
                v-else-if="lotteryResult.awardType === 3 || lotteryResult.awardType === 4"
                :type="lotteryResult.awardType === 3 ? 1 : 2"
                :start-time="lottery.giftUseStartTime"
                :end-time="lottery.giftUseEndTime"
                :amount="lottery.favorablePrice"
                :full="lottery.satisfyPrice"
            />
        </gift-pop-up>
    </div>
</template>

<script>
/* eslint-disable */
// 根据屏幕大小转换canvas中使用的长度大小
import GiftPopUp from '../../components/activity/Gift-Pop-Up.vue'
import CouponItemViewer from '../../components/item/Coupon-Item-Viewer.vue'
import GiftItem from '../../components/item/Gift-Item.vue'
import { shuffle } from '../../assets/js/loadsh'
import { loadImage, cutArcImage, generateQrcode, SectionToChinese, promise } from '../../assets/js/util'
import Countdown from '../../assets/js/Countdown'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'
import {
    getDetail,
    getLotteryCount,
    getAwardRecords,
    getLotteryRecords,
    lottery
} from '../../apis/longmen-festival/lottery'
import moment from 'moment'
const transformSize = num => num / 7.5 * (window.innerWidth / 100)
// 白色灯泡的下标，后面灯泡的颜色交替更换，默认第0个，即左上角第一个
let IS_WHITE = true
// 是否正在抽奖
let drawing = false
let countDownInstance = null
export default {
    name: 'LongmenLottery',
    components: {
        swiper,
        swiperSlide,
        GiftPopUp,
        CouponItemViewer,
        GiftItem
    },
    data () {
        return {
            tab: 0,
            showRule: false,
            showPoster: false,
            creating: false,
            showGift: false,
            poster: '',
            current: -1,
            swiperOption: {
                spaceBetween: 20
            },
            // 倒计时数据
            date: {},
            // 可用抽奖次数
            count: 0,
            // 状态
            status: 0,
            awardList: [],
            // 要显示在转盘上的奖品，如果奖品时8个，那么就等于awards，如果不是8个，需要填充
            turntableAwards: [],
            // 中奖记录
            lotteryRecords: [],
            // 中的奖品列表
            awardRecords: [],
            detail: {},
            userGroupMap: [
                '所有用户',
                'Helper',
                '普通会员',
                '部分用户分组可用'
            ],
            // 1 礼品 2 奖学金 3 全场满减券 4 品类券
            awardTypeMap: ['', '礼品', '奖学金', '满减券', '品类券'],
            // 抽奖结果弹框对象
            lotteryResult: {},
            // 抽到的奖品
            lottery: null,
            // 获奖记录页码
            awardRecordsPage: 1
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async created () {
        try {
            await this.getDetail()
        } catch (e) {
            throw e
        }
    },
    mounted () {
      window.addEventListener('scroll', this.scrollHandler)
    },
    beforeDestroy () {
        clearInterval(this.drawLotteryTimer)
        window.removeEventListener('scroll', this.scrollHandler)
    },
    computed: {
        ...mapGetters(['logoUrl'])
    },
    methods: {
        scrollHandler () {
            let scrollHeight = document.body.scrollHeight
            if (window.innerHeight + window.scrollY + 100 >= scrollHeight && !this.loading && !this.done) {
                clearTimeout(this.timer)
                this.timer = setTimeout(async () => {
                    this.awardRecordsPage++
                    try {
                        this.loading = true
                        const { result: { records: awardRecords } } = await getAwardRecords(this.id, this.awardRecordsPage)
                        this.lotteryRecords = this.lotteryRecords.concat(awardRecords)
                        if (!awardRecords.length) {
                            this.done = true
                        }
                    } catch (e) {
                        throw e
                    } finally {
                        this.loading = false
                    }
                }, 200)
            }
        },
        async getDetail () {
          try {
              clearInterval(this.drawLotteryTimer)
              const { result } = await getDetail(this.id)
              this.awardList = result.gifts
              this.detail = result
              this.status = Number(result.status)
              await this.$nextTick()
              this.setAwards()
              await this.getRecords()
              await this.countDown()

              // 启动灯的动画
              const canvas = this.$refs.canvas
              const inner = this.$refs.inner
              canvas.width = inner.offsetWidth
              canvas.height = inner.offsetHeight
              const ctx = canvas.getContext('2d')
              this.drawLotteryTimer = setInterval(() => {
                  this.setLights(canvas, ctx)
                  IS_WHITE = !IS_WHITE
              }, 800)
          }  catch (e) {
              this.$router.replace({ name: 'Home' })
              throw e
          }
        },
        async countDown () {
            if (countDownInstance) {
                countDownInstance.stop()
            }
            try {
                const currentTime = await Countdown.getServerTime()
                let duration = 0
                if (this.status === 1) {
                    duration = moment(this.detail.startTime).valueOf() - Number(currentTime)
                } else if (this.status === 2) {
                    duration = moment(this.detail.endTime).valueOf() - Number(currentTime)
                }
                if (duration) {
                    const toString = function (num) {
                        return String(num).padStart(2, '0')
                    }
                    // 启动倒计时
                    countDownInstance = new Countdown(duration, (data) => {
                        if (!data) return location.reload()
                        const { seconds, minutes, hours, days } = data
                        this.date = {
                            seconds: toString(seconds),
                            minutes: toString(minutes),
                            hours,
                            days
                        }
                    })
                    countDownInstance.start()
                }
            } catch (e) {
                throw e
            }
        },
        // 获取奖品记录
        async getRecords () {
          try {
              const { result: count } = await getLotteryCount(this.id)
              this.count = count
              const { result: { records: awardRecords } } = await getAwardRecords(this.id)
              this.lotteryRecords = awardRecords
              const { result: { records: lotteryRecords } } = await getLotteryRecords(this.id)
              this.awardRecords = lotteryRecords
          } catch (e) {
              throw e
          }
        },
        setAwards () {
            const turntableAwards = []
            for (const [i, award] of this.awardList.entries()) {
                award.grade = `${SectionToChinese(i + 1)}等奖`
                turntableAwards.push({
                    ...award
                })
            }
            for (let i = this.awardList.length; i < 8; i++) {
                turntableAwards.push({
                    id: i,
                    grade: '谢谢参与',
                    awardType: -1
                })
            }
            this.turntableAwards = shuffle(turntableAwards)
        },
        // 开始抽奖
        async drawLottery (evt, close) {
            if (drawing) {
                return
            }
            drawing = true
            this.showGift = false
            try {
                let index = 0
                const { result } = await lottery(this.id)
                if (result.isAward) {
                    index = this.turntableAwards.findIndex(item => item.id === result.id)
                    // 中奖了，但是当前奖品列表种没有该奖品，此时需要刷新一下奖品列表
                    if (index === -1) {
                        await this.getDetail()
                        index = this.turntableAwards.findIndex(item => item.id === result.id)
                    }
                    this.lottery = this.turntableAwards.find(item => item.id === result.id)
                } else {
                    index = this.turntableAwards.findIndex(item => item.grade === '谢谢参与')
                    this.lottery = null
                }
                await this.runLottery(index)
            } catch (e) {
                throw e
            }
        },
        /**
         * 启动抽奖动画
         * @param index
         */
        async runLottery (index) {
            // 旋转的圈数
            const TURNS = 6
            // 总次数
            const COUNT = TURNS * this.turntableAwards.length + index
            const SPEED = 10
            // this.current % 8 === 0 = index
            const step = 0
            try {
                await this.rotate(SPEED, COUNT, step)
            } catch (e) {
                throw e
            }
        },
        // 抽奖动画函数
        async rotate (SPEED, COUNT, step) {
            try {
                await promise.timeout(SPEED)
                this.current = step
                if (COUNT === step) {
                    await this.lotteryEnd()
                    return
                }
                step++
                SPEED += SPEED * 0.078
                await this.rotate(SPEED, COUNT, step)
            } catch (e) {
                throw e
            }
        },
        // 抽奖动画结束
        async lotteryEnd () {
            try {
                await this.getRecords()
                this.showResult()
                drawing = false
            } catch (e) {
                throw e
            }
        },
        // 显示抽奖结果
        showResult () {
            if (this.lottery) {
                // 中奖了
                let { grade, awardType } = this.lottery
                this.lotteryResult = {
                    title: `恭喜您获得<i style="color: #FCE804;">${ grade }</i>`,
                    message: awardType === 1 ? '奖品已自动存入“我的礼品中”，您可在“我的礼品中”查看' : awardType === 2 ? '奖品已自动存入“我的奖学金”中，您可在“我的奖学金”中进行查看' : '奖品已自动存入“我的卡券”中，您可在“我的卡券”中进行查看',
                    awardType,
                    leftButtonText: this.count > 0 ? '继续抽奖' : '',
                    rightButtonText: this.count === 0 ? '开心收下' : '',
                    leftButtonHandler: (evt, close) => { close(); this.count > 0 && this.drawLottery() },
                    rightButtonHadnler: (evt, close) => { close() }
                }
            } else {
                this.lotteryResult = {
                    title: '很遗憾，与奖品擦肩而过',
                    message: '感谢您参与活动',
                    leftButtonText: this.count > 0 ? '继续抽奖' : '',
                    rightButtonText: '返回首页',
                    leftButtonHandler: (evt, close) => { close(); this.count > 0 && this.drawLottery() },
                    rightButtonHadnler: (evt, close) => { close(); this.$router.push({ name: 'Home' }) }
                }
            }
            this.showGift = true
        },
        slide (index) {
            this.$refs.swiper.swiper.slideTo(index)
            this.tab = index
        },
        slideChangeTransitionEnd () {
            this.tab = this.$refs.swiper.swiper.activeIndex
        },

        // 绘制灯泡
        setLights (canvas, ctx) {
            let index = IS_WHITE ? 1 : 2
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // 灯的大小
            const lightSize = transformSize(9)
            // 灯间距
            const linghtGap = transformSize(69)
            // 灯的开始点位
            const lightStart = transformSize(96)
            // 计算横着能放几个灯, 计算公式，lightSize * x * 2 + (x - 1) * linghtGap + lightStart * 2 = canvas.width
            const lightCountX = (canvas.width + linghtGap - lightStart * 2) / (2 * lightSize + linghtGap)
            // 计算竖着能放几个灯, 计算公式，lightSize * x * 2 + (x - 1) * linghtGap + lightStart * 2 = canvas.height
            const lightCountY = (canvas.height + linghtGap - lightStart * 2) / (2 * lightSize + linghtGap)
            // 灯的个数可能有小数部分，将小数部分计算成长度，增加至灯的间距
            const lightCountXInt = Number.parseInt(lightCountX)
            const lightCountYInt = Number.parseInt(lightCountY)
            // 计算每个灯直接要补偿的间距
            const linghtGapXAdded = ((lightCountX - lightCountXInt) * lightSize * 2) / (lightCountXInt - 1)
            const linghtGapYAdded = ((lightCountY - lightCountYInt) * lightSize * 2) / (lightCountYInt - 1)
            ctx.shadowBlur = 20
            // console.log(lightCountX, lightCountXInt, linghtGapXAdded)
            // console.log(lightCountY, lightCountYInt, linghtGapYAdded)
            // let lastX = 0
            // 顶部灯
            const GAP_X = linghtGap + linghtGapXAdded
            const GAP_Y = linghtGap + linghtGapYAdded
            const PI2 = Math.PI * 2
            for (let i = 1; i <= lightCountX; i++) {
                index++
                ctx.beginPath()
                ctx.arc(lightStart + lightSize * (2 * i - 1) + GAP_X * (i - 1), transformSize(20), lightSize, 0, PI2)
                ctx.fillStyle = index % 2 === 0 ? '#fff' : '#FFF603'
                ctx.shadowColor = ctx.fillStyle
                ctx.fill()
            }
            // 右上角
            index++
            ctx.beginPath()
            ctx.arc(transformSize(615), transformSize(40), lightSize, 0, PI2)
            ctx.fillStyle = index % 2 === 0 ? '#fff' : '#FFF603'
            ctx.shadowColor = ctx.fillStyle
            ctx.fill()

            // 右侧灯
            for (let i = 1; i <= lightCountY; i++) {
                index++
                ctx.beginPath()
                ctx.arc(transformSize(630), lightStart + lightSize * (2 * i - 1) + GAP_Y * (i - 1), lightSize, 0, PI2)
                ctx.fillStyle = index % 2 === 0 ? '#fff' : '#FFF603'
                ctx.shadowColor = ctx.fillStyle
                ctx.fill()
            }
            // 右下角
            index++
            ctx.beginPath()
            ctx.arc(transformSize(620), canvas.height - transformSize(48), lightSize, 0, PI2)
            ctx.fillStyle = index % 2 === 0 ? '#fff' : '#FFF603'
            ctx.shadowColor = ctx.fillStyle
            ctx.fill()
            // 底部灯
            for (let i = 1; i <= lightCountX; i++) {
                index++
                ctx.beginPath()
                ctx.arc(canvas.width - (lightStart + lightSize * (2 * i - 1) + GAP_X * (i - 1)), canvas.height - transformSize(20), lightSize, 0, PI2)
                ctx.fillStyle = index % 2 === 0 ? '#fff' : '#FFF603'
                ctx.shadowColor = ctx.fillStyle
                ctx.fill()
            }
            // 左下角
            index++
            ctx.beginPath()
            ctx.arc(transformSize(36), canvas.height - transformSize(48), lightSize, 0, PI2)
            ctx.fillStyle = index % 2 === 0 ? '#fff' : '#FFF603'
            ctx.shadowColor = ctx.fillStyle
            ctx.fill()
            // 左侧灯
            for (let i = 1; i <= lightCountY; i++) {
                index++
                ctx.beginPath()
                ctx.arc(transformSize(20), lightStart + lightSize * (2 * i - 1) + GAP_Y * (i - 1), lightSize, 0, PI2)
                ctx.fillStyle = index % 2 === 0 ? '#fff' : '#FFF603'
                ctx.shadowColor = ctx.fillStyle
                ctx.fill()
            }
            // 左上角
            index++
            ctx.beginPath()
            ctx.arc(transformSize(36), transformSize(40), lightSize, 0, PI2)
            ctx.fillStyle = index % 2 === 0 ? '#fff' : '#FFF603'
            ctx.shadowColor = ctx.fillStyle
            ctx.fill()
        },
        // 绘制海报
        async generatePoster () {
            this.creating = true
            try {
                const IMG = await loadImage('https://mallcdn.youpenglai.com/static/mall/2.9.0/longmen-poster.jpg')
                const CVS = document.createElement('canvas')
                const CTX = CVS.getContext('2d')
                let logo = null
                CVS.width = IMG.width
                CVS.height = IMG.height
                CTX.drawImage(IMG, 0, 0)
                // 加载logo
                try {
                    logo = await loadImage(this.detail.logImageUrl || this.logoUrl)
                } catch (e) {}
                // 截取logo为圆形
                if (logo) {
                    try {
                        logo = await cutArcImage(logo)
                    } catch (e) {}
                }
                if (logo) {
                    CTX.drawImage(logo, 16, 16, 68, 68)
                }
                const QRCODE = await generateQrcode({
                    size: 300,
                    text: location.href,
                    img: logo,
                    centerPadding: 2,
                    type: 'canvas',
                    correctLevel: 2
                })
                CTX.drawImage(QRCODE, 318, 568, 158, 158)
                this.poster = CVS.toDataURL('image/jpeg', 1)
                this.showPoster = true
            } catch (e) {
                throw e
            } finally {
                this.creating = false
            }
        }
    }
}
</script>

<style module lang="scss">
    .lottery {
        background: #d7565d linear-gradient(90deg, #cc4e54 1px, transparent 2px, transparent 40px) -24px fixed;
        background-size: 40px 40px;
        > .container {
            padding-top: 40px;
            padding-bottom: 118px;
            background-image: linear-gradient(180deg, #cc4e54 1px, transparent 2px, transparent 40px);
            background-size: 40px 40px;
            background-attachment: fixed;
            overflow: auto;
        }
    }
    .lotteryBox {
        padding-top: 276px;
        padding-bottom: 70px;
        text-align: center;
        color: #eccbb4;
        background: url("https://mallcdn.youpenglai.com/static/mall/2.9.0/弹窗.png") no-repeat center top;
        background-size: 100%;
        > .baseInfo {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            height: 214px;
            padding-left: 16px;
            > .status {
                margin-top: 34px;
                font-size: 28px;
                &.end {
                    margin-top: 36px;
                    font-size: 40px;
                }
            }
            > .time {
                font-size: 30px;
                > span::after {
                    content: var(--unit);
                }
            }
            > .viewer {
                font-size: 20px;
                text-decoration: underline;
            }
            .chance {
                width: max-content;
                margin-top: 20px;
                margin-bottom: 2px;
                padding: 0 16px;
                line-height: 46px;
                font-size: 24px;
                color: #d33f44;
                background-color: #f3baa0;
                border-radius: 12px 12px 0 0;
                box-shadow: 0 -3px 2px #c54c4c;
            }
        }

    }
    .turntable {
        display: flex;
        flex-wrap: wrap;
        width: 510px;
        margin: 36px auto 0;
        > .item {
            width: 124px;
            height: 124px;
            margin: 0 3px 3px 0;
            padding-top: 80px;
            flex-flow: wrap-reverse;
            font-size: 20px;
            font-weight: 600;
            color: #d34219;
            text-align: center;
            box-sizing: border-box;
            border: 7px solid #fff;
            box-shadow: 0 0 0 1px #311c1d;
            background: #fff no-repeat center 15px;
            background-size: 80px;
            &.active {
                background: #fdec5a no-repeat center 15px;
                border-color: #d4ff02;
                background-size: 80px;
                box-shadow: 0 0 10px rgba(0, 0, 0, .3) inset;
            }
            &:nth-of-type(1) {
                border-top-left-radius: 50px;
            }
            &:nth-of-type(4) {
                margin-right: 0;
                border-top-right-radius: 50px;
            }
            &:nth-of-type(5) {
                border-bottom-left-radius: 50px;
            }
            &:nth-of-type(8) {
                margin-right: 0;
                border-bottom-right-radius: 50px;
            }
        }
    }
    .buttons {
        width: 394px;
        height: 142px;
        margin: 166px auto 0;
        transform: translateX(-4px);
        > button {
            width: 100%;
            height: 100%;
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
    }
    .awards {
        margin-top: 64px;
        margin-bottom: 64px;
        font-size: 0;
        > .title {
            margin: 0 auto;
            width: 270px;
            line-height: 60px;
            text-align: center;
            font-size: 32px;
            color: #E1302B;
            font-weight: bold;
            background-color: #FDEC5A;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            > svg {
                margin-right: 12px;
                vertical-align: -5px;
            }
        }
    }
    .awardsBox {
        width: 670px;
        margin: 0 auto;
        border: 10px solid #FDEC5A;
        border-radius: 78px;
        /*overflow: hidden;*/
        box-sizing: border-box;
        > .inner {
            position: relative;
            width: 650px;
            padding: 40px;
            background-color: #fd7a30;
            border: 2px solid #BF1E00;
            border-radius: 70px;
            box-sizing: border-box;
            > .content {
                padding: 16px;
                border-radius: 48px;
                z-index: 2;
                background-color: #fff;
            }
            .gift {
                display: flex;
                margin-bottom: 12px;
                overflow: hidden;
                background-color: #FE672A;
                border-radius: 32px;
                &:nth-last-of-type(1) {
                    margin-bottom: 0;
                }
                > img {
                    width: 156px;
                    height: 156px;
                    margin-right: 32px;
                }
                .level {
                    margin-top: 26px;
                    font-size: 36px;
                    color: #FCE804;
                }
                .name {
                    margin-top: 8px;
                    font-size: 32px;
                    color: #fff;
                }
            }
            > .lights {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
                width: 100%;
                height: 100%;
            }
        }
    }
    .my-awards {
        width: 670px;
        margin: 0 auto;
        overflow: hidden;
        > .tabs {
            display: flex;
            align-items: flex-end;
            height: 98px;
            > .tab {
                flex: 1;
                line-height: 80px;
                font-size: 32px;
                color: #653100;
                text-align: center;
                font-weight: bold;
                background-color: #F0AF00;
                border-radius: 32px 32px 0 0;
                transition: line-height .2s linear;
                &.active {
                    line-height: 98px;
                    background-color: #FFB31E;
                }
            }
        }
        .wrap {
            padding: 32px 24px;
            background-color: #FFB31E;
            &.no-content {
                text-align: center;
                background-color: #fff;
            }
            :global {
                .swiper-slide {
                    height: 0;
                    overflow: hidden;
                    &.swiper-slide-active {
                        height: max-content !important;
                        overflow: auto;
                    }
                }
            }
        }
    }
    .awardList {
        padding: 16px 0 16px 32px;
        background-color: #fff;

    }
    .awardItem {
        display: flex;
        overflow: hidden;
        background-color: #fff;
        border-bottom: 2px solid #e7e7e7;
        &:nth-last-of-type(1) {
            border-bottom: none;
        }
        > img {
            width: 156px;
            height: 156px;
            margin: 16px 32px 16px 0;
        }
        > div {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .name {
            font-size: 36px;
            @include elps-wrap(1);
        }
        .date {
            margin-top: 8px;
            font-size: 28px;
            color: #999;
        }
    }
    .share {
        position: fixed;
        right: 0;
        top: 16px;
        width: 104px;
        line-height: 48px;
        font-size: 24px;
        color: #000;
        background-color: #FCE0B5;
        border-radius: 24px 0 0 24px;
        z-index: 1;
        > svg {
            margin-left: 16px;
            vertical-align: -3px;
        }
    }
    .rule {
        position: fixed;
        right: 0;
        top: 84px;
        width: 120px;
        padding-left: 16px;
        line-height: 48px;
        font-size: 24px;
        color: #000;
        background-color: #FCE0B5;
        border-radius: 24px 0 0 24px;
        box-sizing: border-box;
        z-index: 1;
    }
    .ruleContent {
        padding: 40px;
        color: #000;
        > dt {
            margin-bottom: 8px;
        }
    }
    .records {
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        > thead {
            line-height: 72px;
            font-size: 24px;
            color: #9F9D3C;
            background-color: #fff2cc;
        }
        th {
            padding: 0 20px;
        }
        tr {
            background-color: #fff;
            &:nth-of-type(2n-1) {
                background-color: #F8F8F8;
            }
            > td {
                padding: 12px 20px;
                text-align: center;
            }
            .nickname, .awardName {
                max-width: 100px;
            }
        }
        .avatar {
            width: 48px;
            height: 48px;
            border-radius: 24px;
            object-fit: cover;
        }
    }
    .tag {
        display: inline-block;
        margin: 10px 6px 0 0;
        padding: 0 5px;
        color: $--primary-color;
        font-size: 16px;
        border: 1px solid $--primary-color;
        border-radius: 4px;
    }
</style>
