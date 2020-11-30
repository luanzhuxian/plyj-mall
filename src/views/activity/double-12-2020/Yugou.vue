<template>
    <Panel custom-class="yugou-panel" title="定金翻翻翻" subtitle="双十二特惠大礼来袭，定金翻倍享不停" @click="$router.push({ name: 'BookActivity' })">
        <ul :class="$style.yugouList" v-if="data.values.length">
            <router-link
                v-if="isOdd"
                :class="[$style.yugouListItem, $style.large]"
                tag="li"
                :to="{
                    name: 'Product',
                    params: { productId: first.goodsInfo.id },
                    query: { currentProductStatus: 4 }
                }"
            >
                <div :class="$style.imgWrapper">
                    <img :src="first.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    <div :class="$style.bar">
                        <div :class="$style.rule">
                            <b v-if="first.goodsInfo.activityInfo.multiple && first.goodsInfo.activityInfo.multipleNumber > 1 && first.goodsInfo.activityInfo.activityPrice">{{ `定金${first.goodsInfo.activityInfo.price}元 抵${first.goodsInfo.activityInfo.activityPrice}元` }}</b>
                            <b v-else>{{ `预交定金${first.goodsInfo.activityInfo.price}元` }}</b>
                        </div>
                        <div :class="$style.countdownWrapper">
                            <span v-if="first.goodsInfo.activityInfo.status === 0">距开始：</span>
                            <span v-if="first.goodsInfo.activityInfo.status === 1">距结束：</span>
                            <span v-if="first.goodsInfo.activityInfo.status === 2">已结束</span>
                            <Countdown
                                v-if="~[0, 1].indexOf(first.goodsInfo.activityInfo.status)"
                                :duration="getDuration(first.goodsInfo.activityInfo)"
                                format="DD天HH:mm:ss"
                                @finish="() => first.goodsInfo.activityInfo.status += 1"
                            />
                        </div>
                    </div>
                </div>
                <div :class="$style.info">
                    <div :class="$style.name">
                        {{ first.goodsInfo.productName }}
                    </div>
                    <div :class="$style.sub">
                        <div :class="$style.price">
                            到手价：<b>{{ getTotalPrice(first) }}</b>
                        </div>
                        <del :class="$style.original">{{ `现价：¥${getPrice(first.goodsInfo.productSkuModels)('price')}` }}</del>
                        <span :class="$style.count">{{ `${first.goodsInfo.activityInfo.number}人预交` }}</span>
                    </div>
                </div>
            </router-link>
            <template v-for="(item, i) of (isOdd ? rest : data.values)">
                <router-link
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="{
                        [$style.yugouListItem]: true,
                        [$style.small]: true,
                        [$style.marginT0]: !isOdd && (i === 0 || i === 1)
                    }"
                    :key="i"
                    tag="li"
                    :to="{
                        name: 'Product',
                        params: { productId: item.goodsInfo.id },
                        query: { currentProductStatus: 4 }
                    }"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    </div>
                    <div :class="$style.bar">
                        <div :class="$style.rule">
                            <b v-if="item.goodsInfo.activityInfo.multiple && item.goodsInfo.activityInfo.multipleNumber > 1 && item.goodsInfo.activityInfo.activityPrice">{{ `定金${item.goodsInfo.activityInfo.price}元 抵${item.goodsInfo.activityInfo.activityPrice}元` }}</b>
                            <b v-else>{{ `预交定金${item.goodsInfo.activityInfo.price}元` }}</b>
                        </div>
                        <div :class="$style.countdownWrapper">
                            <span v-if="item.goodsInfo.activityInfo.status === 0">距开始：</span>
                            <span v-if="item.goodsInfo.activityInfo.status === 1">距结束：</span>
                            <span v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
                            <Countdown
                                v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                :duration="getDuration(item.goodsInfo.activityInfo)"
                                format="DD天HH:mm:ss"
                                @finish="() => item.goodsInfo.activityInfo.status += 1"
                            />
                        </div>
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.name">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.price">
                            到手价：<b>{{ getTotalPrice(item) }}</b>
                        </div>
                        <div :class="$style.sub">
                            <del :class="$style.original">{{ `现价 ¥${getPrice(item.goodsInfo.productSkuModels)('price')}` }}</del>
                            <span :class="$style.count">{{ `${item.goodsInfo.activityInfo.number}人预交` }}</span>
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
import { getDuration, getTotalPrice, getPrice } from '../helper'

export default {
    name: 'Yugou',
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
    computed: {
        isOdd () {
            return !!(this.data.values.length % 2)
        },
        first () {
            return this.data.values[0]
        },
        rest () {
            return this.data.values.slice(1)
        }
    },
    data () {
        return {}
    },
    methods: {
        getDuration,
        getTotalPrice,
        getPrice
    }
}
</script>

<style lang="scss">
.yugou-panel {
    .double-12-panel-container {
        background-color: #F16F00;
        padding: 40px 44px;
    }
}
</style>
<style lang="scss" module>
.yugou {
    &-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
            &.large {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                padding: 10px;
                width: 100%;
                height: 580px;
                margin-top: 0;
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
             &.small {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                width: 312px;
                height: 464px;
                margin-top: 40px;
                background: #ffffff;
                border-radius: 20px;
                &.margin-t-0 {
                    margin-top: 0;
                }
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
        }
    }
}

</style>
