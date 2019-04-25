<template>
  <div :class="$style.coffers">
    <TopText
      title="小金库"
      tip="看看你距离人生巅峰还差多少～"
    />

    <div :class="$style.myAssets + ' bg-white radius-20 mt-28'">
      <div :class="$style.title">
        <pl-svg name="my-assets" />我的资产
      </div>
      <div>
        <div :class="$style.withdrawals">
          <p class="fz-24 gray-3">
            可提现润笔
          </p>
          <p class="fz-50 bold">
            {{ balance }} <i class="fz-26">元</i>
          </p>
          <router-link
            tag="button"
            :to="{ name: 'WithdrawCash' }"
            style="width: 27.733vw;"
            :class="$style.myButton + ' mt-22'"
          >
            提现
          </router-link>
        </div>
        <div :class="$style.todayRebate">
          <p class="fz-24 gray-3">
            今日润笔
          </p>
          <p class="fz-50 bold">
            {{ currentBalance }} <i class="fz-26">元</i>
          </p>
          <p class="gray-4 fz-26 mt-22">
            今天你赚了多少
          </p>
        </div>
      </div>
    </div>

    <div :class="'mt-28 ' + $style.more">
      <div class="radius-20 bg-white">
        <div>
          <div :class="$style.title">
            <pl-svg name="my-rebate" />累计润笔
          </div>
          <div :class="$style.middle">
            <p class="fz-44 bold">
              {{ cumulativeBalance }} <i class="fz-20 gray-3">元</i>
            </p>
            <p class="fz-24 gray-2">
              您累计赚取的润笔
            </p>
          </div>
          <router-link
            tag="button"
            :to="{ name: 'AccumulatedRebate' }"
            :class="$style.myButton"
          >
            去看看
          </router-link>
        </div>
      </div>

      <div class="radius-20 bg-white">
        <div :class="$style.detail">
          <div :class="$style.title">
            <pl-svg name="my-withdrawals" />提现明细
          </div>
          <div :class="'fz-22 gray-2 ' + $style.middle">
            <pl-svg name="my-withdrawals2" />
            看看你<br>转走了多少财富
          </div>
          <router-link
            tag="button"
            :to="{ name: 'WithdrawList' }"
            :class="$style.myButton"
          >
            去查看
          </router-link>
        </div>
      </div>

      <div class="radius-20 bg-white">
        <div :class="$style.detail">
          <div :class="$style.title">
            <pl-svg name="my-rebate-detail2" />润笔明细
          </div>
          <div :class="'fz-22 gray-2 ' + $style.middle">
            <pl-svg name="my-rebate-detail1" />
            解锁赚钱新姿势
          </div>
          <router-link
            tag="button"
            :to="{ name: 'RebateList' }"
            :class="$style.myButton"
          >
            去查看
          </router-link>
        </div>
      </div>

      <div class="radius-20 bg-white">
        <div :class="$style.seeMore">
          <pl-svg name="my-more" />
          <p>更多功能</p>
          <p class="fz-20 gray-3">
            敬请期待
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Coffers',
  components: {
    TopText
  },
  computed: {
    ...mapGetters(['balance', 'currentBalance', 'cumulativeBalance'])
  }
}
</script>

<style module lang="scss">
  .coffers {
    padding: 28px 40px;
  }
  .title {
    font-size: 28px;
    font-weight: bold;
    line-height: 70px;
    svg {
      width: 36px;
      vertical-align: -8px;
      margin-right: 10px;
    }
  }
  .my-assets {
    padding: 0 28px;
    > div:nth-of-type(2) {
      display: flex;
    }
    .today-rebate, .withdrawals {
      flex: 1;
      height: 243px;
      padding-left: 48px;
      background-color: #fff;
    }
  }
  .more {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    > div {
      padding: 0 24px 24px 24px;
      margin-bottom: 20px;
      > div {
        width: 277px;
        display: flex;
        flex-direction: column;
        .title {
          font-weight: normal;
          svg {
            vertical-align: -8px;
          }
        }
      }
    }
    .middle {
      height: 96px;
      margin-bottom: 10px;
    }
  }
  .detail {
    div:nth-of-type(2) {
      display: inline-flex;
      align-items: center;
      > svg {
        width: 96px;
        height: 96px;
        margin-right: 20px;
      }
    }
  }
  .my-button {
    display: block;
    position: relative;
    width: 100%;
    height: 66px;
    border-radius: 33px;
    color: #ABA9EB;
    font-size: 24px;
    &:after {
      @include border-half(#ABA9EB, 66px)
    }
  }
  .see-more {
    width: 277px;
    margin-top: 64px;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    p:nth-of-type(1) {
      margin: 16px 0 10px 0;
      color: #ABA9EB;
    }
    svg {
      width: 74px;
      height: 74px;
    }
  }
</style>
