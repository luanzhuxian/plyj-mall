<template>
    <!-- 春耘计划商品组件 -->
    <div
        :class="$style.springPloughingProItem"
        @click="$router.push({ name: 'Product', params: { productId: data.goodsId }, query: { currentProductStatus: 5 } })"
    >
        <img :src="data.goodsImage" alt="">
        <div :class="$style.right">
            <p :class="$style.name" v-text="data.goodsName" />
            <p :class="$style.limit">
                x{{ data.count }}
            </p>
            <p :class="$style.sku">
                <span v-text="data.sku1Name" />
                <template v-if="data.sku2Name">
                    <span>, {{ data.sku2Name }}</span>
                </template>
                <!--数量：{{ data.count }}-->
                <!--{{ data.sku1Name }}{{ data.sku2Name ? ` ,${data.sku2Name}` : '' }}-->
            </p>
            <p :class="$style.price">折后价：￥{{ data.amount }}</p>
            <p :class="$style.originalPrice">原价：￥{{ data.originPrice }}</p>
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
    width: 256px;
    margin: 8px 0 20px 0;
    padding: 0 20px;
    font-size: 24px;
    line-height: 40px;
    color: #74B06E;
    background-color: #17560F;
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
  }
</style>
