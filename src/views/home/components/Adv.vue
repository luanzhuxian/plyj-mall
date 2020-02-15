<template>
  <div :class="$style.adv">
    <router-link
      :class="$style.img"
      v-if="data.values[0].type && data.values[0].value"
      tag="img"
      :src="data.values[0].image"
      :to="getRouteLink(data.values[0])"
    />
    <img
      :class="$style.img"
      v-else
      :src="data.values[0].image"
    >
  </div>
</template>

<script>
export default {
  name: 'Adv',
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
  },
  methods: {
    getRouteLink ({ type, value }) {
      const id = (type === 1 && value === '全部商品') ? '' : value
      if (type === 1) {
        return {
          name: 'Classify',
          params: {
            optionId: id || null
          }
        }
      }
      if (type === 2) {
        return {
          name: 'Product',
          params: {
            productId: id || null
          }
        }
      }
    }
  }
}
</script>

<style module lang="scss">
  .adv {
    height: 200px;
    img {
      width: 100%;
      height: 100%;
      border-radius: $--radius1;
      overflow: hidden;
      object-fit: cover;
    }
  }
</style>
