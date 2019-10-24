<template>
  <div :class="$style.instructions">
    <div :class="$style.title">
      活动规则
    </div>
    <ul :class="$style.rule">
      <li>
        <div :class="$style.step1" />
        <div :class="$style.text">选择需要 的拼团活动</div>
      </li>
      <li :class="$style.line" />
      <li>
        <div :class="$style.step2" />
        <div :class="$style.text">支付参团</div>
      </li>
      <li :class="$style.line" />
      <li>
        <div :class="$style.step3" />
        <div :class="$style.text">等待好友 参团支付</div>
      </li>
      <li :class="$style.line" />
      <li>
        <div :class="$style.step4" />
        <div :class="$style.text">达到人数 拼团成功</div>
      </li>
    </ul>
    <ul :class="$style.content">
      <li>1. 任何人均可参团，每个人开团数和参团数不得超过最高设定；</li>
      <li>2. 选择参团科目（每个团只能选择一个科目），填写报名基本信息；</li>
      <li>3. 提交报名信息，完成线上支付预定名额；</li>
      <li>4. 活动分享给好友，邀请好友加入你的团，一起赢优惠。</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TogetherRule'
}
</script>

<style module lang="scss">
  .instructions {
    margin-top: 20px;
    padding: 0 24px;
    background-color: #fff;
  }
  .title {
    line-height: 100px;
    color: #000;
    font-size: 32px;
    font-weight: bold;
    // border-bottom: 1px solid #e7e7e7;
  }
  .rule{
    display: flex;
    justify-content: space-between;
    padding: 28px 0 32px;
    border-bottom: 1px solid #e7e7e7;
    li{
      width: 120px;
      font-size: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .text{
        margin-top: 12px;
        height: 64px;
        line-height: 32px;
        text-align: center;
      }
      &.line{
        width: 70px;
        height: 2px;
        background: #e7e7e7;
        margin-top: 37px;
      }
      .step1{
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/tuan/step1.png");
        background-size: 100% 100%;
        width: 74px;
        height: 74px;
      }
      .step2{
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/tuan/step2.png");
        background-size: 100% 100%;
        width: 74px;
        height: 74px;
      }
      .step3{
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/tuan/step3.png");
        background-size: 100% 100%;
        width: 74px;
        height: 74px;
      }
      .step4{
        background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/tuan/step4.svg");
        background-size: 100% 100%;
        width: 74px;
        height: 74px;
      }
    }
  }
  .content {
    width: 100%;
    padding: 40px 0 48px 0;
    font-size: 28px;
    line-height: 45px;
    word-break: break-all;
    white-space: pre-wrap;
    color: #666;
  }
</style>
