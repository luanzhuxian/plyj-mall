<template>
    <panel :title="panelTitle" @click="$router.push({ name: 'SecKillActivity' })">
        <ul :class="$style.list" v-if="data.values.length">
            <template v-for="(item, index) of data.values">
                <router-link
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="$style.listItem"
                    :key="index"
                    tag="li"
                    :to="{
                        name: 'Product',
                        params: { productId: item.goodsInfo.id },
                        query: { currentProductStatus: 3 }
                    }"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                        <div :class="$style.countdownWrapper">
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 0">距开始</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 1">距结束</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
                            <countdown
                                :class="$style.countdown"
                                v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                :duration="getDuration(item.goodsInfo.activityInfo)"
                                @finish="() => item.goodsInfo.activityInfo.status += 1"
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
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.current">
                            <img src="https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/msj.png" style="width: 8vw;" alt="">
                            <span :class="$style.price">{{ item.goodsInfo.activityInfo.activityPrice }}</span>
                        </div>
                        <div :class="$style.sub">
                            <div :class="$style.subLeft">
                                <div :class="$style.original">
                                    <span v-if="item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('originalPrice')">
                                        原价:<span :class="$style.price">{{ getPrice(item.goodsInfo.productSkuModels)('originalPrice') }}</span>
                                    </span>
                                </div>
                                <div :class="$style.progress">
                                    <div :class="$style.progressInner" :style="{ width: `${(Number(item.goodsInfo.activityInfo.number) - Number(item.goodsInfo.activityInfo.activityStock)) / Number(item.goodsInfo.activityInfo.number) * 100}%` }" />
                                </div>
                                <div :class="$style.saled" v-if="item.goodsInfo.activityInfo.status === 0">
                                    {{ `${item.goodsInfo.pageviews}人已关注` }}
                                </div>
                                <div :class="$style.saled" v-if="item.goodsInfo.activityInfo.status > 0 && item.goodsInfo.activityInfo.activityStock > 0">
                                    {{ `已抢${Number(item.goodsInfo.activityInfo.number) - Number(item.goodsInfo.activityInfo.activityStock)}件` }}
                                </div>
                                <div :class="$style.saled" v-if="item.goodsInfo.activityInfo.status > 0 && item.goodsInfo.activityInfo.activityStock === 0" style="color: #999999;">
                                    已抢完
                                </div>
                            </div>
                            <div
                                :class="{
                                    [$style.subRight]: true,
                                    [$style.disabled]: item.goodsInfo.activityInfo.status !== 1
                                }"
                            >
                                <pl-svg name="icon-vie-for" width="38" height="38" />
                            </div>
                        </div>
                    </div>
                </router-link>
            </template>
        </ul>
    </panel>
</template>

<script>
import Panel from './Panel.vue'
import Countdown from '../../../components/activity/Countdown.vue'
import { getPrice, getDuration } from '../helper'

export default {
    name: 'Miaosha',
    components: {
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
            panelTitle: {
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/xsms.png',
                width: 326,
                height: 80
            }
        }
    },
    methods: {
        getPrice,
        getDuration
    }
}
</script>

<style lang="scss" module>
.list-item {
    display: flex;
    box-sizing: border-box;
    margin-top: 20px;
    padding: 16px;
    width: 100%;
    background-color: #ffe701;
    border: 4px solid rgba(34, 34, 34, 1);
    border-radius: 20px;
    overflow: hidden;
    &:nth-of-type(1) {
        margin-top: 0;
    }
    .img-wrapper {
        position: relative;
        margin-right: 16px;
        width: 280px;
        height: 188px;
        border: 4px solid rgba(34, 34, 34, 1);
        border-radius: 12px;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .countdown-wrapper {
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
        position: relative;
        flex: 1;
        width: 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .main {
        font-size: 28px;
        font-weight: bold;
        line-height: 40px;
        color: #000;
        @include elps();
    }
    .current {
        margin-bottom: 2px;
        display: flex;
        align-items: baseline;
        color: #ff341b;
        @include elps();
        .price {
            flex: 1;
            width: 0;
            margin-left: 4px;
            font-size: 40px;
            font-family: San Francisco Display;
            font-weight: bold;
            @include elps();
            &:before {
                content: '￥';
                font-size: 24px;
                font-family: Microsoft YaHei;
                font-weight: bold;
            }
        }
    }
    .sub {
        display: flex;
        align-items: flex-end;
        &-left {
            flex: 1;
            width: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .original {
                display: flex;
                align-items: flex-end;
                margin-bottom: 14px;
                height: 32px;
                font-size: 20px;
                color: #f08918;
                @include elps();
                .price {
                    flex: 1;
                    width: 0;
                    font-family: San Francisco Display;
                    text-decoration: line-through;
                    @include elps();
                    &:before {
                        content: '￥';
                        font-family: Microsoft YaHei;
                    }
                }
            }
            .progress {
                width: 230px;
                height: 14px;
                background: #fff;
                border-radius: 206px;
                overflow: hidden;
                &-inner {
                    height: 14px;
                    background: #ff341b;
                    border-radius: 206px;
                }
            }
            .saled {
                font-size: 20px;
                font-weight: 600;
                color: #ff341b;
            }
        }
        &-right {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 72px;
            height: 72px;
            background: #ff341b;
            border-radius: 50%;
            overflow: hidden;
            color: #fff;
            &.disabled {
                background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
            }
        }
    }
}

</style>
