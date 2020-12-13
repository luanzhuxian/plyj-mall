<template>
    <Panel custom-class="spring-2021-red-package-panel" @click="$router.push({ name: 'RedPackage' })">
        <template slot="title">
            <div class="spring-2021-red-package-panel-title" />
        </template>
        <template slot="default">
            <swiper :class="$style.redPackageList" :options="swiperOption" v-if="data.values.length">
                <template v-for="(item, i) of data.values">
                    <swiper-slide v-if="item.goodsInfo" :key="i">
                        <router-link
                            :class="$style.redPackageListItem"
                            tag="li"
                            :to="{
                                name: 'RedPackageDetail',
                                params: { activityId: item.goodsInfo.id }
                            }"
                        >
                            <div :class="$style.redPackageListItemLeft">
                                <div :class="$style.amount">
                                    <b>{{ item.goodsInfo.amount }}</b>
                                </div>
                                <p :class="$style.count">已领<span>{{ item.goodsInfo.claimVolume }}</span>张</p>
                                <p :class="$style.count">剩余<span>{{ item.goodsInfo.issueVolume }}</span>张</p>
                            </div>
                            <div :class="$style.redPackageListItemRight">
                                <b :class="$style.rule">
                                    {{ item.goodsInfo.price ? `${item.goodsInfo.price}可抵${item.goodsInfo.amount}` : `可抵${item.goodsInfo.amount}` }}
                                </b>
                                <p :class="$style.name">{{ item.goodsInfo.name }}</p>
                                <p :class="$style.time">
                                    {{ `使用时间：${formatTime(item.goodsInfo.useStartTime)}-${formatTime(item.goodsInfo.useEndTime)}` }}
                                </p>
                                <p :class="$style.link">指定商品可用 ></p>
                                <div :class="$style.bottom">
                                    <b :class="$style.price">{{ item.goodsInfo.price ? `仅需${item.goodsInfo.price}元` : '免费领取' }}</b>
                                    <button :class="$style.button">立即领取</button>
                                </div>
                            </div>
                            <div :class="$style.countdownWrapper">
                                <span :class="$style.text" v-if="item.goodsInfo.activityStatus === 0">距活动开始：</span>
                                <span :class="$style.text" v-else-if="item.goodsInfo.activityStatus === 1">距活动结束：</span>
                                <span :class="$style.text" v-else>活动已结束</span>
                                <Countdown
                                    v-if="~[0, 1].indexOf(item.goodsInfo.activityStatus)"
                                    :duration="getDuration(item.goodsInfo)"
                                    format="DD天HH:mm:ss"
                                    @finish="() => resetCountdown(item.goodsInfo)"
                                />
                            </div>
                        </router-link>
                    </swiper-slide>
                </template>
            </swiper>
        </template>
    </Panel>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Panel from './Panel.vue'
import Countdown from '../../../components/activity/Countdown.vue'
import moment from 'moment'

export default {
    name: 'RedPackage',
    components: {
        swiper,
        swiperSlide,
        Panel,
        Countdown
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {
            swiperOption: {
                slidesPerView: 1.1,
                spaceBetween: 10,
                // loop: true,
                autoplay: this.data.values.length > 1
                    ? {
                        disableOnInteraction: false
                    }
                    : false
            }
        }
    },
    methods: {
        getDuration ({ activityStatus, receiveStartTime, receiveEndTime }) {
        // 0 未开始 1 进行中 2 暂停 3 结束
            const now = Date.now().valueOf()
            if (activityStatus === 0) {
                return moment(receiveStartTime).valueOf() - now
            } else if (activityStatus === 1) {
                return moment(receiveEndTime).valueOf() - now
            }
            return 0
        },
        resetCountdown (item) {
            if ('goodsInfo' in item) {
                if (item.goodsInfo.activityStatus === 0) {
                    item.goodsInfo.activityStatus = 1
                }
                if (item.goodsInfo.activityStatus === 1) {
                    item.goodsInfo.activityStatus = 2
                }
            }
        },
        formatTime (time) {
            if (!time) return ''
            return time.split(' ')[0].replace(/-/g, '.')
        }
    }
}
</script>

<style lang="scss">
.spring-2021-red-package-panel {
    .spring-2021-red-package-panel-title {
        height: 244px;
        background: url(https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/title-red-package.png) no-repeat center;
        background-size: 100%;
    }
    .spring-2021-panel-container {
        position: relative;
        top: -2px;
        padding: 26px 0 60px;
        background: #F54540;
    }
    .spring-2021-panel-button {
        border-color: #FFC70C;
        color: #FFC70C;
    }
}
</style>

<style lang="scss" module>
.red-package-list {
    padding-left: 40px;
    &-item {
        position: relative;
        display: flex;
        box-sizing: border-box;
        padding: 32px 0 44px;
        width: 636px;
        height: 290px;
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        &-left {
            box-sizing: border-box;
            padding-left: 32px;
            width: 200px;
            .amount {
                display: flex;
                align-items: center;
                height: 110px;
                border-right: 2px solid #DDDDDD;
                > b {
                    font-size: 60px;
                    line-height: 80px;
                    color: #F54540;
                    @include elps();
                    &::before {
                        content: '¥';
                        font-size: 40px;
                        line-height: 54px;
                    }
                }
            }
            .count {
                margin-top: 8px;
                font-size: 20px;
                line-height: 28px;
                color: #999999;
                > span {
                    color: #333;
                }
            }
        }
        &-right {
            flex: 1;
            width: 0;
            display: flex;
            flex-direction: column;
            padding: 4px 24px 10px;
            .rule {
                font-size: 24px;
                line-height: 32px;
                color: #333333;
                @include elps();
            }
            .name {
                font-size: 24px;
                line-height: 32px;
                color: #05A19A;
                @include elps();
            }
            .time {
                margin-top: 8px;
                font-size: 20px;
                line-height: 28px;
                color: #999999;
                @include elps();
            }
            .link {
                font-size: 20px;
                line-height: 28px;
                color: #DDC575;
            }
            .bottom {
                margin-top: auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 28px;
                color: #D80000;
            }
            .button {
                width: 160px;
                line-height: 52px;
                text-align: center;
                background: #DE302C;
                border-radius: 26px;
                font-size: 26px;
                font-family: Microsoft YaHei;
                font-weight: 600;
                color: #FFFFFF;
                border: none;
            }
        }
        .countdown-wrapper {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            text-align: center;
            line-height: 44px;
            background: #FF9429;
            font-size: 20px;
            color: #FFFFFF;
        }
    }
}
</style>
