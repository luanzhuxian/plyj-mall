<template>
    <div>
        <div :class="$style.onlineCourseWrapper">
            <div :class="$style.onlineCourseHead">
                <pl-svg name="icon-tv-76530" width="36" height="45" />
                <b>知识课程</b>
                <router-link
                    :class="$style.onlineCourseHeadMore"
                    :to="{ name: 'OnlineClassroom' }"
                >
                    查看全部
                    <pl-svg name="icon-right" height="20" fill="#cccccc" />
                </router-link>
            </div>
            <div :class="$style.onlineCourseHeadSub">
                {{ `还有${rest}个知识课程，等你来学习` }}
            </div>
            <router-link
                v-if="list.length"
                :class="$style.onlineCourse"
                :to="{ name: 'Curriculum', params: { productId: course.id } }"
            >
                <div :class="$style.imgWrapper">
                    <img v-imgError :src="course.courseImg + '?x-oss-process=style/thum-small'">
                </div>
                <div :class="$style.info">
                    <div :class="$style.top" v-text="course.courseName" />
                    <div :class="$style.middle">
                        <span v-if="course.lecturer">
                            {{ `主讲人：${course.lecturer}` }}
                        </span>
                    </div>
                    <div :class="$style.bottom">
                        <span
                            :class="{
                                [$style.bottomPrice]: true,
                                [$style.money]: course.sellingPrice
                            }"
                            v-text="course.sellingPrice || '免费'"
                        />
                        <span
                            :class="{
                                [$style.bottomOrigin]: true,
                                [$style.money]: course.originalPrice
                            }"
                            v-text="course.originalPrice"
                            v-if="course.originalPrice"
                        />
                        <div v-if="!course.orderId" :class="$style.bottomBtn">立即学习</div>
                        <div v-else :class="[$style.bottomBtn, $style.bottomStudy]">观看学习</div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OnlineCourse',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {}
    },
    computed: {
        list () {
            return this.data.records ? this.data.records : []
        },
        course () {
            return this.list.length ? this.list[0] : {}
        },
        rest () {
            return this.list.length ? this.data.total - 1 : 0
        }
    },
    created () {}
}
</script>

<style module lang="scss">
.online-course-wrapper {
    padding: 20px 16px 20px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
}
.online-course-head {
    display: flex;
    align-items: end;
    margin-bottom: 12px;
    line-height: 46px;
    > b {
        margin-left: 16px;
        font-size: 32px;
        color: #333;
    }
    &-sub {
        margin-bottom: 32px;
        font-size: 22px;
        line-height: 32px;
        color: #1592e6;
    }
    &-more {
        display: flex;
        align-items: center;
        margin-left: auto;
        font-size: 24px;
        color: #999;
        > svg {
            margin-left: 4px;
        }
    }
}
.online-course {
    display: flex;
    background-color: #fff;
    overflow: hidden;
}
.img-wrapper {
    position: relative;
    width: 240px;
    height: 160px;
    border-radius: 20px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
.info {
    flex: 1;
    width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 8px 0 8px 20px;
}
.top {
    font-size: 28px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 36px;
    color: #333;
    text-align: justify;
    @include elps();
}
.middle {
    margin-top: 12px;
    font-size: 24px;
    line-height: 34px;
    color: #666;
    @include elps();
}
.bottom {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-price {
        font-size: 40px;
        font-family: San Francisco Display;
        font-weight: bold;
        line-height: 44px;
        color: #fe7700;
        @include elps();
        &.money::before {
            content: '￥';
            font-size: 28px;
        }
    }
    &-origin {
        margin-left: 12px;
        font-size: 28px;
        line-height: 34px;
        color: #999;
        text-decoration: line-through;
        @include elps();
        &.money::before {
            content: '￥';
        }
    }
    &-btn {
        flex-shrink: 0;
        margin-left: auto;
        width: 124px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        background-color: #fe7700;
        border-radius: 8px;
        font-size: 26px;
        color: #fff;
    }
    &-study {
        background-color: #f2b036;
    }
}

</style>
