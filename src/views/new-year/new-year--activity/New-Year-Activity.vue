<template>
  <div>
    <h1>我心中的年味</h1>
  </div>
</template>

<script>
import { getNewYearActivityDetail } from '../../../apis/new-year-activity'

export default {
  name: 'NewYearActivity',
  components: {
  },
  data () {},
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  async activated () {
  },
  async created () {
  },
  methods: {
    async init () {
      await getNewYearActivityDetail()
    }
  }
}
</script>

<style scoped lang="scss"></style>
