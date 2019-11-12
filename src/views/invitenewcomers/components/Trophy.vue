<template>
  <div :class="$style.trophy">
    <div
      :class="$style.trophyItem"
      v-for="(item, i) of gifts"
      :key="'i' + i"
    >
      <img :src="item.giftImage" alt="">
      <div :class="$style.info">
        <span v-text="item.giftName" />
      </div>
    </div>
    <div
      :class="$style.trophyItem"
      v-for="(item, i) of conpons"
      :key="i"
    >
      <pl-icon name="icon-youhuiquan2" type="svg" width="60" height="60" />
      <div :class="$style.info">
        <span style="margin: 0;" v-text="item.couponName" /><span>:</span><span>满{{ item.useLimitAmount }}减{{ item.amount }}</span>
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
    },
    conpons: {
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
    margin-bottom: 20px;
    padding: 0 20px;
    border: 4px solid #eee;
    border-radius: 20px;
    &:nth-last-of-type(1) {
      margin-bottom: 0;
    }
    > img {
      width: 98px;
      height: 98px;
      margin-right: 16px;
      object-fit: cover;
    }
    > svg {
      margin-right: 20px;
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
