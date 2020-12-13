<template>
    <div :class="$style.videoPlayer" v-if="show">
        <paid-player
            ref="paidPlayer"
            :size="size"
            :src="src"
            :video-id="videoId"
            :resource-id="resourceId"
            :resource-name="resourceName"
            :is-pay="hasStatistics"
            @playing.once="playing"
        />
        <pl-svg
            :class="$style.close"
            name="icon-close"
            fill="#bbb"
            :height="30"
            @click="$emit('update:show',false)"
        />
    </div>
</template>

<script>
import PaidPlayer from '../common/Paid-Player.vue'
import { setStudyCount, setStudyTime } from '../../apis/live-library'
export default {
    name: 'VideoPlayer',
    components: {
        PaidPlayer
    },
    props: {
        show: Boolean,
        // 1 单课 2 系列课
        courseType: {
            type: Number,
            default: 1
        },
        size: {
            type: Number,
            default: 0
        },
        src: {
            type: String,
            default: ''
        },
        videoId: {
            type: String,
            default: ''
        },
        resourceId: {
            type: String,
            default: ''
        },
        resourceName: {
            type: String,
            default: ''
        },
        // 是否是系列课， 系列课统计观看次数，时长和计费
        hasStatistics: Boolean
    },
    data () {
        return {
            // 设置观看时长定时器
            setStudyTimer: null,
            // 设置观看时长方法
            setStudyTime: null,
            duration: 0
        }
    },
    deactivated () {
        try {
            window.clearTimeout(this.setStudyTimer)
        } catch (e) { throw e }
    },
    beforeDestroy () {
        try {
            window.clearTimeout(this.setStudyTimer)
        } catch (e) { throw e }
    },
    methods: {
        async playing (e) {
            if (!this.hasStatistics) {
                return
            }
            try {
                const video = e.target
                this.duration = video.duration
                this.setStudyTime = this.returnSetStudyTime()
                this.updateStudyTime()
                await this.setStudyCountOnce()
            } catch (e) { throw e }
        },
        // 统计观看次数，只有第一次播放时统计
        async setStudyCountOnce () {
            try {
                await setStudyCount({
                    courseId: this.resourceId,
                    liveId: this.videoId
                })
            } catch (e) { throw e }
        },
        // 向后台存储观看时长
        updateStudyTime () {
            if (this.duration === 0) return
            window.clearTimeout(this.setStudyTimer)

            // 视频短的取用十分之一播放时长调用
            let times = (this.duration / 10) || 0
            times = times > 100 ? 100 : times
            this.setStudyTimer = window.setTimeout(async () => {
                try {
                    const videoTime = (this.$refs.paidPlayer && this.$refs.paidPlayer.video && this.$refs.paidPlayer.video.currentTime) || 0

                    // 用于课程详情页面的显示
                    await this.setStudyTime(Number.parseInt(videoTime))
                } catch (e) {
                    this.error(e)
                } finally {
                    this.updateStudyTime()
                }
            }, times * 1000)
        },
        // 设置观看时长
        returnSetStudyTime (preTime = 0) {
            const setStudyTimes = async currentTime => {
                try {
                    if (currentTime > preTime) {
                        const duration = Number.parseInt(currentTime - preTime) || 0
                        await setStudyTime({
                            courseId: this.resourceId,
                            liveId: this.videoId,
                            watchTime: duration
                        })
                    }
                    preTime = currentTime
                } catch (e) { throw e }
            }
            return setStudyTimes
        },
        async videoEnded () {
            try {
                if (!this.hasStatistics) {
                    return
                }
                window.clearTimeout(this.setStudyTimer)
                const videoTime = (this.$refs.paidPlayer && this.$refs.paidPlayer.video && this.$refs.paidPlayer.video.currentTime) || 0
                await this.setStudyTime(Number.parseInt(videoTime))
            } catch (e) { throw e }
        },
        error (e) {
            if (e.name === 'ResponseError') {
                this.$error(JSON.parse(e.message).message)
            } else {
                this.$error(e.message)
            }
        }
    }
}
</script>

<style lang='scss' module>

.video-player {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 9999;
    > .close {
        position: absolute;
        right: 30px;
        top: 30px;
        padding: 20px;
    }
}

</style>
