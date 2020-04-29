<template>
    <panel :title="panelTitle" @click="$router.push({ name: 'GroupActivity' })">
        <ul :class="$style.list" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <router-link
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :class="$style.listItem"
                    :key="i"
                    tag="li"
                    :to="{
                        name: 'Product',
                        params: { productId: item.goodsInfo.id },
                        query: { currentProductStatus: 2 }
                    }"
                >
                    <label>众志成团</label>
                    <div :class="$style.ribbon">
                        <span v-if="item.goodsInfo.activityInfo.status === 0">
                            {{ `${item.goodsInfo.pageviews}人关注` }}
                        </span>
                        <span v-else>
                            {{ `${item.goodsInfo.activityInfo.number}人参团` }}
                        </span>
                    </div>
                    <!-- <div :class="$style.countDownWrapper" v-if="item.goodsInfo.activityInfo.preActivity && item.goodsInfo.activityInfo.preActivity !== 0">
            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 0">距开始：</span>
            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 1">距结束：</span>
            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 2">已成功</span>
            <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 3">已结束</span>
            <count-down
              v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
              :timestamp="getTime(item.goodsInfo.activityInfo)"
              size="mini"
              color="#FF4B00"
              @done="() => reset(item)"
            />
          </div> -->
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.sub">
                            <div :class="$style.subLeft">
                                <span v-if="item.goodsInfo.activityInfo.prizePool">
                                    成团瓜分
                                </span>
                                <span v-else>龙门节有礼</span>
                            </div>
                            <div :class="$style.subRight" v-if="item.goodsInfo.activityInfo.prizePool">
                                {{ item.goodsInfo.activityInfo.prizePool }}
                            </div>
                        </div>
                        <div :class="$style.price">
                            <pl-svg name="icon-tgj-782d3" width="80" height="40" />
                            <b>{{ item.goodsInfo.activityInfo.activityPrice }}</b>
                        </div>
                    </div>
                </router-link>
            </template>
        </ul>
    </panel>
</template>

<script>
import Panel from './Panel.vue'
// import CountDown from '../../components/Count-Down.vue'
import { getTime, reset } from '../helper'

export default {
    name: 'Pintuan',
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
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/zzct.png',
                width: 326,
                height: 80
            }
        }
    },
    methods: {
        getTime,
        reset
    }
}
</script>

<style lang="scss" module>
.list-item {
    position: relative;
    display: flex;
    margin-top: 40px;
    background: #fff;
    border-radius: 20px;
    border: 4px solid #222;
    &:nth-of-type(1) {
        margin: 0;
    }
    label {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 112px;
        line-height: 34px;
        text-align: center;
        background: #ffe100;
        border-radius: 6px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 800;
        color: #00237a;
        border: 2px solid #222;
    }
    .ribbon {
        position: absolute;
        right: -18px;
        bottom: 10px;
        box-sizing: border-box;
        width: 146px;
        height: 56px;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/ribbon.png') no-repeat center;
        background-size: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 6px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        color: #00237a;
        @include elps();
    }
    .count-down-wrapper {
        position: absolute;
        top: -24px;
        right: -8px;
        width: 332px;
        line-height: 44px;
        text-align: center;
        background: #ffe701;
        border: 4px solid #222;
        border-radius: 20px 10px 10px 10px;
        box-shadow: 0 4px 8px #a02e09;
        color: #ff341b;
        font-size: 26px;
        font-family: Helvetica;
        font-weight: bold;
        @include elps();
    }
    .img-wrapper {
        width: 294px;
        height: 196px;
        border-radius: 20px;
        overflow: hidden;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .info {
        flex: 1;
        width: 0;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        padding: 0 12px 14px;
    }
    .main {
        font-size: 28px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 34px;
        color: #000;
        text-shadow: 0 2px 2px rgba(0, 0, 0, .16);
        @include elps();
    }
    .sub {
        display: inline-flex;
        align-items: center;
        text-align: center;
        margin-top: 10px;
        width: fit-content;
        max-width: 100%;
        height: 34px;
        line-height: 30px;
        border: 2px solid #ff331b;
        border-radius: 4px;
        @include elps();
        &-left {
            padding: 6px;
            min-width: 104px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #fff;
            background: #ff331b;
        }
        &-right {
            flex: 1;
            padding: 0 10px;
            font-size: 24px;
            background: #ffe701;
            color: #ff331b;
            @include elps();
        }
    }
    .price {
        display: flex;
        align-items: flex-end;
        margin-top: 18px;
        padding-right: 100px;
        > b {
            position: relative;
            top: 2px;
            margin-left: 4px;
            font-size: 36px;
            font-family: Helvetica;
            font-weight: bold;
            color: #ff331b;
            @include elps();
            &::before {
                content: '￥';
                font-size: 24px;
            }
        }
    }
}

</style>
