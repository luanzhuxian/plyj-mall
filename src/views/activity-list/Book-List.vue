<template>
  <div class="bg book-bg">
    <!-- <div class="rule" @click="showRule = true">活动规则</div> -->
    <div class="main">
      <div class="list book-ing" v-if="ingList.length > 0">
        <div class="head">
          <pl-svg name="icon-ing_icon" width="52" />
          <pl-svg name="icon-ing_text" width="180" height="52" />
        </div>
        <div class="item book-item" v-for="(item, k) in ingList" :key="k" @click="jumpToDetail(item.productId)">
          <count-down
            activity-text="距结束"
            :endtime="item.activityEndTime"
            @done="getList"
          />
          <div class="book-ing-content">
            <div class="img book-img">
              <img :src="item.productMainImage">
            </div>
            <div>
              <div class="title book-title">{{ item.productName }}</div>
              <div class="tips book-tips">预售到手价：{{ getTotalPrice(item) }}元</div>
              <div class="book-bottom">
                <span>预交定金￥{{ item.price }}</span>
                <span v-if="item.price && item.multiple && item.multipleNumber > 1">抵￥{{ item.price * item.multipleNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list book-coming" v-if="comingList.length > 0">
        <div class="head">
          <pl-svg name="icon-coming_icon" width="52" />
          <pl-svg name="icon-coming_text" width="135" height="52" />
        </div>
        <div class="item book-item" v-for="(item, k) in comingList" :key="k" @click="jumpToDetail(item.productId)">
          <count-down
            activity-text="距开始"
            :endtime="item.activityStartTime"
            @done="getList"
          />
          <div class="book-ing-content">
            <div class="img book-img">
              <img :src="item.productMainImage">
            </div>
            <div>
              <div class="title book-title">{{ item.productName }}</div>
              <div class="tips book-tips">预售到手价：{{ getTotalPrice(item) }}元</div>
              <div class="book-bottom">
                <span>预交定金￥{{ item.price }}</span>
                <span v-if="item.price && item.multiple && item.multipleNumber > 1">抵￥{{ item.price * item.multipleNumber }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pl-popup
      :show.sync="showRule"
      title="活动细则"
      @close="showRule = false"
    >
      <div>sfsf</div>
    </pl-popup>
  </div>
</template>

<script>
import { bookActivityPage } from '../../apis/product'
import CountDown from './Book-Count-Down'
function sub (arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

export default {
  name: 'List',
  components: {
    CountDown
  },
  data () {
    return {
      ingList: [],
      comingList: [],
      showRule: false
    }
  },
  async activated () {
    try {
      await this.getList()
    } catch (e) {
      throw e
    }
  },
  methods: {
    async getList () {
      try {
        let { result } = await bookActivityPage({ type: '2019_01' })
        if (!result[0].length && !result[1].length) {
          this.$alert({
            message: '暂无数据',
            viceMessage: '逛逛主会场吧~',
            confirmText: '再逛逛'
          })
            .finally(() => {
              this.$router.go(-1)
            })
          return
        }
        this.ingList = result[1]
        this.comingList = result[0]
        return result
      } catch (e) {
        throw e
      }
    },
    jumpToDetail (id) {
      this.$router.push({ name: 'Product', params: { productId: id }, query: { currentProductStatus: 4 } })
    },
    getTotalPrice (item) {
      const { productPrice, price, multipleNumber = 1 } = item
      const activityPrice = price * multipleNumber
      if (multipleNumber === 1) {
        return productPrice
      }
      if (activityPrice >= productPrice) {
        return price
      }
      if (activityPrice < productPrice) {
        return sub(productPrice, price * (multipleNumber - 1))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./List";
</style>
