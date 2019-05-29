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
      isCheckAll: false
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
  methods: {
    change (checked, data) {
      if (checked) {
        this.group.push(data)
      } else {
        this.group.splice(this.group.indexOf(data), 1)
      }
      this.$emit('change', this.group)
    },
    changeAll (flage) {
      let children = this.$children
      for (let c of children) {
        if (flage) {
          c.selected()
        } else {
          c.cancel()
        }
      }
      this.isCheckAll = flage
    }
  }
}
</script>

<style lang="scss">
</style>
