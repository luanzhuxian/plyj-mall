<template>
  <h2 :class="$style.detailTitle">
    <div v-if="activeProduct === 3 && preActivity !== 0" :class="$style.secondLabel">{{ activityTag }}</div> {{ productName }}
  </h2>
</template>

<script>
export default {
  name: 'DetailTitle',
  props: {
    activeProduct: {
      type: Number,
      default: 0
    },
    preActivity: {
      type: [Number, String],
      default: ''
    },
    productName: {
      type: String,
      default: ''
    },
    activityTag: {
      type: String,
      default: ''
    }
  }
}
</script>

<style module lang="scss">
  .detail-title {
    margin-top: 26px;
    font-size: 28px;
    line-height: 48px;
    font-weight: bold;
    color: #000;
    .second-label{
      display: inline-block;
      padding: 0 10px;
      height: 36px;
      line-height: 36px;
      font-size: 22px;
      color: #FF3323;
      background: #EFE0C3;
      margin-right: 6px;
    }
  }
</style>
