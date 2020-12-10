<template>
    <div class="product-item" @click="goDetail">
        <img :src="productImg" alt="">
        <div class="desc">
            <div class="title" v-text="productName" />
            <div class="rebate">
                分享购买可获得润笔 <span v-text="rebate" />
            </div>
            <div class="bottom">
                <div class="price">
                    <b v-if="price" v-text="price" />
                    <span v-else>免费</span>
                    <!-- <del v-if="originPrice" v-text="originPrice" />-->
                </div>
                <button>
                    {{ isHelper? '立即分享' : '查看详情' }}
                </button>
            </div>
        </div>
        <div class="logo">{{ definiteType }}</div>
    </div>
</template>

<script>
export default {
    name: 'ProductItem',
    props: {
        // 当前用户是否为helper
        isHelper: Boolean,
        // 商品Id
        productId: {
            type: String,
            default: ''
        },
        // 商品类型 1商品（虚拟商品，实体商品，正式课，体验课）+ 2云课程（单课，系列课）
        productType: {
            type: Number,
            default: 1
        },
        // 商品图片
        productImg: {
            type: String,
            default: ''
        },
        // 商品名称
        productName: {
            type: String,
            default: ''
        },
        // 商品润笔金额
        rebate: {
            type: [Number, String],
            default: 0
        },
        // 商品类型 单课/系列课 + 实体商品/虚拟商品/体验课/正式课
        definiteType: {
            type: String,
            default: ''
        },
        // 商品价钱
        price: {
            type: Number,
            default: 0
        },
        // 商品原价
        originPrice: {
            type: [Number, String],
            default: 0
        }
    },
    methods: {
        goDetail () {
            const goRouterName = this.productType === 1 ? 'Product' : 'Curriculum'
            this.$router.push({
                name: goRouterName,
                params: { productId: this.productId }
            })
        }
    }
}
</script>

<style scoped lang="scss">
  .product-item {
    position: relative;
    display: flex;
    width: calc(100% - 18px * 2);
    padding: 18px;
    margin-bottom: 20px;
    border-radius:20px;
    background-color: #fff;
  }
  img {
    width: 280px;
    height: 186px;
    border-radius:20px;
    object-fit: cover;
  }

  .desc {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: calc(100% - 280px - 22px);
    margin-left: 22px;
    .title {
      max-width: 100%;
      font-size:28px;
      font-weight: bold;
      color: #000;
      @include elps();
    }
    .rebate {
      font-size:24px;
      color: #666;
      span {
        color: #FE7700;
        &:before {
          content: '￥';
        }
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      .price {
        max-width: 200px;
        b {
          font-size:32px;
          color: #FE7700;
          &:before {
            content: '￥';
            font-size:20px;
            font-weight:normal;
          }
        }
        span {
          font-size:32px;
          color: #FE7700;
        }
        del {
          margin-left: 6px;
          font-size:20px;
          color: #999;
          &:before {
            content: '￥';
            font-size:20px;
          }
        }
      }
      button {
        width: 124px;
        height: 48px;
        border-radius:8px;
        font-size:26px;
        background-color: #FE7700;
        color: #fff;
      }
    }
  }

  .logo {
    position: absolute;
    top: 18px;
    left: 18px;
    padding: 6px 12px;
    border-radius:20px 0px 20px 0px;
    font-size:24px;
    background-color: #F2B036;
    color: #fff;
  }
</style>
