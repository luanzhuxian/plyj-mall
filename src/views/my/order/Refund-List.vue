<template>
  <div class="refund-list">
    <pl-tab
      size="small"
      :tabs="tabs"
      :active-id.sync="form.returnStatus"
      :count="count"
      @change="tabChange"
    >
      <div
        :class="$style.tabCount"
        v-for="(item, i) of tabs"
        :key="i"
        :slot="'tab-pane-' + i"
      >
        <span
          :class="$style.tabCountNumber"
          v-if="count[item.id]"
          v-text="count[item.id]"
        />
      </div>
    </pl-tab>
    <div :class="$style.orderList">
      <load-more
        ref="loadMore"
        :form="form"
        :loading.sync="loading"
        :request-methods="getRefundOrderList"
        no-content-tip="暂无订单"
        @refresh="onRefresh"
      >
        <template v-slot="{ list }">
          <router-link
            tag="div"
            v-for="(item, i) of orderList"
            :key="i"
            :to="{ name: 'RefundDetail', params: { id: item.id } }"
            :class="$style.refundItem"
          >
            <div>
              <div :class="$style.orderItemLeft">
                <span
                  :class="$style.orderTag"
                  v-text="orderTypeMap[item.orderType]"
                />
                <pl-list
                  title="退单号："
                  :content="item.id"
                />
              </div>
              <p
                :class="$style.status"
                v-text="refundStatusMap[item.returnStatus]"
              />
            </div>
            <order-item
              :img="item.productPic"
              :name="item.productName"
              :option="item.skuName"
              :count="item.productCount"
              :price="item.productPrice"
              border
            />
            <div :class="$style.orderItemBottom">
              <div>
                <span :class="$style.totalCount">{{ `共${item.productCount}件商品` }}</span>
                <price
                  prefix-text="退款金额："
                  :price="item.actualRefund"
                  size="medium"
                  plain
                />
              </div>
              <div :class="$style.buttons">
                <span
                  :class="$style.reundType"
                  v-text="refundTypeMap[item.refundType]"
                />
                <pl-button
                  v-if="item.returnStatus === 'WAIT_CHECK'"
                  round
                  plain
                  @click="cancelApplication(item, i)"
                >
                  取消申请
                </pl-button>
                <pl-button
                  v-if="item.returnStatus === 'WAIT_CHECK' || item.returnStatus === 'REFUND_PRODUCT' || item.returnStatus === 'FINISHED'"
                  round
                  plain
                  @click="$router.push({ name: 'RefundDetail', params: { id: item.id } })"
                >
                  查看详情
                </pl-button>
                <pl-button
                  v-if="item.returnStatus === 'REFUND_PRODUCT_WAIT_RETURN'"
                  type="warning"
                  round
                  plain
                  @click="$router.push({ name: 'RefundDetail', params: { id: item.id } })"
                >
                  寄件运单号
                </pl-button>
              </div>
            </div>
          </router-link>
        </template>
      </load-more>
    </div>
  </div>
</template>

<script>
import OrderItem from '../../../components/item/Order-Item.vue'
import Price from '../../../components/Price.vue'
import LoadMore from '../../../components/Load-More.vue'
import {
  getRefundOrderList,
  refundOrderSummary,
  cancelRefundApplication
} from '../../../apis/order-manager'
import { mapGetters } from 'vuex'

const tabs = [{
  name: '全部',
  id: 'ALL_ORDER'
}, {
  name: '待审核',
  id: 'WAIT_CHECK'
}, {
  name: '退换货',
  id: 'REFUND_PRODUCT'
}, {
  name: '退款成功',
  id: 'FINISHED'
}]

const count = {
  WAIT_CHECK: 0,
  REFUND_PRODUCT: 0,
  FINISHED: 0
}

const refundStatusMapCamel = {
  waitCheck: 'WAIT_CHECK',
  refundProduct: 'REFUND_PRODUCT',
  finished: 'FINISHED'
}

export default {
  name: 'RefundList',
  components: {
    LoadMore,
    OrderItem,
    Price
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
      form: {
        current: 1,
        size: 10,
        returnStatus: ''
      },
      getRefundOrderList,
      refundOrderSummary,
      loading: false,
      $refresh: null,
      count,
      refundStatusMapCamel
    }
  },
  computed: {
    ...mapGetters(['refundStatusMap', 'orderTypeMap', 'refundTypeMap'])
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    this.form.returnStatus = this.status
    this.$refresh()
  },
  methods: {
    tabChange (item) {
      this.$nextTick(() => {
        this.$router.replace({ name: 'RefundList', params: { status: item.id } })
        this.$refresh()
      })
    },
    onRefresh (list, total) {
      this.orderList = list
      this.getRefundOrderSummary()
    },
    async getRefundOrderSummary () {
      try {
        const { refundStatusMapCamel } = this
        const { result } = await refundOrderSummary()
        for (let key of Object.keys(result)) {
          if (refundStatusMapCamel.hasOwnProperty(key)) {
            this.count[refundStatusMapCamel[key]] = result[key] > 99 ? '99+' : result[key]
          }
        }
      } catch (e) {
        throw e
      }
    },
    async cancelApplication (item, index) {
      try {
        await this.$confirm('退单正在审核中，确定要取消？')
        await cancelRefundApplication({ id: item.id })
        this.$success('取消申请成功')
        this.orderList.splice(index, 1)
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style module lang="scss">
  .order-list {
    padding: 22px 24px 120px;
  }
  .refund-item {

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
      color: var(--primary-color);
      font-size: 24px;
      line-height: 34px;
    }
  }
  .order-item-bottom {
    margin-top: 16px;
    > div {
      display: flex;
      justify-content: flex-end;
      align-items: baseline;
    }
    .total-count {
      font-size: 20px;
      font-family: MicrosoftYaHeiUI;
      color: #999999;
      margin-right: 12px;
    }
    .price {
      font-size: 40px;
      align-self: flex-end;
      &:before {
        margin-right: 10px;
        padding-bottom: 4px;
        font-size: 24px;
        content: '总价：¥';
      }
    }
    .buttons {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 24px;
      button {
        margin-left: 24px;
        &:nth-of-type(1) {
          margin-left: 40px;
        }
      }
    }
    .reund-type {
      font-size: 24px;
      color: #FE7700;
      line-height: 32px;
    }
  }
  .tab-count {
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
  .tab-count-number {
    display: inline-flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: url("../../../assets/images/my/circle.png") no-repeat center center;
    background-size: 100%;
  }
  .order-item-left {
    display: inline-flex;
    align-items: center;
  }
  .order-tag {
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
</style>
