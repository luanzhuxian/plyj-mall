<template>
    <!-- 春耘计划礼品组件 -->
    <div :class="[$style.springPloughingGiftItem, $style[color]]">
        <img :src="data.giftImage" alt="">
        <div :class="$style.right">
            <p :class="$style.name" v-text="data.giftName" />
            <p :class="$style.desc" v-text="data.giftBrief" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SpringPloughingGiftItem',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        color: {
            type: String,
            default: 'green'
        }
    }
}
</script>

<style module lang="scss">
  .spring-ploughing-gift-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120px;
    margin-bottom: 20px;
    background-color: #26601F;
    box-shadow: 0 0 0 2px #124E0B inset;
    border-radius: 60px;
    box-sizing: border-box;
    > img {
      width: 168px;
      height: 112px;
      margin: 4px;
      object-fit: cover;
      border: 2px solid #A3D816;
      border-radius: 56px;
    }
  }
  .right {
    flex: 1;
    margin-left: 26px;
    padding: 14px 0;
    font-size: 28px;
    @include elps()
  }
  .name {
    margin-bottom: 4px;
    color: #D1E42C;
    @include elps()
  }
  .desc {
    color: #fff;
    @include elps()
  }
  // 黄色
  .yellow {
    background-color: #F5C36C;
    box-shadow: none;
    > img {
      border: 2px solid #C94828;
    }
    .name {
      color: #C94828;
    }
  }
</style>
