<template>
    <div :class="[$style.homeTemplateD, $style[skinClassNameMap[skinId]]]">
        <div :class="$style.container">
            <Search :class="$style.search" placeholder="搜索商品" />
            <Banner :class="$style.banner" :data="Banner" />
            <!-- 福利红包 -->
            <div :class="$style.redPackage" v-if="parent.isRedPackageShow">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.13.0/rp-banner.png" alt="" @click="$router.push({ name: 'RedPackage' })">
            </div>
            <Adv :class="$style.adv" v-if="type === 4 && Adv.showStatue === 1" :data="Adv" />
            <Live :class="$style.live" :data="Live" v-if="isLiveShow" />
            <SingleCourse :class="$style.singleCourse" :data="SingleCourse" v-if="isSingleCourseShow" />
            <SeriesCourse :class="$style.seriesCourse" :data="SeriesCourse" v-if="isSeriesCourseShow" />
            <ImageText :class="$style.imageText" :data="ImageText" v-if="isImageTextShow" />
            <div :class="$style.popular" v-if="isPopularShow">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="Popular.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="Popular.moduleName" />
                <Popular :data="Popular" />
            </div>
            <Appointment :class="$style.appointment" :data="Appointment" :slides-per-view="2" v-if="Appointment.showStatue === 1" />
            <Propagate :class="$style.propagate" :data="Propagate" v-if="Propagate.showStatue === 1" />
            <div :class="$style.class" v-if="isClassShow">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="Class.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="Class.moduleName" />
                <Class :data="Class" />
            </div>
            <div :class="$style.recommend" v-if="Recommend.values && Recommend.values.length">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="Recommend.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title">
                    <span>-</span>
                    <span v-text="Recommend.moduleName" />
                    <span>-</span>
                </div>
                <Recommend :data="Recommend" />
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
import SingleCourse from './components/Single-Course.vue'
import SeriesCourse from './components/Series-Course.vue'
import ImageText from './components/Image-Text.vue'
// import Activity from '../activity/spring-2020/Activity.vue'
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
import SkinMixin from './skin/mixin'

export default {
    name: 'HomeTemplateB',
    inject: ['parent'],
    mixins: [SkinMixin],
    components: {
        Search,
        Live,
        SingleCourse,
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
        Banner () {
            return this.data.Banner || {}
        },
        Adv () {
            return this.data.Adv || {}
        },
        Live () {
            return this.data.Live || {}
        },
        SingleCourse () {
            return this.data.SingleCourse || {}
        },
        SeriesCourse () {
            return this.data.SeriesCourse || {}
        },
        ImageText () {
            return this.data.ImageText || {}
        },
        Popular () {
            return this.data.Popular || {}
        },
        Class () {
            return this.data.Class || {}
        },
        Appointment () {
            return this.data.Appointment || {}
        },
        Propagate () {
            return this.data.Propagate || {}
        },
        Recommend () {
            return this.data.Recommend || {}
        },
        isLiveShow () {
            return this.Live.showStatue === 1 && this.Live.values && this.Live.values.length
        },
        isSingleCourseShow () {
            return this.SingleCourse.showStatue === 1 && this.SingleCourse.values && this.SingleCourse.values.length
        },
        isSeriesCourseShow () {
            return this.SeriesCourse.showStatue === 1 && this.SeriesCourse.values && this.SeriesCourse.values.length
        },
        isImageTextShow () {
            return this.ImageText.showStatue === 1 && this.ImageText.values && this.ImageText.values.length
        },
        isPopularShow () {
            return this.Popular.showStatue === 1 && this.Popular.values && this.Popular.values.length
        },
        isClassShow () {
            return this.Class.showStatue === 1 && this.Class.values && this.Class.values.length
        },
        isSkinShow () {
            return skinClassNameMap.has(this.skinId)
        }
    },
    mounted () {
        if (this.skinId === 23) {
            this.setTitleCampusSupplyClassName()
        }
    }
}
</script>

<style module lang="scss">
@import './skin/style/common.scss';

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
.single-course,
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
