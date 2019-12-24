<template>
  <div
    class="skin-title"
    :class="{
      [$style.skinTitle]: true,
      [$style.skinXmas]: skinId === 1,
      [$style.skinYuanDan]: skinId === 2,
      [$style.skinNewYear]: skinId === 3,
      [$style.skinXiaoNian]: skinId === 4
    }"
  >
    <div :class="$style.titleBg" v-if="skinId === 1">
      <div :class="$style.title" v-text="data" />
    </div>
    <div :class="$style.titleBg" v-if="skinId === 2">
      <div
        :class="$style.characterWrapper"
        :style="{ '--length': data.split('').length }"
      >
        <span :class="$style.characterBg" v-for="(item, index) of data.split('')" :key="index">
          {{ item }}
        </span>
      </div>
    </div>
    <div :class="$style.titleBg" v-if="skinId === 3">
      <span :class="$style.characterBg" v-for="(item, index) of data.split('')" :key="index">
        {{ item }}
      </span>
    </div>
    <div :class="[$style.titleBg, $style['length' + data.split('').length]]" v-if="skinId === 4">
      <span :class="$style.characterBg" v-for="(item, index) of data.split('')" :key="index">
        {{ item }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SkinTitle',
  props: {
    data: {
      type: String,
      default: ''
    },
    skinId: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss" module>
.skin-xmas {
  .title-bg {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 126px;
    background: url("https://mallcdn.youpenglai.com/static/admall/skin/xmas/298790c8-dd14-40a0-b1b6-e80995652dc5.png") no-repeat center;
    background-size: 100%;
    .title {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 270px;
      height: 66px;
      background: #23814D;
      border: 3px solid #FFFFFF;
      border-radius: 26px;
      font-size: 36px;
      font-family: Adobe Heiti Std;
      color: #FFFFFF;
      &::before {
        position: absolute;
        left: -33px;
        bottom: -6px;
        content: '';
        width: 80px;
        height: 96px;
        background: url("https://mallcdn.youpenglai.com/static/admall/skin/xmas/7393611f-65e9-4aa7-ad55-5dedc1241183.png") no-repeat center;
        background-size: 100%;
        z-index: 1;
      }
    }
  }
}
.skin-yuan-dan {
  .title-bg {
    position: relative;
    box-sizing: border-box;
    margin-bottom: 6px;
    height: 160px;
    background: url("https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/08048559-9ce4-404c-a2dc-48d5af1c06ed.png") no-repeat center bottom;
    background-size: 618px auto;
    .character-wrapper {
      position: absolute;
      top: 32px;
      left: calc(220px + ((4 - var(--length)) * 38px));
      height: 106px;
    }
    .character-bg {
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      width: 106px;
      height: 106px;
      line-height: 94px;
      text-align: center;
      background: #D41C18;
      border: 4px solid rgba(233,151,47,1);
      border-radius: 50%;
      font-size: 56px;
      font-family: FZQingKeBenYueSongS-R-GB;
      color: #FFFFFF;
      @for $i from 1 through 4 {
        $difference : 76px;
        &:nth-of-type(#{$i}) {
          left: ($i - 1) * $difference;
          z-index: $i;
        }
      }
    }
  }
}
.skin-new-year {
  .title-bg {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 126px;
    background: url("https://mallcdn.youpenglai.com/static/admall/skin/new-year/82d14077-5842-4214-9ad4-b77f3a23818c.png") no-repeat center;
    background-size: 100%;
    .character-bg {
      position: relative;
      top: 4px;
      width: 78px;
      height: 80px;
      background: url("https://mallcdn.youpenglai.com/static/admall/skin/new-year/bc5fc36f-7f23-4be7-85cb-d7db6e410a4a.png") no-repeat center;
      background-size: 100%;
      margin: 0 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 42px;
      font-family: FZQKBYSJW;
      color: #C1181F;
    }
  }
}
.skin-xiao-nian {
  .title-bg {
    margin: 28px 0 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 128px;
    &.length-4 {
      background: url("https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/b1f87881-c0f6-444c-9ab4-778d784d1dda.png") no-repeat center;
      background-size: 100%;
    }
    &.length-3 {
      background: url("https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/44ba3816-0824-4486-8c6d-63372b2e968e.png") no-repeat center;
      background-size: 100%;
      .character-bg {
        letter-spacing: -5px;
      }
    }
    &.length-2 {
      background: url("https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/20e5cb5b-76d6-4986-a6ab-d75ea0b5f6ff.png") no-repeat center;
      background-size: 100%;
    }
    &.length-1 {
      background: url("https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/12c1b559-9bc0-48b7-92c7-072d29e907f0.png") no-repeat center;
      background-size: 100%;
    }
    .character-bg {
      font-size: 56px;
      width: 72px;
      height: 85px;
      font-family: FZQingKeBenYueSongS-R-GB;
      color: #BB181C;
      text-align: center;
      letter-spacing: 8px;
    }
  }
}
</style>
