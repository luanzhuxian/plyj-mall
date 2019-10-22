<template>
  <div class="bg book-bg">
    <div class="main">
      <div class="list book-ing">
        <div class="head">
          <pl-icon name="icon-ing_icon" color="#fff" size="52" />
          <pl-icon name="icon-ing_text" color="#fff" size="52" />
        </div>
        <div class="item book-item" v-for="(item, k) in ingList" :key="k" @click="jumpToDetail(item.productId)">
          <div class="book-ing-title">预购提前享</div>
          <div class="book-ing-content">
            <div class="img book-img">
              <img :src="item.productMainImage">
            </div>
            <div>
              <div class="title book-title">{{ item.productName }}</div>
              <div class="tips book-tips">预交定金￥{{ item.price }}抵￥{{ item.price }}</div>
              <div class="book-bottom">双十二价位：{{ item.productPrice }}元</div>
            </div>
          </div>
        </div>
      </div>
      <div class="list book-coming">
        <div class="head">
          <pl-icon name="icon-coming_icon" color="#fff" size="52" />
          <pl-icon name="icon-coming_text" color="#fff" size="52" />
        </div>
        <div class="item book-item" v-for="(item, k) in comingList" :key="k" @click="jumpToDetail(item.productId)">
          <count-down
            activity-text="距开始"
            :endtime="item.activityStartTime"
          />
          <div class="book-ing-content">
            <div class="img book-img">
              <img :src="item.productMainImage">
            </div>
            <div>
              <div class="title book-title">{{ item.productName }}</div>
              <div class="tips book-tips">预交定金￥100抵￥200</div>
              <div class="book-bottom">双十二价位：2000元</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bookActivityPage } from '../../apis/product'
import CountDown from './Book-Count-Down'
export default {
  name: 'List',
  components: {
    CountDown
  },
  data () {
    return {
      ingList: [],
      comingList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      bookActivityPage().then(res => {
        this.ingList = res.result[1]
        this.comingList = res.result[0]
      })
    },
    jumpToDetail (id) {
      this.$router.push({ name: 'Lesson', params: { productId: id, brokerId: null } })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./List";
</style>
