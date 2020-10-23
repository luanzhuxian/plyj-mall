<template>
    <div
        class="double-12-panel"
        :class="[customClass]"
        :style="{
            '--title-bg-color': titleBgColor
        }"
    >
        <slot name="title">
            <div class="double-12-panel-title">
                <span v-text="title" />
            </div>
        </slot>

        <template v-if="subtitle || $slots.subtitle || $scopedSlots.subtitle">
            <slot name="subtitle">
                <div class="double-12-panel-subtitle">
                    <span v-text="subtitle" />
                </div>
            </slot>
        </template>

        <div class="double-12-panel-container">
            <slot />

            <template v-if="!hideButton">
                <slot name="button">
                    <button class="double-12-panel-button" v-text="button" @click="handleClick" />
                </slot>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Double12Panel',
    props: {
        customClass: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        subtitle: {
            type: String,
            default: ''
        },
        button: {
            type: String,
            default: '点击查看更多'
        },
        titleBgColor: {
            type: String,
            default: ''
        },
        hideButton: Boolean
    },
    methods: {
        handleClick () {
            this.$emit('click')
        }
    }

}
</script>

<style lang="scss">
.double-12-panel {
    position: relative;
    &-title {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        margin: 0 auto;
        padding-bottom: 4px;
        width: 518px;
        height: 82px;
        background: url('https://mallcdn.youpenglai.com/static/admall/mall-management/double-12-2020/title-orange.png') no-repeat center;
        background-size: 100%;
        border-radius: 20px 20px 0px 0px;
        > span {
            font-size: 36px;
            font-family: Microsoft YaHei;
            line-height: 48px;
            color: #FEECC7;
        }
    }
    &-subtitle {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        height: 54px;
        background: linear-gradient(180deg, #C34400 0%, #DB451B 100%);
        border-radius: 40px 40px 0px 0px;
        font-size: 28px;
        font-family: Microsoft YaHei;
        line-height: 38px;
        color: #FEECC7;
    }
    &-container {
        margin-top: 20px;
        padding: 40px 20px;
        border-radius: 40px;
    }
    &-button {
        display: block;
        margin: 40px auto 0;
        width: 248px;
        height: 52px;
        border: 2px solid #FEECC7;
        border-radius: 26px;
        text-align: center;
        font-size: 28px;
        font-family: Microsoft YaHei;
        line-height: 48px;
        background-color: transparent;
        color: #FEECC7;
    }
}

</style>
