<template>
    <div>
        <div :class="$style.imageTextWrapper">
            <div :class="$style.imageTextHead">
                <img src="https://mallcdn.youpenglai.com/static/mall/icons/2.10.0/file-red.png">
                <b>{{ data.moduleName }}</b>
                <router-link
                    :class="$style.imageTextHeadMore"
                    :to="{ name: 'ImageTextList' }"
                >
                    查看全部
                    <pl-svg name="icon-right" height="20" fill="#cccccc" />
                </router-link>
            </div>
            <div :class="$style.imageTextHeadSub" v-if="data.otherValue > 0">
                {{ `${data.otherValue}个图文资料，等你来学习` }}
            </div>
            <ul :class="$style.list" v-if="data.values.length">
                <template v-for="(item, index) of data.values">
                    <router-link
                        v-if="item.goodsInfo"
                        :key="index"
                        tag="li"
                        :to="{ name: 'ImageTextDetail', params: { productId: item.goodsInfo.id } }"
                    >
                        <div :class="$style.imgWrapper">
                            <img v-imgError :src="item.goodsInfo.graphicMainImg + '?x-oss-process=style/thum-small'">
                        </div>
                        <div :class="$style.info">
                            <div :class="$style.top" v-text="item.goodsInfo.graphicName" />
                            <div :class="$style.middle" v-if="item.goodsInfo.author">
                                {{ `作者：${item.goodsInfo.author}` }}
                            </div>
                            <div :class="$style.bottom">
                                <span
                                    :class="{
                                        [$style.bottomPrice]: true,
                                        [$style.money]: !!item.goodsInfo.sellingPrice
                                    }"
                                    v-text="item.goodsInfo.sellingPrice || '免费'"
                                />
                                <del
                                    :class="{
                                        [$style.bottomOrigin]: true,
                                        [$style.money]: !!item.goodsInfo.originalPrice
                                    }"
                                    v-text="item.goodsInfo.originalPrice"
                                    v-if="item.goodsInfo.originalPrice"
                                />
                                <div v-if="!item.orderId" :class="$style.bottomBtn">{{ getBtnText(item.goodsInfo) }}</div>
                                <div v-else :class="[$style.bottomBtn, $style.bottomStudy]">立即学习</div>
                            </div>
                        </div>
                    </router-link>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ImageText',
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {}
    },
    methods: {
        getBtnText ({ isOpenSale, regularSaleTime = '' }) {
            let text = '立即订购'
            if (isOpenSale === 1) {
                const saleTime = new Date(regularSaleTime).valueOf()
                if (saleTime > Date.now()) {
                    text = '即将开售'
                }
            }
            return text
        }
    }
}
</script>

<style module lang="scss">
.image-text-wrapper {
    padding: 20px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
}
.image-text-head {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    line-height: 46px;
    > img {
        width: 36px;
        height: 36px;
        object-fit: cover;
    }
    > b {
        margin-left: 16px;
        font-size: 32px;
        color: #333;
    }
    &-sub {
        font-size: 22px;
        line-height: 32px;
        color: #1592e6;
    }
    &-more {
        display: flex;
        align-items: center;
        margin-left: auto;
        font-size: 24px;
        color: #999;
        > svg {
            margin-left: 4px;
        }
    }
}
.list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 32px;
    > li {
        display: flex;
        margin-top: 20px;
        width: 100%;
        height: 188px;
        overflow: hidden;
        &:nth-of-type(1) {
            margin-top: 0;
        }
        .img-wrapper {
            position: relative;
            width: 280px;
            height: 188px;
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
            flex-direction: column;
            justify-content: space-between;
            padding: 8px 0 8px 20px;
        }
        .top {
            font-size: 28px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            line-height: 36px;
            color: #000;
            text-align: justify;
            @include elps();
        }
        .middle {
            margin-top: 6px;
            font-size: 24px;
            color: #666;
            @include elps();
            &:nth-of-type(1) {
                margin-top: 10px;
            }
        }
        .bottom {
            margin-top: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &-price {
                font-size: 32px;
                font-weight: bold;
                color: #fe7700;
                @include elps();
                &.money::before {
                    content: '￥';
                    font-size: 20px;
                }
            }
            &-origin {
                margin-left: 6px;
                font-size: 20px;
                color: #999;
                @include elps();
                &.money::before {
                    content: '￥';
                }
            }
            &-btn {
                flex-shrink: 0;
                margin-left: auto;
                width: 124px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                background-color: #fe7700;
                border-radius: 8px;
                font-size: 26px;
                color: #fff;
            }
            &-study {
                background-color: #f2b036;
            }
        }
    }
}

</style>
