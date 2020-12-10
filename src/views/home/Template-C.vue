<template>
    <div :class="[$style.homeTemplateD, $style[skinClassNameMap[skinId]]]">
        <div :class="$style.container">
            <Search :class="$style.search" placeholder="搜索商品" />
            <Propagate :class="$style.propagate" :data="Propagate" />
            <!-- 福利红包 -->
            <div :class="$style.redPackage">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.13.0/red-package/rp-banner.png" alt="" @click="$router.push({ name: 'RedPackage' })">
            </div>
            <Live :class="$style.live" :data="Live" v-if="isLiveShow" />
            <SingleCourse :class="$style.singleCourse" :data="SingleCourse" v-if="isSingleCourseShow" />
            <SeriesCourse :class="$style.seriesCourse" :data="SeriesCourse" v-if="isSeriesCourseShow" />
            <ImageText :class="$style.imageText" :data="ImageText" v-if="isImageTextShow" />
            <Appointment :class="$style.appointment" :data="Appointment" :style-type="2" v-if="Appointment.showStatue === 1" />
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
            <div :class="$style.teachers" v-if="isTeachersShow">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="Teachers.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="Teachers.moduleName" />
                <Teachers :data="Teachers" />
            </div>
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
                <div v-else-if="skinId !== null" :class="$style.title" v-text="Recommend.moduleName" />
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
import Popular from './components/Popular.vue'
import Class from './components/Class.vue'
import Recommend from './components/Recommend.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate.vue'
import Teachers from './components/Teachers'
import SkinTitle from './skin/Skin-Title.vue'
import { skinClassNameMap } from './skin/map'

export default {
    name: 'HomeTemplateC',
    inject: ['parent'],
    components: {
        Search,
        Live,
        SingleCourse,
        SeriesCourse,
        ImageText,
        // Activity,
        // D12Activity,
        Popular,
        Class,
        Recommend,
        Appointment,
        Propagate,
        Teachers,
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
        Propagate () {
            return this.data.Propagate || {}
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
        Appointment () {
            return this.data.Appointment || {}
        },
        Popular () {
            return this.data.Popular || {}
        },
        Teachers () {
            return this.data.Teachers || {}
        },
        Class () {
            return this.data.Class || {}
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
        isTeachersShow () {
            return this.Teachers.showStatue === 1 && this.Teachers.values && this.Teachers.values.length
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
.popular {
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

.popular,
.teachers,
.class,
.recommend {
    padding: 0 20px;
}

.live,
.single-course,
.series-course,
.image-text {
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
