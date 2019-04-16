<template>
  <div
    :class="$style.addressItem"
    v-if="data.realName"
    @click="addressList"
  >
    <pl-svg name="address3" />
    <div :class="$style.right+' fz-28'">
      <div :class="$style.name">
        {{ data.realName }} <i
          class="bold"
          v-text="data.mobile"
        />
      </div>
      <div
        :class="$style.address"
        v-text="data.addressPrefix + data.agencyAddress"
      />
    </div>
  </div>
  <div
    v-else
    @click="addAddress"
    :class="{
      [$style.addAddress]: true,
      'fz-28 bold radius-20': true
    }"
  >
    <span>点击这里，添加一个新地址</span>
    <pl-svg name="add" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setSession } from '../assets/js/util'
export default {
  name: 'AddressItem',
  computed: {
    ...mapGetters(['selectedAddress']),
    data: function () {
      return this.address || this.selectedAddress
    }
  },
  props: {
    address: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  methods: {
    addressList () {
      let { name, params, query } = this.$route
      setSession('addressReturn', {
        name,
        params,
        query
      })
      this.$router.push({ name: 'Address' })
    },
    addAddress () {
      let { name, params, query } = this.$route
      setSession('addressReturn', {
        name,
        params,
        query
      })
      this.$router.push({ name: 'AddAddress' })
    }
  }
}
</script>

<style module lang="scss">
  .address-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 28px 28px 28px 0;
    background-color: #fff;
    border-radius: 20px;
    min-height: 100px;
    svg {
      width: 64px;
      height: 64px;
      margin-left: 28px;
      margin-right: 28px;
      fill: $--warning-color;
    }
    .right {
      display: flex;
      flex: 1;
      flex-direction: column;
      .name {
        margin-bottom: 15px;
      }
    }
  }
  .add-address {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 108px;
    padding: 0 40px;
    color: #fff;
    background-color: $--warning-color;
    > svg {
      width: 40px;
      height: 40px;
    }
  }
</style>
