<template>
  <div class="invite-newcomers-board-number">
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'InviteNewcomersBoardNumber',
  props: {
    value: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.invite-newcomers-board-number {
  width: 36px;
  height: 60px;
  line-height: 60px;
  background: linear-gradient(180deg, rgba(44,42,40,1) 0%, rgba(97,93,93,1) 52%, rgba(49,48,49,1) 100%);
  border-radius: 4px;
  color: white;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-left: 2px;
  margin-right: 2px;
}
</style>
