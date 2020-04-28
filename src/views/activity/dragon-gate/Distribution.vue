<template>
    <panel :custom-class="$style.distributionPanel" :title="panelTitle" @click="$router.push({ name: 'HelperActivity' })">
        <ul :class="$style.list" v-if="data.values.length">
            <template v-for="(item, index) of data.values">
                <router-link
                    v-if="item.goodsInfo"
                    :class="$style.listItem"
                    :key="index"
                    tag="li"
                    :to="{
                        name: (item.goodsInfo.type === 2) ? 'Curriculum' : 'Product',
                        params: { productId: item.goodsInfo.productId }
                    }"
                >
                    <div :class="$style.imgWrapper">
                        <label>{{ item.definiteType }}</label>
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.main">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.sub">
                            {{ `分享购买成功后获得润笔 ¥${item.goodsInfo.rebate}` }}
                        </div>
                        <div :class="$style.bottom">
                            <b :class="$style.price">{{ item.goodsInfo.price }}</b>
                            <del :class="$style.original">{{ item.goodsInfo.originPrice }}</del>
                            <pl-svg name="icon-fenxiang-yellow-5ba8f" width="120" height="58" />
                        </div>
                    </div>
                </router-link>
            </template>
        </ul>
    </panel>
</template>

<script>
import Panel from './Panel.vue'

export default {
    name: 'Distribution',
    components: {
        Panel
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
                name: 'icon-qmlfx-f2ec1',
                width: 368,
                height: 80
            }
        }
    }
}
</script>

<style lang="scss" module>
.distribution-panel {
    padding-top: 60px;
    background: #01237a;
    > button {
        margin-top: 28px;
    }
}
.list-item {
    display: flex;
    padding: 20px 0;
    width: 100%;
    border-top: 2px dashed rgba(64, 118, 204, .5);
    &:nth-of-type(1) {
        border: none;
    }
    .img-wrapper {
        position: relative;
        margin-right: 20px;
        width: 240px;
        height: 160px;
        border-radius: 12px;
        overflow: hidden;
        label {
            position: absolute;
            top: 12px;
            left: 12px;
            width: 112px;
            line-height: 34px;
            text-align: center;
            background: #ffe100;
            border: 2px solid #222;
            border-radius: 6px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #00237a;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .info {
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex: 1;
        width: 0;
        padding: 8px 0;
    }
    .main {
        font-size: 36px;
        font-weight: bold;
        color: #fff;
        @include elps();
    }
    .sub {
        font-size: 24px;
        color: #8bb8fb;
        @include elps();
    }
    .bottom {
        display: flex;
        align-items: center;
        margin-top: auto;
        .price {
            font-size: 40px;
            color: #ffe701;
            @include elps();
            &:before {
                content: '￥';
                font-size: 24px;
            }
        }
        .original {
            margin-left: 12px;
            font-size: 24px;
            color: #ff955c;
            @include elps();
            &:before {
                content: '￥';
            }
        }
        > svg {
            flex-shrink: 0;
            margin-left: auto;
        }
    }
}

</style>
