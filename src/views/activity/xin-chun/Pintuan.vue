<template>
    <div :class="$style.pintuan">
        <div :class="$style.pintuanTop">
            <div :class="$style.pintuanTopSide" />
            <router-link :class="$style.pintuanTopContent" tag="div" :to="{ name: 'SpringGroup' }">
                <h3>新春团购大联欢</h3>
                <p v-if="Number(data.otherValue)">
                    {{ `还有${data.otherValue}个团 点击查看>` }}
                </p>
                <p v-else>
                    查看更多>
                </p>
            </router-link>
        </div>
        <ul :class="$style.pintuanList" v-if="data.values.length">
            <template v-for="(item, i) of data.values">
                <item
                    v-if="item.goodsInfo && item.goodsInfo.activityInfo"
                    :data="item"
                    :key="i"
                />
            </template>
        </ul>
    </div>
</template>

<script>
import Item from './Item-Pintuan.vue'

export default {
    name: 'Pintuan',
    components: {
        Item
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {}
    }
}
</script>

<style lang="scss" module>
  .pintuan {
    &-top {
      &-side {
        border: 64px solid;
        border-bottom: 32px solid;
        border-top: none;
        border-color: transparent transparent #FE834F transparent;
      }
      &-content {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 136px;
        border-top: 4px solid #FFB89A;
        background: #FD6C2F;
        font-size: 26px;
        font-family: Microsoft YaHei;
        color: #FFFFFF;
        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.20);
        > h3 {
          font-size: 48px;
          font-weight: bold;
        }
        > p {
          margin-top: 8px;
        }
      }
    }
    &-list {
      padding: 52px 32px 48px;
      background: #F6501D;
    }
  }
</style>
