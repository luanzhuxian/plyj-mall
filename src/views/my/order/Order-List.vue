<template>
  <div class="order-list">
    <pl-tab :tabs="tabs" size="small" :active-id.sync="form.orderStatus" @change="tabChange" />
    <!--<keep-alive>-->
      <!--<router-view />-->
    <!--</keep-alive>-->
    <load-more :requestMethods="getOrderList" :form="form" ref="loadMore" :loading.sync="loading" no-content-tip="暂无订单">
      <template v-slot="{ list }">
        <router-link
          v-for="(item, i) of list"
          tag="div"
          :key="i"
          :to="{ name: 'OrderDetail', params: { orderId: item.orderInfoModel.orderSn } }"
          :class="'mb-28 ' + $style.orderBox"
        >
          <div class="fz-24">
            <pl-list title="订单编号：" :content="item.orderInfoModel.orderSn" />
            <p :class="$style.status" v-text="orderStatusMap[item.orderInfoModel.orderStatus]" />
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
            <price prefix-text="总价：" :price="item.orderInfoModel.amount + item.orderInfoModel.freight" size="small" plain />
            <div :class="$style.buttons" v-if="item.orderInfoModel.orderStatus !== 'CLOSED'">
              <pl-button v-if="item.orderInfoModel.orderStatus === 'WAIT_PAY'" type="warning" round @click="pay(item.orderInfoModel.orderSn, item.orderInfoModel.orderType)">去支付</pl-button>
              <pl-button
                v-if="item.orderInfoModel.orderStatus === 'WAIT_RECEIVE'"
                @click="confirmGet(item.orderInfoModel.orderType, item.orderInfoModel.orderSn)"
                type="warning" round
              >
                确认收货
              </pl-button>
              <pl-button
                v-if="item.orderInfoModel.orderStatus === 'FINISHED' && item.orderInfoModel.assessment === 'NO'"
                type="warning" plain round
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
  name: 'Order-List',
  components: {
    OrderItem,
    Price,
    LoadMore
  },
  data () {
    return {
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
      $router: null
    }
  },
  props: ['status'],
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
    async pay (id, orderType) {
      try {
        const { result } = await getAwaitPayInfo(id)
        // 调用微信支付api
        await wechatPay(result)
        if (orderType === 'PHYSICAL_GOODS') {
          this.$router.push({ name: 'waitShip' })
        } else {
          this.$router.push({ name: 'waitReceive' })
        }
      } catch (e) {
        throw e
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
        this.$router.push({ name: 'waitComment' })
      } catch (e) {
        throw e
      }
    }
  }
}
</script>
