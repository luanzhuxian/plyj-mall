<template>
    <div class="icon-item"
         @click="clickHandler"
    >
        <div class="icon">
            <img v-if="hasSignin"
                 src="https://mallcdn.youpenglai.com/static/admall/2.9.0/did-siginin-icon.jpg">
            <img v-else class="not-sign"
                 src="https://mallcdn.youpenglai.com/static/admall/2.9.0/no-signin-icon.jpg">
            <span v-if="!hasSignin">{{ materialDesc }}</span>
        </div>
        <p :class="{'not-sign': !hasSignin}">{{ iconName }}</p>
    </div>
</template>

<script>
export default {
    name: 'SigninIcon',
    props: {
        // 签到节点详情
        detail: {
            type: Object,
            default () {
                return {}
            }
        },
        // 当前签到节点是否签到
        hasSignin: Boolean,
        // 当前签到节点关键字
        materialDesc: {
            type: String,
            default: ''
        },
        // 当前签到节点名称
        iconName: {
            type: String,
            default: ''
        }
    },
    methods: {
        async clickHandler () {
            try {
                this.$emit('clickHandler', this.detail)
            } catch (e) {
                throw e
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .icon-item {
    display: inline-block;
  }

  .icon {
    position: relative;
    text-align: center;

    img {
      width: 95px;
      height: 112px;
      object-fit: contain;
    }

    span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin-top: -3px;
      font-size: 36px;
      color: #FFF;
    }
  }

  p {
    line-height: 40px;
    text-align: center;
    font-size: 20px;
    color: #FFA659;

    &.not-sign {
      color: #2E9472;
    }
  }
</style>
