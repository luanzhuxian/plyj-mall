<template>
    <div
        :class="{
            [$style.coupon]: true
        }"
    >
        <div
            class="rmb"
            :class="{
                [$style.price]: true,
                [$style.soLong]: String(price).length > 5,
                [$style.tooLong]: String(price).length > 7
            }"
            v-text="price"
        />
        <div :class="$style.info">
            <div v-if="type === 1">满减券</div>
            <div v-else>品类券</div>
            <div>满{{ limit }}减{{ price }}</div>
            <div>(有效期 {{ start | dateFormat('YYYY.M.D') }}-{{ end | dateFormat('YYYY.M.D') }})</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Coupon',
    props: {
        price: {
            type: [String, Number],
            default: 0
        },
        limit: {
            type: [String, Number],
            default: 0
        },
        start: {
            type: String,
            default: ''
        },
        end: {
            type: String,
            default: ''
        },
        type: {
            type: Number,
            default: 1
        }
    }
}
</script>

<style module lang="scss">
    .coupon {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 630px;
        height: 180px;
        margin-bottom: 18px;
        padding: 26px 36px;
        box-sizing: border-box;
        background: url("https://mallcdn.youpenglai.com/static/admall/2.11.0/coupon-bg.png") no-repeat center center;
        background-size: 100% 100%;
        &:nth-last-of-type(1) {
            margin-bottom: 0;
        }
        > .price {
            width: 160px;
            font-size: 40px;
            font-weight: bold;
            color: #FF4622;
            &:before {
                font-size: 30px;
            }
            &.soLong {
                font-size: 32px;
                &:before {
                    font-size: 20px;
                }
            }
            &.tooLong {
                font-size: 26px;
                &:before {
                    font-size: 20px;
                }
            }
        }
        > .info {
            padding-left: 24px;
            > div {
                color: #FF4622;
                &:nth-of-type(1) {
                    margin-bottom: 8px;
                    font-size: 32px;
                    font-weight: bold;
                }
                &:nth-of-type(2) {
                    margin-bottom: 6px;
                    font-size: 24px;
                }
                &:nth-of-type(3) {
                    font-size: 24px;
                    color: #FA8E59;
                }
            }
        }
    }
</style>
