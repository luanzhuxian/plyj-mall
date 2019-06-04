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
      v-show="false"
      :id="'checkbox' + _uid"
      ref="checkbox"
      type="checkbox"
      :checked="checked || localChecked"
      :disabled="data && data.disabled || disabled"
      @change="handleChange"
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
          border
        }"
      >
        <span
          v-if="data && data.disabled || disabled"
          class="icon"
          :style="{ backgroundImage: `url(${disabledChecked})` }"
        />
        <template v-else>
          <span
            v-if="checked || localChecked"
            class="icon"
            :style="{ backgroundImage: `url(${checkedIcon})` }"
          />
          <span
            v-else
            class="icon"
            :style="{ backgroundImage: `url(${noChecked})` }"
          />
        </template>
      </span>
    </label>

    <slot name="suffix" />
  </div>
</template>

<script>
import checkedIcon from './image/checked.png'
import noChecked from './image/no-checked.png'
import disabledChecked from './image/disabled-check.png'
export default {
  name: 'PlCheckbox',
  data () {
    return {
      localChecked: false,
      checkedIcon,
      noChecked,
      disabledChecked
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
    },
    border: {
      type: Boolean
    },
    canPrefixClick: {
      type: Boolean,
      default: false
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
    },
    handleClick () {
      if (!this.canPrefixClick) return
      if (!this.localChecked) {
        this.selected()
      } else {
        this.cancel()
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
    > label {
      display: inline-flex;
      align-items: center;
    }
  }
  .pl-checkbox-inner {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 18px;
    box-sizing: border-box;
    > .icon {
      display: inline-block;
      width: 35px;
      height: 35px;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100%;
    }
    > .weixuanzhong1 {
      display: none;
    }
    &.border {
      > .weixuanzhong1 {
        display: inline-block;
      }
    }
  }
</style>
