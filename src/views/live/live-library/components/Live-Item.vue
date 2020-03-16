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
                <div :class="$style.price">
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
                <!-- 不需要口令 -->
                <div v-if="!item.isHaveToken" :class="$style.watch">
                    看回放
                </div>
                <template v-else>
                    <!-- 已输入过口令 -->
                    <div v-if="item.isInputToken" :class="{ [$style.watch]: true, [$style.unlock]: true }">
                        <PlSvg name="icon-unlock-e90e1" width="24" height="24" />
                        <span>回放</span>
                    </div>
                    <!-- 未输入口令 -->
                    <div v-else :class="{ [$style.watch]: true, [$style.lock]: true }">
                        <PlSvg name="icon-lock-896ad" width="24" height="24" />
                        <span>回放</span>
                    </div>
                </template>
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
                    // 直播名
                    activityName: '',
                    // 直播时间
                    startTime: '',
                    // 是否需要付费   1需要  0不需要
                    needPay: 0,
                    // 已支付金额，单位分， 0 代表用户未付费
                    paidAmount: 0,
                    // 需要支付金额，单位分
                    needPaidAmount: ''
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
                    activityId: item.activityId,
                    isValidateEndTime: '1'
                }
            })
        }
    }
}
</script>

<style module lang="scss">

  .live-item {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    padding: 0 24px 24px 24px;
    background: #FFFFFF;
    > .img {
      position: relative;
      width: 280px;
      height: 186px;
      border-radius: 20px;
      overflow: hidden;
      > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
      > div {
        position: absolute;
        top: 0;
        left: 0;
        width: 120px;
        border-radius: 20px 0px;
        font-size: 22px;
        line-height: 46px;
        text-align: center;
        color: #FFFFFF;
        background: #F2B036;
      }
    }
    > .description {
      display: flex;
      flex-wrap: wrap;
      width: calc(100% - 304px);
      align-content: space-between;
      > .title {
        width: 100%;
        color: #666666;
        font-size: 24px;
        > div:nth-of-type(1) {
          margin-bottom: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 32px;
          font-weight: 800;
          color: #373737;
        }
      }
      > .content {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        > .price {
          font-size: 24px;
        }
        > .watch {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 26px;
          text-align: center;
          background-color: #F2B036;
          color: #FFFFFF;
          width: 124px;
          line-height: 48px;
          border-radius:8px;
          > span {
            margin-left: 8px;
          }
        }
        > .unlock {
          background-color: #FE7700;
        }
        > .lock {
          background-color: #FE7700;
        }
      }
    }
  }

</style>
