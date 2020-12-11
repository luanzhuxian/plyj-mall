<template>
    <li
        v-if="data.goodsInfo"
        :class="$style.productItemSmall"
        @click.stop="handleClick(data)"
    >
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
            <label :class="$style.label">
                <span>{{ `NO.${rank}` }}</span>
            </label>
        </div>
        <div :class="$style.info">
            <div :class="$style.infoPrice">
                双十二价<b>{{ data.goodsInfo.productSkuModels && data.goodsInfo.productSkuModels.length && getPrice(data.goodsInfo.productSkuModels)('price') }}</b>
            </div>
            <div :class="$style.infoName">
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.infoTags">
                <template v-for="(label, j) of data.goodsInfo.labelModels.slice(0, 2)">
                    <span v-if="label && !!label.labelName" :key="j">
                        {{ label.labelName }}
                    </span>
                </template>
            </div>
        </div>
    </li>
</template>

<script>
import { getPrice } from '../../helper'

export default {
    name: 'ProductItemSmall',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        rank: {
            type: Number,
            default: 1
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

<style lang="scss" module>
.product-item-small {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 312px;
    height: 400px;
    padding: 4px;
    background: #ffffff;
    border-radius: 20px;
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

</style>
