<template>
    <div class="product-swiper">
        <ul :class="$style.productList" v-if="list.length <= 3">
            <li
                :class="[$style.productListItem, item.isProduct ? $style.small : $style.large]"
                v-for="(item, index) of list"
                :key="index"
            >
                <div :class="$style.imgWrapper">
                    <img :src="item.goodsImage + '?x-oss-process=style/thum-small'" :alt="item.goodsName">
                </div>
                <div :class="$style.info">
                    <b :class="$style.name" v-text="item.goodsName" />
                    <div :class="$style.amount" v-if="item.redPackages && item.redPackages.length">
                        {{ `抢券抵${item.redPackages[0].amount}` }}
                    </div>
                </div>
            </li>
        </ul>
        <swiper
            v-else
            ref="swiper"
            class="swiper"
            :options="swiperOption"
            @slideChange="slideChange"
        >
            <swiper-slide
                class="swiper-no-swiping"
                :class="$style.swiperSlide"
                v-for="(item, index) in list"
                :key="index"
            >
                <li :class="[$style.productListItem]">
                    <div :class="$style.imgWrapper">
                        <img :src="item.goodsImage + '?x-oss-process=style/thum-small'" :alt="item.goodsName" v-imgError>
                    </div>
                    <div :class="$style.info">
                        <b :class="$style.name" v-text="item.goodsName" />
                        <div :class="$style.amount" v-if="item.redPackages && item.redPackages.length">
                            {{ `抢券抵${item.redPackages[0].amount}` }}
                        </div>
                    </div>
                </li>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    name: 'ProductSwiper',
    components: {
        swiper,
        swiperSlide
    },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            swiperActiveIndex: 0,
            swiperOption: {
                slidesPerView: 4,
                spaceBetween: 24,
                loop: true,
                speed: 1000,
                autoplay: {
                    delay: 1000,
                    disableOnInteraction: false,
                    stopOnLast: false
                },
                observer: true,
                observeParents: true
            }
        }
    },
    computed: {
        swiper () {
            return this.$refs.swiper.swiper
        },
        swiperSlides () {
            return Array.from(this.swiper.slides)
        }
    },
    mounted () {
        this.swiperActiveIndex = this.swiper.activeIndex
        this.updateListStyle(this.swiperActiveIndex)
    },
    activated () {
        if (this.swiper && this.swiper.autoplay.paused) {
            this.swiper.autoplay.run()
        }
    },
    deactivated () {
        if (this.swiper) {
            this.swiper.autoplay.pause()
        }
    },
    methods: {
        // getSwiperActiveIndexes () {
        //     const length = this.list.length
        //     const active = this.swiperActiveIndex
        //     const next = (active + 2) % length
        //     return [active, next]
        // },
        slideChange (swiper) {
            this.swiperActiveIndex = this.$refs.swiper.swiper.activeIndex
            this.updateListStyle(this.swiperActiveIndex)
        },
        updateListStyle (activeIndex) {
            const updateStyle = (el, className) => {
                el.classList.remove(this.$style.large)
                el.classList.remove(this.$style.small)
                el.classList.add(className)
            }
            // const slides = this.$refs.swiper.$el.querySelectorAll('.swiper-slide')
            const slides = this.swiperSlides
            if (!slides || !slides.length) {
                return false
            }

            const current = slides[activeIndex]
            const previous = slides.slice(0, activeIndex).reverse()
            const following = slides.slice(activeIndex)

            updateStyle(current, this.$style.large)
            for (const [index, slide] of following.entries()) {
                const className = index % 2 ? this.$style.small : this.$style.large
                updateStyle(slide, className)
            }
            for (const [index, slide] of previous.entries()) {
                const className = index % 2 ? this.$style.large : this.$style.small
                updateStyle(slide, className)
            }
        }
    }
}
</script>

<style lang="scss">
.product-swiper {
    .swiper {
        &-container {
            height: 230px;
        }
        &-wrapper {
            display: flex;
            align-items: center;
        }
        &-slide {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>

<style lang="scss" module>
.swiper-slide {
    &.large {
        .product-list-item {
            width: 180px;
            height: 230px;
            .img-wrapper {
                width: 100%;
                height: 144px;
                overflow: hidden;
            }
            .info {
                padding-top: 12px;
            }
            .name {
                font-size: 22px;
                line-height: 32px;
            }
            .amount {
                margin-top: 4px;
                font-size: 16px;
            }
        }
    }
    &.small {
        .product-list-item {
            margin-top: 10px;
            width: 140px;
            height: 180px;
            .img-wrapper {
                width: 100%;
                height: 112px;
                overflow: hidden;
            }
            .info {
                padding-top: 8px;
            }
            .name {
                font-size: 20px;
                line-height: 26px;
            }
            .amount {
                margin-top: 4px;
                font-size: 14px;
            }
        }
    }
}

.product-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    &-item {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        width: 90px;
        height: 115px;
        background: #ffffff;
        border-radius: 20px;
        overflow: hidden;
        transition: all .5s;
        &.large {
            width: 180px;
            height: 230px;
            .img-wrapper {
                width: 100%;
                height: 144px;
                overflow: hidden;
            }
            .info {
                padding-top: 12px;
            }
            .name {
                font-size: 22px;
                line-height: 32px;
            }
            .amount {
                margin-top: 4px;
                font-size: 16px;
            }
        }
        &.small {
            margin-top: 10px;
            width: 140px;
            height: 180px;
            .img-wrapper {
                width: 100%;
                height: 112px;
                overflow: hidden;
            }
            .info {
                padding-top: 8px;
            }
            .name {
                font-size: 20px;
                line-height: 26px;
            }
            .amount {
                margin-top: 4px;
                font-size: 14px;
            }
        }
        .img-wrapper {
            width: 100%;
            overflow: hidden;
            > img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .info {
            text-align: center;
            box-sizing: border-box;
            flex: 1;
            padding: 0 10px;
            background: #FFF36E;
            color: #FF6407;
            @include elps();
        }

    }
}
</style>
