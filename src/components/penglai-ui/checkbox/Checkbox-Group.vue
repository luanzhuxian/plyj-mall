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
    prop: 'group',
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
  watch: {
    group (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    change (checked, data) {
      if (checked) {
        this.group.push(data)
      } else {
        this.group.splice(this.group.indexOf(data), 1)
      }
    },
    changeAll (flage) {
      let children = this.$children
      for (let c of children) {
        // 有禁用项时，全选时跳过
        if (c.disabled || c.data.disabled) continue
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
