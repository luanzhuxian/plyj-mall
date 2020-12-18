<template>
    <div :class="$style.happyLottery">
        <router-link :class="$style.bg" tag="div" :to="{ name: 'HappyLottery', params: { id: data.id } }">
            <div :class="$style.count" v-if="data.status === 2 && data.participantsNum > 10">
                {{ `${data.participantsNum}人参与` }}
            </div>
            <div :class="$style.countdownWrapper">
                <span :class="$style.text" v-if="data.status === 1">距离活动开始</span>
                <span :class="$style.text" v-else-if="data.status === 2">距离活动结束</span>
                <span :class="$style.text" v-else>活动已结束</span>
                <Countdown
                    v-if="~[1, 2].indexOf(data.status)"
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
    name: 'HappyLottery',
    components: {
        Countdown
    },
    props: {
        data: {
            type: Object,
            default: () => ({ status: 0 })
        }
    },
    methods: {
        getDuration ({ status, startTime, endTime }) {
            // 1 未开始 2 进行中 3 结束
            const now = Date.now().valueOf()
            if (status === 1) {
                return moment(startTime).valueOf() - now
            } else if (status === 2) {
                return moment(endTime).valueOf() - now
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
    background: url(https://mallcdn.youpenglai.com/static/mall/2.13.0/lottery-banner.png) no-repeat center;
    background-size: 100%;
}
.count {
    position: absolute;
    top: 20px;
    right: 60px;
    font-size: 20px;
    color: #FDFCFC;
}
.countdown-wrapper {
    position: absolute;
    left: 246px;
    bottom: 28px;
    font-size: 16px;
    color: #FDFCFC;
}
.text {
    margin-right: 10px;
}
</style>
