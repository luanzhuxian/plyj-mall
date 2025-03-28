<template>
    <div :class="$style.couponActivity">
        <div :class="$style.couponActivityTop">
            <CouponItem
                :coupon-id="couponInfo.id"
                :coupon-type="couponInfo.type"
                :name="couponInfo.name"
                :amount="couponInfo.amount"
                :full="couponInfo.useLimitAmount"
                :subtract="couponInfo.amount"
                :use-start-time="couponInfo.useStartTime"
                :use-end-time="couponInfo.useEndTime"
                :can-receive="couponInfo.canReceive"
            />
            <div :class="$style.counterTitle">
                限时优惠，满{{ couponInfo.useLimitAmount }}减{{ couponInfo.amount }}，可选择以下商品凑单购买
            </div>
            <div :class="$style.sort">
                <div @click="sort('isByComprehensive')">
                    <span :class="{ [$style.changeColor]: isByComprehensive }">综合</span>
                    <pl-svg
                        class="ml-10"
                        :name="isByComprehensiveDown? 'icon-triangle-down': 'icon-triangle'"
                        fill="#747474"
                        width="20"
                    />
                </div>
                <div @click="sort('isBySaleCount')">
                    <span :class="{ [$style.changeColor]: isBySaleCount }">销量</span>
                    <pl-svg
                        class="ml-10"
                        :name="isBySaleCountDown? 'icon-triangle-down': 'icon-triangle'"
                        fill="#747474"
                        width="20"
                    />
                </div>
            </div>
        </div>
        <div :class="$style.productList">
            <LoadMore
                :request-methods="getProductList"
                :form="form"
                @refresh="refreshHandler"
                @more="refreshHandler"
                ref="loadMore"
                no-content-tip="此优惠券下还没有商品"
                no-icon
            >
                <template v-for="(item, index) of productList">
                    <!-- 商品图片 商品名称 新春特价 价格 付款人数 加入购物车 -->
                    <CouponGoodItem
                        :key="index"
                        :id="item.id"
                        :img="item.productMainImage"
                        :title="item.productName"
                        :original-price="item.productSkuModels.length && item.productSkuModels[0].originalPrice"
                        :sales-volume="item.salesVolume"
                        :detail="item"
                    />
                </template>
            </LoadMore>
        </div>
    </div>
</template>

<script>
import LoadMore from '../../../components/common/Load-More.vue'
import CouponItem from '../../../components/my/coupon/Coupon-Item.vue'
import CouponGoodItem from '../../../components/my/coupon/Coupon-Good-Item.vue'
import { getProductList, getCouponDetail } from '../../../apis/my-coupon'

export default {
    name: 'CouponActivity',
    components: {
        LoadMore,
        CouponItem,
        CouponGoodItem
    },
    data () {
        return {
            couponId: '',
            couponInfo: {
                id: '',
                name: '',
                type: 1,
                amount: 0,
                useLimitAmount: 0,
                useStartTime: '',
                useEndTime: '',
                instruction: '',
                isClaimed: false,
                canReceive: ''
            },
            // 增加节流阀
            isCouponLoading: false,
            form: {
                current: 1,
                size: 10,
                couponType: 1,
                couponId: '',
                sortComplex: true,
                // DESC 从大到小，ASC从小到大
                isDESC: true
            },
            // 是否综合排序
            isByComprehensive: true,
            // 是否综合排序从大到小
            isByComprehensiveDown: true,
            // 是否按照销量排序
            isBySaleCount: false,
            // 是否按照销量排序从大到小
            isBySaleCountDown: true,
            getProductList,
            // 商品列表
            productList: [],
            // 是否重新加载商品列表页
            isReload: true
        }
    },
    computed: {},
    created () {
    },
    beforeRouteEnter (to, from, next) {
        //  这里的vm指的就是vue实例，可以用来当做this使用
        next(vm => {
            vm.isReload = from.name !== 'Product'
            vm.initialize()
        })
    },
    methods: {
        async initialize () {
            try {
                this.couponId = this.$route.params.couponId
                const { result } = await getCouponDetail(this.couponId)
                // 设置优惠券的详情
                this.couponInfo.id = result.id
                this.couponInfo.name = result.couponName
                this.couponInfo.type = result.couponType
                this.couponInfo.amount = result.amount
                this.couponInfo.useLimitAmount = result.useLimitAmount
                this.couponInfo.useStartTime = result.useStartTime
                this.couponInfo.useEndTime = result.useEndTime
                this.couponInfo.instruction = result.brief
                this.couponInfo.isClaimed = result.claimed
                this.couponInfo.canReceive = result.canReceive

                // 设置查询当前优惠券下的商品列表参数
                this.form.current = 1
                this.form.couponType = result.couponType
                this.form.couponId = this.couponId

                // 获取商品详情
                if (this.isReload) this.$refs.loadMore.refresh()
            } catch (e) {
                throw (e)
            }
        },
        // 排序
        sort (keyword) {
            if (keyword === 'isByComprehensive') {
                this.isByComprehensiveDown = this.isByComprehensive ? !this.isByComprehensiveDown : true
                this.isByComprehensive = true
                this.isBySaleCount = false
                this.isBySaleCountDown = true
                this.form.sortComplex = true
                this.form.isDESC = this.isByComprehensiveDown
            } else {
                this.isByComprehensive = false
                this.isByComprehensiveDown = true
                this.isBySaleCountDown = this.isBySaleCount ? !this.isBySaleCountDown : true
                this.isBySaleCount = true
                this.form.sortComplex = false
                this.form.isDESC = this.isBySaleCountDown
            }
            this.form.current = 1
            this.$refs.loadMore.refresh()
        },
        refreshHandler (list) {
            this.productList = list
        }
    }
}
</script>

<style module lang="scss">
  .coupon-activity {
    position: relative;
    padding-bottom: 88px;
    background-color: #f1f4f5;
    margin: 24px;
  }

  .coupon-activity-top {
    padding-top: 24px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #f4f5f9;
    box-sizing: border-box;
    width: 98vw;
  }
  .counter-title {
    font-size: 24px;
    line-height: 24px;
    color: #414141;
    text-align: center;
    margin: 20px 0;
  }

  .sort {
    height: 76px;
    padding: 0 26px;
    margin-bottom: 20px;
    border-radius: 20px;
    background: #FFFFFF;
    display: flex;
    > div {
      width: 180px;
      font-size:28px;
      line-height:76px;
      span {
        color: #373737;
        &.changeColor {
          color: #FE7700;
        }
      }
    }
  }

  .product-list {
    margin-top: 450px;
  }
</style>
