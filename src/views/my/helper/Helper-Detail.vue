<template>
  <div :class="$style.helperDetail">
    <div :class="$style.result">
      <pl-svg v-if="auditStatus === 'AWAIT'" name="helper-apply-wait" />
      <pl-svg v-if="auditStatus === 'PASS'" name="helper-apply-success" />
      <pl-svg v-if="auditStatus === 'REJECT'" :class="$style.fail" name="helper-apply-fail" />
    </div>
    <div :class="$style.top">
      <div :class="$style.avatar">
        <img :src="avatarUrl + '?x-oss-process=style/thum'" alt="">
      </div>
      <div :class="$style.name">{{ realName }}</div>
      <div :class="$style.phone">{{ mobile }}</div>
      <div :class="$style.option">{{ `所属账号：${ownnerName}(${ownnerRoleName})` }}</div>
    </div>
    <ul :class="$style.middle">
      <li>
        <label for="" :class="$style.left">身份证号：</label>
        <span :class="$style.right">{{ idCard }}</span>
      </li>
      <li>
        <label for="" :class="$style.left">昵称：</label>
        <span :class="$style.right">{{ nickName }}</span>
      </li>
      <li>
        <label for="" :class="$style.left">生日：</label>
        <span :class="$style.right">{{ birth }}</span>
      </li>
      <li>
        <label for="" :class="$style.left">年龄：</label>
        <span :class="$style.right">{{ age }}</span>
      </li>
      <li>
        <label for="" :class="$style.left">地址：</label>
        <span :class="$style.right">{{ address }}</span>
      </li>
      <li>
        <label for="" :class="$style.left">加入时间：</label>
        <span :class="$style.right">{{ createTime }}</span>
      </li>
    </ul>
    <ul :class="$style.bottom" v-if="operationLogs.length">
      <li v-for="(item, i) of operationLogs" :key="i">
        <div>
          <span :class="$style.date">{{ item.createTime }}</span>
          <span :class="$style.executor">{{ `操作人：${item.operationUserName}` }}</span>
        </div>
        <div :class="$style.status">{{ item.description }}</div>
      </li>
    </ul>
    <footer :class="$style.footer">
      <a :href="`tel: ${mobile}`">
        <pl-button
          type="primary"
          size="large"
          round
        >
          联系对方
        </pl-button>
      </a>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getHelperDetail } from '../../../apis/helper-manager'

export default {
  name: 'HelperDetail',
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      avatarUrl: '',
      idCard: '',
      realName: '',
      nickName: '',
      mobile: '',
      birth: '',
      age: '',
      address: '',
      createTime: '',
      ownnerName: '',
      ownnerRoleName: '',
      auditStatus: '',
      operationLogs: []
    }
  },
  computed: {
    ...mapGetters(['roleCode', 'roleMap'])
  },
  activated () {
    console.log(this.roleMap)
    this.getHelperDetail()
  },
  methods: {
    async getHelperDetail () {
      const params = {
        mallUserId: this.id,
        roleCode: 'HELPER'
      }
      const { result } = await getHelperDetail(params)
      this.avatarUrl = result.avatarUrl
      this.idCard = result.idCard
      this.realName = result.realName
      this.nickName = result.nickName
      this.mobile = this.rebulidMobile(result.mobile)
      this.birth = result.birth
      this.age = result.age
      this.address = result.address
      this.createTime = result.createTime
      this.ownnerName = result.ownnerName
      this.ownnerRoleName = result.ownnerRoleName
      this.auditStatus = result.auditStatus
      this.operationLogs = result.operationLogs
      console.log(result)
    },
    rebulidMobile (str) {
      return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
  }
}
</script>

<style lang="scss" module>
  .helper-detail {
    position: relative;
    box-sizing: border-box;
    background: #ffffff;
    padding: 40px 28px 220px;
    min-height: 100vh;
  }
  .result {
    position: absolute;
    top: 18px;
    right: 38px;
    svg {
      height: 130px;
    }
    .fail {
      path: {
        fill: #D2524C;
      }
    }
  }
  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .avatar {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .name {
    margin-top: 26px;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 44px;
    color: #666666;
  }
  .phone {
    margin-top: 8px;
    font-size: 28px;
    font-family: Helvetica;
    line-height: 32px;
    color: #000000;
  }
  .option {
    margin-top: 16px;
    font-size: 22px;
    font-family: Helvetica;
    line-height: 32px;
    color: #999999;
  }
  .middle {
    margin-top: 40px;
    padding: 32px;
    background: #F1F1F1;
    border-radius: 8px;
    > li {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      &:nth-last-of-type(1) {
        margin-bottom: 0;
      }
    }
    .left {
      margin-right: 20px;
      width: 140px;
      font-size: 28px;
      line-height: 40px;
      color: #666666;
    }
    .right {
      width: 0;
      flex: 1;
      font-size: 28px;
      font-family: Helvetica;
      line-height: 32px;
      color: #999999;
    }
  }
  .bottom {
    margin-top: 24px;
    padding-left: 56px;
    background: #ffffff;
    box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.1);
    li {
      position: relative;
      padding: 32px 0;
      font-size: 24px;
      font-family: Helvetica;
      font-weight: bold;
      line-height: 30px;
      color: #333333;
      border-bottom: 1px solid #E7E7E7;
      &::before {
        position: absolute;
        left: -24px;
        top: 42px;
        content: ' ';
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #F2B036;
      }
      &:nth-of-type(1) {
        .status {
          color: #F2B036;
        }
      }
      &:nth-last-of-type(1) {
        border-bottom: none;
      }
    }
    .executor {
      margin-left: 40px;
    }
    .status {
      margin-top: 12px;
      color: #999999;
    }
  }
  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0px;
    text-align: center;
    padding-bottom: 64px;
    button {
      width: 328px;
    }
  }
</style>
