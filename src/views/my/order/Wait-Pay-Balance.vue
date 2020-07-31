<template>
    <div :class="$style.waitPayBalance">
        <div :class="$style.list">
            <load-more
                ref="loadMore"
                :form="form"
                :loading.sync="loading"
                :request-methods="getOrderList"
                no-content-tip="您还没有相关订单~"
                @refresh="onRefresh"
                @more="onRefresh"
            >
                <template>
                    <router-link
                        tag="div"
                        v-for="(item, i) of orderList"
                        :key="i"
                        :to="{ name: 'OrderDetail', params: { orderId: item.orderId } }"
                    >
                        <WaitPayListItem
                            :index="i"
                            :order-id="item.orderId"
                            :order-type="item.orderType"
                            :order-status="item.orderStatus"
                            :goods-images="item.goodsImages"
                            :goods-name="item.goodsName"
                            :sku-name="item.skuName"
                            :sub-sku-name="item.subSkuName"
                            :unit-price="item.unitPrice"
                            :count="item.count"
                            :business-status="item.businessStatus"
                            :order-intention-amount="item.orderIntentionAmount"
                            :order-amount-tail-money="item.orderAmountTailMoney"
                            :is-start="item.isStart"
                            :past-due="item.pastDue"
                            :count-down="item.countDown"
                            :is-payloading="payloading && item.orderId === currentPayId"
                            @pay="pay"
                        />
                    </router-link>
                </template>
            </load-more>
        </div>
    </div>
</template>

<script>
import Countdown from '../../../assets/js/Countdown'
import moment from 'moment'
import LoadMore from '../../../components/common/Load-More.vue'
import WaitPayListItem from './components/Wait-Pay-List-Item'
import { getAwaitTailPayInfo, getOrderList } from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
export default {
    components: {
        LoadMore,
        WaitPayListItem
    },
    name: 'WaitPayBalance',
    data () {
        return {
            form: {
                current: 1,
                size: 10,
                orderStatus: 'WAIT_PAY_TAIL_MONEY'
            },
            getOrderList,
            loading: false,
            payloading: false,
            currentPayId: '',
            orderList: [],
            countdownInstances: []
        }
    },
    mounted () {
        this.$refresh = this.$refs.loadMore.refresh
    },
    activated () {
        this.$refresh()
    },
    deactivated () {
        this.clearCountdown()
    },
    methods: {
        onRefresh (list) {
            // 停止所有定时器
            this.clearCountdown()
            // 设置倒计时
            for (const [i, item] of list.entries()) {
                this.setTime(item, i)
            }
            this.orderList = list
        },
        setTime (item, index) {
            const { endTime: userEndTime, startTime: userStartTime, currentTime } = item
            const now = moment(currentTime).valueOf()
            const startTime = moment(userStartTime).valueOf()
            const endTime = moment(userEndTime).valueOf()
            // 是否开始付尾款
            item.isStart = now >= startTime
            item.pastDue = now >= endTime
            // 未开始支付
            if (!item.isStart) {
            // 可以开始支付了，倒计时支付
                this.countDown(startTime - now, index, item)
            } else if (!item.pastDue) {
            // 可以开始支付了，倒计时支付
                this.countDown(endTime - now, index, item)
            }
        },
        countDown (duration, index, item) {
            const countdownInstance = new Countdown(duration, data => {
                if (!data) {
                    // 倒计时结束，刷新数据
                    this.$refs.loadMore.refresh()
                    return
                }
                const d = String(data.days)
                const h = String(data.hours)
                const m = String(data.minutes)
                const s = String(data.seconds)
                item.countDown = {
                    d: d.padStart(2, '0'),
                    h: h.padStart(2, '0'),
                    m: m.padStart(2, '0'),
                    s: s.padStart(2, '0')
                }
                this.$set(this.orderList, index, item)
            })
            countdownInstance.start()
            this.countdownInstances.push(countdownInstance)
        },
        // 停止所有定时器
        clearCountdown () {
            for (const countdownInstances of this.countdownInstances) {
                countdownInstances.stop()
            }
            this.countdownInstances = []
        },
        // 去付尾款
        async pay (index) {
            try {
                this.payloading = true
                const { orderId, orderType } = this.orderList[index]
                this.currentPayId = orderId
                const { result } = await getAwaitTailPayInfo(orderId)
                // 调用微信支付api
                await wechatPay(result)
                const status = orderType === this.orderTypeKeyMap.PHYSICAL_GOODS ? 'WAIT_SHIP' : 'WAIT_RECEIVE'
                await this.$router.push({ name: 'Orders', params: { status } })
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
</style>
