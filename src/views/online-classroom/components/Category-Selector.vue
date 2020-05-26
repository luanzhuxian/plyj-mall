<template>
    <div
        v-if="category.length"
        :class="{
            [$style.categorySelector]: true,
            [$style.showAll]: isShowAll
        }"
        :style="{ '--offsetTop': $parent.$el && $parent.$el.offsetTop + 'px' }"
    >
        <ul :class="$style.classifyList">
            <li :class="{ [$style.active]: categoryId === 'ALL' }" id="ALL" @click="classifyClick({ id: 'ALL' })">
                全部
            </li>
            <li
                v-for="(item, index) in category"
                :class="{
                    [$style.active]: categoryId === item.id
                }"
                :key="index"
                :id="item.id"
                @click="classifyClick(item)"
            >
                {{ item.categoryName }}
            </li>
            <li :class="$style.close" v-show="isShowAll">
                <pl-svg name="icon-shibai" width="36" fill="#fff" @click="isShowAll = false" />
            </li>
        </ul>
        <transition name="fade">
            <div :class="$style.control" v-if="category.length && !isShowAll">
                <pl-svg
                    v-show="!isShowAll"
                    name="icon-group"
                    width="24"
                    fill="#484848"
                    @click="isShowAll = true"
                />
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'CategorySelector',
    data () {
        return {
            isShowAll: false,
            categoryId: 'ALL'
        }
    },
    watch: {
        isShowAll (val) {
            if (val) {
                document.body.style.overflow = 'hidden'
                document.body.style.height = '100vh'
            } else {
                document.body.style.overflow = null
                document.body.style.height = null
            }
        },
        category: {
            handler () {
                this.$nextTick(() => {
                    this.$parent.$el.style.paddingTop = `${ this.$el.offsetHeight }px`
                })
            },
            immediate: true
        }
    },
    props: {
        category: {
            type: Array,
            default () {
                return []
            }
        }
    },
    methods: {
        async classifyClick (item) {
            this.categoryId = item.id
            this.isShowAll = false
            setTimeout(() => {
                document.getElementById(this.categoryId).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                })
            }, 500)
            item.id = item.id === 'ALL' ? '' : item.id
            this.$emit('change', item)
        }
    }
}
</script>

<style module lang="scss">
    .category-selector {
        position: fixed;
        left: 0;
        top: var(--offsetTop);
        display: flex;
        align-items: center;
        width: 100vw;
        height: max-content;
        box-sizing: border-box;
        overflow-x: scroll;
        background-color: #fff;
        z-index: 10;
        .control {
            display: inline-flex;
            align-items: center;
            width: 70px;
            height: 32px;
            background-color: #fff;
            &:before {
                content: '';
                height: 32px;
                width: 20px;
                border-left: 2px solid #ccc;
                filter: blur(2px);
            }
        }
        .classify-list {
            display: flex;
            align-items: center;
            width: calc(100vw - 120px);
            padding: 28px 120px 28px 28px;
            line-height: 50px;
            background-color: #fff;
            overflow-x: scroll;
            > li {
                padding: 0 15px;
                text-align: center;
                font-size: 22px;
                color: #666;
                line-height: 44px;
                word-break: keep-all;
                white-space: nowrap;
                &.active {
                    background: #fdf5e7;
                    border: 1px solid #f3ad3c;
                    border-radius: 22px;
                    color: #f3ad3c;
                }
            }
            .close {
                position: absolute;
                bottom: -70px;
                left: 50%;
                transform: translateX(-50%);
            }
        }
        &.show-all {
            height: calc(100vh - var(--offsetTop));
            width: 100vw;
            align-items: flex-start;
            z-index: 10;
            background-color: rgba(0, 0, 0, .3);
            .classify-list {
                position: relative;
                flex-wrap: wrap;
                width: 100vw;
                align-items: flex-start;
                overflow: visible;
            }
            .control {
            }
        }
    }
    @supports(display: grid) {
        .show-all {
            .classify-list {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                justify-content: space-between;
            }
        }
    }
</style>
