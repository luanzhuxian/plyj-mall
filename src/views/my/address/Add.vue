<template>
  <div :class="$style.addAddress">
    <TopText
      :title="addressId ? '编辑地址' : '添加新地址'"
      tip="请认真填写，不然可能收不到宝贝哟～"
    />

    <pl-form
      ref="form"
      :model="form"
      :class="$style.form + ' radius-20'"
      label-width="40"
      :rules="rules"
    >
      <pl-form-item
        border
        prop="realName"
      >
        <pl-input
          placeholder="收货人"
          v-model="form.realName"
          size="middle"
        />
      </pl-form-item>
      <pl-form-item
        border
        prop="mobile"
      >
        <pl-input
          placeholder="手机号"
          v-model="form.mobile"
          size="middle"
        />
      </pl-form-item>
      <!--<pl-form-item border>-->
      <!--<pl-input placeholder="邮箱" v-model="form.email" />-->
      <!--</pl-form-item>-->
      <pl-form-item
        border
        prop="addressPrefix"
      >
        <pl-input
          placeholder="所在地区"
          readonly
          v-model="form.addressPrefix"
          @click="showCitySelector = true"
          @clear="addrClear"
          size="middle"
        />
      </pl-form-item>
      <pl-form-item prop="agencyAddress">
        <pl-input
          placeholder="详细地址：如道路、门牌号、小区等"
          v-model="form.agencyAddress"
          size="middle"
        />
      </pl-form-item>
    </pl-form>

    <div :class="$style.setDefault + ' radius-20'">
      <span class="fz-30">设为默认地址</span>
      <pl-switch v-model="defaultAddress" />
    </div>

    <div
      v-if="addressId"
      :class="$style.removeAddr"
      @click="removeAddr"
    >
      删除该地址
    </div>

    <CitySelector
      :show.sync="showCitySelector"
      @select="selectCity"
      ref="citySelector"
    />

    <pl-button
      :class="$style.submit"
      size="huge"
      type="warning"
      :loading="loading"
      @click="confirm"
    >
      提交
    </pl-button>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import CitySelector from '../../../components/City-Selector.vue'
import {
  createAddress,
  updateAddress,
  deleteAddress
} from '../../../apis/address'
import { mapGetters } from 'vuex'
import { ADDRESS_LIST, SELETC_ADDRESS } from '../../../store/mutation-type'
import { isPhone, isName } from '../../../assets/js/validate'
export default {
  name: 'AddAddress',
  components: {
    TopText,
    CitySelector
  },
  data () {
    return {
      defaultAddress: true,
      showCitySelector: false,
      loading: false,
      form: {
        country: '', // stirng 国家代码
        province: '', // stirng 省自治区代码
        city: '', // stirng 市代码
        region: '', // stirng 地区代码
        addressPrefix: '', // stirng 省市区
        agencyAddress: '', // stirng 地址
        mobile: '', // stirng 联系电话1
        realName: '', // stirng 收货人名称
        addressLable: 'HOME', // stirng 地址标识 家庭地址HOME，工作地址WORK, 其他地址：OTHER
        defaultAddress: 'NO',
        town: '' // 街道、镇、乡
        // email: ''
      },
      rules: {
        realName: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' },
          { validator: isName, message: '姓名只支持中英文，且中文为2~10字，英文为2~20字', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: isPhone, message: '手机号码格式错误', trigger: 'blur' }
        ],
        addressPrefix: [ { required: true, message: '请选择地址' } ],
        agencyAddress: [ { required: true, message: '请输入详细地址', trigger: 'blur' } ]
      },
      address: {}
    }
  },
  props: {
    addressId: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters(['addressList', 'selectedAddress', 'mobile'])
  },
  activated () {
    if (this.addressId) {
      this.address = this.addressList.filter(item => item.sequenceNbr === this.addressId)[0]
      this.setAddress()
    }
  },
  methods: {
    setAddress () {
      for (let k of Object.keys(this.form)) {
        this.form[k] = this.address[k] || ''
      }
      this.defaultAddress = this.form.defaultAddress === 'YES'
    },
    addrClear () {
      this.$refs.citySelector.clear()
    },
    async confirm () {
      if (this.$refs.form.validate()) {
        let currentAddress = null
        this.loading = true
        try {
          if (this.defaultAddress) {
            this.form.defaultAddress = 'YES'
          } else {
            this.form.defaultAddress = 'NO'
          }
          if (this.addressId) {
            let { result } = await updateAddress(this.form, this.addressId)
            currentAddress = result
          } else {
            let { result } = await createAddress(this.form)
            currentAddress = result
          }
          await this.$store.dispatch(ADDRESS_LIST)
          /* 如果来自提交订单页面，那么点击地址时，选中当前地址为默认地址，但并不是真的设置为默认地址 */
          this.$store.commit(SELETC_ADDRESS, currentAddress)
          this.goBack()
          this.loading = false
        } catch (e) {
          this.loading = false
          throw e
        }
      }
    },
    selectCity (val) {
      this.form.province = val[0].code
      this.form.city = val[1].code
      this.form.region = val[2] ? val[2].code : ''
      this.form.town = val[3] ? val[3].code : ''
      this.form.addressPrefix =
        val[0].name +
        val[1].name +
        (val[2] ? val[2].name : '') +
        (val[3] ? val[3].name : '')
    },
    clearForm () {
      for (let k of Object.keys(this.form)) {
        if (k === 'addressLable') continue
        this.form[k] = ''
      }
    },
    async removeAddr () {
      try {
        await this.$confirm('是否删除该地址？')
        let { result } = await deleteAddress(this.addressId)
        if (result) {
          this.$success('已删除')
          // 移除成功后判断移除的地址是不是当前选中的地址
          if (this.selectedAddress.sequenceNbr === this.addressId) {
            this.$store.commit(SELETC_ADDRESS, null)
          }
          await this.$store.dispatch(ADDRESS_LIST)
          this.goBack()
        }
      } catch (e) {
        throw e
      }
    },
    goBack () {
      const addressReturn = JSON.parse(localStorage.getItem('ADDRESS_RETURN')) || {}
      const { name, params, query } = addressReturn
      if (name) {
        this.$router.replace({
          name: name,
          params: params,
          query: query
        })
        localStorage.removeItem('ADDRESS_RETURN')
      } else {
        this.$router.go(-1)
      }
    }
  },
  deactivated () {
    this.clearForm()
  },
  async beforeRouteEnter (to, from, next) {
    next(async vm => {
      if (!vm.mobile) {
        try {
          await vm.$confirm('您还没绑定手机，请先绑定手机')
          vm.$router.replace({ name: 'BindMobile' })
        } catch (e) {
          vm.$router.replace({
            name: from.name,
            params: from.params,
            query: from.query
          })
        }
      }
    })
  }
}
</script>

<style module lang="scss">
  .add-address {
    padding: 28px 40px;
    .form {
      margin-top: 36px;
      overflow: hidden;
    }
  }
  .set-default {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
    padding: 23px 40px;
    background-color: #fff;
  }
  .remove-addr {
    margin-top: 28px;
    padding: 0 40px;
    line-height: 108px;
    font-size: 30px;
    color: #F24724;
    background-color: #fff;
    border-radius: 20px;
  }
  .submit {
    bottom: 40px;
    width: 670px !important;
    margin: 120px auto 20px;
  }
</style>
