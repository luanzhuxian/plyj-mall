<template>
    <ul :class="$style.liveList">
        <template v-for="(live, index) of liveModel.slice(0, 3)">
            <li
                v-if="~(liveModel.length > 2 ? [0] : [0, 1]).indexOf(index)"
                :class="$style.first"
                :key="index"
                @click="toLivePage(live)"
            >
                <label>
                    <span v-if="live.isNoticeShow">即将开始</span>
                    <span v-if="live.statue === 4">直播中</span>
                    <span v-if="live.statue === 0">看回放</span>
                </label>
                <div :class="$style.imgWrapper">
                    <img :src="(live.isNoticeShow ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-middle'">
                </div>
                <div :class="$style.liveInfo">
                    <h4 v-text="live.name" />
                    <p>
                        <template v-if="live.isNoticeShow">
                            <span>{{ `直播时间 ${getTime(live.liveStartTime)}` }}</span>
                        </template>
                        <template v-if="live.statue === 4">
                            <span>正在直播</span>
                            <span>|</span>
                            <span>{{ `${live.visitTimes}人观看` }}</span>
                        </template>
                        <template v-if="live.statue === 0">
                            <span>直播已结束</span>
                        </template>
                    </p>
                </div>
            </li>
            <li
                v-else
                :class="$style.others"
                :key="index"
                @click="toLivePage(live)"
            >
                <label>
                    <span v-if="live.isNoticeShow">即将开始</span>
                    <span v-if="live.statue === 4">直播中</span>
                    <span v-if="live.statue === 0">看回放</span>
                </label>
                <div :class="$style.imgWrapper">
                    <img :src="(live.isNoticeShow ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-small'">
                </div>
                <div :class="$style.liveInfo">
                    <h4 v-text="live.name" />
                    <p v-if="live.isNoticeShow">
                        {{ `直播时间 ${getTime(live.liveStartTime)}` }}
                    </p>
                    <p v-if="live.statue === 4">
                        {{ `${live.visitTimes}人正在观看` }}
                    </p>
                    <p v-if="live.statue === 0">
                        直播已结束
                    </p>
                </div>
            </li>
        </template>
    </ul>
</template>

<script>
import moment from 'moment'
import { getLiveViewers } from '../../../apis/home'

export default {
    name: 'Live',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {}
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
        }
    },
    created () {
        for (const live of this.liveModel) {
            const { liveStartTime, hasNotice } = live

            if (hasNotice && liveStartTime) {
                this.$set(live, 'ts', moment(liveStartTime).valueOf())
            }
            this.$set(live, 'isNoticeShow', live.statue === 2 && live.hasNotice)

            // 单独查每个直播的在线人数
            this.getLiveViewers(live).catch(err => console.error(err))
        }
    },
    methods: {
        async getLiveViewers (live) {
            try {
                const { result: { count = 1 } } = await getLiveViewers({ roomId: live.roomId })
                live.visitTimes = Number(live.visitTimes) + Number(count)
            } catch (error) {
                throw error
            }
        },
        done () {
            if (this.live.statue === 2) {
                this.live.statue = 4
            } else if (this.live.statue === 4) {
                this.live.statue = 0
            }
        },
        getTime (time) {
            if (!time) return ''
            const index = time.lastIndexOf(':')
            return time.slice(0, index)
        },
        toLivePage (live) {
            // 直播已结束
            if (live.statue === 0) {
                if (!live.videoLibId) {
                    // 没有往期回放
                    this.$router.push({ name: 'InteractiveLive' })
                } else {
                    this.$router.push({
                        name: 'LivePlayBack',
                        params: {
                            id: live.videoLibId,
                            activityId: live.id,
                            isValidateEndTime: '0'
                        }
                    })
                }
            } else {
                this.$router.push({
                    name: 'LiveRoom',
                    params: {
                        id: live.roomValue
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss" module>
.live-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    > li {
        position: relative;
        margin-top: 16px;
        border: 4px solid #222;
        border-radius: 20px;
        &:nth-of-type(1) {
            margin-top: 0;
        }
    }
    > li.first {
        width: 100%;
        height: 426px;
        > label {
            position: absolute;
            top: -8px;
            left: 20px;
            box-sizing: border-box;
            padding: 12px 20px 0 0;
            text-align: center;
            width: 136px;
            height: 76px;
            background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/label.png') no-repeat center;
            background-size: 100%;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #00237a;
        }
        .img-wrapper {
            width: 100%;
            height: 100%;
            border-radius: 20px;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .live-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            box-sizing: border-box;
            text-align: center;
            padding: 20px 20px 16px;
            height: 114px;
            background: rgba(0, 0, 0, .32);
            border-radius: 0 0 20px 20px;
            font-size: 24px;
            color: #fff;
            > h4 {
                font-size: 32px;
                @include elps();
            }
            > p {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 10px;
                @include elps();
                > span {
                    padding: 0 5px;
                }
            }
        }
    }
    > li.others {
        display: flex;
        flex-direction: column;
        width: 320px;
        height: 320px;
        overflow: hidden;
        > label {
            position: absolute;
            top: 8px;
            left: 8px;
            box-sizing: border-box;
            text-align: center;
            width: 112px;
            height: 38px;
            line-height: 34px;
            background: #ffe100;
            border: 2px solid #222;
            border-radius: 10px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 800;
            color: #00237a;
        }
        .img-wrapper {
            flex: 1;
            // width: 100%;
            // height: 0;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .live-info {
            height: 96px;
            box-sizing: border-box;
            padding: 8px 14px;
            background: #fff;
            font-size: 20px;
            color: #999;
            > h4 {
                font-size: 26px;
                color: #333;
                @include elps();
            }
            > p {
                margin-top: 6px;
                @include elps();
            }
        }
    }
}

</style>
