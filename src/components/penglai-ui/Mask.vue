<template>
    <transition name="fade">
        <div class="pl-mask" v-if="show">
            <slot />
            <pl-svg name="icon-close3" fill="#fff" width="30" @click="close" />
        </div>
    </transition>
</template>

<script>
export default {
    name: 'PlMask',
    props: {
        show: Boolean
    },
    watch: {
        show (val) {
            if (val) {
                window.addEventListener('popstate', this.popstateHandler)
            } else {
                window.removeEventListener('popstate', this.popstateHandler)
            }
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
            this.$emit('close')
        },
        popstateHandler (e) {
            this.close()
        }
    }
}
</script>

<style lang="scss">
    .pl-mask {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .7);
        z-index: 10000;
        > svg {
            margin-top: 20px;
        }
    }
</style>
