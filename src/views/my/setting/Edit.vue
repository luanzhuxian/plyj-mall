<template>
    <div :class="$style.setting">
        <div :class="$style.top">
            <img
                v-imgError
                :src="avatar"
                alt=""
            >
            <div :class="$style.baseInfo">
                <span
                    :class="$style.name"
                    v-text="userName"
                    @click="editUserName"
                />
                <span
                    :class="$style.level"
                    v-text="roleName"
                />
            </div>
            <image-crop
                style="width: 16vw;height: 16vw; border-radius: 50%; position: absolute;"
                :proportion="{ w: 50, h: 50 }"
                @submit="submitImg"
                v-model="img"
            />
        </div>
        <div :class="$style.set">
            <pl-fields
                text="手机号"
                :right-text="mobile || '未绑定'"
                :route="{ name: 'BindMobile' }"
            />
            <pl-fields
                text="微信号"
                :right-text="userName"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { SET_AVATAR, SET_USERNAME } from '../../../store/mutation-type'
import imageCrop from '../../../components/common/Image-Crop'
import { upload } from '../../../assets/js/upload-image'
import { userInfoSettings } from '../../../apis/base-api'
export default {
    name: 'Setting',
    components: { imageCrop },
    data () {
        return {
            img: {}
        }
    },
    computed: {
        ...mapGetters(['avatar', 'userName', 'mobile', 'roleName'])
    },
    methods: {
        ...mapMutations({ setAvatar: SET_AVATAR, setUserName: SET_USERNAME }),
        submitImg () {
            this.uploadImg()
        },
        getBlobBydataURI (dataURI, type) {
            const binary = atob(dataURI.split(',')[1])
            const array = []
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i))
            }
            return new Blob([new Uint8Array(array)], { type })
        },
        async uploadImg () {
            const $Blob = this.getBlobBydataURI(this.img.base64, 'image/jpeg')
            try {
                this.$indicator.open('正在上传图片')
                const { url } = await upload($Blob)
                await userInfoSettings({ headImgUrl: url })
                this.setAvatar(url)
                this.$success('上传成功')
            } catch (e) {
                throw e
            } finally {
                this.$indicator.close()
            }
        },
        async editUserName () {
            const testUserName = val => /^[a-zA-Z_\u4e00-\u9fa5\\-]{1,12}$/.test(val)
            try {
                const val = await this.$propmt({
                    placeholder: '请输入1-12个字用户名',
                    confirmText: '保存',
                    rules: [
                        { required: true, message: '请输入用户名' },
                        { validator: testUserName, message: '用户名格式为1-12个中文或英文' }
                    ]
                })
                await userInfoSettings({ nickName: val })
                this.setUserName(val)
            } catch (e) {
                if (e.message !== 'cancel') {
                    throw e
                }
            }
        }
    }
}
</script>

<style module lang="scss">
  .mic {
    border: 1px dotted #4fc08d;
    width: 200px;
    height: 100px;
  }
  .top {
    display: flex;
    align-items: center;
    height: 200px;
    padding: 0 28px;
    background-color: #fff;
    img {
      width: 120px;
      height: 120px;
      object-fit: cover;
      border-radius: 50%;
    }
    .dafault-face {
      width: 120px;
    }
    .login-btn {
      width: 200px;
    }
  }
  .base-info {
    margin-left: 28px;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }
  .name {
    font-size: 42px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .level {
    font-size: 22px;
    font-weight: bolder;
    color: #b8b8b8;
    &:before {
      content: 'Lv';
      margin-right: 8px;
    }
  }
  .set {
    width: 642px;
    margin: 28px auto;
    padding: 0 28px;
    border-radius: $--radius1;
    overflow: hidden;
    background-color: #fff;
  }
</style>
