<template>
    <div>
        <div :class="$style.seriesCourseWrapper">
            <div :class="$style.seriesCourseHead">
                <img src="https://mallcdn.youpenglai.com/static/mall/icons/2.10.0/vol-orange.png">
                <b>{{ data.moduleName }}</b>
                <router-link
                    :class="$style.seriesCourseHeadMore"
                    :to="{ name: 'seriesOfCourses' }"
                >
                    查看全部
                    <pl-svg name="icon-right" height="20" fill="#cccccc" />
                </router-link>
            </div>
            <div :class="$style.seriesCourseHeadSub" v-if="data.otherValue > 0">
                {{ `还有${data.otherValue}个知识课程，等你来学习` }}
            </div>
            <ul :class="$style.list" v-if="data.values.length">
                <template v-for="(course, index) of data.values">
                    <router-link
                        v-if="course.goodsInfo"
                        :key="index"
                        tag="li"
                        :to="{ name: 'Curriculum', params: { productId: course.goodsInfo.id } }"
                    >
                        <div :class="$style.imgWrapper">
                            <img v-imgError :src="course.goodsInfo.courseImg + '?x-oss-process=style/thum-small'">
                        </div>
                        <div :class="$style.info">
                            <div :class="$style.top" v-text="course.goodsInfo.courseName" />
                            <div :class="$style.middle" v-if="course.goodsInfo.lecturer">
                                {{ `主讲人：${course.goodsInfo.lecturer}` }}
                            </div>
                            <div :class="$style.middle" v-if="course.goodsInfo.courseCount">
                                {{ `包含${course.goodsInfo.courseCount}节课程` }}
                            </div>
                            <div :class="$style.bottom">
                                <span
                                    :class="{
                                        [$style.bottomPrice]: true,
                                        [$style.money]: !!course.goodsInfo.sellingPrice
                                    }"
                                    v-text="course.goodsInfo.sellingPrice || '免费'"
                                />
                                <del
                                    :class="{
                                        [$style.bottomOrigin]: true,
                                        [$style.money]: !!course.goodsInfo.originalPrice
                                    }"
                                    v-text="course.goodsInfo.originalPrice"
                                    v-if="course.goodsInfo.originalPrice"
                                />
                                <div v-if="!course.orderId" :class="$style.bottomBtn">{{ getBtnText(course) }}</div>
                                <div v-else :class="[$style.bottomBtn, $style.bottomStudy]">观看学习</div>
                            </div>
                        </div>
                    </router-link>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    name: 'SeriesCourse',
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {}
    },
    methods: {
        getBtnText ({ isOpenSale, regularSaleTime = '' }) {
            let text = '立即订购'
            if (isOpenSale === 1) {
                const saleTime = moment(regularSaleTime).values()
                if (saleTime > Date.now()) {
                    text = '即将开售'
                }
            }
            return text
        }
    }
}
</script>

<style module lang="scss">
.series-course-wrapper {
    padding: 20px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
}
.series-course-head {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    line-height: 46px;
    > img {
        width: 36px;
        height: 36px;
        object-fit: cover;
    }
    > b {
        margin-left: 16px;
        font-size: 32px;
        color: #333;
    }
    &-sub {
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
.list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 32px;
    > li {
        display: flex;
        margin-top: 20px;
        width: 100%;
        height: 188px;
        overflow: hidden;
        &:nth-of-type(1) {
            margin-top: 0;
        }
        .img-wrapper {
            position: relative;
            width: 280px;
            height: 188px;
            border-radius: 20px;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
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
            color: #000;
            text-align: justify;
            @include elps();
        }
        .middle {
            margin-top: 6px;
            font-size: 24px;
            color: #666;
            @include elps();
            &:nth-of-type(1) {
                margin-top: 10px;
            }
        }
        .bottom {
            margin-top: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            &-price {
                font-size: 32px;
                font-weight: bold;
                color: #fe7700;
                @include elps();
                &.money::before {
                    content: '￥';
                    font-size: 20px;
                }
            }
            &-origin {
                margin-left: 6px;
                font-size: 20px;
                color: #999;
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
    }
}

</style>
