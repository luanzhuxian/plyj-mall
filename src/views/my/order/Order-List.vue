<template>
    <div :class="$style.orderList">
        <pl-tab
            size="small"
            :class="$style.tabBar"
            :tabs="tabs"
            :active-id.sync="form.orderStatus"
            @change="onTabChange"
        >
            <div
                :class="$style.tabPane"
                v-for="(item, i) of tabs"
                :key="i"
                :slot="'tab-pane-' + i"
            />
        </pl-tab>
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
                <template v-slot="{ list }">
                    <router-link
                        tag="div"
                        v-for="(item, i) of orderList"
                        :key="i"
                        :to="{ name: 'OrderDetail', params: { orderId: item.orderId } }"
                    >
                        <OrderListItem
                            :detail="item"
                            :index="i"
                            v-bind="item"
                            :is-payloading="payloading && currentPayId === item.orderId"
                            @cancelOrder="cancelOrder"
                            @pay="pay"
                            @balancePayment="balancePayment"
                            @deleteOrder="deleteOrder"
                            @confirmReceipt="confirmReceipt"
                        />
                    </router-link>
                </template>
            </load-more>
        </div>
        <pl-picker
            :show.sync="isPickerShow"
            :slots="pickerColumns"
            @confirm="(selected) => { resolve(selected[0]) }"
            @close="reject(false)"
        />
    </div>
</template>

<script>
import LoadMore from '../../../components/common/Load-More.vue'
import {
    getOrderList,
    getAwaitPayInfo,
    confirmReceipt,
    cancelOrder,
    deleteOrder,
    getWaitPayBalanceInfo
} from '../../../apis/order-manager'
import { mapGetters } from 'vuex'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
import moment from 'moment'
import Countdown from '../../../assets/js/Countdown'
import OrderListItem from './components/Order-List-Item'

export default {
    name: 'OrderList',
    components: {
        LoadMore,
        OrderListItem
    },
    props: {
        status: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['skuSourceKeyMap', 'orderTypeMap', 'orderTypeKeyMap', 'orderStatuskeyMap'])
    },
    data () {
        return {
            tabs: [
                { name: '全部', id: '' },
                { name: '待付款', id: 'WAIT_PAY' },
                { name: '待发货', id: 'WAIT_SHIP' },
                { name: '待收货', id: 'WAIT_RECEIVE' },
                { name: '待评价', id: 'FINISHED' }
            ],
            orderList: [],
            // 倒计时实例列表
            countdownInstances: [],
            // 记录订单总数
            total: 0,
            form: {
                current: 1,
                size: 10,
                orderStatus: ''
            },
            getOrderList,
            $refresh: null,
            loading: false,
            payloading: false,
            // 当前正在支付的订单id
            currentPayId: '',
            isPickerShow: false,
            pickerColumns: [
                {
                    flex: 1,
                    values: ['不想买了', '信息填写错误，重新拍', '线下自提', '其他原因'],
                    textAlign: 'center'
                }
            ]
        }
    },
    beforeRouteEnter (to, from, next) {
        to.meta.noRefresh = from.name === 'OrderDetail' || from.name === 'Freight'
        next()
    },
    mounted () {
        this.$refresh = this.$refs.loadMore.refresh
    },
    activated () {
        const handler = action => {
            if (action === 'pay') {
                return (order, index) => {
                    if (!this.status) {
                        order.orderStatus = order.orderType === this.orderTypeKeyMap.PHYSICAL_GOODS ? 'WAIT_SHIP' : 'WAIT_RECEIVE'
                    } else if (this.status === 'WAIT_PAY') {
                        this.orderList.splice(index, 1)
                    }
                }
            }
            if (action === 'receive') {
                return (order, index) => {
                    if (!this.status) {
                        order.orderStatus = this.orderStatuskeyMap.FINISHED
                    } else if (this.status === 'WAIT_RECEIVE') {
                        this.orderList.splice(index, 1)
                    }
                }
            }
            if (action === 'cancel') {
                return (order, index) => {
                    if (!this.status) {
                        order.orderStatus = 'CLOSED'
                    } else if (this.status === 'WAIT_PAY') {
                        const isCombinedOrder = [this.skuSourceKeyMap.SPRINGPLOUGHING, this.skuSourceKeyMap.COURSEPACKAGE](order.activeProduct)
                        if (isCombinedOrder) {
                            this.$refresh()
                        } else {
                            this.orderList.splice(index, 1)
                        }
                    }
                }
            }
            if (action === 'delete') {
                return (order, index) => {
                    this.orderList.splice(index, 1)
                }
            }
            if (action === 'comment') {
                return (order, index, pid) => {
                    const product = order.products.find(prod => prod.productId === pid)
                    if (!product) return
                    // 商品评价状态改为已评价
                    product.assessmentStatus = 1
                    // 根据所有商品的评价状态重新设置订单的评价状态，0：有商品待评价 1：所有商品已评价
                    order.commentStatus = !order.products.some(prod => prod.assessmentStatus !== 1)
                    if (this.status === 'FINISHED' && order.commentStatus) {
                        this.orderList.splice(index, 1)
                    }
                }
            }
        }

        if (this.orderList.length && this.$router.currentRoute.meta.noRefresh) {
            const arr = JSON.parse(localStorage.getItem('UPDATE_ORDER_LIST') || '[]')
            if (!arr.length) return

            for (const item of arr) {
                const index = this.orderList.findIndex(order => order.id === item.id)
                if (index === -1) continue
                handler(item.action)(this.orderList[index], index, item.pid)
            }
            localStorage.removeItem('UPDATE_ORDER_LIST')
            this.orderList.length ? this.$forceUpdate() : this.$refresh()
            return
        }

        this.form.orderStatus = this.status
        this.$refresh()
    },
    deactivated () {
        this.clearCountdown()
    },
    methods: {
        onTabChange (item) {
            this.$nextTick(() => {
                this.$router.replace({ name: 'Orders', params: { status: item.id || '' } })
                this.$refresh()
            })
        },
        showPicker () {
            return new Promise((resolve, reject) => {
                this.isPickerShow = true
                this.resolve = resolve
                this.reject = reject
            })
        },
        onRefresh (list, total) {
            this.clearCountdown()
            for (const [i, item] of list.entries()) {
                item.amount = Number(item.amount.toFixed(2))
                this.setCountDown(item, i)
            }
            this.orderList = list
            this.total = total
        },
        // 待支付订单，支付时间倒计时
        setCountDown (item, i) {
            // 是否开始付尾款
            const now = moment(item.currentTime).valueOf()
            const useStartTime = moment(item.startTime).valueOf()
            const useEndTime = moment(item.endTime).valueOf()
            item.isStart = now >= useStartTime
            item.pastDue = now >= useEndTime
            if (!item.isStart) {
                // 可以开始支付了，倒计时支付
                this.countDown(useStartTime - now, i, item)
            } else if (!item.pastDue) {
                // 可以开始支付了，倒计时支付
                this.countDown(useEndTime - now, i, item)
            }
        },

        /**
         * 开始每条订单的倒计时
         * @param duration {Number}
         * @param index {Number} 订单下标
         * @param item {Object} 订单数据，用于绑定倒计时数据
         */
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
            // 存储所有计时器实例，退出页面后清除这样计时器
            this.countdownInstances.push(countdownInstance)
        },

        // 停止所有定时器
        clearCountdown () {
            for (const countdownInstances of this.countdownInstances) {
                countdownInstances.stop()
            }
            this.countdownInstances = []
        },
        async pay (index) {
            const detail = this.orderList[index]
            const orderId = detail.orderId
            const orderType = detail.orderType
            this.payloading = true
            this.currentPayId = orderId
            try {
                const { result } = await getAwaitPayInfo(orderId)
                // 调用微信支付api
                await wechatPay(result)
                const next_order_status = orderType === this.orderTypeKeyMap.PHYSICAL_GOODS ? 'WAIT_SHIP' : 'WAIT_RECEIVE'
                this.form.orderStatus = next_order_status
                this.onTabChange({
                    name: next_order_status === 'WAIT_SHIP' ? '待发货' : '待收货',
                    id: next_order_status
                })
            } catch (e) {
                throw e
            } finally {
                this.payloading = false
            }
        },

        // 去付尾款
        async balancePayment (index) {
            const detail = this.orderList[index]
            const orderId = detail.orderId
            const orderType = detail.orderType
            this.currentPayId = orderId
            this.payloading = true
            try {
                const { result } = await getWaitPayBalanceInfo(orderId)

                // 调用微信支付api
                await wechatPay(result)
                const next_order_status = orderType === this.orderTypeKeyMap.PHYSICAL_GOODS ? 'WAIT_SHIP' : 'WAIT_RECEIVE'
                this.form.orderStatus = next_order_status
                this.onTabChange({
                    name: next_order_status === 'WAIT_SHIP' ? '待发货' : '待收货',
                    id: next_order_status
                })
            } catch (e) {
                throw e
            } finally {
                this.payloading = false
            }
        },
        async confirmReceipt (index) {
            const detail = this.orderList[index]
            const orderId = detail.orderId
            const { orderStatus } = this.form
            try {
                await this.$confirm('您确定收货吗？')
                await confirmReceipt(orderId)
                this.$success('确认收货成功')
                orderStatus === '' ? detail.orderStatus = this.orderStatuskeyMap.FINISHED : this.orderList.splice(index, 1)
                setTimeout(() => {
                    this.$router.push({ name: 'OrderComplete', params: { orderId } })
                }, 2000)
            } catch (e) {
                throw e
            }
        },
        async cancelOrder (index) {
            const detail = this.orderList[index]
            const orderId = detail.orderId
            const { orderStatus } = this.form

            // 5春耘订单 6组合课订单
            const isCombinedOrder = [5, 6].includes(detail.skuSource)
            try {
                const reason = await this.showPicker()
                await this.$confirm(isCombinedOrder ? `是否取消该订单，取消后组合订单将同步取消？` : '订单一旦取消，将无法恢复 确认要取消订单？')
                await cancelOrder(orderId, reason)
                this.$success('交易关闭')
                if (orderStatus === '') {
                    // 全部订单时手动修改订单状态
                    detail.orderStatus = this.orderStatuskeyMap.CLOSED
                } else {
                    // 取消组合订单中的所有相关订单，干脆直接刷新页面
                    isCombinedOrder ? this.$refresh() : this.orderList.splice(index, 1)
                }
            } catch (e) {
                throw e
            }
        },
        // 删除订单
        async deleteOrder (index) {
            const detail = this.orderList[index]
            const orderId = detail.orderId
            try {
                await this.$confirm('是否删除当前订单？ 删除后不可找回')
                await deleteOrder(orderId)
                this.orderList.splice(index, 1)

                --this.total
                // 若实际订单总数大于当前页面订单总数时，去请求数据
                if (this.total > this.orderList.length) {
                    const { result } = await this.getOrderList(this.form)
                    const currentLastOrder = result.records[result.records.length - 1]
                    // 因删除过订单后offsetHeight不足初始获取的值，无法在加载更多，将删除留下的空位填充用currentPage的最后一个数据
                    if (currentLastOrder) {
                        currentLastOrder.amount = currentLastOrder.amount.toFixed(2)
                        this.orderList.push(currentLastOrder)
                    }
                }

                // 删除到当前页面不足三个订单时，手动刷新订单列表
                if (this.orderList.length === 3) {
                    this.form.current = 1
                    this.$refresh()
                }
                this.$forceUpdate()
                this.$success('删除成功')
            } catch (e) {
                throw e
            }
        }
    }
}
</script>
<style module lang="scss">
  .order-list {
    padding-top: 80px;
  }
  .tab-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2999;
  }
  .tab-pane {
    position: absolute;
    top: 5px;
    right: -45px;
    width: 56px;
    height: 56px;
    line-height: 54px;
    font-size: 28px;
    transform: scale(.5);
    transform-origin: 0 0;
    color: #fff;
  }
  .list {
    padding: 22px 24px 120px;
  }

</style>
