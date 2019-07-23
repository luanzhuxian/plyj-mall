<template>
  <div :class="$style.usefulLife">
    <div :class="$style.title">
      <pl-svg name="date" />
      <span>有效期：</span>
    </div>
    <div v-if="start" :class="$style.date">
      <span v-if="start.split(' ')[0] !== start.split(' ')[0]">
        {{ start | dateFormat('YYYY.MM.DD') }}-{{ end | dateFormat('YYYY.MM.DD') }}
      </span>
      <span v-else>
        {{ start | dateFormat('YYYY.MM.DD') }}
      </span>
    </div>
    <div v-else :class="$style.date">
      长期有效
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsefulLife',
  props: {
    start: {
      type: String,
      default: ''
    },
    end: {
      type: String,
      default: ''
    }
  }
}
</script>

<style module lang="scss">
  .useful-life {
    display: flex;
    align-items: center;
    margin-top: 26px;
    padding: 20px 0 10px 0;
    font-size: 24px;
    border-top: 1px solid #e7e7e7;
  }
  .date {
    color: #000;
  }
  .title {
    display: inline-flex;
    align-items: center;
    color: #999;
    font-weight: 500;
    > svg {
      width: 30px;
      margin-right: 6px;
    }
  }
</style>
