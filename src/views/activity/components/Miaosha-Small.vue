<template>
  <router-link :class="$style.miaosha" tag="div" :to="{ name: '' }">
    <div :class="$style.background">
      <div :class="$style.wrapper">
        <ul :class="$style.list" v-if="data.values.length">
          <li :class="$style.listItem">
            <div :class="$style.imgWrapper">
              <img :src="data.values[0].goodsInfo.productMainImage + '?x-oss-process=style/thum-small'">
              <div :class="$style.countDown">
                <span :class="$style.text">距开始</span>
                <span :class="$style.num">23</span>:
                <span :class="$style.num">59</span>:
                <span :class="$style.num">59</span>
              </div>
            </div>
            <div :class="$style.info">
              <div :class="$style.main">
                {{ data.values[0].goodsInfo.productName }}
              </div>
              <div :class="$style.current">
                <pl-icon name="icon-miaoshajia" type="svg" />
                <span :class="$style.price">
                  {{ data.values[0].goodsInfo.activityInfo && data.values[0].goodsInfo.activityInfo.activityPrice }}
                </span>
              </div>
              <div :class="$style.sub">
                <div :class="$style.subLeft">
                  <div :class="$style.original">
                    原价:
                    <span :class="$style.price">
                      {{ data.values[0].goodsInfo.productSkuModels && data.values[0].goodsInfo.productSkuModels.length && getPrice(data.values[0].goodsInfo.productSkuModels)('price') }}
                    </span>
                  </div>
                  <div :class="$style.progress">
                    <div :class="$style.progressInner" :style="{ width: `${(Number(data.values[0].goodsInfo.activityInfo.number) - Number(data.values[0].goodsInfo.activityInfo.activityStock) / Number(data.values[0].goodsInfo.activityInfo.number)) * 100}%` }" />
                  </div>
                  <div :class="$style.saled" v-if="data.values[0].goodsInfo.activityInfo.activityStock > 0 && Number(data.values[0].goodsInfo.activityInfo.number) - Number(data.values[0].goodsInfo.activityInfo.activityStock) >= 10">
                    {{ `已抢${Number(data.values[0].goodsInfo.activityInfo.number) - Number(data.values[0].goodsInfo.activityInfo.activityStock)}件` }}
                  </div>
                  <div :class="$style.saled" v-if="data.values[0].goodsInfo.activityInfo.activityStock > 0 && Number(data.values[0].goodsInfo.activityInfo.number) - Number(data.values[0].goodsInfo.activityInfo.activityStock) < 10">
                    {{ `${data.values[0].goodsInfo.pageviews}人已关注` }}
                  </div>
                  <div :class="$style.saled" v-if="data.values[0].goodsInfo.activityInfo.activityStock === 0" style="color: #999999;">
                    已抢完
                  </div>
                </div>
                <div :class="$style.subRight">
                  <pl-icon name="icon-qiang" type="svg" />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'Miaosha',
  props: {
    data: {
      type: Object,
      default () {
        return { values: [] }
      }
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {}
  },
  methods: {
    getPrice (list) {
      return (key) => {
        let arr = list.map(item => item[key])
        return key === 'originalPrice' ? Math.max(...arr) : Math.min(...arr)
      }
    }
  }
}
</script>

<style module lang="scss">
  .miaosha {
    margin-top: 32px;
    background: linear-gradient(180deg, #F2BAA7 0%, #E45750 12%, #E45750 100%);
    border-radius: 20px;
    overflow: hidden;
    .background {
      background: url("../../../assets/images/activity/bg-miaosha.png") no-repeat center top;
      background-size: 100% auto;
    }
    .wrapper {
      position: relative;
      padding: 242px 24px 48px;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &-item {
        display: flex;
        padding: 16px;
        width: 100%;
        background-color: #FFF;
        border-radius: 20px;
        overflow: hidden;
        .img-wrapper {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-right: 16px;
          width: 280px;
          height: 188px;
          .count-down {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            font-size: 24px;
            line-height: 36px;
            background: rgba(0, 0, 0, 1);
            opacity: 0.65;
            color: #FFF;
            padding: 8px 0;
          }
          .text {
            margin-right: 10px;
          }
          .num {
            box-sizing: border-box;
            margin: 0 5px;
            padding: 4px;
            height: 36px;
            line-height: 32px;
            background: #555;
            border-radius: 4px;
            opacity: 1;
          }
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .info {
          flex: 1;
          display: flex;
          justify-content: center;
          flex-direction: column;
          position: relative;
        }
        .main {
          font-size: 28px;
          font-weight: bold;
          line-height: 40px;
          color: #000000;
          @include elps();
        }
        .current {
          margin-bottom: 2px;
          display: flex;
          align-items: flex-end;
          color: #FE3C5E;
          @include elps();
          .price {
            flex: 1;
            width: 0;
            margin-left: 4px;
            font-size: 40px;
            font-family: San Francisco Display;
            font-weight: bold;
            @include elps();
            &:before {
              content: '￥';
              font-size: 24px;
              font-family: Microsoft YaHei;
              font-weight: bold;
            }
          }
          svg {
            width: 60px;
            height: 26px;
            padding-bottom: 6px;
          }
        }
        .sub {
          display: flex;
          align-items: flex-end;
          &-left {
            flex: 1;
            width: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .original {
              display: flex;
              align-items: flex-end;
              margin-bottom: 14px;
              font-size: 20px;
              color: #999999;
              @include elps();
              .price {
                flex: 1;
                width: 0;
                font-family: San Francisco Display;
                text-decoration: line-through;
                @include elps();
                &:before {
                  content: '￥';
                  font-family: Microsoft YaHei;
                }
              }
            }
            .progress {
              margin-bottom: 4px;
              width: 244px;
              height: 14px;
              background: #FFD2D2;
              border-radius: 206px;
              overflow: hidden;
              &-inner {
                height: 14px;
                background: #F55959;
                border-radius: 206px;
              }
            }
            .saled {
              font-size: 20px;
              font-weight: 600;
              color: #FE3C5E;
            }
          }
          &-right {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 72px;
            height: 72px;
            background: linear-gradient(231deg, rgba( 238, 144, 111, 1) 0%, rgba(233, 70, 115, 1) 100%);
            border-radius: 50%;
            overflow: hidden;
            color: #ffffff;
            svg {
              width: 38px;
            }
          }
        }
      }
    }
  }
</style>
