<template>
    <div :class="[$style.homeTemplateD, $style[skinClassNameMap[skinId]]]">
        <div :class="$style.container">
            <search :class="$style.search" placeholder="搜索商品" />
            <banner :class="$style.banner" :data="BANNER" />
            <coupon :class="$style.coupon" :data="COUPON" v-if="isCouponShow" />
            <activity :class="$style.activity" :data="ACTIVITY" v-if="isActivityShow" />
            <live :class="$style.live" v-if="isLiveShow" :data="parent.liveInfo" />
            <online-course :class="$style.course" v-if="isCourseShow" :data="parent.courseInfo" />
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
import Recommend from './components/Recommend.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate-Small.vue'
import Live from './components/Live.vue'
import OnlineCourse from './components/Online-Course.vue'
import Coupon from './activity/Coupon.vue'
import Activity from './activity/Activity.vue'
import Miaosha from './activity/Miaosha.vue'
import Pintuan from './activity/Pintuan.vue'
import Yugou from './activity/Yugou.vue'
import Package from './activity/Package.vue'
import SkinTitle from './skin/Skin-Title.vue'
import Campaign from './components/Campaign'
import { skinClassNameMap } from './skin/map'

export default {
    name: 'HomeTemplateD',
    inject: ['parent'],
    components: {
        Search,
        Banner,
        Recommend,
        Appointment,
        Propagate,
        Live,
        OnlineCourse,
        Coupon,
        Activity,
        Miaosha,
        Pintuan,
        Yugou,
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
        RECOMMEND () {
            return this.data.RECOMMEND || {}
        },
        // statue: 1、开启 2、预热期 3、进行中
        isLiveShow () {
            const { liveInfo } = this.parent
            if (!liveInfo.liveModel || !liveInfo.liveModel.length) {
                return false
            }
            const list = liveInfo.liveModel.filter(item => item.statue === 0 || item.statue === 4 || (item.statue === 2 && item.hasNotice))
            return !!list.length
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
