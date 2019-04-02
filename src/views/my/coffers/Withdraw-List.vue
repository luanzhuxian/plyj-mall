<template>
  <div class="withdraw-list">
    <pl-tab :tabs="tabs" @change="tabChange" :activeId="activeId"></pl-tab>
    <LoadMore :request-methods="getWithdrawDepositOfUser"
              :options="form" @refresh="refresh"
              @more="more"
              ref="loadmore"
              no-content-tip="暂无提现记录"
              icon="no-content2">
      <template>
        <ul :class="$style.monthList">
          <li class="mt-28" v-for="(yearMonth, i) of formatList" :key="i">
            <span class="fz-28 gray-3">{{yearMonth.year}}年{{yearMonth.month}}月</span>
            <ul :class="$style.list + ' mt-28'">
              <router-link
                tag="li"
                v-for="(item, i) of yearMonth"
                :class="{ [$style.item]: true, partition: i < yearMonth.length - 1 }"
                :to="{name: 'WithdrawDetail', params: {id: item.sequenceNbr}}"
                :key="item.sequenceNbr">
                <div :class="$style.money">
                  <span class="fz-32">微信零钱</span>
                  <span class="fz-32 bold">{{item.price}}元</span>
                </div>
                <div :class="$style.dateStatus">
                  <span class="fz-26 gray-3" v-text="item.createTime" />
                  <span :class="{ 'fz-26 gray-3': true, [$style.statusPass]: item.status === 'PASS' }" v-text="status[item.status]" />
                </div>
              </router-link>
            </ul>
          </li>
        </ul>
      </template>
    </LoadMore>
  </div>
</template>

<script>
import { getWithdrawDepositOfUser, getDepositCount } from '../../../apis/money'
import { mapGetters } from 'vuex'
import LoadMore from '../../../components/Load-More.vue'
export default {
  name: 'Withdraw-List',
  components: {
    LoadMore
  },
  data () {
    return {
      activeId: '',
      tabs: [
        { name: '全部', id: '' },
        { name: '未审核', id: 'AWAIT' }
      ],
      form: {
        agencyCode: '',
        current: 1,
        size: 10,
        status: ''
      },
      status: {
        PASS: '已到账',
        AWAIT: '待审核',
        REJECT: '驳回',
        FAIL: '提现失败'
      },
      // 笔数
      total: 0,
      noPassCount: 0,
      list: [],
      // 未通过的列表
      noPassList: [],
      formatList: [],
      getWithdrawDepositOfUser
    }
  },
  computed: {
    ...mapGetters(['agencyCode'])
  },
  activated () {
    this.form.agencyCode = this.agencyCode
  },
  methods: {
    tabChange (item) {
      this.form.status = item.id
      this.$nextTick(() => {
        this.$refs.loadmore.refresh()
      })
    },
    async getCount () {
      try {
        const { result } = await getDepositCount()
        for (let k of Object.keys(result)) {
          this.total += result[k]
        }
        this.noPassCount = result.await
      } catch (e) {
        throw e
      }
    },
    refresh (list, total) {
      this.formatList = []
      this.batching(list, total)
    },
    more (allList, total, currentList) {
      this.batching(currentList, total)
    },
    // 批处理数据，增加年月属性
    batching (list, total) {
      for (let item of list) {
        item.createTimestamp = Number(item.createTimestamp)
        let date = new Date(item.createTimestamp)
        item.month = date.getMonth() + 1
        item.year = date.getFullYear()
        item.yearMoneth = item.year + item.month
      }
      this.list = [...list]
      // 统计数量
      // if (this.form.status === '') {
      //   this.total = this.list.length
      // }
      // if (this.form.status === 'AWAIT') {
      //   this.noPassCount = this.list.length
      // }
      this.sortUserTime()
    },
    // 按时间排序
    sortUserTime () {
      this.list.sort((i, j) => {
        return i.createTimestamp < j.createTimestamp
      })
      // 分别格式化全部列表和
      // if (this.type === 'not') {
      //   this.format(this.noPassCount)
      // } else {
      //   this.format(this.list)
      // }
      this.format()
    },
    // 按年月分组
    format () {
      if (this.list.length === 0) return
      let list = this.list
      // 每次取出list中的第一个作为标准
      let warp = [list[0]]
      warp.year = list[0].year
      warp.month = list[0].month
      // 然后删除list中的第一个
      list.splice(0, 1)
      // 用wrap中的第一个与list中的其他做比较，去除年月相同的项目放入warp中
      for (let item of list) {
        if (item.yearMoneth === warp[0].yearMoneth) {
          warp.push(item)
        }
      }
      // 从list中删除存在与warp中的项
      for (let item of warp) {
        let index = list.indexOf(item)
        if (index !== -1) {
          list.splice(index, 1)
        }
      }
      // 此时已经按年月分号了一组数据，放入formatList中
      this.formatList.push(warp)
      // 进行尾递归，直到list中没有数据
      return this.format()
    }
  }
}
</script>

<style module lang="scss">
  .monthList {
    width: 670px;
    margin: 40px auto 0;
    padding-bottom: 40px;
  }
  .list {
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, .1);
    background-color: #fff;
    overflow: hidden;
  }
  .item {
    display: flex;
    flex-direction: column;
    padding: 22px 28px;
    background-color: #fff;
    overflow: visible;
  }
  .money {
    display: flex;
    justify-content: space-between;
  }
  .date-status {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
  }
  .statusPass {
    color: $--primary-color;
  }
</style>
