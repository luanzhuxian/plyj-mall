<template>
    <div v-show="helpers.length" :class="$style.helpers">
        <pl-svg name="icon-zhulihaoyou" fill="60" />
        <div :class="$style.list">
            <img
                v-for="(item, i) of helpers"
                :key="i"
                :src="item.headImgUrl"
                alt=""
            >
            <span v-if="helpers.length === 6" :class="$style.soMore">...</span>
        </div>
    </div>
</template>

<script>
import {
} from '../../../../apis/invitenewcomers'
export default {
    name: 'HelperList',
    props: {
        helpers: {
            type: Array,
            default () {
                return []
            }
        }
    }
}
</script>

<style module lang="scss">
  .helpers {
    display: flex;
    align-items: center;
    padding: 22px 30px;
    box-sizing: border-box;
    background-color: #F19928;
  }
  .list {
    display: flex;
    align-items: center;
    margin-left: 30px;
    > img {
      width: 64px;
      height: 64px;
      margin-right: 26px;
      border-radius: 32px;
      object-fit: cover;
    }
  }
  .so-more {
    font-size: 30px;
    color: #fff;
  }
</style>
