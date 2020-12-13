<template>
    <div>
        <slot />
    </div>
</template>

<script>
export default {
    name: 'LotteryTabPane',
    props: {
        label: {
            type: [String, Number],
            default: ''
        },
        value: {
            type: [String, Number],
            default: ''
        }
    },
    updated () {
        console.log(this)
    }
}
</script>
