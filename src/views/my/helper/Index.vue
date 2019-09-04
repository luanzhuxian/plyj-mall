<template>
  <div :class="$style.helperManagement">
    <div :class="$style.panel">
      <router-link :class="$style.nav" :to="{ name: 'HelperList', params: { status: '123' } }">
        <div :class="$style.item">
          <div :class="$style.avatar">
            <img src="http://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/img/S1TG7SeB-NNr5dAtb-lbBjEtQX-pB9jMx6w_1556513907615.png?x-oss-process=style/thum-middle" alt="">
          </div>
          <div :class="$style.info">
            <div :class="$style.main" />
            <div :class="$style.sub" />
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HelperManagement',
  props: {},
  data () {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" module>
  .helper-management {

  }
  .panel {

  }
  .item {

  }
  .avatar {
    width: 100px;
    height: 100px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    .main {}
    .sub {}
  }
</style>
