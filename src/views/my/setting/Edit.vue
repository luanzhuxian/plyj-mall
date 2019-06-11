<template>
  <div :class="$style.setting">
    <div :class="$style.top">
      <img
        :src="img.base64||avatar"
        alt=""
      >
      <div :class="$style.baseInfo">
        <span
          :class="$style.name"
          v-text="userName"
          @click="editUserName()"
        />
        <span
          :class="$style.level"
          v-text="roleName"
        />
      </div>
      <image-crop
        style="width: 16vw;height: 16vw;border-radius: 50%;position: absolute;"
        :proportion="{ w: 50, h: 50 }"
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
    <div
      :class="$style.inputBg"
      v-if="inputShow"
      @click="inputShow = false"
    >
      <div @click.stop>
        <div :class="$style.inputTop">
          <input
            type="text"
            v-model="newUserName"
            placeholder="请输入1-12位字符用户名"
          >
        </div>
        <div :class="$style.inputBottom">
          <div
            :class="$style.cancel"
            @click="cancel()"
          >
            取消
          </div>
          <div
            :class="$style.confirm"
            @click="confirm()"
          >
            保存
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { SET_AVATAR, SET_USERNAME } from '../../../store/mutation-type'
import imageCrop from '../../../components/Image-Crop'
import { upload } from '../../../assets/js/upload-image'
import { userInfoSettings } from '../../../apis/base-api'
import { Indicator } from 'mint-ui'
export default {
  name: 'Setting',
  data () {
    return {
      img: {},
      inputShow: false,
      newUserName: ''
    }
  },
  components: { imageCrop },
  computed: {
    ...mapGetters(['avatar', 'userName', 'mobile', 'roleName'])
  },
  watch: {
    async img (val) {
      if (val.base64) {
        this.uploadImg()
      }
    }
  },
  methods: {
    ...mapMutations({ setAvatar: SET_AVATAR, setUserName: SET_USERNAME }),
    getBlobBydataURI (dataURI, type) {
      let binary = atob(dataURI.split(',')[1])
      let array = []
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], { type: type })
    },
    async uploadImg () {
      const $Blob = this.getBlobBydataURI(this.img.base64, 'image/jpeg')
      Indicator.open('正在上传图片')
      const res = await upload({ file: $Blob })
      if (res && res.url) {
        const settingRes = await userInfoSettings({ headImgUrl: res.url })
        if ((settingRes.devMessage === 'SUCCESS') && (settingRes.status === 200)) {
          this.setAvatar(res.url)
          console.log(settingRes)
        }
      }
      Indicator.close()
    },
    editUserName () {
      this.inputShow = true
    },
    cancel () {
      this.newUserName = ''
      this.inputShow = false
    },
    async confirm () {
      // const reg = /^[\u4e00-\u9fa5]+$/
      var regex = new RegExp('^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$')
      if (!this.newUserName) {
        return this.$toast('请输入用户名')
      }
      if (!regex.test(this.newUserName)) {
        return this.$toast('不能输入字符及空格')
      }
      if (this.newUserName.length > 12) {
        return this.$toast('请输入1-12位汉字')
      }

      const res = await userInfoSettings({ nickName: this.newUserName })
      if ((res.devMessage === 'SUCCESS') && (res.status === 200)) {
        this.setUserName(this.newUserName)
        this.inputShow = false
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
    width: 670px;
    margin: 28px auto;
    padding-left: 28px;
    border-radius: $--radius1;
    overflow: hidden;
    background-color: #fff;
  }
  .input-bg{
    justify-content: center;
    align-items: center;
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background:rgba(0,0,0,0.65);
    >div{
      width:544px;
      height:260px;
      background:rgba(255,255,255,1);
      border-radius:20px;
      .input-top{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 158px;
        border-bottom: 1px solid #ddd;
      }
      .input-bottom{
        display: flex;
        flex-direction: row;
        height: 100px;
        justify-content: space-between;
        div{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50%;
        }
        .cancel{
          border-right: 1px solid #ddd;
          font-size:36px;
          font-weight:400;
          color:rgba(153,153,153,1);
          line-height:50px;
        }
        .confirm{
          font-size:36px;
          font-weight:500;
          color:rgba(254,119,0,1);
          line-height:50px;
        }
      }
    }
  }
</style>
