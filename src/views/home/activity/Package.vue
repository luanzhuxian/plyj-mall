<template>
    <div :class="$style.package">
        <router-link :class="$style.packageTitle" tag="div" :to="{ name: 'CoursePackage' }">
            <div :class="$style.packageTitleBtn">
                查看计划礼包
            </div>
        </router-link>
        <ul :class="$style.list" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.combinationDetailList && item.combinationDetailList.length"
                    :class="{
                        [$style.listItem]: true,
                        [$style.large]: i === 0 || data.values.length % 2 === 0,
                        [$style.small]: i !== 0 && data.values.length % 2 === 1
                    }"
                    :key="i"
                    @click="$router.push({
                        name: 'CoursePackage',
                        query: { activityId: item.combinationDetailList[0].id }
                    })"
                >
                    <div :class="$style.imgWrapper">
                        <img v-imgError :src="item.combinationDetailList[0].imageUrl">
                        <div :class="$style.countDownWrapper">
                            <span :class="$style.text" v-if="item.combinationDetailList[0].status === 0">距开始</span>
                            <span :class="$style.text" v-if="item.combinationDetailList[0].status === 1">距结束</span>
                            <span :class="$style.text" v-if="item.combinationDetailList[0].status === 2">已结束</span>
                            <countdown
                                :class="$style.countdown"
                                v-if="~[0, 1].indexOf(item.combinationDetailList[0].status)"
                                :duration="getDuration(item.combinationDetailList[0])"
                                @finish="() => item.combinationDetailList[0].status += 1"
                            >
                                <template v-slot="{time}">
                                    <i :class="$style.block">{{ String(time.days).padStart(2, '0') }}</i>
                                    <span :class="$style.colon">天</span>
                                    <i :class="$style.block">{{ String(time.hours).padStart(2, '0') }}</i>
                                    <span :class="$style.colon">:</span>
                                    <i :class="$style.block">{{ String(time.minutes).padStart(2, '0') }}</i>
                                    <span :class="$style.colon">:</span>
                                    <i :class="$style.block">{{ String(time.seconds).padStart(2, '0') }}</i>
                                </template>
                            </countdown>
                        </div>
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            {{ item.activityName }}
                        </div>
                        <div :class="$style.sub">
                            <div :class="$style.subLeft">
                                <div :class="$style.subLeftMain">
                                    <span v-if="~[1, 2].indexOf(item.combinationDetailList[0].status)">
                                        {{ `已有${item.combinationDetailList[0].salesVolume || 0}人参与` }}
                                    </span>
                                </div>
                                <div :class="$style.subLeftMiddle">
                                    原价<del>{{ `￥${item.combinationDetailList[0].totalPrice}` }}</del>
                                </div>
                                <div :class="$style.subLeftSub">
                                    组合价
                                    <b :class="$style.price">{{ item.combinationDetailList[0].discountTotalPrice }}</b>
                                </div>
                            </div>
                            <div
                                :class="{
                                    [$style.subRight]: true,
                                    [$style.disabled]: !item.combinationDetailList[0].stock || item.combinationDetailList[0].status !== 1
                                }"
                            >
                                <pl-svg name="icon-vie-for" width="32" />
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
import Countdown from '../../activity/components/Countdown.vue'
import { getDuration } from '../../activity/helper'

export default {
    name: 'Package',
    inject: ['parent'],
    components: {
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
        return {}
    },
    methods: {
        getDuration
        // reload (item) {
        //     // item.combinationDetailList[0].status += 1
        //     this.parent.getTemplate()
        // }
    }
}
</script>

<style module lang="scss">
.package {
    background: #fff8eb;
    border-radius: 20px;
    overflow: hidden;
    &-title {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        padding-top: 92px;
        height: 152px;
        background: url('https://mallcdn.youpenglai.com/static/mall/2.8.0/title-course-package.png') no-repeat center;
        background-size: 100%;
        &-btn {
            width: 222px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            background: #f2b036;
            border-radius: 280px;
            font-size: 24px;
            font-family: Microsoft YaHei;
            color: #fff;
        }
    }
    .list {
        padding: 30px 20px 40px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .list-item {
        display: flex;
        margin-top: 20px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
        &:nth-of-type(1) {
            margin-top: 0;
        }
        &.large {
            padding: 16px;
            width: 100%;
            .img-wrapper {
                margin-right: 16px;
                width: 280px;
                height: 188px;
                border-radius: 12px;
            }
            .info {
                flex: 1;
                width: 0;
                height: 188px;
                .sub {
                    &-left {
                        &-main {
                            font-size: 24px;
                        }
                    }
                    &-right {
                        width: 58px;
                        height: 58px;
                    }
                }
            }
        }
        &.small {
            flex-direction: column;
            width: 320px;
            .img-wrapper {
                height: 214px;
            }
            .info {
                padding: 12px;
                height: 196px;
                .sub {
                    &-left {
                        &-main {
                            font-size: 20px;
                        }
                    }
                    &-right {
                        width: 58px;
                        height: 58px;
                    }
                }
            }
        }
        .img-wrapper {
            position: relative;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .count-down-wrapper {
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 52px;
                font-size: 24px;
                background: rgba(0, 0, 0, .65);
                color: #fff;
            }
            .text {
                display: inline-block;
                width: 80px;
                text-align: center;
            }
            .countdown {
                display: inline-flex;
                justify-content: space-around;
                flex: 1;
            }
            .block {
                display: inline-block;
                box-sizing: border-box;
                text-align: center;
                // padding: 0 4px;
                min-width: 36px;
                height: 36px;
                line-height: 36px;
                background: rgba(174, 174, 174, .64);
                border-radius: 4px;
            }
        }
        .info {
            flex: 1;
            position: relative;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            box-sizing: border-box;
        }
        .main {
            margin-bottom: 8px;
            font-size: 28px;
            font-weight: bold;
            line-height: 32px;
            color: #000;
            @include elps();
        }
        .sub {
            display: flex;
            align-items: flex-end;
            margin-top: auto;
            &-left {
                flex: 1;
                width: 0;
                &-main {
                    font-weight: bold;
                    height: 36px;
                    line-height: 36px;
                    color: #999;
                    @include elps();
                }
                &-middle {
                    margin-top: 8px;
                    font-size: 20px;
                    font-family: Microsoft YaHei;
                    line-height: 36px;
                    color: #fe7700;
                }
                &-sub {
                    font-size: 24px;
                    font-weight: bold;
                    color: #fe7700;
                    @include elps();
                    .price {
                        vertical-align: -1px;
                        font-size: 32px;
                        @include elps();
                        &:before {
                            content: '￥';
                            font-size: 20px;
                        }
                    }
                }
            }
            &-right {
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #fe7700;
                border-radius: 50%;
                overflow: hidden;
                color: #fff;
                &.disabled {
                    background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
                }
            }
        }
    }
}

</style>
