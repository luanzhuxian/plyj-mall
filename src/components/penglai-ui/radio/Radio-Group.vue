<template>
    <div
        role="radiogroup"
        class="pl-radio-group"
        :class="{ 'radio-group__inline': inline }"
    >
        <slot />
    </div>
</template>

<script>

export default {
    name: 'PlRadioGroup',
    props: {
        value: {
            type: [String, Number, Boolean, Object, Array],
            default () {
                return null
            }
        },
        inline: Boolean,
        disabled: Boolean
    },
    data () {
        return {
            values: {
                defaultValue: null
            }
        }
    },
    model: {
        event: 'change',
        prop: 'value'
    },
    watch: {
        value: {
            handler (value) {
                this.values.defaultValue = value
            },
            immediate: true
        }
    },
    provide () {
        return {
            changeHandler: this.changeHandler,
            values: this.values
        }
    },
    methods: {
        changeHandler (value) {
            this.$emit('change', value)
        }
    }
}
</script>

<style lang="scss">
</style>
