<template>
    <li
        :class="$style.itemYugou"
        @click="$router.push({ name: 'Product', params: { productId: data.goodsInfo.id }, query: { currentProductStatus: 4 } })"
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
            <div :class="$style.rule">
                <span>{{ `预交定金￥${data.goodsInfo.activityInfo.price}` }}</span>
                <span v-if="data.goodsInfo.activityInfo.multiple && data.goodsInfo.activityInfo.multipleNumber > 1 && data.goodsInfo.activityInfo.activityPrice">{{ `抵￥${data.goodsInfo.activityInfo.activityPrice}` }}</span>
            </div>
            <div :class="$style.original">
                原价：<del>{{ getPrice(data.goodsInfo.productSkuModels)('originalPrice') }}</del>
            </div>
            <div :class="$style.price">
                预计到手价
                <b>{{ getTotalPrice(data) }}</b>
            </div>
        </div>
    </li>
</template>

<script>
import Countdown from '../../activity/components/Countdown.vue'
import { getDuration, getPrice, getTotalPrice } from '../../activity/helper'

export default {
    name: 'BookProductItem',
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
        getDuration,
        getPrice,
        getTotalPrice
    }
}
</script>
<style lang="scss" module>
.item-yugou {
    display: flex;
    box-sizing: border-box;
    margin-top: 20px;
    padding: 16px;
    width: 100%;
    height: 220px;
    background-color: #fff;
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
    .rule {
        margin-top: 14px;
        padding: 0 10px;
        width: max-content;
        max-width: 100%;
        line-height: 38px;
        background: #fbefd7;
        font-size: 20px;
        font-family: Microsoft YaHei;
        color: #7e6e4d;
        @include elps();
    }
    .original {
        margin-top: auto;
        font-size: 20px;
        color: #999;
        @include elps();
        > del {
            &:before {
                content: '￥';
            }
        }
    }
    .price {
        margin-top: 2px;
        vertical-align: -2px;
        font-size: 24px;
        font-weight: bold;
        color: #fe7700;
        @include elps();
        > b {
            margin-left: 4px;
            font-size: 32px;
            font-family: Microsoft YaHei;
            @include elps();
            &:before {
                content: '￥';
                font-size: 20px;
            }
        }
    }
}

</style>
