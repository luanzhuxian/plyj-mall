<template>
    <panel custom-class="miaosha-panel" :title="panelTitle">
        <ul class="miaosha-list" v-if="data.values.length">
            <template v-for="(item, index) of data.values">
                <li
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    class="miaosha-list-item"
                    :key="index"
                >
                    <div class="img-wrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                        <!-- <div class="count-down-wrapper">
                  <span class="text" v-if="item.activityInfo.status === 0">距开始</span>
                  <span class="text" v-if="item.activityInfo.status === 1">距结束</span>
                  <span class="text" v-if="item.activityInfo.status === 2">已结束</span>
                  <count-down
                    v-if="~[0, 1].indexOf(item.activityInfo.status)"
                    :timestamp="getTime(item.activityInfo)"
                    format="HH:mm"
                    background="rgba(174, 174, 174, 0.64)"
                    @done="() => item.activityInfo.status += 1"
                  />
                </div> -->
                    </div>
                    <div class="info">
                        <div class="main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div class="current">
                            <pl-svg name="icon-msj-cfc78" width="30" height="19" />
                            <span class="price">
                                {{ item.goodsInfo.activityInfo.activityPrice }}
                            </span>
                        </div>
                        <div class="sub">
                            <div class="sub-left">
                                <div class="original">
                                    <span v-if="item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('originalPrice')">
                                        原价:<span class="price">{{ getPrice(item.goodsInfo.productSkuModels)('originalPrice') }}</span>
                                    </span>
                                </div>
                                <div class="progress">
                                    <div class="progress-inner" :style="{ width: `${(Number(item.goodsInfo.activityInfo.number) - Number(item.goodsInfo.activityInfo.activityStock)) / Number(item.goodsInfo.activityInfo.number) * 100}%` }" />
                                </div>
                                <div class="saled" v-if="item.goodsInfo.activityInfo.status === 0">
                                    {{ `${item.goodsInfo.pageviews}人已关注` }}
                                </div>
                                <div class="saled" v-if="item.goodsInfo.activityInfo.status > 0 && item.goodsInfo.activityInfo.activityStock > 0">
                                    {{ `已抢${Number(item.goodsInfo.activityInfo.number) - Number(item.goodsInfo.activityInfo.activityStock)}件` }}
                                </div>
                                <div class="saled" v-if="item.goodsInfo.activityInfo.status > 0 && item.goodsInfo.activityInfo.activityStock === 0" style="color: #999999;">
                                    已抢完
                                </div>
                            </div>
                            <div class="sub-right" :class="{ disabled: item.goodsInfo.activityInfo.status !== 1 }">
                                <pl-svg name="icon-qiang-817ca" width="19" height="19" />
                            </div>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
        <ul class="miaosha-list" v-else>
            <li class="miaosha-list-item" v-for="(item, i) of 2" :key="i">
                <div class="img-wrapper">
                    <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/default.png" alt="">
                    <div class="count-down-wrapper">
                        <span class="text">距开始</span>
                        <span class="num">23</span>:
                        <span class="num">59</span>:
                        <span class="num">59</span>
                    </div>
                </div>
                <div class="info">
                    <div class="main">
                        神奇的逻辑思维游戏畅销书
                    </div>
                    <div class="current">
                        <pl-svg name="icon-msj-cfc78" width="30" height="19" />
                        <span class="price">10000</span>
                    </div>
                    <div class="sub">
                        <div class="sub-left">
                            <div class="original">
                                原价:
                                <span class="price">15000</span>
                            </div>
                            <div class="progress">
                                <div class="progress-inner" :style="{ width: '50%' }" />
                            </div>
                            <div class="saled">
                                已抢40件
                            </div>
                        </div>
                        <div class="sub-right">
                            <pl-svg name="icon-qiang-817ca" width="19" height="19" />
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </panel>
</template>

<script>
import Panel from './Panel.vue'
// import CountDown from '../../components/Count-Down.vue'
import { getPrice, getTime } from '../../utils/helper'

export default {
    name: 'Miaosha',
    components: {
        Panel
    // CountDown
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
                name: 'icon-xsms-f0986',
                width: 163,
                height: 40
            }
        }
    },
    methods: {
        getPrice,
        getTime
    // getTimeStatus ([start, end]) {
    //   let msg = ''
    //   const timestamp = this.timestamp || Date.now()
    //   const startTs = moment(start).valueOf()
    //   const endTs = moment(end).valueOf()
    //   if (timestamp < startTs) msg = '未开始'
    //   if (timestamp >= startTs && timestamp < endTs) msg = '进行中'
    //   if (timestamp >= endTs) msg = '已结束'
    //   return msg
    // }
    }
}
</script>

<style scoped lang="scss">
.miaosha {
    &-list-item {
        display: flex;
        margin-bottom: 10px;
        padding: 8px;
        width: 100%;
        background-color: #ffe701;
        border-radius: 10px;
        overflow: hidden;
        &:nth-last-of-type(1) {
            margin-bottom: 0;
        }
        .img-wrapper {
            position: relative;
            margin-right: 8px;
            width: 140px;
            height: 94px;
            border-radius: 6px;
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
                line-height: 18px;
                background: rgba(0, 0, 0, .65);
                color: #fff;
                padding: 4px 0;
            }
            .text {
                margin-right: 5px;
            }
            .num {
                box-sizing: border-box;
                margin: 0 2.5px;
                padding: 2px;
                height: 18px;
                line-height: 16px;
                background: rgba(174, 174, 174, .64);
                border-radius: 2px;
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
            font-size: 14px;
            font-weight: bold;
            line-height: 20px;
            color: #000;
            @include elps();
        }
        .current {
            margin-bottom: 1px;
            display: flex;
            align-items: flex-end;
            color: #ff341b;
            @include elps();
            .price {
                flex: 1;
                width: 0;
                margin-left: 2px;
                font-size: 20px;
                font-family: San Francisco Display;
                font-weight: bold;
                @include elps();
                &:before {
                    content: '￥';
                    font-size: 12px;
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
                    margin-bottom: 7px;
                    height: 16px;
                    font-size: 10px;
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
                    width: 115px;
                    height: 7px;
                    background: #fff;
                    border-radius: 103px;
                    overflow: hidden;
                    &-inner {
                        height: 7px;
                        background: #ff341b;
                        border-radius: 103px;
                    }
                }
                .saled {
                    font-size: 10px;
                    font-weight: 600;
                    color: #ff341b;
                }
            }
            &-right {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 36px;
                height: 36px;
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
}

</style>
