<template>
  <div :class="$style.invoiceItem">
    <div :class="$style.left">
      <p
        :class="$style.name"
        v-text="data.name"
      />
      <p
        :class="$style.number"
        v-text="data.number"
      />
    </div>
    <div
      :class="$style.right"
      @click="edit"
    >
      编辑
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoiceItem',
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  methods: {
    edit () {
      this.$router.push({ name: 'AddInvoice', params: { id: '123123123' } })
    }
  }
}
</script>

<style module lang="scss">
  .invoiceItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 28px 32px 28px 28px;
    background-color: #fff;
    border-radius: $--radius1;
    box-sizing: border-box;
  }
  .right {
    position: relative;
    padding-left: 30px;
    margin-left: 30px;
    font-size: 28px;
    color: $--font-color_gray3;
    &:before {
      position: absolute;
      content: '';
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 56px;
      background-color: #e7e7e7;
    }
  }
  .left {
    display: inline-flex;
    flex-direction: column;
    flex: 1;
  }
  .name {
    margin-bottom: 14px;
    font-weight: 500;
    font-size: 28px;
    color: #2E2E2E;
  }
  .number {
    font-size: 24px;
  }
</style>
