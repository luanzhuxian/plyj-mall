<template>
  <div :class="$style.getSuccess">
    <div :class="$style.top">
      <pl-svg
        :class="$style.icon"
        name="signup-success"
      />
      <p :class="$style.tip1">
        <span>已成功领取精美礼品</span>
      </p>
      <pl-button
        size="huge"
        type="warning"
        @click="$router.replace({ name: 'Home' })"
      >
        完成，去逛雅集
      </pl-button>
    </div>
    <div :class="$style.bottom">
      <p>学校机构资料的真实性审核通过后</p>
      <p class="mb-28">即可免费获得专属线上教育商城</p>
      <p>我们将在15个工作日内与您联系</p>
      <p class="mb-48">全程提供专属商城部署、商城装修等服务</p>
      <img src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/1.9.4/qingfeng.png" alt="">
      <p>长按识别二维码</p>
      <p>可联系雅集小书童-清风</p>
    </div>
    <call-us />
  </div>
</template>
<script>
import CallUs from '../../components/Call-Us.vue'
export default {
  name: 'GetSuccess',
  components: {
    CallUs
  }
}
</script>
<style module lang="scss">
  .get-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    .top {
      padding: 64px 20px;
      width: 100%;
      box-sizing: border-box;
      background-color: #fff;
    }
    .icon {
      width: 148px;
    }
    .tip1 {
      margin-top: 20px;
      margin-bottom: 48px;
      font-size: 36px;
      font-weight: bold;
    }
    .bottom {
      margin-top: 48px;
      padding-bottom: 92px;
      line-height: 40px;
      font-size: 28px;
      color: #666;
      > img {
        width: 216px;
        height: 216px;
      }
    }
  }
</style>
