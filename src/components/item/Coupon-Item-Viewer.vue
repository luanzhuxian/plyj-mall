<template>
    <!-- 优惠券显示组件，仅用于显示，不包含其他操作 -->
    <div
        :class="$style.couponItemViewer"
        :style="{
            '--bgi': `url('${ type === 1 ? 'https://mallcdn.youpenglai.com/static/mall/2.0.0/full-coupon.png' : 'https://mallcdn.youpenglai.com/static/mall/2.0.0/category-coupon.png' }')`,
            '--height': height,
            '--padding': padding,
            '--amountSize': amountSize,
            '--descSize': descSize,
            '--dateSize': dateSize
        }"
    >
        <div :class="$style.top">
            <div :class="$style.amount">{{ amount }}</div>
            <div :class="$style.desc">
                满{{ full }}减 {{ amount }}
            </div>
        </div>
        <div :class="$style.date">
            有效期：{{ startTime | dateFormat('YYYY-MM-DD') }} ~ {{ endTime | dateFormat('YYYY-MM-DD') }}
        </div>
    </div>
</template>
<script>
export default {
    name: 'CouponItemViewer',
    data () {
        return {
            height: '0',
            padding: '0',
            amountSize: '0',
            descSize: '0',
            dateSize: '0'
        }
    },
    props: {
        // 优惠券类型 1 满减券 2 品类券
        type: {
            type: Number,
            default: 1
        },
        // 优惠券价值
        amount: {
            type: Number,
            default: 0
        },
        // 满减券满额
        full: {
            type: Number,
            default: 0
        },
        startTime: {
            type: String,
            default: ''
        },
        endTime: {
            type: String,
            default: ''
        }
    },
    mounted () {
        const width = this.$el.offsetWidth
        this.height = `${ width * 0.33 }px`
        this.padding = `${ width * 0.08 }px ${ width * 0.15 }px 0`
        this.amountSize = `${ width * 0.1 }px`
        this.descSize = `${ width * 0.03 }px`
        this.dateSize = `${ width * 0.03 }px`
    }
}
</script>
<style module lang="scss">
    .couponItemViewer {
        width: 100%;
        height: var(--height);
        padding: var(--padding);
        background: var(--bgi) no-repeat center center;
        background-size: 100%;
        border-radius: 12px;
        box-sizing: border-box;
    }
    .top {
        display: flex;
        align-items: center;
    }
    .amount {
        font-size: var(--amountSize);
        color: #ED2E50;
        &::before {
            content: '￥';
            font-size: 26px;
        }
    }
    .desc {
        margin-left: 20px;
        font-weight: bold;
        font-size: var(--descSize);
    }
    .date {
        font-size: var(--dateSize);
        color: #414141;
    }
</style>
