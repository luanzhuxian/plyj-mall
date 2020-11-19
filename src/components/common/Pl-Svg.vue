<template>
    <svg
        v-if="type === 'svg'"
        :class="$style.plSvg"
        aria-hidden="true"
        @click="clickHandler"
        :style="{
            width: truthWidth,
            height: truthHeight,
            verticalAlign: verticalAlign / 7.5 + 'vw'
        }"
        @hover="hoverHandler"
    >
        <use :xlink:href="'#' + name" />
    </svg>
    <img
        v-else-if="type === 'img'"
        :src="name"
        :style="{ width: width ? width + 'px' : height ? 'auto' : 'none', height: height ? height + 'px' : width ? 'auto' : 'none' }"
        alt=""
        @hover="hoverHandler"
        @click="clickHandler"
    >
    <i
        v-else-if="type === 'fontClass'"
        class="yaji-icon"
        :class="name"
        :style="{ fontSize: size / 7.5 + 'vw', verticalAlign: verticalAlign / 7.5 + 'vw', color }"
    />
</template>

<script>
export default {
    name: 'PlSvg',
    data () {
        return {
            count: ''
        }
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        width: {
            type: [Number, String],
            default: ''
        },
        height: {
            type: [Number, String],
            default: ''
        },
        size: {
            type: [Number, String],
            default: '32'
        },
        verticalAlign: {
            type: [Number, String],
            default: '-8'
        },
        // 图标为fontClass时的颜色
        color: {
            type: String,
            default: ''
        },
        // 'svg' | 'img' | 'fontClass'
        type: {
            type: String,
            default: 'svg'
        }
    },
    computed: {
        truthWidth () {
            if (this.width) {
                return `${ this.width / 7.5 }vw`
            }
            // 如果没设置宽，默认宽等于高
            if (this.height) {
                return `${ this.height / 7.5 }vw`
            }
            return null
        },
        truthHeight () {
            if (this.height) {
                return `${ this.height / 7.5 }vw`
            }
            // 如果没设置高，默认高等于宽
            if (this.width) {
                return `${ this.width / 7.5 }vw`
            }
            return null
        }
    },
    methods: {
        clickHandler (e) {
            this.$emit('click', e)
        },

        hoverHandler (e) {
            this.$emit('hover', e)
        }
    }
}

</script>

<style module lang="scss">
    .pl-svg {
        vertical-align: -2px;
    }
</style>
