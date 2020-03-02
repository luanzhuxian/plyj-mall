<template>
  <div :class="$style.liveItem" @click="target(item)">
    <div :class="$style.img">
      <div>支持回放</div>
      <img :src="item.coverImg" alt="">
    </div>
    <div :class="$style.description">
      <div :class="$style.title">
        <div>{{ item.activityName }}</div>
        <div>直播时间：{{ item.startTime }}</div>
      </div>
      <div :class="$style.content">
        <div>
          <template v-if="item.needPay === 0">
            <span>免费</span>
          </template>
          <template v-else-if="item.paidAmount === 0">
            <span>需支付：</span><span>￥ {{ item.needPaidAmount / 100 }}</span>
          </template>
          <template v-else>
            <span>已付费：</span><span>￥ {{ item.paidAmount / 100 }}</span>
          </template>
        </div>
        <div>观看回放</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LiveItem',
  props: {
    item: {
      type: Object,
      default () {
        return {
          coverImg: '',
          activityName: '', // 直播名
          startTime: '', // 直播时间
          needPay: 0, // 是否需要付费   1需要  0不需要
          paidAmount: 0, // 已支付金额，单位分， 0 代表用户未付费
          needPaidAmount: '' // 需要支付金额，单位分
        }
      }
    }
  },
  methods: {
    target (item) {
      this.$router.push({
        name: 'LivePlayBack',
        params: {
          id: item.id,
          activityId: item.activityId
        }
      })
    }
  }
}
</script>

<style module lang="scss">

  .live-item {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding: 0 24px 24px 24px;
    background: #FFFFFF;
    > .img {
      height: 164px;
      position: relative;
      margin-right: 20px;
      > img {
        width: 224px;
        height: 100%;
        vertical-align: top;
      }
      > div {
        position: absolute;
        top: 0;
        left: 0;
        width: 120px;
        background: #F2B036;
        color: #FFFFFF;
        font-size: 22px;
        line-height: 46px;
        text-align: center;
        border-radius:0px 40px 40px 0px;
      }
    }
    > .description {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      align-content: space-between;
      > .title {
        width: 100%;
        color: #A8A8A8;
        font-size: 24px;
        > div:nth-of-type(1) {
          margin-bottom: 6px;
          color: #333333;
          font-size: 32px;
        }
      }
      > .content {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        > div:nth-of-type(1) {
          font-size: 24px;
        }
        > div:nth-of-type(2){
          font-size: 22px;
          text-align: center;
          background: #FE7700;
          color: #FFFFFF;
          width: 140px;
          line-height: 40px;
          border-radius:20px;
        }
      }
    }
  }

</style>
