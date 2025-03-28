<template>
    <div :class="$style.orderList">
        <PlTab
            size="small"
            :class="$style.tabBar"
            :tabs="tabs"
            :active-id.sync="status"
            @change="onTabChange"
        >
            <div
                :class="$style.tabPane"
                v-for="(item, i) of tabs"
                :key="i"
                :slot="'tab-pane-' + i"
            />
        </PlTab>
        <div :class="$style.list">
            <LoadMore
                ref="loadMore"
                :form="form"
                :loading.sync="loading"
                :request-methods="requestMethods"
                no-content-tip="您还没有相关订单~"
                @refresh="onRefresh"
                @more="onRefresh"
            >
                <template v-slot="{ list }">
                    <router-link
                        tag="div"
                        v-for="(item, i) of orderList"
                        :key="item.orderId"
                        :to="{ name: item.orderType === 'RED_ENVELOPE' ? 'RedPacketOrderDetail' : 'OrderDetail', params: { orderId: item.orderId } }"
                    >
                        <OrderListItem
                            :index="i"
                            v-bind="item"
                            :is-payloading="payloading && currentPayId === item.orderId"
                            @cancelOrder="cancelOrder"
                            @pay="pay"
                            @deleteOrder="deleteOrder"
                            @confirmReceipt="confirmReceipt"
                        />
                    </router-link>
                </template>
            </LoadMore>
        </div>
        <PlPicker
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
    getWaitCommentOrderList,
    getAwaitPayInfo,
    getAwaitTailPayInfo,
    confirmReceipt,
    cancelOrder,
    deleteOrder
} from '../../../apis/order-manager'
import { mapGetters, mapMutations } from 'vuex'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
import moment from 'moment'
import Countdown from '../../../assets/js/Countdown'
import OrderListItem from '../../../components/my/order/Order-List-Item'

export default {
    name: 'OrderList',
    components: {
        LoadMore,
        OrderListItem
    },
    computed: {
        ...mapGetters(['skuSourceKeyMap', 'orderTypeMap', 'orderTypeKeyMap', 'orderStatuskeyMap', 'orderOperatedList', 'orderActionMap'])
    },
    data () {
        return {
            status: 'ALL_ORDER',
            tabs: [
                { name: '全部', id: 'ALL_ORDER' },
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
            $refresh: null,
            loading: false,
            // 是否正在取消
            cancelling: false,
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
    beforeRouteLeave (to, from, next) {
        // 因为这两个页面，不会重新刷新订单列表页面，所以倒计时不清除
        if (to.name !== 'OrderDetail' && to.name !== 'Freight') {
            this.clearCountdown()
        }
        next()
    },
    mounted () {
        this.$refresh = this.$refs.loadMore.refresh
    },
    activated () {
        this.status = this.$route.params.status || 'ALL_ORDER'
        this.form.orderStatus = this.status === 'ALL_ORDER' ? '' : this.status
        // 从 订单详情/物流 来的，需原地刷新页面
        if (this.orderList.length && this.$router.currentRoute.meta.noRefresh) {
            if (!this.orderOperatedList.length) return
            this.handleCurrentOrder(this.orderOperatedList)
            return
        }
        this.$refresh()
    },
    methods: {
        ...mapMutations(['clearOrderOperatedList']),
        requestMethods: getOrderList,
        onTabChange (item) {
            this.form.orderStatus = item.id === 'ALL_ORDER' ? '' : item.id
            // 订单列表 待评价接口 与 其他状态接口不同
            this.requestMethods = this.form.orderStatus === 'FINISHED' ? getWaitCommentOrderList : getOrderList
            this.$nextTick(() => {
                this.$router.replace({ name: 'Orders', params: { status: item.id } })
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
        handleCurrentOrder (arr) {
            const handler = action => {
                // 上个页面有 支付 操作
                if (action === this.orderActionMap.pay) {
                    return (order, index) => {
                        if (this.status !== 'ALL_ORDER') {
                            order.orderStatus = order.orderType === this.orderTypeKeyMap.PHYSICAL_GOODS ? 'WAIT_SHIP' : 'WAIT_RECEIVE'
                        }
                        if (this.status === 'WAIT_PAY') {
                            this.orderList.splice(index, 1)
                        }
                    }
                }
                // 上个页面有 确认收货 操作
                if (action === this.orderActionMap.receive) {
                    return (order, index) => {
                        if (this.status !== 'ALL_ORDER') {
                            order.orderStatus = this.orderStatuskeyMap.FINISHED
                        }
                        if (this.status === 'WAIT_RECEIVE') {
                            this.orderList.splice(index, 1)
                        }
                    }
                }
                // 上个页面有 取消订单 操作
                if (action === this.orderActionMap.cancel) {
                    return (order, index) => {
                        if (this.status !== 'ALL_ORDER') {
                            order.orderStatus = this.orderStatuskeyMap.CLOSED
                        }
                        if (this.status === 'WAIT_PAY') {
                            // 5-春耘计划 + 6-组合聚惠学 取消订单后，会同步取消掉统一批次下的所有订单，所以重新刷新页面
                            const isCombinedOrder = [5, 6].includes(order.skuSource)
                            isCombinedOrder ? this.$refresh() : this.orderList.splice(index, 1)
                        }
                    }
                }
                // 上个页面有 删除订单 操作
                if (action === this.orderActionMap.delete) {
                    return (order, index) => {
                        this.orderList.splice(index, 1)
                    }
                }
                // 上个页面有 评论订单 操作
                if (action === this.orderActionMap.comment) {
                    return (order, index) => {
                        // 当前订单的评论状态变为已评论
                        order.commentStatus = 1
                        if (this.status === 'FINISHED' && order.commentStatus) {
                            this.orderList.splice(index, 1)
                        }
                    }
                }
            }
            for (const item of arr) {
                const index = this.orderList.findIndex(order => order.orderId === item.id)
                if (index === -1) continue
                handler(item.action)(this.orderList[index], index)
            }
            this.$store.commit('clearOrderOperatedList')
            this.orderList.length ? this.$forceUpdate() : this.$refresh()
        },
        onRefresh (list, total) {
            this.clearCountdown()
            for (const item of list) {
                this.setCountDown(item)
            }
            this.orderList = list
            this.total = total
        },
        // 待支付订单，支付时间倒计时
        setCountDown (item) {
            const now = moment(item.currentTime).valueOf()
            const useStartTime = moment(item.startTime).valueOf()
            const useEndTime = moment(item.endTime).valueOf()
            item.isStart = now >= useStartTime
            item.pastDue = now >= useEndTime
            if (!item.isStart) {
                // 可以开始支付了，倒计时支付
                this.countDown(useStartTime - now, item)
            } else if (!item.pastDue) {
                // 可以开始支付了，倒计时支付
                this.countDown(useEndTime - now, item)
            }
        },

        /**
         * 开始每条订单的倒计时
         * @param duration {Number}
         * @param item {Object} 订单数据，用于绑定倒计时数据
         */
        countDown (duration, item) {
            const countdownInstance = new Countdown(duration, data => {
                if (!data) {
                    // 倒计时结束，刷新数据
                    this.$refresh()
                    return
                }
                const d = String(data.days)
                const h = String(data.hours)
                const m = String(data.minutes)
                const s = String(data.seconds)
                item.d = d.padStart(2, '0')
                item.h = h.padStart(2, '0')
                item.m = m.padStart(2, '0')
                item.s = s.padStart(2, '0')
                // 解决无法直接更新dom问题
                const index = this.orderList.findIndex(detail => detail.orderId === item.orderId)
                if (index !== -1) {
                    this.orderList.splice(index, 1, item)
                }
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
        // 付款 + 付尾款
        async pay (index) {
            try {
                this.payloading = true
                const detail = this.orderList[index]
                const orderId = detail.orderId
                const orderType = detail.orderType
                const orderStatus = detail.orderStatus
                this.currentPayId = orderId
                let result
                // 正常二次支付
                if (orderStatus === this.orderStatuskeyMap.WAIT_PAY) {
                    const { result: data } = await getAwaitPayInfo(orderId)
                    result = data
                }
                // 支付尾款
                if (orderStatus === this.orderStatuskeyMap.WAIT_PAY_TAIL_MONEY) {
                    const { result: data } = await getAwaitTailPayInfo(orderId)
                    result = data
                }
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
        // 确认收货
        async confirmReceipt (index) {
            try {
                const detail = this.orderList[index]
                const orderId = detail.orderId
                const { orderStatus } = this.form
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
            try {
                if (this.cancelling) return
                // 取消订单时，会弹出一个选择原因弹框，当前页面仅可产生或者即将产生一个
                this.cancelling = true
                const detail = this.orderList[index]
                // 5春耘订单 6组合课订单
                const isCombinedOrder = [5, 6].includes(detail.skuSource)
                const reason = await this.showPicker()
                await this.$confirm(isCombinedOrder ? `是否取消该订单，取消后组合订单将同步取消？` : '订单一旦取消，将无法恢复 确认要取消订单？')
                await cancelOrder(detail.orderId, reason)
                this.$success('交易关闭')
                if (!this.form.orderStatus) {
                    // 全部订单时手动修改订单状态
                    detail.orderStatus = this.orderStatuskeyMap.CLOSED
                } else {
                    // 取消组合订单中的所有相关订单，干脆直接刷新页面
                    isCombinedOrder ? this.$refresh() : this.orderList.splice(index, 1)
                }
            } catch (e) {
                throw e
            } finally {
                this.cancelling = false
            }
        },
        // 删除订单
        async deleteOrder (index) {
            try {
                const detail = this.orderList[index]
                await this.$confirm('是否删除当前订单？ 删除后不可找回')
                await deleteOrder(detail.orderId)
                this.orderList.splice(index, 1)

                --this.total
                // 若实际订单总数大于当前页面订单总数时，去请求数据
                if (this.total > this.orderList.length) {
                    const { result } = await this.requestMethods(this.form)
                    const currentLastOrder = result.records[result.records.length - 1]
                    // 因删除过订单后offsetHeight不足初始获取的值，无法在加载更多，将删除留下的空位填充用currentPage的最后一个数据
                    if (currentLastOrder) {
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
