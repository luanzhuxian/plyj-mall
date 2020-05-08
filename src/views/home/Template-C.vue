<template>
    <div :class="[$style.homeTemplateD, $style[skinClassNameMap[skinId]]]">
        <div :class="$style.container">
            <search :class="$style.search" placeholder="搜索商品" />
            <propagate :class="$style.propagate" :data="PROPAGATE" />
            <live :class="$style.live" v-if="isLiveShow" :data="parent.liveInfo" />
            <online-course :class="$style.course" v-if="isCourseShow" :data="parent.courseInfo" />
            <campaign v-if="isCampaignShow" />
            <activity :class="$style.activity" v-if="isNwEventShow" />
            <d12-activity :class="$style.activity" />
            <appointment :class="$style.appointment" :data="APPOINTMENT" :style-type="2" />
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
            <div :class="$style.teachers" v-if="TEACHERS.showStatue === 1">
                <div v-if="skinId === 0" :class="$style.title" v-text="TEACHERS.moduleName" />
                <skin-title
                    v-else
                    :class="$style.skinTitle"
                    :data="TEACHERS.moduleName"
                    :skin-id="skinId"
                />
                <teachers :data="TEACHERS" />
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
import Live from './components/Live.vue'
import OnlineCourse from './components/Online-Course.vue'
import Activity from '../activity/spring/Activity.vue'
import D12Activity from './components/Activity.vue'
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
        Activity,
        D12Activity,
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
        isNwEventShow () {
            return this.parent.nwEvent && this.parent.nwEvent.permissionStatus
        },
        isCampaignShow () {
            return this.parent.isReportShow || this.parent.isBookShow
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
        //   top: 2px;
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
.course {
    padding: 24px 24px 0;
}

.activity,
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
