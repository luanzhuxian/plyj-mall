<template>
    <li :class="$style.coupon">
        <div :class="$style.left">
            <b :class="$style.price">{{ 1000 }}</b>
            <span :class="$style.stock">{{ `剩余${12}张` }}</span>
        </div>
        <div :class="$style.right">
            <b :class="$style.main">
                {{ `满20可抵1000` }}
            </b>
            <p :class="$style.sub">
                {{ '威巴克专属' }}
            </p>
            <p :class="$style.date">
                {{ `使用时间：2020.11.12-2020.12.21` }}
            </p>
        </div>
    </li>
</template>

<script>
// import { receiveCoupon } from '../../../apis/my-coupon'
// import { getDate } from '../helper.js'

// let isClickable = false

export default {
    name: 'Coupon',
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
        // getDate,
        // async getCoupon ({ goodsInfo = {} }) {
        //     const { id } = goodsInfo
        //     if (isClickable) return
        //     if (!id) return
        //     isClickable = true
        //     try {
        //         await receiveCoupon({ couponId: id })
        //         this.$success('领取成功！')
        //     } catch (e) {
        //         throw e
        //     } finally {
        //         setTimeout(() => (isClickable = false), 500)
        //     }
        // }
    }
}
</script>

<style lang="scss" module>
.coupon {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/coupon.png) no-repeat center;
    background-size: 100%;
    height: 190px;
    font-size: 20px;
    color: #F19874;
    .left {
        position: relative;
        text-align: center;
        box-sizing: border-box;
        padding: 56px 0 6px 20px;
        width: 184px;
        height: 100%;
        @include elps();
        &::after {
            position: absolute;
            top: 32px;
            right: -1px;
            content: '';
            width: 1px;
            height: 128px;
            border-right: 2px dashed #FDAC85;
        }
    }
    .price {
        display: block;
        font-size: 42px;
        line-height: 32px;
        color: #F23D00;
        @include elps();
        &:before {
            content: '￥';
            font-size: 20px;
        }
    }
    .stock {
        margin-top: 4px;
        @include elps();
    }
    .right {
        flex: 1;
        width: 0;
        padding: 6px 20px 6px 34px;
        @include elps();
    }
    .main {
        font-size: 24px;
        line-height: 32px;
        color: #F23D00;
        @include elps();
    }
    .sub {
        margin-top: 8px;
        @include elps();
    }
    .date {
        margin-top: 6px;
        @include elps();
    }
}
</style>
