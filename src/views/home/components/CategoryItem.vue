<template>
  <div
    :class="{
      [$style.proItem]: true,
      [$style.proItemSmall]: size === 'small',
      [$style.proItemMiddle]: size === 'middle',
      [$style.proItemMini]: size === 'mini',
    }"
    :style="{margin}"
    @click="jump"
  >
    <img v-lazy="img" :alt="productName">
    <p :class="{ [$style.name]: true, [$style.isActive]: false }" v-text="productName" />
    <p
      :class="$style.desc"
      v-if="size === 'middle'"
      v-text="productDesc"
    />
    <div :class="{ [$style.price]: true, [$style.flex]: sale }">
      <Price
        :price="price"
        :original-price="originPrice"
        :size="size"
        :style="{ display: sale ? 'inline-block' : 'block' }"
      />
      <span :class="$style.sale" v-if="sale" v-text="`${sale >= 9999 ? '9999+' : sale}人付款`" />
    </div>
    <div :class="$style.labels" v-if="labels.length">
      <span
        :class="$style.label"
        :style="{ color: labelColor[i], borderColor: labelColor[i] }"
        v-for="(item, i) of labels"
        :key="i"
      >
        {{ item.labelName }}
      </span>
    </div>
  </div>
</template>

<script>
import Price from '../../../components/product/Price.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'YouLikeItem',
  components: {
    Price
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
    originPrice: {
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
    isActive: Boolean, // 是否加入经济人活动,
    sale: {
      type: [Number, String],
      default: 0
    },
    labels: {
      type: Array,
      default () {
        return []
      }
    },
    // 是否采用 replace 的方式跳转至详情
    replace: Boolean
  },
  data () {
    return {
      labelColor: ['#E83B27', '#92B1E5', '#F3BE41', '#60C684']
    }
  },
  computed: {
    ...mapGetters(['userId', 'agentUser'])
  },
  methods: {
    async jump () {
      const { productId, userId } = this
      if (this.replace) {
        this.$router.replace({ name: 'Lesson', params: { productId: productId, brokerId: userId || null } })
      } else {
        this.$router.push({ name: 'Lesson', params: { productId: productId, brokerId: userId || null } })
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
        height: 221px;
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
        height: 146px;
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
        height: 130px;
      }
      .name {
        width: 180px;
        margin-top: 10px;
        font-size: 24px;
      }
      .price {
        margin-top: 8px;
        @include elps();
      }
      .sale {
        font-size: 20px;
        color: #999999;
      }
      .labels {
       display: flex;
       align-items: center;
       flex-wrap: wrap;
       margin: 0 -8px;
     }
     .label {
       box-sizing: border-box;
       height: 30px;
       line-height: 28px;
       border-radius: 8px;
       border-width: 1px;
       border-style: solid;
       font-size: 20px;
       padding: 0 8px;
       margin-top: 8px;
       margin-left: 8px;
     }
      .flex {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
    }
  }
</style>
