<template>
    <router-link
        v-if="data.goodsInfo && data.goodsInfo.activityInfo"
        :class="$style.yugouItemLarge"
        tag="li"
        :to="{
            name: 'Product',
            params: { productId: data.goodsInfo.id },
            query: { currentProductStatus: 4 }
        }"
    >
        <div :class="$style.imgWrapper" class="img-wrapper">
            <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
            <div :class="$style.bar">
                <div :class="$style.rule">
                    <b v-if="data.goodsInfo.activityInfo.multiple && data.goodsInfo.activityInfo.multipleNumber > 1 && data.goodsInfo.activityInfo.activityPrice">{{ `定金${Number(data.goodsInfo.activityInfo.price)}元 抵${Number(data.goodsInfo.activityInfo.activityPrice)}元` }}</b>
                    <b v-else>{{ `预交定金${Number(data.goodsInfo.activityInfo.price)}元` }}</b>
                </div>
                <div :class="$style.countdownWrapper">
                    <span v-if="data.goodsInfo.activityInfo.status === 0">距开始：</span>
                    <span v-if="data.goodsInfo.activityInfo.status === 1">距结束：</span>
                    <span v-if="data.goodsInfo.activityInfo.status === 2">已结束</span>
                    <Countdown
                        v-if="~[0, 1].indexOf(data.goodsInfo.activityInfo.status)"
                        :duration="getDuration(data.goodsInfo.activityInfo)"
                        format="DD天HH:mm:ss"
                        @finish="() => data.goodsInfo.activityInfo.status += 1"
                    />
                </div>
            </div>
        </div>
        <div :class="$style.info">
            <div :class="$style.name">
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.sub">
                <div :class="$style.price">
                    到手价：<b>{{ getTotalPrice(data) }}</b>
                </div>
                <del :class="$style.original">{{ `现价：¥${data.goodsInfo.activityInfo.skuPrice}` }}</del>
                <span :class="$style.count">{{ `${data.goodsInfo.activityInfo.number}人预交` }}</span>
            </div>
        </div>
    </router-link>
</template>

<script>
import Countdown from '../../../../components/activity/Countdown.vue'
import { getDuration, getTotalPrice } from '../../helper'

export default {
    name: 'YugouItemLarge',
    components: {
        Countdown
    },
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    methods: {
        getDuration,
        getTotalPrice
    }
}
</script>

<style lang="scss" module>
.yugou-item-large {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    height: 580px;
    background: #ffffff;
    border-radius: 40px;
    .img-wrapper {
        position: relative;
        width: 100%;
        height: 426px;
        border-radius: 40px 40px 0 0;
        &::before {
            content: '';
            position: absolute;
            top: -8px;
            left: 20px;
            box-sizing: border-box;
            padding: 12px 20px 0 0;
            width: 136px;
            height: 76px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/ribbon.png') no-repeat center;
            background-size: 100%;
        }
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 40px 40px 0 0;
    }
    .bar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 64px;
        background: rgba(0, 0, 0, .6);
        z-index: 1;
    }
    .rule {
        position: absolute;
        left: 0;
        bottom: 0;
        box-sizing: border-box;
        padding: 0 20px;
        max-width: 350px;
        line-height: 70px;
        text-align: center;
        background: linear-gradient(180deg, #FFEB12 0%, #FFC26F 100%);
        z-index: 2;
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: -24px;
            width: 25px;
            height: 76px;
            background: linear-gradient(-105deg, transparent 24px, #FFEB12 26px, #FFC26F 100%);
        }
        > b {
            display: block;
            font-size: 32px;
            color: #D00C06;
            @include elps();
        }
    }
    .countdown-wrapper {
        padding: 0 20px;
        font-size: 24px;
        color: #FFFFFF;
    }
    .info {
        flex: 1;
        padding: 12px 20px;
        .name {
            font-size: 32px;
            font-family: Microsoft YaHei;
            font-weight: 600;
            color: #000;
            @include elps();
        }
        .sub {
            display: flex;
            align-items: baseline;
            margin-top: 1px;
            font-size: 24px;
            @include elps();
        }
        .price {
            font-family: Microsoft YaHei;
            font-weight: 600;
            color: #D00C06;
            @include elps();
            > b {
                font-size: 36px;
                &::before {
                    content: '￥';
                    font-size: 24px;;
                }
            }
        }
        .original {
            margin-left: 26px;
            font-size: 24px;
            color: #999999;
        }
        .count {
            margin-left: auto;
            color: #333333;
        }
    }
}

</style>
