<template>
    <div :class="[$style.homeTemplateD, $style[skinClassNameMap[skinId]]]">
        <div :class="$style.container">
            <Search :class="$style.search" placeholder="搜索商品" />
            <!-- banner -->
            <Banner :class="$style.banner" :data="Banner" />
            <!-- 分类 -->
            <Classify :class="$style.classify" :data="Classify" v-if="isClassifyShow" />
            <!-- 福利红包 -->
            <div :class="$style.redPackage" v-if="parent.isRedPackageShow">
                <img src="https://mallcdn.youpenglai.com/static/mall/2.13.0/rp-banner.png" alt="" @click="$router.push({ name: 'RedPackage' })">
            </div>
            <!-- 优惠券 -->
            <Coupon :class="$style.coupon" :data="Coupon" v-if="isCouponShow" />
            <!-- 活动 -->
            <Activity :class="$style.activity" :data="Activity" v-if="isActivityShow" />
            <!-- 直播 -->
            <Live :class="$style.live" :data="Live" v-if="isLiveShow" />
            <!-- 单课 -->
            <SingleCourse :class="$style.singleCourse" :data="SingleCourse" v-if="isSingleCourseShow" />
            <!-- 系列课 -->
            <SeriesCourse :class="$style.seriesCourse" :data="SeriesCourse" v-if="isSeriesCourseShow" />
            <!-- 图文资料 -->
            <ImageText :class="$style.imageText" :data="ImageText" v-if="isImageTextShow" />
            <!-- 预约 -->
            <Appointment :class="$style.appointment" :data="Appointment" :slides-per-view="2" v-if="Appointment.showStatue === 1" />
            <!-- 秒杀 -->
            <div :class="$style.miaosha" v-if="isMiaoshaShow">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="Miaosha.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="Miaosha.moduleName" />
                <Miaosha :data="Miaosha" />
            </div>
            <!-- 组合课 -->
            <div :class="$style.package" v-if="isPackageShow">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="Package.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="Package.moduleName" />
                <Package :data="Package" />
            </div>
            <!-- 团购 -->
            <div :class="$style.pintuan" v-if="isPintuanShow">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="Pintuan.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="Pintuan.moduleName" />
                <Pintuan :data="Pintuan" />
            </div>
            <!-- 预购 -->
            <div :class="$style.yugou" v-if="isYugouShow">
                <SkinTitle
                    v-if="isSkinShow"
                    :class="$style.skinTitle"
                    :data="Yugou.moduleName"
                    :skin-id="skinId"
                />
                <div v-else-if="skinId !== null" :class="$style.title" v-text="Yugou.moduleName" />
                <Yugou :data="Yugou" />
            </div>
            <!-- 品宣 -->
            <Propagate :class="$style.propagate" :data="Propagate" v-if="Propagate.showStatue === 1" />
            <!-- 商品 -->
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
            <!-- 课程 -->
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
            <!-- 精品推荐 -->
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
import Banner from './components/Banner.vue'
import Classify from './components/Classify.vue'
import Activity from './activity/Activity.vue'
import Coupon from './activity/Coupon.vue'
import Live from './components/Live.vue'
import SingleCourse from './components/Single-Course.vue'
import SeriesCourse from './components/Series-Course.vue'
import ImageText from './components/Image-Text.vue'
import Appointment from './components/Appointment.vue'
import Propagate from './components/Propagate-Small.vue'
import Miaosha from './activity/Miaosha.vue'
import Pintuan from './activity/Pintuan.vue'
import Yugou from './activity/Yugou.vue'
import Package from './activity/Package.vue'
import Popular from './components/Popular.vue'
import Class from './components/Class.vue'
import Recommend from './components/Recommend.vue'
import SkinTitle from './skin/Skin-Title.vue'
import { skinClassNameMap } from './skin/map'
import SkinMixin from './skin/mixin'

export default {
    name: 'HomeTemplateD',
    inject: ['parent'],
    mixins: [SkinMixin],
    components: {
        Search,
        Banner,
        Classify,
        Coupon,
        Activity,
        Live,
        SingleCourse,
        SeriesCourse,
        ImageText,
        Appointment,
        Propagate,
        Miaosha,
        Pintuan,
        Yugou,
        Package,
        Popular,
        Class,
        Recommend,
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
        Classify () {
            return this.data.Classify || {}
        },
        Coupon () {
            return this.data.Coupon || {}
        },
        Activity () {
            return this.data.Activity || {}
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
        Miaosha () {
            return this.data.Miaosha || {}
        },
        Pintuan () {
            return this.data.Pintuan || {}
        },
        Yugou () {
            return this.data.Yugou || {}
        },
        Package () {
            return this.data.Package || {}
        },
        Propagate () {
            return this.data.Propagate || {}
        },
        Popular () {
            return this.data.Popular || {}
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
        isCouponShow () {
            return this.Coupon.values && this.Coupon.values.length
        },
        isClassifyShow () {
            return this.Classify.showStatue === 1 && this.Classify.values && this.Classify.values.length
        },
        isActivityShow () {
            return this.Activity.showStatue === 1 && this.Activity.values && this.Activity.values.length
        },
        isMiaoshaShow () {
            return this.Miaosha.showStatue === 1 && this.Miaosha.values && this.Miaosha.values.length
        },
        isPintuanShow () {
            return this.Pintuan.showStatue === 1 && this.Pintuan.values && this.Pintuan.values.length
        },
        isYugouShow () {
            return this.Yugou.showStatue === 1 && this.Yugou.values && this.Yugou.values.length
        },
        isPackageShow () {
            return this.Package.showStatue === 1 && this.Package.values && this.Package.values.length
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
            this.setSkinTitleClassName()
        }
    }
}
</script>

<style module lang="scss">
@import './skin/style/common.scss';

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

.classify,
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
.single-course,
.series-course,
.image-text,
.coupon,
.propagate,
.appointment {
    padding: 20px 24px 0;
}
.classify {
    margin-top: 20px;
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
.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    font-size: 26px;
    color: #999;
}

</style>
