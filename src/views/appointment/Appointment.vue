<template>
    <div :class="$style.appointmentDetail">
        <div
            v-if="A"
            :class="$style.top"
        >
            <img :src="A.mediaDetailModelList[0] ? A.mediaDetailModelList[0].mediaUrl : 'https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/1.9.4/ping-xuan.jpg'" alt="">
            <div :class="$style.topContent">
                <a v-if="servicePhoneModels.length === 1" :class="$style.callService" :href="`tel:${servicePhoneModels[0].contactWay}`">
                    <pl-svg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/olds/call.png" />
                </a>
                <a v-else :class="$style.callService" @click="showContact = true">
                    <pl-svg type="img" name="https://mallcdn.youpenglai.com/static/mall/icons/olds/call.png" />
                </a>
                <div :class="$style.mallName">
                    <img :class="$style.img" :src="mallLogo">
                    <div :class="$style.name" v-text="mallName" />
                </div>
                <div :class="$style.bottom">
                    <p
                        :class="{
                            [$style.desc]: true,
                            [$style.collapse]: !seeMoreDesc
                        }"
                        @click="seeMoreDesc = !seeMoreDesc"
                    >
                        {{ mallDesc }}
                    </p>
                    <div :class="$style.address">
                        <pl-svg name="icon-address4" width="34" height="34" />
                        <span
                            :class="{
                                [$style.addressContent]: true,
                                [$style.collapse]: !seeMoreAddress
                            }"
                            v-text="address"
                            @click="seeMoreAddress = !seeMoreAddress"
                        />
                        <button :class="$style.copyAddress" @click="copy">复制</button>
                    </div>
                </div>
            </div>
        </div>
        <div
            :class="{
                [$style.module]: true,
                [$style.a]: true
            }"
            v-if="B"
        >
            <div :id="typeMap[B.type]" :class="$style.moduleTitle" v-if="B">
                <pl-svg :class="$style.moduleIcon" name="icon-school_show" height="36" />
                <span :class="$style.title" v-text="B.titleName" />
                <pl-svg @click="$router.push({ name: 'SchoolShow' })" :class="$style.enter" name="icon-enter" height="30" />
            </div>
            <ul :class="$style.contentList">
                <li
                    v-for="(item, i) of B.mediaDetailModelList.slice(0, 4)"
                    :key="i"
                    v-imger:schollShow="item.mediaUrl"
                    :style="{ backgroundImage: `url(${item.mediaUrl}?x-oss-process=style/thum-small)` }"
                />
            </ul>
        </div>

        <div
            :class="{
                [$style.module]: true,
                [$style.b]: true
            }"
            v-if="C"
        >
            <div :id="typeMap[C.type]" :class="$style.moduleTitle">
                <pl-svg :class="$style.moduleIcon" name="icon-five_pointed" height="36" />
                <span :class="$style.title" v-text="C.titleName" />
                <pl-svg @click="$router.push({ name: 'StudentShow' })" :class="$style.enter" name="icon-enter" height="30" />
            </div>
            <ul :class="$style.contentList">
                <li
                    v-for="(item, i) of C.mediaDetailModelList.slice(0, 4)"
                    :key="i"
                    v-imger:studentShow="item.mediaUrl"
                    :style="{ backgroundImage: `url(${item.mediaUrl}?x-oss-process=style/thum-small)` }"
                />
            </ul>
        </div>

        <div
            :class="{
                [$style.module]: true,
                [$style.c]: true
            }"
            v-if="D && D.mediaDetailModelList.length"
        >
            <div :id="typeMap[D.type]" :class="$style.moduleTitle">
                <pl-svg :class="$style.moduleIcon" name="icon-video" height="36" />
                <span :class="$style.title" v-text="D.titleName" />
            </div>
            <pl-video :url="D.mediaDetailModelList[0].mediaUrl" />
        </div>

        <div
            :class="{
                [$style.module]: true,
                [$style.d]: true
            }"
            v-if="E"
        >
            <div :id="typeMap[E.type]" :class="$style.moduleTitle">
                <pl-svg :class="$style.moduleIcon" name="icon-school_intro" height="36" />
                <span :class="$style.title" v-text="E.titleName" />
            </div>
            <div
                :class="$style.zizhiContent + ' ql-container ql-editor'"
                v-html="E.detailContent"
                :style="{ 'max-height': maxHeight }"
                ref="richText"
            />
            <p v-if="richTextMaxHeight > 200" :class="{ [$style.zizhiSeeMore]: true, [$style.showMore]: isShowMore }" @click="seeMore">
                <pl-svg name="icon-right" fill="#ccc" width="28" />
                <span>{{ isShowMore ? '收起' : '查看更多' }}</span>
            </p>
        </div>

        <div
            :class="{
                [$style.module]: true,
                [$style.e]: true
            }"
            v-if="F"
        >
            <div :id="typeMap[F.type]" :class="$style.moduleTitle">
                <pl-svg :class="$style.moduleIcon" name="icon-aptitude" height="36" />
                <span :class="$style.title" v-text="F.titleName" />
            </div>
            <ul :class="$style.contentList">
                <li
                    v-for="(item, i) of F.mediaDetailModelList"
                    :key="i"
                >
                    <img v-imger:zizhi="item.mediaUrl" :src="item.mediaUrl + '?x-oss-process=style/thum-small'" alt="">
                    <p v-if="item.mediaTitle" v-text="item.mediaTitle" />
                </li>
                <li />
            </ul>
        </div>
        <Contact :show.sync="showContact" />
    </div>
</template>

<script>
import PlVideo from '../../components/common/Video.vue'
import Contact from '../../components/common/Contact.vue'
import { getData } from '../../apis/appointment'
import { mapGetters } from 'vuex'
export default {
    name: 'AppointmentDetailVue',
    components: {
        PlVideo,
        Contact
    },
    data () {
        return {
            seeMoreDesc: false,
            seeMoreAddress: false,
            showContact: false,
            data: {},
            maxHeight: 'max-content',
            richTextMaxHeight: 0,
            isShowMore: false,
            typeMap: {
                0: 'a',
                1: 'b',
                2: 'c',
                3: 'd',
                4: 'e',
                5: 'f'
            }
        }
    },
    async activated () {
        try {
            const showStatus = this.$route.query.showStatus || ''
            const { result } = await getData(showStatus)
            sessionStorage.setItem('PIN_XUAN', JSON.stringify(result.mallBrandingRequestModels))
            this.data = result
            await this.$nextTick()
            if (this.$refs.richText) {
                const imgs = this.$refs.richText.querySelectorAll('img')
                for (const img of imgs) {
                    img.style.width = '100%'
                    if (!img.complete) {
                        await this.onImgLoaded(img)
                    }
                }
                this.richTextMaxHeight = this.$refs.richText.offsetHeight
                this.maxHeight = `${ 200 / 7.5 }vw`
            }
        } catch (e) {
            throw e
        }
        let { hash } = this.$route
        if (hash) {
            hash = hash.replace('#', '')
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = 'smooth'
                const a = document.getElementById(this.typeMap[hash])
                window.scrollTo(0, a.offsetTop)
            }, 300)
        }
    },
    deactivated () {
        document.documentElement.style.scrollBehavior = ''
    },
    computed: {
        ...mapGetters(['servicePhoneModels']),
        mallName () {
            return this.data.mallName
        },
        mallDesc () {
            return this.data.mallDesc
        },
        mallLogo () {
            return this.data.mallLogo
        },
        mallBrandingRequestModels () {
            return this.data.mallBrandingRequestModels || []
        },
        address () {
            return this.data.address || ''
        },
        supportPhone () {
            return this.data.supportPhone || ''
        },
        A () {
            return this.mallBrandingRequestModels.find(item => item.type === 0) || null
        },
        B () {
            return this.mallBrandingRequestModels.find(item => item.type === 1 && item.titleName && item.mediaDetailModelList.length) || null
        },
        C () {
            return this.mallBrandingRequestModels.find(item => item.type === 2 && item.titleName && item.mediaDetailModelList.length) || null
        },
        D () {
            return this.mallBrandingRequestModels.find(item => item.type === 3 && item.titleName && item.mediaDetailModelList.length) || null
        },
        E () {
            return this.mallBrandingRequestModels.find(item => item.type === 4 && item.titleName && item.detailContent) || null
        },
        F () {
            return this.mallBrandingRequestModels.find(item => item.type === 5 && item.titleName && item.mediaDetailModelList.length) || null
        }
    },
    methods: {
        seeMore () {
            if (this.isShowMore) {
                this.maxHeight = `${ 200 / 7.5 }vw`
                this.isShowMore = false
            } else {
                this.maxHeight = `${ this.richTextMaxHeight / 7.5 }vw`
                this.isShowMore = true
            }
        },
        copy () {
            this.$copyText(this.address).then(e => {
                this.$success('已复制')
            }, e => {
                alert('Can not copy')
            })
        },
        onImgLoaded (img) {
            return new Promise((resolve, reject) => {
                img.onload = function () {
                    resolve(img)
                }
                img.onerror = function () {
                    reject(new Error('图片加载错误'))
                }
            })
        }
    }
}
</script>

<style module lang="scss">
  .appointment-detail {
    .top {
      margin-bottom: 20px;
      background-color: #fff;
      overflow: hidden;
      > img {
        position: absolute;
        width: 100%;
        height: 578px;
        object-fit: cover;
      }
    }
    .top-content {
      position: relative;
      width: 702px;
      height: auto;
      margin: 367px auto 40px;
      padding: 24px 30px;
      box-sizing: border-box;
      background-color: #f2b036;
      border-radius: 20px;
      box-shadow: 0 40px 40px -40px rgb(242, 176, 54);
      > .call-service {
        position: absolute;
        top: -74px;
        right: 26px;
        > img {
          width: 128px;
        }
      }
      > .mall-name {
        display: flex;
        align-items: center;
        height: max-content;
        background-color: transparent;
        > .img {
          width: 88px;
          height: 88px;
          margin-right: 18px;
          object-fit: cover;
          border-radius: 20px;
          background-color: #fff;
        }
        > .name {
          flex: 1;
          padding-right: 150px;
          font-size: 40px;
          font-weight: bold;
        }
      }
      > .bottom {
        margin-top: 20px;
        padding-left: 16px;
        border-left: 1px solid #000;
        > .desc {
          position: relative;
          margin-bottom: 20px;
          font-size: 24px;
          &.collapse {
            @include elps-wrap(2);
          }
        }
        > .address {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24px;
          color: #9D6C12;
          > svg {
            width: 34px;
            margin-right: 8px;
          }
          > .address-content {
            width: 452px;
            font-size: 24px;
            &.collapse {
              @include elps();
            }
          }
          > .copy-address {
            width: 100px;
            height: 44px;
            font-size: 24px;
            color: #9D6C12;
            border-radius: 22px;
            background-color: #f9c668;
          }
        }
      }
    }
  }
  .module {
    margin-top: 20px;
    padding: 24px;
    background-color: #fff;
    &.a > .content-list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
      overflow: auto;
      > li {
        width: 320px;
        height: 230px;
        min-width: 320px;
        margin-right: 20px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        border-radius: 20px;
      }
    }
    &.b > .content-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: -22px;
      overflow: auto;
      > li {
        width: 340px;
        height: 340px;
        margin-bottom: 22px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        border-radius: 20px;
      }
    }
    &.e {
      padding: 0;
      overflow: auto;
      > .module-title {
        padding: 24px;
        margin-bottom: 8px;
      }
      > .content-list {
        position: relative;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        white-space: nowrap;
        padding-bottom: 64px;
        overflow: auto;
        border: 1px solid transparent;
        > li {
          display: inline-block;
          width: 282px;
          height: max-content;
          box-sizing: border-box;
          margin-top: 10px;
          margin-left: 24px;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, .1);
          &:nth-last-of-type(1) {
            min-width: 1px;
            height: 1px;
          }
          > img {
            width: 226px;
            height: 282px;
            margin: 24px;
            object-fit: cover;
          }
          > p {
            padding: 16px;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            border-top: 1px solid #e7e7e7;
            word-break: break-all;
            white-space: pre-wrap;
          }
        }
      }
    }
  }
  .zizhi-content {
    word-break: keep-all;
    overflow: hidden;
    transition: max-height .6s linear;
  }
  .zizhi-see-more {
    margin-top: 32px;
    font-size: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    &.show-more {
      > svg {
        transform: rotate(-90deg);
      }
    }
    > svg {
      width: 25px;
      margin-left: 10px;
      transform: rotate(90deg);
      vertical-align: -4px;
      transition: transform .3s linear;
    }
  }
  .module-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    > .module-icon {
      width: 36px;
      margin-right: 12px;
    }
    > .enter {
      width: 48px;
    }
    > .title {
      flex: 1;
      font-size: 36px;
      font-weight: bold;
    }
  }
</style>
