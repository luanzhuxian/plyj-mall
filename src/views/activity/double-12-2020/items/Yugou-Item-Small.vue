<template>
    <router-link
        v-if="data.goodsInfo && data.goodsInfo.activityInfo"
        :class="$style.yugouItemSmall"
        tag="li"
        :to="{
            name: 'Product',
            params: { productId: data.goodsInfo.id },
            query: { currentProductStatus: 4 }
        }"
    >
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
        </div>
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
        <div :class="$style.info">
            <div :class="$style.name">
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.price">
                到手价：<b>{{ getTotalPrice(data) }}</b>
            </div>
            <div :class="$style.sub">
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
    name: 'YugouItemSmall',
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
.yugou-item-small {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 312px;
    height: 464px;
    background: #ffffff;
    border-radius: 20px;
    .img-wrapper {
        position: relative;
        box-sizing: border-box;
        padding: 4px 4px 0;
        width: 100%;
        height: 212px;
        border-radius: 20px 20px 0 0;
        overflow: hidden;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px 20px 0 0;
    }
    .bar {
        position: relative;
        box-sizing: border-box;
        padding: 54px 0px 4px;
        height: 86px;
        background: rgba(0, 0, 0, .6);
    }
    .rule {
        position: absolute;
        left: 0;
        top: -6px;
        box-sizing: border-box;
        padding: 0 10px;
        width: 270px;
        line-height: 60px;
        text-align: center;
        background: linear-gradient(180deg, #FFEB12 0%, #FFC26F 100%);
        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: -24px;
            width: 25px;
            height: 68px;
            background: linear-gradient(-105deg, transparent 24px, #FFEB12 26px, #FFC26F 100%);
        }
        > b {
            display: block;
            font-size: 24px;
            color: #D00C06;
            @include elps();
        }
    }
    .countdown-wrapper {
        padding-left: 26px;
        line-height: 32px;
        font-size: 20px;
        color: #FFFFFF;
    }
    .info {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 26px 18px 22px;
        .name {
            font-family: Microsoft YaHei;
            font-weight: 600;
            font-size: 24px;
            color: #000;
            @include elps();
        }
        .price {
            margin-top: 2px;
            font-family: Microsoft YaHei;
            font-weight: 600;
            font-size: 24px;
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
        .sub {
            margin-top: auto;
            display: flex;
            align-items: center;
            font-size: 24px;
            @include elps();
        }
        .original {
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
