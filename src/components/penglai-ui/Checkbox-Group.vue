<template>
  <div class="pl-checkbox-group">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PlCheckboxGroup',
  data () {
    return {
    }
  },
  model: {
    value: 'group',
    event: 'change'
  },
  props: {
    group: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  mounted () {
    console.log(this.$children[0])
  },
  methods: {
    change (checked, data) {
      if (checked) {
        this.group.push(data)
      } else {
        this.group.splice(this.group.indexOf(data), 1)
      }
      this.$emit('change', this.group)
    }
  }
}
</script>

<style lang="scss">
</style>
