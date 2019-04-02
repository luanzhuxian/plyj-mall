<template>
  <div :class="$style.waitComment">
    <ListComponent :form="form" />
  </div>
</template>

<script>
import ListComponent from './List-Component.vue'
export default {
  name: 'Wait-Comment',
  components: {
    ListComponent
  },
  data () {
    return {
      form: {
        userId: '',
        current: 1,
        size: 10,
        orderStatus: 'FINISHED',
        assessment: 'NO',
        orderSnOrName: ''
      }
    }
  }
}
</script>

<style module lang="scss">
  .wait-comment {
    height: 90vh;
    padding: 28px 28px 10vh 28px;
    overflow: scroll;
  }
</style>
