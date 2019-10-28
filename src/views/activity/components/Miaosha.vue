<template>
  <div :class="$style.miaosha">
    <div :class="$style.wrapper" v-if="data.values.length">
      <ul :class="$style.timeList">
        <div>
          <pl-icon
            name="icon-miaoshazhuanchang"
            type="svg"
            @click="$router.push({ name: 'SecondList' })"
          />
        </div>
        <!-- <span :class="$style.border" v-if="data.values[0]" /> -->
        <li
          v-if="data.values[0]"
          :class="{
            [$style.timeListItem]: true,
            [$style.current]: miaoshaIndex === 0
          }"
          @click.stop="miaoshaIndex = 0"
        >
          <div :class="$style.wrapper" v-if="data.values[0].range && data.values[0].range.length">
            <div :class="$style.status">
              <span>
                {{ getTimeStatus(data.values[0].range) }}
              </span>
            </div>
            <div :class="$style.time">
              {{ getDate(data.values[0].range[0], 'HH:mm') }}
            </div>
          </div>
        </li>
        <span :class="$style.border" v-if="data.values[1]" />
        <li
          v-if="data.values[1]"
          :class="{
            [$style.timeListItem]: true,
            [$style.current]: miaoshaIndex === 1
          }"
          @click.stop="miaoshaIndex = 1"
        >
          <div :class="$style.wrapper" v-if="data.values[1].range && data.values[1].range.length">
            <div :class="$style.status">
              {{ getTimeStatus(data.values[1].range) }}
            </div>
            <div :class="$style.time">
              {{ getDate(data.values[1].range[0], 'HH:mm') }}
            </div>
          </div>
        </li>
        <span :class="$style.border" v-if="data.values[2]" />
        <li
          v-if="data.values[2]"
          :class="{
            [$style.timeListItem]: true,
            [$style.current]: miaoshaIndex === 2
          }"
          @click.stop="miaoshaIndex = 2"
        >
          <div :class="$style.wrapper" v-if="data.values[2].range && data.values[2].range.length">
            <div :class="$style.status">
              {{ getTimeStatus(data.values[2].range) }}
            </div>
            <div :class="$style.time">
              {{ getDate(data.values[2].range[0], 'HH:mm') }}
            </div>
          </div>
        </li>
        <div :class="$style.btn" @click="$router.push({ name: 'SecondList' })">
          <span>进入专场</span>
        </div>
      </ul>
      <ul :class="$style.list">
        <li
          :class="$style.listItem"
          v-for="(prod, i) of data.values[miaoshaIndex].goodsInfo"
          :key="i"
          @click="$router.push({ name: 'Lesson', params: { productId: prod.id, brokerId: userId || null } })"
        >
          <div :class="$style.imgWrapper">
            <img :src="prod.productMainImage + '?x-oss-process=style/thum-small'">
            <div :class="$style.countDown">
              <span :class="$style.text" v-if="prod.activityInfo && prod.activityInfo.status === 0">距开始</span>
              <span :class="$style.text" v-if="prod.activityInfo && prod.activityInfo.status === 1">距结束</span>
              <span :class="$style.text" v-if="prod.activityInfo && prod.activityInfo.status === 2">已结束</span>
              <count-down
                v-if="~[0, 1].indexOf(prod.activityInfo.status)"
                :timestamp="getTime(prod.activityInfo)"
                :current-timestamp="timestamp"
                @done="() => prod.activityInfo.status += 1"
              />
            </div>
          </div>
          <div :class="$style.info">
            <div :class="$style.main">
              {{ prod.productName }}
            </div>
            <div :class="$style.current">
              <pl-icon name="icon-miaoshajia" type="svg" />
              <span :class="$style.price">
                {{ prod.activityInfo && prod.activityInfo.activityPrice }}
              </span>
            </div>
            <div :class="$style.sub">
              <div :class="$style.subLeft">
                <div :class="$style.original">
                  原价:
                  <span :class="$style.price">
                    {{ prod.productSkuModels && prod.productSkuModels.length && getPrice(prod.productSkuModels)('price') }}
                  </span>
                </div>
                <div :class="$style.progress" v-if="prod.activityInfo">
                  <div :class="$style.progressInner" :style="{ width: `${(Number(prod.activityInfo.number) - Number(prod.activityInfo.activityStock)) / Number(prod.activityInfo.number) * 100}%` }" />
                </div>
                <div :class="$style.saled" v-if="prod.activityInfo && prod.activityInfo.status === 0">
                  {{ `${prod.pageviews}人已关注` }}
                </div>
                <div :class="$style.saled" v-if="prod.activityInfo && prod.activityInfo.status > 0 && prod.activityInfo.activityStock > 0">
                  {{ `已抢${Number(prod.activityInfo.number) - Number(prod.activityInfo.activityStock)}件` }}
                </div>
                <div :class="$style.saled" v-if="prod.activityInfo && prod.activityInfo.status > 0 && prod.activityInfo.activityStock === 0" style="color: #999999;">
                  已抢完
                </div>
              </div>
              <div
                :class="{
                  [$style.subRight]: true,
                  [$style.disabled]: prod.activityInfo && prod.activityInfo.status !== 1
                }"
              >
                <pl-icon
                  v-if="~[0, 1].indexOf(prod.activityInfo.status)"
                  :class="$style.qiang"
                  name="icon-qiang"
                  type="svg"
                />
                <pl-icon
                  v-else
                  :class="$style.jieshu"
                  name="icon-jieshu"
                  type="svg"
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import mixin from '../mixin.js'
import CountDown from './Count-Down.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Miaosha',
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
    },
    type: {
      type: Number,
      default: 0
    },
    timestamp: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      miaoshaIndex: 0
    }
  },
  computed: {
    ...mapGetters(['userId'])
  }
}
</script>

<style module lang="scss">
  .miaosha {
    margin-top: 22px;
    border-radius: 20px;
    overflow: hidden;
    .time-list {
      padding: 32px 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      svg {
        width: 78px;
        height: 80px;
        color: #FFFFFF;
      }
      .border {
        width: 2px;
        height: 26px;
        background: #FFFFFF;
      }
      .btn {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        width: 40px;
        height: 106px;
        background: #C40B13;
        border: 2px solid #FFF;
        border-radius: 234px;
        > span {
          font-size: 20px;
          font-weight: bold;
          line-height: 22px;
          color: #FFF;
        }
      }
      &-item {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #FFFFFF;
        text-align: center;
        min-width: 144px;
        &.current {
          .status {
            font-size: 36px;
            font-family: Microsoft YaHei;
            font-weight: bold;
          }
          .time {
            background: #FFFFFF;
            color: #E0030C;
          }
        }
        .status {
          margin-bottom: 16px;
          font-size: 30px;
          font-weight: bold;
          line-height: 40px;
          text-shadow: 0px 4px 8px rgba(148, 7, 7, 0.40);
        }
        .time {
          box-sizing: border-box;
          display: inline-block;
          width: 120px;
          height: 40px;
          line-height: 36px;
          font-size: 30px;
          border: 2px solid #FFFFFF;
          box-shadow: 0px 4px 8px rgba(148, 7, 7, 0.4);
          border-radius: 198px;
          text-align: center;
        }
      }
    }
    .list {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &-item {
        display: flex;
        margin-bottom: 20px;
        padding: 16px;
        width: 100%;
        background-color: #FFF;
        border-radius: 20px;
        overflow: hidden;
        &:nth-last-of-type(1) {
          margin-bottom: 0;
        }
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
            background: rgba(0, 0, 0, 0.65);
            color: #FFF;
            padding: 8px 0;
          }
          .text {
            margin-right: 10px;
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
            &.disabled {
              background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
            }
            .qiang {
              width: 38px;
            }
            .jieshu {
              width: 48px;
              height: 22px;
            }
          }
        }
      }
    }
  }
</style>
