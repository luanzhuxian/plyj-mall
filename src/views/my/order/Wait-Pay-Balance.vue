<template>
  <div :class="$style.waitPayBalance">
    <div :class="$style.list">
      <load-more
        ref="loadMore"
        :form="form"
        :loading.sync="loading"
        :request-methods="waitPayBalance"
        no-content-tip="您还没有相关订单~"
        @refresh="onRefresh"
        @more="onRefresh"
      >
        <template>
          <div
            :class="$style.listItem"
            tag="div"
            v-for="(item, i) of orderList"
            :key="i"
            @click="$router.push({ name: 'OrderDetail', params: { orderId: item.orderId } })"
          >
            <div>
              <div :class="$style.listItemLeft">
                <span :class="$style.tag">
                  预购
                </span>
                <pl-list
                  title="订单编号："
                  :content="item.orderId"
                />
              </div>
              <p :class="$style.status">
                待使用
              </p>
            </div>
            <order-item
              :img="item.productMainImage + '?x-oss-process=style/thum'"
              :name="item.productName"
              :option="item.skuName2 ? `${item.skuName},${item.skuName2}` : item.skuName"
              :count="item.count"
              :price="item.productPrice"
              :status="refundStatusMap[item.afterSalesStatus]"
              border
            />
            <div :class="$style.listItemBottom">
              <div :class="$style.priceWrapper">
                <span :class="$style.totalCount">共{{ item.count }}件商品</span>
                <span :class="$style.bold">定金：</span>
                <span :class="$style.price">{{ item.price }}</span>
              </div>
              <div :class="$style.priceWrapper">
                <span :class="$style.bold">待付尾款：</span>
                <span :class="$style.price">{{ item.prePayOrderPrice }}</span>
              </div>
              <div :class="$style.buttons">
                <div :class="$style.time">
                  <template v-if="!item.pastDue">
                    <span v-show="item.isStart">剩余尾款支付时间：</span>
                    <span v-show="!item.isStart">距离开始支付时间：</span>
                    <span v-show="item.d !== '00'">{{ item.d }}天</span>
                    <span v-show="item.h !== '00'">{{ item.h }}时</span>
                    <span>{{ item.m }}分</span>
                    <span>{{ item.s }}秒</span>
                  </template>
                  <!--<span v-if="!item.isStart">
                    未开始支付
                  </span>
                  <span v-if="item.pastDue">
                    已过期
                  </span>-->
                </div>
                <pl-button
                  v-if="!item.pastDue && item.status !== 'WAIT_PAY'"
                  type="warning"
                  round
                  :disabled="!item.isStart"
                  @click.stop="$router.push({ name: 'OrderDetail', params: { orderId: item.orderId } })"
                >
                  去使用
                </pl-button>
                <pl-button
                  v-if="item.status === 'WAIT_PAY'"
                  type="warning"
                  round
                  :disabled="!item.isStart || item.pastDue"
                  :loading="payloading && item.orderId === currentPayId"
                  @click.stop="balancePayment(item)"
                >
                  {{ item.pastDue ? '已过期' : item.isStart ? '去付尾款' : '未开始支付' }}
                </pl-button>
              </div>
            </div>
          </div>
        </template>
      </load-more>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import OrderItem from '../../../components/item/Order-Item.vue'
import LoadMore from '../../../components/common/Load-More.vue'
import {
  waitPayBalance,
  getWaitPayBalanceInfo
} from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
import { Countdown } from '../../../assets/js/util'
import moment from 'moment'
const countdownInstanceList = []
export default {
  components: {
    OrderItem,
    LoadMore
  },
  name: 'WaitPayBalance',
  data () {
    return {
      orderList: [],
      waitPayBalance,
      loading: false,
      currentPayId: '',
      payloading: false,
      form: {
        current: 1,
        size: 10
      },
      refundStatusMap: {
        '1': '退款中',
        '2': '退款成功',
        '3': '退款驳回',
        '4': '退款中', //  退换货-已退货
        '5': '待退货', //  退换货-待退货
        '9': '退款中'
      },
      timerList: []
    }
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    this.$refresh()
  },
  deactivated () {
    countdownInstanceList.map(item => {
      if ('stop' in item) {
        item.stop()
      }
    })
  },
  methods: {
    onRefresh (list, total) {
      clearTimeout(this.timer)
      for (let [i, item] of list.entries()) {
        item.d = '00'
        item.h = '00'
        item.m = '00'
        item.s = '00'
        item.pastDue = false
        let {
          userEndTime,
          userStartTime,
          currentTime
        } = item
        const NOW = Number(currentTime)
        const UserStartTime = moment(userStartTime).valueOf()
        const UserEndTime = moment(userEndTime).valueOf()

        // 是否开始付尾款
        item.isStart = NOW - UserStartTime >= 0
        item.pastDue = NOW - UserEndTime >= 0
        // 未开始支付
        if (!item.isStart) {
          // 可以开始支付了，倒计时支付
          this.countDown(UserStartTime - NOW, i, item)
        } else if (!item.pastDue) {
          // 可以开始支付了，倒计时支付
          this.countDown(UserEndTime - NOW, i, item)
        }
      }
      this.orderList = list
    },
    countDown (duration, index, item) {
      const countdownInstance = new Countdown(duration, data => {
        if (!data) {
          // 倒计时结束，刷新数据
          this.$refs.loadMore.refresh()
          return
        }
        let d = String(data.months * moment().daysInMonth() + data.days)
        let h = String(data.hours)
        let m = String(data.minutes)
        let s = String(data.seconds)
        item.d = d.padStart(2, '0')
        item.h = h.padStart(2, '0')
        item.m = m.padStart(2, '0')
        item.s = s.padStart(2, '0')
        this.$set(this.orderList, index, item)
      })
      countdownInstance.start()
      countdownInstanceList.push(countdownInstance)
    },
    // 去付尾款
    async balancePayment (item) {
      this.currentPayId = item.orderId
      this.payloading = true
      const orderType = item.orderType
      try {
        const { result } = await getWaitPayBalanceInfo(item.orderId)
        // 调用微信支付api
        await wechatPay(result)
        if (orderType === 'PHYSICAL') {
          await this.$router.push({
            name: 'Orders',
            params: {
              status: 'WAIT_SHIP'
            }
          })
        } else {
          await this.$router.push({
            name: 'Orders',
            params: {
              status: 'WAIT_RECEIVE'
            }
          })
        }
      } catch (e) {
        throw e
      } finally {
        this.payloading = false
      }
    }
  }
}
</script>

<style module lang="scss">
  .list {
    padding: 22px 24px 120px;
  }
  .list-item {
    margin-bottom: 20px;
    padding: 0 24px 28px;
    border-radius: 20px;
    background-color: #fff;
    > div {
      &:nth-of-type(1) {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 22px 0 36px;
      }
    }
    .status {
      color: $--primary-color;
      font-size: 24px;
      line-height: 34px;
    }
  }
  .list-item-bottom {
    margin-top: 16px;
    > div {
      display: flex;
      justify-content: flex-end;
      align-items: baseline;
    }
    .price-wrapper {
      display: flex;
      align-items: center;
    }
    .total-count {
      font-size: 20px;
      font-family: MicrosoftYaHeiUI;
      color: #999999;
      margin-right: 12px;
    }
    .bold {
      font-size: 30px;
      font-weight: bold;
      color: #333333;
    }
    .price {
      align-self: flex-end;
      font-size: 32px;
      color: #FE7700;
      &:before {
        // margin-right: 10px;
        padding-bottom: 4px;
        font-size: 20px;
        content: '¥';
      }
    }
    .buttons {
      margin-top: 24px;
      > button {
        margin-left: 24px;
      }
    }
  }
  .list-item-left {
    display: inline-flex;
    align-items: center;
    .tag {
      width: 104px;
      height: 28px;
      background: #F2B036;
      border-radius: 14px;
      font-size: 20px;
      color: #FFFFFF;
      line-height: 28px;
      margin-right: 12px;
      text-align: center;
    }
  }
  .time {
    font-size: 24px;
    color: #999;
  }
</style>
