// const qrcode = require('../../../static/lib/qrcode/index')
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

/**
 * 大小数字
 * @param n {number} 要转换的数字
 * @returns {string}
 */
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
/**
 * 节流阀
 * @param fn {Function} 需要包装的事件回调
 * @param delay {Number} 时间间隔的阈值
 * @returns {Function} 包装后的函数
 */
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

/**
 * 重置表单
 * @param form {Object} 表单
 * @param def {Object} 默认的属性值
 */
export function resetForm (form, def = {}) {
  for (let k of Object.keys(form)) {
    let val = form[k]
    if (typeof val === 'string') {
      form[k] = def[k] || ''
      continue
    }
    if (typeof val === 'number') {
      form[k] = def[k] || 0
      continue
    }
    if (Array.isArray(form[k])) {
      if (def[k]) {
        form[k].splice(0, form[k].length, ...def[k])
      } else {
        form[k].splice(0, form[k].length)
      }
      continue
    }
    if (typeof val === 'object') {
      resetForm(val)
    }
  }
}

export function isDef (value) {
  return value !== undefined && value !== null
}

export function isObj (x) {
  const type = typeof x
  return x !== null && (type === 'object' || type === 'function')
}

export function isNumber (value) {
  return /^\d+$/.test(value)
}

export function suffixPx (value) {
  if (!isDef(value)) {
    return undefined
  }
  value = String(value)
  return isNumber(value) ? `${value}px` : value
}
/**
 * 生成商品二维码
 * @param size {number} 二维码尺寸，必填
 * @param text {string} 二维码内容，必填
 * @param padding {number} 二维码的白边大小，默认未0
 * @param img {HTMLElement} 二维码中心图片,可以是img或canvas
 * @param centerPadding 二维码中心图片的白边大小，默认未0
 * @param type {string} 生成的类型 canvas: 生成canvas, url 生成base64
 * @returns {Promise<*>}
 */
export async function generateQrcode (size, text, padding = 0, img, centerPadding = 0, type) {
  const imageSize = 80 // 中心图片的宽高
  const devicePixelRatio = window.devicePixelRatio
  let canvas
  canvas = new window.Qrcode({
    render: 'canvas',
    correctLevel: 3, // 纠错级别
    text, // 内容
    size, // 大小
    background: '#ffffff',
    foreground: '#000000',
    pdground: '#000000'
    // image: '', 不起作用，注释掉
    // imageSize: 30
  })
  return new Promise((resolve) => {
    // 生成中心图片内边距
    if (img) {
      if (centerPadding > 0) {
        let tempCanvas = document.createElement('canvas')
        tempCanvas.width = imageSize + centerPadding * 2
        tempCanvas.height = imageSize + centerPadding * 2
        let tempCtx = tempCanvas.getContext('2d')
        tempCtx.fillStyle = '#ffffff'
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
        tempCtx.drawImage(img, centerPadding, centerPadding, imageSize, imageSize)
        img = tempCanvas
      }
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, (size * devicePixelRatio - img.width) / 2, (size * devicePixelRatio - img.width) / 2, img.width, img.width)
    }
    // 绘制二维码内边距
    if (padding > 0) {
      let tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width + padding * 2
      tempCanvas.height = canvas.height + padding * 2
      let tempCtx = tempCanvas.getContext('2d')
      tempCtx.fillStyle = '#ffffff'
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempCtx.drawImage(canvas, padding, padding, canvas.width, canvas.height)
      canvas = tempCanvas
    }
    if (type === 'url') {
      resolve(canvas.toDataURL())
    }
    if (type === 'canvas') {
      resolve(canvas)
    }
  })
}
/**
 * 截取图片中间部分
 * @param img {HTMLElement} 要截取的图片
 * @returns {HTMLElement} 返回canvas对象
 */
export function cutImageCenter (img) {
  const canvas = document.createElement('canvas')
  let w = img.naturalWidth
  let h = img.naturalHeight
  let min = Math.min(w, h)
  canvas.width = min
  canvas.height = min
  const ctx = canvas.getContext('2d')
  if (w >= h) {
    ctx.drawImage(img, (w - h) / 2, 0, h, h, 0, 0, h, h)
  } else {
    ctx.drawImage(img, 0, (h - w) / 2, w, w, 0, 0, w, w)
  }
  return canvas
}
/**
 * 把图片截成圆形
 * @param img {HTMLElement} 要截取的图片
 * @returns {HTMLElement} 返回canvas对象
 */
export function cutArcImage (img) {
  const centerCanvas = cutImageCenter(img)
  const canvas = cutImageCenter(img)
  const w = canvas.width = centerCanvas.width
  const h = canvas.height = centerCanvas.height
  const ctx = canvas.getContext('2d')
  ctx.arc(w / 2, h / 2, h / 2, 0, Math.PI * 2, false)
  ctx.clip()
  ctx.drawImage(centerCanvas, 0, 0, w, h, 0, 0, w, h)
  return canvas
}
