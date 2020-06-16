<template>
    <div :class="[$style.homeTemplateD, $style[skinClassNameMap[skinId]]]">
        <div :class="$style.container">
            <search :class="$style.search" placeholder="搜索商品" />
            <propagate :class="$style.propagate" :data="PROPAGATE" />
            <live :class="$style.live" :data="LIVE" v-if="isLiveShow" />
            <online-course :class="$style.onlineCourse" :data="COURSE" v-if="isOnlineCourseShow" />
            <series-course :class="$style.seriesCourse" :data="SERIES" v-if="isSeriesCourseShow" />
            <campaign v-if="isCampaignShow" />
            <!-- <activity :class="$style.activity" v-if="isNwEventShow" /> -->
            <!-- <d12-activity :class="$style.activity" /> -->
            <appointment :class="$style.appointment" :data="APPOINTMENT" :style-type="2" v-if="APPOINTMENT.showStatue === 1" />
            <div :class="$style.hotItem" v-if="POPULAR.showStatue === 1">
                <skin-title
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="POPULAR.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="POPULAR.moduleName" />
                <hot-item :data="POPULAR" />
            </div>
            <div :class="$style.teachers" v-if="TEACHERS.showStatue === 1">
                <skin-title
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="TEACHERS.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="TEACHERS.moduleName" />
                <teachers :data="TEACHERS" />
            </div>
            <div :class="$style.best" v-if="CLASS.showStatue === 1">
                <skin-title
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="CLASS.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="CLASS.moduleName" />
                <best :data="CLASS" />
            </div>
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
import Search from './components/Search.vue'
import Live from './components/Live.vue'
import OnlineCourse from './components/Online-Course.vue'
import SeriesCourse from './components/Series-Course.vue'
// import Activity from '../activity/spring/Activity.vue'
// import D12Activity from './components/Activity.vue'
import HotItem from './components/Hot-Item.vue'
import Best from './components/Best.vue'
import Recommend from './components/Recommend.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate.vue'
import Teachers from './components/Teachers'
import SkinTitle from './skin/Skin-Title.vue'
import Campaign from './components/Campaign'
import { skinClassNameMap } from './skin/map'

export default {
    name: 'HomeTemplateC',
    inject: ['parent'],
    components: {
        Search,
        Live,
        OnlineCourse,
        SeriesCourse,
        // Activity,
        // D12Activity,
        HotItem,
        Best,
        Recommend,
        Appointment,
        Propagate,
        Teachers,
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
        PROPAGATE () {
            return this.data.PROPAGATE || {}
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
        POPULAR () {
            return this.data.POPULAR || {}
        },
        TEACHERS () {
            return this.data.TEACHERS || {}
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
        // isNwEventShow () {
        //     return this.parent.nwEvent && this.parent.nwEvent.permissionStatus
        // },
        isCampaignShow () {
            return this.parent.isReportShow || this.parent.isBookShow
        },
        isSkinShow () {
            return skinClassNameMap.has(this.skinId)
        }
    }
}
</script>

<style module lang="scss">
@import './skin/common.scss';

.home-template-c {
    background-color: #ededed;
    font-size: 0;
}
.title {
    padding: 40px 0 20px;
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

.hot-item,
.teachers,
.best,
.recommend {
    padding: 0 20px;
}

.live,
.online-course,
.series-course {
    padding: 24px 24px 0;
}

.appointment {
    padding: 24px 20px 0;
}

.propagate {
    padding: 10px 20px 0;
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
