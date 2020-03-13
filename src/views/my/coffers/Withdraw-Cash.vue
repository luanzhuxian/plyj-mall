<template>
    <div :class="$style.withdrawDeposit">
        <div :class="$style.wrap + ' bg-white radius-20'">
            <div :class="$style.way">
                <pl-svg name="icon-my-wechat" />
                <div>
                    <p class="fz-30">
                        提现通过【红包】发放
                    </p>
                    <!--<p class="fz-28 gray-3">未绑定账号</p>-->
                </div>
                <!--<pl-svg name="right" />-->
            </div>

            <div class="mt-28">
                <p class="fz-30 gray-2">
                    提现金额
                </p>
                <label :class="$style.input + ' mt-28'">
                    <i class="fz-50">¥</i><input
                        v-model.number="form.price"
                        class="fz-50"
                        placeholder="请输入金额"
                        type="number"
                    >
                </label>
            </div>

            <div :class="$style.allMoney">
                <span class="fz-26 gray-2">可提现 {{ balance }}元</span>
                <pl-button
                    type="text"
                    @click="withdrawAll"
                >
                    全部提现
                </pl-button>
            </div>
        </div>
        <div
            class="fz-24 gray-3"
            style="margin-bottom: 8.5vw; line-height: 5.8vw;"
        >
            单次提现限额<i style="color: #E7B250;">200</i>元，每日限制提现申请不超过<i style="color: #E7B250;">10</i>次<br>
            你申请提现后，商户会通过微信给您发送【红包】，如果您 24小时未领取，【红包】将自动失效<br>
            请您记得领取哦！
        </div>
        <pl-button
            size="huge"
            type="warning"
            :disabled="!form.price"
            @click="withdrawDeposit"
        >
            确认提现
        </pl-button>
    </div>
</template>

<script>
import { withdrawDeposit } from '../../../apis/money'
import { mapGetters } from 'vuex'
import { USER_INFO } from '../../../store/mutation-type'
import { isMoney } from '../../../assets/js/validate.js'
export default {
    name: 'WithdrawDeposit',
    data () {
        return {
            form: {
                price: '',
                userId: ''
            }
        }
    },
    computed: {
        ...mapGetters(['userId', 'openId', 'appId', 'balance'])
    },
    created () {
        this.form.userId = this.userId
    },
    activated () {
    },
    deactivated () {
        this.form.price = ''
    },
    methods: {
        async withdrawDeposit () {
            if (this.form.price < 1) return this.$warning('提现金额必须大于1元')
            if (this.form.price > this.balance) return this.$warning('不能大于可提现金额')
            if (this.form.price > 200) return this.$warning('提现金额不能大于200')
            if (!isMoney(this.form.price)) return this.$warning('提现金额只允许两位小数')
            await this.$confirm('您确认提现吗？')
            try {
                await withdrawDeposit(this.form)
                this.$router.replace({ name: 'WithdrawCashSuccess' })

                // 刷新个人信息
                this.$store.dispatch(USER_INFO, { appId: this.appId })
            } catch (e) {
                throw e
            }
        },
        withdrawAll () {
            if (this.balance > 200) {
                this.form.price = 200
            } else {
                this.form.price = this.balance
            }
        }
    }
}
</script>

<style module lang="scss">
  .withdraw-deposit {
    padding: 40px;
  }
  .wrap {
    padding: 20px 0 20px 30px;
    margin-bottom: 60px;
  }
  .way {
    position: relative;
    display: flex;
    padding-bottom: 22px;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid #f7f7f7;
    > div {
      flex: 1;
    }
    svg {
      width: 64px;
      margin-right: 28px;
      &:nth-of-type(2) {
        align-self: center;
        width: 22px;
        fill: #999;
      }
    }
  }
  .input {
    position: relative;
    display: flex;
    padding-bottom: 30px;
    overflow: hidden;
    border-bottom: 1px solid #f7f7f7;
    i {
      margin-right: 16px;
      font-size: 55px;
      vertical-align: -5px;
    }
    input {
      color: #333;
    }
  }
  .all-money {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 30px;
    margin-top: 10px;
  }
</style>
