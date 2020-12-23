<template>
    <div :class="$style.activity">
        <ul :class="$style.activityList" v-if="show">
            <template v-for="(item, i) of list">
                <div
                    v-if="map[item.value]"
                    :class="{
                        [$style.activityListItem]: true,
                        [$style.large]: i === 0 && list.length % 2 === 1,
                        [$style.marginTop0]: (i === 0) || (i === 1 && !isOdd)
                    }"
                    :key="i"
                    @click="jump(item)"
                >
                    <div :class="$style.activityListItemLeft">
                        <div :class="$style.activityListItemLeftMain">
                            {{ map[item.value].main }}
                        </div>
                        <div :class="$style.activityListItemLeftSub">
                            {{ map[item.value].sub }}
                        </div>
                    </div>
                    <div :class="$style.activityListItemRight">
                        <pl-svg type="img" :name="map[item.value].icon" :width="map[item.value].width" />
                    </div>
                </div>
            </template>
        </ul>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
    name: 'Activity',
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
            map: {
                cloud: {
                    main: '云课堂',
                    sub: '停课不停学',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/cloud-play.png',
                    width: '70',
                    path: 'OnlineClassroom'
                },
                newyear: {
                    main: '我心中的年味',
                    sub: '翻开记忆中的味道',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/pocket.png',
                    width: '70',
                    path: 'NewYearActivity'
                },
                distribution: {
                    main: '全民来分销',
                    sub: 'Helper福利享不停',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/cup.png',
                    width: '64',
                    path: 'HelperActivity'
                },
                'dragon-gate-charity': {
                    main: '公益行动',
                    sub: '学子携手共献爱心',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/charity.png',
                    width: '64',
                    path: 'LongmenAction'
                },
                'dragon-gate-sign': {
                    main: '粽粽有礼',
                    sub: '粽行四海端午安康',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/check.png',
                    width: '64',
                    path: 'LongmenSignIn'
                },
                'dragon-gate-play': {
                    main: '龙门抽大奖',
                    sub: '抽奖嗨翻天',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/present.png',
                    width: '64',
                    path: 'LongmenLottery'
                },
                'happy-lottery': {
                    main: '抽奖乐翻天',
                    sub: '好礼享不停',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/happy-lottery.png',
                    width: '96',
                    path: 'HappyLottery'
                },
                'newyear-sign': {
                    main: '打卡聪明年',
                    sub: '开启智慧大脑',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/newyear-sign.png',
                    width: '72',
                    path: 'NewYearSignIn'
                }
            }
        }
    },
    computed: {
        ...mapGetters(['nwEvent', 'dragonGateCharity', 'currentSign', 'currentLottery']),
        isOdd () {
            return !!(this.list.length % 2)
        },
        list () {
            return this.data.values.filter(item => (item.value in this.map))
        },
        show () {
            return this.list.length
        }
    },
    methods: {
        jump ({ value }) {
            const { map, nwEvent, currentLottery, currentSign } = this
            let id
            let startTime
            let endTime

            switch (value) {
                case 'newyear':

                    if (!nwEvent || !nwEvent.id) return this.$warning('活动已结束')
                    if (!nwEvent.permissionStatus) return this.$warning('您无法参与活动')

                    startTime = moment(nwEvent.activityStartTime).valueOf()
                    endTime = moment(nwEvent.activityEndTime).valueOf()
                    if (startTime > Date.now()) return this.$warning('活动未开始')
                    if (endTime < Date.now()) return this.$warning('活动已结束')

                    id = nwEvent.id
                    break

                case 'dragon-gate-charity':
                    const { dragonGateCharity } = this
                    if (!dragonGateCharity || !dragonGateCharity.id) return this.$warning('活动已结束')

                    endTime = moment(dragonGateCharity.endTime).valueOf()
                    if (endTime < Date.now()) return this.$warning('活动已结束')

                    id = dragonGateCharity.id
                    break

                case 'dragon-gate-sign':
                    if (!currentSign || !currentSign.id) return this.$warning('活动已结束')

                    startTime = moment(currentSign.activityStartTime).valueOf()
                    endTime = moment(currentSign.activityEndTime).valueOf()
                    if (startTime > Date.now()) return this.$warning('活动未开始')
                    if (endTime < Date.now()) return this.$warning('活动已结束')

                    id = this.currentSign.id
                    break

                case 'dragon-gate-play':
                    if (!currentLottery || !currentLottery.id) return this.$warning('活动已结束')

                    startTime = moment(currentLottery.startTime).valueOf()
                    endTime = moment(currentLottery.endTime).valueOf()
                    if (startTime > Date.now()) return this.$warning('活动未开始')
                    if (endTime < Date.now()) return this.$warning('活动已结束')

                    id = this.currentLottery.id
                    break

                case 'happy-lottery':
                    if (!currentLottery || !currentLottery.id) return this.$warning('活动已结束')

                    startTime = moment(currentLottery.startTime).valueOf()
                    endTime = moment(currentLottery.endTime).valueOf()
                    if (startTime > Date.now()) return this.$warning('活动未开始')
                    if (endTime < Date.now()) return this.$warning('活动已结束')

                    id = this.currentLottery.id
                    break

                case 'newyear-sign':
                    if (!currentSign || !currentSign.id) return this.$warning('活动已结束')

                    startTime = moment(currentSign.activityStartTime).valueOf()
                    endTime = moment(currentSign.activityEndTime).valueOf()
                    if (startTime > Date.now()) return this.$warning('活动未开始')
                    if (endTime < Date.now()) return this.$warning('活动已结束')

                    id = this.currentSign.id
                    break

                default:
                    break
            }

            this.$router.push({
                name: map[value].path,
                ...(id ? { params: { id } } : null)
            })
        }
    }
}
</script>

<style lang="scss" module>
.activity-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    &-item {
        box-sizing: border-box;
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        padding: 28px;
        width: 342px;
        height: 136px;
        background: #fff;
        box-shadow: 0 6px 20px rgba(0, 0, 0, .05);
        border-radius: 20px;
        &-left {
            &-main {
                font-size: 32px;
                font-family: PingFang SC;
                font-weight: bold;
                line-height: 44px;
                color: #333;
            }
            &-sub {
                margin-top: 4px;
                font-size: 24px;
                font-family: PingFang SC;
                line-height: 44px;
                color: #999;
            }
        }
        &.large {
            width: 100%;
            height: 104px;
            padding: 12px 28px;
            .activity-list-item-left {
                display: flex;
                align-items: center;
                &-sub {
                    margin-left: 32px;
                    margin-top: 0;
                }
            }
        }
        &.margin-top-0 {
            margin-top: 0;
        }
    }
}

</style>
