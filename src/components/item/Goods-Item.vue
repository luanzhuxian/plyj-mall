<template>
    <div
        :class="$style.goods"
        @click="handleClick"
    >
        <slot />
        <div :class="$style.top">
            <img v-imgError
                 :class="$style.img"
                 v-lazy="img"
                 :key="img"
            >
            <count-down
                v-if="data.shoppingStatus === 1 && activityProduct === 1"
                :class="$style.countDown"
                :data="data"
                :fields="{ start: 'serverTime', end: 'shoppingTimeLong' }"
            />
        </div>
        <div :class="$style.bottom">
            <div
                v-text="title"
                :class="$style.name"
            />
            <div
                v-if="tags.length > 0"
                :class="$style.tag"
            >
                <span
                    v-for="(tag, index) of tags"
                    :key="index"
                    v-text="tag"
                />
            </div>
            <div
                v-if="desc"
                :class="$style.desc"
                v-text="desc"
            />
            <div :class="$style.price">
                <price
                    size="mini"
                    :price="price"
                    :original-price="originalPrice"
                />
                <span :class="$style.rebate" v-if="rebate">
                    {{ `返润笔 ¥${rebate}` }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import Price from '../product/Price.vue'
import { mapGetters } from 'vuex'
import CountDown from '../product/Count-Down.vue'
export default {
    name: 'GoodsItem',
    components: {
        Price,
        CountDown
    },
    data () {
        return {
        }
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        img: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        tags: {
            type: Array,
            default () {
                return []
            }
        },
        desc: {
            type: String,
            default: ''
        },
        price: {
            type: [String, Number],
            default: ''
        },
        originalPrice: {
            type: [String, Number],
            default: ''
        },
        rebate: {
            type: [String, Number],
            default: 0
        },
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        activityProduct: {
            type: Number,
            default: 1
        },
        productType: {
            type: String,
            default: ''
        }
    },
    computed: {
        ...mapGetters(['agentUser', 'userId'])
    },
    methods: {
        async handleClick () {
            if (this.productType === 'KNOWLEDGE_COURSE') {
                this.$router.push({ name: 'Curriculum', params: { productId: this.id } })
            } else {
                this.$router.push({ name: 'Product', params: { productId: this.id } })
            }
        }
    }
}
</script>

<style module lang="scss">
.goods {
  position: relative;
  width: 266px;
  margin-bottom: 18px;
  box-shadow: 0 4px 12px 0 rgba(0,0,0,0.05);
  border-radius: 10px;
  .img {
    object-fit: cover;
    border-radius: $--radius2 $--radius2 0 0;
    width: 266px;
    height: 178px;
  }
  .top {
    position: relative;
  }
}
.bottom {
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 4px 12px 18px;
  .name {
    height: 64px;
    line-height: 32px;
    font-weight: bold;
    color: #333;
    font-size: 20px;
    @include elps-wrap(2);
  }
}
.tag {
  margin-top: 7px;
  font-size: 24px;
  color: #999;
  line-height: 32px;
  span:nth-of-type(n+2) {
    &:before {
      position: relative;
      content: '|';
      padding: 0 10px;
    }
  }
}
.desc {
  display: inline-block;
  margin: 4px 0 16px 0;
  color: #999;
  @include elps-wrap(1);
  font-size: 20px;
}
.count {
  color: #999;
  font-size: 20px;
}
.price {
  @include elps();
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.rebate {
  font-size: 18px;
  color: #666666;
  line-height: 22px;
}
  .count-down {
    display: flex;
    width: 100%;
    bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
</style>
