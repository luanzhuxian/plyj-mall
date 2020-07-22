/* eslint-disable */
import Compressor from 'compressorjs'
import { getSTS } from '../../apis/base-api'
import store from '../../store'
import moment from 'moment'
const { VUE_APP_MODEL } = process.env
const ENV = VUE_APP_MODEL === 'production' ? 'pro' : 'dev'
const OSS = require('ali-oss')
const REGION = 'oss-accelerate'
const BUCKET = 'penglai-weimall'
const DOMAIN = 'https://mallcdn.youpenglai.com'
const PATH = `img/mall/${ ENV }`
Compressor.setDefaults({
    // 检查方向
    checkOrientation: true,
    // 表示压缩后的图像尺寸大于原始图像尺寸时，是否输出原始图像而不是压缩后的图像，但以下情况除外:
    // 设置了mimeType选项，其值与图像的mime类型不同。
    // 设置了width选项，其值大于图像的自然宽度。
    // 设置了height选项，其值大于图像的自然高度。
    // 设置了minWidth选项，其值大于图像的自然宽度。
    // 设置了minHeight选项，其值大于图像的自然高度。
    strict: true,

    // minWidth 输出图像的最小宽度。该值应该大于0，并且不应该大于maxWidth。
    // 输出图像的最大宽度。这个值应该大于0。
    maxWidth: 1270,
    // width: 1920,
    // minHeight 输出图像的最小高度。该值应该大于0，并且不应该大于maxHeight
    // maxHeight 输出图像的最大高度。这个值应该大于0
    // height 输出图像的高度。如果没有指定，则使用原始图像的自然高度，或者如果设置了宽度选项，则使用自然长宽比自动计算高度。
    quality: 0.75,
    mimeType: 'image/jpeg',
    // 超过此值的PNG文件将转换为jpeg。要禁用此功能，只需将值设置为无穷大
    convertSize: 5000000
    // beforeDraw(context, canvas)
    // drew(context, canvas)
})

/*
* 实例方法：abort 终止
* */
export const compress = function (file, size, fileType) {
    size = size * 1024 * 1024
    return new Promise(async (resolve, reject) => {
        try {
            if (size <= file.size) {
                file = await compressImage(file)
                if (fileType === 'base64') {
                    const base64 = await blobToBase64(file)
                    resolve(base64)
                } else {
                    resolve(file)
                }
            } else {
                if (fileType === 'base64') {
                    const base64 = await blobToBase64(file)
                    resolve(base64)
                } else {
                    resolve(file)
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}
const getClient = async function () {
    const sts = JSON.parse(localStorage.getItem('sts')) || {}
    let credentials = null
    // 如果离过期时间不到10分钟，就重新获取sts
    if (!sts.time || sts.time - Date.now() < 600000) {
        // sts过期
        let { result } = await getSTS()
        result = JSON.parse(result)
        credentials = result.credentials
        result.time = moment(result.credentials.expiration).valueOf()
        localStorage.setItem('sts', JSON.stringify(result))
    } else {
        credentials = sts.credentials
    }
    const { securityToken, accessKeySecret, accessKeyId } = credentials
    return new OSS({
        region: REGION,
        accessKeyId,
        accessKeySecret,
        stsToken: securityToken,
        bucket: BUCKET
    })
}
export const upload = async function (file) {
    let ext = null
    try {
        ext = /jpg|png|gif|jpeg|bmp/i.exec(file.type)[0]
    } catch (e) {
        throw new Error('不允许的图片格式')
    }
    // 使用商城id分开存储
    const mallId = store.getters.mallId
    const client = await getClient()
    const key = mallId ? `${ PATH }/${ mallId }/${ randomString() }.${ ext }` : `${ PATH }/${ randomString() }.${ ext }`
    return new Promise((resolve, reject) => {
        client.put(key, file)
            .then(res => {
                res.url = `${ DOMAIN }/${ res.name }`
                resolve(res)
            })
            .catch(e => {
                reject(e)
            })
    })
}
const compressImage = function (file) {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            success (result) {
                resolve(result)
            },
            error (error) {
                reject(error)
            }
        })
    })
}
export function blobToBase64 (blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function () {
            resolve(reader.result.split(',')[1])
        }
        reader.readAsDataURL(blob)
    })
}
// 生成随机字符串
function randomString () {
    return `${ uuid.v1() }-${ Math.random().toString()
        .replace('.', '') }`
}

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
 * 删除图片接口
 * @param key 图片名称 {Array}
 * @returns {Promise<void>}
 */
export async function deleteImage (key) {
    const client = await getClient()
    // 单独删除咱不可用，所以需传入key的数组
    // if (typeof key === 'string') {
    //   try {
    //     await client.delete(key)
    //   } catch (e) {
    //     throw e
    //   }
    // }
    // 批量删除
    if (Array.isArray(key)) {
        try {
            await client.deleteMulti(key)
            console.warn(`image is deleted !`)
        } catch (e) {
            throw e
        }
    } else {
        throw new Error('key 必须是数组！')
    }
}
