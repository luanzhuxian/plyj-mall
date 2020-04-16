<template>
    <div :class="$style.skeleton">
        <div :class="[$style.price, $style.skeAnimation]" />
        <div :class="[$style.originalPrice, $style.skeAnimation]" />
        <div :class="[$style.main, $style.main1, $style.skeAnimation]" />
        <div :class="[$style.main, $style.main2, $style.skeAnimation]" />
        <div :class="[$style.sub, $style.skeAnimation]" />
        <div :class="$style.fieldWrapper">
            <div :class="[$style.field, $style.skeAnimation]" />
        </div>
        <div :class="$style.fieldWrapper">
            <div :class="[$style.field, $style.skeAnimation]" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'Skeleton',
    data () {
        return {}
    }
}
</script>

<style lang="scss" module>
.skeleton {
    position: relative;
    padding: 12px 24px;
    background-color: #fff;
}

.price {
    margin-bottom: 8px;
    width: 150px;
    height: 62px;
}
.original-price {
    margin-bottom: 30px;
    width: 30%;
    height: 36px;
}
.main {
    height: 38px;
}
.main1 {
    margin-bottom: 8px;
    width: 100%;
}
.main2 {
    margin-bottom: 32px;
    width: 70%;
}
.sub {
    margin-bottom: 32px;
    width: 70%;
    height: 32px;
}
.field-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    height: 76px;
    border-top: 1px solid #e7e7e7;
}
.field {
    width: 50%;
    height: 32px;
}

.skeAnimation {
    @include skeAnimation(#eee);
}

</style>
