<template>
    <Panel custom-class="miaosha-panel" title="福利秒杀" subtitle="双十二福利来袭，限时秒杀" @click="$router.push({ name: 'SecondActivity' })">
        <ul :class="$style.miaoshaList" v-if="data.values.length">
            <template v-for="(item, index) of data.values">
                <router-link
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="$style.miaoshaListItem"
                    :key="index"
                    tag="li"
                    :to="{
                        name: 'Product',
                        params: { productId: item.goodsInfo.id },
                        query: { currentProductStatus: 3 }
                    }"
                >
                    <div :class="$style.miaoshaListItemBack">
                        <div :class="$style.miaoshaListItemFront">
                            <div :class="$style.imgWrapper">
                                <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                            </div>
                            <div :class="$style.info">
                                <div :class="$style.name">
                                    {{ item.goodsInfo.productName }}
                                </div>
                                <div :class="$style.middle">
                                    <label for="price">秒杀价:</label>
                                    <b :class="$style.price">{{ item.goodsInfo.activityInfo.activityPrice }}</b>
                                    <del :class="$style.original" v-if="item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('originalPrice')">
                                        {{ `原价:${getPrice(item.goodsInfo.productSkuModels)('originalPrice')}元` }}
                                    </del>
                                </div>

                                <div :class="$style.progress">
                                    <div :class="$style.progressInner" :style="{ width: `${(Number(item.goodsInfo.activityInfo.number) - Number(item.goodsInfo.activityInfo.activityStock)) / Number(item.goodsInfo.activityInfo.number) * 100}%` }" />
                                </div>
                                <div :class="$style.saled" v-if="item.goodsInfo.activityInfo.status === 0">
                                    {{ `${item.goodsInfo.pageviews}人已关注` }}
                                </div>
                                <div :class="$style.saled" v-if="item.goodsInfo.activityInfo.status > 0 && item.goodsInfo.activityInfo.activityStock > 0">
                                    {{ `已抢购${Number(item.goodsInfo.activityInfo.number) - Number(item.goodsInfo.activityInfo.activityStock)}件` }}
                                </div>
                                <div :class="$style.saled" v-if="item.goodsInfo.activityInfo.status > 0 && item.goodsInfo.activityInfo.activityStock === 0" style="color: #999999;">
                                    已抢完
                                </div>
                            </div>
                        </div>
                    </div>
                    <div :class="$style.miaoshaListItemBottom">
                        <div :class="$style.countdownWrapper">
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 0">距离活动开始还剩</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 1">距离活动结束还剩</span>
                            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
                            <Countdown
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
                            </Countdown>
                        </div>
                        <div :class="{
                            [$style.miaoshaListItemBtn]: true,
                            [$style.disabled]: item.goodsInfo.activityInfo.status !== 1
                        }">
                            <span>抢</span>
                        </div>
                    </div>
                </router-link>
            </template>
        </ul>
    </Panel>
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
        }
    },
    methods: {
        getPrice,
        getDuration
    }
}
</script>

<style lang="scss">
.miaosha-panel {
    .double-12-panel-container {
        background-color: #D00C03;
    }
}
</style>

<style lang="scss" module>
.miaosha {
    &-list-item {
        position: relative;
        box-sizing: border-box;
        margin-top: 40px;
        padding-top: 20px;
        height: 324px;
        &:nth-of-type(1) {
            margin-top: 0;
        }
        &-back {
            padding: 0 8px;
            height: 100%;
            background: #A76933;
            border-radius: 12px;
        }
        &-front {
            box-sizing: border-box;
            position: relative;
            top: -20px;
            display: flex;
            padding: 30px 12px;
            height: 100%;
            background: #FFEFCC;
            border-radius: 12px;
        }
        &-bottom {
            display: flex;
            align-items: flex-end;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 126px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/bar.png') no-repeat;
            background-size: 100%;
            box-sizing: border-box;
            padding: 0 24px 16px 28px;
            z-index: 1;
        }
        &-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 160px;
            height: 88px;
            background: linear-gradient(0deg, #EF1C1C 0%, #AA1C1C 100%);
            border: none;
            border-radius: 8px;
            font-size: 56px;
            color: #FFFFFF;
            &.disabled {
                background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
            }
            &::after {
                position: relative;
                top: 4px;
                content: '';
                margin-left: 16px;
                width: 22px;
                height: 34px;
                background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/thunder.png') no-repeat;
                background-size: 100%;
            }
        }
        .countdown-wrapper {
            display: flex;
            align-items: center;
            flex: 1;
            font-size: 20px;
            color: #BA9E61;
            padding-bottom: 8px;
            .text,
            .colon {
                display: inline-block;
                padding: 0 8px;
            }
            .block {
                display: inline-block;
                box-sizing: border-box;
                padding: 0 4px;
                width: 48px;
                line-height: 46px;
                background: #FFFFFF;
                font-size: 28px;
                font-family: Microsoft YaHei;
                font-weight: 600;
                color: #333333;
                text-align: center;
            }
        }
        .img-wrapper {
            margin-right: 14px;
            width: 240px;
            height: 160px;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .info {
            position: relative;
            flex: 1;
            width: 0;
            height: 160px;
            display: flex;
            flex-direction: column;
        }
        .name {
            margin-top: 8px;
            font-size: 28px;
            font-weight: bold;
            line-height: 40px;
            color: #333333;
            @include elps();
        }
        .middle {
            margin-top: 8px;
            display: flex;
            align-items: baseline;
            font-size: 28px;
            color: #A58B54;
            @include elps();
            .price {
                flex: 1;
                width: 0;
                margin-left: 4px;
                font-size: 40px;
                line-height: 54px;
                color: #D80000;
                @include elps();
                &:before {
                    content: '￥';
                    font-size: 32px;
                }
            }
            .original {
                font-size: 24px;
                @include elps();
            }
        }
        .progress {
            margin-top: auto;
            width: 240px;
            height: 8px;
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            &-inner {
                height: 8px;
                background: #D80000;
                border-radius: 20px;
            }
        }
        .saled {
            margin-top: 8px;
            font-size: 20px;
            color: #A58B54;
        }
    }
}

</style>
