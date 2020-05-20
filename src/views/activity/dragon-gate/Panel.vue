<template>
    <div class="dragon-panel" :class="[customClass]">
        <slot name="title">
            <div class="dragon-panel-title">
                <img v-if="isSvg" :src="title.name" alt="" :style="{ width: title.width / 7.5 + 'vw' }">
                <title v-text="title" v-else />
            </div>
        </slot>

        <slot />

        <template v-if="!hideButton">
            <slot name="button">
                <button class="dragon-panel-button" v-text="button" @click="handleClick" />
            </slot>
        </template>
    </div>
</template>

<script>
export default {
    name: 'Panel',
    props: {
        customClass: {
            type: String,
            default: ''
        },
        title: {
            type: [Object, String],
            default: ''
        },
        button: {
            type: String,
            default: '查看更多'
        },
        hideButton: Boolean
    },
    data () {
        return {}
    },
    computed: {
        isSvg () {
            const { title } = this
            return typeof title === 'object'
        }
    },
    methods: {
        handleClick () {
            this.$emit('click')
        }
    }

}
</script>

<style lang="scss">
.dragon-panel {
    position: relative;
    padding: 80px 16px 50px;
    background: #0058ef;
    border: 4px solid #222;
    border-radius: 16px;
    &-title {
        position: absolute;
        top: -28px;
        left: 0;
        right: 0;
        text-align: center;
    }
    > button {
        display: block;
        margin: 50px auto 0;
        width: 190px;
        height: 60px;
        line-height: 52px;
        text-align: center;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/dragon-gate/panel-btn.png') no-repeat center;
        background-size: 100%;
        border: 4px solid #222;
        border-radius: 50px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #000;
    }
}

</style>
