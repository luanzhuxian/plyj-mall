<template>
  <div
    :class="$style.expressItem"
    @click="handleClick"
  >
    <pl-svg
      name="express"
      :class="$style.icon"
    />
    <div :class="$style.right+' fz-28'">
      <div
        class="bold"
        v-text="expressName"
      />
      <div>运单号：<i v-text="expressNumber" /></div>
    </div>

    <pl-svg
      :class="$style.rightIcon"
      name="right"
      color="#ebebeb"
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
    padding: 28px 28px 28px 0;
    background-color: #fff;
    border-radius: 20px;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
    .right {
      flex: 1;
    }
    > .icon {
      width: 64px;
      height: 64px;
      margin-left: 28px;
      margin-right: 28px;
      fill: $--warning-color;
    }
  }
  .rightIcon {
    width: 30px;
    height: 30px ;
  }
</style>
