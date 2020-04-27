<template>
    <div
        class="item"
        :class="$style.item"
        @click="$router.push({ name: 'Product', params: { productId: data.goodsInfo.id }, query: { currentProductStatus: 2 } })"
    >
        <div :class="$style.label">
            众志成团
        </div>
        <div :class="$style.ribbon">
            <span v-if="data.goodsInfo.activityInfo.status === 0">
                {{ `${data.goodsInfo.pageviews}人关注` }}
            </span>
            <span v-else>
                {{ `${data.goodsInfo.activityInfo.number}人参团` }}
            </span>
        </div>
        <div :class="$style.countDownWrapper">
            <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 0">距开始：</span>
            <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 1">距结束：</span>
            <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 2">已成功</span>
            <span :class="$style.text" v-if="data.goodsInfo.activityInfo.status === 3">已结束</span>
            <count-down
                v-if="~[0, 1].indexOf(data.goodsInfo.activityInfo.status)"
                :timestamp="getTime(data.goodsInfo.activityInfo)"
                size="mini"
                color="#FF4B00"
                @done="() => reset(data)"
            />
        </div>
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage">
        </div>
        <div :class="$style.info">
            <div :class="$style.main">
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.sub1">
                <div :class="$style.sub1Left">
                    <span v-if="data.goodsInfo.activityInfo.prizePool">
                        成团瓜分
                    </span>
                    <span v-else>新春有礼</span>
                </div>
                <div :class="$style.sub1Right" v-if="data.goodsInfo.activityInfo.prizePool">
                    {{ `${data.goodsInfo.activityInfo.prizePool}元` }}
                </div>
            </div>
            <div :class="$style.sub2">
                <pl-svg name="icon-tuangoujia" fill="#FF4B00" width="80" height="40" />
                <span :class="$style.sub2Price">{{ data.goodsInfo.activityInfo.activityPrice }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import CountDown from '../../activity/components/Count-Down.vue'
import { getTime, reset } from '../../activity/helper'

export default {
    name: 'ItemPintuan',
    components: {
        CountDown
    },
    props: {
        data: {
            type: Object,
            default () {
                return { }
            }
        }
    },
    data () {
        return {}
    },
    methods: {
        getTime,
        reset
    }
}
</script>
<style lang="scss" module>
  .item {
    position: relative;
    display: flex;
    margin-top: 40px;
    background: linear-gradient(180deg, #FFEABF 0%, #FCD29F 100%);
    border-radius: 40px 20px 40px 20px;
    &:nth-of-type(1) {
      margin: 0;
    }
    .label {
      position: absolute;
      top: 0;
      left: 0;
      width: 170px;
      line-height: 48px;
      text-align: center;
      background: #FB7D55;
      border-radius: 40px 0px 40px 0px;
      overflow: hidden;
      font-size: 24px;
      font-family: Microsoft YaHei;
      color: #FFFFFF;
    }
    .ribbon {
      position: absolute;
      right: -22px;
      bottom: 18px;
      width: 160px;
      height: 60px;
      background: url("https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/d7554918-27ed-4ba4-b71a-61e9c66aad2e.png") no-repeat center;
      background-size: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 8px;
      font-size: 24px;
      font-family: Microsoft YaHei;
      color: #724E12;
      @include elps();
    }
    .count-down-wrapper {
      position: absolute;
      top: -32px;
      right: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 336px;
      line-height: 52px;
      background: linear-gradient(180deg, #FFEABF 0%, #FCD29F 100%);
      box-shadow: 0px 4px 8px #A02E09;
      border-radius: 20px 10px 10px 10px;
      color: #FF4B00;
      font-size: 26px;
      font-family: San Francisco Display;
      font-weight: bold;
      @include elps();
    }
    .img-wrapper {
      width: 300px;
      height: 200px;
      border-radius: 40px 0 0 20px;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .info {
      flex: 1;
      width: 0;
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      padding: 0 20px 16px;
    }
    .main {
      font-size: 28px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 36px;
      color: #EC535B;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.16);
      @include elps();
    }
    .sub-1 {
      display: inline-flex;
      align-items: center;
      text-align: center;
      margin-top: 12px;
      width: fit-content;
      max-width: 100%;
      height: 34px;
      line-height: 30px;
      border: 2px solid #EC6BA4;
      border-radius: 4px;
      @include elps();
      &-left {
        padding: 6px;
        min-width: 104px;
        font-size: 24px;
        color: #FFF;
        background: #FF6767;
        overflow: hidden;
      }
      &-right {
        flex: 1;
        @include elps();
        padding: 0 10px;
        font-size: 24px;
        font-family: San Francisco Display;
        background: #FFFF00;
        color: #DB4D7D;
      }
    }
    .sub-2 {
      display: flex;
      align-items: flex-end;
      margin-top: 18px;
      font-size: 36px;
      font-family: San Francisco Display;
      font-weight: bold;
      color: #FF4B00;
      &-price {
        margin-left: 4px;
        @include elps();
        &::before {
          content: '￥';
          font-size: 24px;
          font-family: Microsoft YaHei;
          font-weight: bold;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
.item {
    ::v-deep .count-down {
    font-size: 26px;
  }
}
</style>
