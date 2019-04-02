<template>
  <div :class="$style.waitPay">
    <ListComponent :form="form" />
  </div>
</template>

<script>
import ListComponent from './List-Component.vue'
export default {
  name: 'Whait-Pay',
  components: {
    ListComponent
  },
  data () {
    return {
      form: {
        userId: '',
        current: 1,
        size: 10,
        orderStatus: 'WAIT_PAY',
        assessment: '',
        orderSnOrName: ''
      }
    }
  }
}
</script>

<style module lang="scss">
  .wait-pay {
    padding: 28px 28px 10vh 28px;
  }
</style>
