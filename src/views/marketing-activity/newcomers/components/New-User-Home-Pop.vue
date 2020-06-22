<!-- 新人有礼首页弹框提示 -->
<template>
    <pl-mask :show="show" @close="close">
        <router-link
            tag="img"
            :to="{ name: 'Newcomers', params: { id } }"
            :class="$style.img"
            width="460"
            src="https://mallcdn.youpenglai.com/static/admall/2.11.0/newuser-pop.png"
            alt=""
        />
    </pl-mask>
</template>

<script>
export default {
    name: 'NewUserHomePop',
    props: {
        show: Boolean,
        id: {
            type: String,
            default: ''
        }
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style module lang="scss">
    .img {
        width: 460px;
    }
</style>
