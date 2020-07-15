<template>
    <transition name="fade">
        <div :class="{ [$style.liveInteract]: true, [$style.show]: show }">
            <div :class="$style.row">
                <!-- 公告 -->
                <Notice ref="notice" v-bind="$attrs" />

                <!-- 签到 -->
                <SignIn ref="signIn" v-bind="$attrs" />

                <!-- 抽奖 -->
                <Lottery ref="lottery" v-bind="$attrs" />
            </div>
            <div :class="$style.row">
                <!-- 答题 -->
                <Answer ref="answer" v-bind="$attrs" />

                <!-- 提问 -->
                <Questions ref="questions" v-bind="$attrs" @close="close" />
            </div>

            <div :class="$style.close">
                <PlSvg @click="close" name="icon-close" width="40" fill="#666666" />
            </div>
        </div>
    </transition>
</template>
答题
<script>
import Notice from './Notice'
import SignIn from './SignIn'
import Lottery from './Lottery'
import Answer from './Answer'
import Questions from './Questions'
export default {
    name: 'LiveInteract',
    inheritAttrs: false,
    components: {
        Notice,
        SignIn,
        Lottery,
        Answer,
        Questions
    },
    props: {
        show: Boolean
    },
    methods: {
        async init () {
            try {
                await this.$nextTick()
                const { notice, signIn, lottery, answer, questions } = this.$refs
                console.log('直播互动初始化')
                notice.init()
                signIn.init()
                lottery.init()
                answer.init()
                questions.init()
            } catch (e) { throw e }
        },
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style lang='scss' module>

.live-interact {
    position: fixed;
    left: 0;
    bottom: -642px;
    width: 100%;
    height: 642px;
    z-index: 2002;
    padding: 88px 78px;
    box-sizing: border-box;
    border-radius: 40px 40px 0 0;
    text-align: center;
    background-color: #fff;
    &.show {
        animation: move .4s ease-in-out forwards;
        @keyframes move {
            100% {
                bottom: 0;
            }
        }
    }
    > .row {
        display: flex;
        width: 100%;
        margin-bottom: 50px;
        justify-content: space-between;
        &:nth-of-type(2) {
            margin-bottom: 82px;
            justify-content: flex-start;
            > div:nth-of-type(2) {
                margin-left: 144px;
            }
        }
    }
}

.mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .65);
}

</style>
