/**
 * 复制数组到指定的数组中
 * @param source {Array} 源数组
 * @param [array] {Array} 目标数组，非必填
 * @return {Array}
 */
export const copyArray = (source, array) => {
    let index = -1
    const length = source.length

    array || (array = new Array(length))
    while (++index < length) {
        array[index] = source[index]
    }
    return array
}

/**
 * 打乱数组
 * @param array {Array} 要打乱的数组
 * @return {Array}
 */
export const shuffle = array => {
    const length = array == null ? 0 : array.length
    if (!length) {
        return []
    }
    let index = -1
    const lastIndex = length - 1
    const result = copyArray(array)
    while (++index < length) {
        const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
        const value = result[rand]
        result[rand] = result[index]
        result[index] = value
    }
    return result
}
