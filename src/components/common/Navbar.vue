<template>
  <nav
    :class="{
      [$style.navbar]: true,
      [$style.skinXmas]: skinId === 1,
      [$style.skinYuanDan]: skinId === 2,
      [$style.skinNewYear]: skinId === 3,
      [$style.skinXiaoNian]: skinId === 4
    }"
  >
    <!-- 首页 -->
    <router-link
      :class="{
        [$style.route]: true,
        [$style.active]: homeActive
      }"
      tag="div"
      :to="{ name: 'Home' }"
    >
      <pl-svg
        v-if="skinId === 0"
        :name="homeActive ? 'icon-find-active' : 'icon-find'"
        width="44"
        height="68"
      />
      <template v-if="~[1, 2, 3, 4].indexOf(skinId)">
        <img :src="homeActive ? skinMap[skinId].homeActive : skinMap[skinId].home">
        <div :class="$style.tabName">首页</div>
      </template>
    </router-link>
    <!-- 分类 -->
    <router-link
      :class="{
        [$style.route]: true,
        [$style.active]: classifyActive
      }"
      tag="div"
      :to="{ name: 'Classify' }"
    >
      <pl-svg
        v-if="skinId === 0"
        :name="classifyActive ? 'icon-classify-active' : 'icon-classify'"
        width="60"
        height="72"
      />
      <template v-if="~[1, 2, 3, 4].indexOf(skinId)">
        <img :src="classifyActive ? skinMap[skinId].classifyActive : skinMap[skinId].classify">
        <div :class="$style.tabName">分类</div>
      </template>
    </router-link>
    <!-- 活动 -->
    <router-link
      v-if="isActivityAuth"
      :class="$style.route"
      tag="div"
      :to="{ name: 'Activity' }"
    >
      <img
        v-if="~[5, 6, 7].indexOf(activityId)"
        :class="$style.iconD12"
        src="https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/d12-tabbar.png"
      >
      <img
        v-if="activityId === 8"
        :class="$style.iconXinchun"
        src="https://mallcdn.youpenglai.com/static/admall/mall-management/xinchun/93a9ebf6-5266-4f78-9a2b-f2cb11e2ad14.png"
      >
    </router-link>
    <!-- 购物车 -->
    <router-link
      :class="{
        [$style.route]: true,
        [$style.active]: shoppingChartActive
      }"
      tag="div"
      :to="{ name: 'ShoppingCart' }"
    >
      <pl-svg
        v-if="skinId === 0"
        width="60"
        height="72"
        :name="shoppingChartActive ? 'icon-cart-active' : 'icon-cart'"
      />
      <template v-if="~[1, 2, 3, 4].indexOf(skinId)">
        <img :src="shoppingChartActive ? skinMap[skinId].shoppingChartActive : skinMap[skinId].shoppingChart">
        <div :class="$style.tabName">购物车</div>
      </template>
    </router-link>
    <!-- 我的 -->
    <router-link
      :class="{
        [$style.route]: true,
        [$style.active]: myActive
      }"
      tag="div"
      :to="{ name: 'My' }"
    >
      <pl-svg
        v-if="skinId === 0"
        :name="myActive ? 'icon-my-active' : 'icon-my'"
        width="44"
        height="74"
      />
      <template v-if="~[1, 2, 3, 4].indexOf(skinId)">
        <img :src="myActive ? skinMap[skinId].myActive : skinMap[skinId].my">
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
      ],
      skinMap: {
        '1': {
          home: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/239b454f-454c-4ca5-93e7-a51bbd65a85a.png',
          homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/ca59969d-77ed-48a0-964b-46ebc21401e1.png',
          classify: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/b7e2cc35-63a7-4e84-8b35-7d487ccff31f.png',
          classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/8821569b-35de-4a65-8e2d-60017edb6f1c.png',
          shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/e476c8f8-8b5c-4772-9afc-67e68e678cda.png',
          shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/665c6191-c62d-4ede-a10b-8cbfab239240.png',
          my: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/b036f6b9-0b78-424b-b1f1-94a240d5c1ff.png',
          myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/f1d79dbd-1756-449f-ae9a-d5ba092459ce.png'
        },
        '2': {
          home: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d164934f-0da6-49e2-a5bb-f057abab1831.png',
          homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d2275816-8002-4ada-bb49-495e7202ed76.png',
          classify: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/ddd9128a-9193-4df4-ad5f-74d8ed2a0a0c.png',
          classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/c349a743-3c97-4b20-a1c4-e981701d171b.png',
          shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d164934f-0da6-49e2-a5bb-f057abab1831.png',
          shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d2275816-8002-4ada-bb49-495e7202ed76.png',
          my: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/2f0c5143-0ee6-4e07-b57e-287506b503d2.png',
          myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/f6b46a80-9624-467a-a46f-d92716e55789.png'
        },
        '3': {
          home: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/ed448ad5-d03d-445c-92dd-26e47a345d0f.png',
          homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/ca40f2d6-03c8-43e2-ac61-1a3d8cb312dd.png',
          classify: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/524bb459-1629-476a-87a5-2c87c4e88629.png',
          classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/12c032c0-a345-47e4-950f-8e750314492f.png',
          shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/ec9ab607-450c-4b0a-8fc8-a8f48ef18ea2.png',
          shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/f62c7aea-7a94-4810-8e50-71af4b64747a.png',
          my: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/12d8a7da-d145-4394-876f-3452e6111818.png',
          myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/5506a573-d1de-4388-ae48-5f616865bfbe.png'
        },
        '4': {
          home: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/3e58990a-96cb-48e7-b15a-3e8bd67f99a2.png',
          homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/c178fd8c-719c-45fa-959d-d777ebf3c078.png',
          classify: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/6b66e983-d482-40eb-b433-a2894fe66b91.png',
          classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/8e40ee0f-405e-408d-bef6-8296b51fe68a.png',
          shoppingChart: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/0438bffd-91cb-4ad4-a21e-3782efe44134.png',
          shoppingChartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/06e0330a-0e6d-40da-a95f-806079c95117.png',
          my: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/e0351d5d-ebde-4606-bfb3-5bd95e8cdbf6.png',
          myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/38c15651-1a75-4fd5-8f8e-d90017260bff.png'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['agentUser', 'isAdmin', 'noticeStatus', 'isActivityAuth', 'activityId', 'skinId', 'userId']),
    homeActive: function () {
      return this.$route.matched.some(val => val.name === 'Home')
    },
    classifyActive: function () {
      return this.$route.matched.some(val => val.name === 'Classify')
    },
    shoppingChartActive: function () {
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
          if (this.userId) {
            this.timer = setTimeout(() => {
              this.getAuditNotice()
            }, 2000)
          }
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
  z-index: 9;
  overflow: hidden;
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
.icon-d12 {
  margin-bottom: 10px;
  width: 72px;
}
.icon-xinchun {
  width: 105px;
}

/* 皮肤 */
.skin-xmas,
.skin-yuan-dan,
.skin-new-year,
.skin-xiao-nian {
  .route {
    box-sizing: border-box;
    justify-content: flex-end !important;
    padding-bottom: 4px;
    &.active > .tab-name {
      color: #C81819;
    }
  }
  .tab-name {
    margin-top: 1px;
    line-height: 18px;
    font-size: 18px;
    font-family: Adobe Heiti Std;
    color: #242424;
    text-align: center;
  }
  .icon {
    margin-bottom: 0 !important;
  }
}
.skin-xmas {
  background: url("https://mallcdn.youpenglai.com/static/admall/skin/xmas/83295b48-251d-40a0-9e07-e3fb9eb95138.png") no-repeat center;
  background-size: 100%;
}
.skin-new-year {
  background: url("https://mallcdn.youpenglai.com/static/admall/skin/new-year/00b470fc-1ba0-4c3a-a039-177d6564eb0e.png") no-repeat center;
  background-size: 100%;
}
</style>
<style lang="scss">
  .router-link-active {
    color: $--warning-color;
  }
</style>
