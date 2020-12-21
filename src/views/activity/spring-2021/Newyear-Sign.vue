<template>
    <div :class="$style.newyearSign">
        <router-link :class="$style.bg" tag="div" :to="{ name: 'NewYearSignIn', params: { id: data.id } }">
            <div :class="$style.countdownWrapper">
                <span :class="$style.text" v-if="data.status === 0">距离活动开始</span>
                <span :class="$style.text" v-else-if="data.status === 1">距离活动结束</span>
                <Countdown
                    v-if="~[0, 1].indexOf(data.status)"
                    :duration="getDuration(data)"
                    format="DD天HH小时mm分"
                    @finish="() => data.status++"
                />
            </div>
        </router-link>
    </div>
</template>

<script>
import Countdown from '../../../components/activity/Countdown.vue'
import moment from 'moment'

export default {
    name: 'NewyearSign',
    components: {
        Countdown
    },
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        getDuration ({ status, activityStartTime, activityEndTime }) {
            // 0 未开始 1 进行中 2 结束
            const now = Date.now().valueOf()
            if (status === 0) {
                return moment(activityStartTime).valueOf() - now
            } else if (status === 1) {
                return moment(activityEndTime).valueOf() - now
            }
            return 0
        }
    }
}
</script>

<style lang="scss" module>
.bg {
    position: relative;
    margin: 0 auto;
    width: 680px;
    height: 176px;
    background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/newyear-sign-banner.png) no-repeat center;
    background-size: 100%;
}
.countdown-wrapper {
    position: absolute;
    left: 50%;
    bottom: 28px;
    transform: translateX(-50%);
    font-size: 16px;
    color: #FDFCFC;
}
.text {
    margin-right: 10px;
}
</style>
