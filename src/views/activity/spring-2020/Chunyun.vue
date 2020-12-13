<template>
    <div :class="$style.chunyun" class="chunyun">
        <router-link :class="$style.chunyunBg" tag="div" :to="{ name: 'SpringPloughing' }">
            <div :class="$style.countdownWrapper">
                <span v-if="data.values[0].status === 0">距活动开始：</span>
                <span v-if="data.values[0].status === 1">距活动结束：</span>
                <span v-if="data.values[0].status === 2">活动已结束</span>
                <countdown
                    v-if="~[0, 1].indexOf(data.values[0].status)"
                    :duration="getDuration(data.values[0])"
                    @finish="data.values[0].status += 1"
                >
                    <template v-slot="{time}">
                        <i :class="$style.block">{{ String(time.days).padStart(2, '0') }}</i>
                        <span :class="$style.colon">天</span>
                        <i :class="$style.block">{{ String(time.hours).padStart(2, '0') }}</i>
                        <span :class="$style.colon">:</span>
                        <i :class="$style.block">{{ String(time.minutes).padStart(2, '0') }}</i>
                        <span :class="$style.colon">:</span>
                        <i :class="$style.block">{{ String(time.seconds).padStart(2, '0') }}</i>
                    </template>
                </countdown>
            </div>
            <p :class="$style.link">
                查看计划礼包 >
            </p>
            <pl-svg
                v-if="data.values[0].quarterVersion"
                :name="`icon-${map[data.values[0].quarterVersion]}`"
                width="50"
                height="105"
            />
        </router-link>
        <ul
            v-if="data.values.length && data.values[0].combinationDetailList && data.values[0].combinationDetailList.length"
            :class="[$style.chunyunList, $style[size], size]"
        >
            <template v-if="data.values[0].status === 0">
                <swiper :options="getOptions(data.values[0].combinationDetailList, map1)">
                    <swiper-slide v-for="(item, i) of data.values[0].combinationDetailList" :key="i">
                        <item-chunyun :data="item" :size="size" />
                    </swiper-slide>
                </swiper>
            </template>

            <template v-if="data.values[0].status === 1">
                <swiper :options="getOptions(item.productModelList, map2)" v-for="(item, i) of data.values[0].combinationDetailList" :key="i">
                    <swiper-slide>
                        <item-chunyun :data="item" :size="size" />
                    </swiper-slide>
                    <swiper-slide v-for="(prod, j) of item.productModelList" :key="j">
                        <router-link
                            :class="$style.chunyunListProdWrapper"
                            class="chunyun-list-prod-wrapper"
                            tag="li"
                            :to="{ name: 'Product', params: { productId: prod.productId }, query: { currentProductStatus: 5 } }"
                        >
                            <div :class="$style.chunyunListProd">
                                <div :class="$style.imgWrapper">
                                    <img v-imgError :src="prod.productImage" alt="">
                                </div>
                                <div :class="$style.name">
                                    {{ prod.productName }}
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
                </swiper>
            </template>
        </ul>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Countdown from '../../../components/activity/Countdown.vue'
import ItemChunyun from './Item-Chunyun.vue'
import { getDuration } from '../helper.js'

export default {
    name: 'Chunyun',
    components: {
        swiper,
        swiperSlide,
        Countdown,
        ItemChunyun
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
            map1: {
                0: 1,
                1: 1,
                2: 1.2,
                3: 1.2,
                4: 1.2,
                5: 1.2,
                6: 1.2
            },
            map2: {
                0: 1,
                1: 2,
                2: 2.14,
                3: 2.2,
                4: 2.25,
                5: 2.26,
                6: 2.28
            },
            map: {
                第一季: 'diyiji-adbb7',
                第二季: 'dierji-bbdb7',
                第三季: 'disanji-b8ae3',
                第四季: 'disiji-5d233',
                第五季: 'diwuji-af921'
            }
        }
    },
    computed: {
        size () {
            const { data } = this
            let result
            if (data.values[0].status === 0) {
                if (data.values[0].combinationDetailList.length === 1) result = 'large'
                if (data.values[0].combinationDetailList.length > 1) result = 'medium'
            }
            if (data.values[0].status === 1) result = 'small'
            return result
        }
    },
    methods: {
        getDuration,
        getOptions (list, map) {
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
.chunyun {
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    &-bg {
        position: relative;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/c6bd4a18-d557-4dbd-9270-edab7a0f30b1.png') no-repeat center top;
        background-size: 100% auto;
        height: 682px;
        .countdown-wrapper {
            position: absolute;
            top: 293px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            width: 420px;
            height: 70px;
            line-height: 70px;
            font-size: 28px;
            color: #96e3a9;
            display: flex;
            justify-content: center;
            align-items: center;
            .block {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 40px;
                height: 40px;
                background: #96e3a9;
                border-radius: 6px;
                font-size: 28px;
                color: #184b28;
                margin: 0 4px;
            }
        }
        .link {
            position: absolute;
            top: 390px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 26px;
            font-family: Microsoft YaHei;
            color: #184b28;
        }
        > svg {
            position: absolute;
            top: 155px;
            right: 95px;
        }
    }
    &-list {
        padding: 0 32px 48px;
        background: #8dc607;
        &.medium {
            padding: 0 0 48px 32px;
        }
        &.small {
            padding: 0 0 48px 32px;
            .chunyun-list-prod-wrapper {
                display: flex;
                align-items: center;
                padding: 0 8px;
                height: 440px;
                background: #749529;
            }
            .chunyun-list-prod {
                box-sizing: border-box;
                padding: 12px;
                width: 280px;
                height: 330px;
                background: #bfe36a;
                .img-wrapper {
                    height: 172px;
                }
                .name {
                    padding: 0 12px;
                    height: 44px;
                    line-height: 44px;
                    background: #397432;
                    font-size: 24px;
                    font-family: Microsoft YaHei;
                    color: #92f4c7;
                    text-align: center;
                    @include elps();
                }
                .origin {
                    margin-top: 12px;
                    font-size: 24px;
                    line-height: 30px;
                    color: #02684f;
                    @include elps();
                }
                .current {
                    margin-top: 6px;
                    font-size: 24px;
                    font-weight: bold;
                    line-height: 30px;
                    color: #a6482f;
                    @include elps();
                }
            }
        }
    }
}

</style>

<style lang="scss" scoped>
.chunyun {
    ::v-deep .countdown > .time > span {
        padding: 0 8px;
        font-size: 24px;
        line-height: 40px;
        color: #96e3a9;
    }
}
.small {
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
            &:nth-of-type(2) > .chunyun-list-prod-wrapper {
                padding-left: 20px;
            }
            &:nth-last-of-type(1) > .chunyun-list-prod-wrapper {
                padding-right: 20px;
            }
        }
    }
}

</style>
