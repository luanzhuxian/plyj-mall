<template>
    <div :class="$style.orderList">
        <pl-tab
            :class="$style.tabBar"
            size="small"
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
                        :class="$style.listItem"
                        tag="div"
                        v-for="(item, i) of orderList"
                        :key="i"
                        :to="{ name: 'OrderDetail', params: { orderId: item.id } }"
                    >
                        <div>
                            <div :class="$style.listItemLeft">
                                <span
                                    :class="$style.tag"
                                    v-text="orderTypeMap[item.orderType]"
                                />
                                <pl-list
                                    title="订单编号："
                                    :content="item.id"
                                />
                            </div>
                            <p
                                :class="$style.status"
                                v-text="item.statusText"
                            />
                        </div>
                        <order-item
                            v-for="(product, j) of item.products"
                            :key="j"
                            :img="product.productImg + '?x-oss-process=style/thum'"
                            :name="product.productName"
                            :option="product.skuName2 ? `${product.skuName},${product.skuName2}` : product.skuName"
                            :count="product.purchaseQuantity"
                            :price="product.unitPrice"
                            :status="refundStatusMap[product.afterSalesStatus]"
                            :active-product="item.activeProduct"
                            :pre-active="item.activeProduct !== 1 ? 2 : ''"
                            border
                        />
                        <div :class="$style.listItemBottom">
                            <div :class="$style.priceWrapper">
                                <span :class="$style.totalCount">{{ `共${item.totalCount}件商品` }}</span>
                                <span :class="$style.bold">总价：</span>
                                <span :class="$style.price">{{ item.actuallyAmount }}</span>
                            </div>
                            <div
                                :class="$style.buttons"
                                v-if="item.status === 'WAIT_PAY'"
                            >
                                <pl-button
                                    round
                                    plain
                                    @click="cancelOrder(item, i)"
                                >
                                    取消订单
                                </pl-button>
                                <pl-button
                                    v-if="item.status === 'WAIT_PAY' && false"
                                    type="warning"
                                    round
                                    :loading="payloading && currentPayId === item.id"
                                    :disabled="payloading && currentPayId === item.id"
                                    @click="pay(item.id, item.orderType)"
                                >
                                    去付款
                                </pl-button>
                                <span v-if="item.activeProduct === 4 && !item.pastDue && item.status === 'WAIT_PAY_REPAYMENT'" class="fz-24 gray-3 mr-10">
                                    <span v-show="item.isStart">剩余尾款支付时间：</span>
                                    <span v-show="!item.isStart">距离开始支付时间：</span>
                                    <span v-show="item.d !== '00'">{{ item.d }}天</span>
                                    <span v-show="item.h !== '00'">{{ item.h }}时</span>
                                    <span>{{ item.m }}分</span>
                                    <span>{{ item.s }}秒</span>
                                </span>
                                <pl-button
                                    v-if="item.status === 'WAIT_PAY_REPAYMENT'"
                                    type="warning"
                                    round
                                    :loading="payloading && currentPayId === item.id"
                                    :disabled="payloading && currentPayId === item.id || !item.isStart || item.pastDue"
                                    @click="balancePayment(item.id, item.orderType)"
                                >
                                    {{ item.pastDue ? '已过期' : item.isStart ? '去付尾款' : '未开始付尾款' }}
                                </pl-button>
                                <pl-button
                                    v-if="(item.status === 'FINISHED' || item.status === 'CLOSED') && item.isDeleteBtnShow"
                                    round
                                    plain
                                    @click="deleteOrder(item, i)"
                                >
                                    删除订单
                                </pl-button>
                                <pl-button
                                    v-if="item.orderType === 'PHYSICAL' && (item.status === 'WAIT_RECEIVE' || item.status === 'FINISHED')"
                                    round
                                    plain
                                    @click="$router.push({ name: 'Freight', params: { orderId: item.id }, query: { img: item.products.length && item.products[0].productImg } })"
                                >
                                    查看物流
                                </pl-button>
                                <pl-button
                                    v-if="item.orderType === 'PHYSICAL' && item.status === 'WAIT_RECEIVE'"
                                    type="warning"
                                    round
                                    @click="confirmReceipt(item, i)"
                                >
                                    确认收货
                                </pl-button>
                                <pl-button
                                    v-if="item.orderType === 'KNOWLEDGE_COURSE' && item.status === 'FINISHED'"
                                    type="warning"
                                    round
                                    @click="$router.push({ name: 'Courses', params: { courseType: '1' } })"
                                >
                                    去学习
                                </pl-button>
                                <pl-button
                                    v-else-if="item.orderType !== 'PHYSICAL' && item.status === 'WAIT_RECEIVE'"
                                    type="warning"
                                    round
                                    @click="$router.push({ name: 'OrderDetail', params: { orderId: item.id } })"
                                >
                                    去使用
                                </pl-button>
                                <pl-button
                                    v-if="item.status === 'FINISHED' && item.commentStatus === 0 && ~[0, 3, 6].indexOf(item.afterSalesStatus)"
                                    round
                                    plain
                                    @click="$router.push({ name: 'OrderDetail', params: { orderId: item.id } })"
                                >
                                    去评价
                                </pl-button>
                            </div>
                        </div>
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
import OrderItem from '../../../components/item/Order-Item.vue'
import LoadMore from '../../../components/common/Load-More.vue'
import {
    getOrderList,
    getAwaitPayInfo,
    confirmReceipt,
    cancelOrder,
    deleteOrder,
    getWaitPayBalanceInfo
} from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
import { mapGetters } from 'vuex'
import moment from 'moment'
import Countdown from '../../../assets/js/Countdown'
const tabs = [{
    name: '全部',
    id: 'ALL_ORDER'
}, {
    name: '待付款',
    id: 'WAIT_PAY'
}, {
    name: '待发货',
    id: 'WAIT_SHIP'
}, {
    name: '待收货',
    id: 'WAIT_RECEIVE'
}, {
    name: '待评价',
    id: 'FINISHED'
}]

export default {
    name: 'OrderList',
    components: {
        LoadMore,
        OrderItem
    },
    props: {
        status: {
            type: String,
            default: null
        }
    },
    data () {
        return {
            tabs,
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
            ],
            refundStatusMap: {
                1: '退款中',
                2: '退款成功',
                3: '退款驳回',
                //  退换货-已退货
                4: '退款中',
                //  退换货-待退货
                5: '待退货',
                9: '退款中'
            }
        }
    },
    computed: {
        ...mapGetters(['orderTypeMap'])
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
                    if (this.status === 'ALL_ORDER') {
                        order.status = order.orderType === 'PHYSICAL' ? 'WAIT_SHIP' : 'WAIT_RECEIVE'
                    } else if (this.status === 'WAIT_PAY') {
                        this.orderList.splice(index, 1)
                    }
                }
            }
            if (action === 'receive') {
                return (order, index) => {
                    if (this.status === 'ALL_ORDER') {
                        order.status = 'FINISHED'
                    } else if (this.status === 'WAIT_RECEIVE') {
                        this.orderList.splice(index, 1)
                    }
                }
            }
            if (action === 'cancel') {
                return (order, index) => {
                    if (this.status === 'ALL_ORDER') {
                        order.status = 'CLOSED'
                    } else if (this.status === 'WAIT_PAY') {
                        const isCombinedOrder = order.activeProduct === 5 || order.activeProduct === 6
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
    methods: {
        onTabChange (item) {
            this.$nextTick(() => {
                this.$router.replace({ name: 'Orders', params: { status: item.id || null } })
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
            const counter = array => key => array.reduce((acc, current) => acc + (key ? current[key] : current), 0)
            for (const [i, item] of list.entries()) {
                item.totalCount = counter(item.products)('purchaseQuantity')
                // 只要有一个商品在售后状态则不显示删除按钮
                item.isDeleteBtnShow = !item.products.some(product => ![0, 2, 3, 6].includes(product.afterSalesStatus))
                if (item.status === 'WAIT_PAY_REPAYMENT') {
                    // 是否开始付尾款
                    const now = Number(item.currentServerTime)
                    const useStartTime = moment(item.useStartTime).valueOf()
                    const useEndTime = moment(item.useEndTime).valueOf()
                    item.isStart = now - useStartTime >= 0
                    item.pastDue = now - useEndTime >= 0
                    if (!item.isStart) {
                        // 可以开始支付了，倒计时支付
                        this.countDown(useStartTime - now, i, item)
                    } else if (!item.pastDue) {
                        // 可以开始支付了，倒计时支付
                        this.countDown(useEndTime - now, i, item)
                    }
                }
            }
            this.orderList = list
            this.total = total
        },

        // 开始倒计时
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
                item.d = d.padStart(2, '0')
                item.h = h.padStart(2, '0')
                item.m = m.padStart(2, '0')
                item.s = s.padStart(2, '0')
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
        async pay (orderId, orderType) {
            this.payloading = true
            this.currentPayId = orderId
            try {
                const { result } = await getAwaitPayInfo(orderId)

                // 调用微信支付api
                await wechatPay(result)
                if (orderType === 'PHYSICAL') {
                    this.form.orderStatus = 'WAIT_SHIP'
                    this.onTabChange({
                        name: '待发货',
                        id: 'WAIT_SHIP'
                    })
                } else {
                    this.form.orderStatus = 'WAIT_RECEIVE'
                    this.onTabChange({
                        name: '待收货',
                        id: 'WAIT_RECEIVE'
                    })
                }
            } catch (e) {
                throw e
            } finally {
                this.payloading = false
            }
        },

        // 去付尾款
        async balancePayment (orderId, orderType) {
            this.currentPayId = orderId
            this.payloading = true
            try {
                const { result } = await getWaitPayBalanceInfo(orderId)

                // 调用微信支付api
                await wechatPay(result)
                if (orderType === 'PHYSICAL') {
                    this.form.orderStatus = 'WAIT_SHIP'
                    this.onTabChange({
                        name: '待发货',
                        id: 'WAIT_SHIP'
                    })
                } else {
                    this.form.orderStatus = 'WAIT_RECEIVE'
                    this.onTabChange({
                        name: '待收货',
                        id: 'WAIT_RECEIVE'
                    })
                }
            } catch (e) {
                throw e
            } finally {
                this.payloading = false
            }
        },
        async confirmReceipt (item, index) {
            const orderId = item.id
            const { orderStatus } = this.form
            try {
                await this.$confirm('您确定收货吗？')
                await confirmReceipt(orderId)
                this.$success('确认收货成功')
                if (orderStatus === 'ALL_ORDER') {
                    item.status = 'FINISHED'
                    item.statusText = '已完成'
                } else {
                    this.orderList.splice(index, 1)
                }
                setTimeout(() => {
                    this.$router.push({ name: 'OrderComplete', params: { orderId } })
                }, 2000)
            } catch (e) {
                throw e
            }
        },
        async cancelOrder (item, index) {
            const orderId = item.id
            const { orderStatus } = this.form

            // 5春耘订单 6组合课订单
            const isCombinedOrder = item.activeProduct === 5 || item.activeProduct === 6
            try {
                const reason = await this.showPicker()
                await this.$confirm(isCombinedOrder ? `是否取消该订单，取消后组合订单将同步取消？` : '订单一旦取消，将无法恢复 确认要取消订单？')
                await cancelOrder(orderId, reason)
                this.$success('交易关闭')
                if (orderStatus === 'ALL_ORDER') {
                    item.status = 'CLOSED'
                    item.statusText = '已关闭'
                } else {
                    // 取消组合订单中的所有相关订单，干脆直接刷新页面
                    if (isCombinedOrder) {
                        this.$refresh()
                    } else {
                        this.orderList.splice(index, 1)
                    }
                }
            } catch (e) {
                throw e
            }
        },
        async deleteOrder (item, index) {
            const orderId = item.id
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
                        const counter = array => key => array.reduce((acc, current) => acc + (key ? current[key] : current), 0)
                        currentLastOrder.totalCount = counter(item.products)('purchaseQuantity')
                        // 只要有一个商品在售后状态则不显示删除按钮
                        currentLastOrder.isDeleteBtnShow = !item.products.some(product => ![0, 2, 3, 6].includes(product.afterSalesStatus))
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

</style>
