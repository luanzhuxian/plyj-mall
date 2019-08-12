<template>
  <div :class="$style.callUs">
    <a href="tel:123" :class="$style.call">
      <pl-svg name="call-us2" />
    </a>
  </div>
</template>

<script>
export default {
  name: 'CallUs'
}
</script>

<style module lang="scss">
  .call-us {
    position: fixed;
    bottom: 194px;
    right: 24px;
    z-index: 99;
    .call {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 90px;
      height: 90px;
      border-radius: 45px;
      background-color: #fff;
      box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
      > svg {
        width: 46px;
      }
    }
  }
</style>
