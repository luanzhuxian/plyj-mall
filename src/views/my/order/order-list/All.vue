<template>
  <div :class="$style.allOrder">
    <ListComponent :form="form" />
  </div>
</template>

<script>
import ListComponent from './List-Component.vue'
export default {
  name: 'All-Order',
  components: {
    ListComponent
  },
  data () {
    return {
      form: {
        userId: '',
        current: 1,
        size: 10,
        orderStatus: '',
        assessment: '',
        orderSnOrName: ''
      }
    }
  }
}
</script>

<style module lang="scss">
  .all-order {
    padding: 28px 28px 10vh 28px;
  }
</style>
