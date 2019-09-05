<template>
  <div :class="$style.helperList" class="helper-list">
    <header :class="$style.header">
      <div :class="$style.search">
        <div :class="$style.left">
          <pl-svg name="triple-line" />
          <span>已发展Helper（150）</span>
        </div>
        <div :class="$style.right">
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
      <pl-tab
        :class="$style.tabBar"
        size="small"
        :tabs="tabs"
        :active-id.sync="form.period"
        @change="tabChange"
      />
    </header>
    <div :class="$style.list">
      <load-more
        ref="loadMore"
        :form="form"
        :loading.sync="loading"
        :request-methods="getHelperList"
        no-content-tip="没有查到您要的信息~"
        no-icon
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
              :phone="rebulidMobile(item.mobile)"
              :option="item.lastestLogonTime"
              :id="item.mallUserId"
            >
              <a :href="`tel: ${item.mobile}`" @click.stop="()=>{}">
                <pl-svg :class="$style.icon" name="phone-blue" />
              </a>
            </helper-item>
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
import { getHelperList } from '../../../apis/helper-manager'
import { debounce } from '../../../assets/js/util'

const tabs = [{
  name: '今日新增',
  id: 'TODAY'
}, {
  name: '昨日新增',
  id: 'YESTERDAY'
}]

export default {
  name: 'HelperList',
  components: {
    LoadMore,
    HelperItem
  },
  props: {
    status: {
      type: String,
      default: 'TODAY'
    }
  },
  data () {
    return {
      tabs,
      list: [],
      form: {
        realName: '',
        ownnerUserId: '',
        auditFlag: false,
        period: 'TODAY',
        current: 1,
        size: 10
      },
      getHelperList,
      $refresh: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['roleCode', 'userId']),
    // 是否有权限看到helper模块
    isAdmin () {
      return this.roleCode === 'ENTERPRISE_ADMIN' || this.roleCode === 'ADMIN'
    }
  },
  mounted () {
    this.$refresh = this.$refs.loadMore.refresh
  },
  activated () {
    this.form.ownnerUserId = this.isAdmin ? '' : this.userId
    this.form.period = this.status
    this.form.realName = ''
    this.$refresh()
  },
  methods: {
    tabChange (item) {
      this.$nextTick(() => {
        this.$router.replace({ name: 'HelperList', params: { status: item.id || 'TODAY' } })
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
    rebulidMobile (str) {
      return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
  }
}
</script>

<style lang="scss" module>
  .helper-list {
    box-sizing: border-box;
    background: #ffffff;
    padding-top: 180px;
    min-height: 100vh;
  }
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2999;
  }
  .search {
    padding: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 40px;
      color: #000000;
      svg {
        height: 20px;
        margin-right: 10px;
      }
    }
    .right {
      box-sizing: border-box;
      flex: 1;
      display: flex;
      align-items: center;
      padding: 0 24px;
      width: 362px;
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
  }
  .tab-bar {
    padding: 0 174px;
  }
  .list {
    padding: 8px 28px;
    .icon {
      height: 60px;
    }
  }
  .list-item {
    margin-bottom: 32px;
    padding: 34px 48px 34px 24px;
    background: #F7F7F7;
    border-radius: 8px;
  }
</style>
<style lang="scss" scoped>
  /deep/.pl-tab > .pl-tab__pane {
    height: 68px;
    line-height: 68px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #999999;
    &.active {
      color: #000000;
      &:after {
        // background-color: #FE7700;
      }
    }
  }
</style>
