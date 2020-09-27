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
                report: {
                    main: '防疫情报站',
                    sub: '众志成城抗击疫情',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/document.png',
                    width: '64',
                    path: 'BattlefieldReport'
                },
                sign: {
                    main: '抗疫签到',
                    sub: '共携手抗战疫',
                    icon: 'https://mallcdn.youpenglai.com/static/mall/icons/2.9.0/medicine.png',
                    width: '64',
                    path: 'EpidemicSignIn'
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
                }
            }
        }
    },
    computed: {
        ...mapGetters(['nwEvent', 'campaignReport', 'campaignBook', 'dragonGateCharity', 'dragonGateSign', 'dragonGatePlay']),
        isOdd () {
            return !!(this.list.length % 2)
        },
        list () {
            return this.data.values.filter(item => (item.value in this.map))
        },
        show () {
            return this.list.length
        }
        // isReportShow () {
        //     return !!this.campaignReport && this.campaignReport.isReportShow && this.campaignReport.id
        // },
        // isBookShow () {
        //     return !!this.campaignBook && this.campaignBook.isBookShow && this.campaignBook.activityId
        // }
    },
    methods: {
        jump ({ value }) {
            const { map, nwEvent } = this
            let id
            let startTime
            let endTime

            switch (value) {
                case 'newyear':

                    if (!nwEvent || !nwEvent.id) return this.$warning('活动已结束')
                    if (!nwEvent.permissionStatus) return this.$warning('您无法参与活动')

                    startTime = new Date(nwEvent.activityStartTime).valueOf()
                    endTime = new Date(nwEvent.activityEndTime).valueOf()
                    if (startTime > Date.now()) return this.$warning('活动未开始')
                    if (endTime < Date.now()) return this.$warning('活动已结束')

                    id = nwEvent.id
                    break

                case 'dragon-gate-charity':
                    const { dragonGateCharity } = this
                    if (!dragonGateCharity || !dragonGateCharity.id) return this.$warning('活动已结束')

                    endTime = new Date(dragonGateCharity.endTime).valueOf()
                    if (endTime < Date.now()) return this.$warning('活动已结束')

                    id = dragonGateCharity.id
                    break

                case 'dragon-gate-sign':
                    const { dragonGateSign } = this
                    if (!dragonGateSign || !dragonGateSign.id) return this.$warning('活动已结束')

                    startTime = new Date(dragonGateSign.activityStartTime).valueOf()
                    endTime = new Date(dragonGateSign.activityEndTime).valueOf()
                    if (startTime > Date.now()) return this.$warning('活动未开始')
                    if (endTime < Date.now()) return this.$warning('活动已结束')

                    id = this.dragonGateSign.id
                    break

                case 'dragon-gate-play':
                    const { dragonGatePlay } = this
                    if (!dragonGatePlay || !dragonGatePlay.id) return this.$warning('活动已结束')

                    startTime = new Date(dragonGatePlay.startTime).valueOf()
                    endTime = new Date(dragonGatePlay.endTime).valueOf()
                    if (startTime > Date.now()) return this.$warning('活动未开始')
                    if (endTime < Date.now()) return this.$warning('活动已结束')

                    id = this.dragonGatePlay.id
                    break

                    // case 'report':
                    //     if (!this.isReportShow) return this.$warning('活动已结束')
                    //     id = this.campaignReport.id
                    //     break

                    // case 'sign':
                    //     if (!this.isBookShow) return this.$warning('活动已结束')
                    //     id = this.campaignBook.activityId
                    //     break

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
