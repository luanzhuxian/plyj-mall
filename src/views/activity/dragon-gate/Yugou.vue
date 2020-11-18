<template>
    <panel :title="panelTitle" @click="$router.push({ name: 'BookActivity' })">
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
                        query: { currentProductStatus: 4 }
                    }"
                >
                    <div :class="$style.countdownWrapper">
                        <span v-if="item.goodsInfo.activityInfo.status === 0">距开始：</span>
                        <span v-if="item.goodsInfo.activityInfo.status === 1">距结束：</span>
                        <span v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
                        <countdown
                            v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                            :duration="getDuration(item.goodsInfo.activityInfo)"
                            format="DD天HH:mm:ss"
                            @finish="() => item.goodsInfo.activityInfo.status += 1"
                        />
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.sub">
                            <span>{{ `预交定金￥${item.goodsInfo.activityInfo.price}` }}</span>
                            <span v-if="item.goodsInfo.activityInfo.multiple && item.goodsInfo.activityInfo.multipleNumber > 1 && item.goodsInfo.activityInfo.activityPrice">{{ `抵￥${item.goodsInfo.activityInfo.activityPrice}` }}</span>
                        </div>
                        <div :class="$style.price">
                            {{ `预售到手价：${getTotalPrice(item)}元` }}
                        </div>
                    </div>
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    </div>
                </router-link>
            </template>
        </ul>
    </panel>
</template>

<script>
import Panel from './Panel.vue'
import Countdown from '../components/Countdown.vue'
import { getDuration, getTotalPrice } from '../helper'

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
    data () {
        return {
            panelTitle: {
                name: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/ygxfb.png',
                width: 368,
                height: 80
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
.list-item {
    position: relative;
    display: flex;
    margin-top: 40px;
    background: #ba95ff;
    border: 4px solid #222;
    border-radius: 20px;
    &:nth-of-type(1) {
        margin: 0;
    }
    .countdown-wrapper {
        position: absolute;
        top: -20px;
        left: 18px;
        width: 324px;
        line-height: 48px;
        text-align: center;
        background: #ffe701;
        border: 4px solid #222;
        border-radius: 10px;
        color: #ff341b;
        font-size: 26px;
        font-weight: bold;
        @include elps();
    }
    .info {
        flex: 1;
        width: 0;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        padding: 0 16px 16px;
        color: #fff;
    }
    .main {
        font-size: 28px;
        font-weight: bold;
        line-height: 36px;
        color: #00237a;
        @include elps();
    }
    .sub {
        margin-top: 4px;
        padding: 0 12px;
        height: 52px;
        line-height: 52px;
        background: #8c4cff;
        font-size: 24px;
        font-family: San Francisco Display;
        font-weight: bold;
        text-align: center;
        @include elps();
    }
    .price {
        margin-top: 12px;
        font-size: 24px;
        font-family: Microsoft YaHei;
        @include elps();
    }
    .img-wrapper {
        width: 300px;
        height: 200px;
        border-radius: 100px 20px 20px 100px;
        overflow: hidden;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

</style>
