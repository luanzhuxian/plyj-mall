<template>
    <div :class="$style.pintuan">
        <div :class="$style.pintuanTitle">
            <div :class="$style.pintuanTitleBtn">
                查看更多团购
            </div>
        </div>
        <ul :class="$style.list" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="{
                        [$style.listItem]: true,
                        [$style.large]: i === 0 || data.values.length % 2 === 0,
                        [$style.small]: i !== 0 && data.values.length % 2 === 1
                    }"
                    :key="i"
                    @click="$router.push({ name: 'Product', params: { productId: item.goodsInfo.id }, query: { currentProductStatus: 2 } })"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                        <div :class="$style.countDownWrapper" v-if="item.goodsInfo.activityInfo.preActivity && item.goodsInfo.activityInfo.preActivity !== 0">
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 0">距开始</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 1">距结束</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 2">已成功</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 3">已结束</span>
                            <count-down
                                v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                :timestamp="getTime(item.goodsInfo.activityInfo)"
                                format="HH:mm"
                                background="rgba(174, 174, 174, 0.64)"
                                @done="() => reset(item)"
                            />
                        </div>
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.time">
                            <div :class="$style.timeLeft">
                                <span v-if="item.goodsInfo.activityInfo.prizePool">
                                    成团瓜分
                                </span>
                                <span v-else>年年翻有礼</span>
                            </div>
                            <div :class="$style.timeRight" v-if="item.goodsInfo.activityInfo.prizePool">
                                {{ `${item.goodsInfo.activityInfo.prizePool || 0}元` }}
                            </div>
                        </div>
                        <div :class="$style.sub">
                            <div :class="$style.subLeft">
                                <div :class="$style.subLeftMain">
                                    <span v-if="item.goodsInfo.activityInfo.status === 0">
                                        {{ `${item.goodsInfo.pageviews}人已关注` }}
                                    </span>
                                    <span v-else>
                                        {{ `已有${item.goodsInfo.activityInfo.number || 0}人参与` }}
                                    </span>
                                </div>
                                <div :class="$style.subLeftSub">
                                    团购价
                                    <span :class="$style.price">{{ item.goodsInfo.activityInfo.activityPrice }}</span>
                                </div>
                            </div>
                            <div
                                :class="{
                                    [$style.subRight]: true,
                                    [$style.disabled]: item.goodsInfo.activityInfo.status !== 1
                                }"
                            >
                                <pl-svg
                                    v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                    name="icon-vie-for"
                                    :width="(i === 0 || data.values.length % 2 === 0) ? 40 : 32"
                                />
                                <pl-svg
                                    v-else
                                    name="icon-jieshu"
                                    :width="(i === 0 || data.values.length % 2 === 0) ? 46 : 38"
                                />
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
import CountDown from '../components/Count-Down.vue'
import { getTime, reset } from '../helper.js'

export default {
    name: 'Pintuan',
    components: {
        CountDown
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
        getTime,
        reset
    }
}
</script>

<style module lang="scss">
.pintuan {
    background: #fff8eb;
    border-radius: 20px;
    overflow: hidden;
    &-title {
        display: flex;
        justify-content: center;
        padding-top: 92px;
        height: 152px;
        background: url('https://mallcdn.youpenglai.com/static/mall/2.8.0/title-tuan-gou.png') no-repeat center;
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
                        width: 72px;
                        height: 72px;
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
                        // .qiang {
                        //   width: 32px;
                        // }
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
                justify-content: center;
                align-items: center;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                line-height: 36px;
                font-size: 24px;
                background: rgba(0, 0, 0, .65);
                color: #fff;
                padding: 8px 0;
            }
            .text {
                margin-right: 10px;
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
        .time {
            display: inline-flex;
            align-items: center;
            text-align: center;
            margin-bottom: 18px;
            width: fit-content;
            max-width: 100%;
            max-width: 100%;
            height: 34px;
            line-height: 35px;
            border: 2px solid #ff772b;
            border-radius: 4px;
            @include elps();
            &-left {
                padding: 6px;
                min-width: 105px;
                font-size: 24px;
                color: #fff;
                background: #ff772b;
                overflow: hidden;
            }
            &-right {
                flex: 1;
                padding: 0 10px;
                font-size: 24px;
                font-family: San Francisco Display;
                background: #ff0;
                color: #ff772b;
                @include elps();
            }
        }
        .sub {
            display: flex;
            align-items: flex-end;
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
                &-sub {
                    display: flex;
                    align-items: flex-end;
                    font-size: 28px;
                    font-weight: bold;
                    color: #fe7700;
                    @include elps();
                    .price {
                        flex: 1;
                        width: 0;
                        margin-left: 4px;
                        font-size: 32px;
                        font-family: San Francisco Display;
                        font-weight: bold;
                        @include elps();
                        &:before {
                            content: '￥';
                            font-size: 20px;
                            font-family: Microsoft YaHei;
                            font-weight: bold;
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
