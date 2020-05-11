<template>
    <div>
        <template name="title">
            <div :class="$style.popupTitle">
                <pl-svg
                    :class="$style.popupTitleIcon"
                    name="icon-rows"
                    height="40"
                />
                <span>联系我们</span>
            </div>
        </template>
        <template>
            <div :class="$style.popupContent">
                <div :class="$style.popupAddress">
                    <pl-svg
                        :class="$style.popupAddressLeftIcon"
                        name="icon-address-blue"
                    />
                    <span
                        :class="$style.popupAddressText"
                        v-text="address"
                    />
                    <pl-svg
                        :class="$style.popupAddressRightIcon"
                        name="icon-copy"
                        @click="doCopy"
                    />
                </div>
                <a v-if="servicePhoneModels.length === 1" :href="`tel: ${servicePhoneModels[0].contactWay}`">
                    <pl-button
                        size="larger"
                        background-color="#387AF6"
                        prefix-icon="icon-mobile-blue"
                        round
                    >
                        立即拨打
                    </pl-button>
                </a>
                <pl-button
                    v-else
                    size="larger"
                    background-color="#387AF6"
                    prefix-icon="icon-mobile-blue"
                    round
                    data-i="123"
                    @click="call"
                >
                    立即拨打
                </pl-button>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'ContantPop',
    computed: {
        ...mapGetters(['address', 'servicePhoneModels'])
    },
    methods: {
        doCopy () {
            this.$copyText(this.address).then(e => {
                this.$success('复制成功')
            }, e => {
                console.error(e)
            })
        },
        call () {
            this.$emit('callUs')
        }
    }
}
</script>

<style  module lang="scss">
  /** 联系我们底部弹窗 **/
  .popup-title {
    padding: 40px 42px 32px;
    display: flex;
    align-items: center;
    font-size:40px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: #000000;
    line-height: 56px;
  }
  .popup-title-icon {
    width: 26px;
    margin-right: 26px
  }
  .popup-content {
    padding: 35px 30px;
  }
  .popup-address {
    padding: 20px 30px;
    margin-bottom: 20px;
    background-color: #F9F9F9;
    display: flex;
    align-items: center;
    font-size: 28px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #000;
    line-height: 40px;
    border-radius: 10px;
  }
  .popup-address-text {
    flex: 1;
  }
  .popup-address-left-icon {
    width: 36px;
    margin-right: 24px
  }
  .popup-address-right-icon {
    width: 39px;
    margin-left: 40px
  }
</style>
