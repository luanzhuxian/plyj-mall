<template>
    <div :class="$style.gift">
        <img src="https://mallcdn.youpenglai.com/static/admall/2.11.0/newuser-pop.png" alt="">
        <div>
            <div :class="$style.name" class="fz-24">阿卡丽商店噶山豆根</div>
            <div :class="$style.time" class="fz-20 gray-3">2019.1.15-2019.4.30可兑换</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Gift'
}
</script>

<style module lang="scss">
    .gift {
        display: inline-block;
        width: 292px;
        height: 404px;
        margin-right: 16px;
        font-size: 0;
        background-color: #FFEAE1;
        > img {
            display: block;
            width: 292px;
            height: 292px;
        }
        > div {
            padding: 26px 12px;
            > .name {
                margin-bottom: 18px;
            }
        }
    }
</style>
