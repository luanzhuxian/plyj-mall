<template>
    <div :class="$style.pintuan">
        <div :class="$style.background">
            <div :class="$style.wrapper">
                <div :class="$style.navBar">
                    <router-link :class="$style.navLink" tag="div" :to="{ name: 'TuanList' }">
                        <span>查看更多</span>
                        <pl-svg name="icon-right" fill="#ccc" width="20" />
                    </router-link>
                </div>
                <ul :class="$style.list" v-if="data.values.length">
                    <template v-for="(item, i) of data.values">
                        <li
                            v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                            :class="{
                                [$style.listItem]: true,
                                [$style.large]: i === 0 || data.values.length % 2 === 0,
                                [$style.small]: i !== 0 && data.values.length % 2 === 1
                            }"
                            :key="i"
                            @click="$router.push({ name: 'Product', params: { productId: item.goodsInfo.id }, query: { currentProductStatus: 2 } })"
                        >
                            <div :class="$style.imgWrapper">
                                <img v-imgError :src="item.goodsInfo.productMainImage + '?x-oss-process=style/thum-middle'">
                                <div :class="$style.countdownWrapper" v-if="item.goodsInfo.activityInfo.preActivity && item.goodsInfo.activityInfo.preActivity !== 0">
                                    <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 0">距开始</span>
                                    <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 1">距结束</span>
                                    <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 2">已成功</span>
                                    <span :class="$style.text" v-if="item.goodsInfo.activityInfo.status === 3">已结束</span>
                                    <countdown
                                        :class="$style.countdown"
                                        v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                        :duration="getDuration(item.goodsInfo.activityInfo)"
                                        @finish="() => reset(item)"
                                    >
                                        <template v-slot="{time}">
                                            <i :class="$style.block">{{ String(time.days).padStart(2, '0') }}</i>
                                            <span :class="$style.colon">天</span>
                                            <i :class="$style.block">{{ String(time.hours).padStart(2, '0') }}</i>
                                            <span :class="$style.colon">:</span>
                                            <i :class="$style.block">{{ String(time.minutes).padStart(2, '0') }}</i>
                                            <span :class="$style.colon">:</span>
                                            <i :class="$style.block">{{ String(time.seconds).padStart(2, '0') }}</i>
                                        </template>
                                    </countdown>
                                </div>
                            </div>
                            <div :class="$style.info">
                                <div :class="$style.main">
                                    {{ item.goodsInfo.productName }}
                                </div>
                                <div :class="$style.time">
                                    <div :class="$style.timeLeft">
                                        <span v-if="item.goodsInfo.activityInfo.prizePool">
                                            成团瓜分
                                        </span>
                                        <span v-else>双十二有礼</span>
                                    </div>
                                    <div :class="$style.timeRight" v-if="item.goodsInfo.activityInfo.prizePool">
                                        {{ `${item.goodsInfo.activityInfo.prizePool || 0}元` }}
                                    </div>
                                </div>
                                <div :class="$style.sub">
                                    <div :class="$style.subLeft">
                                        <div :class="$style.subLeftMain">
                                            <span v-if="item.goodsInfo.activityInfo.status === 0">
                                                {{ `${item.goodsInfo.pageviews}人已关注` }}
                                            </span>
                                            <span v-else>
                                                {{ `已有${item.goodsInfo.activityInfo.number || 0}人参与` }}
                                            </span>
                                        </div>
                                        <div :class="$style.subLeftSub">
                                            <pl-svg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/olds/tuangoujia.png" width="80" height="35" />
                                            <span :class="$style.price">{{ item.goodsInfo.activityInfo.activityPrice }}</span>
                                        </div>
                                    </div>
                                    <div
                                        :class="{
                                            [$style.subRight]: true,
                                            [$style.disabled]: item.goodsInfo.activityInfo.status !== 1
                                        }"
                                    >
                                        <pl-svg
                                            v-if="~[0, 1].indexOf(item.goodsInfo.activityInfo.status)"
                                            name="icon-vie-for"
                                            width="40"
                                        />
                                        <pl-svg
                                            v-else
                                            name="icon-jieshu"
                                            width="40"
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Countdown from '../../../components/activity/Countdown.vue'
import { getDuration, reset } from '../helper.js'

export default {
    name: 'Pintuan',
    components: {
        Countdown
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
        getDuration,
        reset
    }
}
</script>

<style module lang="scss">
  .pintuan {
    margin-top: 32px;
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
        .countdown-wrapper {
          display: flex;
          justify-content: space-around;
          align-items: center;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 52px;
          font-size: 24px;
          background: rgba(0, 0, 0, 0.65);
          color: #FFF;
        }
        .countdown {
            display: inline-flex;
            justify-content: space-around;
            flex: 1;
        }
        .block {
            display: inline-block;
            box-sizing: border-box;
            padding: 0 4px;
            height: 36px;
            line-height: 36px;
            background: rgba(174, 174, 174, .64);
            border-radius: 4px;
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
        max-width: 100%;
        height: 34px;
        line-height: 35px;
        border: 2px solid #EC6BA4;
        border-radius: 4px;
        @include elps();
        &-left {
          padding: 6px;
          min-width: 105px;
          font-size: 24px;
          color: #FFF;
          background: #FF6767;
          overflow: hidden;
        }
        &-right {
          flex: 1;
          padding: 0 10px;
          font-size: 24px;
          font-family: San Francisco Display;
          background: #FFFF00;
          color: #DB4D7D;
          @include elps();
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
        }
      }
    }
  }
</style>
