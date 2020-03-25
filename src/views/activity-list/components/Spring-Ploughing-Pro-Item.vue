<template>
    <!-- 春耘计划商品组件 -->
    <div
        :class="[$style.springPloughingProItem, $style[color]]"
        @click="$router.push({
            name: data.productType ==='KNOWLEDGE_COURSE' ? 'Curriculum' : 'Product',
            params: { productId: data.goodsId },
            query: { currentProductStatus: 5 }
        })"
    >
        <img :src="data.goodsImage" alt="">
        <div :class="$style.right">
            <div :class="$style.name" v-text="data.goodsName" />
            <div :class="$style.limit">
                x{{ data.count }}
            </div>
            <div :class="$style.sku">
                <span v-text="data.sku1Name" />
                <template v-if="data.sku2Name">
                    <span>, {{ data.sku2Name }}</span>
                </template>
                <!--数量：{{ data.count }}-->
                <!--{{ data.sku1Name }}{{ data.sku2Name ? ` ,${data.sku2Name}` : '' }}-->
            </div>
            <!-- <div> -->
            <div :class="$style.price">折后价：￥{{ data.amount }}</div>
            <div :class="$style.originalPrice">
                原价：<span :class="$style.text">￥{{ data.originPrice }}</span>
            </div>
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'SpringPloughingProItem',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        color: {
            type: String,
            default: 'green'
        }
    }
}
</script>

<style module lang="scss">
.spring-ploughing-pro-item {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 16px;
    box-sizing: border-box;
    height: 220px;
    background-color: #26601f;
    box-shadow: 0 0 0 2px #a3d816 inset;
    > img {
        width: 280px;
        height: 188px;
        object-fit: cover;
    }
}
.right {
    position: relative;
    flex: 1;
    width: 0;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 16px;
    padding: 8px 0;
}
.name {
    width: 280px;
    line-height: 38px;
    font-size: 28px;
    font-family: Microsoft YaHei;
    color: #fff;
    @include elps();
}
.limit {
    position: absolute;
    top: 12px;
    right: 0;
    font-size: 24px;
    color: #74b06e;
}
.sku {
    margin-top: 4px;
    padding: 0 12px;
    width: fit-content;
    max-width: 256px;
    font-size: 24px;
    line-height: 41px;
    color: #74b06e;
    background-color: #17560f;
    border-radius: 10px;
    @include elps();
}
.price {
    margin-top: auto;
    font-weight: bold;
    font-size: 28px;
    color: #d1e42c;
}
.original-price {
    margin-top: 4px;
    font-size: 24px;
    color: #d1e42c;
    > .text {
        text-decoration: line-through;
    }
}
// 黄色
.yellow {
    background-color: #f5c36c;
    box-shadow: none;
    .name {
        color: #663a15;
    }
    .limit {
        color: #c94828;
    }
    .sku {
        color: #fff;
        background-color: #e97f40;
    }
    .price {
        color: #663a15;
    }
    .original-price {
        color: #663a15;
    }
}

</style>
