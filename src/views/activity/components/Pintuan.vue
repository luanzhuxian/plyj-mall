<template>
  <div :class="$style.pintuan">
    <div :class="$style.background">
      <div :class="$style.wrapper">
        <div :class="$style.navBar">
          <router-link :class="$style.navLink" tag="div" :to="{ name: 'TuanList' }">
            <span>查看更多</span>
            <pl-icon name="icon-arrow-right" size="20" />
          </router-link>
        </div>
        <ul :class="$style.list" v-if="data.values.length">
          <li
            :class="{
              [$style.listItem]: true,
              [$style.large]: i === 0 || data.values.length % 2 === 0,
              [$style.small]: i !== 0 && data.values.length % 2 === 1
            }"
            v-for="(item, i) of data.values"
            :key="i"
            @click="$router.push({ name: 'Lesson', params: { productId: item.goodsInfo.id } })"
          >
            <div :class="$style.imgWrapper">
              <img :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-small'">
              <div :class="$style.countDown" v-if="item.goodsInfo.activityInfo && item.goodsInfo.activityInfo.preActivity && item.goodsInfo.activityInfo.preActivity !== 0">
                <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 0">距开始</span>
                <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 1">距结束</span>
                <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 2">已成功</span>
                <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 3">已结束</span>
                <count-down
                  v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                  :timestamp="getTime(item.goodsInfo.activityInfo)"
                  @done="() => reset(item)"
                />
              </div>
            </div>
            <div :class="$style.info">
              <div :class="$style.main">
                {{ item.goodsInfo.productName }}
              </div>
              <div :class="$style.time">
                <div :class="$style.timeLeft">
                  成团瓜分
                </div>
                <div :class="$style.timeRight">
                  {{ `${(item.goodsInfo.activityInfo && item.goodsInfo.activityInfo.prizePool) || 0}元` }}
                </div>
              </div>
              <div :class="$style.sub">
                <div :class="$style.subLeft">
                  <div :class="$style.subLeftMain">
                    <span v-if="item.goodsInfo.activityInfo && item.goodsInfo.activityInfo.status === 0">
                      {{ `${item.goodsInfo.pageviews}人已关注` }}
                    </span>
                    <span v-else>
                      {{ `已有${(item.goodsInfo.activityInfo && item.goodsInfo.activityInfo.number) || 0}人参与` }}
                    </span>
                  </div>
                  <div :class="$style.subLeftSub">
                    <pl-icon name="icon-tuangoujia" type="svg" />
                    <span :class="$style.price">{{ item.goodsInfo.activityInfo && item.goodsInfo.activityInfo.activityPrice }}</span>
                  </div>
                </div>
                <div
                  :class="{
                    [$style.subRight]: true,
                    [$style.disabled]: item.goodsInfo.activityInfo && item.goodsInfo.activityInfo.status !== 1
                  }"
                >
                  <pl-icon
                    name="icon-qiang"
                    type="svg"
                    :class="$style.qiang"
                    v-if="item.goodsInfo.activityInfo && ~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                  />
                  <pl-icon
                    name="icon-jieshu"
                    type="svg"
                    :class="$style.finish"
                    v-else
                  />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '../mixin.js'
import CountDown from './Count-Down.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Pintuan',
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
  computed: {
    ...mapGetters(['userId'])
  }
}
</script>

<style module lang="scss">
  .pintuan {
    margin-top: 32px;
    // background: linear-gradient(180deg, #F2BAA7 0%, #D95F02 12%, #E48F4C 100%);
    background: #e48f4c;
    border-radius: 20px;
    overflow: hidden;
    .background {
      background: url("http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/activity/bg-pintuan.jpg") no-repeat center top;
      background-size: 100% auto;
    }
    .wrapper {
      padding: 0 20px 28px;
    }
    .nav-bar {
      padding: 42px 0 46px;
      display: flex;
      justify-content: flex-end;
    }
    .nav-link {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 184px;
      height: 52px;
      line-height: 52px;
      text-align: center;
      background: #FFF;
      border-radius: 292px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 800;
      color: #F3631A;
      i {
        margin-left: 8px;
        font-weight: bold;
      }
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .list-item {
      display: flex;
      margin-bottom: 20px;
      background-color: #FFF;
      border-radius: 20px;
      overflow: hidden;
      &.large {
        padding: 16px;
        width: 100%;
        .img-wrapper {
          margin-right: 16px;
          width: 280px;
          height: 188px;
        }
        .info {
          flex: 1;
          width: 0;
          .sub {
            &-left {
              &-main {
                font-size: 24px;
              }
              &-sub {
                svg {
                  width: 88px;
                  height: 40px;
                  padding-bottom: 2px;
                }
                .price {
                  font-size: 36px;
                  &:before {
                    content: '￥';
                    font-size: 24px;
                  }
                }
              }
            }
            &-right {
              width: 72px;
              height: 72px;
               .qiang {
                width: 40px;
              }
            }
          }
        }
      }
      &.small {
        flex-direction: column;
        width: 320px;
        .img-wrapper {
          height: 214px;
        }
        .info {
          padding: 16px;
          .sub {
            &-left {
              &-main {
                font-size: 20px;
              }
              &-sub {
                svg {
                  width: 72px;
                  height: 32px;
                  padding-bottom: 2px;
                }
                .price {
                  font-size: 32px;
                  &:before {
                    content: '￥';
                    font-size: 20px;
                  }
                }
              }
            }
            &-right {
              width: 58px;
              height: 58px;
              .qiang {
                width: 32px;
              }
            }
          }
        }
      }
      .img-wrapper {
        position: relative;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .count-down {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          line-height: 36px;
          font-size: 24px;
          background: rgba(0, 0, 0, 0.65);
          color: #FFF;
          padding: 8px 0;
        }
        .text {
          margin-right: 10px;
        }
      }
      .info {
        flex: 1;
        display: flex;
        justify-content: center;
        flex-direction: column;
        position: relative;
      }
      .main {
        margin-bottom: 8px;
        font-size: 28px;
        font-weight: bold;
        line-height: 32px;
        color: #000000;
        @include elps();
      }
      .time {
        display: inline-flex;
        align-items: center;
        text-align: center;
        margin-bottom: 18px;
        width: fit-content;
        height: 34px;
        line-height: 34px;
        border: 2px solid #EC6BA4;
        border-radius: 4px;
        @include elps();
        &-left {
          width: 116px;
          font-size: 24px;
          color: #FFF;
          background: #FF6767;
          overflow: hidden;
        }
        &-right {
          flex: 1;
          // width: 0;
          @include elps();
          padding: 0 10px;
          font-size: 24px;
          font-family: San Francisco Display;
          background: #FFFF00;
          color: #DB4D7D;
        }
      }
      .sub {
        display: flex;
        align-items: flex-end;
        &-left {
          flex: 1;
          width: 0;
          &-main {
            font-weight: bold;
            height: 36px;
            line-height: 36px;
            color: #999999;
            @include elps();
          }
          &-sub {
            display: flex;
            align-items: flex-end;
            color: #FE3C5E;
            @include elps();
            .price {
              flex: 1;
              width: 0;
              margin-left: 4px;
              font-family: San Francisco Display;
              font-weight: bold;
              @include elps();
              &:before {
                content: '￥';
                font-family: Microsoft YaHei;
                font-weight: bold;
              }
            }
          }
        }
        &-right {
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(231deg, rgba( 238, 144, 111, 1) 0%, rgba(233, 70, 115, 1) 100%);
          border-radius: 50%;
          overflow: hidden;
          color: #ffffff;
          &.disabled {
            background: linear-gradient(231deg, rgba(204, 204, 204, 1) 0%, rgba(153, 153, 153, 1) 100%);
          }
          .finish {
            width: 40px;
          }
        }
      }
    }
  }
</style>
