<template>
  <div :class="$style.withdrawDetail">
    <div :class="$style.money">
      <span class="gray-3 fz-28">出账金额</span>
      <span
        class="fz-60 bold rmb"
        v-text="detail.price"
      />
    </div>
    <ul :class="$style.detail + ' fz-28'">
      <li>
        <span>类型</span>
        <span>支出</span>
      </li>
      <li>
        <span>提现账号</span>
        <span v-text="detail.userName" />
      </li>
      <li>
        <span>时间</span>
        <span v-text="detail.createTime" />
      </li>
      <li>
        <span>状态</span>
        <span v-text="status[detail.status]" />
      </li>
      <li v-if="detail.status === 'RECEIVED'">
        <span>到账查询</span>
        <span>微信：企业发红包-领取红包</span>
      </li>
      <li v-if="detail.status === 'REJECT'">
        <span>驳回原因</span>
        <p :class="$style.message">
          <span
            :class="$style.messageText"
            v-text="detail.message"
          />
        </p>
      </li>
      <li v-if="detail.status === 'FAIL'">
        <span>失败原因</span>
        <p :class="$style.message">
          <span
            :class="$style.messageText"
            v-text="detail.returnMsg"
          />
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { getWithdrawDepositDetail } from '../../../apis/money'
export default {
  name: 'WithdrawDetail',
  data () {
    return {
      detail: {},
      id: 'all',
      result: {},
      status: {
        PASS: '已到账',
        AWAIT: '待审核',
        REJECT: '驳回',
        FAIL: '提现失败'
      }
    }
  },
  activated () {
    this.getDetail()
  },
  methods: {
    async getDetail () {
      try {
        const { result } = await getWithdrawDepositDetail(this.$route.params.id)
        this.detail = result
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .withdraw-detail {
    background-color: #fff;
  }
  .money {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    height: 144px;
    &:after {
      @include border-half-bottom(#e7e7e7);
    }
  }
  .detail {
    padding: 30px;
    background-color: #fff;
    li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      > span {
        display: inline-block;
        &:nth-of-type(1) {
          width: 120px;
          color: #999;
          margin-right: 20px;
          @include text-justify;
        }
      }
    }
  }
  .message {
    flex: 1;
    text-align: right;
    .messageText {
      width: auto;
      display: inline-block;
      text-align: left;
    }
  }
</style>
