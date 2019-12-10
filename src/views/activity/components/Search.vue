<template>
  <div :class="$style.search">
    <router-link
      tag="div"
      :class="$style.searchBox"
      :to="{ name: 'Search' }"
    >
      <pl-svg name="icon-search" width="30" />
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
    align-items: center;
    padding: 12px 24px;
    z-index: 9;
  }
  .search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    background-color: #6A0000;
    border-radius: 30px;
    opacity: 0.5;
    svg {
      position: relative;
      left: 258px;
      width: 32px;
      height: 32px;
    }
    input {
      width: 100%;
      font-size: 28px;
      font-weight: bold;
      background-color: transparent;
      text-align: center;
      color: #FFF;
      &::placeholder {
        color: #FFF;
        letter-spacing: 3px;
        text-align: center;
      }
    }
  }
</style>
