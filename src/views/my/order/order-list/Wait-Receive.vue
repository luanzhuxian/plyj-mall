<template>
  <div :class="$style.waitReceive">
    <ListComponent :form="form" />
  </div>
</template>

<script>
import ListComponent from './List-Component.vue'
export default {
  name: 'Wait-Receive',
  components: {
    ListComponent
  },
  data () {
    return {
      form: {
        userId: '',
        current: 1,
        size: 10,
        orderStatus: 'WAIT_RECEIVE',
        assessment: '',
        orderSnOrName: ''
      }
    }
  }
}
</script>

<style module lang="scss">
  .wait-receive {
    padding: 28px 28px 10vh 28px;
  }
</style>
