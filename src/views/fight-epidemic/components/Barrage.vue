<template>
  <div ref="container" class="container">
    <div class="runway" v-for="item in runwayNum" :key="item" />
  </div>
</template>

<script>
export default {
  name: 'Barrage',
  props: {
    // 弹幕列表
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      runwayNum: 2,
      runwayList: [],
      duration: 10, // 移动完毕时长
      runnerMes: [],
      runnerMesCopy: []
    }
  },
  async mounted () {
    this.runnerMes = this.list
    this.runnerMesCopy = JSON.parse(JSON.stringify(this.runnerMes))
    await this.getRunway()
    this.running()
    // 拷贝获取的弹幕信息
    // 不断注入弹幕,
    this.keepRunning()
    this.joinRunner()
  },
  methods: {
    // 作为真实弹幕逻辑，把之前的弹幕信息copy当作新弹幕导入
    keepRunning () {
      setTimeout(() => {
        this.runnerMes = JSON.parse(JSON.stringify(this.runnerMesCopy))
        this.keepRunning()
      }, 15000)
    },
    // 加入跑者
    joinRunner () {
      setTimeout(() => {
        this.running()
        this.joinRunner()
      }, 11000)
    },
    // 获得弹幕跑道
    async getRunway () {
      await this.$nextTick()
      let barrageList = this.$refs.container.getElementsByClassName('runway')
      for (let el of barrageList) {
        this.runwayList.push({
          el,
          status: true, // 跑道是否允许跑步
          runner: []
        })
      }
      // 如果只有一条弹幕信息，关闭其他跑道
      if (this.runnerMes.length === 1) {
        this.runwayList[1].status = false
      }
    },
    // 准备跑步
    running () {
      // 先跑空赛道
      for (let runway of this.runwayList) {
        if (!runway.runner.length) {
          this.createRunner(runway, this.runnerMes)
        }
      }
    },
    // 创造跑者
    createRunner (runway, runnerMes) {
      if (!runnerMes.length || !runway.status) return
      let width = runway.el.offsetWidth
      let startPoint = runway.el.offsetLeft + width
      let duration = this.duration
      let runner = document.createElement('div')
      runner.style.position = 'absolute'
      runner.style.top = '0px'
      runner.style.left = `${startPoint}px`
      let currentRunnerMes = runnerMes.shift()
      runner.innerHTML = `<img src=${currentRunnerMes.userImg}><div><div>${currentRunnerMes.name} 抗击疫情第${currentRunnerMes.signinDays}天</div><div>${currentRunnerMes.content}</div></div>`
      runway.el.appendChild(runner)
      runway.runner.push(runner)
      runway.status = false
      let runnerWidth = runner.offsetWidth
      // 跑者速度
      let speed = (width + runnerWidth) / duration
      let nowTime = Date.now()
      let keyframes = `
        @keyframes ani${nowTime}{
            form{
                left:${startPoint}px;
            }
            to{
                left:${(-runnerWidth)}px;
            }
        }`
      let head = document.getElementsByTagName('head')[0]
      let styleNode = document.createElement('style')
      styleNode.type = 'text/css'
      styleNode.innerHTML = keyframes
      head.append(styleNode)
      //   head.innerHTML += `<style class='ani-${nowTime}' type='text/css'>${keyframes}</style>`
      runner.style.animation = `ani${nowTime} ${duration}s linear`
      // 动画结束删除dom
      runner.addEventListener('animationend', () => {
        try {
          runner.remove()
          runway.runner.shift()
          styleNode.remove()
        } catch (e) { throw e }
      })
      // 完全身体出现时间,叫下一个
      let time = (runnerWidth / speed).toFixed(2)
      setTimeout(() => {
        runway.status = true
        if (this.runnerMes.length) {
          this.createRunner(runway, this.runnerMes)
        }
      }, time * 1000)
    }
  }
}
</script>

<style lang='scss'>
    .container {
        > .runway {
            position: relative;
            margin: 26px 0;
            height: 84px;
            > div {
                position: absolute;
                padding: 12px;
                display: flex;
                border-radius: 52px;
                background: rgba(0,0,0,0.2);
                white-space: nowrap;
                > img {
                    margin-right: 10px;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                }
                > div {
                    > div {
                        font-size: 24px;
                        color: #b3bbfd;
                    }
                    > div:nth-of-type(2) {
                        color: #dde1f9;
                    }
                }
            }
        }
    }
</style>
