<template>
  <div :class="$style.helperItem">
    <div :class="$style.wrapper" @click="toDetailPage">
      <div :class="$style.avatar">
        <img :src="avatar" alt="">
      </div>
      <div :class="$style.middle">
        <div :class="$style.main">
          <span :class="$style.name" v-text="name" />
          <span :class="$style.phone" v-text="phone" />
        </div>
        <div :class="$style.sub" v-text="option" />
      </div>
      <!-- <div :class="$style.right"> -->
      <slot />
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelperItem',
  props: {
    avatar: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    option: {
      type: String,
      default: ''
    },
    id: {
      type: [String, Number],
      default: ''
    },
    navTo: {
      type: String,
      default: 'HelperDetail'
    }
  },
  data () {
    return {}
  },
  methods: {
    toDetailPage () {
      const { id } = this
      if (!id) return
      this.$router.push({ name: this.navTo, params: { id } })
    }
  }
}
</script>

<style lang="scss" module>
  .helper-item {}
  .wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .avatar {
    width: 74px;
    height: 74px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .middle {
    flex: 1;
    width: 0;
    margin-left: 24px;
    padding-right: 24px;
  }
  .main {
    font-size: 24px;
    height: 34px;
    line-height: 34px;
    color: #000000;
    @include elps();
    .phone {
      margin-left: 32px;
    }
  }
  .sub {
    margin-top: 10px;
    height: 22px;
    font-size: 20px;
    font-family: Helvetica;
    font-weight: 400;
    line-height: 22px;
    color: #999999;
    @include elps();
  }
  .right {}
</style>
