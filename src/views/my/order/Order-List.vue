<template>
  <div class="orders">
    <pl-tab
      :tabs="tabs"
      size="small"
      :active-id.sync="form.orderStatus"
      @change="tabChange"
    />
    <div :class="$style.orderList">
      <load-more
        :request-methods="getOrderList"
        :form="form"
        ref="loadMore"
        :loading.sync="loading"
        no-content-tip="暂无订单"
      >
        <template v-slot="{ list }">
          <router-link
            v-for="item of list"
            tag="div"
            :key="item.orderInfoModel.sequenceNbr"
            :to="{ name: 'OrderDetail', params: { orderId: item.orderInfoModel.orderSn } }"
            :class="'mb-28 ' + $style.orderBox"
          >
            <div class="fz-24">
              <pl-list
                title="订单编号："
                :content="item.orderInfoModel.orderSn"
              />
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
              <price
                prefix-text="总价："
                :price="item.orderInfoModel.amount + item.orderInfoModel.freight"
                size="small"
                plain
              />
              <div
                :class="$style.buttons"
                v-if="item.orderInfoModel.orderStatus === 'WAIT_PAY' ||
                  item.orderInfoModel.orderStatus === 'WAIT_RECEIVE' ||
                  (item.orderInfoModel.orderStatus === 'FINISHED' && item.orderInfoModel.assessment === 'NO')"
              >
                <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'WAIT_PAY'"
                  type="warning"
                  round
                  :loading="payloading && currentPayId === item.orderInfoModel.orderSn"
                  :disabled="payloading"
                  @click="pay(item.orderInfoModel.orderSn, item.orderInfoModel.orderType)"
                >
                  去支付
                </pl-button>
                <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'WAIT_RECEIVE'"
                  @click="confirmGet(item.orderInfoModel.orderType, item.orderInfoModel.orderSn)"
                  type="warning"
                  round
                >
                  确认收货
                </pl-button>
                <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'FINISHED' && item.orderInfoModel.assessment === 'NO'"
                  type="warning"
                  plain
                  round
                  @click="$router.push({ name: 'CommentOrder', params: { orderId: item.orderInfoModel.orderSn } })"
                >
                  去评价
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
import { mapGetters } from 'vuex'
import {
  getOrderList,
  getAwaitPayInfo,
  physicalorderReceiving,
  physicalorderReceivingForVirtual
} from '../../../apis/order-manager'
import wechatPay from '../../../assets/js/wechat/wechat-pay'
import LoadMore from '../../../components/Load-More.vue'
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
      $refresh: null,
      $router: null,
      currentPayId: '' // 当前正在支付的订单id
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
    if (this.form.orderStatus !== this.status || this.status === 'FINISHED') {
      this.form.orderStatus = this.status || ''
      if (this.status === 'FINISHED') {
        this.form.assessment = 'NO'
      } else {
        this.form.assessment = ''
      }
      this.$refresh()
    }
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
    padding: 20px 40px 120px;
  }
  .order-box {
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
        height: 80px;
        padding-right: 28px;
        margin-bottom: 30px;
        &:after {
          @include border-half-bottom(#e7e7e7);
        }
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
      padding-right: 28px;
      justify-content: flex-end;
      align-items: flex-end;
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
      margin-top: 32px;
      button {
        margin-left: 20px;
        margin-bottom: 20px;
      }
    }
  }
</style>
