// 获取当前文字大概的行数
export function getLine (el, fn) {
  let str = el.value || el.innerText
  let computedStyle = getComputedStyle(el)
  let fontSize = Number.parseInt(computedStyle.getPropertyValue('font-size'))
  let width = Number.parseInt(computedStyle.getPropertyValue('width'))
  let num = 0
  let i = 0
  let codePoint = str.codePointAt(i)
  while (codePoint) {
    if (codePoint > 127) {
      num += 2
    } else {
      num++
    }
    i++
    codePoint = str.codePointAt(i)
  }
  let byteOnRow = Math.floor(width / fontSize)
  fn(Math.floor(num / byteOnRow))
}
// 节流阀
// fn是我们需要包装的事件回调, delay是时间间隔的阈值
export function throttle (fn, delay) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0; let timer = null
  // 将throttle处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, delay)
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now
      fn.apply(context, args)
    }
  }
}
