<template>
  <div :class="$style.withdrawCashSuccess">
    <pl-svg
      :class="$style.icon"
      name="withdraw-success"
    />
    <p :class="$style.tip1">
      请求已提交
    </p>
    <p :class="$style.tip2">
      我们已收到您提交的信息，审核需要2-5个工作日
    </p>
    <p :class="$style.tip2">
      您可在“ 我的资产-提现明细”中可查看审核记录
    </p>
    <p :class="$style.tip2">
      若审核通过，将通过【红包】发放给您
    </p>
    <p :class="$style.tip2">
      记得领取哦!
    </p>
    <pl-button
      type="warning"
      size="huge"
      @click="$router.go(-1)"
    >
      返回
    </pl-button>
  </div>
</template>

<script>
export default {
  name: 'WithdrawCashSuccess'
}
</script>

<style module lang="scss">
  .withdrawCashSuccess {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 0 40px;
  }

  .icon {
    width: 142px;
  }

  .tip1 {
    width: 209px;
    height: 53px;
    margin: 60px 0 20px 0;
    font-size: 40px;
    color: rgba(51, 51, 51, 1);
    line-height: 53px;
    letter-spacing: 1px;
  }

  .tip2 {
    width: 659px;
    line-height: 46px;
    font-size: 28px;
    text-align: center;
    color: rgba(153, 153, 153, 1);
    &:nth-last-of-type(1) {
      margin-bottom: 46px;
    }
  }
</style>
