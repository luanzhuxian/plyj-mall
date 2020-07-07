<template>
    <div :class="$style.detaiTabs">
        <div :class="$style.tabs">
            <template v-for="item of tabs">
                <div
                    v-if="!item.hidden"
                    :key="item.value"
                    :class="{ [$style.activeTab]: value === item.value }"
                    v-text="item.label"
                    @click="clickHandler(item.value)"
                />
            </template>
        </div>
        <div :class="$style.content">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'DetailTabs',
    model: {
        event: 'change',
        prop: 'value'
    },
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        // [{ lebel: 'text', value: 1, hidden: false }]
        tabs: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        clickHandler (val) {
            this.$emit('change', val)
        }
    }
}
</script>

<style module lang="scss">
    .detaiTabs {
        margin-top: 20px;
        background-color: #fff;
        > .tabs {
            display: flex;
            justify-content: space-around;
            align-items: center;
            border-bottom: 1px solid #e7e7e7;
            > div {
                width: max-content;
                font-size: 26px;
                color: #999;
                height: 90px;
                line-height: 90px;
                box-sizing: border-box;
                font-weight: bold;
                &.activeTab {
                    color: #000;
                    border-bottom: 2px solid #000;
                }
            }
        }
    }
</style>
