<template>
    <div
        :class="{
            [$style.onlineClassroom]: true,
            [$style.noCategory]: !category.length
        }"
    >
        <CategorySelector
            :category="category"
            @change="classifyChanged"
        />
        <load-more
            ref="loadMore"
            :form="form"
            :request-methods="requestMethods"
            :loading.sync="loading"
            @refresh="refreshHandler"
            no-content-tip="此分类下还没有课程"
        >
            <template>
                <ul :class="$style.courseList">
                    <li
                        v-for="(item, index) of courseList"
                        :key="index"
                        :class="{
                            [$style.courseItem]: true,
                            [$style.hadBuy]: !item.isGive && item.orderId
                        }"
                        @click.capture="study(item)"
                    >
                        <div :class="$style.img">
                            <img :src="item.courseImg + '?x-oss-process=style/thum-small'" alt="">
                            <div v-if="!(item.orderId || item.isGive) && item.isOpenSale" :class="$style.countDown">
                                <count-down
                                    prefix="距抢课开始仅剩"
                                    :endtime="item.regularSaleTime"
                                    theme="orange"
                                    @done="$refresh"
                                />
                            </div>
                        </div>
                        <div :class="$style.desc">
                            <div :class="$style.left">
                                <div :class="$style.title">
                                    {{ item.courseName }}
                                </div>
                                <div :class="$style.saleInfo" v-if="Number(item.showSales) === 1">
                                    <span v-if="item.orderCount">已有{{ item.orderCount }}人订阅</span>
                                    <span v-else>正在热销中</span>
                                </div>
                                <div :class="$style.courseCount">
                                    <span>包含{{ item.courseCount }}节课程</span>
                                </div>
                            </div>
                            <div :class="$style.right">
                                <div :class="$style.priceContent">
                                    <template v-if="item.priceType === 1">
                                        <span :class="$style.price" v-text="item.sellingPrice" />
                                        <del v-if="item.originalPrice && (item.originalPrice > item.sellingPrice)"
                                             :class="$style.original" v-text="item.originalPrice" class="rmb" />
                                    </template>
                                    <span v-else :class="$style.free">免费</span>
                                </div>
                                <div :class="$style.btns">
                                    <!--实际购买的人 & 赠课并观看的人 显示 学习中-->
                                    <pl-button v-if="(!item.isGive && item.orderId) || (item.isGive && item.isWatch)" type="warning">
                                        去学习
                                    </pl-button>
                                    <!--赠课的人优先显示 已赠课 -->
                                    <pl-button v-else-if="item.isGive" type="warning">赠课</pl-button>
                                    <pl-button v-else-if="item.isNotStart" type="primary" :class="$style.notStart">
                                        即将开售
                                    </pl-button>
                                    <pl-button v-else type="primary">立即订购</pl-button>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </template>
        </load-more>
    </div>
</template>
<script>
import { getServerTime } from '../../apis/base-api'
import { getCourse } from '../../apis/online-classroom.js'
import LoadMore from '../../components/common/Load-More.vue'
import CountDown from '../../components/product/Courses-Count-Down.vue'
import moment from 'moment'
import CategorySelector from './components/Category-Selector.vue'

export default {
    name: 'SeriesOfCourses',
    components: {
        LoadMore,
        CountDown,
        CategorySelector
    },
    inject: {
        onlineClassCoursesCatrgory: {
            from: 'onlineClassCoursesCatrgory',
            default: () => ({
                seriesCoursesCatrgory: {}
            })
        }
    },
    data () {
        return {
            form: {
                categoryId: '',
                courseType: 2,
                current: 1,
                size: 10
            },
            requestMethods: getCourse,
            loading: false,
            $refresh: null,
            courseList: [],
            // 当前本地时间与服务器时间的差值
            duration: ''
        }
    },
    async mounted () {
        try {
            this.$refresh = this.$refs.loadMore.refresh
            await this.getServerTime()
            if (!this.courseList.length) {
                this.$refresh()
            }
        } catch (e) {
            throw e
        }
    },
    computed: {
        category () {
            return this.onlineClassCoursesCatrgory.seriesCoursesCatrgory.childs || []
        },
        rootCategory () {
            return this.onlineClassCoursesCatrgory.seriesCoursesCatrgory.id || ''
        }
    },
    methods: {
        async classifyChanged (item) {
            try {
                this.form.current = 1
                this.form.categoryId = item.id
                this.$refresh()
            } catch (e) {
                throw e
            }
        },
        async getServerTime () {
            try {
                const now = Number(moment().valueOf())
                const { result: time } = await getServerTime()
                const end = Number(moment().valueOf())

                // 返回的时间加上请求时间
                const serverTime = Number(time) + (end - now)
                this.duration = Number(moment(serverTime).valueOf()) - Number(moment().valueOf())
            } catch (e) {
                throw e
            }
        },
        refreshHandler (list) {
            this.courseList = this.addAtrToItem(list)
        },
        addAtrToItem (list) {
            const currentTimeStamp = Number(moment().valueOf()) + this.duration
            for (const item of list) {
                item.isNotStart = item.isOpenSale && Number(moment(item.regularSaleTime).valueOf()) > currentTimeStamp
            }
            return list
        },
        study (item) {
            this.$router.push({ name: 'Curriculum', params: { productId: item.id } })
        }
    }
}
</script>
<style lang="scss" module>
    .online-classroom {
        /*padding: 14vw 20px 20px;*/
        padding: 20px;
        min-height: 50vh;
        background-color: #fff;
        &.no-category {
            margin-top: 28px;
        }
    }

    .course-item {
        position: relative;
        margin-bottom: 32px;

        &.had-buy:before {
            content: '已购';
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
            width: 100px;
            border-radius: 20px 0px 20px 0px;
            background: #F2B036;
            line-height: 42px;
            text-align: center;
            font-size: 24px;
            color: #fff;
        }

        > .img {
            position: relative;
            width: 100%;
            height: 474px;
            border-radius: 20px 20px 0px 0px;
            overflow: hidden;

            .count-down {
                position: absolute;
                left: 0;
                bottom: 0;
                right: 0;
                height: 52px;
                border-radius: 0 0 12px 12px;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .desc {
        display: flex;
        justify-content: space-between;
        padding: 20px 24px;
        border-radius: 0px 0px 20px 20px;
        background-color: #F8F8F8;

        .left {
            max-width: 70%;
            font-size: 26px;
            color: #828282;

            .title {
                margin-bottom: 4px;
                font-size: 30px;
                font-weight: bold;
                color: #222;
                @include elps();
            }

            .sale-info {
                margin: 8px 0;
            }
        }

        .right {
            margin-top: 20px;

            .priceContent {
                text-align: right;
            }

            .price {
                font-size: 48px;
                color: #FE7700;

                &:before {
                    content: '¥';
                    margin-right: 4px;
                    font-size: 20px;
                    vertical-align: 3px;
                }
            }

            .original {
                display: block;
                font-size: 30px;
                color: #999;
            }

            .free {
                font-size: 30px;
                color: #FE7700;
            }

            .btns {
                margin-top: 20px;
                text-align: right;

                button {
                    width: 150px;
                    line-height: 58px;
                    font-size: 30px;
                }

                .not-start {
                    background-color: rgba(254, 119, 0, 0.3);
                }
            }
        }
    }
</style>
