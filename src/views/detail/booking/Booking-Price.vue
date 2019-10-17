<template>
  <div class="tuan">
    <div>
      <div class="price">定金 <span>{{ detail.activityProductModel.price }}</span> 抵 <span>20</span></div>
      <div class="pro-info">
        <div class="original">原价：108</div>
        <div>30人已购买</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TogetherPrice',
  props: {
    detail: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
  .tuan{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 14px;
    .price {
      line-height: 48px;
      margin-bottom: 4px;
      color: #FE7700;
      font-size: 30px;
      span {
        font-size: 48px;
        &:before {
          content: '¥';
          font-size: 24px;
        }
      }
    }
    .pro-info{
      display: flex;
      color: #999999;
    }
    .original{
      display: flex;
      font-size: 24px;
      color: #999999;
      margin-right: 32px;
      .text{
        margin-right: 10px;
      }
      del {
        &:before {
          content: '¥';
        }
      }
    }
  }
</style>
