<template>
    <div
        :class="[$style.fieldBox, $style[size]]"
        :style="{ color }"
        @click="clickHandler"
    >
        <!-- prefix -->
        <template v-if="!$slots.prefix">
            <pl-svg
                :class="$style.prefix"
                v-if="icon"
                :name="icon"
                :fill="iconColor"
                :width="map[size].iconWidth"
                :height="map[size].iconHeight"
            />
        </template>
        <slot v-else name="prefix" />

        <!-- label -->
        <div
            :class="$style.label"
            :style="{
                width: labelWidth ? labelWidth / 7.5 + 'vw' : 'max-content',
                textAlign: labelAlign
            }"
            v-text="label"
        />

        <!-- content -->
        <div v-if="!$slots.content && content" :class="$style.content" v-text="content" />
        <div v-else :class="$style.content">
            <slot />
        </div>

        <!-- suffix -->
        <div v-if="!$slots.suffix" :class="$style.suffix">
            <pl-svg
                v-if="clickable"
                name="icon-right"
                fill="#ccc"
                width="20"
            />
        </div>
        <slot v-else name="suffix" />
    </div>
</template>

<script>
export default {
    name: 'Field',
    props: {
        icon: {
            type: String,
            default: ''
        },
        iconColor: {
            type: String,
            default: '#ccc'
        },
        color: {
            type: String,
            default: '#999999'
        },
        label: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        labelWidth: {
            type: Number,
            default: 0
        },
        labelAlign: {
            type: String,
            default: 'left'
        },
        // small mideum
        size: {
            type: String,
            default: 'mideum'
        },
        clickable: Boolean
    },
    data () {
        return {
            map: {
                small: {
                    iconWidth: 30,
                    iconHeight: 30
                },
                mideum: {
                    iconWidth: 30,
                    iconHeight: 30
                }
            }
        }
    },
    methods: {
        clickHandler (e) {
            if (this.clickable) {
                this.$emit('click', e)
            }
        }
    }
}
</script>

<style module lang="scss">
.field-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 88px;
    background-color: #fff;
        &.small {
        line-height: 76px;
        > .label {
            font-size: 24px;
        }
        > .content {
            font-size: 24px;
        }
    }
}
.label {
    font-size: 28px;
}
.content {
    flex: 1;
    width: 0;
    font-size: 28px;
    // font-weight: bold;
    color: #000;
    @include elps();
}
.prefix {
    margin-right: 10px;
}
.suffix {
    width: 20px;
    text-align: center;
}
</style>
