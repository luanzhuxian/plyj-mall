<template>
    <div class="icon-item"
         @click="clickHandler"
    >
        <div class="icon">
            <img v-if="hasSignin"
                 src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/checked.png">
            <img v-else class="not-sign"
                 src="https://mallcdn.youpenglai.com/static/mall/2.15.0/signIn/un_checked.png">
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
        clickHandler () {
            this.$emit('clickHandler', this.detail)
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
      width: 96px;
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
    color: #F60000;

    &.not-sign {
      color: #373737;
    }
  }
</style>
