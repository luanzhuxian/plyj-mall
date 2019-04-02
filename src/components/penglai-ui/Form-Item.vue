<template>
  <div
    :class="{'pl-form-item': true, border}"
  >
    <label ref="label" class="pl-form-item_label" v-text="label"></label>
    <div
      class="pl-form-item_content"
      :style="{ 'text-align': align || parentAlign }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pl-form-item',
  data () {
    return {
      parentAlign: null,
      rule: null
    }
  },
  props: {
    label: String,
    labelWidth: {
      type: [String, Number],
      default: 'max-content'
    },
    align: String,
    border: Boolean,
    // 字段名称
    prop: String
  },
  created () {
    this.parentAlign = this.$parent.align
    if (this.$parent.rules) {
      this.rule = this.$parent.rules[this.prop] || null
    }
  },
  mounted () {
    this.setLabelWidth()
  },
  methods: {
    setLabelWidth () {
      let parentLabelWidth = Number.parseInt(this.$parent.labelWidth)

      if (parentLabelWidth) {
        this.$refs.label.style.setProperty('--label-width', (parentLabelWidth / 7.5) + 'vw')
      } else {
        this.$refs.label.style.setProperty('--label-width', this.labelWidth)
      }
    }
  }
}
</script>

<style lang="scss">
  .pl-form-item {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #fff;
    &.border {
      &:after {
        @include border-half-bottom(#e7e7e7);
      }
    }
    &:nth-last-of-type(1):after {
      display: none;
    }
    .pl-form-item_label {
      display: inline-block;
      width: var(--label-width);
      font-size: 28px;
      font-weight: bold;
    }
    .pl-form-item_content {
      flex: 1;
      display: flex;
      align-items: center;
      height: 110px;
    }
  }
</style>
