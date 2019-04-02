<template>
  <div :class="$style.waitShip">
    <ListComponent :form="form" />
  </div>
</template>

<script>
import ListComponent from './List-Component.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Wait-Ship',
  components: {
    ListComponent
  },
  computed: {
    ...mapGetters(['userId'])
  },
  data () {
    return {
      form: {
        userId: '',
        current: 1,
        size: 10,
        orderStatus: 'WAIT_SHIP',
        assessment: '',
        orderSnOrName: ''
      }
    }
  }
}
</script>

<style module lang="scss">
  .wait-ship {
    padding: 28px 28px 10vh 28px;
  }
</style>
