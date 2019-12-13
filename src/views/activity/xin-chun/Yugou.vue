<template>
  <div :class="$style.yugou">
    <div :class="$style.yugouTop">
      <div :class="$style.yugouTopSide" />
      <div :class="$style.yugouTopContent">
        <h3>预购享翻倍</h3>
        <p v-if="data.otherValue">
          {{ `${data.otherValue}人参与 查看更多>` }}
        </p>
        <p v-else>
          查看更多>
        </p>
      </div>
    </div>
    <ul :class="$style.yugouList" v-if="data.values.length">
      <template v-for="(item, i) of data.values">
        <li
          v-if="item.goodsInfo && item.goodsInfo.activityInfo"
          :class="$style.yugouListItem"
          :key="i"
        >
          <div :class="$style.time">
            <div :class="$style.timeLeft">
              <span v-if="item.goodsInfo.activityInfo.status === 0">距开始：</span>
              <span v-if="item.goodsInfo.activityInfo.status === 1">距结束：</span>
              <span v-if="item.goodsInfo.activityInfo.status === 2">已结束</span>
            </div>
            <div :class="$style.timeRight" v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)">
              <count-down
                :timestamp="getTime(item.goodsInfo.activityInfo)"
                size="mini"
                @done="() => item.goodsInfo.activityInfo.status += 1"
              />
            </div>
          </div>
          <div :class="$style.info">
            <div :class="$style.main">
              {{ item.goodsInfo.productName }}
            </div>
            <div :class="$style.sub1">
              <span>{{ `预交定金￥${item.goodsInfo.activityInfo.price}` }}</span>
              <span v-if="item.goodsInfo.activityInfo.multiple && item.goodsInfo.activityInfo.activityPrice">{{ `抵￥${item.goodsInfo.activityInfo.activityPrice}` }}</span>
            </div>
            <div :class="$style.sub2">
              {{ `预售到手价：${getTotalPrice(item)}元` }}
            </div>
          </div>
          <div :class="$style.imgWrapper">
            <img :src="item.goodsInfo.productMainImage">
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import mixin from '../mixin.js'
import CountDown from '../components/Count-Down.vue'

export default {
  name: 'Yugou',
  mixins: [mixin],
  components: {
    CountDown
  },
  props: {
    data: {
      type: Object,
      default () {
        return { values: [] }
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    getTotalPrice (item) {
      if (!item.goodsInfo || !item.goodsInfo.productSkuModels || !item.goodsInfo.productSkuModels.length) return false
      const prodPrice = this.getPrice(item.goodsInfo.productSkuModels)('price')
      if (item.goodsInfo.activityInfo.activityPrice >= prodPrice) {
        return item.goodsInfo.activityInfo.price
      } else {
        return this.sub(prodPrice, this.sub(item.goodsInfo.activityInfo.activityPrice, item.goodsInfo.activityInfo.price))
      }
    }
  }
}
</script>

<style lang="scss" module>
  .yugou {
    &-top {
      &-side {
        border: 64px solid;
        border-bottom: 32px solid;
        border-top: none;
        border-color: transparent transparent #DC4F44 transparent;
      }
      &-content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 136px;
        border-top: 4px solid #F3867E;
        background: #FB2A33;
        font-size: 26px;
        font-family: Microsoft YaHei;
        color: #FFFFFF;
        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.20);
        > h3 {
          font-size: 48px;
          font-weight: bold;
        }
        > p {
          margin-top: 8px;
        }
      }
    }
    &-list {
      padding: 52px 32px 48px;
      background: #F5574B;
    }
    &-list-item {
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
        /deep/ .count-down {
          font-size: 26px;
        }
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
  }
</style>
