<template>
    <div
        :class="$style.lesson + ' ' + $style[size] + ' ' + (border ? $style.border : '')"
        @click="handleClick"
    >
        <!-- 课程组件 -->
        <div :class="$style.imgWrapper">
            <img
                v-lazy="img"
                :key="img"
                alt=""
            >
            <div :class="$style.label" v-if="label" v-text="label" />
        </div>
        <div :class="$style.right">
            <div>
                <div
                    :class="$style[size] + ' ' + $style.name"
                    v-text="title"
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
                    :class="$style.desc + ' ' + $style[size]"
                    v-text="desc"
                />
            </div>
            <div
                v-if="count"
                :class="$style.count"
            >
                已售 <i v-text="count" />
            </div>
            <slot />
            <div :class="$style.bottom">
                <span :class="$style.price" v-text="price" />
                <span :class="$style.originalPrice" v-if="originalPrice" v-text="originalPrice" />
            </div>
        </div>
        <count-down v-if="data.shoppingStatus === 1" :data="data" :fields="{ start: 'serverTime', end: 'shoppingTimeLong' }" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CountDown from '../product/Count-Down.vue'

export default {
    name: 'LessonItem',
    components: {
        CountDown
    },
    data () {
        return {
        }
    },
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        size: {
            type: String,
            default: 'small'
        },
        border: Boolean,
        id: {
            type: String,
            default: ''
        },
        img: {
            type: String,
            default: ''
        },
        label: {
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
        count: {
            type: [String, Number],
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
        type: {
            type: String,
            default: 'PRODUCT'
        }
    },
    computed: {
        ...mapGetters(['userId', 'agentUser'])
    },
    methods: {
        async handleClick () {
            const { id, type } = this
            this.$router.push({
                name: type === 'COURSE' ? 'Curriculum' : 'Product',
                params: { productId: id }
            })
        }
    }
}
</script>

<style module lang="scss">
.lesson {
  display: flex;
  justify-content: space-between;
  background-color: transparent;
  &.border {
    position: relative;
    border-bottom: 1px solid #f7f7f7;
  }
  &:nth-last-of-type(1) {
    &:after {
      display: none;
    }
  }
  &.large {
    .img-wrapper {
      width: 320px;
      height: 226px;
    }
    &.border {
      padding-bottom: 28px;
    }
  }
  &.small {
    .img-wrapper {
      width: 280px;
      height: 186px;
    }
    &.border {
      padding-bottom: 24px;
    }
  }
}
.img-wrapper {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .label {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    line-height: 42px;
    background-color: #F2B036;
    border-radius: 20px 0px 20px 0px;
    font-size: 24px;
    font-family: Microsoft YaHei;
    color: #FFFFFF;
    text-align: center;
  }
}
.right {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 24px;
  flex: 1;
  .name {
    font-weight: bold;
    color: #333;
    @include elps-wrap(1);
    &.large {
      font-size: 32px;
    }
    &.small {
      font-size: 28px;
    }
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
  margin-top: 4px;
  color: #999;
  @include elps-wrap(1);
  &.large {
    font-size: 24px;
  }
  &.small {
    font-size: 20px;
  }
}
.count {
  color: #999;
  font-size: 20px;
}
.bottom {
  margin-top: auto;
  .price {
    font-size: 32px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 42px;
    color: #FE7700;
    &::before {
      content: '¥';
      font-size: 20px;
      margin-right: 4px;
    }
  }
  .original-price {
    margin-left: 6px;
    font-size: 20px;
    color: #999;
    text-decoration: line-through;
    &::before {
      content: '¥';
    }
  }
}
</style>
