<template>
    <div :class="$style.shoppingCart">
        <div :class="$style.top">
            <span :class="$style.count">
                购物车宝贝 <i v-text="total" /> 件
            </span>
            <span
                v-if="products.length > 0"
                :class="$style.manage"
                @click="manage"
                v-text="isManage ? '完成' : '管理'"
            />
        </div>

        <template v-if="products.length > 0">
            <div :class="$style.productList" v-if="!loading">
                <pl-checkbox-group
                    v-model="checkedList"
                    ref="checkboxGroup"
                    @change="selectedChange"
                >
                    <pl-checkbox
                        v-for="(item, i) of products"
                        :key="i"
                        :data="item"
                        :gap-column="24"
                        border
                        :disabled="item.disabled"
                    >
                        <template v-slot:suffix="{ data }">
                            <CartItem
                                :data="data"
                                :disabled="isManage"
                                @countChange="computeMoney"
                                @skuClick="skuClick(data)"
                                @change="getList"
                            />
                        </template>
                    </pl-checkbox>
                </pl-checkbox-group>
            </div>

            <!-- 领取优惠券或凑单 -->
            <div :class="$style.coupon" v-if="couponList.length && mchId">
                <span v-if="nextCoupon || appropriateCoupon" :class="$style.couponTip">
                    <span v-if="appropriateCoupon">
                        已满{{ appropriateCoupon.useLimitAmount }}元,{{ appropriateCoupon.count ? '减' : '领券可减' }}{{ appropriateCoupon.amount }}元
                    </span>
                    <span v-if="nextCoupon && appropriateCoupon">, </span>
                    <span v-if="nextCoupon">
                        还差{{ ((nextCoupon.useLimitAmount * 1000000 - summation * 1000000) / 1000000).toFixed(2) }}元立减{{ nextCoupon.amount }}元
                    </span>
                </span>
                <!-- 满减券，存在较大金额（未领取） -->
                <!--<span v-else-if="minFullCutConpon && !minHadFullCutConpon">
          全场满{{ minFullCutConpon.useLimitAmount }}元减{{ minFullCutConpon.amount }}元,领券立享优惠
        </span>-->
                <span v-else-if="minFullCutConpon">
                    全场满{{ minFullCutConpon.useLimitAmount }}元减{{ minFullCutConpon.amount }}元 <i
                        v-if="!minFullCutConpon.count">,领券立享优惠</i>
                </span>
                <!-- 满减券（已领取） -->
                <!--<span v-else-if="minHadFullCutConpon">
          全场满{{ minHadFullCutConpon.useLimitAmount }}元减{{ minHadFullCutConpon.amount }}元
        </span>-->
                <!-- 品类券（已领取） -->
                <span v-else-if="hadCategoryCouponList.length">
                    已领用{{ hadCouponList.length }} 张优惠券,结算时立享优惠
                </span>
                <span v-else>
                    领券立享优惠
                </span>

                <span :class="$style.scrapingUp">
                    <!-- 选中了商品，且匹配到券 -->
                    <i
                        v-if="nextCoupon"
                        @click="$router.push({ name: 'CouponActivity', params: { couponId: nextCoupon.id } })"
                    >
                        去凑单
                    </i>
                    <!--
            自己没满减券
            显示条件：
            1. 没有合适的券，且最小满减券的数量为0 : !appropriateCoupon && minFullCutConpon && !minFullCutConpon.count
            2. 有合适的券，但是券的数量为0 : appropriateCoupon && !appropriateCoupon.count
            3. 自己一张券都没有，但是商家有券 hadFullCutCouponList.length && hadCategoryCouponList.length
          -->
                    <i
                        v-else-if="(!appropriateCoupon && minFullCutConpon && !minFullCutConpon.count) || (appropriateCoupon && !appropriateCoupon.count) || (!hadFullCutCouponList.length && !hadCategoryCouponList.length)"
                        @click="$router.push({ name: 'CouponCenter' })"
                    >
                        去领券
                    </i>
                    <!-- 自己有满减券 -->
                    <i
                        v-else
                        @click="$router.push({ name: 'Home' })"
                    >
                        再逛逛
                    </i>
                    <pl-svg name="icon-right" fill="#FE7700" width="20" height="22" />
                </span>
            </div>

            <!-- 结算或删除 -->
            <div :class="$style.settlement" v-if="mchId">
                <pl-checkbox :checked="checkedAll" @change="checkAll" border>
                    <span slot="suffix" class="fz-24 gray-2 ml-10">
                        全选
                        <i v-if="isManage" :class="$style.selectedCount">
                            (共{{ checkedList.length }}件)
                        </i>
                    </span>
                </pl-checkbox>

                <div :class="$style.control">
                    <span v-show="!isManage" class="fz-22 gray-3" :class="$style.discounts">
                        <i>不含运费</i>
                        <i style="color: #FE7700;" v-if="appropriateCoupon">已减：¥{{ appropriateCoupon.amount }}</i>
                    </span>
                    <span v-show="!isManage" class="fz-24">
                        合计：
                        <i v-if="appropriateCoupon" :class="$style.summation + ' rmb'"
                           v-text="((summation * 1000000 - appropriateCoupon.amount * 1000000) / 1000000).toFixed(2)" />
                        <i v-else :class="$style.summation + ' rmb'" v-text="summation.toFixed(2)" />
                    </span>
                    <button
                        :class="$style.settlementBtn"
                        @click="settlement"
                        :disabled="checkedList.length === 0"
                        v-show="!isManage"
                    >
                        结算({{ checkedList.length }})
                    </button>
                    <button
                        v-show="isManage"
                        :class="$style.delete"
                        :disabled="checkedList.length === 0 || removing"
                        @click="removePro"
                    >
                        删除
                    </button>
                </div>
            </div>
        </template>
        <NoContent
            v-else-if="!loading"
            text="那么多好商品，你都不加入购物车吗？"
        />
        <CartItemSkeleton v-if="loading" />
        <SpecificationPop
            :default-count="cartProductCount"
            :visible.sync="showSpecifica"
            :sku-attr-list="productAttributes"
            :sku-list="skuModels"
            :product-image="productImg"
            :sku="currentSku"
            :product-id="currentPro.cartProductId"
            :limiting="currentPro.purchaseQuantity"
        >
            <template v-slot:footer="{ currentSku, revert, limiting, limit }">
                <pl-button
                    type="warning"
                    size="large"
                    :loading="updating"
                    @click="specChanged(currentSku, revert, limiting, limit)"
                >
                    确定
                </pl-button>
            </template>
        </SpecificationPop>
    </div>
</template>

<script>
import CartItem from '../../components/item/Cart-Item.vue'
import NoContent from '../../components/common/No-Content.vue'
import CartItemSkeleton from '../../components/skeleton/Cart-Item.vue'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import {
    getCartList,
    deleteCartProducts,
    updateCartProductSku
} from '../../apis/shopping-cart'
import { getCouponList } from '../../apis/product'
import { mapGetters } from 'vuex'

export default {
    name: 'ShoppingCart',
    components: {
        CartItem,
        CartItemSkeleton,
        NoContent,
        SpecificationPop
    },
    data () {
        return {
            checkedAll: false,
            products: [],
            checkedList: [],
            isManage: false,
            total: 0,
            loading: false,
            updating: false,
            removing: false,
            showSpecifica: false,
            currentPro: {},
            currentSku: {},
            // 可领取优惠券列表
            couponList: [],
            // 已领取的优惠券列表
            hadCouponList: [],
            // 全部可领满减券
            fullCutCouponList: [],
            // 全部已领满减券
            hadFullCutCouponList: [],
            // 全部可领品类券
            categoryCouponList: [],
            // 全部已领品类券
            hadCategoryCouponList: [],
            // 当前最小金额的满减券（可包含未领取）
            minFullCutConpon: null,
            // 当前最小金额的满减券（全部为已领取）
            minHadFullCutConpon: null,
            // 当前最小金额的品类券（可包含未领取）
            minCategoryConpon: null,
            // 当前最小金额的品类券（全部为已领取）
            minHadCategoryConpon: null,
            // 合适的优惠券
            appropriateCoupon: null,
            // 下一级优惠券
            nextCoupon: null,
            // 合计
            summation: 0
        }
    },
    computed: {
        ...mapGetters(['roleCode', 'mchId']),
        productAttributes () {
            return this.currentPro.productAttributes || []
        },
        skuModels () {
            return this.currentPro.skuModels || []
        },
        cartProductCount () {
            return this.currentPro.cartProductCount || 1
        },
        productImg () {
            return this.currentPro.productImg || ''
        }
    },
    async created () {
        try {
            await this.getList()
            await this.getCouponList()
        } catch (e) {
            throw e
        }
    },
    methods: {
        resetState () {
            this.checkedAll = false
            this.total = 0
            this.summation = 0
        },
        async getList () {
            this.loading = true
            try {
                const { result } = await getCartList()
                this.resetState()
                this.setDisabled(result)
                this.total = result.length
                this.currentPro = this.products[0] || {}
                this.setDisabledToEnd()
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        },

        // 获取优惠券列表
        async getCouponList () {
            try {
                let { result } = await getCouponList()
                result = result || []

                // 按优惠金额从小到大排序
                result = result.sort((a, b) => a.useLimitAmount === b.useLimitAmount ? a.amount - b.amount : a.useLimitAmount - b.useLimitAmount)
                this.couponList = []
                this.hadCouponList = []
                this.fullCutCouponList = []
                this.categoryCouponList = []
                for (const item of result) {
                    if ((item.receiveLimit === 2 && this.roleCode !== 'MEMBERSHIP') || (item.receiveLimit === 1 && this.roleCode !== 'HELPER')) continue

                    // 可领取的券
                    this.couponList.push(item)

                    // 以领取的券
                    if (item.count > 0) {
                        this.hadCouponList.push(item)
                    }

                    // 满减券
                    if (item.couponType === 1) {
                        this.fullCutCouponList.push(item)

                        // 已领满减券
                        if (item.count > 0) {
                            this.hadFullCutCouponList.push(item)
                        }
                    }

                    // 品类券
                    if (item.couponType === 2) {
                        this.categoryCouponList.push(item)

                        // 已领品类券
                        if (item.count > 0) {
                            this.hadCategoryCouponList.push(item)
                        }
                    }
                }

                // 券中最小的金额
                this.minFullCutConpon = this.fullCutCouponList[0] || null

                // this.minHadFullCutConpon = this.hadFullCutCouponList[0] || null
                this.minCategoryConpon = this.categoryCouponList[0] || null

                // this.minHadCategoryConpon = this.hadCategoryCouponList[0] || null
            } catch (e) {
                throw e
            }
        },

        // 单击规格
        skuClick (data) {
            this.currentPro = data

            /**
                 * 找出合适的规格作为规格弹框组件的默认选中规格
                 * 需满足以下条件
                 * 1. 规格的库存必须大于当前购物车加入的数量
                 * 2. 当前购物车加入的数量必须大于等于规格的最小购买量
                 */
            const currentSku = data.skuModels.find(item => item.stock >= data.cartProductCount && data.cartProductCount >= item.minBuyNum && item.skuCode1 === data.cartSkuCode && item.skuCode2 === data.cartSkuCode2) || {}
            if (currentSku.id) {
                currentSku.count = data.cartProductCount
            }
            this.currentSku = currentSku
            this.showSpecifica = true
        },

        // 设置禁用效果
        setDisabled (products) {
            for (const item of products) {
                // 如果商品已下架或当前规格商品数量不足，禁用
                const currentSku = item.skuModels.find(sku => sku.skuCode1 === item.cartSkuCode && sku.skuCode2 === item.cartSkuCode2)
                if (currentSku) {
                    const disabled = currentSku.stock < item.cartProductCount || item.productStatus !== 2 || item.serverTime - item.shoppingTimeLong < 0
                    if (this.isManage) {
                        item.tempDisabled = disabled
                        item.disabled = false
                    } else {
                        item.disabled = disabled
                    }
                } else {
                    item.disabled = true
                }
            }
            this.products = products
        },

        // 将禁用项挪到最后
        setDisabledToEnd () {
            const disabledList = this.products.filter(item => item.disabled)

            // 将禁用的挪到最后
            for (const item of disabledList) {
                this.products.splice(this.products.indexOf(item), 1)
                this.products.push(item)
            }
        },

        // 改变规格
        async specChanged (currentSku, revert, limiting, limit) {
            /* if (limiting && option.count > limit) {
                if (limiting === limit) {
                    return this.$warning(`您至多购买${ limit }件`)
                }
                if (limiting - limit === limiting) {
                    return this.$warning(`您已购买${ limiting }件，已达购买上限`)
                }
                return this.$warning(`您已购买${ limiting - limit }件，您还可以购买${ limit }件`)
            } */
            try {
                // 请求修改
                this.updating = true
                const { skuCode1, count, skuCode2 } = currentSku
                console.log(skuCode1, count, skuCode2)
                const isUpdateSku = await updateCartProductSku({
                    id: this.currentPro.id,
                    skuCode: skuCode1,
                    skuCode2,
                    number: count
                })

                // 刷新显示
                if (isUpdateSku.result) {
                    // 直接修改父组件的数据，也在父组件中监听change事件，通过接口来刷新数据。但是会导致接口调用频繁
                    // 直接修改可以触发计算属性，使得数据真实一致
                    this.currentPro.cartSkuCode = skuCode1
                    this.currentPro.cartSkuCode2 = skuCode2
                    this.currentPro.cartProductCount = count
                    if (this.currentPro.hasOwnProperty('disabled')) {
                        // 修改完成后，取消禁用，如果禁用的话
                        this.currentPro.disabled = false
                    }
                    this.showSpecifica = false
                    this.$set(this.products, this.products.indexOf(this.currentPro), this.currentPro)
                    this.computeMoney()
                    this.isDouble(currentSku)
                    this.setDisabled(this.products)
                    this.setCoupon()
                } else {
                    // 修改失败，回滚选框中的值
                    revert()
                }
            } catch (e) {
                // 修改失败，回滚选框中的值
                // revert()
                throw e
            } finally {
                this.updating = false
            }
        },
        selectedChange (selected) {
            if (!this.isManage) {
                this.checkedAll = selected.length === this.products.filter(item => !item.disabled).length && selected.length > 0
                this.computeMoney()
            } else {
                this.checkedAll = selected.length === this.products.length && selected.length > 0
            }
        },

        // 管理
        manage () {
            this.checkAll(false)
            this.isManage = !this.isManage
            for (const item of this.products) {
                if (this.isManage) {
                    // 管理时，所有项都可选中，同时记录原有禁用状态
                    item.tempDisabled = item.disabled
                    item.disabled = false
                } else {
                    item.disabled = item.tempDisabled
                    delete item.tempDisabled
                }
            }
            this.setDisabledToEnd()
        },
        checkAll (val) {
            this.checkedAll = val
            this.$refs.checkboxGroup.changeAll(val)
        },
        async removePro () {
            const ids = []
            for (const item of this.checkedList) {
                ids.push(item.id)
            }
            await this.$confirm(`确定将这${ ids.length }个宝物删除？`)
            try {
                this.removing = true
                await deleteCartProducts(ids)
                this.checkedList = []
                this.getList()
            } catch (e) {
                throw e
            } finally {
                this.removing = false
            }
        },

        // 结算
        settlement () {
            const confirmList = []
            if (this.checkedList.length === 0) return
            for (const pro of this.checkedList) {
                const { cartProductCount, cartProductId, cartSkuCode, cartSkuCode2, agentUser } = pro
                const sku = pro.skuModels.find(item => item.skuCode1 === pro.cartSkuCode && item.skuCode2 === pro.cartSkuCode2)
                confirmList.push({
                    productId: cartProductId,
                    skuCode1: cartSkuCode,
                    skuCode2: cartSkuCode2,
                    count: cartProductCount,
                    price: sku.price,
                    agentUser,
                    productType: pro.goodsType
                })
            }
            this.$store.commit('submitOrder/setOrderProducts', {
                params: {
                    activeProduct: 1
                },
                products: confirmList
            })
            this.$router.push({
                name: 'SubmitOrder',
                query: {
                    isCart: true
                }
            })
        },

        // 算金额
        computeMoney () {
            let total = 0
            for (const item of this.checkedList) {
                const skuCode1 = item.cartSkuCode
                const skuCode2 = item.cartSkuCode2
                const { skuModels } = item
                const count = item.cartProductCount
                const currentSku = skuModels.find(item => item.skuCode1 === skuCode1 && item.skuCode2 === skuCode2)
                total += currentSku.price * 100 * count
            }
            this.summation = total / 100
            this.setCoupon()
        },

        // 计算优惠券
        setCoupon () {
            const { summation } = this
            if (summation) {
                // 找出合适的优惠券，并选出减免力度最大的那一个
                this.appropriateCoupon = this.fullCutCouponList
                    .filter(item => item.useLimitAmount <= summation)
                    .sort((a, b) => a.amount - b.amount)
                    .slice(-1)[0] || null
                this.nextCoupon = this.fullCutCouponList.find(item => item.useLimitAmount > summation) || null
            } else {
                this.appropriateCoupon = null
                this.nextCoupon = null
            }
        },

        // 判断当前规格是否已经存在于购物车中，如果存在，删之
        isDouble (options) {
            // 查找此规格对应的商品
            const currentSkuCount = this.products.filter(cartPro => cartPro.cartSkuCode === options.skuCode1 && cartPro.cartSkuCode2 === options.skuCode2)
            if (currentSkuCount.length >= 2) {
                this.products.splice(this.products.indexOf(currentSkuCount[0]), 1)
                this.checkedList.splice(this.checkedList.indexOf(currentSkuCount[0]), 1)
            }
            this.total = this.products.length
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if (!vm.$store.getters.mobile) {
                vm.$confirm('您还没有绑定手机，请先绑定手机')
                    .then(() => {
                        sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                            name: from.name,
                            params: from.params,
                            query: from.query
                        }))
                        vm.$router.replace({ name: 'BindMobile' })
                    })
                    .catch(() => {
                    })
            }
        })
    }
}
</script>

<style module lang="scss">
    .shoppingCart {
        padding-bottom: 200px;
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 80px;
        padding: 0 24px;
        font-size: 24px;
        color: #fff;
        background-color: $--warning-color;

        .count > i {
            font-weight: bold;
        }
    }

    .manage {
        font-size: 28px;
    }

    .productList {
        padding: 20px 24px;
    }

    .settlement {
        position: fixed;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 92px;
        padding: 0 24px;
        left: 0;
        bottom: 88px;
        background-color: #fff;
        box-sizing: border-box;
        z-index: 4;
        border-bottom: 1px solid #e7e7e7;
    }

    .selectedCount {
        font-size: 22px;
        color: #b0b0b0;
    }

    .control {
        display: inline-flex;
        align-items: center;
        line-height: 50px;

        .discounts {
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            line-height: 30px;
        }

        > span {
            margin-right: 12px;
        }

        .settlement-btn {
            width: 176px;
            height: 70px;
            font-size: 24px;
            color: #fff;
            background-color: $--warning-color;
            border-radius: $--radius2;

            &:disabled {
                color: #fff;
                background-color: #ccc;
            }
        }

        .summation {
            color: $--primary-color;
        }
    }

    .delete {
        width: 120px;
        height: 58px;
        font-size: 24px;
        color: $--primary-color;
        border: 2px solid $--primary-color;
        border-radius: $--radius2;

        &:disabled {
            color: #ccc;
            border-color: #cfcfcf;
        }
    }

    .coupon {
        position: fixed;
        left: 0;
        bottom: 180px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-height: 66px;
        padding: 10px 44px;
        box-sizing: border-box;
        font-size: 24px;
        background-color: #FFE1C7;
        z-index: 2;

        .couponTip {
            flex: 1;
        }

        .scrapingUp {
            display: inline-flex;
            align-items: center;
            width: 112px;
            margin-left: 10px;
            color: #FE7700;

            > i {
                margin-right: 14px;
            }
        }
    }
</style>
<style scoped lang="scss">
    .pl-checkbox {
        padding-left: 22px;
        background-color: #fff;
        border-radius: 20px;
    }
</style>
