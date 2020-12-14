<template>
    <div
        :class="$style.poster"
        :style="{
            '--bc': borderColor,
            '--bgc1': bgc1,
            '--bgc2': bgc2
        }"
    >
        <!-- 展示海报按钮 -->
        <button :class="$style.showPoster" @click="showPoster">
            <pl-svg name="icon-poster-512b1" fill="#fff" height="25" vertical-align="-4" />
            <span>海报</span>
        </button>
        <pl-mask :show="show" @close="closeHandler">
            <pl-svg :class="$style.loading" name="icon-loading" fill="#fff" height="45" vertical-align="-4" />
        </pl-mask>
    </div>
</template>

<script>
export default {
    name: 'SignInPoster',
    props: {
        show: Boolean,
        borderColor: {
            type: String,
            default: '#FFE3C8'
        },
        // 背景色1
        bgc1: {
            type: String,
            default: '#FF981A'
        },
        // 背景色1
        bgc2: {
            type: String,
            default: '#EE4620'
        }
    },
    methods: {
        showPoster () {
            this.$emit('update:show', true)
        },
        closeHandler () {
            this.$emit('update:show', false)
            this.$emit('close', false)
        }
    }
}
</script>

<style module lang="scss">
    .show-poster {
        position: fixed;
        right: 0;
        top: 306px;
        z-index: 1;
        height: 48px;
        padding: 0 15px;
        border: 1px solid var(--bc);
        border-right: none;
        border-radius: 24px 0 0 24px;
        line-height: 48px;
        background: linear-gradient(90deg, var(--bgc1), var(--bgc2));
        letter-spacing: 2px;

        > span {
            display: inline-block;
            margin-left: 6px;
            color: #fff;
            font-size: 23px;
        }
    }
    .loading {
        &:global {
            animation: rotate 2s linear infinite;
        }
    }
</style>
