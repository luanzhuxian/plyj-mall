<template>
    <div class="winning-prize poster" v-if="show">
        <div class="prize-box poster-box">
            <img v-imgError :src="poster">
            <div class="press-save">长按识别或保存海报，分享给朋友吧！</div>
        </div>
        <div class="winning-prize-close poster-close">
            <pl-svg @click="close" name="icon-close3" fill="#fff" width="40" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SharePoster',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        poster: {
            type: String,
            default: ''
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
            this.$emit('close')
        }
    }
}
</script>

<style scoped lang="scss">
  /* 海报样式 */
  .winning-prize {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.65);
    padding: 300px 122px 0 122px;
    z-index: 1;

    .prize-box {
      padding: 40px 16px;
      background-color: #FA4D2F;
      border-radius: 20px;
    }

    .winning-prize-close {
      margin-top: 64px;
      text-align: center;
    }
  }
  .poster {
    padding: 80px 110px 0 110px;

    .poster-box {
      padding: 0;
      background: none;
      border: none;

      img {
        width: 100%;
      }

      .press-save {
        padding: 14px 0;
        text-align: center;
        background-color: #fff;
        color: #bbb;
        font-size: 28px;
        font-weight: 400;
      }
    }

    .poster-close {
      margin-top: 20px;
    }
  }
</style>
