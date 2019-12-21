<template>
  <pl-popup
    title="活动细则"
    :show="show"
    @close="close"
  >
    <div class="rule-content">
      <h3>1.活动时间</h3>
      <p>{{ activeDetail.activityStartTime }}至{{ activeDetail.activityEndTime }}</p>
      <h3>2.活动对象</h3>
      <p>{{ activeDetail.activity_member }}</p>
      <h3>3.活动奖品</h3>
      <p>年味大礼</p>
      <h3>4.活动说明</h3>
      <template v-if="activeDetail.activityRule">
        <span v-for="(item,index) of activeDetail.activityRule.split('\n')" :key="index">
          {{ item }}
        </span>
      </template>
      <template v-else>
        <span>暂无活动说明</span>
      </template>
    </div>
  </pl-popup>
</template>

<script>
export default {
  name: 'ActivityRule',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    poster: {
      type: String,
      default: ''
    },
    activeDetail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:show')
    }
  }
}
</script>

<style scoped lang="scss">
  .rule-content {
    padding: 0 40px 40px;

    h3 {
      font-size: 32px;
      margin-top: 40px;
      margin-bottom: 10px;
    }

    p {
      font-size: 28px;
    }

    span {
      display: block;
      font-size: 28px;
    }
  }
</style>
