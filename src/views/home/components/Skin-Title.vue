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
    <div :class="$style.titleBg" v-if="~[2, 3].indexOf(skinId)">
      <span :class="$style.characterBg" v-for="(item, index) of data.split('')" :key="index">
        {{ item }}
      </span>
    </div>
    <div :class="$style.titleWrapper" v-if="skinId === 4">
      <div :class="$style.titleBg">
        <span :class="$style.characterBg" v-text="data" />
      </div>
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
    background: url("../skin/xmas/title-bg.png") no-repeat center;
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
        background: url("../skin/xmas/hat.png") no-repeat center;
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
    background: url("../skin/yuan-dan/title-bg.png") no-repeat center bottom;
    background-size: 618px auto;
    .character-bg {
      box-sizing: border-box;
      position: absolute;
      top: 32px;
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
          left: 220px + (($i - 1) * $difference);
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
    background: url("../skin/new-year/title-bg.png") no-repeat center;
    background-size: 100%;
    .character-bg {
      position: relative;
      top: 4px;
      width: 78px;
      height: 80px;
      background: url("../skin/new-year/character-bg.png") no-repeat center;
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
  .title-wrapper {
    padding: 28px 0 16px;
  }
  .title-bg {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 128px;
    background: url("../skin/xiao-nian/title-bg.png") no-repeat center;
    background-size: 100%;
    .character-bg {
      position: relative;
      top: -6px;
      left: 4px;
      font-size: 56px;
      font-family: FZQingKeBenYueSongS-R-GB;
      color: #BB181C;
      letter-spacing: 16px;
    }
  }
}
</style>
