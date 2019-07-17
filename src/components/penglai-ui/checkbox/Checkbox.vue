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
          class="pl-checkbox__inner disabled"
        />
        <template v-else>
          <span
            v-show="checked || localChecked"
            class="pl-checkbox__inner checked"
          />
          <span
            v-show="!checked && !localChecked"
            class="pl-checkbox__inner"
          />
        </template>
      </span>
    </label>

    <slot
      name="suffix"
      :data="data"
    />
  </div>
</template>

<script>
import checkedIcon from '../image/checked.png'
import noChecked from '../image/no-checked.png'
import disabledChecked from '../image/disabled-check.png'
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
    checked: Boolean,
    disabled: Boolean,
    inline: Boolean,
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
    border: Boolean,
    canPrefixClick: Boolean
  },
  watch: {
    checked: {
      handler (val) {
        this.localChecked = val
      },
      immediate: true
    },
    /*
    * 数据
    * 可添加属性disabled来规定禁用的项
    * 可添加属性checked来规定默认选中的项
    * */
    data: {
      handler (val) {
        if (val) {
          if (val.checked) {
            this.selected()
          }
        }
      },
      immediate: true // 立即改变，此处不应该深度监听
    }
  },
  methods: {
    handleChange (e) {
      this.localChecked = e.currentTarget.checked
      if (this.localChecked) {
        this.selected()
      } else {
        this.cancel()
      }
    },
    // 选中
    selected () {
      if (this.$parent.change) {
        this.$parent.change(true, this.data)
      }
      this.localChecked = true
      // 调用回调，可使状态回到未选择
      this.$emit('change', true, this.data)
      if (this.data && this.data.hasOwnProperty('checked')) {
        this.data.checked = true
      }
    },
    // 取消选中
    cancel () {
      if (this.$parent.change) {
        this.$parent.change(false, this.data)
      }
      this.localChecked = false
      this.$emit('change', false, this.data)
      if (this.data && this.data.hasOwnProperty('checked')) {
        this.data.checked = false
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
    > .pl-checkbox__inner {
      display: inline-block;
      width: 36px;
      height: 36px;
      border-radius: 18px;
      border: 2px solid #ccc;
      box-sizing: border-box;
      &.checked {
        position: relative;
        background-color: #F2B036;
        border: none;
        &:before {
          position: absolute;
          top: 20px;
          left: 7px;
          content: '';
          width: 10px;
          height: 3px;
          transform: rotate(45deg);
          background-color: #fff;
          border-radius: 2px;
        }
        &:after {
          position: absolute;
          top: 18px;
          left: 12px;
          content: '';
          width: 20px;
          height: 3px;
          transform: rotate(-45deg);
          background-color: #fff;
          border-radius: 2px;
        }
      }
      &.disabled {
        background-color: #ddd;
      }
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
