<script lang="jsx">
export default {
    name: 'LotteryTabs',
    data () {
        return {
            panes: [],
            activityColor: '#E63303',
            noniusWidth: '0px',
            noniusLeft: '0px'
        }
    },
    render (h) {
        const tabNav = (
            <div class="lottery-tabs__nav">
                { this.panes }
            </div>
        )
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
                {tabNav}
                <div class="lottery-tabs__content">
                    {this.$slots.default}
                </div>
            </div>
        )
    },
    mounted () {
        this.paneUpdated()
        this.$on('pane-click', this.paneClick)
    },
    methods: {
        paneUpdated () {
            const panes = this.$slots.default.map((item, i) => (
                <div
                    class="lottery-tabs__pane" id={`pane${ i }`}
                    on-click={this.paneClick}
                >
                    {item.componentInstance.label}
                </div>
            ))
            panes.push(<div class="lottery-tabs__nonius"/>)
            this.panes = <div class="lottery-tabs__pane-list">
                { panes }
            </div>
        },
        paneClick (e) {
            console.log(e.currentTarget.offsetLeft)
            this.noniusWidth = `${ e.currentTarget.offsetWidth }px`
            this.noniusLeft = `${ e.currentTarget.offsetLeft }px`
            console.log(e)
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

    @include b(pane-list) {
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

    @include b(pane) {
        display: inline-block;
        padding: 0 33px;
    }

    @include b(nonius) {
        position: absolute;
        left: var(--nonius-left);
        bottom: 0;
        padding: 0;
        width: var(--nonius-width);
        height: 4px;
        background-color: var(--activityColor);
        border-radius: 2px;
        z-index: 2;
        transition: left .2s ease-in-out, width .2s ease-in-out;
    }
</style>
