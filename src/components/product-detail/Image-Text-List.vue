<template>
    <ul :class="$style.imageTextList">
        <li :class="$style.imageTextListItem" v-for="(item, index) of data" :key="index">
            <pl-svg name="icon-pdf-887fd" width="40" />
            <p>
                <i v-text="item.name" />
                <span>.pdf</span>
            </p>
            <button :class="$style.imageTextListButton">
                <template v-if="isBought">
                    <span :class="$style.highlight" @click="handleClick(index)">打开资料</span>
                </template>
                <span v-else>购买后可查看</span>
            </button>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'ImageTextList',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        isBought: Boolean
    },
    data () {
        return {}
    },
    methods: {
        handleClick (index) {
            this.$emit('preview', index)
        }
    }
}
</script>

<style module lang="scss">
.image-text-list {
    padding: 0 30px;
    background-color: #fff;
    &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        height: 120px;
        line-height: 32px;
        font-size: 24px;
        color: #666;
        border-bottom: 2px solid #f0f0f0;
        &:nth-last-child(1) {
            border-bottom: none;
        }
        > p {
            display: flex;
            flex: 1;
            width: 0;
            padding: 0 20px;
            @include elps();
            > i {
                @include elps();
            }
        }
    }
    &-button {
        margin-left: auto;
        color: #666;
        > .highlight {
            text-decoration: none;
            color: #f2b036;
        }
    }
}

</style>
