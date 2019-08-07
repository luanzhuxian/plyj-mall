<template>
  <div :class="$style.schoolShow">
    <div :class="$style.moduleTitle">
      <pl-svg :class="$style.moduleIcon" name="school_show" />
      <span :class="$style.title">校区展示</span>
    </div>
    <p>
      <img v-imger:schoolShow src="https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg" alt="">
    </p>
    <p>
      <img v-imger:schoolShow src="https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg" alt="">
    </p>
    <p>
      <img v-imger:schoolShow src="https://img.alicdn.com/bao/uploaded/i3/1573475524/O1CN01Qc7WQK1qg2PwhUWKl_!!0-item_pic.jpg_240x240Q90.jpg" alt="">
    </p>
  </div>
</template>

<script>
export default {
  name: 'AppointmentDetailVue'
}
</script>

<style module lang="scss">
  .school-show {
    padding: 32px 24px;
    background-color: #fff;
    img {
      width: 100%;
      margin-bottom: 20px;
      border-radius: 20px;
    }
  }
  .module-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    > .module-icon {
      width: 36px;
      margin-right: 12px;
    }
    > .title {
      flex: 1;
      font-size: 36px;
      font-weight: bold;
    }
  }
</style>
