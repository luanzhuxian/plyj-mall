<template>
    <li
        :class="[ $style.itemPintuan, $style[size]]"
        @click="$router.push({ name: 'Product', params: { productId: data.goodsInfo.id }, query: { currentProductStatus: 2 } })"
    >
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage">
            <div :class="$style.countDownWrapper">
                <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 0">距开始</span>
                <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 1">距结束</span>
                <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 2">已成功</span>
                <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 3">已结束</span>
                <countdown
                    :class="$style.countdown"
                    v-if="~[0, 1].indexOf(data.goodsInfo.activityInfo.status)"
                    :duration="getDuration(data.goodsInfo.activityInfo)"
                    @finish="() => reset(data)"
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
            <div :class="$style.time" v-if="data.goodsInfo.activityInfo.prizePool">
                <div :class="$style.timeLeft">
                    成团瓜分
                </div>
                <div :class="$style.timeRight">
                    {{ `${data.goodsInfo.activityInfo.prizePool || 0}元` }}
                </div>
            </div>
            <div :class="$style.sub">
                <div :class="$style.subLeft">
                    <div :class="$style.subLeftMain">
                        <span v-if="data.goodsInfo.activityInfo.status === 0">
                            {{ `${data.goodsInfo.pageviews}人已关注` }}
                        </span>
                        <span v-else>
                            {{ `已有${data.goodsInfo.activityInfo.number || 0}人参与` }}
                        </span>
                    </div>
                    <div :class="$style.subLeftSub">
                        团购价
                        <b :class="$style.price">{{ data.goodsInfo.activityInfo.activityPrice }}</b>
                    </div>
                </div>
                <div
                    :class="{
                        [$style.subRight]: true,
                        [$style.disabled]: data.goodsInfo.activityInfo.status !== 1
                    }"
                >
                    <pl-svg name="icon-vie-for" :width="size === 'large' ? 40 : 32" />
                </div>
            </div>
        </div>
    </li>
</template>

<script>
import Countdown from '../../activity/components/Countdown.vue'
import { getDuration, reset } from '../../activity/helper'

export default {
    name: 'GroupProductItem',
    components: {
        Countdown
    },
    props: {
        data: {
            type: Object,
            default () {
                return { goodsInfo: {} }
            }
        },
        size: {
            type: String,
            default: 'small',
            validator: val => ~['small', 'large', 'long'].indexOf(val)
        }
    },
    data () {
        return {}
    },
    methods: {
        getDuration,
        reset
    }
}
</script>
<style lang="scss" module>
.item-pintuan {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    margin-top: 20px;
    width: 320px;
    height: 410px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
    &.large {
        margin-top: 0;
        width: 100%;
        height: 636px;
        .img-wrapper {
            width: 100%;
            height: 444px;
        }
        .count-down-wrapper {
            display: flex;
            justify-content: center;
            height: 80px;
            font-size: 32px;
            .text {
                display: inline-block;
                width: auto;
                text-align: center;
            }
            .countdown {
                justify-content: center;
                flex: none;
            }
            .block {
                margin: 0 8px;
                padding: 0 6px;
                height: 40px;
                line-height: 40px;
            }
        }
        .info {
            padding-bottom: 20px;
            .sub {
                &-right {
                    width: 78px;
                    height: 78px;
                }
            }
        }
    }
    &.long {
        display: flex;
        flex-direction: row;
        padding: 10px;
        width: 100%;
        height: 208px;
        :nth-of-type(1) {
            margin-top: 0;
        }
        .img-wrapper {
            margin-right: 16px;
            width: 280px;
            height: 100%;
            border-radius: 12px;
        }
        .info {
            padding: 4px 0;
            flex: 1;
            width: 0;
            height: 100%;
            .main {
                font-size: 26px;
                line-height: 32px;
            }
            .time {
                margin-top: 18px;
            }
        }
    }
    .img-wrapper {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 214px;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
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
        .text {
            width: auto;
            padding: 0 4px;
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
        padding: 12px 16px;
        flex: 1;
        height: 0;
    }
    .main {
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
        margin-top: 12px;
        width: fit-content;
        max-width: 100%;
        height: 38px;
        line-height: 38px;
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
            background: #fff48e;
            color: #ff772b;
            @include elps();
        }
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
                font-size: 20px;
                color: #999;
                @include elps();
            }
            &-sub {
                font-size: 24px;
                font-weight: bold;
                color: #fe7700;
                @include elps();
                .price {
                    vertical-align: -2px;
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
            width: 58px;
            height: 58px;
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

</style>
