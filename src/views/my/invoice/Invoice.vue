<template>
  <div :class="$style.invoice">
    <InvoiceItem
      v-for="(item, i) of list"
      :key="i"
      :data="item"
    />

    <router-link
      tag="div"
      :to="{ name: 'AddInvoice' }"
      :class="{
        [$style.addInvoice]: true,
        [$style.bottom]: list.length > 0,
        'fz-28 bold radius-20': true
      }"
    >
      <span>点击这里，添加一个发票信息</span>
      <pl-svg
        name="add"
        color="#fff"
      />
    </router-link>
  </div>
</template>

<script>
import InvoiceItem from '../../../components/item/Invoice-Item.vue'
import { getInvoiceList } from '../../../apis/invoice'
import { mapGetters } from 'vuex'
export default {
  name: 'Invoice',
  components: {
    InvoiceItem
  },
  data () {
    return {
      list: []
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  activated () {
    try {
      this.getList()
    } catch (e) {
      throw e
    }
  },
  methods: {
    async getList () {
      try {
        const { result } = await getInvoiceList(this.userId)
        this.list = result
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .invoice {
    padding: 24px 40px;
  }
  .addInvoice {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 108px;
    padding: 0 40px;
    color: #fff;
    background-color: $--warning-color;
    &.bottom {
      position: fixed;
      bottom: 20px;
      width: 590px;
    }
    > svg {
      width: 40px;
      height: 40px;
    }
  }
</style>
