<template>
    <div :class="$style.subClassify">
        <div
            v-for="(item, i) of children"
            :key="i"
            :class="{
                [$style.classifyItem]: true,
                [$style.active]: id === item.id || !id
            }"
            @click="itemClick(item)"
        >
            <img v-imgError
                 class="radius-20"
                 :src="item.categoryPic + '?x-oss-process=style/thum-small'"
                 v-img-error="'classifyIcon'"
            >
            <div v-text="item.categoryName" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SubClassify',
    data () {
        return {
            id: ''
        }
    },
    props: {
        children: {
            type: Array,
            default () {
                return []
            }
        }
    },
    watch: {
        children () {
            this.id = ''
        }
    },
    methods: {
        itemClick (item) {
            this.id = item.id
            this.$emit('click', {
                cid: item.id,
                name: item.categoryName
            })
        }
    }
}
</script>

<style module lang="scss">
  .sub-classify {
    display: flex;
    flex-wrap: wrap;
    padding-top: 32px;
    border-bottom: 1px solid #F0F0F0;
  }
  .classify-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
    margin-bottom: 32px;
    filter: grayscale(80%) blur(2px);
    transition: filter .2s ease-in-out, color .2s ease-in-out;
    > div {
      margin-top: 8px;
      color: #666;
      font-size: 20px;
    }
    &.active {
      filter: grayscale(0);
      > div {
        color: $--primary-color;
      }
    }
    > img {
      width: 84px;
      height: 84px;
      object-fit: contain;
    }
  }
</style>
