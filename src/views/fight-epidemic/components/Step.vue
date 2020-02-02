<template>
  <div ref="container" :class="$style.container">
    <div :class="$style.scroll">
      <div :class="$style.item" v-for="(item,index) in list" :key="index">
        <div :class="$style.description">
          {{ item.description }}
        </div>
        <div :class="$style.content">
          <div :class="{[$style.line]:index + 1 !== list.length,[$style.lineSuccess]:item.status}" />
          <div :class="{[$style.icon]:true,[$style.iconSuccess]:item.status}">
            <img v-if="item.status" src="https://mallcdn.youpenglai.com/static/beat-plague/73b1df62-f7ad-47fe-9b6c-bdab788f5021.png" alt="">
            <span v-else>{{ item.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step',
  mounted () {
    this.$refs.container.scrollBy(1000, 0)
  },
  data () {
    return {
      list: [
        {
          status: false, // 是否高亮
          title: '+1',
          description: '1.31'
        },
        {
          status: false, // 是否高亮
          title: '+2',
          description: '1.31'
        },
        {
          status: false, // 是否高亮
          title: '+3',
          description: '1.31'
        },
        {
          status: false, // 是否高亮
          title: '+4',
          description: '1.31'
        },
        {
          status: true, // 是否高亮
          title: '+5',
          description: '1.31'
        },
        {
          status: true, // 是否高亮
          title: '+6',
          description: '1.31'
        },
        {
          status: false, // 是否高亮
          title: '+7',
          description: '1.31'
        },
        {
          status: true, // 是否高亮
          title: '+8',
          description: '1.31'
        },
        {
          status: false, // 是否高亮
          title: '+9',
          description: '1.31'
        }
      ]
    }
  }
}
</script>

<style module lang='scss'>

.container {
    overflow: auto;
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
