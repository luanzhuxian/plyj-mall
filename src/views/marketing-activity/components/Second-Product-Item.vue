<template>
    <li
        :class="$style.itemMiaosha"
        @click="$router.push({ name: 'Product', params: { productId: data.goodsInfo.id }, query: { currentProductStatus: 3 } })"
    >
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
            <div :class="$style.countDownWrapper">
                <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 0">距开始</span>
                <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 1">距结束</span>
                <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 2">已结束</span>
                <countdown
                    :class="$style.countdown"
                    v-if="~[0, 1].indexOf(data.goodsInfo.activityInfo.status)"
                    :duration="getDuration(data.goodsInfo.activityInfo)"
                    @finish="() => data.goodsInfo.activityInfo.status += 1"
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
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.current">
                秒杀价
                <b :class="$style.price">{{ data.goodsInfo.activityInfo.activityPrice }}</b>
            </div>
            <div :class="$style.sub">
                <div :class="$style.subLeft">
                    <div :class="$style.original">
                        <span v-if="data.goodsInfo.productSkuModels && data.goodsInfo.productSkuModels.length && getPrice(data.goodsInfo.productSkuModels)('originalPrice')">
                            原价：<del>{{ getPrice(data.goodsInfo.productSkuModels)('originalPrice') }}</del>
                        </span>
                    </div>
                    <div :class="$style.progress">
                        <div :class="$style.progressInner" :style="{ width: `${(Number(data.goodsInfo.activityInfo.number) - Number(data.goodsInfo.activityInfo.activityStock)) / Number(data.goodsInfo.activityInfo.number) * 100}%` }" />
                    </div>
                    <div :class="$style.saled" v-if="data.goodsInfo.activityInfo.status === 0">
                        {{ `${data.goodsInfo.pageviews}人已关注` }}
                    </div>
                    <div :class="$style.saled" v-if="data.goodsInfo.activityInfo.status > 0 && data.goodsInfo.activityInfo.activityStock > 0">
                        {{ `已抢${Number(data.goodsInfo.activityInfo.number) - Number(data.goodsInfo.activityInfo.activityStock)}件` }}
                    </div>
                    <div :class="$style.saled" v-if="data.goodsInfo.activityInfo.status > 0 && data.goodsInfo.activityInfo.activityStock === 0" style="color: #999999;">
                        已抢完
                    </div>
                </div>
                <div
                    :class="{
                        [$style.subRight]: true,
                        [$style.disabled]: data.goodsInfo.activityInfo.status !== 1
                    }"
                >
                    <pl-svg name="icon-vie-for" width="32" height="32" />
                </div>
            </div>
        </div>
    </li>
</template>

<script>
import Countdown from '../../activity/components/Countdown.vue'
import { getPrice, getDuration } from '../../activity/helper'

export default {
    name: 'SecondProductItem',
    components: {
        Countdown
    },
    props: {
        data: {
            type: Object,
            default () {
                return { goodsInfo: {} }
            }
        }
    },
    data () {
        return {}
    },
    methods: {
        getPrice,
        getDuration
    }
}
</script>
<style lang="scss" module>
.item-miaosha {
    display: flex;
    box-sizing: border-box;
    margin-top: 20px;
    padding: 16px;
    width: 100%;
    height: 220px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    &:nth-of-type(1) {
        margin-top: 0;
    }
    .img-wrapper {
        position: relative;
        margin-right: 16px;
        width: 280px;
        height: 188px;
        border-radius: 12px;
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
        .countdown {
            display: inline-flex;
            justify-content: space-around;
            flex: 1;
        }
        .block {
            display: inline-block;
            box-sizing: border-box;
            padding: 0 4px;
            height: 36px;
            line-height: 36px;
            background: rgba(174, 174, 174, .64);
            border-radius: 4px;
        }
    }
    .info {
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        box-sizing: border-box;
        padding: 4px 0;
        flex: 1;
        width: 0;
    }
    .main {
        font-size: 28px;
        font-weight: bold;
        line-height: 32px;
        color: #000;
        @include elps();
    }
    .current {
        margin-top: auto;
        font-size: 24px;
        font-weight: bold;
        color: #fe7700;
        @include elps();
        .price {
            vertical-align: -2px;
            font-size: 32px;
            font-family: Microsoft YaHei;
            @include elps();
            &:before {
                content: '￥';
                font-size: 20px;
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
                font-size: 20px;
                color: #999;
                @include elps();
                > del {
                    &:before {
                        content: '￥';
                    }
                }
            }
            .progress {
                margin-top: 16px;
                width: 230px;
                height: 14px;
                background: #f9dfc8;
                border-radius: 206px;
                overflow: hidden;
                &-inner {
                    height: 100%;
                    background: #fe7700;
                    border-radius: 206px;
                }
            }
            .saled {
                font-size: 20px;
                font-weight: 600;
                color: #fe7700;
            }
        }
        &-right {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 58px;
            height: 58px;
            background: #fe7700;
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
