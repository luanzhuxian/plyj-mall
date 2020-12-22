<template>
    <div
        :style="{
            '--bg': borderColor,
            '--bgc1': bgc1,
            '--bgc2': bgc2,
        }"
    >
        <button class="show-rule" @click="showRules">
            活动规则
        </button>
        <pl-popup
            title="活动细则"
            :show.sync="show"
        >
            <div class="rule-content">
                <h3>1.活动时间</h3>
                <p>{{ activeDetail.activityStartTime }}至{{ activeDetail.activityEndTime }}</p>
                <h3>2.活动对象</h3>
                <p>{{ activeDetail.activity_member }}</p>
                <h3>3.活动奖品</h3>
                <p>{{ flauntAwardName }}</p>
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
    </div>
</template>

<script>
export default {
    name: 'SignRule',
    data () {
        return {
            show: false
        }
    },
    props: {
        borderColor: {
            type: String,
            default: '#FFE3C8'
        },
        // 背景色1
        bgc1: {
            type: String,
            default: '#FF981A'
        },
        // 背景色1
        bgc2: {
            type: String,
            default: '#EE4620'
        },
        poster: {
            type: String,
            default: ''
        },
        // 大奖名称
        flauntAwardName: {
            type: String,
            default: '大奖'
        },
        activeDetail: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    methods: {
        showRules () {
            this.show = true
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
  .show-rule {
      position: fixed;
      right: 0;
      top: 366px;
      height: 48px;
      width: 136px;
      border: 1px solid var(--bc);
      border-right: none;
      border-radius: 24px 0 0 24px;
      line-height: 48px;
      background: linear-gradient(90deg, var(--bgc1),var(--bgc2));
      z-index: 1;
      font-size: 24px;
      color: #fff;
      text-align: center;
      letter-spacing: 2px;
  }
</style>
