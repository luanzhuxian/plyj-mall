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
                v-for="n of length"
                :key="n"
                :image="'https://mallcdn.youpenglai.com/static/admall/mall-management/active/prod-default.png'"
                :label="'视频课'"
                :top="'【第一节】张三三老师带您体课张三三老师带您体课张三三老师带您体课张三三老师带您体课...'"
                :bottom-left="'220人已购'"
                :line="2"
                round
                border
            />
        </ul>
    </div>
</template>

<script>
import ProductCard from '../components/Product-Card.vue'

export default {
    name: 'SlideCourses',
    components: {
        ProductCard
    },
    props: {},
    data () {
        return {
            length: 5
        }
    },
    computed: {
        swipable () {
            return this.length > 1
        }
    },
    methods: {
        jump () {

        }
    }
}
</script>

<style lang="scss" module>
.slide-courses {
    background: #fff;
    overflow: hidden;
    &.swipable {
        .list-item {
            width: 648px;
            &:nth-last-of-type(1) {
                margin-right: 28px;
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
    padding: 40px 28px;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    &::-webkit-scrollbar {
        display: none;
    }
    &-item {
        flex-shrink: 0;
        margin-left: 20px;
        padding-right: 28px;
        width: 100%;
        &:nth-of-type(1) {
            margin-left: 0;
        }
    }
}

</style>
