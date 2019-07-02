<template>
  <div :class="$style.fieldBox" @click="clickHandler">
    <div :class="$style.label" v-text="label" />
    <div v-if="content" :class="$style.fieldContent" v-text="content" />
    <div :class="$style.fieldContent">
      <slot />
    </div>
    <div v-if="canClick" :class="$style.canClick">
      <pl-svg name="right" color="#ccc" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Field',
  props: {
    label: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    canClick: Boolean
  },
  methods: {
    clickHandler (e) {
      if (this.canClick) {
        this.$emit('click', e)
      }
    }
  }
}
</script>

<style module lang="scss">
  .field-box {
    display: flex;
    align-items: center;
    height: 88px;
    margin-top: 20px;
    padding: 0 24px;
    background-color: #fff;
  }
  .label {
    width: max-content;
    margin-right: 40px;
    font-size: 28px;
    color: #999;
  }
  .fieldContent {
    flex: 1;
    font-size: 28px;
    color: #000;
  }
  .canClick {
    svg {
      width: 18px;
    }
  }
</style>
