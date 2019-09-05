<template>
  <div :class="$style.helperManagement">
    <div :class="$style.top">
      <router-link :class="[$style.panel, $style.left]" :to="{ name: 'HelperList', query: { count } }">
        <div :class="$style.title">
          <span v-if="isAdmin">全部Helper</span>
          <span v-else>我管理的Helper</span>
        </div>
        <div :class="$style.number" v-text="count" />
        <div :class="$style.progress">
          <div
            :class="$style.inner"
            :style="{ '--progress': progress }"
          />
        </div>
        <div :class="$style.tip">
          <span v-if="isAdmin">管理您的Helper</span>
          <span v-else>至多200位Helper</span>
        </div>
      </router-link>
      <div :class="[$style.panel, $style.right]">
        <router-link :class="[$style.panel, $style.left]" :to="{ name: 'HelperList', query: { count } }">
          <div :class="$style.title">今日新增Helper</div>
          <div :class="$style.number" v-text="today" />
        </router-link>
        <div>
          <div :class="$style.title">月收益金额</div>
          <div :class="$style.number" v-text="currentMonth" />
        </div>
      </div>
    </div>
    <div :class="$style.bottom">
      <router-link :to="{ name: 'HelperListApply' }">
        <div :class="$style.title">
          <div :class="$style.left">{{ `待审核Helper（${auditCount}）` }}</div>
          <div :class="$style.right">
            <span>查看更多</span>
            <pl-svg name="right" />
          </div>
        </div>
        <helper-item
          :class="$style.helperItem"
          v-if="auditCount > 0"
          :avatar="auditModel.avatarUrl + '?x-oss-process=style/thum'"
          :name="auditModel.realName"
          :phone="rebulidMobile(auditModel.mobile)"
          :option="auditModel.applyTime"
        >
          <div :class="$style.right" v-if="isAdmin">
            <div :class="$style.sub">
              {{ `所属账号：${auditModel.ownnerName}` }}
            </div>
          </div>
        </helper-item>
      </router-link>
    </div>
    <footer :class="$style.footer">
      <pl-button
        type="warning"
        size="large"
        round
        @click="invite"
      >
        邀请Helper
      </pl-button>
    </footer>
  </div>
</template>

<script>
import HelperItem from '../../../components/item/Helper-Item.vue'
import { mapGetters } from 'vuex'
import { getHelperData } from '../../../apis/helper-manager'

export default {
  name: 'HelperManagement',
  components: {
    HelperItem
  },
  data () {
    return {
      auditModel: {},
      auditCount: 0,
      count: 0,
      today: 0,
      currentMonth: 0
    }
  },
  computed: {
    ...mapGetters(['roleCode', 'userId']),
    // 是否有权限看到helper模块
    isAdmin () {
      return this.roleCode === 'ENTERPRISE_ADMIN' || this.roleCode === 'ADMIN'
    },
    progress () {
      const result = this.count >= 200 ? 100 : parseInt(this.count / 200 * 100)
      return result + '%'
    }
  },
  activated () {
    this.getData()
  },
  methods: {
    async getData () {
      const { result } = await getHelperData()
      this.auditModel = result.auditModel || {}
      this.auditCount = result.auditHelperCount || 0
      this.count = result.count || 100
      this.today = result.todayCount || 0
      this.currentMonth = result.monthRevenue || 0
    },
    invite () {},
    rebulidMobile (str) {
      return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
  }
}
</script>

<style lang="scss" module>
  .helper-management {
    box-sizing: border-box;
    background: #ffffff;
    padding: 24px 28px 220px;
    min-height: 100vh;
  }
  .panel {
    padding: 30px 16px;
    background: #FFFFFF;
    border:1px solid rgba(232, 232, 232, 1);
    border-radius: 8px;
    box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      box-sizing: border-box;
      width: 392px;
      height: 268px;
      background: url("../../../assets/images/my/bg-group.png") no-repeat center center;
      background-size: 100%;
      .number {
        margin-top: 10px;
        font-size: 76px;
        font-family: Helvetica;
        font-weight: bold;
        line-height: 92px;
        color: #F2B036;
        &::after {
          content: '位';
          font-size: 20px;
          line-height: 28px;
          color: #999999;
          margin-left: 20px;
        }
      }
    }
    .right {
      box-sizing: border-box;
      width: 274px;
      height: 274px;
      background: url("../../../assets/images/my/bg-money.png") no-repeat center center;
      background-size: 100%;
      .left {
        > .number::after {
          content: '位';
        }
      }
      .number {
        margin-top: 12px;
        margin-bottom: 44px;;
        font-size: 24px;
        font-family: Helvetica;
        font-weight: 400;
        line-height: 28px;
        color: #F2B036;
        &::after {
          content: '元';
          font-size: 20px;
          line-height: 28px;
          color: #999999;
          margin-left: 8px;
        }
      }
    }
    .title {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 34px;
      color: #333333;
    }
    .progress {
      margin-top: 4px;
      height: 10px;
      background: #F9E58E;
      border-radius: 198px;
    }
    .inner {
      width: var(--progress);
      height: 10px;
      background: #F2CF36;
      border-radius: 198px;
      transition: width .5s linear;
    }
    .tip {
      margin-top: 12px;
      font-size: 18px;
      line-height: 26px;
      color: #999999;
    }
  }
  .bottom {
    margin-top: 40px;
    padding: 24px;
    background: #F7F7F7;
    border-radius: 8px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .left {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 34px;
      color: #666666;
    }
    .right {
      display: flex;
      align-items: center;
      font-size: 24px;
      line-height: 34px;
      color: #999999;
      svg {
        margin-left: 12px;
        height: 18px;
        path {
          fill: #CCCCCC;
        }
      }
    }
    .helper-item {
      margin-top: 24px;
      .right {
        height: 66px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        .sub {
          font-size: 20px;
          line-height: 28px;
          color: #999999;
        }
      }
    }
  }
  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    padding-bottom: 64px;
    button {
      width: 328px;
    }
  }
</style>
