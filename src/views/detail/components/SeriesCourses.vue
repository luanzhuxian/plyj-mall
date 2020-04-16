<template>
    <div :class="$style.seriesCourses">
        <div :class="$style.top">
            <span>{{ `知识内容(${data.length})` }}</span>
            <span :class="$style.lighter" v-if="isFinish">更新已完结</span>
            <span :class="$style.lighter" v-else>持续更新中...</span>
        </div>
        <ul :class="$style.list">
            <li :class="$style.listItem" v-for="(item, index) of data" :key="index">
                <product-card
                    label="单课"
                    :image="item.lessonsImg"
                    :top="item.name"
                    :sub-top="item.lecturer ? `主讲人：${item.lecturer}` : ''"
                    :button-text="getBtnText(item)"
                    round
                    round-image
                    @click="e => handleClick(e, item)"
                    @btn-click="e => handleBtnClick(e, item)"
                >
                    <template slot="bottom" v-if="!item.url">
                        <span :class="$style.warn">{{ `课程内容更新中 敬请期待` }}</span>
                    </template>
                    <template slot="bottomLeft" v-else>
                        <div :class="$style.listBottomLeft">
                            <span :class="$style.duration" v-if="item.resourceTime" v-text="getDuration(item.resourceTime)" />
                            <span :class="$style.view" v-if="item.vodNumber">{{ `${item.vodNumber}人观看` }}</span>
                            <span v-if="canLearn && item.learnProgress">{{ `学习${item.learnProgress}%` }}</span>
                        </div>
                    </template>
                </product-card>
            </li>
            <li :class="$style.listBottom">
                <p v-if="!canLearn">课程内容订购后即可学习~</p>
                <p v-else>没有更多了~</p>
            </li>
        </ul>
    </div>
</template>

<script>
import moment from 'moment'
import ProductCard from './Product-Card.vue'

export default {
    name: 'SeriesCourses',
    components: {
        ProductCard
    },
    props: {
        data: {
            type: Array,
            default () {
                return []
            }
        },
        courseId: {
            type: String,
            default: ''
        },
        orderId: {
            type: String,
            default: ''
        },
        // 1 上架 2 下架
        status: {
            type: Number,
            default: 0
        },
        // 是否开启定时售卖
        isOpenSale: {
            type: Number,
            default: 0
        },
        // 1 已开售 2 未开售
        courseStatus: {
            type: Number,
            default: 0
        },
        isPresent: Boolean,
        isBuy: Boolean,
        isFinish: Boolean
    },
    data () {
        return {}
    },
    computed: {
        // 已开售 且 已购 / 赠课
        canLearn () {
            const { isOpenSale, courseStatus, isBuy, isPresent } = this
            return (isOpenSale === 0 || (isOpenSale === 1 && courseStatus === 1)) && (isBuy || isPresent)
        }
    },
    methods: {
        getBtnText ({ url, supportWatch = 0, learnProgress, haveSingleVideoCourse = false, singleVideoCourseId }) {
            // 无关联视频
            if (!url) return ''
            if (this.canLearn) {
                return learnProgress ? '' : '去学习'
            }
            // 上架中且支持试看
            if (this.status === 1 && supportWatch === 1) return '试看'
            // 关联其他单课
            if (haveSingleVideoCourse && singleVideoCourseId) return '单独购买'
            return ''
        },
        getDuration (duration = 0) {
            let result = ''
            const { _data: { hours, minutes, seconds } } = moment.duration(duration * 1000)
            if (hours) {
                result += `${ hours }时`
            }
            if (minutes) {
                result += `${ minutes }分`
            }
            if (seconds) {
                result += `${ seconds }秒`
            }
            return result
        },
        handleBtnClick (e, { id, url, singleVideoCourseId, learnProgress }) {
            const { courseId, orderId } = this
            const btnText = e.target.innerHTML

            if (btnText === '试看') {
                this.$emit('preview', url)
            }
            if (btnText === '单独购买') {
                this.$router.push({
                    name: 'Curriculum',
                    params: { productId: singleVideoCourseId }
                })
            }
            if (btnText === '去学习') {
                this.$router.push({
                    name: 'CourseWatch',
                    params: {
                        courseId
                    },
                    query: {
                        liveId: id,
                        orderId,
                        progress: learnProgress
                    }
                })
            }
        },
        handleClick (e, { id, singleVideoCourseId, learnProgress }) {
            const { courseId, orderId } = this

            if (this.canLearn) {
                this.$router.push({
                    name: 'CourseWatch',
                    params: {
                        courseId
                    },
                    query: {
                        liveId: id,
                        orderId,
                        progress: learnProgress
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss" module>

.top {
    padding: 0 24px;
    line-height: 80px;
    background: #fff;
    font-size: 26px;
    color: #666;
    > span {
        margin-right: 36px;
    }
    .lighter {
        color: #999;
    }
}
.list {
    margin-top: 20px;
    padding: 28px 24px;
    background: #fff;
    &-item {
        padding: 26px 0 36px;
        border-bottom: 2px solid #e7e7e7;
        &:nth-of-type(1) {
            padding-top: 0;
        }
        .duration {
            margin-right: 24px;
        }
        .view {
            margin-right: 32px;
        }
        .warn {
            margin-top: auto;
            font-size: 26px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #f2b036;
        }
    }
    &-bottom {
        padding: 26px 0;
        font-size: 24px;
        line-height: 34px;
        color: #828282;
        text-align: center;
    }
    &-bottom-left {
        @include elps();
    }
}

</style>
