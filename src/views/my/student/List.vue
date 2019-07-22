<template>
  <div :class="$style.studentList">
    <load-more
      :form="form"
      ref="load"
      :request-methods="getList"
      @refresh="refresh"
      @more="more"
    >
      <template>
        <ul v-if="list.length > 0">
          <li
            v-for="(item, i) of list"
            :class="{
              [$style.item]: true,
              [$style.active]: checked.indexOf(item) > -1
            }"
            :key="i"
          >
            <pl-checkbox
              v-if="canSelect"
              :data="item"
              :checked="item.checked"
              @change="selectChange"
              :disabled="checked.indexOf(item) === -1 && checked.length === maxCount"
            />
            <div :class="$style.content">
              <div :class="$style.name">
                <span v-text="item.stuName" />
                <img v-if="item.defaultStatus === 1" :src="createType('默认')" alt="">
              </div>
              <div :class="$style.phone" v-text="item.stuMobile" />
            </div>
            <button
              tag="div"
              :class="$style.edit"
              @click="$router.push({ name: 'EditStudent', params: { id: item.id }, query: $route.query })"
            >
              编辑
            </button>
          </li>
        </ul>
      </template>
    </load-more>

    <div
      :class="{
        [$style.buttons]: true,
        [$style.canSelect]: !canSelect
      }"
    >
      <button
        :class="{
          [$style.addBtn]: true,
          [$style.canSelect]: !canSelect
        }"
        @click="$router.push({ name: 'AddStudent', query: $route.query })"
      >
        <span v-text="canSelect ? '新增学员' : '点击这里，新增一个学员信息'" />
        <pl-svg name="add-bold" :color="!canSelect ? '#fff' : '#F2B036'" />
      </button>
      <button v-if="canSelect" @click="confirmSelect" :class="$style.confirmBtn">
        <span>确定</span>
        <span>({{ checked.length }})</span>
      </button>
    </div>
  </div>
</template>

<script>
import { getList } from '../../../apis/student'
import LoadMore from '../../../components/Load-More.vue'
export default {
  name: 'StudentList',
  components: {
    LoadMore
  },
  data () {
    return {
      form: {
        current: 1,
        size: 10
      },
      getList,
      checked: [],
      list: []
    }
  },
  computed: {
    canSelect () {
      return this.$route.query.select === 'YES'
    },
    // 选择的学员所对应的商品
    proId () {
      return this.$route.query.sku
    },
    // 最大可选数量
    maxCount () {
      return Number(this.$route.query.count) || 0
    }
  },
  activated () {
    this.$refs.load.refresh()
    this.CHECKED_STUDENT = JSON.parse(localStorage.getItem('CHECKED_STUDENT')) || null
  },
  deactivated () {
    this.checked = []
    this.$destroy()
  },
  methods: {
    selectChange (checked, data) {
      if (checked) {
        if (this.checked.length < this.maxCount) {
          this.checked.push(data)
        } else {
          this.$warning(`最多选择${this.maxCount}名学员`)
        }
      } else {
        this.checked.splice(this.checked.indexOf(data), 1)
      }
    },
    confirmSelect () {
      let checked = JSON.parse(localStorage.getItem('CHECKED_STUDENT')) || {}
      checked[this.proId] = this.checked
      localStorage.setItem('CHECKED_STUDENT', JSON.stringify(checked))
      let { name, params, query } = JSON.parse(localStorage.getItem('SELECT_STUDENT_FROM')) || {}
      if (name) {
        this.$router.push({
          name,
          params,
          query
        })
      } else {
        this.$router.replace({
          name: 'Home'
        })
      }
    },
    createType (text) {
      let canvas = document.createElement('canvas')
      canvas.width = 74
      canvas.height = 32
      let ctx = canvas.getContext('2d')
      ctx.rect(0, 0, 74, 32)
      ctx.fillStyle = '#fcefd7'
      ctx.fill()

      ctx.font = '24px Microsoft Yahei UI'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#FE7700'
      ctx.fillText(text, 37, 25)

      return canvas.toDataURL()
    },
    refresh (list) {
      list.map(item => {
        item.checked = false
      })
      this.setDefaultChecked(list)
      this.list = list
    },
    more (list) {
      list.map(item => {
        item.checked = false
      })
      this.setDefaultChecked(list)
      this.list = list
    },
    setDefaultChecked (list) {
      if (this.CHECKED_STUDENT && this.CHECKED_STUDENT[this.proId]) {
        let current = this.CHECKED_STUDENT[this.proId].map(item => item.id)
        list.map(item => {
          item.checked = current.indexOf(item.id) > -1
        })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.canSelect) {
        vm.from = from
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'EditStudent' && to.name !== 'AddStudent') {
      localStorage.removeItem('SELECT_STUDENT_FROM')
    }
    next()
  }
}
</script>

<style module lang="scss">
  .student-list {
    padding: 20px 24px 160px 24px;
    min-height: 100vh;
    box-sizing: border-box;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 138px;
    margin-bottom: 16px;
    padding: 0 24px;
    background-color: #fff;
    border-radius: 20px;
    box-sizing: border-box;
    border: 1px solid #fff;
    &.active {
      border: 1px solid #F2B036;
    }
  }
  .content {
    flex: 1;
    display: flex;
    height: 100%;
    margin-left: 20px;
    padding: 28px 0;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    .name {
      font-size: 28px;
      color: #2e2e2e;
      font-weight: 600;
      img {
        vertical-align: -3px;
        margin-left: 14px;
      }
    }
    .phone {
      font-size: 24px;
    }
  }
  .edit {
    padding-left: 30px;
    font-size: 28px;
    line-height: 56px;
    color: #999;
    border-left: 1px solid #e7e7e7;
  }
  .buttons {
    position: fixed;
    bottom: 40px;
    display: grid;
    grid-template-columns: 340px 340px;
    grid-gap: 22px;
    &.can-select {
      display: block;
      width: 702px;
    }
    > button {
      height: 108px;
      font-size: 32px;
      font-weight: bold;
      border-radius: 20px;
      &.add-btn {
        color: $--warning-color;
        background-color: #fff;
        > svg {
          width: 34px;
          margin-left: 8px;
          vertical-align: -6px;
        }
        &.can-select {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 0 40px;
          background-color: $--warning-color;
          color: #fff;
        }
      }
      &.confirm-btn {
        color: #fff;
        background-color:$--warning-color;
      }
    }
  }
</style>
