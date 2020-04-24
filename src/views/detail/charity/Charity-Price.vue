<template>
    <div :class="$style.tuan">
        <div v-if="detail.preActivity === 2">
            <div :class="$style.price">活动价： <span v-text="detail.activityProductModel.price" /></div>
            <div :class="$style.original">原价：<del v-text="maxOriginalPrice" /></div>
        </div>
        <div>
            <!-- 用户头像 -->
            <div :class="$style.join">
                <ul :class="$style.avatarList">
                    <li
                        :class="$style.avatar"
                        v-for="(item, k) in charityMembers.slice(-4)"
                        :key="k"
                    >
                        <img :src="item.headImgUrl">
                    </li>
                </ul>
                <div v-if="charityMembers.length > 0">{{ charityMembers.length }}人和你一起参与</div>
                <div :class="$style.burse">购买可捐赠 <PlSvg name="icon-zongzi-03e21" width="30" style="margin: 0 10px" /> {{ detail.activityProductModel.donationAmount }}元公益金</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CharityPrice',
    props: {
        detail: {
            type: Object,
            default () {
                return {}
            }
        },
        charityMembers: {
            type: Array,
            default () {
                return []
            }
        }
    },
    computed: {
        skuList () {
            return this.detail.productSkuModels || []
        },
        priceList () {
            return this.skuList.map(item => item.price) || []
        },
        originalPriceList () {
            return this.skuList.map(item => item.originalPrice) || []
        },
        maxPrice () {
            return Math.max(...this.priceList)
        },
        minPrice () {
            return Math.min(...this.priceList)
        },
        maxOriginalPrice () {
            return Math.max(...this.originalPriceList)
        },
        salesVolume () {
            return this.detail.salesVolume
        }
    },
    methods: {

        // 替换价格整数位第2位为 ‘?’
        hidePrice (price) {
            const priceArr = String(price).split('.')
            let integer = priceArr[0]
            const decimals = priceArr[1] ? `.${ priceArr[1] }` : ''
            if (integer.length <= 1) {
                return `${ integer }${ decimals }`
            }
            integer = integer.split('')
            integer.splice(1, 1, '?')
            return `${ integer.join('') }${ decimals }`
        }
    }
}
</script>

<style lang="scss" module>
  .tuan{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 14px;
    .price {
      line-height: 48px;
      margin-bottom: 4px;
      color: #FE7700;
      font-size: 30px;
      > span {
        font-size: 48px;
        &:before {
          content: '¥';
          font-size: 24px;
        }
      }
    }
    .original{
      display: flex;
      font-size: 24px;
      color: #999999;
      margin-right: 32px;
      .text{
        margin-right: 10px;
      }
      del {
        &:before {
          content: '¥';
        }
      }
    }
    .join{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      max-width: 360px;
      font-size: 26px;
      color: #999999;
      > .avatarList {
        display: flex;
        align-items: center;
        margin-right: 30px;
        > .avatar {
          width: 30px;
          height: 48px;
          > img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
          }
        }
      }
      > .burse {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        color: #FE7700;
        text-align: right;
        font-size:26px;
        margin-top: 8px;
      }
    }
  }
</style>
