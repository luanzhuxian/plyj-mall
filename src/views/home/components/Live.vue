<template>
    <div>
        <div :class="$style.liveWrapper">
            <div :class="$style.liveHead">
                <pl-svg name="icon-live-a8210" width="36" height="40" />
                <b>互动直播</b>
                <router-link
                    :class="$style.liveHeadMore"
                    :to="{ name: 'InteractiveLive' }"
                >
                    查看全部
                    <pl-svg name="icon-right" height="20" fill="#cccccc" />
                </router-link>
            </div>
            <div :class="$style.liveHeadSub">
                <span>{{ `直播中 ${data.nowCount || 0}` }}</span>
                <span>{{ `即将开始 ${data.futrueCount || 0}` }}</span>
                <span>{{ `往期直播 ${data.pastCount || 0}` }}</span>
            </div>
            <div :class="$style.live" @click="toLivePage">
                <div :class="$style.imgWrapper">
                    <img :src="(isNoticeShow ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-middle'">
                    <div :class="$style.label" v-if="isNoticeShow">
                        预告
                    </div>
                    <pl-svg name="icon-play" width="60" />
                </div>
                <div :class="$style.info">
                    <div :class="$style.top">
                        {{ live.name }}
                    </div>
                    <div :class="$style.bottom" v-if="live.statue !== 0">
                        <div :class="$style.bottomLeft">
                            <pl-svg name="icon-clock" fill="#fff" width="26" />
                        </div>
                        <div :class="$style.bottomRight">
                            <span v-if="isNoticeShow">距开始仅剩</span>
                            <span v-if="live.statue === 4" :class="$style.highlight">正在直播</span>
                            <!-- <span v-if="live.statue === 0" :class="$style.highlight">已结束</span> -->
                            <count-down
                                v-if="isNoticeShow"
                                :timestamp="ts"
                                color="#333"
                                size="mini"
                                @done="done"
                            />
                            <span v-if="live.statue === 4" :class="$style.highlight">
                                {{ `${live.visitTimes}人观看` }}
                            </span>
                        </div>
                    </div>
                    <div :class="$style.lock" v-if="live.roomToken">
                        <pl-svg name="icon-lock-plain-7b5ab" width="30" />
                        观看需验证口令
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import CountDown from '../../activity/components/Count-Down.vue'

export default {
    name: 'Live',
    components: {
        CountDown
    },
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            ts: ''
        }
    },
    computed: {
        liveModel () {
            const { data } = this

            if (!data.liveModel || !data.liveModel.length) {
                return []
            }
            return data.liveModel.filter(item => item.statue === 0 || item.statue === 4 || (item.statue === 2 && item.hasNotice))
        },
        isLiveShow () {
            return !!this.liveModel.length
        },
        live () {
            return this.isLiveShow ? this.liveModel[0] : {}
        },
        isNoticeShow () {
            return this.live && this.live.statue === 2 && this.live.hasNotice
        }
    },
    created () {
        const { liveStartTime, hasNotice } = this.live
        if (hasNotice && liveStartTime) {
            this.ts = moment(liveStartTime).valueOf()
        }
    },
    methods: {
        done () {
            if (this.live.statue === 2) {
                this.live.statue = 4
                this.data.nowCount += 1
                this.data.futrueCount -= 1
            } else if (this.live.statue === 4) {
                this.live.statue = 0
                this.data.nowCount -= 1
                this.data.pastCount += 1
            }
        },
        toLivePage () {
            // 直播已结束
            if (this.live.statue === 0) {
                if (!this.live.videoLibId) {
                    // 没有往期回放
                    this.$router.push({ name: 'InteractiveLive' })
                } else {
                    this.$router.push({
                        name: 'LivePlayBack',
                        params: {
                            id: this.live.videoLibId,
                            activityId: this.live.id,
                            isValidateEndTime: '0'
                        }
                    })
                }
            } else {
                this.$router.push({
                    name: 'LiveRoom',
                    params: {
                        id: this.live.id
                    }
                })
            }
        }
    }
}
</script>

<style module lang="scss">
.live-wrapper {
    padding: 20px 16px 20px;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
}
.live-head {
    display: flex;
    align-items: end;
    margin-bottom: 12px;
    line-height: 46px;
    > b {
        margin-left: 16px;
        font-size: 32px;
        color: #333;
    }
    &-sub {
        margin-bottom: 32px;
        > span {
            font-size: 22px;
            line-height: 32px;
            color: #1592e6;
            margin-left: 10px;
            padding-left: 10px;
            border-left: 2px solid #e7e7e7;
            &:nth-of-type(1) {
                margin-left: 0;
                padding-left: 0;
                border-left: none;
            }
        }
    }
    &-more {
        display: flex;
        align-items: center;
        margin-left: auto;
        font-size: 24px;
        color: #999;
        > svg {
            margin-left: 4px;
        }
    }
}
.live {
    display: flex;
    background-color: #fff;
    overflow: hidden;
}
.img-wrapper {
    position: relative;
    width: 240px;
    height: 160px;
    border-radius: 20px;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
.label {
    position: absolute;
    top: 0;
    left: 0;
    width: 130px;
    height: 48px;
    line-height: 48px;
    background: #fb7d55;
    border-radius: 0 0 20px 0;
    font-size: 24px;
    font-family: Microsoft YaHei;
    color: #fff;
    text-align: center;
}
.info {
    flex: 1;
    width: 0;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding: 8px 0 8px 20px;
}
.top {
    margin-bottom: 0;
    height: 76px;
    font-size: 28px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 36px;
    color: #333;
    text-align: justify;
    @include elps-wrap(2);
}
.bottom {
    display: inline-flex;
    width: max-content;
    min-width: 300px;
    height: 40px;
    border: 2px solid #ff9800;
    border-radius: 20px;
    overflow: hidden;
    // &.active {
    //   border: 2px solid #EFB835;
    //   .time-left {
    //     background: linear-gradient(90deg, rgba(243, 190, 65, 1) 0%, rgba(239, 184, 53, 1) 100%);
    //   }
    //   .time-right {
    //     color: #EFB835;
    //   }
    // }
    &-left {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        font-size: 26px;
        color: #fff;
        background: linear-gradient(360deg, rgba(247, 91, 35, 1) 0%, rgba(250, 133, 57, 1) 100%);
        overflow: hidden;
    }
    &-right {
        flex: 1;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0 12px;
        font-size: 24px;
        font-family: MicrosoftYaHei;
        color: #333;
        > span {
            margin-right: 10px;
        }
    }
}
.lock {
    display: flex;
    align-items: end;
    margin-top: 14px;
    padding: 0 18px;
    font-size: 24px;
    line-height: 32px;
    color: #666;
    > svg {
        margin-right: 12px;
    }
}
.highlight {
    color: #fe7b21;
    font-weight: bold;
}

</style>
