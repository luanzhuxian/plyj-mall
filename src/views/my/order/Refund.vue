<template>
    <div :class="$style.refund">
        <section :class="$style.orderInfo">
            <order-item
                :img="productImg"
                :name="productName"
                :count="count"
                :option="skuCode2Name ? `${skuCode1Name},${skuCode2Name}` : skuCode1Name"
                :product-id="productId"
                hide-price
                route-name="Product"
            />
        </section>

        <section :class="$style.content">
            <div :class="$style.panel">
                <router-link
                    :class="$style.item"
                    tag="div"
                    replace
                    :to="{ name: 'RefundApply', params: { orderId, refundType: '1', type: 'APPLY' } }"
                >
                    <div :class="$style.itemLeft">
                        <div :class="$style.itemTitle">
                            仅退款(无需退货)
                        </div>
                        <div>
                            未收到货（包含未签收），请您先联系商家协商
                            <br>
                            商家同意后可直接退款；
                        </div>
                    </div>
                    <pl-svg
                        :class="$style.itemRight"
                        name="icon-right"
                        fill="#DEDEDE"
                        width="22"
                    />
                </router-link>

                <router-link
                    v-if="orderType === 'PHYSICAL' && orderStatus !== 'WAIT_SHIP'"
                    :class="$style.item"
                    tag="div"
                    replace
                    :to="{ name: 'RefundApply', params: { orderId, refundType: '2', type: 'APPLY' } }"
                >
                    <div :class="$style.itemLeft">
                        <div :class="$style.itemTitle">
                            退款退货
                        </div>
                        <div>
                            已收到货，需要退换所收到的商品，商家收到商品后
                            <br>
                            可退款；
                        </div>
                    </div>
                    <pl-svg
                        :class="$style.itemRight"
                        name="icon-right"
                        fill="#DEDEDE"
                        width="22"
                    />
                </router-link>
            </div>
        </section>
    </div>
</template>

<script>
import OrderItem from '../../../components/item/Order-Item.vue'
import { mapGetters } from 'vuex'
export default {
    name: 'Refund',
    components: {
        OrderItem
    },
    props: {
        orderId: {
            type: String,
            default: null
        }
    },
    computed: {
        ...mapGetters(['refundGoodsInfo'])
    },
    data () {
        return {
            orderStatus: '',
            orderType: '',
            productId: '',
            productImg: '',
            productName: '',
            skuCode1Name: '',
            skuCode2Name: '',
            count: ''
        }
    },
    activated () {
        const {
            goodId,
            sku,
            subSku,
            count,
            img,
            name,
            orderType,
            orderStatus
        } = this.refundGoodsInfo
        if (!goodId) {
            this.$router.go(-1)
            return
        }
        this.orderStatus = orderStatus
        this.orderType = orderType
        this.productId = goodId
        this.productImg = img
        this.productName = name
        this.skuCode1Name = sku
        this.skuCode2Name = subSku
        this.count = count
    }
}
</script>

<style module lang="scss">
  .order-info {
    padding: 24px;
    background-color: #FFF;
    display: flex;
  }

  .content {
    padding: 20px 24px;
  }

  .panel {
    border-radius: 20px;
    background-color: #fff;
    overflow: hidden;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 20px 24px 20px 32px;
    &:nth-of-type(1) {
      border-bottom: 1px solid #F0F0F0;
    }
  }

  .item-left {
    flex: 1;
    font-size: 22px;
    color: #999999;
    line-height: 32px;
  }

  .item-right {
    width: 22px;
  }

  .item-title {
    font-size: 26px;
    font-family: PingFangSC-Medium;
    font-weight: bold;
    color: #000;
    line-height: 36px;
    margin-bottom: 8px;
  }
</style>
