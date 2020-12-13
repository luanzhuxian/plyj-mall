<template>
    <div>
        <div :class="$style.itemSelector" @click.capture="chooseContact">
            <pl-fields
                size="middle"
                :right-text="contactInfoModel.name && contactInfoModel.mobile ? '已选择' : `未选择`"
            >
                <div>
                    <pl-svg class="mr-10" name="icon-contact" width="40" :vertical-align="-8" />
                    <span>联系人信息</span>
                </div>
                <div slot="collapse" v-show="contactInfoModel.name && contactInfoModel.mobile" :class="$style.contactDetail">
                    <span class="fz-28" v-text="contactInfoModel.name" />
                    <span class="fz-28" v-text="contactInfoModel.mobile" />
                </div>
            </pl-fields>
        </div>

        <pl-popup
            :show.sync="showContactPopup"
            :close-on-click-modal="false"
            @close="contactInfoForm.name = ''; contactInfoForm.mobile = '';"
        >
            <div :class="$style.addContact">
                <div :class="$style.addContactTop">
                    联系人信息
                </div>
                <pl-form :model="contactInfoForm" :rules="rules" ref="contactForm">
                    <pl-form-item prop="name" label="姓名：" :label-width="204" :gap-top="20">
                        <pl-input v-model="contactInfoForm.name" />
                    </pl-form-item>
                    <pl-form-item prop="mobile" label="手机号码：" :label-width="204" :gap-top="20">
                        <pl-input v-model="contactInfoForm.mobile" />
                    </pl-form-item>
                </pl-form>
                <pl-button size="huge" type="warning" @click="useContact">
                    使用
                </pl-button>
            </div>
        </pl-popup>
    </div>
</template>

<script>
import { checkLength, isPhone } from '../../assets/js/validate'
import { mapGetters } from 'vuex'
export default {
    name: 'SubmitOrderContactInfo',
    data () {
        return {
            showContactPopup: false,
            contactInfoModel: {
                name: '',
                mobile: ''
            },
            contactInfoForm: {
                name: '',
                mobile: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入联系人姓名' },
                    { validator: checkLength(12), message: '联系人姓名为1~12个字符' }
                ],
                mobile: [
                    { required: true, message: '请输入联系人手机号' },
                    { validator: isPhone, message: '联系人手机号格式错误' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters(['selectedAddress', 'realName', 'userName', 'mobile'])
    },
    mounted () {
        // 默认使用用户的注册信息
        const defaultContactInfo = {
            name: this.realName || this.userName,
            mobile: this.mobile
        }
        this.contactInfoModel = JSON.parse(localStorage.getItem('CONTACT_INFO_MODEL')) || defaultContactInfo
        this.$emit('change', JSON.parse(JSON.stringify(this.contactInfoModel)))
    },
    methods: {
        chooseContact () {
            this.contactInfoForm = Object.assign({}, this.contactInfoForm, this.contactInfoModel)
            this.showContactPopup = true
        },
        useContact () {
            if (this.$refs.contactForm.validate()) {
                this.showContactPopup = false
                this.contactInfoModel = Object.assign({}, this.contactInfoModel, this.contactInfoForm)
                localStorage.setItem('CONTACT_INFO_MODEL', JSON.stringify(this.contactInfoModel))
                this.$emit('change', JSON.parse(JSON.stringify(this.contactInfoModel)))
            }
            localStorage.setItem('CONTACT_INFO_MODEL', JSON.stringify(this.contactInfoModel))
        }
    }
}
</script>

<style module lang="scss">
    .item-selector {
        margin-bottom: 20px;
        padding: 0 24px;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
    }
    .add-contact {
        padding: 40px 20px;
        .add-contact-top {
            margin-bottom: 20px;
            font-size: 40px;
            color: #000;
        }
        button {
            margin-top: 48px;
        }
        label {
            background-color: #f9f9f9 !important;
            padding-left: 32px;
            span {
                color: #999 !important;
            }
        }
    }
    .contact-detail {
        padding: 24px 0;
        > span:nth-of-type(1) {
            margin-right: 24px;
            font-weight: 500;
        }
    }
</style>
