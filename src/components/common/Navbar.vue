<template>
  <nav :class="$style.navbar">
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'Home' }"
    >
      <pl-icon type="svg" :name="homeActive ? 'icon-find-active' : 'icon-find'" width="68" />
    </router-link>
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'Classify' }"
    >
      <pl-icon type="svg" :name="classifyActive ? 'icon-classify-active' : 'icon-classify'" width="68" />
    </router-link>
    <router-link
      v-if="isNavBtnShow"
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
      <pl-icon type="svg" :name="yajiActive ? 'icon-cart-active' : 'icon-cart'" width="68" />
    </router-link>
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'My' }"
    >
      <pl-icon type="svg" :name="myActive ? 'icon-my-active' : 'icon-my1'" width="68" />
      <div v-if="noticeStatus === 2" :class="$style.alertMessage" />
    </router-link>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Get_ADUIT_NOTICE } from '../../store/mutation-type'
import { setTimeoutSync } from '../../assets/js/util'
export default {
  name: 'Navbar',
  props: {
    isNavBtnShow: Boolean
  },
  data () {
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
    ...mapGetters(['agentUser', 'isAdmin', 'noticeStatus']),
    myActive: function () {
      return this.$route.matched.some(val => val.name === 'My')
    },
    yajiActive: function () {
      return this.$route.path.indexOf('cart') > -1
    },
    classifyActive: function () {
      return this.$route.matched.some(val => val.name === 'Classify')
    },
    homeActive: function () {
      return this.$route.matched.some(val => val.name === 'Home')
    }
  },
  watch: {
    async $route (to) {
      if (this.showNavbar.includes(to.name)) {
        await setTimeoutSync(1000)
        try {
          await this.getAuditNotice()
        } catch (e) {
          throw e
        }
      }
    }
  },
  async mounted () {
    await setTimeoutSync(5000)
    try {
      await this.getAuditNotice()
    } catch (e) {
      throw e
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
  height: 88px;
  font-size: 20px;
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
</style>
<style>
  .router-link-active {
    color: var(--warning-color);
  }
</style>
