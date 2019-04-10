<template>
  <label
    :class="{ 'pl-input': true, border }"
    @click="handleClick"
  >
    <div
      class="pl-input_prefix"
      v-if="prefixIcon"
    >
      <pl-svg
        :class="{ focus }"
        :name="prefixIcon"
      />
    </div>
    <div
      class="pl-textarea_box"
      v-if="type === 'textarea'"
    >
      <textarea
        :maxlength="maxlength"
        :value="value"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :placeholder="placeholder"
      />
    </div>
    <div
      v-else
      class="pl-input_box"
    >
      <input
        :type="type === 'password' ? passwordType : type"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :value="value"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :unselectable="readonly ? 'on' : ''"
        :style="{
          textAlign: align || formAlign
        }"
      >
      <pl-svg
        v-if="!disabled && type.indexOf('password') === -1"
        v-show="value"
        class="pl-input_clear"
        name="close2"
        @click="clear"
      />
      <pl-svg
        v-if="type === 'password' && passwordType === 'password'"
        v-show="value"
        class="pl-input_clear"
        name="hidden-key"
        @click="passwordType = 'show-password'"
      />
      <pl-svg
        v-if="type === 'password' && passwordType === 'show-password'"
        v-show="value"
        class="pl-input_clear"
        name="show-key"
        @click="passwordType = 'password'"
      />
    </div>
    <div class="pl-input_suffix">
      <slot name="suffix" />
    </div>
  </label>
</template>

<script>
import { getLine, throttle } from './lib/util'
export default {
  name: 'PlInput',
  model: {
    event: 'input',
    value: 'value'
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    autocomplete: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    maxlength: {
      type: Number,
      default: 2000
    },
    minRows: {
      type: Number,
      default: 5
    },
    maxRows: {
      type: Number,
      default: 10
    },
    align: {
      type: String,
      default: 'left'
    },
    disabled: Boolean,
    readonly: Boolean,
    border: Boolean
  },
  data () {
    return {
      focus: false,
      rows: 0,
      formAlign: null,
      rule: null,
      prop: '',
      error: false,
      passwordType: 'password',
      bfscrolltop: 0,
      isIOS: false,
      getLine: null
    }
  },
  created () {
    this.rows = this.minRows || 0
    this.setAlign()
    this.rule = this.$parent.rule
    this.prop = this.$parent.prop
  },
  mounted () {
    this.$nextTick(() => {
      this.bfscrolltop = document.body.scrollTop
      this.isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    })
    this.getLine = throttle(getLine, 200)
  },
  methods: {
    handleInput (e) {
      let val = e.target.value
      this.getLine(e.target, currentLine => {
        if (this.maxRows !== 0) {
          if (currentLine > this.minRows && currentLine < this.maxRows) {
            this.rows++
          }
        } else if (currentLine > this.minRows && currentLine) {
          this.rows++
        }
      })
      if (!val) this.rows = this.minRows
      this.$emit('input', val)
      this.trigger('input', val)
    },
    handleFocus (e) {
      if (this.readonly) {
        /* 防止苹果手机出现‘完成’ */
        e.target.blur()
      } else {
        // if (this.isIOS) document.body.scrollTop = document.body.scrollHeight
        this.$emit('focus', e)
        this.focus = true
        this.trigger('focus', e.target.value)
      }
    },
    handleBlur (e) {
      document.body.scrollTop = this.bfscrolltop
      this.$emit('blur', e)
      this.focus = false
      this.trigger('blur', e.target.value)
    },
    handleChange (e) {
      this.$emit('change', e)
      this.trigger('change', e.target.value)
    },
    clear () {
      this.$emit('input', '')
      this.$emit('clear')
    },
    setAlign () {
      this.formAlign = this.align || this.$parent.align || this.$parent.$parent.align
    },
    trigger (event) {
      if (this.rule) {
        let validateRules = this.rule.filter(item => item.trigger === event)
        if (validateRules.length > 0) {
          this.$parent.$parent.validateByFields(this.prop)
        }
      }
    },
    handleClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>
<style lang="scss">
  .pl-input {
    position: relative;
    display: inline-flex;
    flex: 1;
    width: 100%;
    height: 100%;
    align-items: center;
    background-color: transparent;
    box-sizing: border-box;
    &.border {
      padding: 0 24px;
      height: 100%;
      &:after {
        @include border-half(#e7e7e7, 32px)
      }
    }
    .pl-input_box {
      position: relative;
      flex: 1;
      display: inline-flex;
      align-items: center;
      input {
        display: block;
        width: 100%;
        font-size: 32px;
        color: #333;
        box-sizing: border-box;
        background-color: transparent !important;
        &::-webkit-input-placeholder {
          font-size: 28px;
          color: #ccc;
        }
        &:disabled {
          background-color: #fff;
          color: #999;
        }
        &:read-only {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      }
      .pl-input_clear {
        width: 40px;
        padding-right: 20px;
        fill: #ccc;
        path {
          fill: #ccc;
        }
      }
    }
    .pl-input_prefix {
      margin-right: 27px;
      svg {
        width: 36px;
        height: 36px;
        vertical-align: -8px;
        fill: #ccc;
        &.focus {
          fill: #333;
          path {
            fill: #333;
          }
        }
      }
    }
    .pl-input_suffix {
    }
  }
  .pl-textarea_box {
    width: 100%;
    textarea {
      box-sizing: border-box;
      width: 100%;
      padding: 24px;
      min-height: 100px;
      line-height: 40px;
      font-size: 26px;
      border: none;
      outline: none;
      resize: none;
      background: transparent;
    }
  }
</style>
