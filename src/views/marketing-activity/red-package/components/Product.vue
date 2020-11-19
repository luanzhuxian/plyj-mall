<template>
    <router-link
        :class="$style.product"
        tag="li"
        :to="{ name: '' }"
    >
        <div :class="$style.left">
            <img src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/47aa30db-205d-40b8-a564-eba87f8d6e03.png" alt="">
        </div>
        <div :class="$style.right">
            <b :class="$style.main">
                {{ `神奇的逻辑思维能力` }}
            </b>
            <p :class="$style.sub">
                {{ '威巴克专属' }}
            </p>
            <div :class="$style.bottom">
                <div :class="$style.price">
                    <b :class="$style.current">3000</b>
                    <span :class="$style.original">¥5000</span>
                </div>
                <div :class="$style.tags">
                    <span :class="$style.tag">
                        最高抵1000元
                    </span>
                </div>
            </div>
            <button :class="$style.btn">抢</button>
        </div>
    </router-link>
</template>

<script>
export default {
    name: 'Product',
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    }
}
</script>

<style lang="scss" module>
.product {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 26px 16px;
    height: 260px;
    background-color: #fff;
    border-radius: 20px;
    .left {
        width: 314px;
        height: 206px;
        border-radius: 16px;
        overflow: hidden;
        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .right {
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        flex: 1;
        width: 0;
        height: 100%;
        padding: 8px 10px 4px;
    }
    .main {
        font-size: 28px;
        line-height: 38px;
        color: #333333;
        @include elps();
    }
    .sub {
        margin-top: 10px;
        font-size: 28px;
        line-height: 38px;
        color: #333333;
        @include elps();
    }
    .bottom {
        margin-top: 8px;
        width: 270px;
    }
    .price {
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
    .tag {
        display: inline-block;
        box-sizing: border-box;
        margin-top: 12px;
        padding: 0 6px;
        height: 36px;
        line-height: 32px;
        text-align: center;
        border: 2px solid #FE7700;
        border-radius: 6px;
        font-size: 20px;
        color: #FE7700;
    }
    .btn {
        position: absolute;
        right: 18px;
        bottom: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 72px;
        height: 72px;
        background: #F23D00;
        border-radius: 50%;
        font-size: 40px;
        color: #FFFFFF;
    }
}
</style>
