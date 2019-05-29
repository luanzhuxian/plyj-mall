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
    </router-link>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Navbar',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['agentUser', 'isAdmin']),
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
  z-index: 8000;
}
  .route {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    width: 40px;
    height: 88px;
    font-size: 20px;
    svg {
      width: 44px;
    }
    .cart {
      width: 58px;
    }
  }
</style>
<style>
  .router-link-active {
    color: var(--warning-color);
  }
</style>
