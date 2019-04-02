import EXIF from 'exif-js'
const cvs = document.createElement('canvas')
const ctx = cvs.getContext('2d')
let Orientation = 0
export default {
  /*
  * canvas 包含图片信息的canvas对象 * quality 图片质量 0~1之间
  * */
  canvasResizetoFile (canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        function (blob) {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('压缩失败'))
          }
        }, 'image/jpeg', quality
      )
    })
  },
  /*
  * 通过url生成图片对象
  * */
  urlToImage (url) {
    return new Promise(resolve => {
      var image = new Image()
      image.src = url
      image.onload = function () {
        EXIF.getData(image, () => {
          /*
          * 获取手机相机拍摄的原图的方向，压缩过的图片没有此数据
          * 如果包含以下参数，要正常显示，必须安装参数含义进行变形
          * 1 0°
          * 2 水平翻转
          * 3 180°
          * 4 垂直翻转
          * 5 顺时针旋转90° + 水平翻转
          * 6 顺时针90°
          * 7 顺时针90° + 垂直翻转
          * 8 逆时针90°
          * */
          Orientation = EXIF.getTag(image, 'Orientation') || 0
          resolve(image)
        })
      }
    })
  },
  /*
  * 将图片放置在canvas上面
  * rate: 尺寸比例
  * */
  imageToCanvas (image, rate) {
    return new Promise((resolve, reject) => {
      let w = image.width * rate
      let h = image.height * rate
      cvs.width = w
      cvs.height = h
      if (Orientation === 6) {
        // 如果图像需要旋转
        // 先设置画布的宽为图片的高，画布的高为图片的宽，然后设置画笔的原点为右上角
        cvs.width = h
        cvs.height = w
        ctx.translate(h, 0)
        // 旋转图片90°
        ctx.rotate((90 * Math.PI) / 180)
        // 放置图片
        ctx.drawImage(image, 0, 0, h, w)
        resolve(cvs)
      }
      ctx.drawImage(image, 0, 0, w, h)
      resolve(cvs)
    })
  },
  // url 图片路径，size: 想要的图片大小，单位M
  compress (blob, size) {
    return new Promise(async resolve => {
      let rate = 0.9
      let quality = 0.6
      size = size * 1024 * 1024
      let image = await this.urlToImage(this.createObjectUrl(blob))
      let canvas = await this.imageToCanvas(image, rate)
      blob = await this.canvasResizetoFile(canvas, quality)
      if (blob.size < size) {
        resolve(blob)
      }
      // 循环压缩，直到体积小于size
      while (blob.size > size) {
        image = await this.urlToImage(this.createObjectUrl(blob))
        canvas = await this.imageToCanvas(image, rate)
        blob = await this.canvasResizetoFile(canvas, quality)
      }
      resolve(blob)
    })
  },
  createObjectUrl (blob) {
    let url
    if (window.createObjectURL) {
      // basic
      url = window.createObjectURL(blob)
    } else if (window.URL) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(blob)
    } else if (window.webkitURL) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(blob)
    }
    return url
  }
}
