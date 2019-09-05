<template>
  <div :class="$style.helperList" class="helper-list" :style="{ '--padding': !isAdmin ? '390px' : '260px' }">
    <div :class="$style.dropDown" v-if="!isAdmin">
      <span @click="isPopupShow = true">
        {{ `全部（${count}）` }}
        <pl-svg name="triangle-down" />
      </span>
    </div>
    <header :class="$style.header" :style="{ '--top': !isAdmin ? '176px' : '0' }">
      <div :class="$style.bar" v-if="!isAdmin">
        <div :class="$style.searchWrapper">
          <div :class="$style.inputWrapper">
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
      </div>
      <div :class="$style.barInline" v-else>
        <div :class="$style.count">
          <pl-svg name="triple-line" />
          <span>{{ `已发展Helper（${count}）` }}</span>
        </div>
        <div :class="$style.inputWrapper">
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
              :phone="item.mobile | formatAccount "
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
    <pl-popup
      ref="popup"
      :show.sync="isPopupShow"
      position="top"
    >
      <template>
        <radio-group-component
          :class="$style.popupList"
          v-model="form.ownnerUserId"
          @change="onPopupClick"
        >
          <radio-component :class="$style.popupListItem" :name="userId">
            全部
          </radio-component>
          <radio-component
            :class="$style.popupListItem"
            v-for="(item, index) of roleList"
            :key="index"
            :name="item.userId"
          >
            <span :class="$style.name">{{ item.realName }}</span>
            <span :class="$style.role">{{ `（${item.roleName}）` }}</span>
          </radio-component>
        </radio-group-component>
      </template>
    </pl-popup>
  </div>
</template>

<script>
import LoadMore from '../../../components/Load-More.vue'
import HelperItem from '../../../components/item/Helper-Item.vue'
import { mapGetters } from 'vuex'
import { getHelperList, getHelperRoleList } from '../../../apis/helper-manager'
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
      roleList: [],
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
      loading: false,
      isPopupShow: false,
      count: 0
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
    this.form.current = 1
    this.isPopupShow = false
    this.count = this.$route.query.count
    this.$refresh()
    !this.isAdmin && this.getHelperRoleList()
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
    onPopupClick (id) {
      this.isPopupShow = false
      if (id) {
        this.$refresh()
      }
      console.log(id)
    },
    async getHelperRoleList () {
      const params = {
        current: 1,
        size: 99
      }
      const { result } = await getHelperRoleList(params)
      this.roleList = result.records
    }
  }
}
</script>

<style lang="scss" module>
  .helper-list {
    box-sizing: border-box;
    background: #ffffff;
    padding-top: var(--padding);
    min-height: 100vh;
  }
  .drop-down {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2999;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 88px;
    line-height: 88px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #000000;
    border-bottom: 2px solid #E7E7E7;
    svg {
      height: 24px;
      path {
        fill: #333333;
      }
    }
  }
  .header {
    position: fixed;
    top: var(--top);
    left: 0;
    right: 0;
    z-index: 1999;
    background: #ffffff;
  }
  .bar {
    .search-wrapper {
      padding: 16px 28px 0;
    }
  }
  .bar-inline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px 28px 0;
    .count {
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
    .input-wrapper {
      width: 362px !important;
      flex: none;
    }
  }
  .input-wrapper {
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
  .popup-list {
    padding-top: 88px;
  }
  .popup-list-item {
    padding: 0 28px;
    height: 84px;
    line-height: 84px;
    border-bottom: 2px solid #E7E7E7;
    font-size: 28px;
    font-family: Microsoft YaHei;
    color: #000000;
    .role {
      color: #999999;
    }
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
      // &:after {
      //   background-color: #FE7700;
      // }
    }
  }
</style>
