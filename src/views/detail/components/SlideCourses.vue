<template>
    <div
        :class="{
            [$style.slideCourses]: true,
            [$style.swipable]: swipable
        }"
    >
        <div :class="$style.top">
            <pl-svg name="icon-star-label-orange-918d9" height="36" />
            <b>相关课程</b>
        </div>
        <ul :class="$style.list">
            <product-card
                :class="$style.listItem"
                v-for="(item, index) of data"
                :key="index"
                label="系列课"
                :image="item.courseImg"
                :top="item.courseName"
                :bottom-left="`${item.sale}人已购`"
                :max-line="2"
                round
                border
                :route="{
                    name: 'Curriculum',
                    params: { productId: item.id }
                }"
            />
        </ul>
    </div>
</template>

<script>
import ProductCard from './Product-Card.vue'

export default {
    name: 'SlideCourses',
    components: {
        ProductCard
    },
    props: {
        data: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {}
    },
    computed: {
        swipable () {
            return this.data.length > 1
        }
    }
}
</script>

<style lang="scss" module>
.slide-courses {
    background: #fff;
    overflow: hidden;
    &.swipable {
        .list {
            overflow-x: scroll;
            &-item {
                width: 648px;
            }
        }
    }
}

.top {
    display: flex;
    align-items: center;
    padding: 0 28px;
    line-height: 100px;
    color: #000;
    font-size: 32px;
    border-bottom: 1px solid #e7e7e7;
    > svg {
        margin-right: 14px;
    }
}
.list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 40px 0;
    width: 100%;
    overflow-x: hidden;
    &::after {
        content: '.';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    &::-webkit-scrollbar {
        display: none;
    }
    &-item {
        box-sizing: border-box;
        flex-shrink: 0;
        margin-left: 20px;
        padding-right: 28px;
        width: calc(100vw - 56px);
        &:nth-of-type(1) {
            margin-left: 28px;
        }
        &:nth-last-of-type(1) {
            margin-right: 28px;
        }
    }
}

</style>
