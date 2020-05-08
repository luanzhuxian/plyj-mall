<template>
    <div>
        <div
            :class="$style.goodItem"
            @click="handleClick"
        >
            <div :class="$style.goodLeft">
                <img v-imgError
                     :class="$style.img"
                     :src="img"
                     :key="img"
                >
            </div>
            <div :class="$style.goodRight">
                <h1 v-text="title" />
                <div :class="$style.tag">春节特价</div>
                <div :class="$style.price">
                    <Price
                        :class="$style.priceItem"
                        size="middle"
                        :price="price"
                        :original-price="originalPrice"
                    />
                    <button :class="$style.addCart"
                            :disabled="noStock || adding"
                            @click.stop="showSpecifica = true"
                    >
                        {{ noStock? '商品已售罄':'加入购物车' }}
                    </button>
                </div>
                <div :class="$style.salesVolume">{{ salesVolume }}人付款</div>
            </div>
        </div>
        <!-- 规格弹框 -->
        <SpecificationPop
            :key="id"
            :default-count="defaultCount"
            :visible.sync="showSpecifica"
            :product-image="img"
            :sku.sync="currentModel"
            :limiting="limiting"
            :sku-attr-list="detail.productAttributes"
            :sku-list="detail.productSkuModels"
        >
            <template v-slot:footer="{ currentSku }">
                <pl-button
                    type="warning"
                    size="large"
                    :loading="adding"
                    @click="addToCart(currentSku)"
                >
                    确定
                </pl-button>
            </template>
        </SpecificationPop>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { GET_CART_COUNT } from '../../store/mutation-type'
import Price from '../product/Price.vue'
import SpecificationPop from '../../components/detail/Specification-Pop.vue'
import { addToCart } from '../../apis/shopping-cart'

export default {
    name: 'CouponGoodItem',
    components: {
        Price,
        SpecificationPop
    },
    data () {
        return {
            adding: false,
            // 当前选中的商品规格
            currentModel: {},
            // 是否显示规格弹框
            showSpecifica: false
        }
    },
    activated () {
        this.showSpecifica = false
        this.currentModel = this.detail.productSkuModels.find(item => item.minBuyNum <= item.stock) || this.detail.productSkuModels[0]
    },
    deactivated () {
        this.showSpecifica = false
        this.currentModel = {}
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        img: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        originalPrice: {
            type: [String, Number],
            default: ''
        },
        salesVolume: {
            type: [String, Number],
            default: ''
        },
        detail: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    computed: {
        ...mapGetters(['userId', 'mobile', 'shareId']),

        /**
       * 判断是否还有库存
       *
       * 其它活动商品的库存同意用
       */
        noStock () {
            // 正常购买途径是否还有库存为准
            return this.detail.productSkuModels.every(item => item.stock < item.minBuyNum)
        },
        // 默认选择的数量
        defaultCount () {
            return this.currentModel.count || 1
        },
        limiting () {
            return this.detail.purchaseLimit ? (this.detail.purchaseQuantity) : 0
        },
        price () {
            const priceList = this.detail.productSkuModels.map(item => item.price)
            return Math.min(...priceList)
        }
    },
    methods: {
        ...mapActions({
            getCartCount: GET_CART_COUNT
        }),
        // 商品详情
        async handleClick () {
            this.$router.push({
                name: 'Product',
                params: { productId: this.id }
            })
        },
        // 添加商品到购物车
        addToCart (selected) {
            if (!this.hasBind()) {
                return
            }
            this.adding = true
            const { count, skuCode2 = '', skuCode1 } = selected
            return new Promise(async (resolve, reject) => {
                try {
                    await addToCart({
                        productId: this.id,
                        productCount: count,
                        skuCode: skuCode1,
                        skuCode2,
                        // 如果当前用户是经纪人，则覆盖其他经纪人的id
                        agentUser: this.shareId
                    })
                    this.$success('已添加到购物车')
                    this.showSpecifica = false
                    this.getCartCount()
                } catch (e) {
                    reject(e)
                } finally {
                    this.adding = false
                }
            })
        },
        // 判断用户有无绑定手机
        hasBind () {
            if (!this.mobile) {
                this.$confirm('您还没有绑定手机，请先绑定手机')
                    .then(() => {
                        sessionStorage.setItem('BIND_MOBILE_FROM', JSON.stringify({
                            name: this.$route.name,
                            params: this.$route.params,
                            query: this.$route.query
                        }))
                        this.$router.push({ name: 'BindMobile' })
                    })
                    .catch(() => {
                    })
                return false
            }
            return true
        }
    }
}
</script>

<style module lang="scss">
  .good-item {
    position: relative;
    width: 100%;
    height: 240px;
    margin-bottom: 18px;
    background-color: #FFF;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    display: flex;
  }

  .good-left {
    position: relative;

    .img {
      object-fit: cover;
      border-radius: $--radius2 $--radius2 0 0;
      width: 276px;
      height: 220px;
    }
  }

  .good-right {
    position: relative;
    flex: 1;
    margin-top: 20px;
    margin-left: 32px;
    overflow: hidden;
    padding-right: 24px;

    h1 {
      width: 100%;
      overflow: hidden;
      word-break: keep-all;
      white-space : nowrap;
      text-overflow: ellipsis;
      font-size: 28px;
      color: #373737;
    }

    .tag {
      width: 100px;
      border-radius: 8px;
      background: #FFFAE6;
      font-size: 20px;
      text-align: center;
      line-height: 34px;
      color: #6B6B6A;
      margin-top: 6px;
    }

    .price {
      margin-top: 25px;
      display: flex;

      .price-item {
        flex: 1;
      }

      .add-cart {
        width: 140px;
        height: 40px;
        background: #FE7700;
        border-radius: 20px;
        font-size: 22px;
        line-height: 40px;
        text-align: center;
        color: #FFF;
      }
    }

    .sales-volume {
      margin-top: 12px;
      font-size: 20px;
      color: #9F9F9F;
    }
  }
</style>
