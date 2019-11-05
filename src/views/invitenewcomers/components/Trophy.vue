<template>
  <div :class="$style.trophy">
    <div
      :class="$style.trophyItem"
      v-for="(item, i) of gifts"
      :key="i"
    >
      <img :src="item.giftImage" alt="">
      <div :class="$style.info">
        <span style="margin: 0;" v-text="item.giftName" /><span>:</span><span v-text="item.giftBrief" />
        <i>x{{ item.stock }}</i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Trophy',
  props: {
    gifts: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style module lang="scss">
  .trophy {
    padding: 18px 20px 30px;
    background-color: #fff;
  }
  .trophy-item {
    display: flex;
    align-items: center;
    height: 114px;
    padding: 0 20px;
    border: 4px solid #eee;
    border-radius: 20px;
    > img {
      width: 98px;
      height: 98px;
      margin-right: 20px;
      object-fit: cover;
    }
    > .info {
      display: flex;
      align-items: center;
      > span {
        display: inline-block;
        max-width: 400px;
        margin-right: 16px;
        font-size: 28px;
        color: #666;
        @include elps()
      }
      i {
        display: inline-block;
        font-size: 24px;
        color: #999;
      }
    }
  }
</style>
