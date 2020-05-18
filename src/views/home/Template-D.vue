<template>
    <div :class="[$style.homeTemplateD, $style[skinClassNameMap[skinId]]]">
        <div :class="$style.container">
            <search :class="$style.search" placeholder="搜索商品" />
            <banner :class="$style.banner" :data="BANNER" />
            <coupon :class="$style.coupon" :data="COUPON" v-if="isCouponShow" />
            <activity :class="$style.activity" :data="ACTIVITY" v-if="isActivityShow" />
            <live :class="$style.live" :data="LIVE" v-if="isLiveShow" />
            <online-course :class="$style.onlineCourse" :data="COURSE" v-if="isOnlineCourseShow" />
            <series-course :class="$style.seriesCourse" :data="SERIES" v-if="isSeriesCourseShow" />
            <campaign v-if="isCampaignShow" />
            <appointment :class="$style.appointment" :data="APPOINTMENT" :slides-per-view="2" />
            <div :class="$style.miaosha" v-if="isMiaoshaShow">
                <div v-if="skinId === 0" :class="$style.title" v-text="MIAO_SHA.moduleName" />
                <skin-title
                    v-else
                    :class="$style.skinTitle"
                    :data="MIAO_SHA.moduleName"
                    :skin-id="skinId"
                />
                <miaosha :data="MIAO_SHA" />
            </div>
            <div :class="$style.package" v-if="isPackageShow">
                <div v-if="skinId === 0" :class="$style.title" v-text="PACKAGE.moduleName" />
                <skin-title
                    v-else
                    :class="$style.skinTitle"
                    :data="PACKAGE.moduleName"
                    :skin-id="skinId"
                />
                <package :data="PACKAGE" />
            </div>
            <div :class="$style.pintuan" v-if="isPintuanShow">
                <div v-if="skinId === 0" :class="$style.title" v-text="PIN_TUAN.moduleName" />
                <skin-title
                    v-else
                    :class="$style.skinTitle"
                    :data="PIN_TUAN.moduleName"
                    :skin-id="skinId"
                />
                <pintuan :data="PIN_TUAN" />
            </div>
            <div :class="$style.yugou" v-if="isYugouShow">
                <div v-if="skinId === 0" :class="$style.title" v-text="YU_GOU.moduleName" />
                <skin-title
                    v-else
                    :class="$style.skinTitle"
                    :data="YU_GOU.moduleName"
                    :skin-id="skinId"
                />
                <yugou :data="YU_GOU" />
            </div>
            <propagate :class="$style.propagate" :data="PROPAGATE" />
            <div :class="$style.hotItem" v-if="POPULAR.showStatue === 1">
                <div v-if="skinId === 0" :class="$style.title" v-text="POPULAR.moduleName" />
                <skin-title
                    v-else
                    :class="$style.skinTitle"
                    :data="POPULAR.moduleName"
                    :skin-id="skinId"
                />
                <hot-item :data="POPULAR" />
            </div>
            <div :class="$style.best" v-if="CLASS.showStatue === 1">
                <div v-if="skinId === 0" :class="$style.title" v-text="CLASS.moduleName" />
                <skin-title
                    v-else
                    :class="$style.skinTitle"
                    :data="CLASS.moduleName"
                    :skin-id="skinId"
                />
                <best :data="CLASS" />
            </div>
            <div :class="$style.recommend" v-if="RECOMMEND.values && RECOMMEND.values.length">
                <div v-if="skinId === 0" :class="$style.title" v-text="RECOMMEND.moduleName" />
                <skin-title
                    v-else
                    :class="$style.skinTitle"
                    :data="RECOMMEND.moduleName"
                    :skin-id="skinId"
                />
                <recommend :data="RECOMMEND" />
            </div>
            <footer :class="$style.footer">
                — 技术支持 朋来科技 —
            </footer>
        </div>
    </div>
</template>

<script>
import Search from './components/Search.vue'
import Banner from './components/Banner.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate-Small.vue'
import Live from './components/Live.vue'
import OnlineCourse from './components/Online-Course.vue'
import SeriesCourse from './components/Series-Course.vue'
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
import Campaign from './components/Campaign.vue'
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
        Coupon,
        Activity,
        Miaosha,
        Pintuan,
        Yugou,
        Package,
        HotItem,
        Best,
        Recommend,
        SkinTitle,
        Campaign
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
            return this.LIVE.values && this.LIVE.values.length
        },
        isOnlineCourseShow () {
            return this.COURSE.values && this.COURSE.values.length
        },
        isSeriesCourseShow () {
            return this.SERIES.values && this.SERIES.values.length
        },
        isCampaignShow () {
            return this.parent.isReportShow || this.parent.isBookShow
        },
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
        // top: 2px;
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
.hot-item,
.best,
.recommend {
    padding: 0 24px;
}

.activity,
.live,
.online-course,
.series-course,
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

</style>
