<template>
    <div :class="$style.titleYuanDan">
        <div
            :class="$style.characterWrapper"
            :style="{ '--length': data.length || 0 }"
        >
            <span :class="$style.characterBg" v-for="(item, index) of data" :key="index">
                {{ item }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TitleYuanDan',
    props: {
        data: {
            type: String,
            default: ''
        }
    },
    data () {
        return {}
    }
}
</script>

<style lang="scss" module>
.title-yuan-dan {
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
</style>
