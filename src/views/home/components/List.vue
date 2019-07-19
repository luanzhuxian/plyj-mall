<template>
  <div class="more-list">
    <div class="list-head">
      <router-link :to="{name: 'Home'}">
        <i class="iconfont icon-zhenxuan_backx" />
      </router-link>
      甄选好货
    </div>
    <you-like :show-title="true" />
  </div>
</template>

<script>
import YouLike from './YouLike.vue'

export default {
  name: 'List',
  components: {
    YouLike
  }
}
</script>

<style lang="scss" scoped>
  .more-list {
    background: #ffffff;
    .list-head {
      height: 88px;
      line-height: 88px;
      font-size: 36px;
      text-align: center;
      box-shadow: 0 1px 0 0 #e7e7e7;
      position: relative;
      a {
        color: #2e2e2e;
        i {
          position: absolute;
          left: 30px;
          top: 0;
          font-size: 40px
        }
      }
    }
  }
</style>
