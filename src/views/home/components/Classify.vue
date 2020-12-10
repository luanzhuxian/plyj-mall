<template>
    <div :class="$style.classify">
        <ul :class="$style.classifyList" v-if="show">
            <router-link
                :class="$style.classifyListItem"
                v-for="(item, i) of list"
                :key="i"
                tag="li"
                :to="{
                    name: 'Classify',
                    params: { optionId: item.value }
                }"
            >
                <img :class="$style.classifyListItemIcon" :src="item.image" alt="">
                <div :class="$style.classifyListItemName">
                    {{ item.name }}
                </div>
            </router-link>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'Classify',
    props: {
        data: {
            type: Object,
            default: () => ({ values: [] })
        }
    },
    computed: {
        list () {
            return this.data.values.filter(item => item.id && item.name)
        },

        show () {
            return this.list.length
        }
    }
}
</script>

<style lang="scss" module>
.classify-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    height: 214px;
    &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100px;
        &-icon {
            width: 100px;
            height: 100px;
            object-fit: cover;
        }
        &-name {
            font-size: 20px;
            line-height: 28px;
            color: #333333;
            text-align: center;
        }
    }
}

</style>
