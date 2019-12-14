<template>
  <div :class="$style.springBook">
    <div :class="$style.springBookWrapper">
      <div :class="$style.springBookTop">
        <div :class="$style.springBookTopSide" />
        <div :class="$style.springBookTopContent">
          <h3>预购享翻倍</h3>
          <p>现金翻番番</p>
        </div>
      </div>
      <div :class="$style.springBookContent">
        <div :class="$style.current">
          <div :class="$style.title">
            正在进行中
          </div>
          <ul :class="$style.springBookList" v-if="listCurrent.length">
            <template v-for="(item, i) of listCurrent">
              <item
                v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                :data="item"
                :key="i"
              />
            </template>
          </ul>
        </div>

        <div :class="$style.preview">
          <div :class="$style.title">
            即将开始
          </div>
          <ul :class="$style.springBookList" v-if="listPreview.length">
            <template v-for="(item, i) of listPreview">
              <item
                v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                :data="item"
                :key="i"
              />
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Item from '../activity/xin-chun/Item-Yugou'
import { bookActivityPage } from '../../apis/product'

export default {
  name: 'SpringBook',
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
        let { result } = await bookActivityPage()
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
        this.listPreview = result[1]
        this.listCurrent = result[0]
        return result
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style lang="scss" module>
.spring-book {
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
      border-color: transparent transparent #DC4F44 transparent;
    }
    &-content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 136px;
      border-top: 4px solid #F3867E;
      background: #FB2A33;
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
    background: #F5574B;
  }
  &-list {
    margin: 32px 0;
  }
  .title {
    margin-top: 32px;
    font-size: 36px;
    font-weight: bold;
    line-height: 50px;
    color: #FFFFFF;
    text-align: center;
  }
}
</style>
