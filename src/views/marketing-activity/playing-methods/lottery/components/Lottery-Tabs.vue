<script lang="jsx">
export default {
    name: 'LotteryTabs',
    data () {
        return {
            headers: [],
            panes: [],
            activityColor: '#E63303',
            noniusWidth: '0px',
            noniusLeft: '0px',
            currentValue: ''
        }
    },
    render (h) {
        return (
            <div
                class="lottery-tabs"
                style={
                    {
                        '--activityColor': this.activityColor,
                        '--nonius-width': this.noniusWidth,
                        '--nonius-left': this.noniusLeft
                    }
                }
            >
                <div class="lottery-tabs__nav">
                    { this.headers }
                </div>
                <div class="lottery-tabs__content">
                    {this.panes}
                </div>
            </div>
        )
    },
    mounted () {
        this.headersUpdated()
        this.paneUpdated()
    },
    methods: {
        paneUpdated () {
            const panes = this.$slots.default.map((item, i) => {
                const { value } = item.componentOptions.propsData
                return (
                    <div
                        key={i}
                        class="lottery-tabs__pane"
                        style={
                            {
                                display: value === this.currentValue ? 'block' : 'none'
                            }
                        }
                    >
                        {item}
                    </div>
                )
            })
            this.panes = panes
        },
        headersUpdated () {
            const headers = this.$slots.default.map((item, i) => {
                const { value, label } = item.componentOptions.propsData
                const paneClick = this.paneClick.bind(this, value)
                return (
                    <div
                        key={i}
                        class={
                            { activity: value === this.currentValue, 'lottery-tabs__item': true }
                        }
                        id={`pane${ i }`}
                        onClick={paneClick}
                    >
                        {label}
                    </div>
                )
            })
            headers.push(<div class="lottery-tabs__nonius"/>)
            this.headers = <div class="lottery-tabs__headers">
                { headers }
            </div>
        },
        paneClick (val, e) {
            this.currentValue = val
            this.noniusWidth = `${ e.currentTarget.offsetWidth }px`
            this.noniusLeft = `${ e.currentTarget.offsetLeft }px`
            this.headersUpdated()
            this.paneUpdated()
            this.$emit('paneClick', val)
        }
    }
}
</script>

<style scoped lang="scss">
    $namespace: lottery-tabs;
    @mixin b ($s: false) {
        $selector: $namespace;
        @if $s {
            $selector: $namespace + '__' + $s;
        }
        .#{$selector} {
            @content;
        }
    }
    @include b() {
        font-size: 89px;
        background-color: #fff;
    }
    @include b(nav) {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    @include b(headers) {
        position: relative;
        width: max-content;
        height: 80px;
        font-size: 36px;
        font-weight: bold;
        &:after {
            position: absolute;
            left: 0;
            bottom: 0;
            content: '';
            height: 4px;
            width: 100%;
            background-color: #E7E7E7;
            border-radius: 2px;
            z-index: 1;
        }
    }

    @include b(item) {
        display: inline-block;
        padding: 0 33px;
        &.activity {
            color: var(--activityColor);
        }
    }

    @include b(nonius) {
        position: absolute;
        left: var(--nonius-left);
        bottom: 0;
        padding: 0;
        width: var(--nonius-width);
        height: 8px;
        background-color: var(--activityColor);
        border-radius: 4px;
        z-index: 2;
        transition: left .2s ease-in-out, width .2s ease-in-out;
    }
</style>
