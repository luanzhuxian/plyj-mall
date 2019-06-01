import { isDef, isObj } from './util.js'

const { hasOwnProperty } = Object.prototype

export function deepAssign (to, from) {
  Object.keys(from).forEach(key => {
    const val = from[key]

    if (!isDef(val)) {
      return
    }

    if (!hasOwnProperty.call(to, key) || !isObj(val)) {
      to[key] = val
    } else {
      to[key] = deepAssign(Object(to[key]), from[key])
    }
  })

  return to
}

export function deepClone (obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item))
  }

  if (typeof obj === 'object') {
    return deepAssign({}, obj)
  }

  return obj
}
