<template>
  <div :class="$style.teacherCard + ' '">
    <div :class="$style.content">
      <img
        class="radius-10"
        :src="img"
        alt=""
      >
      <p
        :class="$style.name"
        v-text="name"
      />
      <p
        :class="$style.type"
        v-text="type"
      />
      <p
        :class="$style.desc"
        v-text="desc"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherCard',
  props: {
    img: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  }
}
</script>

<style module lang="scss">
.teacher-card {
  display: inline-block;
  padding: 20px;
  background-color: #fff;
  margin-right: 20px;
  border-radius: 20px;
}
.content {
  display: inline-flex;
  flex-direction: column;
  width: 250px;
  height: 380px;
  img {
    width: 100%;
    height: 230px;
    object-fit: cover;
  }
}
  .name {
    margin-top: 10px;
    font-size: 30px;
    font-weight: bold;
  }
  .type {
    margin-top: 6px;
    font-size: 22px;
    color: #666;
  }
  .desc {
    margin-top: 8px;
    color: #999;
    font-size: 20px;
  }
</style>
