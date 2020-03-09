<template>
  <div
    class="quick-navbar"
    ref="QuickBox"
  >
    <transition name="fade">
      <div
        :class="$style.mask"
        v-show="showBar"
        @click="showBar = false"
      />
    </transition>
    <ul
      :class="{
        [$style.navbar]: true,
        [$style.showBar]: showBar
      }"
    >
      <li
        :class="$style.onOff"
        @click="showBar = !showBar"
      >
        <pl-svg
          :class="$style.doubleArrow"
          name="icon-double-arrow"
          width="24"
          height="24"
        />
        <div :class="$style.tip">
          <p v-text="showBar ? '收起' : '快速'" />
          <p v-show="!showBar">
            导航
          </p>
        </div>
      </li>
      <router-link
        tag="li"
        active-class="active"
        :to="{name: 'Home'}"
      >
        <pl-svg
          name="icon-find"
          width="50"
          height="75"
        />
      </router-link>
      <router-link
        v-if="liveRoomEnable"
        tag="li"
        active-class="active"
        :to="{name: 'OnlineClassroom'}"
      >
        <pl-svg
          name="icon-icon-onlineClass-552fe"
          height="75"
        />
      </router-link>
      <router-link
        tag="li"
        active-class="active"
        :to="{name: 'Classify'}"
      >
        <pl-svg
          name="icon-classify"
          width="50"
          height="75"
        />
      </router-link>
      <router-link
        tag="li"
        active-class="active"
        :to="{ name: 'ShoppingCart' }"
      >
        <pl-svg
          :class="$style.cart"
          name="icon-cart"
          width="66"
          height="75"
        />
      </router-link>
      <router-link
        tag="li"
        active-class="active"
        :to="{name: 'My'}"
      >
        <pl-svg
          name="icon-my"
          width="50"
          height="75"
        />
      </router-link>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'QuickNavbar',
  data () {
    return {
      hidden: true,
      QuickBox: null,
      showBar: false
    }
  },
  watch: {
    $route () {
      this.showBar = false
    }
  },
  computed: {
    ...mapGetters(['agentUser', 'isAdmin', 'liveRoomEnable'])
  }
}
</script>

<style module lang="scss">
  .mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    z-index: 2000;
  }
  .navbar {
    position: fixed;
    right: 0;
    bottom: 280px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px 0 0 10px;
    width: 476px;
    height: 104px;
    transform: translateX(100%);
    transition: transform .5s ease-in-out;
    background-color: #fff;
    z-index: 2001;
    &.show-bar {
      transform: translateX(0);
      .double-arrow {
        transform: rotateY(0);
      }
    }
    li {
      margin-top: 10px;
    }
    .cart {
      width: 72px !important;
      height: 76px;
    }
  }
  .on-off {
    position: absolute;
    left: -92px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 92px;
    height: 72px;
    margin: 0 !important;
    color: #fbfbfb;
    text-align: center;
    background-color: rgba(58, 58, 58, .6);
    border-radius: 10px 0 0 10px;
    .tip {
      display: flex;
      flex-direction: column;
      justify-content: center;
      > p {
        display: inline-block;
        width: 50px;
        line-height: 30px;
        font-size: 20px;
      }
    }
    .double-arrow {
      width: 18px;
      height: 18px;
      vertical-align: -5px;
      transform: rotateY(180deg);
      transition: transform .5s ease-in-out;
    }
  }
</style>
