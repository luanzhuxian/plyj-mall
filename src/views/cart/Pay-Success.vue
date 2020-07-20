<template>
    <div :class="$style.paySuccess">
        <div :class="$style.top">
            <pl-svg
                :class="$style.icon"
                :name="orderType === 'FORMAL_CLASS' ? 'icon-signup-success' : 'icon-pay-success'"
            />
            <p :class="$style.tip1">
                <span v-if="orderType === 'FORMAL_CLASS'">报名/学习成功</span>
                <span v-else>订单支付成功</span>
            </p>
            <p :class="$style.tip2" v-if="orderType !== 'FORMAL_CLASS'">
                请保持手机通畅，以便于我们为您提供服务！
            </p>
            <router-link
                :class="$style.tip3"
                :replace="true"
                :to="
                    orderCount === 1
                        ? { name: 'OrderDetail', params: { orderId } }
                        : { name: 'Orders', params: { status: 'ALL_ORDER' } }
                "
            >
                查看订单
            </router-link>
            <pl-button
                size="huge"
                type="warning"
                @click="$router.replace({ name: 'Home' })"
            >
                完成，返回首页
            </pl-button>
        </div>
        <you-like :is-my="true" />
    </div>
</template>

<script>
import youLike from './../home/components/YouLike.vue'
import { mapGetters } from 'vuex'
import { checkGetGift } from '../../apis/order-manager'
import { promise } from '../../assets/js/util'
export default {
    name: 'PaySuccess',
    components: {
        youLike

    // WWEC
    },
    data () {
        return {
            checkCount: 0
        }
    },
    props: {
        orderId: {
            type: String,
            default: ''
        },
        orderCount: {
            type: [Number, String],
            default: 1
        }
    },
    async activated () {
        try {
            await this.checkGift()
        } catch (e) {
            throw e
        }
    },
    computed: {
        ...mapGetters(['mallId', 'serverTime']),
        orderType () {
            return this.$route.query.orderType
        }
    },
    methods: {
        async checkGift () {
            this.checkCount++
            try {
                await promise.timeout(1000)
                const { result } = await checkGetGift(this.orderId)
                if (result) {
                    this.$confirm({
                        message: '领取礼品成功！',
                        viceMessage: '您已成功领取礼品，请前往“我的礼品”进行查看',
                        confirmText: '立即前往'
                    })
                        .then(async () => {
                            await this.$router.replace({ name: 'MyPresent' })
                        })
                        .catch(() => {})
                } else if (this.checkCount <= 10) {
                    this.checkGift()
                } else {
                    this.checkCount = 0
                }
            } catch (e) {
                throw e
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        const { orderId } = to.params
        if (orderId) {
            next()
        } else {
            next({ name: 'Home' })
        }
    }
}
</script>

<style module lang="scss">
.paySuccess {
  display: flex;
  padding: 64px 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #fff;
}
.top {
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
.icon {
  width: 148px;
  height: 148px;
}
.tip1 {
  margin-top: 20px;
  font-size: 36px;
  font-weight: bold;
}
.tip2 {
  margin-top: 24px;
  font-size: 28px;
  color: #999;
}
.tip3 {
  display: block;
  margin: 48px 0;
  font-size: 30px;
  color: #387af6;
}
/*.haibao {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, .5);
  text-align: center;
  overflow: auto;
  z-index: 5;
  > img {
    width: 90%;
    justify-items: flex-start !important;
  }
}*/
</style>
