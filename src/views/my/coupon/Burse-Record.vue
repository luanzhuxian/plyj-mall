<template>
    <div :class="$style.burseRecord">

        <header>
            <div>
                <div @click="checkActive('useBurse','expireEdit')" :class="{[$style.active]:active === 'useBurse'}">已使用</div>
                <div @click="checkActive('expireBurse','useEdit')" :class="{[$style.active]:active === 'expireBurse'}">已过期</div>
            </div>
            <div @click="edit">管理</div>
        </header>

        <div :class="$style.content">

            <!--已使用-->
            <div v-show="active === 'useBurse'">
                <BurseList :status="useStatus" :use-status="2" :has-status-img="true" :is-edit="useEdit" ref="useBurse" />
            </div>

            <!--已过期-->
            <div v-show="active === 'expireBurse'">
                <BurseList :status="expireStatus" :use-status="3" :has-status-img="true" :is-edit="expireEdit" ref="expireBurse" />
            </div>

        </div>

    </div>
</template>

<script>
import BurseList from '../../../components/my/coupon/Burse-List.vue'

export default {
    name: 'MyBurseRecord',
    components: {
        BurseList
    },
    data () {
        return {
            // useBurse 已使用 expireBurse 已过期
            active: 'useBurse',
            useEdit: false,
            expireEdit: false,
            useStatus: 2,
            expireStatus: 3
        }
    },
    async activated () {
        await this.$nextTick()
        this.$refs[this.active].$refresh()
    },
    methods: {
        async checkActive (active, deactiveEdit) {
            this.active = active

            // 取消编辑状态，并且清除选中
            this[deactiveEdit] = false
            await this.$nextTick()
            this.$refs[active].$refresh()
        },
        edit () {
            if (this.active === 'expireBurse') {
                this.useEdit = false
                this.expireEdit = !this.expireEdit
            } else {
                this.useEdit = !this.useEdit
                this.expireEdit = false
            }
        }
    }
}
</script>

<style lang='scss' module scoped>
  .burse-record {
    > header {
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 24px;
      background: #FFFFFF;
      font-size: 32px;
      color: #CCCCCC;
      font-weight: 400;
      > div:nth-of-type(1) {
        display: flex;
        > div {
          padding: 18px 0 14px 0;
          transition: 0.5s;
          border-bottom: 4px solid #FFFFFF;
          margin-right: 64px;
          &:nth-of-type(1) {
            margin-left: 18px;
          }
        }
        > .active {
          color: #FE7700;
          border-bottom-color: #FE7700;
        }
      }
      > div:nth-of-type(2) {
        padding: 18px 0;
        color: #5A5A5A;
      }
    }
    > .content {
      padding: 24px;
      margin-bottom: 45px;
      box-sizing: border-box;
      > div:nth-of-type(1) {
        font-size: 24px;
        font-weight: 400;
      }
    }
  }
</style>
