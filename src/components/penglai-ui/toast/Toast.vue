<template>
    <transition name="show-pl-toast">
        <div
            class="pl-toast"
            :class="{ 'pl-toast-visible': show }"
            v-show="show"
        >
            <pl-svg
                v-if="type === 'error'"
                class="pl-toast-icon"
                name="icon-shibai"
                fill="#fff"
                width="72"
            />
            <pl-svg
                v-if="type === 'success'"
                class="pl-toast-icon"
                name="icon-chenggong"
                fill="#fff"
                width="72"
            />
            <pl-svg
                v-if="type === 'warning'"
                class="pl-toast-icon"
                name="icon-warning"
                fill="#fff"
                width="72"
            />
            <div class="toast-message">
                <p v-text="message" />
                <p class="toast-vice-message" v-text="viceMessage" />
                <slot />
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'Toast',
    components: {},
    data () {
        return {
            show: false,
            message: '',
            viceMessage: '',
            timer: 0,
            type: ''
        }
    },
    methods: {
        close () {
            this.show = false
        },
        closed () {
            document.body.removeChild(this.$el)
        }
    }
}
</script>

<style lang="scss">
    .pl-toast {
        position: fixed;
        top: 50%;
        left: 50%;
        max-width: 90vw;
        transform: translate(-50%, -50%);
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 58px 62px;
        word-break: keep-all;
        background-color: rgba(0, 0, 0, .7);
        color: #fff;
        text-align: center;
        border-radius: 4px;
        box-sizing: border-box;
        z-index: 9999;

        &.pl-toast-visible {
            /*animation: pl-toast-animation .4s;*/
            /*animation-fill-mode: forwards;*/
        }

        .toast-message {
            width: max-content;
            max-width: 100%;
            margin-top: 16px;
            font-size: 32px;
            word-break: break-all;
            white-space: pre-wrap;

            .toast-vice-message {
                width: max-content;
                max-width: 100%;
                margin-top: 4px;
                font-size: 24px;
                word-break: break-all;
                white-space: pre-wrap;
            }
        }
    }
    @keyframes pl-toast-animation {
        0% { transform: translate(-50%, -50%) scale(0); }
        30% { transform: translate(-50%, -50%) scale(1.1); }
        60% { transform: translate(-50%, -50%) scale(0.92); }
        80% { transform: translate(-50%, -50%) scale(1.05); }
        90% { transform: translate(-50%, -50%) scale(0.97); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }
    @keyframes pl-toast-animation-backof {
        0% { transform: translate(-50%, -50%) scale(1); }
        30% { transform: translate(-50%, -50%) scale(0.9); }
        60% { transform: translate(-50%, -50%) scale(1.2); }
        100% { transform: translate(-50%, -50%) scale(0); }
    }
    .show-pl-toast-enter-active {
        animation: pl-toast-animation .4s;
        animation-fill-mode: backwards;
    }
    .show-pl-toast-leave-active {
        animation: pl-toast-animation-backof .4s;
        animation-fill-mode: forwards;
    }
    .show-pl-toast-leave, .show-pl-toast-enter-to {
        transform: translate(-50%, -50%) scale(1);
    }
    .show-pl-toast-enter, .show-pl-toast-leave-to {
        transform: translate(-50%, -50%) scale(0);
    }
</style>
