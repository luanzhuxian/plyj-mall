<template>
    <div :class="$style.infoItem" @click="clickHandler">
        <div :class="$style.content">
            <div :class="$style.itemLabel">
                <slot name="label" />
            </div>
            <div :class="$style.itemContent">
                <slot name="content" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InfoItem',
    methods: {
        clickHandler (e) {
            this.$emit('click', e)
        }
    }
}
</script>

<style module lang="scss">
    .infoItem {
        display: flex;
        padding-left: 68px;
        padding-right: 28px;
        justify-content: space-between;
        line-height: 50px;
        font-size: 24px;
        border: 2px solid #fff;
        .content {
            flex: 1;
            display: flex;
            justify-content: space-between;

            .itemLabel {
                width: max-content;
                color: #333;
            }
        }
        .itemContent {
            margin-left: 24px;
            color: #666;
        }
    }
</style>
