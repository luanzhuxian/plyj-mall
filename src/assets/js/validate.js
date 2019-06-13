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
    return isEn(name) || /^([\u4e00-\u9fa5]{2,10})$/.test(name)
  }
  return false
}
// 中英文检查
// isZhEn
export function isEn (val) {
  return /^([A-Za-z]{2,20})$/.test(val)
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
  console.log(val, typeof val, /^\d+(\.\d{1,2})?$/.test(val), /^\d+(\.\d{1,2})?$/.test(Number(val)))
  if (val <= 0) {
    return false
  }
  return /^\d+(\.\d{1,2})?$/.test(Number(val))
}

// 判断身份证号码是否正确
export function isIdCard (val) {
  if (typeof val !== 'string' && typeof val !== 'number') {
    return false
  }
  if (typeof val === 'number') {
    val = '' + val
  }

  let regexCheck = /^\d{15}$/.test(val) ||
    /^\d{18}$/.test(val) ||
    /^\d{17}[xX]$/.test(val)
  if (!regexCheck) {
    return false
  }

  if (val.length === 15) {
    // 6位地区编码，2位年，2位月，2位日，3位序号。
    // let year = val.substr(6, 2)
    let month = parseInt(val.substr(8, 2))
    let day = parseInt(val.substr(10, 2))
    if (month < 1 || month > 12) {
      return false
    }
    if (day < 1 || day > 31) {
      return false
    }
    return true
  } else if (val.length === 18) {
    // 6位地区编码，4位年，2位月，2位日，3位序号，1位校验号。
    // 年
    let year = parseInt(val.substr(6, 4))
    if (year < 1900 || year > new Date().getFullYear()) {
      return false
    }

    // 月
    let month = parseInt(val.substr(10, 2))
    if (month < 1 || month > 12) {
      return false
    }

    // 日
    let day = parseInt(val.substr(12, 2))
    if (day < 1 || day > 31) {
      return false
    }

    const ratio = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const mark = ['1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2']
    let calculate = 0
    for (var i = 0; i < val.length - 1; i++) {
      calculate += parseInt(val[i]) * ratio[i]
    }
    let mod = calculate % 11
    return val[val.length - 1].toLowerCase() === mark[mod]
  }

  return false
}

export function _getLength (val) { // 是否考虑把非 string 转换成 string ? 如数字。。。
  let length = 0
  val = String(val)
  if (val && val.length) {
    length = val.length
  }
  return length
}
