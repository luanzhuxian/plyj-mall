<template>
  <div class="orders">
    <pl-tab
      :tabs="tabs"
      size="small"
      :active-id.sync="form.orderStatus"
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
        :request-methods="getOrderList"
        :form="form"
        ref="loadMore"
        :loading.sync="loading"
        no-content-tip="暂无订单"
        @refresh="getOrderSummary"
      >
        <template v-slot="{ list }">
          <router-link
            v-for="item of list"
            tag="div"
            :key="item.orderInfoModel.sequenceNbr"
            :to="{ name: 'OrderDetail', params: { orderId: item.orderInfoModel.orderSn } }"
            :class="$style.orderBox"
          >
            <div class="">
              <div :class="$style.orderBoxLeft">
                <span :class="$style.orderTag">
                  实体商品
                </span>
                <pl-list
                  title="订单编号："
                  :content="item.orderInfoModel.orderSn"
                />
              </div>
              <p
                :class="$style.status"
                v-text="orderStatusMap[item.orderInfoModel.orderStatus]"
              />
            </div>
            <order-item
              :img="item.mediaInfoModel[0].mediaUrl"
              :name="item.orderProductRelationModel.productName"
              :option="item.orderProductRelationModel.optionName"
              :count="item.orderProductRelationModel.count"
              :price="item.orderProductRelationModel.productPrice"
              border
            />
            <div :class="$style.orderBoxBottom">
              <div class="">
                <span :class="$style.totalCount">共1件商品</span>
                <price
                  prefix-text="总价："
                  :price="item.orderInfoModel.amount + item.orderInfoModel.freight"
                  size="small"
                  plain
                />
              </div>
              <div
                :class="$style.buttons"
                v-if="item.orderInfoModel.orderStatus === 'WAIT_PAY' ||
                  item.orderInfoModel.orderStatus === 'WAIT_RECEIVE' ||
                  (item.orderInfoModel.orderStatus === 'FINISHED' && item.orderInfoModel.assessment === 'NO')"
              >
                <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'WAIT_PAY'"
                  round
                  plain
                  @click="cancel"
                >
                  取消订单
                </pl-button>
                <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'WAIT_PAY'"
                  type="warning"
                  round
                  :loading="payloading && currentPayId === item.orderInfoModel.orderSn"
                  :disabled="payloading"
                  @click="pay(item.orderInfoModel.orderSn, item.orderInfoModel.orderType)"
                >
                  去付款
                </pl-button>
                <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'FINISHED' || item.orderInfoModel.orderStatus === 'CLOSED'"
                  round
                  plain
                  @click="deleteOrder"
                >
                  删除订单
                </pl-button>
                <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'WAIT_RECEIVE' || item.orderInfoModel.orderStatus === 'FINISHED'"
                  round
                  plain
                  @click="checkLogisticsInfo"
                >
                  查看物流
                </pl-button>
                <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'WAIT_RECEIVE'"
                  type="warning"
                  round
                  @click="confirmGet(item.orderInfoModel.orderType, item.orderInfoModel.orderSn)"
                >
                  确认收货
                </pl-button>
                <!-- <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'FINISHED' && item.orderInfoModel.assessment === 'NO'"
                  type="warning"
                  plain
                  round
                  @click="$router.push({ name: 'CommentOrder', params: { orderId: item.orderInfoModel.orderSn } })"
                >
                  去评价
                </pl-button> -->
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
import { mapGetters } from 'vuex'
import {
  getOrderList,
  getAwaitPayInfo,
  physicalorderReceiving,
  physicalorderReceivingForVirtual,
  orderPhysicalorderSummary
} from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
export default {
  name: 'OrderList',
  components: {
    OrderItem,
    Price,
    LoadMore
  },
  data () {
    return {
      payloading: false,
      tabs: [
        {
          name: '全部',
          id: ''
        },
        {
          name: '待付款',
          id: 'WAIT_PAY'
        },
        {
          name: '待发货',
          id: 'WAIT_SHIP'
        },
        {
          name: '待收货',
          id: 'WAIT_RECEIVE'
        },
        {
          name: '待评价',
          id: 'FINISHED'
        }
      ],
      form: {
        userId: '',
        current: 1,
        size: 10,
        orderStatus: '',
        assessment: '',
        orderSnOrName: ''
      },
      loading: false,
      getOrderList,
      orderPhysicalorderSummary,
      $refresh: null,
      $router: null,
      currentPayId: '', // 当前正在支付的订单id
      count: {
        FINISHED: 0,
        POST_SALE_SERVICE: 0,
        WAIT_PAY: 0,
        WAIT_RECEIVE: 0,
        WAIT_SHIP: 0
      }
    }
  },
  props: {
    status: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters(['orderStatusMap', 'userId'])
  },
  created () {
    this.form.userId = this.userId
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    this.form.orderStatus = this.status || ''
    if (this.status === 'FINISHED') {
      this.form.assessment = 'NO'
    } else {
      this.form.assessment = ''
    }
    this.$refresh()
  },
  methods: {
    tabChange (item) {
      this.$nextTick(() => {
        this.$router.replace({ name: 'Orders', params: { status: item.id || null } })
        if (item.id === 'FINISHED') {
          this.form.assessment = 'NO'
        } else {
          this.form.assessment = ''
        }
        this.$refresh()
      })
    },
    async getOrderSummary () {
      try {
        const { result } = await this.orderPhysicalorderSummary(this.userId)
        for (let k of Object.keys(result)) {
          if (result[k] > 99) result[k] = '99+'
        }
        this.count = result
      } catch (e) {
        throw e
      }
    },
    async pay (id, orderType) {
      this.payloading = true
      this.currentPayId = id
      try {
        const { result } = await getAwaitPayInfo(id)
        // 调用微信支付api
        await wechatPay(result)
        if (orderType === 'PHYSICAL_GOODS') {
          this.form.orderStatus = 'WAIT_SHIP'
          this.tabChange({
            name: '待发货',
            id: 'WAIT_SHIP'
          })
        } else {
          this.form.orderStatus = 'WAIT_RECEIVE'
          this.tabChange({
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
    // 确定收货
    async confirmGet (orderType, orderId) {
      try {
        await this.$confirm('您确定收货吗？')
        if (orderType === 'PHYSICAL_GOODS') {
          await physicalorderReceiving(orderId)
        } else {
          await physicalorderReceivingForVirtual(orderId)
        }
        // 跳转至待评价
        this.form.orderStatus = 'FINISHED'
        this.tabChange({
          name: '待评价',
          id: 'FINISHED'
        })
      } catch (e) {
        throw e
      }
    }
  }
}
</script>
<style module lang="scss">
  .orderList {
    padding: 22px 24px 120px;
  }
  .order-box {
    margin-bottom: 20px;
    padding-left: 28px;
    padding-bottom: 24px;
    border-radius: 20px;
    background-color: #fff;
    > div {
      &:nth-of-type(1) {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // height: 80px;
        padding: 22px 24px 36px 0;
        // &:after {
        //   @include border-half-bottom(#e7e7e7);
        // }
      }
    }
    .status {
      color: var(--primary-color);
    }
  }
  .order-box-bottom {
    margin-top: 16px;
    > div {
      display: flex;
      padding-right: 24px;
      justify-content: flex-end;
      align-items: baseline;
    }
    .total-count {
      font-size: 20px;
      font-family: MicrosoftYaHeiUI;
      color: #999999;
      // line-height: 28px;
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
      margin-top: 24px;
      button {
        margin-left: 24px;
      }
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
  .order-box-left {
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
