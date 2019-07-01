<template>
  <div
    :class="$style.feature + ' radius-20'"
    @click="handleClick"
  >
    <!-- 特色课组件 -->
    <img
      v-lazy="img"
      :key="img"
      alt=""
    >
    <div :class="$style.right">
      <div>
        <h3 v-text="title" />
        <div
          :class="$style.sellCount"
          v-if="time && count"
        >
          <pl-svg name="time2" />
          <span><i v-text="time" />小时</span>
          <span>已售 <i v-text="count" /></span>
        </div>
        <div
          :class="$style.desc"
          v-if="desc"
          v-text="desc"
        />
      </div>
      <price
        :price="price"
        :original-price="originalPrice"
        size="small"
      />
    </div>
    <pl-svg
      :class="$style.cart"
      name="shopping-cart"
    />
  </div>
</template>

<script>
import Price from '../Price.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'FeatureLessonItem',
  components: {
    Price
  },
  data () {
    return {
    }
  },
  props: {
    img: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    count: {
      type: [String, Number],
      default: ''
    },
    price: {
      type: [String, Number],
      default: ''
    },
    originalPrice: {
      type: [String, Number],
      default: ''
    },
    productId: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['agentUser', 'userId'])
  },
  methods: {
    async handleClick () {
      const { productId, userId, agentUser } = this
      this.$router.push({ name: 'Lesson', params: { productId: productId, brokerId: agentUser ? userId : null } })
    }
  }
}
</script>

<style module lang="scss">
.feature {
  position: relative;
  display: flex;
  height: 180px;
  margin-top: 28px;
  background-color: #fff;
  overflow: hidden;
  img {
    width: 270px;
    height: 100%;
    object-fit: cover;
    border: none;
  }
}
.right {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding: 16px 20px;
  h3 {
    width: 260px;
    font-size: 28px;
    line-height: 38px;
    color: #000;
    font-weight: bold;
    @include elps-wrap(1);
  }
}
  .sell-count {
    display: inline-flex;
    align-items: center;
    margin-top: 10px;
    color: #999;
    font-size: 20px;
    span {
      margin-right: 20px;
    }
    svg {
      width: 20px;
      margin-right: 6px;
      fill: #999;
    }
  }
  .desc {
    display: inline-flex;
    width: 270px;
    align-items: center;
    margin-top: 10px;
    color: #999;
    font-size: 20px;
    @include elps-wrap(1);
  }
  .cart {
    position: absolute;
    top: 50%;
    right: 48px;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    padding: 10px;
    fill: var(--warning-color);
  }
</style>
