<template>
    <div :class="[$style.homeTemplateD, $style[skinClassNameMap[skinId]]]">
        <div :class="$style.container">
            <search :class="$style.search" placeholder="搜索商品" />
            <!-- banner -->
            <banner :class="$style.banner" :data="BANNER" />
            <!-- 820 -->
            <a href="https://m.youpenglai.com/new/activity/22449" :class="$style.wwec" v-if="mallDomain === 'pljs'">
                <img src="https://mallcdn.youpenglai.com/static/820/wwec2020.jpg" alt="wwec2020">
            </a>
            <!-- 优惠券 -->
            <coupon :class="$style.coupon" :data="COUPON" v-if="isCouponShow" />
            <!-- 活动 -->
            <activity :class="$style.activity" :data="ACTIVITY" v-if="isActivityShow" />
            <!-- 直播 -->
            <live :class="$style.live" :data="LIVE" v-if="isLiveShow" />
            <!-- 单课 -->
            <online-course :class="$style.onlineCourse" :data="COURSE" v-if="isOnlineCourseShow" />
            <!-- 系列课 -->
            <series-course :class="$style.seriesCourse" :data="SERIES" v-if="isSeriesCourseShow" />
            <!-- 图文资料 -->
            <image-text :class="$style.imageText" :data="ImageText" v-if="isImageTextShow" />
            <!-- 疫情 -->
            <!-- <campaign v-if="isCampaignShow" /> -->
            <!-- 预约 -->
            <appointment :class="$style.appointment" :data="APPOINTMENT" :slides-per-view="2" v-if="APPOINTMENT.showStatue === 1" />
            <!-- 秒杀 -->
            <div :class="$style.miaosha" v-if="isMiaoshaShow">
                <skin-title
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="MIAO_SHA.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="MIAO_SHA.moduleName" />
                <miaosha :data="MIAO_SHA" />
            </div>
            <!-- 组合课 -->
            <div :class="$style.package" v-if="isPackageShow">
                <skin-title
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="PACKAGE.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="PACKAGE.moduleName" />
                <package :data="PACKAGE" />
            </div>
            <!-- 团购 -->
            <div :class="$style.pintuan" v-if="isPintuanShow">
                <skin-title
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="PIN_TUAN.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="PIN_TUAN.moduleName" />
                <pintuan :data="PIN_TUAN" />
            </div>
            <!-- 预购 -->
            <div :class="$style.yugou" v-if="isYugouShow">
                <skin-title
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="YU_GOU.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="YU_GOU.moduleName" />
                <yugou :data="YU_GOU" />
            </div>
            <!-- 品宣 -->
            <propagate :class="$style.propagate" :data="PROPAGATE" v-if="PROPAGATE.showStatue === 1" />
            <!-- 商品 -->
            <div :class="$style.popular" v-if="isPopularShow">
                <skin-title
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="POPULAR.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="POPULAR.moduleName" />
                <hot-item :data="POPULAR" />
            </div>
            <!-- 课程 -->
            <div :class="$style.class" v-if="isClassShow">
                <skin-title
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="CLASS.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="CLASS.moduleName" />
                <best :data="CLASS" />
            </div>
            <!-- 精品推荐 -->
            <div :class="$style.recommend" v-if="RECOMMEND.values && RECOMMEND.values.length">
                <skin-title
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="RECOMMEND.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="RECOMMEND.moduleName" />
                <recommend :data="RECOMMEND" />
            </div>
            <footer :class="$style.footer">
                — 技术支持 朋来科技 —
            </footer>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Search from './components/Search.vue'
import Banner from './components/Banner.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate-Small.vue'
import Live from './components/Live.vue'
import OnlineCourse from './components/Online-Course.vue'
import SeriesCourse from './components/Series-Course.vue'
import ImageText from './components/Image-Text.vue'
import Coupon from './activity/Coupon.vue'
import Activity from './activity/Activity.vue'
import Miaosha from './activity/Miaosha.vue'
import Pintuan from './activity/Pintuan.vue'
import Yugou from './activity/Yugou.vue'
import Package from './activity/Package.vue'
import HotItem from './components/Hot-Item.vue'
import Best from './components/Best.vue'
import Recommend from './components/Recommend.vue'
import SkinTitle from './skin/Skin-Title.vue'
// import Campaign from './components/Campaign.vue'
import { skinClassNameMap } from './skin/map'

export default {
    name: 'HomeTemplateD',
    inject: ['parent'],
    components: {
        Search,
        Banner,
        Appointment,
        Propagate,
        Live,
        OnlineCourse,
        SeriesCourse,
        ImageText,
        Coupon,
        Activity,
        Miaosha,
        Pintuan,
        Yugou,
        Package,
        HotItem,
        Best,
        Recommend,
        SkinTitle
        // Campaign
    },
    props: {
        type: {
            type: Number,
            default: 0
        },
        skinId: {
            type: Number,
            default: 0
        },
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            skinClassNameMap
        }
    },
    computed: {
        ...mapGetters(['mallDomain']),
        BANNER () {
            return this.data.BANNER || {}
        },
        COUPON () {
            return this.data.COUPON || {}
        },
        ACTIVITY () {
            return this.data.ACTIVITY || {}
        },
        LIVE () {
            return this.data.LIVE || {}
        },
        COURSE () {
            return this.data.COURSE || {}
        },
        SERIES () {
            return this.data.SERIES || {}
        },
        ImageText () {
            return this.data.ImageText || {}
        },
        APPOINTMENT () {
            return this.data.APPOINTMENT || {}
        },
        MIAO_SHA () {
            return this.data.MIAO_SHA || {}
        },
        PIN_TUAN () {
            return this.data.PIN_TUAN || {}
        },
        YU_GOU () {
            return this.data.YU_GOU || {}
        },
        PACKAGE () {
            return this.data.PACKAGE || {}
        },
        PROPAGATE () {
            return this.data.PROPAGATE || {}
        },
        POPULAR () {
            return this.data.POPULAR || {}
        },
        CLASS () {
            return this.data.CLASS || {}
        },
        RECOMMEND () {
            return this.data.RECOMMEND || {}
        },
        isLiveShow () {
            return this.LIVE.showStatue === 1 && this.LIVE.values && this.LIVE.values.length
        },
        isOnlineCourseShow () {
            return this.COURSE.showStatue === 1 && this.COURSE.values && this.COURSE.values.length
        },
        isSeriesCourseShow () {
            return this.SERIES.showStatue === 1 && this.SERIES.values && this.SERIES.values.length
        },
        isImageTextShow () {
            return this.ImageText.showStatue === 1 && this.ImageText.values && this.ImageText.values.length
        },
        // isCampaignShow () {
        //     return this.parent.isReportShow || this.parent.isBookShow
        // },
        isCouponShow () {
            return this.COUPON.values && this.COUPON.values.length
        },
        isActivityShow () {
            return this.ACTIVITY.showStatue === 1 && this.ACTIVITY.values && this.ACTIVITY.values.length
        },
        isMiaoshaShow () {
            return this.MIAO_SHA.showStatue === 1 && this.MIAO_SHA.values && this.MIAO_SHA.values.length
        },
        isPintuanShow () {
            return this.PIN_TUAN.showStatue === 1 && this.PIN_TUAN.values && this.PIN_TUAN.values.length
        },
        isYugouShow () {
            return this.YU_GOU.showStatue === 1 && this.YU_GOU.values && this.YU_GOU.values.length
        },
        isPackageShow () {
            return this.PACKAGE.showStatue === 1 && this.PACKAGE.values && this.PACKAGE.values.length
        },
        isPopularShow () {
            return this.POPULAR.showStatue === 1 && this.POPULAR.values && this.POPULAR.values.length
        },
        isClassShow () {
            return this.CLASS.showStatue === 1 && this.CLASS.values && this.CLASS.values.length
        },
        isSkinShow () {
            return skinClassNameMap.has(this.skinId)
        }
    }
}
</script>

<style module lang="scss">
@import './skin/common.scss';

.home-template-d {
    background-color: #f4f5f9;
    font-size: 0;
}
.title {
    padding: 40px 0 30px;
    display: flex;
    align-items: center;
    color: #333;
    font-size: 40px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    &::before {
        position: relative;
        display: inline-block;
        content: '';
        width: 6px;
        height: 38px;
        background: #fe7700;
        margin-right: 14px;
    }
}
.search {
    position: relative;
    padding: 0 20px;
}
.banner {
    padding: 24px 24px 32px;
    background-color: #fff;
    border-radius: 20px 20px 0 0;
}

.package,
.miaosha,
.pintuan,
.yugou,
.popular,
.class,
.recommend {
    padding: 0 24px;
}

.activity,
.live,
.online-course,
.series-course,
.image-text,
.coupon,
.propagate,
.appointment {
    padding: 20px 24px 0;
}

.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    font-size: 26px;
    color: #999;
}

.wwec {
    display: block;
    margin: 20px 24px 0;
    border-radius: 20px;
    overflow: hidden;
    > img {
        width: 100%;
        height: 187px;
        object-fit: cover;
    }
}

</style>
