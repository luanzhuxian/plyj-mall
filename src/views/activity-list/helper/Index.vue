<template>
    <div class="long-men-helper">
        <div class="product-list">
            <img
                :src="isHelper ? 'https://mallcdn.youpenglai.com/static/admall/2.9.0/helper-title-helper-member.png' : 'https://mallcdn.youpenglai.com/static/admall/2.9.0/helper-title-normal-member.png'"
                alt=""
                class="title"
            >
            <div class="content">
                <div class="list">
                    <div v-if="!productList.length" class="no-content">
                        <pl-svg
                            name="icon-no-content"
                            width="300"
                            height="200"
                        />
                        <p>当前没有分销商品</p>
                    </div>
                    <template v-else>
                        <ProductItem
                            v-for="item of productList"
                            :key="item.productId"
                            :is-helper="isHelper"
                            :product-id="item.productId"
                            :product-type="item.type"
                            :product-img="item.productImg"
                            :product-name="item.productName"
                            :rebate="item.rebate"
                            :definite-type="item.definiteType"
                            :price="item.price"
                            :origin-price="item.originPrice"
                        />
                    </template>
                </div>
            </div>
        </div>
        <!--非helper的普通会员才可申请为helper-->
        <div v-if="!isHelper && isMembership" class="long-men-apply-helper" @click="$router.push({ name: 'ApplyHelper' })">成为helper赚取更多润笔</div>
    </div>
</template>

<script>
import ProductItem from './components/Product-Item'
import { mapGetters } from 'vuex'
import { getHelperProductList } from './../../../apis/helper-manager'
export default {
    name: 'HelperActivity',
    components: {
        ProductItem
    },
    computed: {
        ...mapGetters(['agentUser', 'roleCode'])
    },
    data () {
        return {
            loading: false,
            productList: [],
            isHelper: false,
            isMembership: false
        }
    },
    async activated () {
        try {
            await this.getList()
            this.isHelper = this.agentUser
            this.isMembership = this.roleCode === 'MEMBERSHIP'
        } catch (e) {
            throw e
        }
    },
    methods: {
        async  getList () {
            try {
                const { result } = await getHelperProductList()
                this.productList = result
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .long-men-helper {
    width: calc(100vw - 20px * 2);
    min-height: calc(100vh - 30px - 56px);
    padding: 30px 20px 56px;
    background-color: #FFDE8A;
  }

  .product-list {
    width: 100%;
    min-height: calc(100vh - 30px - 56px - 64px);
    padding-bottom: 64px;
    border-radius:20px;
    background-color: rgba(255, 255, 255, 0.6);
  }

  .title {
    width: 100%;
    margin-bottom: 30px;
  }
  .content {
    .list {
      width: calc(100% - 16px * 2);
      padding: 0 16px;
    }
  }
  .no-content{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 200px;
    p {
      margin-top: 20px;
      font-size: 32px;
      color: #999;
    }
  }
  .long-men-apply-helper {
    position: fixed;
    bottom: 30vh;
    right: 0;
    padding: 0 16px;
    border-radius:60px 0px 0px 60px;
    line-height: 66px;
    font-size:24px;
    color: #FFF;
    background-color: #F2B036;
  }
</style>
