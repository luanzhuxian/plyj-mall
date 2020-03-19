<template>
    <!-- 春耘计划商品组件 -->
    <div
        :class="[$style.springPloughingProItem, $style[color]]"
        @click="$router.push({
            name: 'Product',
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
            <div :class="$style.price">折后价：￥{{ data.amount }}</div>
            <div :class="$style.originalPrice">
                原价：<span :class="$style.text">￥{{ data.originPrice }}</span>
            </div>
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
    background-color: #26601F;
    box-shadow: 0 0 0 2px #A3D816 inset;
    > img {
      width: 280px;
      height: 188px;
      object-fit: cover;
    }
  }
  .right {
    position: relative;
    flex: 1;
    display: inline-flex;
    flex-direction: column;
    margin-left: 16px;
    padding: 8px 0;
  }
  .name {
    width: 256px;
    line-height: 38px;
    margin-bottom: 8px;
    font-size: 28px;
    color: #fff;
    @include elps();
  }
  .limit {
    position: absolute;
    top: 12px;
    right: 0;
    margin-bottom: 20px;
    font-size: 24px;
    color: #74B06E;
  }
  .sku {
    margin: 8px 0 16px;
    padding: 0 20px;
    width: 256px;
    font-size: 24px;
    height: 40px;
    color: #74B06E;
    background-color: #17560F;
    border-radius: 10px;
    @include elps();
  }
  .price {
    margin-bottom: 4px;
    font-weight: bold;
    font-size: 28px;
    color: #D1E42C;
  }
  .original-price {
    font-size: 24px;
    color: #D1E42C;
    > .text {
      text-decoration: line-through;
    }
  }
  // 黄色
  .yellow {
    background-color: #F5C36C;
    box-shadow: none;
    .name {
      color: #663A15;
    }
    .limit {
      color: #C94828;
    }
    .sku {
      color: #FFFFFF;
      background-color: #E97F40;
    }
    .price {
      color: #663A15;
    }
    .original-price {
      color: #663A15;
    }
  }
</style>
