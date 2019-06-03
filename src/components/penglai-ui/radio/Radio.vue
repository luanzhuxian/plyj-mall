<template>
  <div
    role="radio"
    class="radio"
    @click="onClick"
  >
    <div
      class="radio__icon"
      :class="{ ['radio__icon--' + shape]: shape, 'radio__icon--disabled': isDisabled, 'radio__icon--checked': checked, 'radio__icon--border': border }"
      :style="{ fontSize: suffixPx(iconSize) }"
      @click="onClickIcon"
    >
      <pl-svg
        v-if="icon && checked"
        :name="icon"
        color="#FFF"
      />
      <slot
        v-else
        name="icon"
      />
    </div>
    <span
      v-if="$slots.default"
      class="radio__label"
      :class="{ ['radio__label--' + labelPosition]: labelPosition, 'radio__icon--disabled': isDisabled }"
      @click="onClickLabel"
    >
      <slot />
    </span>
  </div>
</template>

<script>
import { ChildrenMixin } from '../../../mixins/relation'
import { suffixPx } from '../../../assets/js/util'

export default {
  name: 'RadioComponent',
  mixins: [ChildrenMixin('RadioGroupComponent')],
  props: {
    name: {
      type: [String, Number],
      default () {
        return null
      }
    },
    value: {
      type: [String, Number],
      default () {
        return null
      }
    },
    icon: {
      type: String,
      default: 'check'
    },
    iconSize: {
      type: Number,
      default: 40
    },
    checkedColor: {
      type: String,
      default: '#FE7700'
    },
    labelPosition: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    labelDisabled: Boolean,
    border: Boolean,
    shape: {
      type: String,
      default: 'round'
    }
  },
  data () {
    return {
      suffixPx
    }
  },
  computed: {
    isDisabled () {
      return (this.parent && this.parent.disabled) || this.disabled
    },
    tabindex () {
      if (this.isDisabled || !this.checked) {
        return -1
      }
      return 0
    },
    currentValue: {
      get () {
        return this.parent ? this.parent.value : this.value
      },
      set (val) {
        (this.parent || this).$emit('input', val)
      }
    },
    checked () {
      return this.currentValue === this.name
    }
  },
  methods: {
    onClickIcon () {
      if (!this.isDisabled) {
        this.currentValue = this.name // 触发setter
      }
    },
    onClickLabel () {
      if (!this.isDisabled && !this.labelDisabled) {
        this.currentValue = this.name // 触发setter
      }
    },
    onClick (event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="scss">
.radio {
  display: flex;
  align-items: center;
  overflow: hidden;
  user-select: none;

  &__icon {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;

    > svg {
      width: 24px;
    }

    &--round {
      border-radius: 50%;
    }

    &--checked {
      background-color: #FE7700;
    }

    &--disabled {
      background-color: #ebedf0;
      border-color: #c8c9cc !important;
    }

    &--border {
      border: 1px solid #FE7700;
    }
  }

  &__label {
    margin-left: 24px;
    color: #333;

    &--left {
      float: left;
      margin: 0 24px 0 0;
    }

    &--disabled {
      color: #999;
    }
  }
}
</style>
