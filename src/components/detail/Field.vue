<template>
    <div :class="$style.fieldBox" @click="clickHandler">
        <div
            :class="$style.label"
            v-text="label"
            :style="{
                width: labelWidth ? labelWidth / 7.5 + 'vw' : 'max-content',
                textAlign: labelAlign
            }"
        />
        <div v-if="content" :class="$style.fieldContent" v-text="content" />
        <div v-else :class="$style.fieldContent">
            <slot />
        </div>
        <div v-if="canClick" :class="$style.canClick">
            <pl-svg name="icon-right" fill="#ccc" width="20" />
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
        canClick: Boolean,
        labelWidth: {
            type: Number,
            default: 0
        },
        labelAlign: {
            type: String,
            default: 'left'
        }
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
    justify-content: flex-start;
    height: 88px;
    margin-top: 20px;
    padding: 0 24px;
    background-color: #fff;
  }
  .label {
    font-size: 28px;
    color: #999;
  }
  .field-content {
    flex: 1;
    font-size: 28px;
    color: #000;
    @include elps();
  }
  .can-click {
    width: 20px;
    text-align: center;
  }
</style>
