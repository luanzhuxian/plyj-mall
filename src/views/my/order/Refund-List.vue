<template>
  <div class="refund-list">
    <pl-tab
      size="small"
      :tabs="tabs"
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
        ref="loadMore"
        :form="form"
        :loading.sync="loading"
        :request-methods="getOrderList"
        no-content-tip="暂无订单"
        @refresh="getOrderSummary"
      >
        <template v-slot="{ list }">
          <router-link
            tag="div"
            v-for="item of list"
            :key="item.orderInfoModel.orderSn"
            :to="{ name: 'RefundDetail', params: { orderSn: item.orderInfoModel.orderSn } }"
            :class="$style.refundItem"
          >
            <div :class="$style.orderId">
              <pl-list
                title="下单时间："
                :content="item.orderCreateDate"
              />
              <pl-list
                title="退单号："
                :content="item.orderInfoModel.orderSn"
              />
            </div>
            <div>
              <div :class="$style.orderItemLeft">
                <span :class="$style.orderTag">
                  实体商品
                </span>
                <pl-list
                  title="退单号："
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
              :price="item.orderProductRelationModel.productPrice"
              :count="item.orderProductRelationModel.count"
              border
            />
            <div :class="$style.orderItemBottom">
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
                  取消申请
                </pl-button>
                <pl-button
                  v-if="item.orderInfoModel.orderStatus === 'WAIT_RECEIVE' || item.orderInfoModel.orderStatus === 'FINISHED'"
                  round
                  plain
                  @click="checkLogisticsInfo"
                >
                  查看详情
                </pl-button>
                <pl-button
                  round
                  plain
                  @click="checkLogisticsInfo"
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
import { getOrderList, orderPhysicalorderSummary } from '../../../apis/order-manager'
import LoadMore from '../../../components/Load-More.vue'
import { mapGetters } from 'vuex'

const tabs = [{
  name: '全部',
  id: 'ALl_ORDER'
}, {
  name: '待审核',
  id: 'WAIT_PAY'
}, {
  name: '退换货',
  id: 'WAIT_SHIP'
}, {
  name: '退款成功',
  id: 'WAIT_RECEIVE'
}]

export default {
  name: 'RefundList',
  components: {
    OrderItem,
    LoadMore
  },
  data () {
    return {
      tabs,
      form: {
        userId: '',
        current: 1,
        size: 10,
        orderStatus: '',
        assessment: '',
        orderSnOrName: ''
      },
      getOrderList,
      orderPhysicalorderSummary,
      loading: false,
      $refresh: null,
      count: {
        FINISHED: 0,
        AFTER_SALE: 0,
        WAIT_PAY: 0,
        WAIT_RECEIVE: 0,
        WAIT_SHIP: 0
      }
    }
  },
  computed: {
    ...mapGetters(['userId'])
  },
  created () {
    this.form.userId = this.userId
  },
  mounted () {
    this.refresh = this.$refs.loadMore.refresh
  },
  activated () {
    // this.refresh()
  },
  methods: {
    tabChange (item) {
      this.$nextTick(() => {
        this.$router.replace({ name: 'RefundList', params: { status: item.id || null } })
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
    }
  }
}
</script>

<style module lang="scss">
  .order-list {
    padding: 22px 24px 120px;
  }
  // .order-id {
  //   position: relative;
  //   padding-bottom: 24px;
  //   margin-bottom: 24px;
  //   &:after {
  //     @include border-half-bottom(#e7e7e7);
  //   }
  // }
  .refund-item {
    // padding: 24px 28px;
    // margin-bottom: 28px;
    // background-color: #fff;
    // border-radius: 20px;
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
  // .status {
  //   text-align: right;
  //   button {
  //     margin-left: 20px;
  //   }
  // }
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
</style>
