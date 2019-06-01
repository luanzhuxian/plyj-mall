<template>
  <div
    :class="$style.goods"
    @click="handleClick"
  >
    <img
      :class="$style.img"
      v-lazy="img"
      :key="img"
    >
    <div :class="$style.bottom">
      <div
        v-text="title"
        :class="$style.name"
      />
      <div
        v-if="tags.length > 0"
        :class="$style.tag"
      >
        <span
          v-for="(tag, index) of tags"
          :key="index"
          v-text="tag"
        />
      </div>
      <div
        v-if="desc"
        :class="$style.desc"
        v-text="desc"
      />
      <price
        size="small"
        :price="price"
        :agent-price="agentPrice"
        :original-price="originalPrice"
      />
    </div>
  </div>
</template>

<script>
import Price from '../Price.vue'
import { createBrokerShare } from '../../apis/product'
export default {
  name: 'GoodsItem',
  components: {
    Price
  },
  data () {
    return {
      loading: false
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default: function () {
        return []
      }
    },
    desc: {
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
    agentPrice: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    async handleClick () {
      if (this.loading) return
      try {
        this.loading = true
        let { result } = await createBrokerShare(this.id)
        result = result || {}
        this.$router.push({ name: 'Lesson', params: { productSeq: this.id, brokerId: result.sequenceNbr || null } })
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
.goods {
  width: 266px;
  margin-bottom: 18px;
  box-shadow: 0 4px 12px 0 rgba(0,0,0,0.05);
  border-radius: 10px;
  .img {
    object-fit: cover;
    border-radius: $--radius2 $--radius2 0 0;
    width: 100%;
    height: 266px;
  }
}
.bottom {
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 10px 28px 16px 28px;
  .name {
    height: 55px;
    font-weight: bold;
    color: #333;
    font-size: 20px;
    @include elps-wrap(2);
  }
}
.tag {
  margin-top: 7px;
  font-size: 24px;
  color: #999;
  line-height: 32px;
  span:nth-of-type(n+2) {
    &:before {
      position: relative;
      content: '|';
      padding: 0 10px;
    }
  }
}
.desc {
  display: inline-block;
  margin: 4px 0 16px 0;
  color: #999;
  @include elps-wrap(1);
  font-size: 20px;
}
.count {
  color: #999;
  font-size: 20px;
}
</style>
