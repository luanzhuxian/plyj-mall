<template>
  <div :class="$style.detailOtherInfo">
    <!-- 特色课详情 -->
    <p v-if="type === 'feature' || type === 'lesson'">
      <pl-svg name="duration" />体验时长：2小时
    </p>
    <p v-if="type === 'feature' || type === 'lesson'">
      <pl-svg name="welfare" />现场福利：精美小礼品、免费咖啡茶水、wifi
    </p>
    <p v-if="type === 'feature' || type === 'lesson'">
      <pl-svg name="date" />有效时间：2019.01.01-2020
    </p>
    <!-- 试听详情 -->
    <p v-if="type === 'audition'">
      <pl-svg name="my2" />适用对象：中小学生
    </p>
    <p v-if="type === 'audition'">
      <pl-svg name="stage" />适用阶段：6-10岁
    </p>
    <p v-if="type === 'audition'">
      <pl-svg name="classes" />班级人数：15人以下
    </p>
    <p v-if="type === 'audition'">
      <pl-svg name="duration" />试听时长：90分钟
    </p>
    <div :class="$style.address">
      <pl-svg name="address2" />
      <span>体验地址：天台八路腾飞科汇城</span>
      <div :class="$style.location">
        <pl-svg name="location" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailOtherInfo',
  props: {
    type: {
      type: String,
      default: ''
    }
  }
}
</script>

<style module lang="scss">
  .detail-other-info {
    position: relative;
    padding-top: 30px;
    font-size: 22px;
    color: #999;
    line-height: 32px;
    p {
      margin-bottom: 9px;
    }
    svg {
      width: 24px;
      margin-right: 10px;
      vertical-align: -4px;
      fill: currentColor;
    }
    &:before {
      @include border-half-top(#e7e7e7)
    }
  }
  .address {
    position: relative;
  }
  .location {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 36px;
    padding-left: 40px;
    font-size: 0;
    @include border-half-left(#e7e7e7);
    svg {
      margin: 0;
      width: 36px;
    }
  }
</style>
