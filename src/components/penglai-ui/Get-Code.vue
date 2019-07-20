<template>
  <div class="pl-get-code">
    <button
      :disabled="disabled || !mobile || timing || loading"
      :class="{ timing: time > 0 }"
      @click.prevent="handleClick"
    >
      {{ timing ? `${time}s` : '获取验证码' }}
    </button>
  </div>
</template>

<script>
import { isPhone } from '../../assets/js/validate'
import { sendCode } from '../../apis/base-api'
export default {
  name: 'GetCode',
  data () {
    return {
      fixedTime: 60,
      time: 0,
      timing: false,
      show: false,
      loading: false
    }
  },
  props: {
    mobile: {
      type: String,
      default: ''
    },
    smstype: {
      type: String,
      default: ''
    },
    disabled: Boolean
  },
  created () {
    let lastSendTime = Number(localStorage.getItem('sendTime') || 0)
    if (Date.now() - lastSendTime < this.fixedTime * 1000) {
      // 如果上次发送验证码的时间与本次的发送时间间隔小于发送验证码的时间间隔(this.time)
      let time = Number.parseInt(this.fixedTime - (Date.now() - lastSendTime) / 1000)
      this.run(this.countDown, time)
    }
  },
  methods: {
    async handleClick (e) {
      if (!isPhone(this.mobile)) {
        return this.$error('手机号格式错误')
      }
      this.$emit('click', e)
      try {
        this.loading = true
        await sendCode(this.smstype, this.mobile)
        this.loading = false
        // 存储本次发送验证码的时间
        localStorage.setItem('sendTime', new Date().getTime())
        this.run(this.countDown)
      } catch (e) {
        this.loading = false
        throw e
      }
    },

    /*
    * 倒计时任务
    * @residue 剩余时间
    * */
    *countDown (residue) {
      this.time = residue
      yield this.time
      while (this.time > 1) {
        yield --this.time
      }
    },
    /*
    * 运行倒计时任务
    * @countDown 要运行的任务
    * @residue 剩余时间，如果不传，使用默认时间
    * */
    run (countDown, residue) {
      let task = countDown(residue !== undefined ? residue : this.fixedTime)
      let result = task.next()
      this.timing = !result.done
      this.time = result.value
      let step = () => {
        if (!result.done) {
          setTimeout(() => {
            result = task.next()
            this.timing = !result.done
            this.time = result.value || 0
            step()
          }, 1000)
        }
      }
      step()
    },
    // 立即结束倒计时
    finishCountDown () {
      localStorage.removeItem('sendTime')
      this.time = 0
      this.timing = false
    }
  }
}
</script>

<style lang="scss">
  .pl-get-code {
    button {
      width: 230px;
      text-align: center;
      font-size: 30px;
      color: var(--primary-color);
      text-decoration: underline;
      background: none;
      border: none;
      border-left: 1px solid #e7e7e7;
      &:disabled {
        color: #ccc;
        text-decoration: none;
      }
      &.timing {
        text-decoration: none;
      }
    }
  }
</style>
