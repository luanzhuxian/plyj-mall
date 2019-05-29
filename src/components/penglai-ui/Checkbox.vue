<template>
  <div
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
      :disabled="disabled"
      ref="checkbox"
      :id="'checkbox' + _uid"
    >
    <slot name="prefix" />
    <label
      :for="'checkbox' + _uid"
      ref="label"
    >
      <span
        :class="{
          'pl-checkbox-inner': true,
          'checked': value || checked,
          'disabled': disabled
        }"
      >
        <pl-svg
          class="check"
          name="check"
          color="#fff"
          v-show="value || checked"
        />
      </span>
    </label>
    <slot name="suffix" />
  </div>
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
    disabled: {
      type: Boolean,
      default: false
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
        this.checked = e.currentTarget.checked
      }
    },
    // 选中
    selected () {
      if (!this.checked) {
        this.checked = true
        if (this.data) {
          this.$parent.change(this.checked, this.data)
        } else {
          this.$emit('change', true)
        }
      }
    },
    // 取消选中
    cancel () {
      if (this.checked) {
        this.checked = false
        if (this.data) {
          this.$parent.change(this.checked, this.data)
        } else {
          this.$emit('change', false)
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .pl-checkbox {
    align-items: center;
    align-self: center;
    &:nth-last-of-type(1) {
      margin-bottom: 0 !important;
      margin-right: 0 !important;
    }
  }
  .pl-checkbox-inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 3px solid #999;
    border-radius: 18px;
    box-sizing: border-box;
    &.checked {
      border: none;
      background-color: $--primary-color;
    }
    &.disabled {
      background-color: #ddd;
      border-color: #ccc;
    }
    .check {
      width: 22px;
    }
  }
</style>
