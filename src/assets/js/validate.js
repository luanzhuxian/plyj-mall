// 返回字符串所占用的字节数
export function codePointNo (str) {
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
    return num
}

// 是否有值。检查"必填"项。
export function hasValue (val) {
    if (val === undefined || val === null || val === '') {
        return false
    }
    return true
}

// 检测长度是否符合指定的长度
export function checkLength (length) {
    return function (val) {
        return String(val).length < length
    }
}

// 姓名检查
export function isName (name) {
    if (codePointNo(name) <= 20) {
        return /^[a-zA-Z_\u4e00-\u9fa5\\-]{2,50}$/.test(name)
    }
    return false
}

// 中英文检查
// isZhEn
export function isEn (val) {
    return /^([A-Za-z]{2,20})$/.test(val)
}

export function isEmoji (val) {
    return /[\uD800-\uDBFF\uDC00-\uDFFF]/g.test(val)
}

// 校验快递单号
export function isExpressNumber (str) {
    return /^[0-9a-zA-Z]+$/.test(str)
}

export function isUrl (url) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
}

// 是否数字。（不能有小数点）
export function isDigit (val) { // 经测试，对于非字符串，不会报错，返回 false
    return /^\d+$/.test(val)
}

export function isPassWord (val) {
    return /[\da-zA-Z_%.*]{6,20}/.test(val)
}

// 是否整数。能否使用 parseInt 转换成整数。据说能识别42位十进制整数，未验证。
export function isInteger (val) {
    return !window.isNaN(window.parseInt(val))
}

// 是否小数。能否使用 parseFloat 转换成浮点数。
export function isFloat (val) {
    return !window.isNaN(window.parseFloat(val))
}

export function isQQ (val) {
    return /^\d{1,12}$/.test(val)
}

// 是否手机号码
export function isPhone (val) {
    return /^1[0-9]{10}$/.test(val)
}

// 是否Email
export function isEmail (val) {
    return /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(val)
}

export function isChZn (val) {
    return /^[\u4E00-\u9FA5\uff08\uff09()]+$/.test(val)
}

export function isBankId (val) {
    return /^\d{8,28}$/.test(val)
}

export function isMoney (val) {
    return /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/.test(val)
}

export function isPositive (val) {
    if (val <= 0) {
        return false
    }
    return /^\d+(\.\d{1,2})?$/.test(Number(val))
}

/* 校验税号 */
export function isDutyNumber (val) {
    return /^[\da-zA-Z]{1,25}$/.test(val)
}

// 判断身份证号码是否正确
export function isIdCard (val) {
    if (!val || !val.trim()) {
        return false
    }
    val = val.toString().trim()
    const reg = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2]\d)|(3[0-1]))((\d{4})|(\d{3}[Xx]))$/

    // 用于存储结果
    const result = {}
    if (reg.test(val)) {
        let sum = 0
        const arrID = val.split('')
        const arrWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        const arrY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]
        for (let i = 0; i < arrWi.length; i++) {
            sum += arrID[i] * arrWi[i]
        };
        sum %= 11
        let lastID = arrID[arrID.length - 1]
        if (lastID === 'X' || lastID === 'x') {
            lastID = 10
        };
        if (arrY[sum] === Number(lastID)) {
            result.check = true
            result.birthday = val.substr(6, 8)
            result.cityCode = val.substr(0, 6)
            result.gender = (val.substr(14, 3) % 2 === 0) ? '女' : '男'
        } else {
            result.check = false
            result.error = '身份证号码输入错误'
        }
    } else {
        result.check = false
        result.error = '身份证号码格式有误'
    }
    console.log(result.check)
    return result.check
}

export function _getLength (val) { // 是否考虑把非 string 转换成 string ? 如数字。。。
    let length = 0
    val = String(val)
    if (val && val.length) {
        length = val.length
    }
    return length
}

export function createText (ctx, x, y, text, lineHeight, width, lineNumber) {
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
        if (lineCount === lineNumber - 1 && txtWidth + ellipsisWidth >= width) {
            // 最后一行的文字
            charArr.push('...')
            strArr.push(charArr.join(''))
            break
        }

        // 文本换行
        if (txtWidth >= width || i === text.length - 1) {
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
