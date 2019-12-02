<template>
  <nav
    :class="{
      [$style.navbar]: true,
      [$style.skinXmas]: skinId === 1,
      [$style.skinNewYear]: skinId === 2
    }"
  >
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'Home' }"
    >
      <pl-svg
        v-if="skinId === 0"
        :name="homeActive ? 'icon-find-active' : 'icon-find'"
        width="44"
        height="68"
      />
      <template v-if="~[1, 2].indexOf(skinId)">
        <template v-if="skinId === 1">
          <img src="../../views/home/skin/xmas/btn-home-selected.png" v-if="homeActive">
          <img src="../../views/home/skin/xmas/btn-home.png" v-else>
        </template>
        <template v-if="skinId === 2">
          <img src="../../views/home/skin/new-year/btn-home-selected.png" v-if="homeActive">
          <img :class="$style.tab" src="../../views/home/skin/new-year/btn-home.png" v-else>
        </template>
        <div :class="$style.tabName">首页</div>
      </template>
    </router-link>
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'Classify' }"
    >
      <pl-svg
        v-if="skinId === 0"
        :name="classifyActive ? 'icon-classify-active' : 'icon-classify'"
        width="44"
        height="67"
      />
      <template v-if="~[1, 2].indexOf(skinId)">
        <template v-if="skinId === 1">
          <img src="../../views/home/skin/xmas/btn-classify-selected.png" v-if="classifyActive">
          <img src="../../views/home/skin/xmas/btn-classify.png" v-else>
        </template>
        <template v-if="skinId === 2">
          <img src="../../views/home/skin/new-year/btn-classify-selected.png" v-if="classifyActive">
          <img :class="$style.tab" src="../../views/home/skin/new-year/btn-classify.png" v-else>
        </template>
        <div :class="$style.tabName">分类</div>
      </template>
    </router-link>
    <router-link
      v-if="isActivityAuth"
      :class="$style.route"
      tag="div"
      :to="{ name: 'Activity' }"
    >
      <img :class="$style.icon" src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/d12-tabbar.png">
    </router-link>
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'ShoppingCart' }"
    >
      <pl-svg
        v-if="skinId === 0"
        :name="yajiActive ? 'icon-cart-active' : 'icon-cart'"
        width="60"
        height="72"
      />
      <template v-if="~[1, 2].indexOf(skinId)">
        <template v-if="skinId === 1">
          <img src="../../views/home/skin/xmas/btn-shopping-chart-selected.png" v-if="yajiActive">
          <img src="../../views/home/skin/xmas/btn-shopping-chart.png" v-else>
        </template>
        <template v-if="skinId === 2">
          <img src="../../views/home/skin/new-year/btn-shopping-chart-selected.png" v-if="yajiActive">
          <img :class="$style.tab" src="../../views/home/skin/new-year/btn-shopping-chart.png" v-else>
        </template>
        <div :class="$style.tabName">购物车</div>
      </template>
    </router-link>
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'My' }"
    >
      <pl-svg
        v-if="skinId === 0"
        :name="myActive ? 'icon-my-active' : 'icon-my'"
        width="44"
        height="72"
      />
      <template v-if="~[1, 2].indexOf(skinId)">
        <template v-if="skinId === 1">
          <img src="../../views/home/skin/xmas/btn-my-selected.png" v-if="myActive">
          <img src="../../views/home/skin/xmas/btn-my.png" v-else>
        </template>
        <template v-if="skinId === 2">
          <img src="../../views/home/skin/new-year/btn-my-selected.png" v-if="myActive">
          <img :class="$style.tab" src="../../views/home/skin/new-year/btn-my.png" v-else>
        </template>
        <div :class="$style.tabName">我的</div>
      </template>
      <div v-if="noticeStatus === 2" :class="$style.alertMessage" />
    </router-link>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Get_ADUIT_NOTICE } from '../../store/mutation-type'
export default {
  name: 'Navbar',
  data () {
    this.timer = 0
    return {
      showNavbar: [
        'Home',
        'My',
        'ShoppingCart',
        'Classify',
        'WhatsHelper'
      ]
    }
  },
  computed: {
    ...mapGetters(['agentUser', 'isAdmin', 'noticeStatus', 'isActivityAuth', 'skinId']),
    homeActive: function () {
      return this.$route.matched.some(val => val.name === 'Home')
    },
    classifyActive: function () {
      return this.$route.matched.some(val => val.name === 'Classify')
    },
    yajiActive: function () {
      return this.$route.path.indexOf('cart') > -1
    },
    myActive: function () {
      return this.$route.matched.some(val => val.name === 'My')
    }
  },
  watch: {
    $route: {
      async handler (to) {
        clearTimeout(this.timer)
        if (this.showNavbar.includes(to.name)) {
          this.timer = setTimeout(() => {
            this.getAuditNotice()
          }, 2000)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions({
      getAuditNotice: Get_ADUIT_NOTICE
    })
  }
}
</script>

<style module lang="scss">
.navbar {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  background-color: #fff;
  z-index: 2;
}
.route {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  font-size: 20px;
  height: 88px;
  .alertMessage{
    background-color: #D2524C;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    right: 60px;
  }
}
.icon {
  margin-bottom: 10px;
  width: 72px;
  // height: 72px;
}

/* 皮肤 */
.skin-xmas,
.skin-new-year {
  height: 119px !important;
  bottom: -1px !important;
  overflow: hidden;
  .route {
    box-sizing: border-box;
    justify-content: flex-end !important;
    height: 119px !important;
    padding-bottom: 12px;
  }
  .tab-name {
    margin-top: 7px;
    line-height: 18px;
    font-size: 18px;
    font-family: Adobe Heiti Std;
    color: #242424;
    text-align: center;
  }
}
.skin-xmas {
  background: url("../../views/home/skin/xmas/tabbar-bg.png") no-repeat center;
  background-size: 100%;
}
.skin-new-year {
  background: url("../../views/home/skin/new-year/tabbar-bg.png") no-repeat center;
  background-size: 100%;
  .route {
    width: 95px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tab {
    width: 79px
  }
  .tab-name {
    font-size: 26px;
  }
}
</style>
<style>
  .router-link-active {
    color: var(--warning-color);
  }
</style>
