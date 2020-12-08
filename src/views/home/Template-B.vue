<template>
    <div :class="[$style.homeTemplateD, $style[skinClassNameMap[skinId]]]">
        <div :class="$style.container">
            <Search :class="$style.search" placeholder="搜索商品" />
            <Banner :class="$style.banner" :data="BANNER" />
            <!-- 福利红包 -->
            <div :class="$style.redPackage">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/rp-banner.png" alt="" @click="$router.push({ name: 'RedPackage' })">
            </div>
            <Adv :class="$style.adv" v-if="type === 4 && ADV.showStatue === 1" :data="ADV" />
            <Live :class="$style.live" :data="LIVE" v-if="isLiveShow" />
            <OnlineCourse :class="$style.onlineCourse" :data="COURSE" v-if="isOnlineCourseShow" />
            <SeriesCourse :class="$style.seriesCourse" :data="SERIES" v-if="isSeriesCourseShow" />
            <ImageText :class="$style.imageText" :data="ImageText" v-if="isImageTextShow" />
            <div :class="$style.popular" v-if="isPopularShow">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="POPULAR.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="POPULAR.moduleName" />
                <Popular :data="POPULAR" />
            </div>
            <Appointment :class="$style.appointment" :data="APPOINTMENT" :slides-per-view="2" v-if="APPOINTMENT.showStatue === 1" />
            <Propagate :class="$style.propagate" :data="PROPAGATE" v-if="PROPAGATE.showStatue === 1" />
            <div :class="$style.class" v-if="isClassShow">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="CLASS.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="CLASS.moduleName" />
                <Class :data="CLASS" />
            </div>
            <div :class="$style.recommend" v-if="RECOMMEND.values && RECOMMEND.values.length">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="RECOMMEND.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title">
                    <span>-</span>
                    <span v-text="RECOMMEND.moduleName" />
                    <span>-</span>
                </div>
                <Recommend :data="RECOMMEND" />
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
import Live from './components/Live.vue'
import OnlineCourse from './components/Online-Course.vue'
import SeriesCourse from './components/Series-Course.vue'
import ImageText from './components/Image-Text.vue'
// import Activity from '../activity/spring-2019/Activity.vue'
// import D12Activity from './components/Activity.vue'
import Banner from './components/Banner.vue'
import Adv from './components/Adv.vue'
import Popular from './components/Popular.vue'
import Class from './components/Class.vue'
import Recommend from './components/Recommend.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate-Small.vue'
import SkinTitle from './skin/Skin-Title.vue'
import { skinClassNameMap } from './skin/map'

export default {
    name: 'HomeTemplateB',
    inject: ['parent'],
    components: {
        Search,
        Live,
        OnlineCourse,
        SeriesCourse,
        ImageText,
        // Activity,
        // D12Activity,
        Banner,
        Adv,
        Popular,
        Class,
        Recommend,
        Appointment,
        Propagate,
        SkinTitle
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
        ImageText () {
            return this.data.ImageText || {}
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
.popular {
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
.class {
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
.series-course,
.image-text {
    padding: 24px 24px 0;
}

.adv {
    padding: 20px 24px 0;
    background-color: #f4f5f9;
}
.appointment,
.propagate {
    padding: 24px 24px 0;
    background-color: #f4f5f9;
}

.red-package {
    display: block;
    padding: 20px 24px 0;
    text-align: center;
    > img {
        width: 678px;
        height: 144px;
        object-fit: cover;
    }
}
</style>
