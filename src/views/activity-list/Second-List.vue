<template>
  <div class="bg second-bg">
    <!-- <div class="rule" @click="showRule = true">活动规则</div> -->
    <div class="main">
      <div class="list second-ing" v-if="ingList.length > 0">
        <div class="head">
          <pl-icon name="icon-ing_icon" color="#fff" size="52" />
          <pl-icon name="icon-ing_text" color="#fff" size="52" />
        </div>
        <div class="item" v-for="(item, k) in ingList" :key="k" @click="jumpToDetail(item.productId)">
          <div class="img">
            <img :src="item.productMainImage" object-fit="cover">
            <div class="count-down">
              <count-down
                activity-text="距结束"
                :endtime="item.activityEndTime"
                @done="getList"
              />
            </div>
          </div>
          <div>
            <div class="title">{{ item.productName }}</div>
            <div class="tips">限量秒杀，下单仅{{ item.price }}元</div>
            <div class="progress">
              <div class="inner" :style="{width: `${(Number(item.number) - Number(item.stock)) / Number(item.number) * 100}%`}" />
            </div>
            <div class="remain">剩余 {{ item.stock }} 件</div>
            <div class="bottom">
              <div class="price-bar">
                <pl-icon name="icon-miaoshajia" type="svg" width="100" height="50" />
                <div class="price">{{ item.price }}</div>
              </div>
              <div class="miao-btn">
                <pl-icon name="icon-second" color="#fff" type="svg" width="37" height="37" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list second-coming" v-if="comingList.length > 0">
        <div class="head">
          <pl-icon name="icon-coming_icon" color="#fff" size="52" />
          <pl-icon name="icon-coming_text" color="#fff" size="52" />
        </div>
        <div class="item" v-for="(item, k) in comingList" :key="k" @click="jumpToDetail(item.productId)">
          <div class="img">
            <img :src="item.productMainImage">
            <div class="count-down">
              <count-down
                activity-text="距开始"
                :endtime="item.activityStartTime"
                @done="getList"
              />
            </div>
          </div>
          <div>
            <div class="title">{{ item.productName }}</div>
            <div class="tips">限量秒杀，下单仅{{ item.price }}元</div>
            <div class="progress">
              <div class="inner" :style="{width: `${(Number(item.number) - Number(item.stock)) / Number(item.number) * 100}%`}" />
            </div>
            <div class="focus">{{ item.pageViews }} 人已关注</div>
            <div class="bottom">
              <div class="price-bar">
                <pl-icon name="icon-miaoshajia" type="svg" width="100" height="50" />
                <div class="price">{{ item.price }}</div>
              </div>
              <div class="view-btn">查看</div>
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
import { secondActivityPage } from '../../apis/product'
import CountDown from './Count-Down'
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
      secondActivityPage().then(res => {
        this.ingList = res.result[1]
        this.comingList = res.result[0]
      })
    },
    jumpToDetail (id) {
      this.$router.push({ name: 'Lesson', params: { productId: id } })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./List";
</style>
