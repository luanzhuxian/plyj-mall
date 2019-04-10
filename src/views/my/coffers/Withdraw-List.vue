<template>
  <div class="withdraw-list">
    <div
      :class="{ [$style.selectStatus]: true, [$style.tabOpen]: tabOpen }"
      @click="tabOpen = !tabOpen"
    >
      <p :class="$style.onOff">
        <span style="margin-right: 8px;" v-text="currentSelect" />
        <pl-svg
          :class="$style.triangle"
          name="triangle"
        />
      </p>
      <transition name="fade">
        <div
          :class="$style.selectItems"
          v-show="tabOpen"
        >
          <div>
            <p
              :class="$style.selectItemsTitle"
              style="text-align: left;"
            >
              筛选
            </p>
            <ul :class="$style.selectItemList">
              <li
                v-for="item of tabs"
                :class="{ [$style.selectItem]: true, [$style.selected]: item.id === form.status }"
                :key="item.id"
                v-text="item.name"
                @click="tabChange(item)"
              />
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <LoadMore
      :request-methods="getWithdrawDepositOfUser"
      :form="form"
      ref="loadMore"
      @refresh="refreshHandler"
      @more="more"
      no-content-tip="暂无提现记录"
      icon="no-content2"
    >
      <template>
        <ul :class="$style.monthList">
          <li
            class="mt-28"
            v-for="(yearMonth, i) of formatList"
            :key="i"
          >
            <span class="fz-28 gray-3">{{ yearMonth.year }}年{{ yearMonth.month }}月</span>
            <ul :class="$style.list + ' mt-28'">
              <router-link
                tag="li"
                v-for="(item, i) of yearMonth"
                :class="{ [$style.item]: true, partition: i < yearMonth.length - 1 }"
                :to="{name: 'WithdrawDetail', params: {id: item.sequenceNbr}}"
                :key="item.sequenceNbr"
              >
                <div :class="$style.money">
                  <span class="fz-32">微信零钱</span>
                  <span class="fz-32 bold">{{ item.price }}元</span>
                </div>
                <div :class="$style.dateStatus">
                  <span
                    class="fz-26 gray-3"
                    v-text="item.createTime"
                  />
                  <span
                    :class="{ 'fz-26 gray-3': true, [$style.statusPass]: item.status === 'PASS' }"
                    v-text="status[item.status]"
                  />
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
  name: 'WithdrawList',
  components: {
    LoadMore
  },
  data () {
    return {
      tabOpen: false,
      currentSelect: '全部',
      tabs: [
        { name: '全部', id: '' },
        { name: '待审核', id: 'AWAIT' },
        { name: '待领取', id: 'dalinqu' },
        { name: '领取成功', id: 'success' },
        { name: '领取失败', id: 'failed' }
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
      getWithdrawDepositOfUser,
      $refresh: null
    }
  },
  computed: {
    ...mapGetters(['agencyCode'])
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    this.form.agencyCode = this.agencyCode
    this.$refresh()
  },
  methods: {
    tabChange (item) {
      this.form.status = item.id
      this.currentSelect = item.name
      this.$refresh()
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
    refreshHandler (list, total) {
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
  .selectStatus {
    position: relative;
    line-height: 72px;
    font-size: 28px;
    background-color: #fff;
    text-align: center;
    &:after {
      @include border-half-bottom(#e7e7e7)
    }
    &.tabOpen {
      .onOff {
        color: $--warning-color;
      }
      .triangle {
        fill: $--warning-color;
        transform: rotate(0);
      }
    }
    .onOff {
      transition: color .3s linear;
    }
    .triangle {
      width: 16px;
      transition: transform .3s linear;
      transform: rotate(-180deg);
    }
  }
  .selectItems {
    position: fixed;
    top: 72px;
    width: 100%;
    height: calc(100vh - 72px);
    background-color: rgba(0, 0, 0, .4);
    z-index: 9999;
    overflow: hidden;
  }
  .selectItemsTitle {
    padding: 24px 40px 0;
    font-size: 30px;
    font-weight: bold;
    line-height: 40px;
    background-color: #fff;
  }
  .selectItemList {
    display: grid;
    grid-template-columns: 210px 210px 210px;
    grid-gap: 20px;
    justify-content: center;
    justify-items: center;
    padding: 30px 0;
    font-size: 26px;
    text-align: center;
    background-color: #fff;
  }
  .selectItem {
    width: 100%;
    line-height: 64px;
    border-radius: $--radius2;
    background: #f5f5f5;
    &.selected {
      background-color: #FFF7E6;
      color: $--primary-color;
    }
  }
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
