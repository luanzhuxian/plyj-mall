<template>
    <div :class="$style.campaign">
        <div :class="$style.campaignTop">
            <div :class="$style.campaignTopSide" />
            <div :class="$style.campaignTopContent">
                <img v-imgError src="https://mallcdn.youpenglai.com/static/beat-plague/19e269a6-61da-48ed-afbb-0ce198df7cfb.png" alt="">
            </div>
        </div>
        <ul :class="$style.campaignList">
            <router-link
                v-if="isReportShow"
                :class="$style.campaignListItem"
                tag="li"
                :to="{ name: 'BattlefieldReport', params: { id: reportId } }"
            >
                <div :class="$style.counter">
                    {{ `疫情爆发的第${days}天` }}
                </div>
                <img v-imgError src="https://mallcdn.youpenglai.com/static/beat-plague/report.png" alt="">
            </router-link>
            <router-link
                v-if="isBookShow"
                :class="$style.campaignListItem"
                tag="li"
                :to="{ name: 'EpidemicSignIn', params: { id: bookId } }"
            >
                <img v-imgError src="https://mallcdn.youpenglai.com/static/beat-plague/join.png" alt="">
            </router-link>
        </ul>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
    name: 'Campaign',
    data () {
        return {
            days: 0
        }
    },
    computed: {
        ...mapGetters(['campaignReport', 'campaignBook']),
        isReportShow () {
            return !!this.campaignReport && this.campaignReport.isReportShow
        },
        isBookShow () {
            return !!this.campaignBook && this.campaignBook.isBookShow
        },
        reportId () {
            return this.isReportShow ? this.campaignReport.id : null
        },
        bookId () {
            return this.isBookShow ? this.campaignBook.activityId : null
        }
    },
    created () {
        const start = moment('2020-01-20 00:00', 'YYYY-MM-DD HH:mm').valueOf()
        const duration = Date.now() - Number(start)
        this.days = Math.ceil(moment.duration(duration).asDays())
    }
}
</script>

<style lang="scss" module>
.campaign {
    margin-top: 50px;
    &-top {
        &-side {
            border: 64px solid;
            border-bottom: 12px solid;
            border-top: none;
            border-color: transparent transparent #5da5e3 transparent;
        }
        &-content {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100px;
            background: #3b7db7;
            img {
                width: 460px;
            }
        }
    }
    &-list {
        padding: 24px 20px;
        background: #d1e5fe;
        &-item {
            position: relative;
            margin-bottom: 16px;
            width: 100%;
            height: 320px;
            border-radius: 20px;
            overflow: hidden;
            &:nth-last-of-type(1) {
                margin-bottom: 0;
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
    .counter {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 18px;
        height: 50px;
        background: #f76025;
        border-radius: 0 20px 0 20px;
        font-size: 30px;
        font-family: Hiragino Sans GB;
        line-height: 50px;
        color: #fff;
    }
}

</style>
