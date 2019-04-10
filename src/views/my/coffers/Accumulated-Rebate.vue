<template>
  <div :class="$style.accumulatedRebate">
    <main class="radius-20 bg-white">
      <div class="partition">
        <span class="gray-1 fz-32 bold">累计润笔</span>
        <span
          class="fz-56 gray-1 bold"
          v-text="userInfo.cumulativeBalance"
        />
      </div>

      <div>
        <span class="gray-1 fz-32">可提现润笔</span>
        <span
          class="fz-40 gray-1 bold"
          v-text="userInfo.balance"
        />
      </div>

      <div>
        <span class="gray-1 fz-32">已申请润笔</span>
        <span
          class="fz-40 gray-1 bold"
          v-text="userInfo.applyBalance"
        />
      </div>

      <div class="partition">
        <span class="gray-1 fz-32">成功提现润笔</span>
        <span
          class="fz-40 gray-1 bold"
          v-text="userInfo.successBalance"
        />
      </div>

      <div>
        <span class="gray-1 fz-32">待打款润笔</span>
        <span
          class="fz-40 gray-1 bold"
          v-text="userInfo.awaitBalance"
        />
      </div>

      <div>
        <span class="gray-1 fz-32">无效润笔</span>
        <span
          class="fz-40 gray-1 bold"
          v-text="userInfo.rejectBalance"
        />
      </div>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AccumulatedRebate',
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>

<style module lang="scss">
  .accumulated-rebate {
    padding: 34px;
    main {
      box-shadow: 0 0 30px rgba(0, 0, 0, .1);
      overflow: hidden;
      > div {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 124px;
        padding: 0 30px;
        &:after {
          @include border-half-bottom(#e7e7e7);
          left: -310px;
        }
        &:nth-of-type(1) {
          height: 138px;
        }
        &:nth-last-of-type(1):after {
          display: none;
        }
        > span:nth-of-type(2):before {
          content: '¥ ';
          font-size: 80%;
        }
      }
    }
  }
</style>
