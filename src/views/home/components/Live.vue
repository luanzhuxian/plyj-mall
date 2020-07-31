<template>
    <div>
        <div :class="$style.liveWrapper">
            <div :class="$style.liveHead">
                <pl-svg name="icon-live-a8210" width="36" height="40" />
                <b>{{ data.moduleName }}</b>
                <router-link
                    :class="$style.liveHeadMore"
                    :to="{ name: 'InteractiveLive' }"
                >
                    查看全部
                    <pl-svg name="icon-right" height="20" fill="#cccccc" />
                </router-link>
            </div>
            <div :class="$style.liveHeadSub">
                <span>{{ `直播中 ${nowCount}` }}</span>
                <span>{{ `即将开始 ${futrueCount}` }}</span>
                <span>{{ `往期直播 ${pastCount}` }}</span>
            </div>
            <ul :class="$style.liveList" v-if="data.values.length">
                <template v-for="(live, index) of data.values">
                    <li :class="$style.first" :key="index" v-if="data.values.length % 2 && index === 0" @click="toLivePage(live)">
                        <div :class="$style.imgWrapper">
                            <img v-imgError :src="(isNoticeShow(live) ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-middle'">
                            <pl-svg name="icon-play" width="100" />
                        </div>
                        <div :class="$style.info">
                            <h4 v-text="live.name" />
                            <p>
                                <template v-if="isNoticeShow(live)">
                                    <span>即将开始</span>
                                    <span>|</span>
                                    <span>{{ `直播时间 ${getTime(live.liveStartTime)}` }}</span>
                                </template>
                                <template v-if="live.statue === 4">
                                    <span>直播中</span>
                                    <span>|</span>
                                    <span>{{ `${live.visitTimes}人观看` }}</span>
                                </template>
                                <template v-if="live.statue === 0">
                                    <span>直播已结束，去看回放</span>
                                </template>
                            </p>
                        </div>
                    </li>
                    <li :class="$style.others" :key="index" v-else @click="toLivePage(live)">
                        <label>
                            <span v-if="isNoticeShow(live)">即将开始</span>
                            <span v-if="live.statue === 4">直播中</span>
                            <span v-if="live.statue === 0">看回放</span>
                        </label>
                        <div :class="$style.imgWrapper">
                            <img :src="(isNoticeShow(live) ? live.noticeImg : live.coverImg) + '?x-oss-process=style/thum-small'">
                        </div>
                        <div :class="$style.info">
                            <h4 v-text="live.name" />
                            <p v-if="isNoticeShow(live)">
                                {{ `直播时间 ${getTime(live.liveStartTime)}` }}
                            </p>
                            <p v-if="live.statue === 4">
                                {{ `${live.visitTimes}人正在观看` }}
                            </p>
                            <p v-if="live.statue === 0">
                                直播已结束，去看回放
                            </p>
                        </div>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>
import { getLiveViewers } from '../../../apis/home'

export default {
    name: 'Live',
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
            nowCount: 0,
            futrueCount: 0,
            pastCount: 0
        }
    },
    created () {
        const [nowCount = 0, futrueCount = 0, pastCount = 0] = this.data.otherValue.split(',')
        Object.assign(this, {
            nowCount,
            futrueCount,
            pastCount
        })

        // 单独查每个直播的在线人数
        if (this.data.values.length) {
            for (const item of this.data.values) {
                this.getLiveViewers(item).catch(err => console.error(err))
            }
        }
    },
    methods: {
        async getLiveViewers (live) {
            try {
                const { result: { count = 0 } } = await getLiveViewers({ roomId: live.roomId })
                live.visitTimes = Number(live.visitTimes) + Number(count)
            } catch (error) {
                throw error
            }
        },
        isNoticeShow (live) {
            return live.statue === 2 && live.hasNotice
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

<style module lang="scss">
.live-wrapper {
    padding: 20px;
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
.live-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    > li {
        position: relative;
        margin-top: 20px;
        border-radius: 20px;
        overflow: hidden;
        > label {
            position: absolute;
            top: 0;
            left: 0;
            box-sizing: border-box;
            text-align: center;
            width: 100px;
            line-height: 40px;
            background: #f2b036;
            border-radius: 20px 0px 20px 0px;
            font-size: 20px;
            font-family: Microsoft YaHei;
            color: #fff;
        }
    }
    > li.first {
        margin-top: 0;
        width: 100%;
        height: 426px;
        .img-wrapper {
            width: 100%;
            height: 100%;
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
        .info {
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
        .img-wrapper {
            flex: 1;
            width: 100%;
            height: 0;
            border-radius: 20px 20px 0 0;
            overflow: hidden;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .info {
            height: 96px;
            box-sizing: border-box;
            padding: 8px 0;
            background: #fff;
            font-size: 20px;
            color: #666;
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
// .img-wrapper {
//     position: relative;
//     width: 240px;
//     height: 160px;
//     border-radius: 20px;
//     overflow: hidden;
//     img {
//         width: 100%;
//         height: 100%;
//         object-fit: cover;
//     }
//     svg {
//         position: absolute;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//     }
// }
// .label {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100px;
//     height: 40px;
//     line-height: 40px;
//     background: #fb7d55;
//     border-radius: 0 0 20px 0;
//     font-size: 24px;
//     font-family: Microsoft YaHei;
//     color: #fff;
//     text-align: center;
// }
// .info {
//     flex: 1;
//     width: 0;
//     display: flex;
//     justify-content: space-between;
//     flex-direction: column;
//     padding: 8px 0 8px 20px;
// }
// .top {
//     margin-bottom: 0;
//     height: 76px;
//     font-size: 28px;
//     font-family: Microsoft YaHei;
//     font-weight: bold;
//     line-height: 36px;
//     color: #333;
//     text-align: justify;
//     @include elps-wrap(2);
// }
// .bottom {
//     display: inline-flex;
//     width: max-content;
//     min-width: 300px;
//     height: 40px;
//     border: 2px solid #ff9800;
//     border-radius: 20px;
//     overflow: hidden;
//     &-left {
//         display: inline-flex;
//         justify-content: center;
//         align-items: center;
//         width: 60px;
//         font-size: 26px;
//         color: #fff;
//         background: linear-gradient(360deg, rgba(247, 91, 35, 1) 0%, rgba(250, 133, 57, 1) 100%);
//         overflow: hidden;
//     }
//     &-right {
//         flex: 1;
//         display: inline-flex;
//         justify-content: center;
//         align-items: center;
//         padding: 0 12px;
//         font-size: 24px;
//         color: #333;
//         > span {
//             margin-right: 10px;
//         }
//     }
// }
// .lock {
//     display: flex;
//     align-items: end;
//     margin-top: 14px;
//     padding: 0 18px;
//     font-size: 24px;
//     line-height: 32px;
//     color: #666;
//     > svg {
//         margin-right: 12px;
//     }
// }
// .highlight {
//     color: #fe7b21;
//     font-weight: bold;
// }

</style>
