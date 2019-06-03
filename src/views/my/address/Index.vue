<template>
  <div :class="$style.address">
    <ul
      :class="$style.addressList"
      v-if="addressList.length"
    >
      <li
        :class="$style.addressItem + ' radius-20'"
        v-for="(item, i) of addressList"
        @click="handleClick(item)"
        :key="i"
      >
        <img
          :src="createImage(item.realName[0])"
          alt=""
        >
        <div :class="$style.controller">
          <div :class="$style.detail">
            <div>
              <span
                :class="$style.name"
                v-text="item.realName"
              />
              <span
                :class="$style.phone + ' bold'"
                v-text="item.mobile"
              />
            </div>
            <p :class="$style.addressDetail + ' fz-24'">
              <img
                v-if="item.defaultAddress === 'YES'"
                :src="createType('默认')"
                alt=""
              > <span v-text="item.addressPrefix" /> <span v-text="item.agencyAddress" />
            </p>
          </div>
          <div :class="$style.editOrDelete">
            <span
              class="fz-28 gray-3"
              @click.stop="$router.push({ name: 'AddAddress', params: { addressId: item.sequenceNbr } })"
            >编辑</span>
          </div>
        </div>
      </li>
    </ul>

    <router-link
      tag="div"
      :to="{ name: 'AddAddress' }"
      :class="{
        [$style.addAddress]: true,
        [$style.bottom]: addressList.length > 0,
        'fz-28 bold radius-20': true
      }"
    >
      <span>点击这里，添加一个新地址</span>
      <pl-svg name="add" />
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deleteAddress } from '../../../apis/address'
import { ADDRESS_LIST, SELETC_ADDRESS } from '../../../store/mutation-type'
export default {
  name: 'Address',
  data () {
    return {
      img: '',
      addresses: []
    }
  },
  computed: {
    ...mapGetters(['addressList'])
  },
  methods: {
    createImage (text) {
      let canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      let ctx = canvas.getContext('2d')
      let grd = ctx.createLinearGradient(0, 0, 100, 0)
      grd.addColorStop(0, '#C1C4C5')
      grd.addColorStop(1, '#AFB2B3')

      ctx.rect(0, 0, 100, 100)
      ctx.fillStyle = grd
      ctx.fill()

      ctx.font = '32px Microsoft Yahei UI'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.fillText(text, 50, 60)

      return canvas.toDataURL()
    },
    createType (text) {
      let canvas = document.createElement('canvas')
      canvas.width = 74
      canvas.height = 32
      let ctx = canvas.getContext('2d')
      ctx.rect(0, 0, 74, 32)
      ctx.fillStyle = '#fcefd7'
      ctx.fill()

      ctx.font = '24px Microsoft Yahei UI'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#FE7700'
      ctx.fillText(text, 37, 25)

      return canvas.toDataURL()
    },
    async remove (item) {
      await this.$confirm('您确定删除这条地址吗？')
      try {
        await deleteAddress(item.sequenceNbr)
        await this.$store.dispatch(ADDRESS_LIST)
      } catch (e) {
        throw e
      }
    },
    handleClick (item) {
      let addressReturn = JSON.parse(sessionStorage.getItem('addressReturn')) || {}
      if (addressReturn.name) {
        /* 如果来自提交订单页面，那么点击地址时，选中当前地址为默认地址，但并不是真的设置为默认地址 */
        this.$store.commit(SELETC_ADDRESS, item)
        this.$router.replace({
          name: addressReturn.name,
          params: addressReturn.params,
          query: addressReturn.query
        })
        sessionStorage.removeItem('addressReturn')
      }
    }
  }
}
</script>

<style module lang="scss">
  .address {
    position: relative;
    padding: 20px 40px;
  }
  .address-list {
    margin-bottom: 120px;
  }
  .address-item {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding: 28px;
    background-color: #fff;
    > img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      margin-right: 40px;
      object-fit: cover;
    }
  }
  .controller {
    display: flex;
    flex: 1;
    justify-content: space-between;
  }
  .detail {
    display: flex;
    flex-direction: column;
    width: 380px;
    font-size: 28px;
    .name {
      margin-right: 16px;
    }
    .address-detail {
      margin-top: 13px;
      > img {
        width: 74px;
        margin-right: 9px;
        vertical-align: -4px;
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
    &.bottom {
      position: fixed;
      bottom: 20px;
      width: 590px;
    }
    > svg {
      width: 40px;
      height: 40px;
    }
  }
  .edit-or-delete {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &:before {
      @include border-half-left(#e7e7e7)
    }
    span {
      position: relative;
      align-self: center;
      width: 96px;
      padding-right: 8px;
      line-height: 56px;
      text-align: right;
    }
  }
</style>
