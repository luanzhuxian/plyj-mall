<template>
  <router-link :class="$style.propagate" tag="div" :to="{ name: 'Appointment' }">
    <div :class="$style.label">
      <span>了解我们</span>
    </div>
    <div :class="$style.info">
      <div :class="$style.name" v-text="data.values[0].mallName" />
      <p
        :class="$style.intro"
        v-if="data.values[0].mallDesc"
        v-text="data.values[0].mallDesc"
      />
    </div>
    <div :class="$style.imgWrapper">
      <img
        v-if="data.values[0].mallLogo"
        :src="data.values[0].mallLogo + '?x-oss-process=style/thum-small'"
      >
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'Propagate',
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
.propagate {
  box-sizing: border-box;
  position: relative;
  display: flex;
  padding: 32px 24px;
  height: 310px;
  background: #FFFAE6;
  box-shadow: 0px 16px 24px rgba(121, 30, 5, 0.2);
  border-radius: 20px;
  overflow: hidden;
}
.label {
  position: absolute;
  top: 24px;
  left: 0;
  width: 152px;
  height: 50px;
  background: #FF903F;
  border-radius: 0px 100px 100px 0px;
  font-size: 24px;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  &:after {
    margin-left: 6px;
    content: '';
    width: 0;
    height: 0;
    border-width: 8px;
    border-color: transparent transparent transparent #FFFFFF;
    border-style: solid;
    border-radius: 4px;
  }
}
.info {
  flex: 1;
  width: 0;
  padding-top: 66px;
}
.name {
  font-size: 32px;
  font-weight: bold;
  line-height: 34px;
  color: #000000;
  @include elps();
}
.intro {
  margin-top: 12px;
  font-size: 24px;
  line-height: 34px;
  color: #666666;
  @include elps-wrap(3);
}
.img-wrapper {
  position: relative;
  margin-left: 28px;
  width: 220px;
  height: 220px;
  &:before {
    position: absolute;
    top: 4px;
    bottom: -4px;
    left: 0;
    transform: translateX(-100%) skewY(-45deg);
    content: '';
    width: 8px;
    background: #F6511E;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
  }
  &:after {
    position: absolute;
    right: 4px;
    left: -4px;
    bottom: 0;
    transform: translateY(100%) skewX(-45deg);
    content: '';
    height: 8px;
    background: #FA7D34;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
