<template>
    <router-link
        v-if="data.goodsInfo && data.goodsInfo.activityInfo"
        :class="$style.pintuanItem"
        tag="li"
        :to="{
            name: 'Product',
            params: { productId: data.goodsInfo.id },
            query: { currentProductStatus: 2 }
        }"
    >
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
        </div>
        <div :class="$style.info">
            <div :class="$style.name">
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.price">
                <span>团购价</span>
                <b>{{ data.goodsInfo.activityInfo.activityPrice }}</b>
            </div>
            <div :class="$style.count">
                <span v-if="data.goodsInfo.activityInfo.status === 0">
                    {{ `${data.goodsInfo.pageviews}人` }}<i>关注</i>
                </span>
                <span v-else>
                    {{ `${data.goodsInfo.activityInfo.number}人` }}<i>参团</i>
                </span>
            </div>
            <div :class="$style.bar">
                <template v-if="data.goodsInfo.activityInfo.prizePool">
                    <b :class="$style.barLabel">
                        参团最高瓜分
                    </b>
                    <b :class="$style.barAmount">
                        {{ data.goodsInfo.activityInfo.prizePool }}元
                    </b>
                </template>
                <b :class="$style.barLabel" v-else>
                    超值团购 爱团才会赢
                </b>
                <div :class="$style.countdownWrapper">
                    <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 0">距开始：</span>
                    <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 1">距结束：</span>
                    <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 2">已成功</span>
                    <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 3">已结束</span>
                    <Countdown
                        v-if="~[0, 1].indexOf(data.goodsInfo.activityInfo.status)"
                        :duration="getDuration(data.goodsInfo.activityInfo)"
                        format="DD天HH:mm:ss"
                        @finish="() => reset(data)"
                    />
                </div>
            </div>
        </div>
    </router-link>
</template>

<script>
import Countdown from '../../../../components/activity/Countdown.vue'
import { getDuration, reset } from '../../helper'

export default {
    name: 'PintuanItem',
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
        reset
    }
}
</script>

<style lang="scss" module>
.pintuan-item {
    position: relative;
    display: flex;
    box-sizing: border-box;
    padding: 20px;
    height: 284px;
    background: #FFFBF1;
    border-radius: 8px;
    // &::after {
    //     content: '';
    //     position: absolute;
    //     top: 20px;
    //     right: 20px;
    //     width: 60px;
    //     height: 16px;
    //     background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/logo-mini.png') no-repeat center;
    //     background-size: 100%;
    //     z-index: 1;
    // }
    .img-wrapper {
        width: 240px;
        height: 160px;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .info {
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        flex: 1;
        margin-left: 14px;
        width: 0;
        height: 160px;
    }
    .name {
        margin-top: 18px;
        font-size: 28px;
        font-weight: bold;
        line-height: 38px;
        color: #333333;
        @include elps();
    }
    .price {
        display: flex;
        align-items: flex-end;
        margin-top: 8px;
        font-size: 28px;
        line-height: 38px;
        color: #333333;
        > b {
            font-size: 40px;
            color: #D80000;
            @include elps();
            &::before {
                content: '￥';
                margin-left: 10px;
                font-size: 32px;
            }
        }
    }
    .count {
        margin-top: auto;
        padding-right: 12px;
        text-align: right;
        font-size: 24px;
        line-height: 32px;
        color: #333333;
        i {
            color: #D80000;
        }
    }
    .bar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 40px 0 60px;
        height: 60px;
        background: linear-gradient(90deg, #FFD371 0%, #F78E13 100%);
        font-size: 28px;
        line-height: 38px;
        color: #FFFFFF;
        z-index: 1;
        &::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            right: -20px;
            width: 0;
            height: 0;
            border-top: 30px solid transparent;
            border-left: 21px solid #F78E13;
            border-right: 0 solid transparent;
            border-bottom: 30px solid transparent;
        }
        &-amount {
            box-sizing: border-box;
            margin-left: 8px;
            padding: 0 14px;
            height: 38px;
            background: #FFFFFF;
            font-size: 24px;
            color: #E51900;
            @include elps();
        }
    }
    .countdown-wrapper {
        margin-left: auto;
        min-width: 240px;
        font-size: 24px;
        line-height: 32px;
    }
}

</style>
