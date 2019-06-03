<template>
  <form class="pl-form">
    <slot />
  </form>
</template>

<script>
export default {
  name: 'PlForm',
  props: {
    model: {
      type: Object,
      default: function () {
        return {}
      }
    },
    rules: {
      type: Object,
      default: function () {
        return {}
      }
    },
    align: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: [String, Number],
      default: ''
    }
  },
  activated () {
  },
  methods: {
    validate () {
      if (this.rules) {
        for (let fields of Object.keys(this.rules)) {
          if (!this.validateByFields(fields)) {
            return false
          }
        }
      }
      return true
    },
    validateByFields (fields, ev) {
      let validateRules = this.rules[fields]
      let val = this.model[fields] || ''
      for (let rule of validateRules) {
        if (ev && rule.trigger !== ev.type) {
          continue
        }
        if (rule.required) {
          if (!val.trim()) {
            this.error = true
            console.warn(fields + ' is required')
            this.$warning(rule.message)
            return false
          }
        } else if (rule.validator) {
          if (!rule.validator(val)) {
            this.error = true
            this.$warning(rule.message)
            return false
          }
        }
      }
      return true
    }
  }
}
</script>
<style lang="scss">
</style>
