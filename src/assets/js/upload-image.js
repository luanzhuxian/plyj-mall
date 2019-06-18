import Compressor from 'compressorjs'
import { getSTS } from '../../apis/base-api'
const OSS = require('ali-oss')
const REGION = 'oss-cn-hangzhou'
const BUCKET = 'penglai-weimall'
const STSLIFETIME = 600000 // STS有效时间，10分钟
Compressor.setDefaults({
  checkOrientation: true, // 检查方向
  // 表示压缩后的图像尺寸大于原始图像尺寸时，是否输出原始图像而不是压缩后的图像，但以下情况除外:
  // 设置了mimeType选项，其值与图像的mime类型不同。
  // 设置了width选项，其值大于图像的自然宽度。
  // 设置了height选项，其值大于图像的自然高度。
  // 设置了minWidth选项，其值大于图像的自然宽度。
  // 设置了minHeight选项，其值大于图像的自然高度。
  strict: true,
  // minWidth 输出图像的最小宽度。该值应该大于0，并且不应该大于maxWidth。
  // maxWidth 输出图像的最大宽度。这个值应该大于0。
  // width: 1920,
  // minHeight 输出图像的最小高度。该值应该大于0，并且不应该大于maxHeight
  // maxHeight 输出图像的最大高度。这个值应该大于0
  // height 输出图像的高度。如果没有指定，则使用原始图像的自然高度，或者如果设置了宽度选项，则使用自然长宽比自动计算高度。
  quality: 0.75,
  mimeType: 'image/jpeg',
  convertSize: 5000000 // 超过此值的PNG文件将转换为jpeg。要禁用此功能，只需将值设置为无穷大
  // beforeDraw(context, canvas)
  // drew(context, canvas)
})
/*
* 实例方法：abort 终止
* */
export function compress (file, size, fileType) {
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
export async function upload (file) {
  let sts = JSON.parse(localStorage.getItem('sts')) || {}
  let ext = null
  let credentials = null
  try {
    ext = /jpg|png|gif|jpeg|bmp/i.exec(file.type) || ''
  } catch (e) {
    throw new Error('不允许的图片格式')
  }
  if (!sts.time || STSLIFETIME < Date.now() - sts.time) {
    // sts过期
    let { result } = await getSTS()
    credentials = result.credentials
    result.time = Date.now()
    localStorage.setItem('sts', JSON.stringify(result))
  } else {
    credentials = sts.credentials
  }
  const { securityToken, accessKeySecret, accessKeyId } = credentials
  const client = new OSS({
    region: REGION,
    accessKeyId,
    accessKeySecret,
    stsToken: securityToken,
    bucket: BUCKET
  })
  const key = `img/${randomString()}.${ext}`
  return client.put(key, file)
}
function compressImage (file) {
  /* eslint-disable */
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
  // 随机串的长度为 10 ~ 100 的随机数
  const len = Number.parseInt(Math.random() * 91 + 10)
  const date = new Date()
  // 48~57 数字， 65~90 大写，  97~122 小写
  const LIB = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
  const parseInt = Number.parseInt
  const random = Math.random
  const randomStr = []
  for (let i = 0; i < len; i++) {
    const index = parseInt(random() * 62)
    randomStr.push(LIB[index])
  }
  let dateString = `
    ${date.getFullYear()}
    ${String(date.getMonth() + 1).padStart(2, '0')}
    ${String(date.getDate()).padStart(2, '0')}
    ${String(date.getHours()).padStart(2, '0')}
    ${String(date.getMinutes()).padStart(2, '0')}
    ${String(date.getSeconds()).padStart(2, '0')}
  `
  dateString = dateString.replace(/\s/g, '')
  return randomStr.join('') + dateString
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
