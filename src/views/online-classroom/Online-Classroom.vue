<template>
    <div
        :class="{
            [$style.onlineClassroom]: true
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
            :class="$style.content"
        >
            <template>
                <ul :class="$style.courseList">
                    <!--只有实际购买的人不显示已购角标-->
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
                            <!-- 不是 订单或者赠课 才显示倒计时-->
                            <div v-if="!(item.orderId || item.isGive) && item.isOpenSale" :class="$style.countDown">
                                <count-down
                                    :endtime="item.regularSaleTime"
                                    theme="black"
                                    @done="$refresh"
                                />
                            </div>
                        </div>
                        <div :class="$style.desc">
                            <div :class="$style.title" v-text="item.courseName" />
                            <div :class="[$style.text1, item.lecturer? '' : $style.noLecturer]">
                                <span v-if="item.lecturer">主讲人： {{ item.lecturer }}</span>
                            </div>
                            <div :class="$style.bottom">
                                <template>
                                    <span v-if="item.priceType === 1" :class="$style.priceZoom">
                                        <span :class="$style.price" v-text="item.sellingPrice" />
                                        <del v-if="item.originalPrice && (item.originalPrice > item.sellingPrice)" :class="$style.original" v-text="item.originalPrice" class="rmb" />
                                    </span>
                                    <span v-else :class="$style.free">免费</span>
                                </template>
                                <template>
                                    <!--实际购买的人 & 赠课并观看的人 显示 学习中-->
                                    <pl-button v-if="(!item.isGive && item.orderId) || (item.isGive && item.isWatch)" type="warning">去学习</pl-button>
                                    <!--赠课的人优先显示 已赠课 -->
                                    <pl-button v-else-if="item.isGive" type="warning">赠课</pl-button>
                                    <pl-button v-else-if="item.isNotStart" type="primary" :class="$style.notStart">即将开售</pl-button>
                                    <pl-button v-else type="primary">立即订购</pl-button>
                                </template>
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
    name: 'OnlineClassroom',
    components: {
        LoadMore,
        CountDown,
        CategorySelector
    },
    inject: {
        onlineClassCoursesCatrgory: {
            from: 'onlineClassCoursesCatrgory',
            default: () => {}
        }
    },
    data () {
        return {
            form: {
                categoryId: '',
                courseType: 1,
                current: 1,
                size: 10
            },
            requestMethods: getCourse,
            loading: false,
            $refresh: null,
            courseList: [],
            // 当前本地时间与服务器时间的差值
            duration: 0,
            offsetTop: 0
        }
    },
    async mounted () {
        try {
            this.$refresh = this.$refs.loadMore.refresh
            await this.getServerTime()
            // 解决因刷新浏览器后，在beforeRouteEnter无法获取到dom信息，导致无法正常调用refresh问题
            if (!this.courseList.length) {
                this.$refresh()
            }
        } catch (e) {
            throw e
        }
    },
    computed: {
        category () {
            return this.onlineClassCoursesCatrgory.coursesCatrgory.childs || []
        },
        rootCategory () {
            return this.onlineClassCoursesCatrgory.coursesCatrgory.id || ''
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
    position: relative;
    min-height: 50vh;
    background-color: #fff;
    > .content {
        padding: 0 20px 20px 20px;
    }
}
.course-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.course-item {
    position: relative;
    width: calc(50% - 15px);
    margin-bottom: 32px;
    &.had-buy:before {
        content: '已购';
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100px;
        border-radius: 20px 0 20px 0;
        background: #fe7700;
        line-height: 42px;
        text-align: center;
        font-size: 24px;
        color: #fff;
    }
    > .img {
        position: relative;
        width: 340px;
        height: 228px;
        margin-bottom: 16px;
        border-radius: 20px;
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
.bottom {
    min-height: 82px;
    margin-top: 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .price-zoom {
        max-width: 200px;
    }
    .price {
        font-size: 32px;
        color: #fe7700;
        font-weight: bold;
        &:before {
            content: '¥';
            margin-right: 4px;
            font-size: 20px;
            vertical-align: 3px;
        }
    }
    .original {
        display: block;
        font-size: 20px;
        color: #999;
    }
    .free {
        font-size: 28px;
        color: #fe7700;
    }
    .not-start {
        background-color: rgba(254,119,0,.3);
    }
}
.title {
    width: 340px;
    margin-bottom: 4px;
    font-size: 24px;
    color: #000;
    font-weight: bold;
    @include elps();
}
.noLecturer {
    margin-bottom: 45px;
}
.text1 {
    width: 340px;
    font-size: 22px;
    color: #666;
    @include elps();
}

</style>
