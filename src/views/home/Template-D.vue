<template>
    <div
        :class="{
            [$style.homeTemplateD]: true,
            [$style.skinXmas]: skinId === 1,
            [$style.skinYuanDan]: skinId === 2,
            [$style.skinNewYear]: skinId === 3,
            [$style.skinXiaoNian]: skinId === 4,
            [$style.skinYuanXiao]: skinId === 5,
            [$style.skinWomenDay]: skinId === 6,
            [$style.skinNianNianFan]: skinId === 7,
            [$style.skinCampaign]: skinId === 99
        }"
    >
        <div :class="$style.container">
            <search :class="$style.search" placeholder="搜索商品" />
            <banner :class="$style.banner" :data="BANNER" />
            <coupon :class="$style.coupon" :data="COUPON" v-if="isCouponShow" />
            <activity :class="$style.activity" :data="ACTIVITY" v-if="isActivityShow" />
            <live :class="$style.live" v-if="isLiveShow" :data="parent.liveInfo" />
            <online-course :class="$style.course" v-if="isCourseShow" :data="parent.courseInfo" />
            <campaign v-if="isCampaignShow" />
            <appointment :class="$style.appointment" :data="APPOINTMENT" :slides-per-view="2" />
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
            <div :class="$style.package" v-if="PACKAGE.showStatue === 1 && isPackageShow">
                <div v-if="skinId === 0" :class="$style.title" v-text="PACKAGE.moduleName" />
                <skin-title
                    v-else
                    :class="$style.skinTitle"
                    :data="PACKAGE.moduleName"
                    :skin-id="skinId"
                />
                <package :data="PACKAGE" />
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
            <propagate :class="$style.propagate" :data="PROPAGATE" />
            <div :class="$style.recommend" v-if="RECOMMEND.values && RECOMMEND.values.length">
                <div v-if="skinId === 0" :class="$style.title" v-text="RECOMMEND.moduleName" />
                <skin-title
                    v-else
                    :class="$style.skinTitle"
                    :data="RECOMMEND.moduleName"
                    :skin-id="skinId"
                />
                <best-recommend :data="RECOMMEND" />
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
import HotItem from './components/Hot-Item.vue'
import Best from './components/Best.vue'
import BestRecommend from './components/Best-Recommend.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate-Small.vue'
import Live from '../activity/components/Live.vue'
import OnlineCourse from '../activity/components/Online-Course.vue'
import Coupon from '../activity/nian-nian-fan/Coupon.vue'
import Activity from '../activity/nian-nian-fan/Activity.vue'
import Package from '../activity/nian-nian-fan/Package.vue'
import SkinTitle from './skin/Skin-Title.vue'
import Campaign from './components/Campaign'

export default {
    name: 'HomeTemplateD',
    inject: ['parent'],
    components: {
        Search,
        Banner,
        HotItem,
        Best,
        BestRecommend,
        Appointment,
        Propagate,
        Live,
        OnlineCourse,
        Coupon,
        Activity,
        Package,
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
        APPOINTMENT () {
            return this.data.APPOINTMENT || {}
        },
        POPULAR () {
            return this.data.POPULAR || {}
        },
        PACKAGE () {
            return this.data.PACKAGE || {}
        },
        CLASS () {
            return this.data.CLASS || {}
        },
        PROPAGATE () {
            return this.data.PROPAGATE || {}
        },
        RECOMMEND () {
            return this.data.RECOMMEND || {}
        },
        isLiveShow () {
            const { liveInfo } = this.parent
            return liveInfo && liveInfo.liveModel && (liveInfo.liveModel.statue === 4 || (liveInfo.liveModel.statue === 2 && liveInfo.liveModel.hasNotice))
        },
        isCourseShow () {
            const { courseInfo } = this.parent
            return courseInfo && courseInfo.records && courseInfo.records.length
        },
        isCampaignShow () {
            return this.parent.isReportShow || this.parent.isBookShow
        },
        isCouponShow () {
            return this.COUPON.values && this.COUPON.values.length
        },
        isActivityShow () {
            return this.ACTIVITY.values && this.ACTIVITY.values.length
        },
        isPackageShow () {
            return this.PACKAGE.values && this.PACKAGE.values.length
        }
    }
}
</script>

<style module lang="scss">
@import './skin/skin.scss';

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
.hot-item {
    position: relative;
    .title {
        &:after {
            position: absolute;
            top: 38px;
            left: 190px;
            content: 'HOT';
            width: 44px;
            line-height: 24px;
            text-align: center;
            font-size: 14px;
            color: #fff;
            font-weight: normal;
            background: linear-gradient(60deg, #fe7700 35%, rgba(255, 255, 255, .5), #fe7700 75%);
            background-size: 200%;
            border-radius: 12px;
            animation: bgc-move 2s ease infinite;
        }
    }
    @keyframes bgc-move {
        0% {
            background-position: 150% 0;
        }
        100% {
            background-position: -50% 0;
        }
    }
}

.package,
.hot-item,
.best,
.recommend {
    padding: 0 24px;
}

.activity,
.live,
.course,
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
