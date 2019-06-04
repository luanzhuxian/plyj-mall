<template>
  <div :class="$style.invoiceItem">
    <div :class="$style.left">
      <p
        :class="$style.name"
        v-text="data.entName"
      />
      <p
        :class="$style.number"
        v-text="data.tin"
      />
    </div>
    <div
      :class="$style.right"
      @click.stop.prevent="edit"
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
      // 点击编辑时，保存当前路由，修改后返回当前页面
      localStorage.setItem('EDIT_INVOICE_FROM', JSON.stringify(this.$route))
      this.$router.push({ name: 'AddInvoice', params: { id: this.data.id } })
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
    padding: 28px 0 28px 28px;
    background-color: #fff;
    border-radius: $--radius1;
    box-sizing: border-box;
  }
  .right {
    position: relative;
    height: 100%;
    padding: 30px 32px 30px 30px;
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
    width: 100%;
    margin-bottom: 14px;
    font-weight: 500;
    font-size: 28px;
    color: #2E2E2E;
  }
  .number {
    font-size: 24px;
  }
</style>
