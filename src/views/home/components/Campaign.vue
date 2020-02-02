<template>
  <div :class="$style.campaign">
    <div :class="$style.campaignTop">
      <div :class="$style.campaignTopSide" />
      <div :class="$style.campaignTopContent">
        <img src="https://mallcdn.youpenglai.com/static/beat-plague/19e269a6-61da-48ed-afbb-0ce198df7cfb.png" alt="">
      </div>
    </div>
    <ul :class="$style.campaignList">
      <router-link
        v-if="isReportActive"
        :class="$style.campaignListItem"
        tag="li"
        :to="{ name: 'BattlefieldReport', params: { id: reportId } }"
      >
        <div :class="$style.counter">
          {{ `疫情爆发的第${days}天` }}
        </div>
        <img src="https://mallcdn.youpenglai.com/static/beat-plague/0c266184-33b9-42ae-ad56-328353cb8d13.jpeg" alt="">
      </router-link>
      <router-link
        v-if="isBookActive"
        :class="$style.campaignListItem"
        tag="li"
        :to="{ name: 'EpidemicSignUp', params: { id: bookId } }"
      >
        <img src="https://mallcdn.youpenglai.com/static/beat-plague/6ffc3e0e-f3fe-45c2-a16c-ec2de74c3fe7.jpeg" alt="">
      </router-link>
    </ul>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Campaign',
  inject: ['parent'],
  data () {
    return {
      days: 0
    }
  },
  computed: {
    isReportActive () {
      return this.parent.isReportActive
    },
    isBookActive () {
      return this.parent.isBookActive
    },
    reportId () {
      return this.parent.reportId
    },
    bookId () {
      return this.parent.bookId
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
        border-color: transparent transparent #5DA5E3 transparent;
      }
      &-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        background: #3B7DB7;
        img {
            width: 460px;
        }
      }
    }
    &-list {
        padding: 24px 20px;
        background: #D1E5FE;
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
        background: #DC0E1D;
        border-radius: 0px 20px 0px 20px;
        font-size: 30px;
        font-family: Hiragino Sans GB;
        line-height: 50px;
        color: #FFF;
    }
}
</style>
