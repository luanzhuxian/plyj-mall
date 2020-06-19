<template>
    <div :class="$style.scholarship">
        <div :class="$style.price" class="rmb" v-text="price" />
        <p>全场商品通用</p>
        <p>领取后{{ days }}天内可用</p>
    </div>
</template>

<script>
export default {
    name: 'Scholarship',
    props: {
        price: {
            type: Number,
            default: 0
        },
        days: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style module lang="scss">
    .scholarship {
        display: inline-block;
        width: 222px;
        height: 245px;
        margin-right: 20px;
        text-align: center;
        background: url("https://mallcdn.youpenglai.com/static/admall/2.11.0/red-envelope2.png") no-repeat center center;
        background-size: 100% 100%;
        > .price {
            margin-top: 38px;
            font-size: 44px;
            font-weight: bold;
            color: #FF4622;
            &:before {
                font-size: 30px;
                font-weight: normal;
            }
        }
        > p {
            font-size: 20px;
            color: #fff;
            &:nth-of-type(1) {
                margin-top: 46px;
            }
            &:nth-of-type(2) {
                margin-top: 6px;
            }
        }
    }
</style>
