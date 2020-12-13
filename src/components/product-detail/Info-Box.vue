<template>
    <div
        v-if="!loading"
        :class="$style.detailInfoBox"
    >
        <div :class="$style.detailBox">
            <slot />
        </div>
    </div>
    <div
        v-else
        :class="$style.skeleton"
    >
        <div :class="$style.skeleton1 + ' ' + $style.skeAnimation" />
        <div :class="$style.skeleton2 + ' ' + $style.skeAnimation" />
        <div :class="$style.skeleton3 + ' ' + $style.skeAnimation" />
        <div :class="$style.skeleton4 + ' ' + $style.skeAnimation" />
        <div :class="$style.skeleton5 + ' ' + $style.skeAnimation" />
    </div>
</template>

<script>
export default {
    name: 'DetailInfoBox',
    props: {
        loading: Boolean
    }
}
</script>

<style module lang="scss">
  .detail-info-box {
    position: relative;
    background-color: #fff;
    z-index: 10; // swiper的指示器是10, 这里不能低于10
    .detail-box {
      padding: 12px 24px;
      overflow: hidden;
    }
  }
  .skeleton {
    position: relative;
    top: -60px;
    width: 670px;
    margin: 0 auto;
    background-color: #fff;
    padding: 40px 30px;
    z-index: 11; // swiper的指示器是10, 这里不能低于10
    box-shadow: 0 20px 50px rgba(0, 0, 0, .1);
    box-sizing: border-box;
  }
  .skeleton1 {
    width: 400px;
    height: 48px;
  }
  .skeleton2 {
    width: 500px;
    height: 32px;
    margin-top: 16px;
  }
  .skeleton3 {
    width: 200px;
    height: 67px;
    margin-top: 40px;
  }
  .skeleton4 {
    width: 500px;
    height: 40px;
    margin-top: 30px;
  }
  .skeleton5 {
    width: 400px;
    height: 48px;
    margin-top: 20px;
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
</style>
