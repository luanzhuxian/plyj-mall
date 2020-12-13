<template>
    <div @click="target" :class="$style.product">
        <div :class="$style.img">
            <div :class="$style.tag">
                {{ item.productType === 1 ? '商品' : (item.productType === 2 ? '单课' : '系列课') }}
            </div>
            <img v-imgError :src="item.productMainImage" alt="">
        </div>
        <div :class="$style.left">
            <div :class="$style.name" v-text="item.productName" />
            <div :class="$style.lecture" v-if="item.lecturerName">
                主讲人：{{ item.lecturerName }}
            </div>
            <div :class="$style.price">
                ￥{{ item.price }}元
            </div>
        </div>
        <div :class="$style.vieFor">
            <pl-svg name="icon-vie-for" fill="#fff" width="40" height="70" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'LiveGoods',
    props: {
        item: {
            type: Object,
            default () {
                return {
                    id: '',
                    // 1 商品 2 单课 3 系列课
                    productType: 1,
                    productMainImage: '',
                    productName: '',
                    price: 0
                }
            }
        }
    },
    methods: {
        target () {
            if (this.item.productType === 1) {
                return this.$router.push({ name: 'Product', params: { productId: this.item.id } })
            }
            this.$router.push({ name: 'Curriculum', params: { productId: this.item.id } })
        }
    }
}
</script>

<style module lang='scss'>

.product {
    position: relative;
    display: flex;
    height: 262px;
    margin-bottom: 20px;
    padding: 16px;
    background-color: #fff;
    border-radius: 20px;
    box-sizing: border-box;
    > .vie-for {
        position: absolute;
        bottom: 20px;
        right: 16px;
        width: 72px;
        height: 72px;
        line-height: 72px;
        text-align: center;
        background-color: #fe7700;
        border-radius: 36px;
    }
    > .img {
        position: relative;
        width: 314px;
        height: 208px;
        margin-right: 20px;
        border-radius: 16px;
        overflow: hidden;
        > .tag {
            position: absolute;
            left: 0;
            top: 0;
            width: 100px;
            line-height: 42px;
            border-radius: 16px 0px 16px 0px;
            text-align: center;
            font-size: 24px;
            color: #FFFFFF;
            background-color: #F2B036;
        }
        > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    > .left {
        display: flex;
        flex-direction: column;
        margin-top: 10px;
        flex: 1;
        > .name {
            line-height: 38px;
            font-size: 28px;
            @include elps-wrap(2);
        }
        > .lecture {
            margin-top: 6px;
            font-size: 22px;
            color: #666666;
        }
        > .price {
            margin-top: 28px;
            font-size: 36px;
            line-height: 50px;
            color: #fe7700;
            font-weight: bold;
        }
        > .count {
            margin-top: 4px;
            font-size: 24px;
            color: #999;
            line-height: 34px;
        }
    }
}

</style>
