<template>
    <panel :custom-class="$style.packagePanel" :title="panelTitle" @click="$router.push({ name: 'CoursePackage' })">
        <ul
            v-if="data.values.length"
            :class="$style.list"
            class="package-list"
        >
            <template v-for="(item, i) of data.values">
                <swiper :options="getOptions(item.combinationDetailList[0].productModelList)" :key="i" v-if="item.combinationDetailList && item.combinationDetailList.length">
                    <template v-for="(combination, j) of item.combinationDetailList">
                        <swiper-slide :key="'combination-' + j">
                            <router-link
                                :class="$style.listItem"
                                tag="li"
                                :to="{
                                    name: 'CoursePackage',
                                    query: { activityId: combination.id }
                                }"
                            >
                                <div :class="$style.title">
                                    {{ combination.name }}
                                </div>
                                <div :class="$style.imgWrapper">
                                    <img :src="combination.imageUrl + '?x-oss-process=style/thum-middle'" alt="">
                                    <div :class="$style.countDownWrapper">
                                        <span v-if="combination.status === 0">距开始：</span>
                                        <span v-if="combination.status === 1">距结束：</span>
                                        <span v-if="combination.status === 2">已结束</span>
                                        <count-down
                                            v-if="~[0, 1].indexOf(combination.status)"
                                            :timestamp="getTime(combination)"
                                            color="#4076CC"
                                            background="#fff"
                                            format="HH:mm"
                                            @done="combination.status += 1"
                                        />
                                    </div>
                                </div>
                                <div :class="$style.price">
                                    <div :class="$style.origin">
                                        <span :class="$style.left">
                                            {{ `原价：￥${combination.totalPrice}` }}
                                        </span>
                                        <span :class="$style.right">
                                            {{ `${combination.salesVolume}人已买` }}
                                        </span>
                                    </div>
                                    <div :class="$style.current">
                                        <template v-if="combination.status === 2">
                                            已结束
                                        </template>
                                        <template v-else>
                                            <template v-if="combination.stock">
                                                <span v-if="combination.status === 0">{{ `组合价：￥${combination.discountTotalPrice}` }}</span>
                                                <span v-if="combination.status === 1">{{ `组合到手：￥${combination.discountTotalPrice}` }}</span>
                                            </template>
                                            <template v-else>
                                                太火爆，已抢空
                                            </template>
                                        </template>
                                    </div>
                                </div>
                            </router-link>
                        </swiper-slide>
                        <swiper-slide v-for="(prod, k) of combination.productModelList" :key="'prod-' + k">
                            <router-link
                                :class="$style.listProdWrapper"
                                tag="li"
                                :to="{
                                    name: (prod.productType === 'KNOWLEDGE_COURSE') ? 'Curriculum' : 'Product',
                                    params: { productId: prod.productId },
                                    query: { currentProductStatus: 6 }
                                }"
                            >
                                <div :class="$style.listProd">
                                    <div :class="$style.imgWrapper">
                                        <img :src="prod.productImage + '?x-oss-process=style/thum-middle'" alt="">
                                        <div :class="$style.name">
                                            {{ prod.productName }}
                                        </div>
                                    </div>
                                    <div :class="$style.origin">
                                        {{ `原价：￥${(prod.originPrice * 1000 * prod.count) / 1000}` }}
                                    </div>
                                    <div :class="$style.current">
                                        {{ `组合价：￥${(prod.price * 1000 * prod.count) / 1000}` }}
                                    </div>
                                </div>
                            </router-link>
                        </swiper-slide>
                    </template>
                </swiper>
            </template>
        </ul>
    </panel>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Panel from './Panel.vue'
import CountDown from '../../activity/components/Count-Down.vue'
import { getTime } from '../helper'

const map = {
    0: 1,
    1: 2,
    2: 2.13,
    3: 2.16,
    4: 2.18,
    5: 2.20,
    6: 2.21
}

export default {
    name: 'Package',
    components: {
        swiper,
        swiperSlide,
        CountDown,
        Panel
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {
            panelTitle: {
                name: 'icon-zhjhx-3f171',
                width: 368,
                height: 80
            }
        }
    },
    methods: {
        getTime,
        getOptions (list = []) {
            const length = (list && list.length) || 0
            const swiperOption = {
                slidesPerView: map[length],
                spaceBetween: 0,
                grabCursor: true
            }
            return swiperOption
        }
    }
}
</script>

<style lang="scss" module>
.package-panel {
    padding-right: 0;
}
.list {
    &-item {
        position: relative;
        box-sizing: border-box;
        padding: 20px 16px;
        width: 344px;
        height: 500px;
        background-color: #ffe218;
        border: 4px solid #222;
        border-radius: 20px;
        .title {
            box-sizing: border-box;
            margin: 0 auto;
            padding: 0 36px;
            width: 296px;
            line-height: 40px;
            text-align: center;
            background-color: #02489e;
            border: 4px solid #222;
            border-radius: 12px;
            font-size: 24px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #fff;
            letter-spacing: 4px;
            @include elps();
        }
        .img-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            margin-top: 20px;
            width: 100%;
            height: 270px;
            border: 4px solid #222;
            border-radius: 16px;
            overflow: hidden;
            img {
                flex: 1;
                width: 100%;
                height: 0;
                object-fit: cover;
            }
        }
        .count-down-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 8px;
            height: 60px;
            line-height: 60px;
            background-color: #4076cc;
            font-size: 24px;
            font-family: Helvetica;
            color: #fff;
            > .num {
                width: 36px;
                height: 38px;
                line-height: 38px;
                text-align: center;
                background-color: #fff;
                color: #4076cc;
                border-radius: 4px;
            }
        }
        .origin {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 12px;
            font-size: 24px;
            font-family: Helvetica;
            line-height: 28px;
            color: #ff341b;
            @include elps();
            .left {
                @include elps();
            }
            .right {
                font-size: 20px;
                color: #e79b01;
                @include elps();
            }
        }
        .current {
            margin: 18px auto 0;
            padding: 0 20px;
            // max-width: fit-content;
            // max-width: 100%;
            height: 60px;
            line-height: 52px;
            background: #f08b12;
            border: 2px solid #222;
            border-radius: 10px;
            color: #fff;
            font-size: 28px;
            font-family: Helvetica;
            font-weight: bold;
            text-align: center;
            @include elps();
        }
    }
    &-prod-wrapper {
        display: flex;
        align-items: center;
        padding: 0 8px;
        height: 440px;
        background-color: #f8a810;
        border: 4px solid #222;
        border-left: none;
        border-right: none;
    }
    &-prod {
        box-sizing: border-box;
        padding: 12px;
        width: 280px;
        height: 330px;
        background: #ffdf7c;
        border: 4px solid #222;
        border-radius: 16px;
        .img-wrapper {
            display: flex;
            flex-direction: column;
            height: 216px;
            border: 4px solid #222;
            border-radius: 16px;
            overflow: hidden;
            img {
                flex: 1;
                width: 100%;
                height: 0;
                object-fit: cover;
            }
        }
        .name {
            padding: 0 12px;
            height: 44px;
            line-height: 44px;
            background: #02489e;
            font-size: 24px;
            font-family: Microsoft YaHei;
            color: #fff;
            text-align: center;
            @include elps();
        }
        .origin {
            margin-top: 12px;
            font-size: 24px;
            line-height: 30px;
            color: #f28b0a;
            @include elps();
        }
        .current {
            margin-top: 6px;
            font-size: 24px;
            font-weight: bold;
            line-height: 30px;
            color: #ff341b;
            @include elps();
        }
    }
}

</style>

<style lang="scss">
.package-list {
    .swiper-container {
        margin-top: 32px;
        &:nth-of-type(1) {
            margin: 0;
        }
        > .swiper-wrapper > .swiper-slide {
            display: flex;
            align-items: center;
            width: auto !important;
            height: 508px !important;
            &:nth-of-type(1) {
                width: auto !important;
            }
            &:nth-of-type(2) > li {
                padding-left: 20px !important;
            }
            &:nth-last-of-type(1) > li {
                padding-right: 20px !important;
                border-right: 4px solid #222 !important;
            }
        }
    }
}

</style>
