<template>
  <div :class="$style.lesson + ' ' + $style[size] + ' ' + (border ? $style.border : '')" @click="handleClick">
    <!-- 课程组件 -->
    <img :class="$style[size] + ' ' +  $style.img" v-lazy="img" :key="img" alt="">
    <div :class="$style.right">
      <div>
        <div v-text="title" :class="$style[size] + ' ' + $style.name"></div>
        <div v-if="tags.length > 0" :class="$style.tag">
          <span v-for="(tag, index) of tags" :key="index" v-text="tag"></span>
        </div>
        <div v-if="desc" :class="$style.desc + ' ' + $style[size]" v-text="desc"></div>
      </div>
      <div v-if="count" :class="$style.count">已售 <i v-text="count"></i></div>
      <price :size="size" :price="price" :originalPrice="originalPrice" />
    </div>
  </div>
</template>

<script>
import Price from '../Price.vue'
import { createBrokerShare } from '../../apis/product'
export default {
  name: 'Lesson-Item',
  components: {
    Price
  },
  props: {
    id: String,
    img: String,
    title: String,
    tags: {
      type: Array,
      default: function () {
        return []
      }
    },
    desc: String,
    count: [String, Number],
    price: [String, Number],
    originalPrice: [String, Number],
    size: {
      type: String,
      default: 'large'
    },
    border: Boolean
  },
  methods: {
    async handleClick () {
      let { result } = await createBrokerShare(this.id)
      result = result || {}
      this.$router.push({ name: 'Lesson', params: { productSeq: this.id, brokerId: result.sequenceNbr || null } })
    }
  }
}
</script>

<style module lang="scss">
.lesson {
  display: grid;
  &.border {
    position: relative;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
  }
  &:nth-last-of-type(1) {
    &:after {
      display: none;
    }
  }
  &.large {
    grid-template-columns: 320px auto;
    &.border {
      padding-bottom: 28px;
    }
  }
  &.small {
    grid-template-columns: 242px auto;
    &.border {
      padding-bottom: 24px;
    }
  }
  background-color: transparent;
  .img {
    object-fit: cover;
    border-radius: $--radius1;
    width: 100%;
    &.large {
      height: 226px;
    }
    &.small {
      height: 160px;
    }
  }
}
.right {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 28px 10px 28px;
  flex: 1;
  .name {
    font-weight: bold;
    color: #333;
    @include elps-wrap(1);
    &.large {
      font-size: 32px;
    }
    &.small {
      font-size: 28px;
    }
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
  margin-top: 4px;
  color: #999;
  @include elps-wrap(1);
  &.large {
    font-size: 24px;
  }
  &.small {
    font-size: 20px;
  }
}
.count {
  color: #999;
  font-size: 20px;
}
</style>
