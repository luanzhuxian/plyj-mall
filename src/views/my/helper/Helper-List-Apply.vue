<template>
  <div :class="$style.helperListApply" class="helper-list-apply">
    <pl-tab
      :class="$style.tabBar"
      size="small"
      :tabs="tabs"
      :active-id.sync="form.auditStatus"
      @change="tabChange"
    />
    <div :class="$style.searchWrapper">
      <div :class="$style.search">
        <input
          v-model.trim="form.realName"
          type="search"
          placeholder="请输入helper姓名/手机号"
          @input="onInput"
          @search="onSearch"
        >
        <pl-svg name="search" />
      </div>
    </div>
    <div :class="$style.list">
      <load-more
        class="load-more"
        ref="loadMore"
        :form="form"
        :loading.sync="loading"
        :request-methods="getHelperList"
        icon="no-content-sleep"
        no-content-tip="暂无信息"
        @refresh="onRefresh"
        @more="onRefresh"
      >
        <template v-slot="{ list }">
          <div
            :class="$style.listItem"
            v-for="(item, i) of list"
            :key="i"
          >
            <helper-item
              :avatar="item.avatarUrl + '?x-oss-process=style/thum'"
              :name="item.realName"
              :phone="item.mobile | formatAccount "
              :option="item.applyTime"
              :id="item.mallUserId"
            >
              <template>
                <div :class="$style.right">
                  <div :class="$style.main">
                    <span v-text="statusMap[item.auditStatus]" />
                    <pl-svg name="right" />
                  </div>
                  <div :class="$style.sub" v-if="isAdmin">
                    {{ `所属账号：${item.ownnerName}` }}
                  </div>
                </div>
              </template>
            </helper-item>
            <div :class="$style.listItemButtons" v-if="item.auditStatus === 'AWAIT'">
              <pl-button
                type="danger"
                round
                @click="rejectApplication(item.id, i)"
              >
                审核驳回
              </pl-button>
              <pl-button
                type="warning"
                round
                @click="acceptApplication(item.id, i)"
              >
                审核通过
              </pl-button>
            </div>
            <div :class="$style.listItemFooter" v-if="item.auditStatus === 'REJECT'">
              <div :class="$style.reason">{{ `驳回理由：${item.agentWriteBack || '无'}` }}</div>
            </div>
          </div>
        </template>
        <template slot="icon">
          <div :class="$style.noContent">
            <pl-svg name="no-content-sleep" />
          </div>
        </template>
      </load-more>
    </div>
  </div>
</template>

<script>
import LoadMore from '../../../components/Load-More.vue'
import HelperItem from '../../../components/item/Helper-Item.vue'
import { mapGetters } from 'vuex'
import { getHelperList, acceptHelperApplication, rejectHelperApplication } from '../../../apis/helper-manager'
import { debounce } from '../../../assets/js/util'

const statusMap = {
  'AWAIT': '待审核',
  'PASS': '审核通过',
  'REJECT': '已驳回'
}

const tabs = [{
  name: '待审核',
  id: 'AWAIT'
}, {
  name: '审核通过',
  id: 'PASS'
}, {
  name: '已驳回',
  id: 'REJECT'
}]

export default {
  name: 'HelperListApply',
  components: {
    LoadMore,
    HelperItem
  },
  props: {
    status: {
      type: String,
      default: 'AWAIT'
    }
  },
  data () {
    return {
      tabs,
      list: [],
      form: {
        realName: '',
        ownnerUserId: '',
        auditFlag: true,
        auditStatus: 'AWAIT',
        current: 1,
        size: 10
      },
      getHelperList,
      $refresh: null,
      loading: false,
      statusMap
    }
  },
  computed: {
    ...mapGetters(['roleCode', 'userId']),
    // 是否有权限看到helper模块
    isAdmin () {
      return this.roleCode === 'ENTERPRISE_ADMIN' || this.roleCode === 'ADMIN'
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.noRefresh = from.name === 'HelperDetail'
    next()
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    if (this.list.length && this.$router.currentRoute.meta.noRefresh) {
      return
    }
    this.form.ownnerUserId = this.isAdmin ? '' : this.userId
    this.form.auditStatus = this.status
    this.form.realName = ''
    this.form.current = 1
    this.$refresh()
  },
  methods: {
    tabChange (item) {
      this.$nextTick(() => {
        this.$router.replace({ name: 'HelperListApply', params: { status: item.id || 'AWAIT' } })
        this.$refresh()
      })
    },
    onRefresh (list) {
      this.list = list
    },
    async onSearch (e) {
      const { value } = e.target
      if (!value || !value.trim()) return this.$warning('请输入要搜索的内容')
      this.$refresh()
    },
    onInput: debounce(function () {
      this.$refresh()
    }, 200),
    async acceptApplication (id, index) {
      try {
        await this.$confirm('确认通过当前请求？')
        await acceptHelperApplication(id)
        this.list.splice(index, 1)
        this.$success('操作成功')
      } catch (error) {
        throw error
      }
    },
    async rejectApplication (id, index) {
      try {
        const val = await this.$propmt({
          message: '确认驳回当前请求？',
          placeholder: '请输入驳回原因'
        })
        const params = {
          sequenceNbr: id,
          agentWriteBack: val
        }
        await rejectHelperApplication(params)
        this.list.splice(index, 1)
        this.$success('操作成功')
      } catch (error) {
        throw error
      }
    }
  }
}
</script>

<style lang="scss" module>
  .helper-list-apply {
    box-sizing: border-box;
    background: #ffffff;
    padding-top: 100px;
    min-height: 100vh;
  }
  .tab-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2999;
    border-bottom: 2px solid #E7E7E7;
  }
  .search-wrapper {
    padding: 16px 28px;
  }
  .search {
    box-sizing: border-box;
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 24px;
    height: 56px;
    background: #ffffff;;
    border: 1px solid #cccccc;
    border-radius: 110px;
    input {
      flex: 1;
      font-size: 24px;
      line-height: 34px;
      &::-webkit-input-placeholder {
        color: #cccccc;
      }
    }
    svg {
      width: 26px;
      path {
        fill: #cccccc;
      }
    }
  }
  .list {
    padding: 8px 28px;
  }
  .list-item {
    margin-bottom: 32px;
    padding: 34px 0 34px 24px;
    background: #F7F7F7;
    border-radius: 8px;
  }
  .right {
    padding-right: 24px;
    height: 66px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    .main {
      display: flex;
      justify-content: flex-end;
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
    .sub {
      font-size: 20px;
      line-height: 28px;
      color: #999999;
    }
  }
  .reason {
    padding-top: 20px;
    font-size: 24px;
    line-height: 34px;
    color: #666666;
    border-top: 1px solid #E7E7E7;
  }
  .list-item-footer {
    margin-top: 24px;
    padding-left: 96px;
  }
  .list-item-buttons {
    margin-top: 32px;
    text-align: center;
    button {
      margin-left: 40px;
    }
  }
  .no-content {
    svg {
      width: 150px;
    }
  }
</style>
<style lang="scss" scoped>
  /deep/.pl-tab > .pl-tab__pane {
    height: 96px;
    line-height: 96px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #999999;
    &.active {
      color: #000000;
      // &:after {
      //   background-color: #FE7700;
      // }
    }
  }
  // /deep/.load-more >
</style>
