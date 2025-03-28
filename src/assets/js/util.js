// const qrcode = require('../../../static/lib/qrcode/index')
/* eslint-disable */

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
    const p = n.indexOf('.')
    if (p >= 0) {
        n = n.substring(0, p) + n.substr(p + 1, 2)
    }
    unit = unit.substr(unit.length - n.length)
    for (let i = 0; i < n.length; i++) {
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
    }
    return str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零')
        .replace(/零(兆|万|亿|元)/g, '$1')
        .replace(/(亿)万|壹(拾)/g, '$1$2')
        .replace(/^元零?|零分/g, '')
        .replace(/元$/g, '元整')
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

/*
* template: 字段模板
* target: 根据字段模板从target中复制出相关字段
* */
export function copyFields (template, target) {
    if (typeof target !== 'object') return template
    for (const k of Object.keys(template)) {
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
        const context = this

        // 保留调用时传入的参数
        const args = arguments

        // 记录本次触发回调的时间
        const now = +new Date()

        // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
        if (now - last < delay) {
            // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
            clearTimeout(timer)
            timer = setTimeout(() => {
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
 * 防抖
 * @param fn {Function} 需要包装的事件回调
 * @param delay {Number} 时间间隔的阈值
 * @returns {Function}
 */
export function debounce (fn, delay) {
    let timer
    return function () {
        const context = this
        const args = arguments
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(context, args)
        }, delay)
    }
}

/**
 * 重置表单
 * @param form {Object} 表单
 * @param def {Object} 默认的属性值
 */
export function resetForm (form, def = {}) {
    for (const k of Object.keys(form)) {
        const val = form[k]
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

/**
 * 判读是否为IOS
 * @return {boolean}
 */
export function isIOS () {
    return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

export function isAndroid  () {
    return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1
}

/**
 * 生成商品二维码
 * @param size {number} 二维码尺寸，必填
 * @param text {string} 二维码内容，必填
 * @param [padding] {number} 二维码的白边大小，默认未0
 * @param [img] {HTMLElement} 二维码中心图片,可以是img或canvas
 * @param [centerPadding] 二维码中心图片的白边大小，默认未0
 * @param [type] {string} 生成的类型 canvas: 生成canvas, url 生成base64
 * @param [correctLevel] {number} 纠错等级[1,2,3]
 * @param imageSize {number} 中心图片的大小
 * @returns {Promise<*>}
 */
export async function generateQrcode ({ size, text, padding = 0, img = null, centerPadding = 0, type = 'url', imageSize = 80, correctLevel = 2 }) {
    const { devicePixelRatio } = window
    let canvas
    canvas = new window.Qrcode({
        render: 'canvas',
        correctLevel, // 纠错级别
        text, // 内容
        size, // 大小
        background: '#ffffff',
        foreground: '#000000',
        pdground: '#000000'

    // image: '', 不起作用，注释掉
    // imageSize: 30
    })
    return new Promise(resolve => {
        // 生成中心图片内边距
        if (img) {
            if (centerPadding > 0) {
                const tempCanvas = document.createElement('canvas')
                tempCanvas.width = imageSize + centerPadding * 2
                tempCanvas.height = imageSize + centerPadding * 2
                const tempCtx = tempCanvas.getContext('2d')
                tempCtx.fillStyle = '#ffffff'
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
                tempCtx.drawImage(img, centerPadding, centerPadding, imageSize, imageSize)
                img = tempCanvas
            }
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, (size * devicePixelRatio - img.width) / 2, (size * devicePixelRatio - img.width) / 2, img.width, img.width)
        }

        // 绘制二维码内边距
        if (padding > 0) {
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = canvas.width + padding * 2
            tempCanvas.height = canvas.height + padding * 2
            const tempCtx = tempCanvas.getContext('2d')
            tempCtx.fillStyle = '#ffffff'
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
            tempCtx.drawImage(canvas, padding, padding, canvas.width, canvas.height)
            canvas = tempCanvas
        }
        if (type === 'url') {
            resolve(canvas.toDataURL())
        } else if (type === 'canvas') {
            resolve(canvas)
        } else if (type === 'blob') {
            canvas.toBlob(blob => {
                resolve(blob)
            }, 'image/jpeg', 0.7)
        }
    })
}

/**
 * 截取图片中间部分
 * @param img {HTMLImageElement} 要截取的图片
 * @param ratio {Number} 裁剪图片的长宽比 默认是1:1
 * @returns {HTMLCanvasElement} 返回canvas对象
 */
export function cutImageCenter (img, ratio = 1) {
    const canvas = document.createElement('canvas')
    const w = img.naturalWidth
    const h = img.naturalHeight

    // 说明图片高度有可能不够
    if (w / h >= ratio) {
        canvas.width = h * ratio
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(
            img,
            (w - canvas.width) / 2,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
        )
    } else {
        canvas.width = w
        canvas.height = w / ratio
        const ctx = canvas.getContext('2d')
        ctx.drawImage(
            img,
            0,
            (h - canvas.height) / 2,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
        )
    }
    return canvas
}

/**
 * 把图片截成圆形
 * @param img {HTMLImageElement} 要截取的图片
 * @returns {HTMLCanvasElement} 返回canvas对象
 */
export function cutArcImage (img) {
    const centerCanvas = cutImageCenter(img)
    const canvas = document.createElement('canvas')
    const w = canvas.width = centerCanvas.width
    const h = canvas.height = centerCanvas.height
    const ctx = canvas.getContext('2d')
    ctx.arc(w / 2, h / 2, h / 2, 0, Math.PI * 2, false)
    ctx.clip()
    ctx.drawImage(centerCanvas, 0, 0, w, h, 0, 0, w, h)
    return canvas
}

export function setTimeoutSync (duration) {
    return new Promise(resolve => {
        const timer = setTimeout(() => {
            resolve(timer)
        }, duration)
    })
}

/**
 * 绘制文本
 * @param ctx {CanvasRenderingContext2D} 2d context
 * @param x {Number} 文本开始的x坐标
 * @param y {Number} 文本开始的y坐标
 * @param width {Number} 每行文本的最大宽度, 如果为0或者不传，文字不限制长度
 * @param text {String} 文本
 * @param lineHeight {Number} 行高
 * @param lineNumber {Number} 行数（超过行数时，以...结尾）
 */
export function createText ({ctx, x, y, text, lineHeight = 1, width= 0, lineNumber = 1}) {
    // 填充商品名称
    let charArr = []
    const strArr = []
    let txtWidth = 0
    let lineCount = 0 // 文字行数
    const ellipsisWidth = ctx.measureText('...').width
    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        charArr.push(char)
        txtWidth += ctx.measureText(char).width
        if (lineCount === lineNumber - 1 && width > 0 && txtWidth + ellipsisWidth >= width) {
            // 最后一行的文字
            charArr.push('...')
            strArr.push(charArr.join(''))
            break
        }

        // 文本换行
        if (width > 0 && txtWidth >= width || i === text.length - 1) {
            lineCount++
            strArr.push(charArr.join(''))
            txtWidth = 0
            charArr = []
        }
    }
    for (const [i, str] of strArr.entries()) {
        ctx.fillText(str, x, y + lineHeight * i)
    }
    return ctx.measureText(strArr[0]).width
}

/**
 * 绘制圆角矩形
 */
export function drawRoundRect ({ ctx, x, y, width, height, radius, strokeStyle, fillStyle }) {
    ctx.beginPath()
    ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2)
    ctx.lineTo(width - radius + x, y)
    ctx.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2)
    ctx.lineTo(width + x, height + y - radius)
    ctx.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2)
    ctx.lineTo(radius + x, height + y)
    ctx.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI)
    ctx.closePath()
    ctx.strokeStyle = strokeStyle || fillStyle
    ctx.fillStyle = fillStyle
    ctx.stroke()
    ctx.fill()
}

/**
 * 加载跨域图片
 * @param src {string}
 * @return {Promise<HTMLImageElement>}
 */
export function loadImage (src) {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = `${ src }?t=${ Date.now() }`
    return new Promise((resolve, reject) => {
        img.onload = () => {
            resolve(img)
        }
        img.onerror = e => {
            reject(new Error(`图片加载错误: ${ src }`))
        }
    })
}

/**
 * 创建canvas
 * @param w {number}
 * @param h {number}
 * @return {cvs, ctx}:{ HTMLCanvasElement, CanvasRenderingContext2D }
 */
export const createCanvas = (w = 0, h = 0) => {
    const cvs = document.createElement('canvas')
    const ctx = cvs.getContext('2d')
    if (w && h) {
        cvs.width = w
        cvs.height = h
    }
    return {
        cvs,
        ctx
    }
}

export const promise = {
    timeout (ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }
}
/**
 * 大写数字
 * @param n {number} 要转换的数字
 * @returns {string}
 */
export function SectionToChinese (n) {
    const N = n
    let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    let chnUnitChar = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿', '万亿']
    let strIns = ''
    let chnStr = ''
    let unitPos = 0
    let zero = true
    while (n > 0) {
        let v = n % 10
        if (v === 0) {
            if (!zero) {
                zero = true
                chnStr = chnNumChar[v] + chnStr
            }
        } else {
            zero = false
            strIns = chnNumChar[v]
            strIns += chnUnitChar[unitPos]
            chnStr = strIns + chnStr
        }
        unitPos++
        n = Math.floor(n / 10)
    }
    if (N >= 10 && N < 20) {
        return chnStr.replace(/^一/, '')
    }
    return chnStr
}

/**
 * 自动导入文件
 * @param context webpackContext
 */
export const importFiles = context => {
    const files = []
    for (const key of context.keys()) {
        const file = context(key).default || context(key)
        files.push(...file)
    }
    return files
}
