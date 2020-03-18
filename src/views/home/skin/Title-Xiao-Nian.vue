<template>
    <div
        :class="[
            $style.titleXiaoNian,
            $style['length' + data.split('').length
            ]
        ]"
    >
        <span :class="$style.characterBg" v-for="(item, index) of data" :key="index">
            {{ item }}
        </span>
    </div>
</template>

<script>
export default {
    name: 'TitleXiaoNian',
    props: {
        data: {
            type: String,
            default: ''
        }
    },
    data () {
        return {}
    },
    computed: {
        length () {
            return this.data ? this.data.length : 0
        }
    }
}
</script>

<style lang="scss" module>
.title-xiao-nian {
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
</style>
