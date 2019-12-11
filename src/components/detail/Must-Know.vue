<template>
  <ul :class="$style.mustKnow + ' bg-white radius-20 mt-28'">
    <li>
      <span :class="$style.title">有效期</span>
      <ul>
        <li>2018-01-01至2020-01-01</li>
      </ul>
    </li>
    <li>
      <span :class="$style.title">预约信息</span>
      <ul>
        <li>请您提前一天预约</li>
      </ul>
    </li>
    <li>
      <span :class="$style.title">适用人数</span>
      <ul>
        <li>每张团购券最多1人使用</li>
      </ul>
    </li>
    <li>
      <span :class="$style.title">规则提醒</span>
      <ul>
        <li>不再与其他优惠同享</li>
      </ul>
    </li>
    <li>
      <span :class="$style.title">课程信息</span>
      <ul>
        <li>可选同类课程</li>
        <li>不可以中途退费</li>
        <li>如有情况不能来上课的学员无法补课</li>
        <li>小班授课（8-15人）</li>
      </ul>
    </li>
    <li>
      <span :class="$style.title">商家服务</span>
      <ul>
        <li>提供免费wifi</li>
        <li>提供免费咖啡茶水</li>
      </ul>
    </li>
    <li>
      <span :class="$style.title">温馨提示</span>
      <ul>
        <li>商户可能致电您，预约到店时间，请保持手机畅通。</li>
        <li>如需团购券发票，请您在消费时向商户咨询</li>
        <li>为了保障您的权益，建议使用微信支付。若使用其他支付方式导致纠纷，商家不承担任何责任，感谢您的理解和支持！</li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'MustKnow'
}
</script>

<style module lang="scss">
  .must-know {
    padding: 30px;
    .title {
      font-size: 28px;
      color: #999;
    }
    ul {
      font-size: 28px;
      margin: 10px 0 24px 0;
      li {
        line-height: 40px;
        margin-bottom: 10px;
        &:before {
          content: '';
          display: inline-block;
          width: 10px;
          height: 10px;
          vertical-align: 6px;
          margin-right: 10px;
          border-radius: 5px;
          background-color: $--primary-color;
        }
      }
    }
}
</style>
