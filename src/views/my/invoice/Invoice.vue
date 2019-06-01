<template>
  <div :class="$style.invoice">
    <InvoiceItem
      v-for="(item, i) of list"
      :key="i"
      :data="item"
    />
  </div>
</template>

<script>
import InvoiceItem from '../../../components/item/Invoice-Item.vue'
export default {
  name: 'Invoice',
  components: {
    InvoiceItem
  },
  data () {
    return {
      list: [
        {
          name: '西安大梦想家艺术培训有限公司',
          number: '13777327727327273727777'
        },
        {
          name: '西安大梦想家艺术培训有限公司',
          number: '13777327727327273727777'
        }
      ]
    }
  }
}
</script>

<style module lang="scss">
  .invoice {
    padding: 24px 40px;
  }
</style>
