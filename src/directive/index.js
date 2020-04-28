const img = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/base/img_error.png'

let IMGERLIST = {}
let id = 0
export default {
    imgError: {
        inserted (el, { value }) {
            // if (el.src.indexOf('http://') > -1) {
            //     el.src = el.src.replace('http://', 'https://')
            //     return
            // }
            if (el.tagName === 'IMG') {
                el.onerror = function () {
                    if (value === 'classifyIcon') {
                        // 分类默认图片
                        el.src = 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/category-default.png'
                    } else {
                        el.src = img
                    }
                }
            }
        }
    },

    /**
   * v-imger:group="url"
   */
    imger: {
        inserted (el, { value, arg }) {
            if (!arg) id++
            const currentArg = arg || `imgerList_${ id }`

            // 如果绑定的元素不是img元素，那么就获取改元素下的所有图片元素
            // 以这些图片的src属性组成列表

            value = value || el.src || ''
            if (IMGERLIST[currentArg]) {
                IMGERLIST[currentArg].push(value)
            } else {
                IMGERLIST[currentArg] = [value]
            }
            el.addEventListener('click', e => {
                e.stopPropagation()
                window.wx.previewImage({
                    // 当前显示图片的http链接
                    current: value,
                    // 需要预览的图片http链接列表
                    urls: [...IMGERLIST[currentArg]]
                })
            })
        },
        unbind () {
            IMGERLIST = {}
        }
    }
}
