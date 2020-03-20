<template>
    <div :class="$style.banner">
        <swiper
            v-if="data.values.length"
            :class="$style.container"
            :options="swiperOptionBanner"
        >
            <swiperSlide v-for="(item, i) of data.values" :key="i">
                <count-down v-if="item.shoppingStatus === 1" :data="item" :fields="{ start: 'serverTime', end: 'shoppingTime' }" />
                <img :class="$style.img" :src="item.image" :alt="item.name" @click="handelClick(item)">
            </swiperSlide>
            <div v-show="data.values.length > 1" class="banner-pagination-home-b" slot="pagination" />
        </swiper>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CountDown from '../../../components/product/Count-Down.vue'

export default {
    name: 'Banner',
    components: {
        swiper,
        swiperSlide,
        CountDown
    },
    data () {
        return {
            swiperOptionBanner: {
                autoplay: {
                    disableOnInteraction: false
                },
                spaceBetween: 40,
                pagination: {
                    el: '.banner-pagination-home-b',
                    clickable: true
                },
                loop: true
            }
        }
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    methods: {
        handelClick ({ type, value }) {
            const routeMap = {
                41: {
                    name: 'CoursePackage'
                },
                42: {
                    name: 'BattlefieldReport'
                },
                43: {
                    name: 'EpidemicSignIn'
                },
                5: {
                    name: 'InteractiveLive'
                },
                6: {
                    name: 'Appointment'
                }
            }
            // if (!value) return false
            if (type === 1) {
                this.$router.push({ name: 'Classify', params: { optionId: value || null } })
            }
            if (type === 2) {
                this.$router.push({ name: 'Product', params: { productId: value } })
            }
            if (type in routeMap) {
                this.$router.push({ name: routeMap[type].name })
            }
        }
    }
}
</script>

<style module lang="scss">
.banner {
    .container {
        border-radius: 20px;
        overflow: hidden;
    }
    .img {
        width: 100%;
        height: 470px;
    }
}

</style>
<style scoped lang="scss">
.banner-pagination-home-b {
    position: absolute;
    left: 50%;
    bottom: 16px;
    display: flex;
    align-items: center;
    width: auto;
    height: 18px;
    padding: 0 8px;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, .3);
    border-radius: 9px;
    z-index: 1;
    /deep/ .swiper-pagination-bullet {
        width: 10px !important;
        height: 10px !important;
        margin-right: 8px;
        border-radius: 5px;
        background-color: #ccc;
        &.swiper-pagination-bullet-active {
            background-color: #fff;
        }
        &:nth-last-of-type(1) {
            margin-right: 0;
        }
    }
}

</style>
