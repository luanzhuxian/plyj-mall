<template>
  <div :class="$style.barndIntro + ' radius-20'">
    <div :class="$style.imgs">
      <img class="radius-10" src="//img.alicdn.com/imgextra/i1/1652742042/TB2wHiEdCzqK1RjSZPcXXbTepXa_!!1652742042.jpg_1080x1800Q50s50.jpg_.webp" alt="">
      <img class="radius-10" src="//img.alicdn.com/imgextra/i3/1652742042/TB2aHS2dxjaK1RjSZKzXXXVwXXa_!!1652742042.jpg_1080x1800Q50s50.jpg_.webp" alt="">
      <img class="radius-10" src="//img.alicdn.com/imgextra/i2/1652742042/TB22mjxXhTpK1RjSZFGXXcHqFXa_!!1652742042.jpg_1152x1920Q50s50.jpg_.webp" alt="">
      <img class="radius-10" src="//img.alicdn.com/imgextra/i4/1652742042/TB2c6tcmrZnBKNjSZFKXXcGOVXa_!!1652742042.jpg_1152x1920Q50s50.jpg_.webp" alt="">
    </div>
    <div :class="$style.name">
      <span>西安有鹏来教育</span>
      <pl-svg name="right" />
    </div>
    <div :class="$style.desc">
      语雀是一款优雅高效的在线文档编辑与协同工具， 让每个企业轻松拥有文档中心阿里巴巴集团内部使用多年，众多中小企业首选。
    </div>
  </div>
</template>

<script>
export default {
  name: 'Brand-Intro'
}
</script>

<style module lang="scss">
  .barnd-intro {
    padding: 30px 0 30px 30px;
    background-color: #fff;
    margin-top: 28px;
  }
  .imgs {
    overflow: auto;
    white-space: nowrap;
    img {
      width: 280px;
      height: 187px;
      margin-right: 16px;
      object-fit: cover;
      &:nth-last-of-type(1) {
        margin-right: 28px;
      }
    }
  }
  .name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 28px;
    margin: 24px 0;
    span {
      font-size: 36px;
      font-weight: bold;
    }
    svg {
      width: 18px;
      fill: #bbb;
    }
  }
  .desc {
    font-size: 24px;
    padding-right: 20px;
    color: #666;
  }
</style>
