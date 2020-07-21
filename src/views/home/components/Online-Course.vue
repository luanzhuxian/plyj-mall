<template>
    <div>
        <div :class="$style.onlineCourseWrapper">
            <div :class="$style.onlineCourseHead">
                <pl-svg name="icon-tv-76530" width="36" height="45" />
                <b>{{ data.moduleName }}</b>
                <router-link
                    :class="$style.onlineCourseHeadMore"
                    :to="{ name: 'OnlineClassroom' }"
                >
                    查看全部
                    <pl-svg name="icon-right" height="20" fill="#cccccc" />
                </router-link>
            </div>
            <div :class="$style.onlineCourseHeadSub" v-if="data.otherValue > 0">
                {{ `${data.otherValue}个精选单课，等你来学习` }}
            </div>
            <ul :class="$style.list" v-if="data.values.length">
                <template v-for="(course, index) of data.values">
                    <router-link
                        v-if="course.goodsInfo"
                        :class="{
                            [$style.long]: isOdd && index === 0,
                            [$style.marginT0]: (index === 0) || (!isOdd && index === 1)
                        }"
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
                                <div v-if="!course.orderId" :class="$style.bottomBtn">{{ getBtnText(course.goodsInfo) }}</div>
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
export default {
    name: 'OnlineCourse',
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
    computed: {
        isOdd () {
            return !!(this.data.values.length % 2)
        }
    },
    methods: {
        getBtnText ({ isOpenSale, regularSaleTime = '' }) {
            let text = '立即订购'
            if (isOpenSale === 1) {
                const saleTime = new Date(regularSaleTime).valueOf()
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
.online-course-wrapper {
    padding: 20px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
}
.online-course-head {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    line-height: 46px;
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
        flex-direction: column;
        margin-top: 20px;
        width: 320px;
        height: 370px;
        overflow: hidden;
        .img-wrapper {
            position: relative;
            width: 100%;
            height: 214px;
            border-radius: 20px 20px 0 0;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 14px 0 10px;
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
            margin-top: 2px;
            font-size: 20px;
            color: #666;
            @include elps();
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
                width: 134px;
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
        &.long {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 188px;
            .img-wrapper {
                width: 280px;
                height: 188px;
                border-radius: 20px;
            }
            .info {
                padding: 8px 0 8px 20px;
                width: 0;
            }
            .middle {
                margin-top: 12px;
                font-size: 24px;
            }
        }
        &.margin-t-0 {
            margin-top: 0;
        }
    }
}

</style>
