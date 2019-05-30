<template>
  <div
    :class="$style.expressItem"
    @click="handleClick"
  >
    <pl-svg
      name="express"
      :class="$style.icon"
    />
    <div :class="$style.right + ' fz-28'">
      <div :class="$style.main">
        <span v-text="expressName" />
        <span v-text="expressNumber" />
      </div>
      <div :class="$style.sub">
        快件正在派送中，派送业务员
      </div>
    </div>
    <pl-svg
      :class="$style.rightIcon"
      name="right"
      color="#D2D2D2"
    />
  </div>
</template>

<script>
export default {
  name: 'ExpressItem',
  props: {
    expressName: {
      type: String,
      default: ''
    },
    expressNumber: {
      type: String,
      default: ''
    },
    orderId: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick () {
      this.$router.push({ name: 'Freight', params: { orderId: this.orderId } })
    }
  }
}
</script>

<style module lang="scss">
  .express-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 28px 24px 28px;
    background-color: #fff;
    border-radius: 20px;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
    .right {
      flex: 1;
    }
    .main {
      margin-bottom: 6px;
      color: #000;
      > span:nth-of-type(1) {
        margin-right: 10px;
      }
    }
    .sub {
      font-size: 24px;
      color: #2E2E2E;
    }
    > .icon {
      width: 64px;
      height: 64px;
      margin-right: 28px;
      fill: $--warning-color;
    }
  }
  .rightIcon {
    width: 22px;
  }
</style>
