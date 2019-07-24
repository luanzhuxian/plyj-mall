<template>
  <div :class="$style.search">
    <router-link
      tag="div"
      :class="$style.searchBox"
      :to="{ name: 'Search' }"
    >
      <pl-svg name="search" />
      <input
        type="text"
        :placeholder="placeholder"
      >
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    placeholder: {
      type: String,
      default: '搜索'
    }
  }
}
</script>

<style module lang="scss">
  .search {
    display: flex;
    height: 110px;
    width: 100%;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;
    z-index: 9;
    border-bottom: 1px solid #f7f7f7;
  }
  .search-box {
    display: flex;
    align-items: center;
    padding: 0 20px;
    width: 100%;
    height: 60px;
    background-color: #fff;
    border-radius: 30px;
    box-sizing: border-box;
    svg {
      width: 28px;
      height: 28px;
      margin-right: 20px;
    }
    input {
      width: 566px;
      font-size: 28px;
      font-weight: bold;
      background-color: transparent;
      &::placeholder {
        color: #BCBCBC;
        letter-spacing: 3px;
      }
    }
  }
</style>
