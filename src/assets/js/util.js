export function createObjectUrl (blob) {
  let url
  if (window.createObjectURL) { // basic
    url = window.createObjectURL(blob)
  } else if (window.URL) { // mozilla(firefox)
    url = window.URL.createObjectURL(blob)
  } else if (window.webkitURL) { // webkit or chrome
    url = window.webkitURL.createObjectURL(blob)
  }
  return url
}
export function revokeObjectURL (URL) {
  window.URL.revokeObjectURL(URL)
}

export function DX (n) {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
    return '数据非法'
  }
  let unit = '亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分'
  let str = ''
  n += '00'
  let p = n.indexOf('.')
  if (p >= 0) {
    n = n.substring(0, p) + n.substr(p + 1, 2)
  }
  unit = unit.substr(unit.length - n.length)
  for (let i = 0; i < n.length; i++) {
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
  }
  return str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(兆|万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整')
}

export class DelayExec {
  constructor (time) {
    this.time = time
    this.timer = 0
  }
  exec () {
    return new Promise(resolve => {
      clearInterval(this.timer)
      this.timer = setTimeout(() => {
        resolve()
      }, this.time)
    })
  }
}

export function setSession (key, data) {
  sessionStorage.setItem(key, JSON.stringify(data))
}
export function getSession (key) {
  return JSON.parse(sessionStorage.getItem(key) || '{}')
}
export function setLocalStorage (key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}
export function getLocalStorage (key) {
  return JSON.parse(localStorage.getItem(key) || '{}')
}
/*
* template: 字段模板
* target: 根据字段模板从target中复制出相关字段
* */
export function copyFields (template, target) {
  if (typeof target !== 'object') return template
  for (let k of Object.keys(template)) {
    template[k] = target[k]
  }
  return template
}

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

// 重置表单
export function resetForm (form) {
  for (let k of Object.keys(form)) {
    let val = form[k]
    if (typeof val === 'string') {
      form[k] = ''
      continue
    }
    if (typeof val === 'number') {
      form[k] = 0
      continue
    }
    if (Array.isArray(form[k])) {
      form[k].splice(0, form[k].length)
      continue
    }
    if (typeof val === 'object') {
      resetForm(val)
    }
  }
}
