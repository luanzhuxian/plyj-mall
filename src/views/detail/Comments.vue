<template>
    <div :class="$style.comment + ' radius-20'" ref="comment">
        <div :class="$style.header" v-if="total > 0">
            <pl-button size="small" :type="form.status ? 'default' : 'primary'" round plain @click="search('')">
                全部
            </pl-button>
            <pl-button v-if="assessmentPicCount > 0" size="small" :type="form.status ? 'primary' : 'default'" round plain @click="search(1)">
                有图 <i>({{ assessmentPicCount }})</i>
            </pl-button>
        </div>
        <p :class="$style.noComments" v-if="!list.length && productId">
            <span>暂无评论</span>
        </p>
        <template v-else>
            <div :class="$style.commentItem" v-for="(item, i) of list" :id="'item' + i" :key="item.id" @click="goDetail(item)">
                <!-- 头像 -->
                <img v-imgError v-img-error :src="item.headUrl || ''" alt="">
                <div :class="$style.content">
                    <!--昵称 + 评分-->
                    <div :class="$style.contentTop">
                        <div :class="$style.name" v-text="item.nickName" />
                        <div :class="$style.grade">
                            评分 <Grade size="mini" :grade="item.goodsScore" />
                        </div>
                    </div>

                    <!-- 时间  规格 -->
                    <div :class="$style.itemSku">
                        <span v-text="item.createTimeText" />
                        <span>
                            <i v-text="item.attribute" />
                            “<i v-text="item.skuCode1Name" />”
                            <template v-if="item.skuCode2Name">
                                ，<i v-text="item.subAttribute" />
                                “<i v-text="item.skuCode2Name" />”
                            </template>
                        </span>
                        <!--<span>颜色“白色”，版本“55寸 4核处理器”</span>-->
                    </div>
                    <!-- 内容 -->
                    <div :class="$style.commentContent" v-text="item.content" />
                    <!-- 图片 -->
                    <div :class="$style.imgs + ' radius-20'" v-if="item.url.length > 0">
                        <img v-imgError
                             v-for="(img, j) of item.url"
                             :key="j"
                             v-img-error
                             :src="img + '?x-oss-process=style/thum'"
                             @click.stop="preview(img)"
                             alt=""
                        >
                    </div>
                    <!-- 商家回复: 目前只支持回复一次 -->
                    <div :class="$style.reply" v-if="item.child.length">
                        <span v-text="item.child[0].content" />
                    </div>
                </div>
            </div>
        </template>
        <!--查看大图-->
        <image-swiper @slideChange="slideChange" :show.sync="showImageSwipe" :index="previewIndex" :items="imgs" :total="imgs.length">
            <template v-slot:footer>
                <div :class="$style.swiperFooter">
                    <p :class="$style.swiperFooterUsername" v-text="currentContent.nickName" />
                    <p :class="$style.swiperFooterSku" v-text="currentContent.sku" />
                    <p :class="$style.swiperFooterContent" v-text="currentContent.content" />
                </div>
            </template>
        </image-swiper>
    </div>
</template>

<script>
import Grade from '../../components/common/Grade.vue'
import { getComments } from '../../apis/comment'
import { resetForm } from '../../assets/js/util'
import ImageSwiper from '../../components/detail/Image-Swiper.vue'
export default {
    name: 'Comments',
    components: {
        Grade,
        ImageSwiper
    },
    data () {
        return {
            // 是否显示大图
            showImageSwipe: false,
            loading: false,
            form: {
                current: 1,
                size: 5,
                // ''-全部 1-有图
                status: ''
            },
            list: [],
            total: 0,
            imgs: [],
            // 保存图片地址与评论信息关系
            imgsMap: {},
            currentContent: {},
            previewIndex: 0
        }
    },
    props: {
        productId: {
            type: String,
            default: null
        },
        show: Boolean
    },
    computed: {
        assessmentPicCount () {
            return this.list[0] ? this.list[0].assessmentPicCount : 0
        }
    },
    async created () {
        try {
            await this.getList(true)
        } catch (e) {
            throw e
        }
    },
    async activated () {
        try {
            await this.getList(true)
        } catch (e) {
            throw e
        }
    },
    mounted () {
        window.addEventListener('scroll', this.scroll)
    },
    deactivated () {
        this.reset()
        this.list = []
        this.total = 0
        this.imgs = []
        this.imgsMap = {}
        this.currentContent = {}
        this.previewIndex = 0
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.scroll)
    },
    methods: {
        async getList (isClearAll) {
            try {
                this.loading = true
                const { result } = await getComments(this.productId, this.form)
                if (isClearAll) {
                    // 是否清除当前页面已有数据
                    this.list = []
                }
                for (const item of result.records) {
                    // 后台存储的打分是10分制, 前台为5分制
                    item.goodsScore /= 2
                    this.list.push(item)
                }
                this.total = result.total
                this.size = result.size
                this.getImageList(result.records)
            } catch (e) {
                throw e
            } finally {
                this.loading = false
            }
        },
        // 仅查看评论 status ''-查看全部评论 1-查看有图评论
        async search (status) {
            try {
                // 已经是当前状态 / 正在加载中 不允许继续请求
                if (this.form.status === status || this.loading) return
                this.list = []
                this.imgs = []
                this.imgsMap = {}
                this.reset()
                this.form.status = status
                await this.getList(true)
            } catch (e) {
                throw e
            }
        },
        // 批量加载图片
        batchLoadImg (url) {
            return new Promise((resolve, reject) => {
                const img = new Image()
                img.src = url
                img.onload = () => {
                    this.imgs.push({
                        src: `${ img.src }?x-oss-process=style/thum-1200`,
                        oSrc: img.src,
                        w: img.naturalWidth,
                        h: img.naturalHeight
                    })
                    resolve()
                }
                img.onerror = e => {
                    reject(e)
                }
            })
        },
        // 重置数据
        reset () {
            resetForm(this.form, {
                current: 1,
                size: 5,
                status: ''
            })
        },
        // 查看评论详情
        goDetail (item) {
            sessionStorage.setItem('comment', JSON.stringify(item))
            this.$router.push({ name: 'CommentDetail' })
        },
        // 查看大图
        preview (url) {
            this.previewIndex = this.imgs.findIndex(item => item.oSrc === url)
            this.showImageSwipe = true
        },
        // 页面滑动
        async scroll (e) {
            try {
                if (!this.show) return
                if (this.loading) return
                if (this.list.length === this.total) return
                if (this.assessmentPicCount > 0 && this.list.length === this.assessmentPicCount) return
                const lastId = `item${ this.list.length - 1 }`
                if (document.getElementById(lastId).getBoundingClientRect().top - window.innerHeight < 0) {
                    this.form.current++
                    await this.getList()
                }
            } catch (e) {
                throw e
            }
        },
        // 支持大图滑动
        async slideChange (index, total) {
            try {
                const imgName = this.getImgName(this.imgs[index].oSrc)
                this.currentContent = this.imgsMap[imgName]

                // 进行到倒数第二张时,请求更多，只有在查看有图模式下可行
                if (total - index - 1 === 1 && this.form.status) {
                    this.form.current++
                    await this.getList()
                }
            } catch (e) {
                throw e
            }
        },
        // 提取图片相关信息
        async getImageList (comments) {
            for (const item of comments) {
                if (item.url.length === 0) continue
                for (const img of item.url) {
                    await this.batchLoadImg(img)
                    const imgName = this.getImgName(img)
                    this.imgsMap[imgName] = {
                        nickName: item.nickName,
                        content: item.content,
                        sku: `${ item.attribute }“${ item.skuCode1Name }”${ item.subAttribute ? `，${ item.subAttribute }“${ item.skuCode2Name }”` : '' }`
                    }
                }
            }
        },
        // 获取图片关键字
        getImgName (url) {
            const path = url.substring(url.indexOf('img/'))
            return path.split('/')[1].split('.')[0].replace('-', '')
        }
    }
}
</script>

<style module lang="scss">
  .comment {
    padding: 30px;
    background-color: #fff;
    font-size: 24px;
    overflow: scroll;
  }
  .header {
    display: flex;
    align-items: center;
    padding-bottom: 30px;
    border-bottom: 1px solid #f0f0f0;
    > button {
      margin-right: 20px;
    }
  }
  .comment-item {
    position: relative;
    display: flex;
    padding: 30px 0;
    border-bottom: 1px solid #e7e7e7;
    &:nth-last-of-type(1) {
      border: none;
    }
    > img {
      width: 80px;
      height: 80px;
      margin-right: 24px;
      object-fit: cover;
      border-radius: 50%;
    }
    &:nth-last-of-type(1) {
      margin-bottom: 0;
      &:after {
        display: none;
      }
    }
  }
  .content {
    flex: 1;
    .comment-content {
      margin-top: 22px;
      font-size: 28px;
      word-break: break-all;
      @include elps-wrap(3);
    }
    .imgs {
      display: flex;
      margin-top: 10px;
      overflow: hidden;
      flex-wrap: wrap;
      img {
        width: 162px;
        height: 162px;
        border-radius: 0;
        object-fit: cover;
        background-color: #ccc;
        margin-top: 10px;
        margin-left: 10px;
        &:nth-last-of-type(1), &:nth-of-type(3n) {
          border-bottom-right-radius: 20px;
          border-top-right-radius: 20px;
        }
        &:nth-of-type(3n-2) {
          margin-left: 0;
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
        }
      }
    }
  }
  .contentTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name {
      font-size: 28px;
      color: #446889;
    }
    .grade {
      margin-top: 8px;
      font-size: 24px;
      > div {
        vertical-align: -4px;
      }
    }
  }
  .itemSku {
    display: flex;
    margin-top: 8px;
    font-size: 24px;
    color: #999;
    > span {
      margin-right: 12px;
      &:nth-of-type(2) {
        width: 400px;
        margin-right: 0;
        @include elps();
      }
    }
  }
  .noComments {
    display: flex;
    margin: 32px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 24px;
    svg {
      margin-bottom: 20px;
      width: 200px;
    }
  }
  .see-more {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 30px;
    font-size: 24px;
    color: #000;
    svg {
      width: 18px;
      fill: #bbb;
    }
  }
  .reply {
    margin-top: 20px;
    margin-right: 30px;
    padding: 20px 24px;
    background-color: #f8f8f8;
    border-radius: 16px;
    font-size: 24px;
    color: #999999;
    span {
      display: inline-block;
      @include elps-wrap(3);
      word-break: break-all;
      &:before {
        content: '商家回复：';
      }
    }
  }
  .swiper-footer {
    padding: 30px 24px;
    background: linear-gradient(360deg, rgba(0, 0, 0, .8), rgba(0, 0, 0, 0));
  }
  .swiper-footer-username {
    font-size: 28px;
    line-height: 40px;
    color: #fff;
  }
  .swiper-footer-sku {
    width: calc(100vw - 48px);
    font-size: 26px;
    line-height: 36px;
    color: #ccc;
    @include elps();
  }
  .swiper-footer-content {
    font-size: 26px;
    color: #fff;
    line-height: 36px;
    @include elps-wrap(3);
  }
</style>
