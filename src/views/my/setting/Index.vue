<template>
  <div :class="$style.setting">
    <div :class="$style.top">
      <img :src="avatar" alt="">
      <div :class="$style.baseInfo">
        <span :class="$style.name" v-text="userName" />
        <span :class="$style.level" v-text="roleName" />
      </div>
    </div>

    <div :class="$style.set">
      <pl-fields text="手机号" :right-text="mobile || '未绑定'" :route="{ name: 'BindMobile' }" />
      <pl-fields text="微信号" :right-text="userName" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Setting',
  computed: {
    ...mapGetters(['avatar', 'userName', 'mobile', 'roleName'])
  }
}
</script>

<style module lang="scss">
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
      font-family: PingFang SC;
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
</style>
