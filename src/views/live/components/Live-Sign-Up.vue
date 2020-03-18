<template>
    <div :class="$style.liveSignUp">
        <Popup :close-on-click-modal="false" :show.sync="show" :hide-close-icon="true">
            <div :class="$style.content">
                <pl-form
                    :class="$style.form"
                    label-width="170"
                    align="right"
                    ref="form"
                    :model="form"
                    :rules="rules"
                    :label-style="{
                        fontWeight: 'normal',
                    }"
                >
                    <p :class="$style.title">提前报名，直播开始后直接观看</p>
                    <pl-form-item border v-if="info.isHaveName" label="姓名" prop="signName">
                        <pl-input v-model="form.signName" placeholder="请输入姓名" />
                    </pl-form-item>
                    <pl-form-item border v-if="info.isHaveTelphone" label="电话" prop="signTelphone">
                        <pl-input v-model="form.signTelphone" placeholder="请输入电话" />
                    </pl-form-item>
                    <pl-form-item border v-if="info.isHaveGrade" label="年级" prop="signGrade">
                        <pl-input v-model="form.signGrade" placeholder="请输入年级" />
                    </pl-form-item>
                    <pl-form-item border v-if="info.isHaveRegion" label="所在区域" prop="signRegion">
                        <pl-input @click="showSelector = true" v-model="form.signRegion" placeholder="请选择所在区域" />
                    </pl-form-item>
                    <pl-form-item border v-if="info.isHaveCustomer" :label="info.isHaveCustomer" prop="signTitle">
                        <pl-input v-model="form.signTitle" :placeholder="'请输入' + info.isHaveCustomer" />
                    </pl-form-item>
                </pl-form>
                <div :class="$style.button" @click="submit">立即报名</div>
            </div>
        </Popup>
        <!-- 地址选择 -->
        <CitySelector :show.sync="showSelector" @select="selectCity" />
    </div>
</template>

<script>
import { isPhone, checkLength } from './../../../assets/js/validate'
import { liveSignUp } from './../../../apis/live'
import Popup from './../../../components/penglai-ui/Popup'
import CitySelector from './../../../components/common/City-Selector'
// 验证是否中英文数字
const signValidator = value => {
    const reg = /^[a-zA-Z_\u4e00-\u9fa5_1-9]{1,60}$/
    if (!reg.test(value)) {
        return false
    }
    return true
}
export default {
    name: 'LiveSignUp',
    components: {
        Popup,
        CitySelector
    },
    props: {
        activityId: {
            type: String,
            default: ''
        },
        info: {
            type: Object,
            default () {
                return {
                    isHaveName: 0,
                    isHaveTelphone: 0,
                    isHaveGrade: 0,
                    isHaveRegion: 0,
                    isHaveCustomer: ''
                }
            }
        }
    },
    data () {
        return {
            show: false,
            showSelector: false,
            form: {
                liveId: '',
                signName: '',
                signTelphone: '',
                signGrade: '',
                signRegion: '',
                signTitle: ''
            },
            rules: {},
            rulesTemplate: {
                signName: [
                    { required: true, message: '请输入姓名' },
                    { validator: checkLength(20), message: '长度在20字以内' },
                    { validator: signValidator, message: '请输入正确的姓名格式' }
                ],
                signTelphone: [
                    { required: true, message: '请输入手机号' },
                    { validator: isPhone, message: '请输入正确的手机号' }
                ],
                signGrade: [
                    { required: true, message: '请输入年级' },
                    { validator: checkLength(20), message: '长度在20字以内' },
                    { validator: signValidator, message: '请输入正确的年级格式' }
                ],
                signRegion: [
                    { required: true, message: '请选择区域' },
                    { validator: checkLength(20), message: '长度在20字以内' }
                ],
                signTitle: [
                    { required: true, message: `请输入${ this.info.isHaveCustomer || '' }` },
                    { validator: checkLength(20), message: '长度在20字以内' },
                    { validator: signValidator, message: `请输入正确的${ this.info.isHaveCustomer || '' }格式` }
                ]
            }
        }
    },
    deactivated () {
        this.form = {
            liveId: '',
            signName: '',
            signTelphone: '',
            signGrade: '',
            signRegion: '',
            signTitle: ''
        }
    },
    methods: {
        async submit () {
            if (!this.$refs.form.validate()) {
                return
            }
            this.form.liveId = this.activityId
            await liveSignUp(this.form)
            this.$emit('success', '报名成功')
            this.$success('报名成功')
            this.show = false
        },
        signUp () {
            setTimeout(() => {
                this.show = true
            }, 1000)
            return new Promise((resolve, reject) => {
                this.$on('success', result => {
                    resolve(result)
                })
            })
        },
        selectCity (val) {
            this.form.signRegion = val[0].name +
        val[1].name +
        (val[2] ? val[2].name : '') +
        (val[3] ? val[3].name : '')
        }
    },
    watch: {
        info: {
            handler (val) {
                const obj = {
                    isHaveName: 'signName',
                    isHaveTelphone: 'signTelphone',
                    isHaveGrade: 'signGrade',
                    isHaveRegion: 'signRegion'
                }
                const keys = Object.keys(obj)
                let key
                this.rules = {}
                if (this.info.isHaveCustomer) {
                    this.rules.signTitle = [
                        { required: true, message: `请输入${ this.info.isHaveCustomer || '' }` },
                        { validator: checkLength(20), message: '长度在20字以内' },
                        { validator: signValidator, message: `请输入正确的${ this.info.isHaveCustomer || '' }格式` }
                    ]
                }
                for (let i = 0; i < keys.length; i++) {
                    key = keys[i]
                    if (this.info[key]) {
                        this.rules[obj[key]] = this.rulesTemplate[obj[key]]
                    }
                }
            }
        }
    }
}
</script>

<style lang='scss' module>

.content {
    box-sizing: border-box;
    padding: 58px 38px 14px 38px;
    > .form {
        box-sizing: border-box;
        padding: 0 54px;
        > .title {
            margin-bottom: 10px;
            font-size: 26px;
            color: #333;
        }
        > label {
            // width: 486px;
        }
    }
    > .button {
        width: 100%;
        margin-top: 40px;
        border-radius: 10px;
        line-height: 80px;
        text-align: center;
        font-size: 28px;
        font-weight: 500;
        color: #fff;
        background-color: #f2b036;
    }
}

</style>
