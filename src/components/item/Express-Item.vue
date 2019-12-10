<template>
  <div
    :class="$style.expressItem"
    @click="handleClick"
  >
    <pl-svg
      name="icon-express"
      :class="$style.icon"
    />
    <div :class="$style.right + ' fz-28'">
      <div :class="$style.main">
        <span v-text="expressName" />
        <span v-text="expressNumber" />
      </div>
      <div
        :class="$style.sub"
        v-text="expressStatus"
      />
    </div>
    <pl-svg
      :class="$style.rightIcon"
      height="24"
      name="icon-right"
      fill="#CCC"
    />
  </div>
</template>

<script>
export default {
  name: 'ExpressItem',
  props: {
    orderId: {
      type: String,
      default: ''
    },
    expressName: {
      type: String,
      default: ''
    },
    expressNumber: {
      type: String,
      default: ''
    },
    expressStatus: {
      type: String,
      default: ''
    },
    img: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick () {
      this.$router.push({ name: 'Freight', params: { orderId: this.orderId }, query: { img: this.img } })
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
    border-bottom: 1px solid #e7e7e7;
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
