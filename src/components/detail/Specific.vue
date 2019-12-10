<template>
  <div :class="$style.specific + ' radius-20 mt-28'">
    <pl-fields
      size="small"
      text="学习指导方案"
      right-text="81元"
    />
    <pl-fields
      size="small"
      text="体验课礼品"
      right-text="99元"
    />
    <pl-fields
      size="small"
      text="学习指导方案"
      right-text="199元"
    />
    <pl-fields
      size="small"
      text="综合测试"
      right-text="81元"
    />
    <div :class="$style.totalPrice">
      <div
        :class="{ [$style.noGroup]: !Boolean(groupPrice) }"
        v-if="totalPrice"
      >
        总价值：<span>{{ totalPrice }}元</span>
      </div>
      <div v-if="groupPrice">
        团购价：{{ groupPrice }}元
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Specific',
  components: {
  },
  props: {
    totalPrice: {
      type: [String, Number],
      default: ''
    },
    groupPrice: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>

<style module lang="scss">
  .specific {
    padding: 14px 0 30px 28px;
    background-color: #fff;
  }
  .total-price {
    padding-top: 16px;
    padding-right: 30px;
    text-align: right;
    font-size: 28px;
    > div:nth-of-type(2) {
      line-height: 50px;
      font-size: 32px;
      color: $--primary-color;
    }
  }
  .no-group {
    span {
      font-size: 32px;
      color: $--primary-color;
    }
  }
</style>
