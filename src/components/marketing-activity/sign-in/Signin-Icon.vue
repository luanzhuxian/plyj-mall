<template>
    <div>
        <div @click="clickHandler">
            <div class="icon"
                 :class="{'disabled': !hasSignin}"
                 :style="{backgroundImage: 'url(' + (hasSignin ? iconImgChecked : iconImg) + ')' }">
                {{ materialDesc }}
            </div>
            <p :class="{'not-sign': !hasSignin}">{{ iconName }}</p>
        </div>
        <SigninPoster :show.sync="signPosterShow" :poster-url="detail.posterUrl"
                      :is-show-log="isShowLog" :log-img-url="logImgUrl" />
    </div>
</template>

<script>
import SigninPoster from './Signin-Poster'
export default {
    name: 'SigninIcon',
    components: { SigninPoster },
    data () {
        return {
            signPosterShow: false
        }
    },
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
        },
        // 图标图片
        iconImg: {
            type: String,
            default: ''
        },
        // 图标高亮图片
        iconImgChecked: {
            type: String,
            default: ''
        },
        isShowLog: {
            type: Number,
            default: 0
        },
        logImgUrl: {
            type: String,
            default: ''
        }
    },
    methods: {
        clickHandler () {
            if (!this.detail.hasSignin) return
            this.signPosterShow = true
        }
    }
}
</script>

<style scoped lang="scss">
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    color: #FFE3C8;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 82px;
    height: 68px;
    &.disabled{
      color: #fff;
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
