<template>
    <div :class="$style.activity">
        <ul :class="$style.activityList" v-if="show">
            <template v-for="(item, i) of list">
                <router-link
                    v-if="map[item.value]"
                    :class="{
                        [$style.activityListItem]: true,
                        [$style.large]: i === 0 && list.length % 2 === 1,
                        [$style.marginTop0]: (i === 0) || (i === 1 && !isOdd)
                    }"
                    :key="i"
                    tag="li"
                    :to="{ name: map[item.value].path }"
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
                        <pl-svg :name="map[item.value].icon" :width="map[item.value].width" />
                    </div>
                </router-link>
            </template>
        </ul>
    </div>
</template>

<script>
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
            defaultData: [{
                value: 'cloud'
            }, {
                value: 'sign'
            }, {
                value: 'newyear'
            }, {
                value: 'report'
            }],
            map: {
                cloud: {
                    main: '云课堂',
                    sub: '停课不停学',
                    icon: 'icon-cloud-play-592ce',
                    width: '70',
                    path: ''
                },
                sign: {
                    main: '抗疫签到',
                    sub: '共携手抗战疫',
                    icon: 'icon-medicine-173e3',
                    width: '60',
                    path: 'EpidemicSignIn'
                },
                newyear: {
                    main: '我心中的年味',
                    sub: '翻开记忆中的味道',
                    icon: 'icon-pocket-8fb26',
                    width: '70',
                    path: 'OnlineClassroom'
                },
                report: {
                    main: '防疫情报站',
                    sub: '众志成城抗击疫情',
                    icon: 'icon-document-ae13e',
                    width: '60',
                    path: 'BattlefieldReport'
                }
            }
        }
    },
    computed: {
        isOdd () {
            return !!(this.list.length % 2)
        },
        list () {
            return this.data.values.filter(item => (item.value in this.map))
        },
        show () {
            return this.list.length
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
                line-height: 34px;
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
