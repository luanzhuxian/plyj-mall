<template>
    <div
        role="radio"
        class="pl-radio"
        :class="{ 'pl-radio__inline': inline }"
        @click="onClick"
    >
        <div v-if="position === 'left'" class="pl-radio-icon pl-radio-icon__left">
            <pl-svg
                name="icon-weixuanzhong1"
                width="36"
            />
        </div>
        <div class="pl-radio-content">
            <slot />
        </div>
        <div v-if="position === 'right'" class="pl-radio__icon pl-radio-icon__right">
            <pl-svg
                v-show="!checked"
                name="icon-weixuanzhong1"
                width="36"
            />
            <pl-svg
                v-show="checked"
                name="icon-xuanzhong"
                width="36"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'PlRadio',
    props: {
        // 选择按钮的位置 left or right
        position: {
            type: String,
            default: 'right'
        },
        inline: Boolean,
        // 要绑定的值
        label: {
            type: [String, Number, Boolean, Object, Array],
            default () {
                return null
            }
        },
        // 绑定的值
        value: {
            type: [String, Number, Boolean, Object, Array],
            default () {
                return null
            }
        }
    },
    inject: {
        values: {
            from: 'values',
            default: null
        },
        changeHandler: {
            from: 'changeHandler',
            default: null
        }
    },
    model: {
        event: 'change',
        prop: 'value'
    },
    computed: {
        id () {
            const { _uid: uid } = this
            return `pl-radio_${ uid }`
        },
        checked () {
            return this.label === this.value || this.label === (this.values ? this.values.defaultValue : null)
        }
    },
    methods: {
        onClick () {
            this.$emit('change', this.label)
            if (this.changeHandler) {
                this.changeHandler(this.label)
            }
        }
    }
}
</script>

<style lang="scss">
    .pl-radio {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        &__inline {
            display: inline-flex;
        }
        > .pl-radio-content {
            width: 100%;
        }
    }
</style>
