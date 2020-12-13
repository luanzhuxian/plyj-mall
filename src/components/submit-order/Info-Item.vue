<template>
    <div :class="$style.infoItem" @click="clickHandler">
        <div
            :class="{
                [$style.content]: true
            }"
        >
            <div :class="$style.header">
                <div :class="$style.itemLabel">
                    <div :class="$style.label">
                        <slot name="label" />
                    </div>
                    <div :class="$style.labelRight">
                        <slot name="label-right" />
                    </div>
                </div>
                <div :class="$style.itemContent">
                    <pl-svg
                        :class="{
                            [$style.collapse]: true,
                            [$style.collapsed]: !footerHeight
                        }"
                        v-if="hasCollapse"
                        name="icon-right"
                        width="24"
                        fill="#ccc"
                        @click="collapse"
                    />
                    <slot v-else name="content" />
                </div>
            </div>

            <div :class="$style.footer" :style="{ '--height': footerHeight }" ref="footer">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InfoItem',
    data () {
        return {
            footerHeight: ''
        }
    },
    props: {
        // 是否可折叠
        hasCollapse: Boolean
    },
    mounted () {
        this.footerHeight = `${ this.$refs.footer.offsetHeight }px`
        this.fixedFooterHeight = this.footerHeight
    },
    methods: {
        clickHandler (e) {
            this.$emit('click', e)
        },
        collapse () {
            this.footerHeight = this.footerHeight ? 0 : this.fixedFooterHeight
        }
    }
}
</script>

<style module lang="scss">
    .infoItem {
        padding-left: 68px;
        padding-right: 28px;
        justify-content: space-between;
        line-height: 50px;
        font-size: 24px;
        border: 2px solid #fff;
        .content {
            flex: 1;
            > .header {
                display: flex;
                justify-content: space-between;
                > .itemLabel {
                    display: flex;
                    justify-content: space-between;
                    width: max-content;
                    color: #333;
                }
            }
            > .footer {
                height: var(--height);
                transition: height .2s ease;
                overflow: hidden;
            }
        }
        .itemContent {
            margin-left: 24px;
            color: #666;
            > .collapse {
                transform: rotate(-90deg);
                transition: transform .2s ease;
                &.collapsed {
                    transform: rotate(90deg);
                }
            }
        }
    }
</style>
