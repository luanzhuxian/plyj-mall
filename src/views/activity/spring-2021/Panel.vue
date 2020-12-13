<template>
    <div
        class="spring-2021-panel"
        :class="[customClass]"
    >
        <slot name="title">
            <div class="spring-2021-panel-title">
                <b v-text="title" />
            </div>
        </slot>

        <template v-if="subtitle || $slots.subtitle || $scopedSlots.subtitle">
            <slot name="subtitle">
                <div class="spring-2021-panel-subtitle">
                    <span v-text="subtitle" />
                </div>
            </slot>
        </template>

        <div class="spring-2021-panel-container">
            <slot />

            <template v-if="!hideButton">
                <slot name="button">
                    <button class="spring-2021-panel-button" v-text="button" @click="handleClick" />
                </slot>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Spring2021Panel',
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
.spring-2021-panel {
    position: relative;
    &-title {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 148px;
        background: url(https://mallcdn.youpenglai.com/static/admall/mall-management/spring-2020/title-common.png) no-repeat center;
        background-size: 100%;
        > b {
            font-size: 36px;
            font-family: Microsoft YaHei;
            line-height: 48px;
            color: #D00C03;
        }
    }
    &-subtitle {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        font-size: 28px;
        font-family: Microsoft YaHei;
        line-height: 38px;
        color: #FEECC7;
    }
    &-container {
        padding: 40px 24px;
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
