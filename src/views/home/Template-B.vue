<template>
    <div :class="[$style.homeTemplateD, $style[skinClassNameMap[skinId]]]">
        <div :class="$style.container">
            <search :class="$style.search" placeholder="搜索商品" />
            <banner :class="$style.banner" :data="BANNER" />
            <adv :class="$style.adv" v-if="type === 4 && ADV.showStatue === 1" :data="ADV" />
            <live :class="$style.live" :data="LIVE" v-if="LIVE.values && LIVE.values.length" />
            <online-course :class="$style.onlineCourse" :data="COURSE" v-if="COURSE.values && COURSE.values.length" />
            <series-course :class="$style.seriesCourse" :data="SERIES" v-if="SERIES.values && SERIES.values.length" />
            <campaign v-if="isCampaignShow" />
            <activity :class="$style.activity" v-if="type === 4 && isNwEventShow" />
            <!-- <d12-activity :class="$style.activity" v-if="type === 4" /> -->
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
            <appointment
                :class="$style.appointment"
                :data="APPOINTMENT"
                :slides-per-view="2"
            />
            <propagate
                :class="$style.propagate"
                :data="PROPAGATE"
            />
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
                <div v-if="skinId === 0" :class="$style.title">
                    <span>-</span>
                    <span v-text="RECOMMEND.moduleName" />
                    <span>-</span>
                </div>
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
import SeriesCourse from './components/Series-Course.vue'
import Activity from '../activity/spring/Activity.vue'
// import D12Activity from './components/Activity.vue'
import Banner from './components/Banner.vue'
import Adv from './components/Adv.vue'
import HotItem from './components/Hot-Item.vue'
import Best from './components/Best.vue'
import Recommend from './components/Recommend.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate-Small.vue'
import SkinTitle from './skin/Skin-Title.vue'
import Campaign from './components/Campaign'
import { skinClassNameMap } from './skin/map'

export default {
    name: 'HomeTemplateB',
    inject: ['parent'],
    components: {
        Search,
        Live,
        OnlineCourse,
        SeriesCourse,
        Activity,
        // D12Activity,
        Banner,
        Adv,
        HotItem,
        Best,
        Recommend,
        Appointment,
        Propagate,
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
        ADV () {
            return this.data.ADV || {}
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
        POPULAR () {
            return this.data.POPULAR || {}
        },
        CLASS () {
            return this.data.CLASS || {}
        },
        RECOMMEND () {
            return this.data.RECOMMEND || {}
        },
        APPOINTMENT () {
            return this.data.APPOINTMENT || {}
        },
        PROPAGATE () {
            return this.data.PROPAGATE || {}
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

.home-template-b {
    background-color: #ededed;
    font-size: 0;
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
    padding: 34px 24px 0;
    background-color: #f4f5f9;
    .title {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 20px;
        position: relative;
        font-size: 36px;
        font-weight: bold;
        &:after {
            position: absolute;
            top: 0;
            left: 136px;
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
.best {
    padding: 24px;
    background-color: #f4f5f9;
    .title {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 20px;
        position: relative;
        font-size: 36px;
        font-weight: bold;
    }
}
.recommend {
    padding: 0 24px;
    color: #000;
    background: #eae9f7;
    .title {
        position: relative;
        text-align: center;
        font-size: 36px;
        font-weight: bolder;
        color: #f2b036;
        letter-spacing: 14px;
        padding: 40px 0 34px;
        span {
            display: inline-block;
            &:nth-last-of-type(1) {
                transform: scaleX(2);
                margin-left: 18px;
            }
            &:nth-of-type(1) {
                margin-right: 18px;
                transform: scaleX(2);
                transform-origin: 0;
            }
        }
    }
}
.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    font-size: 26px;
    color: #999;
    background: #eae9f7;
}

.live,
.online-course,
.series-course {
    padding: 24px 24px 0;
}

.adv,
.activity {
    padding: 20px 24px 0;
    background-color: #f4f5f9;
}
.appointment,
.propagate {
    padding: 24px 24px 0;
    background-color: #f4f5f9;
}

</style>
