<template>
    <div :class="$style.studyItem" @click.capture="target(item)">
        <div :class="$style.img">
            <div :class="$style.give" v-if="item.transactionId === 0">送课</div>
            <div :class="$style.validity" v-if="item.validityType === 1">
                {{ item.priceType === 0 ? `${moment(item.validityDate).format('YYYY-MM-DD')} 到期` : `${item.validity} 天内完成学习` }}
            </div>
            <img :src="item.courseImg" alt="">
        </div>
        <div :class="$style.content">
            <div :class="$style.description">
                <div v-if="item.courseName" :class="$style.name" v-text="item.courseName" />
                <!-- 图文资料的作者信息要在此处显示 -->
                <div
                    v-if="item.orderType === 5"
                    class="gray-2 fz-28 mt-18"
                >
                    作者：{{ item.lecturer }}
                </div>
                <!-- 图文资料不显示分类，即item.orderType等于5的情况 -->
                <div v-if="item.orderType !== 5 && item.category2Name" :class="$style.category" v-text="item.category2Name" />
            </div>
            <div :class="$style.learn">
                <!-- 除图文资料之外的主讲人信息要在此处显示 -->
                <div
                    :class="$style.lecturer"
                    v-if="item.lecturer && item.orderType !== 5"
                >
                    主讲人：{{ item.lecturer }}
                </div>
                <div :class="$style.bottom">
                    <div :class="$style.studyProgress" v-if="item.recordModels">
                        <!-- 单课程学习进度 -->
                        <span v-if="courseType === '1'">已学习{{ (item.recordModels && item.recordModels[0] && item.recordModels[0].learnProgress) || 0 }}%</span>
                        <!-- 系列课学习进度 -->
                        <span v-else>已学习{{ item.learnedNumber || 0 }}节/{{ item.totalLiveNumber || 1 }}节课</span>
                    </div>
                    <pl-button
                        v-if="$route.params.learnStatus !== '3'"
                        size="small"
                        type="warning"
                        v-text="item.orderType === 5 ? '查看资料' : '去学习'"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import { isRange } from './../../../../apis/live-library'
export default {
    name: 'StudyItem',
    props: {
        item: {
            type: Object,
            default () {
                return {
                    // 0 不限制时间，1 限制
                    validityType: '',
                    // 图片地址
                    courseImg: '',
                    // 课程名字
                    courseName: '',
                    // 二级标签
                    category2Name: '',
                    // 主讲人
                    lecturer: '',
                    // 1 未学习 2 学习中 3 学习完
                    learnStatus: '',
                    // 进度
                    learnProgress: 0
                }
            }
        }
    },
    methods: {
        moment,
        async target (item) {
            if (this.learnStatus === '3') {
                return
            }

            try {
                // 免费
                if (item.priceType === 0) {
                    const { result } = await isRange(item.courseId)
                    if (!result) {
                        return this.$warning('您不是该课程的适用用户')
                    }
                }
                // 图文资料
                if (item.orderType === 5) {
                    this.$router.push({ name: 'ImageTextDetail', params: { productId: item.courseId } })
                    return
                }
                if (this.courseType === '1') {
                    this.$router.push({
                        name: 'CourseWatch',
                        params: {
                            courseId: item.courseId
                        },
                        query: {
                            liveId: item.liveIdList && item.liveIdList[0],
                            orderId: item.orderId,
                            progress: item.learnProgress
                        }
                    })
                    return
                }
                this.$router.push({ name: 'Curriculum', params: { productId: item.courseId } })
            } catch (e) { throw e }
        }
    },
    computed: {
        courseType () {
            // 1单课 2系列课
            return this.$route.params.courseType
        },
        learnStatus () {
            // 1 未学习 2 学习中 3 已过期
            return this.$route.params.learnStatus
        }
    }
}
</script>

<style module lang='scss'>

.study-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;
    background-color: #fff;
    &:nth-last-of-type(1) {
        margin-bottom: 0;
    }
    > .img {
        position: relative;
        width: 280px;
        height: 186px;
        border-radius: 20px;
        overflow: hidden;
        > img {
            width: 100%;
            height: 100%;
            vertical-align: top;
        }
        > .give {
            position: absolute;
            top: 0;
            left: 0;
            width: 120px;
            border-radius: 20px 0;
            font-size: 22px;
            line-height: 46px;
            text-align: center;
            color: #fff;
            background-color: #f2b036;
        }
        > .validity {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            font-size: 24px;
            line-height: 46px;
            text-align: center;
            color: #fff;
            background-color: #f2b036;
        }
    }
    > .content {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding-left: 24px;
        > .description {
            width: 100%;
            font-size: 24px;
            color: #666;
            > .name {
                font-size: 28px;
                color: #373737;
                @include elps-wrap(1);
            }
            > .category {
                display: inline-block;
                margin: 14px 0;
                padding: 0 14px;
                border-radius: 20px;
                line-height: 36px;
                color: #b58a48;
                background-color: #fffae6;
            }
        }
        > .learn {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            > .lecturer {
                width: 100%;
                margin-bottom: 8px;
                font-size: 24px;
                color: #666;
                @include elps-wrap(1);
            }
            .bottom {
                width: 100%;
                display: inline-flex;
                justify-content: flex-end;
            }
            .study-progress {
                flex: 1;
                font-size: 28px;
                color: #f2b036;
            }
        }
    }
}

</style>
