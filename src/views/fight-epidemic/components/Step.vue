<template>
  <div ref="container" :class="$style.container">
    <div :class="$style.scroll">
      <div ref="node" :class="$style.item" v-for="(item,index) in list" :key="index">
        <div :class="$style.description">
          {{ item.dateString }}
        </div>
        <div :class="$style.content">
          <div :class="{[$style.line]:index + 1 !== list.length,[$style.lineSuccess]:signInStatus(item,index)}" />
          <div :class="{[$style.icon]:true,[$style.iconSuccess]:signInStatus(item,index)}">
            <img v-if="signInStatus(item,index)" src="https://mallcdn.youpenglai.com/static/beat-plague/73b1df62-f7ad-47fe-9b6c-bdab788f5021.png" alt="">
            <span style="font-size:20px;color:#6AE1FC" v-else-if="item.currentDay < 0 && item.healthValue === 0">未签</span>
            <span v-else>+{{ item.healthValue }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step',
  created () {
    // for (let i in this.list) {
    //   // 获取今天的节点
    //   if (this.list[i].currentDay === 0) {
    //     this.currentIndex = i
    //   }
    //   if ((this.list[i].currentDay === 0 && this.currentSign) || (this.list[i].currentDay < 0 && this.list[i].healthValue > 0)) {
    //     this.$set(this.list[i], 'status', true)
    //   } else {
    //     this.$set(this.list[i], 'status', false)
    //   }
    // }
  },
  mounted () {
    this.setPosition()
  },
  props: {
    // 进度条列表
    list: {
      type: Array,
      default () {
        return []
      }
    },
    currentSign: {
      type: Boolean
    }
  },
  data () {
    return {
      currentIndex: 0
    }
  },
  methods: {
    // 签到zhaungtai
    signInStatus ({ healthValue, currentDay, currentSign }, index) {
      // currentDay 大于0是未来，0是今天
      // healthValue 为0是未签到，大于0是签到
      // currentSign 今天是否签到
      if ((currentDay === 0 && currentSign) || (currentDay < 0 && healthValue > 0)) {
        return true
      }
      // 获取今天的节点
      if (currentDay === 0) {
        this.currentIndex = index
      }
      return false
    },
    // 把今天的定到左边边
    async setPosition () {
      let positionX = this.$refs.node[this.currentIndex].offsetLeft
      this.$refs.container.scrollTo(positionX, 0)
    }
  }
}
</script>

<style module lang='scss'>

.container {
    position: relative;
    overflow-x: auto;
    > .scroll {
        white-space: nowrap;
        > .item {
            display: inline-block;
            width: 73.5px;
            vertical-align: bottom;
            // flex-basis: 100%;
            > .description {
                text-align: center;
                margin-bottom: 16px;
            }
            > .content {
                display: flex;
                justify-content: center;
                position: relative;
                width: 100%;
                text-align: center;
                > .icon {
                    position: relative;
                    display: inline-flex;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    background: #2447BE;
                    > img {
                        width: 65px;
                        // height: 60px;
                    }
                }
                > .line {
                    position: absolute;
                    background: #2447BE;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 8px;
                }
                > .icon-success {
                    background: #FFFFFF;
                }
                > .line-success {
                    background: #FFFFFF;
                }
            }
        }
    }
}
</style>
