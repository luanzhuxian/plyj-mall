<template>
    <transition name="fade">
        <div
            class="message-box"
            v-show="showMask"
            @click.self="() => { closeOnClickMask ? handleCancel() : '' }"
            @transitionend="transitionend"
        >
            <transition
                enter-active-class="animated bounceInDown"
                leave-active-class="animated bounceOutDown"
            >
                <div
                    class="message-box-content"
                    v-show="showBox"
                >
                    <div class="message">
                        <template v-if="useDangersHtml">
                            <p
                                class="main-message"
                                v-html="message"
                            />
                            <p
                                class="vice-message"
                                v-if="viceMessage"
                                v-html="viceMessage"
                            />
                        </template>
                        <template v-else>
                            <pre
                                class="main-message"
                                v-text="message"
                            />
                            <pre
                                class="vice-message"
                                v-if="viceMessage"
                                v-text="viceMessage"
                            />
                        </template>
                        <input
                            v-if="type === 'propmt' && hasDefaultInput"
                            ref="input"
                            class="propmt-input"
                            v-model="propmtValue"
                            :placeholder="placeholder"
                            type="text"
                        >
                    </div>
                    <div class="message-box-vnode">
                        <slot />
                    </div>
                    <div class="buttons">
                        <button
                            @click="handleCancel"
                            v-if="hasCancelButton"
                            class="message-box-cancel"
                            v-text="cancelText"
                            :style="cancelStyle"
                        />
                        <button
                            v-if="hasConfirmButton"
                            @click="handleConfirm"
                            class="message-box-confirm"
                            v-text="confirmText"
                            :style="confirmStyle"
                        />
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'MessageBox',
    data () {
        return {
            show: false,
            showMask: false,
            showBox: false,
            hasCancelButton: true,
            hasConfirmButton: true,
            hasDefaultInput: true,
            propmtValue: '',
            placeholder: '',

            /*
             * type等于propmt时校验的校验规则，如果为空，则不校验
             * arrayObject [{ validator: Function, message: String }]
             * */
            rules: []
        }
    },
    props: {
        cancelText: {
            type: String,
            default: ''
        },
        confirmText: {
            type: String,
            default: ''
        },
        confirmStyle: {
            type: Object,
            default () {
                return {}
            }
        },
        cancelStyle: {
            type: Object,
            default () {
                return {}
            }
        },

        // 渲染html
        useDangersHtml: Boolean,
        message: {
            type: String,
            default: ''
        },
        viceMessage: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'confirm'
        },

        // 点击浮层是否关闭
        closeOnClickMask: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        show (val) {
            if (val) {
                this.showMask = true
                setTimeout(() => {
                    this.showBox = true
                    if (this.type === 'propmt') {
                        this.$nextTick(() => {
                            this.$refs.input && this.$refs.input.focus()
                        })
                    }
                }, 200)
                window.addEventListener('popstate', this.popstateHandler)
            } else {
                window.removeEventListener('popstate', this.popstateHandler)
                this.showBox = false
                setTimeout(() => {
                    this.showMask = false
                }, 600)
            }
        }
    },
    methods: {
        popstateHandler (e) {
            this.handleCancel()
        },
        handleCancel () {
            this.show = false
            this.$emit('cancel')
        },
        async handleConfirm () {
            try {
                if (this.type === 'propmt') {
                    if (this.hasDefaultInput && !this.validate()) {
                        return
                    }
                    // 用于插槽校验
                    if (!this.hasDefaultInput && !this.customValidate()) {
                        return
                    }
                }
                await this.$emit('confirm', this.propmtValue)
                this.show = false
            } catch (e) {
                throw e
            }
        },
        validate () {
            const val = this.propmtValue
            for (const rule of this.rules) {
                if (rule.required) {
                    if (!val.trim()) {
                        this.$warning(rule.message)
                        return false
                    }
                } else if (rule.validator) {
                    if (!rule.validator(val)) {
                        this.$warning(rule.message)
                        return false
                    }
                }
            }
            return true
        },
        transitionend () {
            this.propmtValue = ''
            if (!this.show) {
                const el = this.$el
                this.$destroy()
                document.body.removeChild(el)
            }
        }
    }
}
</script>

<style lang="scss">
.message-box {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .65);
    z-index: 9999;
}
/*.icon {
    width: 180px;
    height: 180px;
    margin-bottom: 24px;
  }*/
.message-box-content {
    position: relative;
    width: 540px;
    margin: 0 auto;
    background-color: #fff;
    text-align: center;
    border-radius: 10px;
    overflow: hidden;
    .message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100px;
        max-width: 80vw;
        padding: 40px 30px;
        color: #2e2e2e;
    }
    .vice-message {
        margin-top: 22px;
        font-size: 28px;
        line-height: 40px;
        color: #b4b4b4;
        white-space: pre-wrap;
        word-break: break-all;
    }
    .main-message {
        white-space: pre-wrap;
        word-break: break-all;
        font-size: 32px;
        line-height: 44px;
        font-weight: bold;
        color: #000;
        box-sizing: border-box;
    }
    .propmt-input {
        width: 80%;
        height: 80px;
        font-size: 28px;
        text-align: center;
    }
}
.buttons {
    display: flex;
    border-top: 1px solid #d3d1d2;
    button {
        flex: 1;
        border: none;
        height: 100px;
        font-size: 34px;
        font-weight: 500;
        background-color: #fff;
        &.message-box-confirm {
            color: #f2b036;
        }
        &.message-box-cancel {
            position: relative;
            color: #666;
            font-weight: normal;
            border-right: 1px solid #d3d1d2;
        }
    }
}

</style>
