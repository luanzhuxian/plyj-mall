<template>
    <div :class="$style.whatIsHelper">
        <div :class="$style.one" />
        <button
            v-if="!agentUser && !isAdmin"
            @click="() => {$router.push({name: 'ApplyHelper'})}"
            :class="$style.applyBroker"
        >
            申请成为Helper
        </button>
        <div :class="$style.two" />
        <button
            v-if="!agentUser && !isAdmin"
            @click="() => {$router.push({name: 'ApplyHelper'})}"
            :class="$style.applyBroker"
        >
            申请成为Helper
        </button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'WhatIsBroker',
    computed: {
        ...mapGetters(['agentUser', 'isAdmin'])
    },
    mounted () {
        document.querySelector('#app').style.padding = 0
    },
    destroyed () {
        document.querySelector('#app').style.padding = null
    }
}
</script>

<style module lang="scss">
.what-is-helper {
  width: 100%;
  padding-bottom: 100px;
  background-color: #ef534c;
  overflow: hidden;
  .one {
    height: 850px;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/whats_helper_2.jpg") no-repeat center center;
    background-size: 100%;
  }
  .two {
    height: 3600px;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/whats_helper_1.jpg") no-repeat center center;
    background-size: 100%;
  }
  .apply-broker {
    display: block;
    width: 670px;
    height: 90px;
    margin: 60px auto;
    font-size: 40px;
    color: #fff;
    border-radius: 4px;
    background-color: #f2b53f;
    border: none;
  }
}
</style>
