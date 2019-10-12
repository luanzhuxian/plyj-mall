export class CanvasBarrage {
  constructor (canvas, player, options) {
    if (!canvas || !player) {
      throw new Error('请传入player和canvas')
    }
    this.time = 0
    this.isPause = true
    this.store = {}
    this.fontSize = 28
    this.canvas = canvas
    this.player = player
    this.context = canvas.getContext('2d')
    const defaults = {
      opacity: 100,
      fontSize: 24,
      speed: 2,
      range: [0, 0.5], // 弹幕显示的垂直范围。数组。支持两个值。[0,1]表示弹幕整个随机分布，[0,0.5]表示只在上半区域随机分布，[0.5,1]表示只在下半区域随机分布。
      color: 'white',
      data: []
    }
    const params = {}
    options = options || {}
    // 将options中的key绑定到this上
    for (let key in defaults) {
      if (options[key]) {
        params[key] = options[key]
      } else {
        params[key] = defaults[key]
      }
      this[key] = params[key]
    }
    if (this.data && this.data.length) {
      for (let [item, index] of this.data.entries()) {
        this.store[index] = new Barrage(item, this)
      }
    }

    // 监听播放器事件
    let that = this
    player.on('playing', function () {
      that.isPause = false
      that.render()
      console.warn('playing')
    })
    player.on('pause', function () {
      that.isPause = true
      console.warn('pause')
    })
    player.on('ended', function () {
      console.warn('ended')
      that.isPause = true
    })
  }
  draw () {
    let { store, time } = this
    for (let key of Object.keys(store)) {
      let barrage = store[key]
      if (barrage && !barrage.disabled && time >= barrage.time) {
        if (!barrage.inited) {
          barrage.init()
          barrage.inited = true
        }
        barrage.x -= barrage.moveX
        if (barrage.moveX === 0) {
          barrage.actualX -= top.speed
        } else {
          barrage.actualX = barrage.x
        }
        if (barrage.actualX < -1 * barrage.width) {
          barrage.x = barrage.actualX
          barrage.disabled = true
        }
        barrage.draw()
      }
    }
  }

  render () {
    let { player, context, canvas, isPause } = this
    this.time = player.currentTime
    context.clearRect(0, 0, canvas.width, canvas.height)
    console.log(1)
    this.draw()
    if (isPause === false) {
      requestAnimationFrame(this.render.bind(this))
    }
  }

  add (obj) {
    this.store[Object.keys(this.store).length] = new Barrage(obj, this)
  }
  reset () {
    this.time = this.player.currentTime
    let { context, canvas, store, time } = this
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (let barrage of store) {
      if (barrage) {
        barrage.disabled = false
        if (time < barrage.time) {
          // barrage.disabled = true;
          barrage.inited = null
        } else {
          barrage.disabled = true
        }
      }
    }
  }
}
class Barrage {
  constructor (obj, top) {
    this.value = obj.value
    this.time = obj.time
    this.obj = obj
    this.top = top
    this.canvas = top.canvas
  }
  init () {
    let { top, obj, canvas } = this
    let speed = top.speed
    if (obj.hasOwnProperty('speed')) {
      speed = obj.speed
    }
    if (speed !== 0) {
      speed = speed + obj.value.length / 100
    }
    let fontSize = obj.fontSize || top.fontSize
    let color = obj.color || top.color
    color = (function () {
      let div = document.createElement('div')
      div.style.backgroundColor = color
      document.body.appendChild(div)
      let c = window.getComputedStyle(div).backgroundColor
      document.body.removeChild(div)
      return c
    })()

    let range = obj.range || top.range
    let opacity = obj.opacity || top.opacity
    opacity = opacity / 100

    let span = document.createElement('span')
    span.style.position = 'absolute'
    span.style.whiteSpace = 'nowrap'
    span.style.font = 'bold ' + fontSize + 'px "microsoft yahei", sans-serif'
    span.innerText = obj.value
    span.textContent = obj.value
    document.body.appendChild(span)
    this.width = span.clientWidth
    document.body.removeChild(span)
    this.x = canvas.width
    if (speed === 0) {
      this.x = (this.x - this.width) / 2
    }
    this.actualX = canvas.width
    this.y = range[0] * canvas.height + (range[1] - range[0]) * canvas.height * Math.random()
    if (this.y < fontSize) {
      this.y = fontSize
    } else if (this.y > canvas.height - fontSize) {
      this.y = canvas.height - fontSize
    }

    this.moveX = speed
    this.opacity = opacity
    this.color = color
    this.range = range
    this.fontSize = fontSize
  }

  draw () {
    let { context } = this.top
    // 鏍规嵁姝ゆ椂x浣嶇疆缁樺埗鏂囨湰
    context.shadowColor = 'rgba(0,0,0,' + this.opacity + ')'
    context.shadowBlur = 2
    context.font = this.fontSize + 'px "microsoft yahei", sans-serif'
    if (/rgb\(/.test(this.color)) {
      context.fillStyle = 'rgba(' + this.color.split('(')[1].split(')')[0] + ',' + this.opacity + ')'
    } else {
      context.fillStyle = this.color
    }
    // 濉壊
    context.fillText(this.value, this.x, this.y)
  }
}
