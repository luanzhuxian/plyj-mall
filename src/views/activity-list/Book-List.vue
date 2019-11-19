<template>
  <div class="bg book-bg">
    <!-- <div class="rule" @click="showRule = true">活动规则</div> -->
    <div class="main">
      <div class="list book-ing" v-if="ingList.length > 0">
        <div class="head">
          <pl-icon name="icon-ing_icon" color="#fff" size="52" />
          <pl-icon name="icon-ing_text" color="#fff" size="52" />
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
              <div class="tips book-tips">预交定金￥{{ item.price }} <span v-if="item.multipleNumber > 1">抵￥{{ item.price * item.multipleNumber }}</span></div>
              <div class="book-bottom">双十二价位：{{ item.productPrice }}元</div>
            </div>
          </div>
        </div>
      </div>
      <div class="list book-coming" v-if="comingList.length > 0">
        <div class="head">
          <pl-icon name="icon-coming_icon" color="#fff" size="52" />
          <pl-icon name="icon-coming_text" color="#fff" size="52" />
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
              <div class="tips book-tips">预交定金￥{{ item.price }} <span v-if="item.multipleNumber > 1">抵￥{{ item.price * item.multipleNumber }}</span></div>
              <div class="book-bottom">双十二价位：{{ item.productPrice }}元</div>
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
      this.$router.push({ name: 'Lesson', params: { productId: id, currentProductStatus: 4 } })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./List";
</style>
