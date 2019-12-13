<template>
  <div :class="$style.yugou">
    <div :class="$style.yugouTop">
      <div :class="$style.yugouTopSide" />
      <router-link :class="$style.yugouTopContent" tag="div" :to="{ name: 'BookList' }">
        <h3>预购享翻倍</h3>
        <p v-if="data.otherValue">
          {{ `${data.otherValue}人参与 查看更多>` }}
        </p>
        <p v-else>
          查看更多>
        </p>
      </router-link>
    </div>
    <ul :class="$style.yugouList" v-if="data.values.length">
      <template v-for="(item, i) of data.values">
        <item
          v-if="item.goodsInfo && item.goodsInfo.activityInfo"
          :data="item"
          :key="i"
        />
      </template>
    </ul>
  </div>
</template>

<script>
import Item from './Item-Yugou.vue'

export default {
  name: 'Yugou',
  components: {
    Item
  },
  props: {
    data: {
      type: Object,
      default () {
        return { values: [] }
      }
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" module>
  .yugou {
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
        }
      }
    }
    &-list {
      padding: 52px 32px 48px;
      background: #F5574B;
    }
  }
</style>
