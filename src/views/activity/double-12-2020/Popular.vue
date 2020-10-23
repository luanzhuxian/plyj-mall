<template>
    <Panel custom-class="popular-panel" title="学子推荐榜HOT" subtitle="双十二特色课程，推荐学子必学榜单" hide-button>
        <ul :class="$style.popularList" v-if="data.values.length">
            <li :class="[$style.popularListItem, $style.large]" v-if="isOdd" @click.stop="handleClick(first)">
                <div :class="$style.imgWrapper">
                    <img :src="first.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                    <label :class="$style.label">
                        <span>NO.1</span>
                    </label>
                </div>
                <div :class="$style.info">
                    <div :class="$style.top">
                        <div :class="$style.infoPrice">
                            双十二价：<b>{{ first.goodsInfo.productSkuModels && first.goodsInfo.productSkuModels.length && getPrice(first.goodsInfo.productSkuModels)('price') }}</b>
                        </div>
                        <div :class="$style.infoTags">
                            <template v-for="(label, j) of first.goodsInfo.labelModels.slice(0, 2)">
                                <span v-if="label && !!label.labelName" :key="j">
                                    {{ label.labelName }}
                                </span>
                            </template>
                        </div>
                    </div>
                    <div :class="$style.infoName">
                        {{ first.goodsInfo.productName }}
                    </div>
                </div>
            </li>
            <template v-for="(item, i) of (isOdd ? rest : data.values)">
                <li
                    v-if="item.goodsInfo"
                    :class="{
                        [$style.popularListItem]: true,
                        [$style.small]: true,
                        [$style.marginT0]: !isOdd && (i === 0 || i === 1)
                    }"
                    :key="i"
                    @click.stop="handleClick(item)"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                        <label :class="$style.label">
                            <span>{{ `NO.${isOdd ? i + 2 : i + 1}` }}</span>
                        </label>
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.infoPrice">
                            双十二价<b>{{ item.goodsInfo.productSkuModels && item.goodsInfo.productSkuModels.length && getPrice(item.goodsInfo.productSkuModels)('price') }}</b>
                        </div>
                        <div :class="$style.infoName">
                            {{ item.goodsInfo.productName }}
                        </div>
                        <div :class="$style.infoTags">
                            <template v-for="(label, j) of first.goodsInfo.labelModels.slice(0, 2)">
                                <span v-if="label && !!label.labelName" :key="j">
                                    {{ label.labelName }}
                                </span>
                            </template>
                        </div>
                    </div>
                </li>
            </template>
        </ul>
    </Panel>
</template>

<script>
import Panel from './Panel.vue'
import { getPrice } from '../helper'

export default {
    name: 'Popular',
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
    methods: {
        getPrice,
        handleClick (item) {
            const { type, value } = item
            if (type === 1) {
                this.$router.push({ name: 'Classify', params: { optionId: value || null } })
            } else {
                this.$router.push({ name: 'Product', params: { productId: value } })
            }
        }
    }
}
</script>

<style lang="scss">
.popular-panel {
    .double-12-panel-container {
        margin-top: 0;
        padding: 40px 44px;
    }
}
</style>
<style lang="scss" module>
.popular {
    &-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
            .label {
                position: absolute;
                top: 0;
                right: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 116px;
                height: 36px;
                background: linear-gradient(180deg, #D00D05 0%, #812225 100%);
                border-radius: 0px 16px 0px 16px;
                font-size: 24px;
                color: #FFFFFF;
                &::before {
                    content: '';
                    margin-right: 12px;
                    width: 22px;
                    height: 28px;
                    background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/fire.png') no-repeat center;
                    background-size: 100%;
                }
            }
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
                .label {
                    width: 156px;
                    height: 50px;
                    font-size: 32px;
                    &::before {
                        width: 30px;
                        height: 36px;
                    }
                }
                .img-wrapper {
                    position: relative;
                    width: 100%;
                    height: 426px;
                    border-radius: 40px 40px 0 0;
                    overflow: hidden;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .info {
                    flex: 1;
                    padding: 12px 26px;
                    .top {
                        display: flex;
                        align-items: center;
                        font-size: 24px;
                        @include elps();
                    }
                    &-name {
                        margin-top: 8px;
                        font-size: 32px;
                        font-family: Microsoft YaHei;
                        font-weight: 600;
                        color: #000;
                        @include elps();
                    }
                    &-price {
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
                    &-tags {
                        margin-left: 20px;
                        line-height: 42px;
                        @include elps();
                        > span {
                            text-align: center;
                            margin-left: 16px;
                            padding: 0 8px;
                            line-height: 36px;
                            border: 2px solid #D09648;
                            color: #A57613;
                            &:nth-of-type(1) {
                                margin-left: 0;
                            }
                        }
                    }
                }
            }
             &.small {
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                width: 312px;
                height: 400px;
                margin-top: 40px;
                padding: 4px;
                background: #ffffff;
                border-radius: 20px;
                &.margin-t-0 {
                    margin-top: 0;
                }
                .img-wrapper {
                    position: relative;
                    box-sizing: border-box;
                    width: 100%;
                    height: 204px;
                    border-radius: 20px 20px 0 0;
                    overflow: hidden;
                }
                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    padding: 16px 14px;
                    &-name {
                        font-weight: bold;
                        font-size: 26px;
                        color: #333;
                        @include elps();
                    }
                    &-price {
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
                    &-tags {
                        margin-top: 16px;
                        line-height: 42px;
                        @include elps();
                        > span {
                            text-align: center;
                            margin-left: 16px;
                            padding: 0 8px;
                            line-height: 36px;
                            border: 2px solid #D09648;
                            color: #A57613;
                            font-size: 24px;
                            &:nth-of-type(1) {
                                margin-left: 0;
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>
