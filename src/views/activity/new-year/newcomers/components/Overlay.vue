<template>
    <div class="invite-newcomers-overlay">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'InviteNewcomersOverlay'
}
</script>

<style lang="scss" scoped>
.invite-newcomers-overlay {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
}
</style>
