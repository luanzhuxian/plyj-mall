<template>
    <div class="refund-list" :class="$style.refundList">
        <pl-tab
            :class="$style.tabBar"
            size="small"
            :tabs="tabs"
            :active-id.sync="form.auditStatus"
            @change="onTabChange"
        >
            <div
                :class="$style.tabPane"
                v-for="i of tabs"
                :key="'tab' + i"
                :slot="'tab-pane-' + i"
            />
        </pl-tab>
        <div :class="$style.list">
            <load-more
                ref="loadMore"
                :form="form"
                :loading.sync="loading"
                :request-methods="getRefundOrderList"
                no-content-tip="您还没有相关订单~"
                @refresh="onRefresh"
            >
                <template v-slot="{ list }">
                    <router-link
                        tag="div"
                        v-for="(item, i) of orderList"
                        :key="item.id"
                        :to="{ name: 'RefundDetail', params: { id: item.id } }"
                    >
                        <RefundListItem
                            :index="i"
                            :order-id="item.id"
                            :order-type="item.orderType"
                            :order-status="item.orderStatus"
                            :refund-type="item.type"
                            :refund-status="item.businessStatus"
                            :goods-images="item.goodsImage"
                            :goods-name="item.goodsName"
                            :sku-name="item.skuName"
                            :sub-sku-name="item.subSkuName"
                            :count="item.count"
                            :unit-price="item.unitPrice"
                            :refund-amount="item.refundAmount"
                            @cancelApplication="cancelApplication"
                            @deleteOrder="deleteOrder"
                        />
                    </router-link>
                </template>
            </load-more>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import filter from '../../../filter/index'
import LoadMore from '../../../components/common/Load-More.vue'
import RefundListItem from './components/Refund-List-Item'
import {
    getRefundOrderList,
    cancelRefundApplication,
    deleteRefundOrder
} from '../../../apis/order-manager'

export default {
    name: 'RefundList',
    components: {
        LoadMore,
        RefundListItem
    },
    computed: {
        ...mapGetters(['refundOperatedList', 'orderActionMap'])
    },
    data () {
        return {
            getRefundOrderList,
            status: '',
            tabs: [
                { name: '全部', id: '' },
                { name: '待审核', id: 'WAIT_CHECK' },
                { name: '退换货', id: 'REFUND_PRODUCT' },
                { name: '退款成功', id: 'FINISHED' }
            ],
            orderList: [],
            form: {
                current: 1,
                size: 10,
                auditStatus: ''
            },
            loading: false,
            $refresh: null
        }
    },
    beforeRouteEnter (to, from, next) {
        to.meta.noRefresh = from.name === 'RefundDetail'
        next()
    },
    mounted () {
        this.$refresh = this.$refs.loadMore.refresh
    },
    activated () {
        this.status = this.$route.params.status === 'ALL_ORDERS' ? '' : this.$route.params.status
        this.form.auditStatus = this.status
        if (this.orderList.length && this.$router.currentRoute.meta.noRefresh) {
            if (!this.refundOperatedList.length) return
            this.handleCurrentOrder(this.refundOperatedList)
            return
        }
        this.$refresh()
    },
    methods: {
        ...mapMutations(['clearRefundOperatedList']),
        onTabChange (item) {
            this.$nextTick(() => {
                this.$router.replace({ name: 'RefundList', params: { status: item.id } })
                this.$refresh()
            })
        },
        onRefresh (list, total) {
            for (const item of list) {
                item.unitPrice = filter.formatAmount(item.unitPrice)
                item.refundAmount = filter.formatAmount(item.refundAmount)
            }
            this.orderList = list
        },
        handleCurrentOrder (arr) {
            const handler = action => {
                if (action === this.orderActionMap.cancel) {
                    return (order, index) => {
                        if (!this.status || this.status === 'WAIT_CHECK') {
                            this.orderList.splice(index, 1)
                        }
                    }
                }
                if (action === this.orderActionMap.ship) {
                    return (order, index) => {
                        if (!this.status) {
                            order.businessStatus = 2
                        }
                        if (this.status === 'WAIT_CHECK') {
                            this.orderList.splice(index, 1)
                        }
                    }
                }
                if (action === this.orderActionMap.delete) {
                    return (order, index) => {
                        this.orderList.splice(index, 1)
                    }
                }
            }
            for (const item of arr) {
                const index = this.orderList.findIndex(order => order.id === item.id)
                if (index === -1) continue
                handler(item.action)(this.orderList[index], index)
            }
            this.$store.commit('clearRefundOperatedList')
            this.orderList.length ? this.$forceUpdate() : this.$refresh()
        },
        async cancelApplication (index) {
            try {
                const detail = this.orderList[index]
                await this.$confirm('退单正在审核中，确定要取消？')
                await cancelRefundApplication(detail.id)
                this.$success('取消申请成功')
                this.orderList.splice(index, 1)
            } catch (e) {
                throw e
            }
        },
        async deleteOrder (item, index) {
            try {
                const detail = this.orderList[index]
                await this.$confirm('是否删除当前订单？ 删除后不可找回')
                await deleteRefundOrder(detail.id)
                this.orderList.splice(index, 1)
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
  .refund-list {
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
<style lang="scss">
.refund-list {
  .pl-button__warning.plain {
    background-color: #FFF;
    border: 1px solid #FE7700;
    color: #FE7700;
  }
}
</style>
