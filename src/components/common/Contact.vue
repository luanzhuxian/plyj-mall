<template>
    <transition name="fade">
        <div :class="$style.contact" v-if="show">
            <div :class="$style.list">
                <a
                    v-for="(item, i) of servicePhoneModels"
                    :key="i"
                    :href="'tel:' + item.contactWay"
                >
                    <span>
                        {{ item.contactUsername }}：
                    </span>
                    <span v-text="item.contactWay" />
                </a>
            </div>
            <button :class="$style.cancel" @click="close">
                取消
            </button>
        </div>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Contact',
    props: {
        show: Boolean
    },
    computed: {
        ...mapGetters(['servicePhoneModels'])
    },
    methods: {
        close () {
            this.$emit('update:show', false)
        }
    }
}
</script>

<style module lang="scss">
    .contact {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 12;
        background-color: rgba(0, 0, 0, .5);
    }

    .list {
        position: absolute;
        left: 50%;
        bottom: 132px;
        transform: translateX(-50%);
        width: 702px;
        border-radius: 20px;
        overflow: hidden;
        > a {
            display: block;
            padding: 0 24px;
            font-size: 30px;
            color: #598BF8;
            text-align: center;
            line-height: 80px;
            border-bottom: 1px solid #e7e7e7;
            background-color: #fff;
            @include elps();

            &:nth-last-of-type(1) {
                border-bottom: none;
            }
            > .name {
                color: #999;
            }
        }
    }

    .cancel {
        position: absolute;
        left: 50%;
        bottom: 16px;
        transform: translateX(-50%);
        width: 702px !important;
        line-height: 100px;
        font-size: 36px;
        color: #598BF8;
        border-radius: 20px;
        background-color: #fff;
    }
</style>
