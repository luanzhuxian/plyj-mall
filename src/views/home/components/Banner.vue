<template>
    <div :class="$style.banner">
        <swiper
            v-if="data.values.length"
            :class="$style.container"
            :options="swiperOptionBanner"
        >
            <swiperSlide v-for="(item, i) of data.values" :key="i">
                <count-down
                    v-if="item.shoppingStatus === 1"
                    :data="item"
                    :fields="{ start: 'serverTime', end: 'shoppingTime' }"
                />
                <img v-imgError :class="$style.img" :src="item.image" :alt="item.name" @click="handelClick(item)">
            </swiperSlide>
            <div v-show="data.values.length > 1" class="swiper-pagination" slot="pagination" />
        </swiper>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import CountDown from '../../../components/product/Count-Down.vue'

export default {
    name: 'Banner',
    components: {
        swiper,
        swiperSlide,
        CountDown
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
            swiperOptionBanner: {
                autoplay: this.data.values.length > 1
                    ? {
                        disableOnInteraction: false
                    }
                    : false,
                spaceBetween: 40,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                loop: true
            }
        }
    },
    computed: {
        ...mapGetters(['campaignReport', 'campaignBook', 'dragonGateCharity', 'dragonGateSign', 'dragonGatePlay']),
        isReportShow () {
            return !!this.campaignReport && this.campaignReport.isReportShow && this.campaignReport.id
        },
        isBookShow () {
            return !!this.campaignBook && this.campaignBook.isBookShow && this.campaignBook.activityId
        }
    },
    methods: {
        // 根据装修时添加的信息做相应的跳转
        handelClick ({ type, value }) {
            const routeMap = {
                1: {
                    name: '分类',
                    path: 'Classify'
                },
                2: {
                    name: '商品',
                    path: 'Product'
                },
                3: {
                    name: '课程',
                    path: 'Curriculum'
                },
                41: {
                    name: '全民来分销',
                    path: 'HelperActivity'
                },
                42: {
                    name: '团购',
                    path: 'GroupActivity'
                },
                43: {
                    name: '预购',
                    path: 'BookActivity'
                },
                44: {
                    name: '秒杀',
                    path: 'SecondActivity'
                },
                45: {
                    name: '组合聚惠学',
                    path: 'CoursePackage'
                },
                46: {
                    name: '防疫情报站',
                    path: 'BattlefieldReport'
                },
                47: {
                    name: '疫情签到',
                    path: 'EpidemicSignIn'
                },
                48: {
                    name: '公益棕行动',
                    path: 'LongmenAction'
                },
                49: {
                    name: '端午佳话粽粽有礼',
                    path: 'LongmenSignIn'
                },
                410: {
                    name: '龙门抽大奖',
                    path: 'LongmenLottery'
                },
                5: {
                    name: '互动直播',
                    path: 'InteractiveLive'
                },
                6: {
                    name: '店铺主页',
                    path: 'Appointment'
                }
            }
            // 分类
            if (type === 1) {
                return this.$router.push({ name: 'Classify', params: { optionId: value || null } })
            }
            // 商品
            if (type === 2) {
                return this.$router.push({ name: 'Product', params: { productId: value } })
            }
            // 课程
            if (type === 3) {
                return this.$router.push({ name: 'Curriculum', params: { productId: value } })
            }
            // 防疫情报站
            if (type === 46) {
                if (!this.isReportShow) return false
                return this.$router.push({ name: 'BattlefieldReport', params: { id: this.campaignReport.id } })
            }
            // 疫情签到
            if (type === 47) {
                if (!this.isBookShow) return false
                return this.$router.push({ name: 'EpidemicSignIn', params: { id: this.campaignBook.activityId } })
            }
            // 公益棕行动
            if (type === 48) {
                const { dragonGateCharity } = this
                if (!dragonGateCharity || !dragonGateCharity.id) return false

                const endTime = new Date(dragonGateCharity.endTime).valueOf()
                if (endTime < Date.now()) return false

                return this.$router.push({ name: 'LongmenAction', params: { id: dragonGateCharity.id } })
            }
            // 粽粽有礼
            if (type === 49) {
                const { dragonGateSign } = this
                if (!dragonGateSign || !dragonGateSign.id) return false

                const startTime = new Date(dragonGateSign.activityStartTime).valueOf()
                const endTime = new Date(dragonGateSign.activityEndTime).valueOf()
                if (startTime > Date.now() || endTime < Date.now()) return false

                return this.$router.push({ name: 'LongmenSignIn', params: { id: this.dragonGateSign.id } })
            }
            // 龙门抽大奖
            if (type === 410) {
                const { dragonGatePlay } = this
                if (!dragonGatePlay || !dragonGatePlay.id) return false

                const startTime = new Date(dragonGatePlay.startTime).valueOf()
                const endTime = new Date(dragonGatePlay.endTime).valueOf()
                if (startTime > Date.now() || endTime < Date.now()) return false

                return this.$router.push({ name: 'LongmenLottery', params: { id: this.dragonGatePlay.id } })
            }
            // 其他
            if (type in routeMap) {
                return this.$router.push({ name: routeMap[type].path })
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
.swiper-pagination {
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
    ::v-deep .swiper-pagination-bullet {
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
