<template>
  <div
    :class="$style.groupBuying + ' radius-20'"
    @click="handleClick"
  >
    <!-- 团购课组件 -->
    <div :class="$style.content">
      <img
        class="radius-10"
        :src="img"
        alt=""
      >
      <div :class="$style.right">
        <div :class="$style.title">
          <h3 v-text="title" />
          <div :class="$style.grade">
            <pl-svg name="star" />
            <i>4.8</i>
          </div>
        </div>
        <price
          :price="price"
          :original-price="originalPrice"
          size="small"
        />
        <pl-button
          type="warning"
          :class="$style.button"
        >
          立即抢购
        </pl-button>
      </div>
    </div>
  </div>
</template>

<script>
import Price from './Price.vue'

export default {
  name: 'GroupBuying',
  components: {
    Price
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
    price: {
      type: [String, Number],
      default: ''
    },
    originalPrice: {
      type: [String, Number],
      default: ''
    },
    tags: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    handleClick () {
      this.$router.push({ name: 'GroupBuying', params: { id: 123 } })
    }
  }
}
</script>

<style module lang="scss">
.group-buying {
  padding: 28px;
  margin-top: 20px;
  background-color: #fff;
}
.content {
  display: flex;
  height: 140px;
  img {
    width: 208px;
    height: 140px;
    object-fit: cover;
  }
}
.right {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding-left: 28px;
}
.title {
  h3 {
    margin-bottom: 8px;
    font-size: 28px;
    font-weight: bold;
    color: #000;
    @include elps-wrap(1);
  }
}
.grade {
  svg {
    width: 24px;
    height: 24px;
    fill: #f2b036;
    vertical-align: -2px;
  }
  i {
    margin-left: 5px;
    color: #999;
    font-size: 24px;
  }
}
.button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
