<template>
    <div
        class="item"
        :class="$style.item"
        @click="$router.push({ name: 'Product', params: { productId: data.goodsInfo.id } , query: { currentProductStatus: 4 }})"
    >
        <div :class="$style.time">
            <div :class="$style.timeLeft">
                <span v-if="data.goodsInfo.activityInfo.status === 0">距开始：</span>
                <span v-if="data.goodsInfo.activityInfo.status === 1">距结束：</span>
                <span v-if="data.goodsInfo.activityInfo.status === 2">已结束</span>
            </div>
            <div :class="$style.timeRight" v-if="~[0, 1].indexOf(data.goodsInfo.activityInfo.status)">
                <count-down
                    :timestamp="getTime(data.goodsInfo.activityInfo)"
                    size="mini"
                    @done="() => data.goodsInfo.activityInfo.status += 1"
                />
            </div>
        </div>
        <div :class="$style.info">
            <div :class="$style.main">
                {{ data.goodsInfo.productName }}
            </div>
            <div :class="$style.sub1">
                <span>{{ `预交定金￥${data.goodsInfo.activityInfo.price}` }}</span>
                <span v-if="data.goodsInfo.activityInfo.multiple && data.goodsInfo.activityInfo.multipleNumber > 1 && data.goodsInfo.activityInfo.activityPrice">{{ `抵￥${data.goodsInfo.activityInfo.activityPrice}` }}</span>
            </div>
            <div :class="$style.sub2">
                {{ `预售到手价：${getTotalPrice(data)}元` }}
            </div>
        </div>
        <div :class="$style.imgWrapper">
            <img :src="data.goodsInfo.productMainImage">
        </div>
    </div>
</template>

<script>
import CountDown from '../components/Count-Down.vue'
import { getTime, getTotalPrice } from '../helper.js'

export default {
    name: 'ItemYugou',
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
        getTotalPrice
    }
}
</script>
<style lang="scss" module>
  .item {
    position: relative;
    display: flex;
    margin-top: 40px;
    background: linear-gradient(90deg, #F6AB15 0%, #F5540E 100%);
    border-radius: 20px;
    &:nth-of-type(1) {
      margin: 0;
    }
    .time {
      position: absolute;
      top: -20px;
      left: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 334px;
      height: 58px;
      background: #F59D4B;
      border-radius: 10px;
      color: #FFFFFF;
      font-size: 26px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      @include elps();
    }
    .info {
      flex: 1;
      width: 0;
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      padding: 0 24px 16px;
      color: #FFFFFF;
    }
    .main {
      font-size: 28px;
      font-weight: bold;
      line-height: 26px;
      @include elps();
    }
    .sub-1 {
      margin-top: 8px;
      padding: 0 12px;
      height: 52px;
      line-height: 52px;
      background: #EA611B;
      font-size: 24px;
      font-family: San Francisco Display;
      font-weight: bold;
      text-align: center;
      @include elps();
    }
    .sub-2 {
      margin-top: 12px;
      font-size: 24px;
      font-family: Microsoft YaHei;
      @include elps();
    }
    .img-wrapper {
      width: 300px;
      height: 200px;
      border-radius: 100px 20px 20px 100px;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
<style lang="scss" scoped>
.item {
  >>> .count-down {
    font-size: 26px;
  }
}
</style>
