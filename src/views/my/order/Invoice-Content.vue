<template>
<div :class="$style.invoiceContent">
  <ul :class="$style.contentList" @click="select">
    <li>明细</li>
    <li>办公用品</li>
    <li>耗材</li>
    <li>电脑配件</li>
    <li>培训费</li>
    <li>其他</li>
  </ul>
</div>
</template>

<script>
export default {
  name: 'Invoice-Content',
  data () {
    return {
    }
  },
  computed: {
    orderId: function () {
      return this.$route.params.id
    }
  },
  created () {
  },
  methods: {
    select (e) {
      this.$router.replace({ name: 'Invoice', params: { id: this.orderId }, query: { content: e.target.innerText } })
    }
  }
}
</script>

<style module lang="scss">
  .content-list {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    li {
      position: relative;
      height: 102px;
      padding: 0 30px;
      font-size: 30px;
      color: #2e2e2e;
      line-height: 102px;
      &:after {
        @include border-half-bottom(#f3f3f3)
      }
    }
  }
</style>
