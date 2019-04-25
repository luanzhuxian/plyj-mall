<template>
  <div
    :class="$style.auditionItem + ' radius-20'"
    @click="handleClick"
  >
    <!-- 试听组件 -->
    <div :class="$style.content">
      <img
        class="radius-10"
        v-lazy="img"
        :key="img"
        alt=""
      >
      <div :class="$style.right">
        <div :class="$style.title">
          <h3 v-text="title" />
          <p><i v-text="count" />人试听过</p>
        </div>
        <div :class="$style.tag">
          <span
            v-for="(tag, index) of tags"
            :key="index"
            v-text="tag"
          />
        </div>
        <pl-button
          type="primary"
          :class="$style.button"
        >
          免费试听
        </pl-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuditionItem',
  props: {
    img: String,
    title: String,
    count: [String, Number],
    tags: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    handleClick () {
      this.$router.push({ name: 'Audition', params: { id: '123' } })
    }
  }
}
</script>

<style module lang="scss">
.audition-item {
  height: 196px;
  margin-top: 28px;
  background-color: #fff;
  overflow: hidden;
}
.content {
  display: flex;
  padding: 28px;
  img {
    width: 208px;
    height: 140px;
    object-fit: cover;
  }
}
.right {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  padding-left: 28px;
}
.title {
  h3 {
    margin-bottom: 10px;
    font-size: 28px;
    font-weight: bold;
    color: #000;
    @include elps-wrap(1);
  }
  p {
    font-size: 20px;
    color: #999;
  }
}
.tag {
  font-size: 20px;
  color: #999;
  line-height: 27px;
  span:nth-of-type(n+2) {
    &:before {
      position: relative;
      content: '|';
      padding: 0 10px;
    }
  }
}
.button {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
