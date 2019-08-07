<template>
  <div :class="$style.schoolShow">
    <div :class="$style.moduleTitle">
      <pl-svg :class="$style.moduleIcon" name="school_show" />
      <span :class="$style.title" v-text="data.titleName" />
    </div>
    <p v-for="(item, i) of data.mediaDetailModelList" :key="i">
      <img v-imger:schoolShow :src="item.mediaUrl" alt="">
    </p>
  </div>
</template>

<script>
export default {
  name: 'SchoolShow',
  data () {
    return {
      data: {}
    }
  },
  mounted () {
    let data = JSON.parse(localStorage.getItem('PINGXUAN'))
    this.data = data[1]
  }
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
