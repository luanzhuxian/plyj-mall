<template>
    <div :class="$style.searchList">
        <pl-tab
            :class="$style.tabBar"
            size="small"
            :tabs="tabs"
            :active-id.sync="type"
            @change="onTabChange"
        >
            <div
                :class="$style.tabPane"
                v-for="(item, i) of tabs"
                :key="i"
                :slot="'tab-pane-' + i"
            />
        </pl-tab>
        <tab-container
            v-model="type"
            swipeable
        >
            <tab-container-item id="PRODUCT">
                <div ref="productListContainer" :class="$style.list">
                    <load-more
                        ref="productList"
                        :form="productForm"
                        :request-methods="searchProduct"
                        icon="icon-search-no-content-05634"
                        no-content-tip="抱歉，没有找到相关商品"
                        no-pull-refresh
                        @refresh="refreshProductHandler"
                        @more="refreshProductHandler"
                    >
                        <template v-slot="{ list }">
                            <lesson-item
                                :class="$style.listItem"
                                v-for="(item, index) of productList"
                                :key="index"
                                type="PRODUCT"
                                :data="item"
                                :id="item.id"
                                :title="item.productName"
                                :desc="item.productDesc"
                                :img="item.productMainImage + '?x-oss-process=style/thum-middle'"
                                :price="item.productSkuModels.length && item.productSkuModels[0].price"
                                :original-price="item.productSkuModels.length && item.productSkuModels[0].originalPrice"
                            />
                        </template>
                    </load-more>
                </div>
            </tab-container-item>

            <tab-container-item id="COURSE">
                <div ref="courseListContainer" :class="$style.list">
                    <load-more
                        ref="courseList"
                        :form="courseForm"
                        :request-methods="getVideoList"
                        icon="icon-search-no-content-05634"
                        no-content-tip="抱歉，没有找到相关课程"
                        no-pull-refresh
                        @refresh="refreshCourseHandler"
                        @more="refreshCourseHandler"
                    >
                        <template v-slot="{ list }">
                            <lesson-item
                                :class="$style.listItem"
                                v-for="(item, index) of courseList"
                                :key="index"
                                type="COURSE"
                                :data="item"
                                :id="item.id"
                                :label="item.courseType === 2 ? '系列课' : '单课'"
                                :title="item.courseName"
                                :img="item.courseImg + '?x-oss-process=style/thum-middle'"
                                :price="item.sellingPrice"
                                :original-price="item.originalPrice"
                            >
                                <template>
                                    <div :class="$style.lecturer" v-if="item.lecturer" v-text="`主讲人：${item.lecturer}`" />
                                </template>
                            </lesson-item>
                        </template>
                    </load-more>
                </div>
            </tab-container-item>
        </tab-container>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LessonItem from '../../../components/item/Lesson-Item.vue'
import LoadMore from '../../../components/common/Load-More.vue'
import TabContainer from '../../../components/penglai-ui/tab-container/Tab-Container.vue'
import TabContainerItem from '../../../components/penglai-ui/tab-container/Tab-Container-Item.vue'
import { searchProduct } from '../../../apis/search'
import { getVideoList } from '../../../apis/online-classroom'
import { throttle } from '../../../assets/js/util'

export default {
    name: 'SearchList',
    components: {
        LessonItem,
        LoadMore,
        TabContainer,
        TabContainerItem
    },
    props: {
        query: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            tabs: [{
                name: '精选商品',
                id: 'PRODUCT'
            }, {
                name: '线上课程',
                id: 'COURSE'
            }],
            type: 'PRODUCT',
            productList: [],
            courseList: [],
            productForm: {
                searchContent: '',
                current: 1,
                size: 10
            },
            courseForm: {
                searchParam: '',
                current: 1,
                size: 10
            },
            searchProduct,
            getVideoList,
            productScrollHandler: null,
            courseScrollHandler: null
        }
    },
    computed: {
        ...mapGetters(['userId'])
    },
    created () {
        this.type = 'PRODUCT'
    },
    mounted () {
        const {
            productList,
            productListContainer,
            courseList,
            courseListContainer
        } = this.$refs

        this.productScrollHandler = this.initLoadMore(productList, productListContainer)
        this.courseScrollHandler = this.initLoadMore(courseList, courseListContainer)
    },
    beforeDestroy () {
        const { productListContainer, courseListContainer } = this.$refs

        productListContainer.removeEventListener('scroll', this.productScrollHandler)
        courseListContainer.removeEventListener('scroll', this.courseScrollHandler)
        this.productScrollHandler = null
        this.courseScrollHandler = null
    },
    methods: {
        initLoadMore (loadMore, container) {
            const handler = e => loadMore.infiniteScroll(e, loadMore.$el.offsetHeight, container.scrollTop, container.clientHeight)
            container.addEventListener('scroll', throttle(handler, 200), { passive: true })
            return handler
        },
        onTabChange ({ id, ref }) {
            this.type = id
        },
        refreshProductHandler (list) {
            for (const item of list) {
                item.productSkuModels.sort((a, b) => a.price - b.price)
            }
            this.productList = list
            this.$emit('refresh')
        },
        refreshCourseHandler (list) {
            this.courseList = list
            this.$emit('refresh')
        },
        refresh (query = this.query) {
            this.productForm.searchContent = query
            this.courseForm.searchParam = query
            this.$refs.productList.refresh()
            this.$refs.courseList.refresh()
        }
    }
}
</script>

<style module lang="scss">
.search-list {
    position: relative;
    padding-top: 90px;
    :global {
        .pl-tab {
            justify-content: space-between;
        }
        .pl-tab__pane {
            height: 90px !important;
            font-size: 30px;
            font-family: Microsoft YaHei;
            &.active:after {
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 8px;
                border-radius: 4px;
                background-image: linear-gradient(90deg, #f3ad3c, #f7cf54);
            }
        }
    }
}
.tab-bar {
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    z-index: 999;
    padding: 0 224px;
    border-top: 2px solid #f5f5f5;
    box-shadow: 0 2px 2px rgba(0, 0, 0, .04);
}
.list {
    box-sizing: border-box;
    padding: 38px 28px;
    height: calc(100vh - 93px - 90px);
    overflow-y: scroll;
}
.list-item {
    margin-top: 20px;
    &:nth-of-type(1) {
        margin-top: 0;
    }
}
.lecturer {
    margin-top: 18px;
    font-size: 24px;
    line-height: 34px;
    color: #666;
}

</style>
