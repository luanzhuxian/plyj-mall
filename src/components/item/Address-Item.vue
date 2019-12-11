<template>
  <div
    :class="$style.addressItem"
    v-if="data.realName"
    @click="addressList"
  >
    <pl-svg
      :class="$style.address3"
      name="icon-address3"
      :key="1"
    />
    <div :class="$style.right">
      <div :class="$style.name">
        {{ data.realName }}
        <i
          class="bold"
        >
          {{ data.mobile | formatAccount }}
        </i>
      </div>
      <div
        v-if="!hideAddress"
        :class="$style.address"
        v-text="data.addressPrefix + data.agencyAddress"
      />
    </div>
    <pl-svg
      v-if="!notLink"
      :class="$style.rightIcon"
      name="icon-right"
      fill="#cdcdcd"
      width="24"
      :key="2"
    />
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
    <pl-svg
      name="icon-add"
      fill="#fff"
      :key="3"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    },
    hideAddress: Boolean,
    notLink: Boolean
  },
  methods: {
    addressList () {
      if (this.notLink) return
      localStorage.setItem('ADDRESS_RETURN', JSON.stringify({
        name: this.$route.name,
        params: this.$route.params,
        query: this.$route.query
      }))
      this.$router.push({ name: 'Address' })
    },
    addAddress () {
      localStorage.setItem('ADDRESS_RETURN', JSON.stringify({
        name: this.$route.name,
        params: this.$route.params,
        query: this.$route.query
      }))
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
    padding: 28px 24px;
    background-color: #fff;
    border-radius: 20px;
    min-height: 100px;
    .address3 {
      width: 64px;
      height: 64px;
      margin-right: 28px;
      fill: $--warning-color;
    }
    .rightIcon {
      width: 18px;
      transform: scaleY(1.2);
    }
    .right {
      display: flex;
      flex: 1;
      flex-direction: column;
      .name {
        font-size: 28px;
        color: #2e2e2e;
      }
      .address {
        margin-top: 18px;
        font-size: 24px;
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
