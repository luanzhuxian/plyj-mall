<template>
    <Panel custom-class="package-panel" :title="title" subtitle="双十二组合产品特惠，折扣不停歇" @click="$router.push({ name: 'CoursePackage' })">
        <ul :class="$style.packageList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <router-link
                    v-if="item.combinationDetailList && item.combinationDetailList.length"
                    :class="$style.packageListItem"
                    :key="i"
                    tag="li"
                    :to="{
                        name: 'CoursePackage',
                        query: { activityId: item.combinationDetailList[0].id }
                    }"
                >
                    <div :class="$style.imgWrapper">
                        <img :src="item.combinationDetailList[0].imageUrl + '?x-oss-process=style/thum-middle'">
                        <div :class="$style.rule">
                            <span>活动到手价：<b>{{ item.combinationDetailList[0].discountTotalPrice }}</b></span>
                        </div>
                        <div :class="$style.countdownWrapper">
                            <span :class="$style.text" v-if="item.combinationDetailList[0].status === 0">距开始</span>
                            <span :class="$style.text" v-if="item.combinationDetailList[0].status === 1">距结束</span>
                            <span :class="$style.text" v-if="item.combinationDetailList[0].status === 2">已结束</span>
                            <Countdown
                                :class="$style.countdown"
                                v-if="~[0, 1].indexOf(item.combinationDetailList[0].status)"
                                :duration="getDuration(item.combinationDetailList[0])"
                                @finish="() => item.combinationDetailList[0].status += 1"
                            >
                                <template v-slot="{time}">
                                    <i :class="$style.block">{{ String(time.days).padStart(2, '0') }}</i>
                                    <span :class="[$style.colon, $style.day]">天</span>
                                    <i :class="$style.block">{{ String(time.hours).padStart(2, '0') }}</i>
                                    <span :class="$style.colon">:</span>
                                    <i :class="$style.block">{{ String(time.minutes).padStart(2, '0') }}</i>
                                    <span :class="$style.colon">:</span>
                                    <i :class="$style.block">{{ String(time.seconds).padStart(2, '0') }}</i>
                                </template>
                            </Countdown>
                        </div>
                    </div>
                    <div :class="$style.info">
                        <div :class="$style.name">
                            {{ item.activityName }}
                        </div>
                        <div :class="$style.sub">
                            <del :class="$style.original">{{ `原价 ¥${item.combinationDetailList[0].totalPrice}` }}</del>
                            <span :class="$style.count" v-if="~[1, 2].indexOf(item.combinationDetailList[0].status)">
                                {{ `已有${item.combinationDetailList[0].salesVolume || 0}人参与` }}
                            </span>
                        </div>
                        <swiper :class="$style.packageListItemProdList" :options="swiperOption">
                            <swiper-slide v-for="(prod, j) of item.combinationDetailList[0].productModelList" :key="j">
                                <router-link
                                    :class="$style.packageListItemProd"
                                    tag="li"
                                    :to="{
                                        name: (prod.productType === 'KNOWLEDGE_COURSE') ? 'Curriculum' : 'Product',
                                        params: { productId: prod.productId },
                                        query: { currentProductStatus: 6 }
                                    }"
                                >
                                    <div :class="$style.imgWrapper">
                                        <label v-if="prod.productType">{{ typeMap[prod.productType] }}</label>
                                        <img :src="prod.productImage + '?x-oss-process=style/thum-middle'" alt="">
                                    </div>
                                    <div :class="$style.info">
                                        <div :class="$style.name">
                                            {{ prod.productName }}
                                        </div>
                                        <div :class="$style.price">
                                            组合价<b>{{ (prod.price * 1000 * prod.count) / 1000 }}</b>
                                        </div>
                                        <del :class="$style.original">{{ `原价 ¥${(prod.originPrice * 1000 * prod.count) / 1000}` }}</del>
                                    </div>
                                </router-link>
                            </swiper-slide>
                        </swiper>
                        <div :class="$style.packageListItemBtnWrapper">
                            <button :class="{
                                [$style.packageListItemBtn]: true,
                                [$style.disabled]: !item.combinationDetailList[0].stock || item.combinationDetailList[0].status !== 1
                            }">
                                <template v-if="item.combinationDetailList[0].status === 2">
                                    已结束
                                </template>
                                <template v-else>
                                    <template v-if="item.combinationDetailList[0].stock">
                                        立即抢购
                                    </template>
                                    <template v-else>
                                        太火爆，已抢空
                                    </template>
                                </template>
                            </button>
                        </div>
                    </div>
                </router-link>
            </template>
        </ul>
    </Panel>
</template>

<script>
import { mapGetters } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Panel from './Panel.vue'
import Countdown from '../components/Countdown.vue'
import { getDuration } from '../helper'

export default {
    name: 'Package',
    components: {
        swiper,
        swiperSlide,
        Panel,
        Countdown
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
            swiperOption: {
                slidesPerView: 2.45,
                spaceBetween: 0,
                grabCursor: true
            },
            typeMap: {
                PHYSICAL_GOODS: '实体商品',
                VIRTUAL_GOODS: '虚拟商品',
                FORMAL_CLASS: '正式课',
                EXPERIENCE_CLASS: '体验课',
                KNOWLEDGE_COURSE: '知识课程',
                SERIES_OF_COURSE: '系列课'
            }
        }
    },
    computed: {
        ...mapGetters(['mallDomain']),
        title () {
            return this.mallDomain === 'pljs' ? '组合聚惠购' : '组合聚惠学'
        }
    },
    methods: {
        getDuration
    }
}
</script>

<style lang="scss">
.package-panel {
    .double-12-panel-container {
        margin-top: 0;
        padding: 40px 44px;
    }
}
</style>
<style lang="scss" module>
.package {
    &-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        &-item {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 1032px;
            margin-top: 40px;
            background: #ffffff;
            border-radius: 40px;
            &:nth-of-type(1) {
                margin-top: 0;
            }
            > .img-wrapper {
                position: relative;
                box-sizing: border-box;
                padding: 10px 10px 0;
                width: 100%;
                height: 536px;
                border-radius: 40px 40px 0 0;
                overflow: hidden;
                > img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 40px 40px 0 0;
                }
            }
            .rule {
                position: absolute;
                left: 10px;
                bottom: 83px;
                padding: 0 20px;
                max-width: 430px;
                line-height: 70px;
                text-align: center;
                font-family: Microsoft YaHei;
                font-weight: 600;
                font-size: 28px;
                color: #D00C06;
                background: linear-gradient(180deg, #FFEB12 0%, #FFC26F 100%);
                z-index: 1;
                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    right: -24px;
                    width: 25px;
                    height: 76px;
                    background: linear-gradient(-105deg, transparent 24px, #FFEB12 26px, #FFC26F 100%);
                }
                > span {
                    display: block;
                    @include elps();
                    > b {
                        font-size: 36px;
                        &::before {
                            content: '￥';
                            font-size: 28px;
                        }
                    }
                }
            }
            .countdown-wrapper {
                position: absolute;
                left: 10px;
                right: 10px;
                bottom: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 84px;
                background: linear-gradient(90deg, #FFD371 0%, #F78E13 100%);
                z-index: 1;
                font-size: 20px;
                font-family: Microsoft YaHei;
                font-weight: 600;
                color: #FFFFFF;
                    .text {
                        font-size: 24px;
                    }
                    .text,
                    .colon {
                        display: inline-block;
                        padding: 0 8px;
                    }
                    .day {
                        margin-right: 20px;
                    }
                    .block {
                        display: inline-block;
                        box-sizing: border-box;
                        padding: 0 4px;
                        width: 48px;
                        line-height: 46px;
                        background: #FFFFFF;
                        font-size: 28px;
                        color: #333333;
                        text-align: center;
                    }
            }
            > .info {
                flex: 1;
                padding: 20px 0 40px 28px;
                .name {
                    font-size: 32px;
                    font-family: Microsoft YaHei;
                    font-weight: 600;
                    color: #000;
                    @include elps();
                }
                .sub {
                    display: flex;
                    align-items: center;
                    margin-top: 6px;
                    @include elps();
                }
                .original {
                    font-size: 28px;
                    color: #999999;
                }
                .count {
                    margin-left: 78px;
                    font-size: 24px;
                    color:#666666;
                }
            }
            &-prod-list {
                margin-top: 40px;
            }
            &-prod {
                display: flex;
                flex-direction: column;
                width: 240px;
                height: 310px;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                > .img-wrapper {
                    position: relative;
                    height: 160px;
                    overflow: hidden;
                    > label {
                        position: absolute;
                        top: 8px;
                        left: 8px;
                        padding: 0 14px;
                        line-height: 32px;
                        text-align: center;
                        background: #333333;
                        opacity: 0.7;
                        border-radius: 16px;
                        font-size: 20px;
                        color: #FFFFFF;
                    }
                    > img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
                > .info {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    padding: 16px 0;
                    .name {
                        font-weight: bold;
                        font-size: 26px;
                        color: #333;
                        @include elps();
                    }
                    .price {
                        margin-top: 4px;
                        font-family: Microsoft YaHei;
                        font-weight: 600;
                        font-size: 24px;
                        color: #D00C06;
                        @include elps();
                        > b {
                            font-size: 28px;
                            &::before {
                                content: '￥';
                                font-size: 24px;;
                            }
                        }
                    }
                    .original {
                        margin-top: 8px;
                        font-size: 24px;
                        color: #999999;
                    }
                }
            }
            &-btn-wrapper {
                margin-top: 20px;
                padding-right: 28px;
            }
            &-btn {
                width: 100%;
                line-height: 80px;
                text-align: center;
                background: linear-gradient(180deg, #D80000 0%, #EA6504 100%);
                border: none;
                border-radius: 8px;
                font-size: 28px;
                font-family: Microsoft YaHei;
                font-weight: 600;
                color: #FFFFFF;
                &.disabled {
                    background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
                }
            }
        }
    }
}

</style>
