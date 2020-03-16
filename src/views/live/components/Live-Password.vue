<template>
    <!-- 直播回播口令弹窗 -->
    <transition name="fade">
        <div v-if="show" :class="$style.wordWrap">
            <div :class="$style.wordBox">
                <div :class="$style.content">
                    <div>
                        该场次直播仅支持口令登录
                    </div>
                    <div :class="$style.pass">
                        <label>密码登录</label>
                        <pl-input :border="true" type="number" :maxlength="4" @change="validatePass" v-model.number="value" placeholder="请输入4位密码" />
                    </div>
                    <div :class="{ [$style.description]: true, [$style.error]: error }">
                        <span v-if="error">密码错误请重新输入，</span>
                        <span>如有问题请联系老师</span>
                    </div>
                </div>
                <div :class="$style.buttons">
                    <button :class="$style.cancelBtn" @click="cancel">取消</button>
                    <button @click="submit">确定</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { inputLivePassword } from './../../../apis/live'
export default {
    name: 'LivePassword',
    props: {
        activityId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            show: false,
            error: false,
            value: ''
        }
    },
    methods: {
        async validate () {
            this.show = true
            await this.$nextTick()
            return new Promise((resolve, reject) => {
                this.$on('validatePass', result => {
                    resolve(result)
                })
                this.$on('validateCancel', result => {
                    reject(result)
                })
            })
        },
        cancel () {
            // this.$emit('validateCancel', 'cancel')
            this.$router.go(-1)
            this.show = false
        },
        validatePass () {
            const reg = /^\d{4}$/
            if (!reg.test(this.value)) {
                this.error = true
                return false
            }
            this.error = false
            return true
        },
        async submit () {
            try {
                const validate = this.validatePass()
                if (validate) {
                    const result = await inputLivePassword({
                        activityId: this.activityId,
                        roomToken: this.value
                    })
                    if (result) {
                        this.$emit('validatePass', this.value)
                        this.show = false
                        this.error = false
                        return
                    }
                    this.error = true
                }
            } catch (e) { throw e }
        }
    }
}
</script>

<style lang='scss' module>
  .word-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2002;
    background-color: rgba(0, 0, 0, .65);
    > .word-box {
      width: 540px;
      box-sizing: border-box;
      margin: 30vh auto 0;
      padding: 22px 24px;
      border-radius: 10px;
      overflow: hidden;
      background-color: #fff;
      > .content {
        padding: 40px 22px;
        font-size: 28px;
        color:#333333;
        > .pass {
          display: flex;
          align-items: center;
          margin: 26px 0 26px 0;
          > label {
            margin-right: 14px;
          }
          > div {
            min-height: 52px;
            padding: 0 0 0 14px;
            border-radius: 0;
          }
        }
        > .description {
          font-size: 20px;
        }
        > .error {
          color: #F71515;
        }
      }
      > .buttons {
        display: flex;
        padding-top: 16px;
        border-top: 2px solid #E7E7E7;
        > button {
          flex: 1;
          font-size: 32px;
          font-weight:600;
          line-height: 62px;
          text-align: center;
          color: #FE7700;
        }
        > .cancelBtn {
          border-right: 2px solid #E7E7E7;
          color: #A8A8A8;
        }
      }
    }
  }
</style>
