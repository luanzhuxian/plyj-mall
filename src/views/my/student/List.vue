<template>
  <div :class="$style.studentList">
    <load-more
      :form="form"
      ref="load"
      :request-methods="getList"
    >
      <template v-slot="{ list }">
        <ul>
          <li
            v-for="(item, i) of list"
            :class="{
              [$style.item]: true,
              [$style.active]: checked.indexOf(item) > -1
            }"
            :key="i"
          >
            <pl-checkbox v-if="canSelect" :data="item" @change="selectChange" />
            <div :class="$style.content">
              <div :class="$style.name">
                <span v-text="item.stuName" />
                <img v-if="item.defaultStatus === 1" :src="createType('默认')" alt="">
              </div>
              <div :class="$style.phone" v-text="item.stuMobile" />
            </div>
            <router-link tag="div" :to="{ name: 'EditStudent', params: { id: item.id } }" :class="$style.edit">
              编辑
            </router-link>
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
        @click="$router.push({ name: 'AddStudent' })"
      >
        <span v-text="canSelect ? '新增学员' : '点击这里，新增一个学员信息'" />
        <pl-svg name="add-bold" :color="!canSelect ? '#fff' : '#F2B036'" />
      </button>
      <button v-if="canSelect" :class="$style.confirmBtn">
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
      checked: []
    }
  },
  computed: {
    canSelect () {
      return false
    }
  },
  activated () {
    this.$refs.load.refresh()
  },
  methods: {
    selectChange (checked, data) {
      if (checked) {
        this.checked.push(data)
      } else {
        this.checked.splice(this.checked.indexOf(data), 1)
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
    }
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
