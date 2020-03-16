<template>
    <div :class="$style.search">
        <router-link
            tag="div"
            :class="$style.searchBox"
            :to="{ name: 'Search' }"
        >
            <pl-svg name="icon-search" fill="#ccc" width="30" />
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
    box-sizing: border-box;
    z-index: 9;
  }
  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 20px;
    width: 100%;
    height: 60px;
    background-color: #fff;
    border-radius: 30px;
    box-sizing: border-box;
    svg {
      position: absolute;
      top: 50%;
      left: 32%;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
    }
    input {
      width: 100%;
      font-size: 28px;
      font-weight: bold;
      background-color: transparent;
      text-align: center;
      &::placeholder {
        color: #BCBCBC;
        letter-spacing: 3px;
        text-align: center;
      }
    }
  }
</style>
