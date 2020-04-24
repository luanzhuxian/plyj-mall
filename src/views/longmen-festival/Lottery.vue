<template>
    <div :class="$style.lottery">
        <div :class="$style.container">
            <div :class="$style.lotteryBox">
                <div :class="$style.baseInfo">
                    <!--<div :class="$style.status">距活动结束</div>-->
                    <div :class="{ [$style.status]: true, [$style.end]: true }">活动已结束</div>
                    <!--<div :class="$style.status">距活动开始</div>-->
                    <!--<div :class="$style.time">21天12小时23分</div>-->
                    <div :class="$style.viewer">已有23333人关注</div>
                    <div :class="$style.chance">您还有0次抽奖机会</div>
                </div>
                <div :class="$style.turntable" v-if="turntableAwards.length">
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 0 }">
                        {{ turntableAwards[0].name }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 1 }">
                        {{ turntableAwards[1].name }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 2 }">
                        {{ turntableAwards[2].name }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 3 }">
                        {{ turntableAwards[3].name }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 7 }">
                        {{ turntableAwards[7].name }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 6 }">
                        {{ turntableAwards[6].name }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 5 }">
                        {{ turntableAwards[5].name }}
                    </div>
                    <div :class="{ [$style.item]: true, [$style.active]: current % 8 === 4 }">
                        {{ turntableAwards[4].name }}
                    </div>
                </div>
                <div :class="$style.buttons">
                    <button @click="drawLottery" style="background-image: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/点击框.png');" />
                    <!--<button style="background-image: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/点击框 3.png');" />-->
                    <!--<button style="background-image: url('https://mallcdn.youpenglai.com/static/mall/2.9.0/点击框 2.png');" />-->
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
                                        <td class="fz-24" :class="$style.nickname" v-text="item.userName" />
                                        <td class="fz-24 primary-color" :class="$style.awardName" v-text="awardTypeMap[item.awardType]" />
                                        <td class="fz-24" v-text="item.awardTime" />
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
                                    <img v-else :src="item.giftImage" alt="">
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
                <dd class="fz-24 gray-2 mb-48" v-text="userGroupMap[detail.userRange]" />
                <dd class="fz-24 gray-2" v-if="Number(detail.userRange) === 3">
                    asf
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
                <dd class="fz-24 gray-2">在活动有效期内，成功邀请3位好友绑定手机号注册成为店铺的会员，即可获得翻好礼的机会1次；有机会获得大额满减券；领取成功后，将自动存入到会员的现金卡包中</dd>
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
            :show.sync="showGift"
            :button-left-text="lotteryResult.leftButtonText"
            :button-right-text="lotteryResult.rightButtonText"
            :title="lotteryResult.title"
            :message="lotteryResult.message"
            dangerous-render-html
        >
            <div v-if="lotteryResult.awardType === 1">
                礼品
            </div>
            <div v-else-if="lotteryResult.awardType === 2">
                奖学金
            </div>
            <div v-else-if="lotteryResult.awardType === 3">
                满减券
            </div>
            <div v-else-if="lotteryResult.awardType === 4">
                品类券
            </div>
        </gift-pop-up>
    </div>
</template>

<script>
/* eslint-disable */
// 根据屏幕大小转换canvas中使用的长度大小
import GiftPopUp from '../../components/activity/Gift-Pop-Up.vue'
import CouponItem from '../../components/item/Coupon-Item.vue'
import { shuffle } from '../../assets/js/loadsh'
import { loadImage, cutArcImage, generateQrcode, SectionToChinese, promise } from '../../assets/js/util'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'
import {
    getDetail,
    getLotteryCount,
    getAwardRecords,
    getLotteryRecords,
    lottery
} from '../../apis/longmen-festival/lottery'
const transformSize = num => num / 7.5 * (window.innerWidth / 100)
// 白色灯泡的下标，后面灯泡的颜色交替更换，默认第0个，即左上角第一个
let IS_WHITE = true
// 是否正在抽奖
let drawing = false
export default {
    name: 'Lottery',
    components: {
        swiper,
        swiperSlide,
        GiftPopUp,
        CouponItem
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
            // 可用抽奖次数
            count: 0,
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
            lottery: null
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        }
    },
    async activated () {
        try {
            await this.getDetail()
        } catch (e) {
            throw e
        }
    },
    deactivated () {
        clearInterval(this.timer)
    },
    computed: {
        ...mapGetters(['logoUrl'])
    },
    methods: {
        async getDetail () {
          try {
              const { result } = await getDetail(this.id)
              this.awardList = result.gifts
              this.detail = result
              const { result: count } = await getLotteryCount(this.id)
              this.count = count
              const { result: { records: awardRecords } } = await getAwardRecords(this.id)
              this.awardRecords = awardRecords
              const { result: { records: lotteryRecords } } = await getLotteryRecords(this.id)
              this.lotteryRecords = lotteryRecords
              this.setAwards()
              await this.$nextTick()
              this.timer = setInterval(() => {
                  this.setLights()
                  IS_WHITE = !IS_WHITE
              }, 800)
          }  catch (e) {
              throw e
          }
        },
        setAwards () {
            const turntableAwards = []
            for (const [i, award] of this.awardList.entries()) {
                award.grade = `${SectionToChinese(i + 1)}等奖`
                turntableAwards.push({
                    id: award.id,
                    name: award.grade
                })
            }
            for (let i = this.awardList.length; i < 8; i++) {
                turntableAwards.push({
                    id: i,
                    name: '谢谢参与'
                })
            }
            this.turntableAwards = shuffle(turntableAwards)
        },
        // 开始抽奖
        async drawLottery () {
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
                    this.lottery = this.turntableAwards.find(item => item.id === result.id)
                } else {
                    index = this.turntableAwards.findIndex(item => item.name === '谢谢参与')
                }
                await this.runLottery(index)
            } catch (e) {
                throw e
            } finally {
                drawing = false
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
                this.rotate(SPEED, COUNT, step)
            } catch (e) {
                throw e
            }
        },
        // 抽奖动画结束
        async lotteryEnd () {
            try {
                // 重新获取可用抽奖次数
                const { result: count } = await getLotteryCount(this.id)
                this.count = count
                this.showResult()
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
                    title: `恭喜您获得<i stype="#FCE804">${ grade }</i>`,
                    message: '奖品已自动存入您的我的礼品中您可在我的礼品中查看',
                    awardType,
                    leftButtonText: this.count > 0 ? '继续抽奖' : '开心收下',
                    leftButtonHandler: this.count > 0 ? this.drawLottery : () => this.showGift = false
                }
            } else {
                this.lotteryResult = {
                    title: '很遗憾，于奖品擦肩而过',
                    message: '感谢您参与活动',
                    leftButtonText: this.count > 0 ? '继续抽奖' : '',
                    leftButtonHandler: this.drawLottery,
                    rightButtonText: '返回首页',
                    rightButtonHadnler: () => this.$router.push({ name: 'Home' })
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
        setLights () {
            let index = IS_WHITE ? 1 : 2
            const canvas = this.$refs.canvas
            const inner = this.$refs.inner
            canvas.width = inner.offsetWidth
            canvas.height = inner.offsetHeight
            const ctx = canvas.getContext('2d')
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
                    logo = await loadImage(this.logoUrl)
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
            background-size: 80px !important;
            box-shadow: 0 0 0 1px #311c1d;
            &.active {
                background-color: #fced5c;
                border: 7px solid #d4ff02;
                box-shadow: 0 0 10px rgba(0, 0, 0, .3) inset;
            }
            &:nth-of-type(1) {
                border-top-left-radius: 50px;
                background: #fff url("https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (1).png") no-repeat center 15px;
            }
            &:nth-of-type(2) {
                background: #fff url("https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (2).png") no-repeat center 12px;
            }
            &:nth-of-type(3) {
                background: #fff url("https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (3).png") no-repeat center 10px;
            }
            &:nth-of-type(4) {
                margin-right: 0;
                border-top-right-radius: 50px;
                background: #fff url("https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (4).png") no-repeat center 15px;
            }
            &:nth-of-type(5) {
                border-bottom-left-radius: 50px;
                background: #fff url("https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (5).png") no-repeat center 4px;
            }
            &:nth-of-type(6) {
                background: #fff url("https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (6).png") no-repeat center 4px;
            }
            &:nth-of-type(7) {
                background: #fff url("https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (7).png") no-repeat center 2px;
            }
            &:nth-of-type(8) {
                margin-right: 0;
                border-bottom-right-radius: 50px;
                background: #fff url("https://mallcdn.youpenglai.com/static/mall/2.9.0/lottory (8).png") no-repeat center 12px;
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
                min-height: 570px;
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
</style>
