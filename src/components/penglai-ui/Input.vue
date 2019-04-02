<template>
  <label class="pl-input" @click="handleClick">
    <div class="pl-input_prefix" v-if="prefixIcon">
      <pl-svg :class="{ focus }" :name="prefixIcon"></pl-svg>
    </div>
    <div
      class="pl-textarea_box"
      v-if="type === 'textarea'">
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
        :placeholder="placeholder">
      </textarea>
    </div>
    <div v-else class="pl-input_box">
      <input
        :type="type"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :value="value"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :unselectable="readonly ? 'on' : ''"
        :style="{
          textAlign: align || formAlign
        }"
      >
      <pl-svg v-if="!disabled" v-show="value" class="pl-input_clear" name="close2" @click="clear" />
    </div>
    <div class="pl-input_suffix">
      <slot name="suffix"></slot>
    </div>
  </label>
</template>

<script>
export default {
  name: 'pl-input',
  model: {
    event: 'input',
    value: 'value'
  },
  props: {
    placeholder: String,
    type: {
      type: String,
      default: 'text'
    },
    prefixIcon: String,
    value: [String, Number],
    maxlength: {
      type: [String, Number],
      default: 2000
    },
    minRows: Number,
    maxRows: Number,
    align: String,
    disabled: Boolean,
    readonly: Boolean
  },
  data () {
    return {
      focus: false,
      rows: 0,
      formAlign: null,
      rule: null,
      prop: '',
      error: false
    }
  },
  created () {
    this.rows = this.minRows || 0
    this.setAlign()
    this.rule = this.$parent.rule
    this.prop = this.$parent.prop
  },
  methods: {
    handleInput (e) {
      if (this.type === 'textarea') {
        /*  动态跳转textarea的行数 */
        let lineHeight = Number.parseInt(getComputedStyle(e.target).getPropertyValue('line-height'))
        if (this.rows < this.maxRows || !this.maxRows) {
          if (lineHeight * this.rows < e.target.scrollHeight) {
            this.rows++
          }
        }
      }
      this.$emit('input', e.target.value)
      this.trigger('input', e.target.value)
    },
    handleFocus (e) {
      if (this.readonly) {
        /* 防止苹果手机出现‘完成’ */
        e.target.blur()
      } else {
        this.$emit('focus', e)
        this.focus = true
        this.trigger('focus', e.target.value)
      }
    },
    handleBlur (e) {
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
    display: flex;
    flex: 1;
    height: 100%;
    align-items: center;
    background-color: #fff;
    .pl-input_box {
      position: relative;
      flex: 1;
      display: inline-flex;
      align-items: center;
      input {
        display: block;
        width: 100%;
        padding-right: 28px;
        font-size: 30px;
        color: #333;
        box-sizing: border-box;
        &::-webkit-input-placeholder {
          color: #ccc;
        }
        &[type=search]::-webkit-search-cancel-button{
          -webkit-appearance: none;// 去掉默认的小×
        }
        &::-webkit-input-placeholder {
          font-size: 26px;
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
        padding-right: 40px;
        fill: #ccc;
      }
      textarea {
      }
    }
    .pl-input_prefix {
      padding: 0 28px 0 40px;
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
    padding: 20px 28px;
    textarea {
      box-sizing: border-box;
      width: 100%;
      min-height: 100px;
      line-height: 37px;
      border: none;
      outline: none;
      font-size: 28px;
      resize: none;
    }
  }
</style>
