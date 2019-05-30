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
      :checked="checked || localChecked"
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
          'checked': checked || localChecked,
          'disabled': disabled
        }"
      >
        <pl-svg
          class="check"
          name="check"
          color="#fff"
          v-show="checked || localChecked"
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
      localChecked: false
    }
  },
  model: {
    prop: 'checked',
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
    checked: {
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
  watch: {
    checked (val) {
      this.localChecked = val
    }
  },
  mounted () {
    this.localChecked = this.checked
  },
  methods: {
    handleChange (e) {
      this.localChecked = e.currentTarget.checked
      if (this.data) {
        this.$parent.change(this.localChecked, this.data)
        this.$emit('change', this.localChecked)
      } else {
        this.$emit('change', this.localChecked)
      }
    },
    // 选中
    selected () {
      if (!this.localChecked) {
        this.$parent.change(true, this.data)
        this.$emit('change', true)
        this.localChecked = true
      }
    },
    // 取消选中
    cancel () {
      if (this.localChecked) {
        this.$parent.change(false, this.data)
        this.$emit('change', false)
        this.localChecked = false
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
