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
        }
    },
    data () {
        return {
            index: 0,
            duration: 3,
            gap: 1,
            timer: null
        }
    },
    deactivated () {
        this.index = 0
        clearTimeout(this.timer)
    },
    methods: {
        start () {
            const item = this.list[this.index]
            const template = `
                <div style="--duration: ${ this.duration }s; --position: ${ -200 }px" class="${ this.$style.item }" >
                    <img class="${ this.$style.via }" src="${ item.headImgUrl }" alt="">
                    <div>
                        ${ item.name.split('')[0] } **
                        已捐赠 ${ item.donationAmount } 元
                    </div>
                </div>
            `
            const node = document.createElement('div')
            node.innerHTML = template
            const child = node.children[0]
            this.$refs.container.appendChild(child)
            child.addEventListener('animationend', () => {
                child.remove()
            })
        },
        run () {
            if (!this.list.length) return
            this.timer = setTimeout(() => {
                this.start()
                if (this.index + 1 >= this.list.length) {
                    this.index = 0
                } else {
                    this.index++
                }
                this.run()
            }, this.gap * 1000)
        }
    },
    watch: {
        list (val) {
            this.$nextTick(() => {
                if (val.length) this.run()
            })
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
            padding: 6px 16px;
            width: max-content;
            white-space: nowrap;
            background-color: rgba(0,0,0,1);
            border-radius: 0 8px 8px 0;
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
