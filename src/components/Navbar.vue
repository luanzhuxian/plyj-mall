<template>
  <nav :class="$style.navbar">
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'Home' }"
    >
      <pl-svg :name="homeActive ? 'find-active' : 'find'" />
    </router-link>
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'Classify' }"
    >
      <pl-svg :name="classifyActive ? 'classify-active' : 'classify'" />
    </router-link>
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'ShoppingCart' }"
    >
      <pl-svg
        :class="$style.cart"
        :name="yajiActive ? 'cart-active' : 'cart'"
      />
    </router-link>
    <router-link
      :class="$style.route"
      tag="div"
      :to="{ name: 'My' }"
    >
      <pl-svg :name="myActive ? 'my-active' : 'my'" />
      <div v-if="noticeStatus === 2" :class="$style.alertMessage" />
    </router-link>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Get_ADUIT_NOTICE } from '../store/mutation-type'
export default {
  name: 'Navbar',
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
  methods: {
    ...mapActions({
      getAuditNotice: Get_ADUIT_NOTICE
    })
  },
  watch: {
    $route (to) {
      if (this.showNavbar.includes(to.name)) {
        setTimeout(() => {
          this.getAuditNotice()
        }, 1000)
      }
    }
  },
  async mounted () {
    setTimeout(() => {
      this.getAuditNotice()
    }, 5000)
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
    svg {
      width: 40px;
    }
    .cart {
      width: 60px;
    }
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
</style>
<style>
  .router-link-active {
    color: var(--warning-color);
  }
</style>
