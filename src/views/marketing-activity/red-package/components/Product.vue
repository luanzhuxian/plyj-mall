<template>
    <router-link
        :class="$style.product"
        tag="li"
        :to="{
            name: 'Product' ,
            params: { productId: id }
        }"
    >
        <div :class="$style.wrapper">
            <div :class="$style.left">
                <img :src="img" :alt="main">
                <div v-if="amount" :class="$style.amount">{{ `最高可抵${amount}元` }}</div>
            </div>
            <div :class="$style.right">
                <b :class="$style.main" v-text="main" />
                <div :class="$style.tags">
                    <span :class="$style.tag" v-if="sku1" v-text="sku1" />
                    <span :class="$style.tag" v-if="sku2" v-text="sku2" />
                </div>
                <div :class="$style.price" v-if="!!price">
                    <b :class="$style.current" v-text="price" />
                    <span :class="$style.original" v-text="`¥${original}`" />
                </div>
            </div>
        </div>
        <div :class="$style.btnWrapper">
            <button :class="$style.btn">领券后购买</button>
        </div>
    </router-link>
</template>

<script>
export default {
    name: 'Product',
    props: {
        id: {
            type: String,
            default: ''
        },
        img: {
            type: String,
            default: ''
        },
        main: {
            type: String,
            default: ''
        },
        price: {
            type: Number,
            default: 0
        },
        original: {
            type: Number,
            default: 0
        },
        sku1: {
            type: String,
            default: ''
        },
        sku2: {
            type: String,
            default: ''
        },
        amount: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style lang="scss" module>
.product {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 26px 16px;
    height: 316px;
    background-color: #fff;
    border-radius: 20px;
}
.wrapper {
    flex: 1;
    display: flex;
    align-items: center;
}
.left {
    position: relative;
    width: 314px;
    height: 206px;
    border-radius: 16px;
    overflow: hidden;
    > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .amount {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background: #FE7700;
        text-align: center;
        line-height: 46px;
        font-size: 24px;
        font-family: MicrosoftYaHei;
        color: #FFFFFF;
    }
}
.right {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    flex: 1;
    width: 0;
    height: 100%;
    padding: 8px 10px;
}
.main {
    font-size: 28px;
    height: 82px;
    line-height: 38px;
    color: #333333;
    @include elps-wrap(2);
}
.tags {
    margin-top: auto;
}
.tag {
    display: inline-block;
    box-sizing: border-box;
    margin-right: 10px;
    padding: 0 6px;
    height: 36px;
    line-height: 32px;
    text-align: center;
    border: 2px solid #FE7700;
    border-radius: 6px;
    font-size: 20px;
    color: #FE7700;
    @include elps();
}
.price {
    margin-top: 8px;
    @include elps();
    .current {
        font-size: 40px;
        line-height: 52px;
        color: #F23D00;
        @include elps();
        &:before {
            content: '￥';
            font-size: 32px;
        }
    }
    .original {
        margin-left: 14px;
        font-size: 24px;
        line-height: 52px;
        color: #999999;
        text-decoration: line-through;
        vertical-align: super;
    }
}
.btn-wrapper {
    margin-top: 8px;
    text-align: right;
}
.btn {
    width: 160px;
    line-height: 48px;
    text-align: center;
    background: #FE7700;
    border-radius: 40px;
    font-size: 26px;
    color: #FFFFFF;
}
</style>
