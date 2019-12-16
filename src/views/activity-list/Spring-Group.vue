<template>
  <div :class="$style.springGroup">
    <div :class="$style.springGroupWrapper">
      <div :class="$style.springGroupTop">
        <div :class="$style.springGroupTopSide" />
        <div :class="$style.springGroupTopContent">
          <h3>新春团购大联欢</h3>
          <p>特色课程齐上阵</p>
        </div>
      </div>
      <div :class="$style.springGroupContent">
        <div :class="$style.current" v-if="listCurrent.length">
          <div :class="$style.title">
            正在进行中
          </div>
          <ul :class="$style.springGroupList">
            <template v-for="(item, i) of listCurrent">
              <item
                :data="item"
                :key="i"
                @done="getData"
              />
            </template>
          </ul>
        </div>

        <div :class="$style.preview" v-if="listPreview.length">
          <div :class="$style.title">
            即将开始
          </div>
          <ul :class="$style.springGroupList">
            <template v-for="(item, i) of listPreview">
              <item
                :data="item"
                :key="i"
                @done="getData"
              />
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Item from '../activity/xin-chun/Item-Pintuan'
import { tuanActivityPage } from '../../apis/product'

export default {
  name: 'SpringGroup',
  components: {
    Item
  },
  data () {
    return {
      listPreview: [],
      listCurrent: []
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    async getData () {
      try {
        let { result } = await tuanActivityPage({ type: '2019_02' })
        if (!result[0].length && !result[1].length) {
          this.$alert({
            message: '暂无数据',
            viceMessage: '逛逛主会场吧~',
            confirmText: '再逛逛'
          }).finally(() => {
            this.$router.go(-1)
          })
          return
        }
        for (let key of Object.keys(result)) {
          for (let item of result[key]) {
            let obj = {
              goodsInfo: {
                id: item.id,
                pageviews: item.pageViews,
                productMainImage: item.productMainImage,
                productName: item.productName,
                activityInfo: {
                  status: item.status,
                  number: item.number,
                  prizePool: item.prizePool,
                  activityPrice: item.price,
                  activityStartTime: item.activityStartTime,
                  activityEndTime: item.activityEndTime
                }
              }
            }
            Object.assign(item, obj)
          }
        }
        this.listPreview = result[0]
        this.listCurrent = result[1]
        return result
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style lang="scss" module>
.spring-group {
  box-sizing: border-box;
  background: #F2D04A;
  padding-top: 32px;
  &-wrapper {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 32px);
  }
  &-top {
    &-side {
      border: 64px solid;
      border-bottom: 32px solid;
      border-top: none;
      border-color: transparent transparent #FE834F transparent;
    }
    &-content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 136px;
      border-top: 4px solid #FFB89A;
      background: #FD6C2F;
      font-size: 26px;
      font-family: Microsoft YaHei;
      color: #FFFFFF;
      text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.20);
      > h3 {
        font-size: 48px;
        font-weight: bold;
      }
      > p {
        margin-top: 8px;
        width: 230px;
        height: 40px;
        line-height: 40px;
        background: #FEAE8C;
        opacity: 0.8;
        border-radius: 96px;
        font-size: 26px;
        font-family: Microsoft YaHei;
        color: rgba(255, 255, 255, 1);
        text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.20);
        text-align: center;
      }
    }
  }
  &-content {
    flex: 1;
    padding: 0 32px 48px;
    background: #F6501D;
  }
  &-list {
    margin: 32px 0;
  }
  .title {
    padding: 32px 0;
    font-size: 36px;
    font-weight: bold;
    line-height: 50px;
    color: #FFFFFF;
    text-align: center;
  }
}
</style>
