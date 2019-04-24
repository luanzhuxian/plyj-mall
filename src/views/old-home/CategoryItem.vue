<template>
  <div
    :class="{
      [$style.proItem]: true,
      [$style.proItemSmall]: size === 'small',
      [$style.proItemMiddle]: size === 'middle',
      [$style.proItemMini]: size === 'mini',
    }"
    @click="jump"
    :style="{margin}"
  >
    <img
      v-lazy="img"
      alt=""
    >
    <p
      :class="{ [$style.name]: true, [$style.isActive]: false}"
      v-text="productName"
    />
    <p
      v-if="size === 'middle'"
      :class="$style.desc"
      v-text="productDesc"
    />
    <div :class="$style.price">
      <Price
        :price="price"
        :size="size"
      />
    </div>
  </div>
</template>

<script>
import { createBrokerShare } from '../../apis/product'
import Price from '../../components/Price.vue'
export default {
  name: 'YouLikeItem',
  components: {
    Price
  },
  data () {
    return {
      loading: false
    }
  },
  props: {
    productId: {
      type: String,
      require: true,
      default: ''
    },
    img: {
      type: String,
      require: true,
      default: ''
    },
    productName: {
      type: String,
      require: true,
      default: ''
    },
    price: {
      type: [String, Number],
      require: true,
      default: ''
    },
    size: {
      type: String,
      default: 'middle'
    },
    margin: {
      type: String,
      default: ''
    },
    productDesc: {
      type: String,
      default: ''
    },
    isActive: Boolean // 是否加入经济人活动
  },
  methods: {
    async jump () {
      if (this.loading) return
      //     :to="{name: 'Lesson', params: { productSeq: productId, brokerId: '' }}"
      try {
        this.loading = true
        let { result } = await createBrokerShare(this.productId)
        result = result || {}
        this.$router.push({ name: 'Lesson', params: { productSeq: this.productId, brokerId: result.sequenceNbr || null } })
      } catch (e) {
        throw e
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style module lang="scss">
  .pro-item {
    background-color: #fff;
    border-radius: $--radius1;
    img {
      object-fit: cover;
      border-radius: $--radius1;
    }
    .name {
      position: relative;
      color: #2e2e2e;
      @include elps();
      &.isActive {
        padding-left: 35px;
        &:before {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          content: '\e63b';
          color: #ec742e;
          font-size: 28px;
        }
      }
    }
    &.pro-item-middle {
      width: 332px;
      margin-bottom: 22px;
      img {
        height: 332px;
        width: 332px;
        object-fit: cover;
        border-radius: $--radius1 $--radius1 0 0;
      }
      .name {
        padding: 10px 16px;
        font-size: 24px;
        font-weight: bold;
      }
      .desc {
        padding: 0 16px;
        font-size: 20px;
        color: #999;
        @include elps();
      }
      .price {
        padding: 0 16px;
        margin-top: 10px;
        margin-bottom: 16px;
      }
    }
    &.pro-item-small {
      width: 220px;
      img {
        width: 220px;
        height: 220px;
      }
      .name {
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 28px;
        font-weight: bold;
      }
    }
    &.pro-item_mini {
      width: 196px;
      img {
        width: 196px;
        height: 196px;
      }
      .name {
        width: 180px;
        margin-top: 10px;
        font-size: 24px;
      }
      .price {
        margin-top: 8px;
      }
    }
  }
</style>
