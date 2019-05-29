<template>
  <label
    class="pl-checkbox"
    :style="{
      display: inline ? 'inline-flex' : 'flex',
      marginBottom: gapColumn / 7.5 + 'vw',
      marginRight: gapRow / 7.5 + 'vw'
    }"
  >
    <input
      type="checkbox"
      :checked="value || checked"
      @change="handleChange"
      v-show="false"
    >
    <slot name="prefix" />
    <span
      :class="{
        'pl-checkbox-inner': true,
        'checked': value || checked
      }"
    />
    <slot name="suffix" />
  </label>
</template>

<script>
export default {
  name: 'PlCheckbox',
  data () {
    return {
      checked: false
    }
  },
  model: {
    value: 'value',
    event: 'change'
  },
  props: {
    /*
    * 绑定的值
    * 如果绑定了值，则认为有一组待选的值，使用checkbox-group监听整体变化
    * */
    data: {
      type: [Object, String, Number],
      default: function () {
        return null
      }
    },
    value: {
      type: Boolean
    },
    inline: {
      type: Boolean
    },
    // 纵向间隙
    gapColumn: {
      type: Number,
      default: 0
    },
    // 横向间隙
    gapRow: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleChange (e) {
      if (this.data) {
        this.checked = e.currentTarget.checked
        this.$parent.change(this.checked, this.data)
      } else {
        this.$emit('change', e.currentTarget.checked)
      }
    }
  }
}
</script>

<style lang="scss">
  .pl-checkbox {
    align-items: center;
    &:nth-last-of-type(1) {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
    }
  }
  .pl-checkbox-inner {
    display: inline-block;
    width: 36px;
    height: 36px;
    border: 3px solid #999;
    border-radius: 18px;
    box-sizing: border-box;
    &.checked {
      border: none;
      background-color: $--primary-color;
    }
  }
</style>
