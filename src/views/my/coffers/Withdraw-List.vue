<template>
    <div class="withdraw-list">
        <div
            :class="{ [$style.selectStatus]: true, [$style.tabOpen]: tabOpen }"
            @click="tabOpen = !tabOpen"
        >
            <p :class="$style.onOff">
                <span
                    style="margin-right: 8px;"
                    v-text="currentSelect"
                />
                <pl-svg
                    :class="$style.triangle"
                    fill="#f2b036"
                    name="icon-triangle"
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
                                @click="onTabChange(item)"
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
            no-content-tip="暂无提现记录"
            icon="icon-no-content2"
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
                                v-for="item of yearMonth"
                                :class="{ [$style.item]: true, partition: i < yearMonth.length - 1 }"
                                :to="{name: 'WithdrawDetail', params: {id: item.sequenceNbr}}"
                                :key="item.sequenceNbr"
                            >
                                <div :class="$style.money">
                                    <span class="fz-32">提现金额</span>
                                    <span class="fz-32 bold">{{ item.price }}元</span>
                                </div>
                                <div :class="$style.dateStatus">
                                    <span
                                        class="fz-26 gray-3"
                                        v-text="item.createTime"
                                    />
                                    <span
                                        :class="{ 'fz-26 gray-3': true, [$style.statusPass]: item.status === 'RECEIVED' }"
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
import LoadMore from '../../../components/common/Load-More.vue'
import moment from 'moment'
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
                { name: '待领取', id: 'PASS' },
                { name: '领取成功', id: 'RECEIVED' },
                { name: '领取失败', id: 'FAIL' },
                { name: '已驳回', id: 'REJECT' }
            ],
            form: {
                current: 1,
                size: 10,
                status: ''
            },
            status: {
                PASS: '待领取',
                RECEIVED: '领取成功',
                AWAIT: '待审核',
                REJECT: '驳回',
                FAIL: '领取失败'
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
    mounted () {
        this.$refresh = this.$refs.loadMore.refresh
        this.$refresh()
    },
    methods: {
        onTabChange (item) {
            this.form.status = item.id
            this.currentSelect = item.name
            this.$refresh()
        },
        async getCount () {
            try {
                const { result } = await getDepositCount()
                for (const k of Object.keys(result)) {
                    this.total += result[k]
                }
                this.noPassCount = result.await
            } catch (e) {
                throw e
            }
        },
        refreshHandler (list, total) {
            this.formatList = []
            this.list = []
            this.batching(list, total)
        },
        more (allList, total, currentList) {
            this.batching(currentList, total)
        },

        // 批处理数据，增加年月属性
        batching (list, total) {
            for (const item of list) {
                item.createTimestamp = moment(item.createTime).valueOf()
                const date = new Date(item.createTimestamp)
                item.month = date.getMonth() + 1
                item.year = date.getFullYear()
                item.yearMoneth = item.year + item.month
            }
            this.list = [...this.list, ...list]
            if (this.list.length === 0) return
            this.sortUserTime()
        },

        // 按时间排序
        sortUserTime () {
            this.list.sort((i, j) => i.createTimestamp < j.createTimestamp)
            this.format()
        },

        // 按年月分组
        format () {
            this.formatList = []
            const listTemp = [...this.list]
            const filterHandler = item => m === item.month && item.year === y
            let m = listTemp[0].month
            let y = listTemp[0].year
            while (!this.foramtListLength()) {
                const filter = this.list.filter(filterHandler)
                filter.month = m
                filter.year = y
                this.formatList.push(filter)

                // 删除已经过滤出来的项
                for (const item of filter) {
                    const index = listTemp.indexOf(item)
                    listTemp.splice(index, 1)
                }
                if (listTemp.length === 0) {
                    break
                }
                m = listTemp[0].month
                y = listTemp[0].year
            }
        },

        // 判断已经格式化的数量是否等于总数
        foramtListLength () {
            let len = 0
            for (const item of this.formatList) {
                len += item.length
            }
            return len === this.list.length
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
    border-bottom: 1px solid #f7f7f7;
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
      height: 72px;
      transition: color .3s linear;
      > svg {
        height: 28px;
      }
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
    justify-content: center;
    justify-items: center;
    padding: 30px 0;
    font-size: 26px;
    text-align: center;
    background-color: #fff;
  }
  .selectItem {
    display: inline-block;
    width: 28%;
    line-height: 64px;
    border-radius: $--radius2;
    background: #f5f5f5;
    margin-top: 10px;
    margin-left: 10px;
    &:nth-of-type(3n-2) {
      margin-left: 0;
    }
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
