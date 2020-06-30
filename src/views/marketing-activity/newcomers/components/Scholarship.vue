<template>
    <div
        :class="{
            [$style.scholarship]: true,
            [$style.one]: count === 1
        }"
    >
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
        },
        count: {
            type: Number,
            default: 1
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
        &.one {
            width: 614px;
            height: 180px;
            box-sizing: border-box;
            padding-left: 170px;
            text-align: left;
            background-image: url(https://mallcdn.youpenglai.com/static/admall/2.11.0/red-envelope.png);
            background-color: #FFEAE1;
            background-size: 103px;
            background-position: 22px 32px;
            border-radius: 20px;
            > .price {
                margin-top: 20px;
                font-size: 40px;
                line-height: 54px;
            }
            > p {
                margin-top: 5px !important;
                font-size: 24px;
                line-height: 32px;
                color: #999;
            }
        }
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
