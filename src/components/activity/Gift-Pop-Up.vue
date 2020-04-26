<template>
    <pl-mask :show="show" @close="close">
        <div :class="$style.content">
            <template v-if="dangerousRenderHtml">
                <div :class="$style.title" v-html="title" />
                <div :class="$style.message" v-html="message" />
            </template>
            <template v-else>
                <div :class="$style.title" v-text="title" />
                <div :class="$style.message" v-text="message" />
            </template>
            <slot />
            <div :class="$style.buttons" v-if="buttonLeftText || buttonRightText">
                <button v-if="buttonLeftText" :class="$style.buttonLeft" v-text="buttonLeftText" @click="buttonLeftClick" />
                <button v-if="buttonRightText" :class="$style.buttonRight" v-text="buttonRightText" @click="buttonRightClick" />
            </div>
        </div>
    </pl-mask>
</template>

<script>
export default {
    name: 'GiftPopUp',
    props: {
        show: Boolean,
        buttonLeftText: {
            type: String,
            default: ''
        },
        buttonRightText: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            default: ''
        },
        dangerousRenderHtml: Boolean
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        },

        /**
         * 左侧按钮点击事件
         * @param e {Event}
         */
        buttonLeftClick (e) {
            this.$emit('buttonLeftClick', e, this.close)
        },

        /**
         * 右侧按钮点击事件
         * @param e {Event}
         */
        buttonRightClick (e) {
            this.$emit('buttonRightClick', e, this.close)
        }
    }
}
</script>

<style module lang="scss">
    .content {
        width: 506px;
        padding: 48px 16px;
        border-radius: 20px;
        background: #d6565c url("https://mallcdn.youpenglai.com/static/mall/2.9.0/gift-bg.png") no-repeat center top;
        background-size: 100%;
    }
    .title {
        font-size: 40px;
        font-weight: bold;
        text-align: center;
        color: #fff;
    }
    .message {
        margin-top: 24px;
        margin-bottom: 32px;
        padding: 0 60px;
        font-size: 24px;
        text-align: center;
        color: #EEE;
    }
    .buttons {
        display: flex;
        margin-top: 48px;
        padding: 0 24px;
        > button {
            flex: 1;
            line-height: 74px;
            font-size: 26px;
            color: #A56113;
            border-radius: 37px;
            &:nth-of-type(1) {
                margin-left: 0;
            }
        }
        .buttonLeft {
            background-color: #FDEC5A;
        }
        .buttonRight {
            background-color: #FEF5A4;
            margin-left: 20px;
        }
    }
</style>
