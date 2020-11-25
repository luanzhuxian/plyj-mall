<template>
    <div :class="$style.barrage">
        <div :class="$style.container" ref="container" />
    </div>
</template>

<script>
export default {
    name: 'Barrage',
    props: {
        list: {
            type: Array,
            default () {
                return []
            }
        },
        template: {
            type: Function,
            default (item, vm) {
                return `
                    <div style="--duration: ${ vm.duration }s; --position: ${ -200 }px" class="${ vm.$style.item }" >
                        <img class="${ vm.$style.via }" src="${ item.headImgUrl }" alt="">
                            ${ item.name.split('')[0] } **
                            已捐赠 ${ item.donationAmount } 元
                        </div>
                    </div>
                `
            }
        }
    },
    data () {
        return {
            index: 0,
            duration: 3,
            gap: 1.4,
            timer: null
        }
    },
    deactivated () {
        this.index = 0
        window.clearTimeout(this.timer)
    },
    destroyed () {
        this.index = 0
        window.clearTimeout(this.timer)
    },
    methods: {
        start () {
            if (!this.$refs.container) {
                return
            }
            const item = this.list[this.index]
            const template = this.template(item, this)
            const node = document.createElement('div')
            node.innerHTML = template
            const child = node.children[0]
            this.$refs.container.appendChild(child)
            child.addEventListener('animationend', () => {
                child.remove()
                node.remove()
            })
        },
        run () {
            window.clearTimeout(this.timer)
            this.timer = setTimeout(async () => {
                this.start()
                if (this.index + 1 >= this.list.length) {
                    this.index = 0
                    await this.waitCarousel()
                } else {
                    this.index++
                }
                this.run()
            }, this.gap * 1000)
        },
        waitCarousel () {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve()
                }, this.duration * 1000)
            })
        }
    },
    watch: {
        list: {
            handler (val) {
                if (!val.length) {
                    return
                }
                this.$nextTick(() => {
                    this.run()
                })
            },
            immediate: true
        }
    }
}
</script>

<style module lang='scss'>

.barrage {
    position: relative;
    width: fit-content !important;
    > .container {
        width: 100%;
        height: 56px;
        > .item {
            position: absolute;
            top: 0;
            display: flex;
            align-items: center;
            width: max-content;
            padding: 6px 16px;
            border-radius: 0 8px 8px 0;
            color: #fff;
            background-color: rgba(0,0,0,1);
            white-space: nowrap;
            animation: run var(--duration) linear;
            > .via {
                width: 44px;
                height: 44px;
                margin-right: 12px;
                border-radius: 50%;
            }
        }
        @keyframes run {
            0% {
                opacity: 1;
                transform: translate3d(0px, 0px, 0px);
            }
            100% {
                opacity: 0;
                transform: translate3d(0px, var(--position), 0px);
            }
        }
    }
}

</style>
