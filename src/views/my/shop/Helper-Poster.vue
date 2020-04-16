<template>
    <div :class="$style.helperQrcode">
        <tab :tabs="array" :active-id.sync="activeId" :color9="true" />
        <div v-show="activeId === 1" :class="$style.helperGuidelines">
            <div :class="$style.imgBox"><img :src="post" alt=""></div>
            <div :class="$style.descriptionBox">
                <p>推广指引：</p>
                <ol>
                    <li>长按海报图片，保存邀请海报到相册；</li>
                    <li>将邀请海报分享到朋友圈或微信好友；</li>
                    <li>用户识别二维码提交helper申请通过，则邀请成功。</li>
                </ol>
            </div>
        </div>
        <div v-show="activeId === 2" :class="$style.qoceBox">
            <div :class="$style.imgBox" ref="imgBox">
                <img :src="qrcode" alt="" ref="qrcode">
            </div>
            <div :class="$style.qrcodeTip">
                <p>快速申请helper通道，出示二维码给用户</p>
                <pl-svg class="mt-40" name="icon-helper-guidelines" height="187" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tab from '../../../components/penglai-ui/Tab'
import { generateQrcode } from '../../../assets/js/util'
import { getHelperData } from '../../../apis/helper-manager'
export default {
    name: 'HelperPoster',
    components: {
        tab
    },
    data () {
        return {
            url: 'baidu.com',
            post: '',
            qrcode: '',
            array: [{ name: '邀请海报', id: 1 }, { name: '面对面邀请', id: 2 }],
            activeId: 1
        }
    },
    computed: {
        ...mapGetters(['mallName', 'mallUrl', 'avatar', 'userName', 'userId', 'roleCode'])
    },
    async mounted () {
        this.qrcode = await generateQrcode({ size: 500, text: `${ this.mallUrl }/my/apply-helper?shareUserId=${ this.userId }&t=${ Date.now() }` })
        this.$refs.qrcode.onload = () => {
            this.drawPost()
        }
    },
    async activated () {
        try {
            const { result } = await getHelperData()

            // 不同helper对应的可邀请helper数量
            const roleCoutMap = {
                ADMIN: 200,
                ENTERPRISE_ADMIN: 21000,
                EMPLOYEE: 200
            }
            if (result.count >= roleCoutMap[this.roleCode]) {
                this.$alert({
                    message: `邀请超过${ roleCoutMap[this.roleCode] }位helper`,
                    viceMessage: '将不活跃的helper降级为普通用户\n' + '再进行helper邀请',
                    confirmText: '朕知道了'
                })
            }
        } catch (e) {
            throw e
        }
    },
    methods: {
        async drawPost () {
            const canImg = new Image()
            canImg.crossOrigin = ''
            canImg.src = `https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/helper-poster.png?time=${ Date.now() }`
            const userImg = new Image()
            userImg.crossOrigin = ''
            userImg.src = `${ this.avatar }?x-oss-process=image/resize,h_100/circle,r_500/format,png&time=${ Date.now() }`
            canImg.onload = async () => {
                const canvas = document.createElement('canvas')
                canvas.width = canImg.width
                canvas.height = canImg.height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(canImg, 0, 0, canvas.width, canvas.height)
                ctx.drawImage(userImg, 48, 48, 74, 74)
                ctx.font = 'bold 24px Georgia'
                ctx.fillText(`${ this.mallName }     ${ this.userName }`, 150, 80)
                ctx.fillText(`邀请您成为Helper！`, 150, 120)
                ctx.drawImage(this.$refs.qrcode, 70, 540, 160, 160)
                const post = canvas.toDataURL('image/jpeg', 0.7)
                this.post = post
            }
        }
    }
}
</script>

<style module lang="scss">
  .helper-qrcode {
    background-color: #F1F4F5;
    .helper-guidelines{
      padding: 40px;
      .img-box {
        margin: 0 auto;
        img {
          width: 100%;
        }
      }
      .description-box{
        margin-top: 40px;
        > p {
          color: #999999;
          font-size: 24px;
          line-height: 40px;
        }
      }
    }
    .qoce-box{
      padding: 72px 68px 40px;
      text-align: center;
      .img-box{
        box-sizing: border-box;
        width: 526px;
        height: 526px;
        margin: 29px auto 64px;
        padding: 38px;
        background-color: #FFFFFF;
        img {
          width: 100% !important;
          height: auto !important;
        }
      }
      .qrcodeTip {
        > p {
          font-size: 24px;
          color: #999;
        }
        > svg {
          width: 100%;
        }
      }
    }
  }
  .description-box {
    color: #999999;
    font-size: 24px;
    line-height: 40px;
    ol {
      counter-reset: num;
      > li {
        &:before {
          counter-increment: num;
          content: counter(num) '. ';
        }
      }
    }
  }
</style>
