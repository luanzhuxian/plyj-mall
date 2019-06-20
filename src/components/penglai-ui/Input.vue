<template>
  <div
    :class="{ 'pl-input': true, border, ['pl-input-' + size]: true }"
    @click="handleClick"
  >
    <div
      class="pl-input_prefixicon"
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
        class="pl-input-textarea"
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
      <span
        class="pl-input__word-count"
        v-if="maxlength > 0"
      >
        <i v-text="value.length > maxlength ? maxlength : value.length" />
        /
        <i v-text="maxlength" />
      </span>
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
        v-if="!disabled && align !== 'right' && type.indexOf('password') === -1"
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
    <div
      class="pl-input_suffixicon"
      v-if="suffixIcon"
    >
      <pl-svg
        :class="{ focus }"
        :name="suffixIcon"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlInput',
  model: {
    event: 'input',
    prop: 'value'
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'text'
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    suffixIcon: {
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
      default: 0
    },
    minRows: {
      type: Number,
      default: 1
    },
    maxRows: {
      type: Number,
      default: 0
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
      getLine: null,
      $form: null,
      $formItem: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.rows = this.minRows || 0
      this.bfscrolltop = document.body.scrollTop
      this.$form = this.$parent.$parent
      this.$formItem = this.$parent
      this.rule = this.$formItem.rule
      this.prop = this.$formItem.prop
      this.isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      this.setAlign()
    })
  },
  methods: {
    handleInput (e) {
      let val = e.target.value
      this.$emit('input', val)
      this.trigger(e)
    },
    handleFocus (e) {
      if (this.readonly) {
        /* 防止苹果手机出现‘完成’ */
        e.target.blur()
      } else {
        // if (this.isIOS) document.body.scrollTop = document.body.scrollHeight
        this.$emit('focus', e)
        this.focus = true
        this.trigger(e)
      }
    },
    handleBlur (e) {
      document.body.scrollTop = this.bfscrolltop
      this.$emit('blur', e)
      this.focus = false
      this.trigger(e)
    },
    handleChange (e) {
      this.$emit('change', e)
      this.trigger(e)
    },
    clear () {
      this.$emit('input', '')
      this.$emit('clear')
    },
    setAlign () {
      this.formAlign = this.align || this.$formItem.align || this.$form.align
    },
    trigger (event) {
      if (this.rule) {
        this.error = !this.$form.validateByFields(this.prop, event)
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
      border: 1px solid #e7e7e7;
      border-radius: 16px;
    }
    &.pl-input-small {
      min-height: 92px;
    }
    &.pl-input-middle {
      min-height: 108px;
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
          opacity: 1 !important;
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
    .pl-input_prefixicon, .pl-input_suffixicon {
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
    .pl-input_suffixicon {
      margin-left: 27px;
      margin-right: 0;
    }
  }
  .pl-textarea_box {
    position: relative;
    width: 100%;
    padding: 24px;
    .pl-input-textarea {
      box-sizing: border-box;
      width: 100%;
      min-height: 100px;
      line-height: 40px;
      font-size: 26px;
      border: none;
      outline: none;
      resize: none;
      background: transparent;
    }
    .pl-input__word-count {
      position: absolute;
      bottom: 0;
      font-size: 20px;
      right: 28px;
      line-height: 32px;
      > i {
        &:nth-of-type(1) {
          color: #666;
        }
        &:nth-of-type(2) {
          color: #999;
        }
      }
    }
  }
</style>
