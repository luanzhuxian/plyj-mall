<template>
    <div
        class="product-card"
        :class="[{ round, border }, customClass]"
        @click="handleClick"
    >
        <div class="product-card__img-wrapper">
            <img :src="image + '?x-oss-process=style/thum-middle'" alt="">
            <div class="product-card__label" v-if="label" v-text="label" />
        </div>

        <div class="product-card__info">
            <div
                class="product-card__info-top"
                :style="{ '--line': maxLine }"
                v-if="top"
                v-text="top"
            />
            <div class="product-card__info-subtop" v-if="!$slots.subTop" v-text="subTop" />
            <slot name="middle" v-else />
            <div
                class="product-card__info-middle"
                :class="{
                    marginTopAuto: !$slots.subTop && !subTop
                }"
                v-if="!$slots.middle"
                v-text="middle"
            />
            <slot name="middle" v-else />
            <div
                class="product-card__info-bottom"
                :class="{
                    marginTopAuto: !$slots.middle && !middle
                }"
                v-if="!$slots.bottom"
            >
                <span
                    class="product-card__info-bottom-left"
                    v-if="!$slots.bottomLeft"
                    v-text="bottomLeft"
                />
                <slot name="bottomLeft" v-else />
                <div class="product-card__info-bottom-right" v-if="!$slots.bottomRight">
                    <button
                        class="product-card__info-bottom-button"
                        v-if="buttonText"
                        v-text="buttonText"
                        @click.stop="handleBtnClick"
                    />
                </div>
                <slot name="bottomRight" v-else />
            </div>
            <slot name="bottom" v-else />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductCard',
    props: {
        customClass: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: '',
            require: true
        },
        label: {
            type: String,
            default: ''
        },
        top: {
            type: String,
            default: '',
            require: true
        },
        subTop: {
            type: String,
            default: ''
        },
        middle: {
            type: String,
            default: ''
        },
        bottomLeft: {
            type: String,
            default: ''
        },
        buttonText: {
            type: String,
            default: ''
        },
        maxLine: {
            type: Number,
            default: 1
        },
        round: Boolean,
        roundImage: Boolean,
        border: Boolean,
        route: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {

        }
    },
    methods: {
        handleClick (e) {
            this.$emit('click', e)

            const { name, params, query } = this.route
            if (!name) return false

            this.$router.push({
                name,
                ...(params ? { params } : null),
                ...(query ? { query } : null)
            })
        },
        handleBtnClick (e) {
            this.$emit('btn-click', e)
        }
    }
}
</script>

<style lang="scss">
.product-card {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    height: 186px;
    overflow: hidden;
    &.round {
        border-radius: 20px;
    }
    &.border {
        border: 2px solid #e7e7e7;
    }

    &__img-wrapper {
        position: relative;
        width: 280px;
        height: 186px;
        overflow: hidden;
        // &.round {
        //     border-radius: 20px;
        // }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    &__label {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        line-height: 42px;
        text-align: center;
        background: #f2b036;
        border-radius: 20px 0 20px 0;
        font-size: 24px;
        color: #fff;
    }
    &__info {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        // justify-content: space-between;
        margin-left: 18px;
        padding: 8px 0;
        flex: 1;
        width: 0;
        height: 100%;
        font-size: 24px;
        line-height: 34px;
        color: #666;

        &-top {
            font-size: 28px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #373737;
            line-height: 34px;
            @include elps-wrap(var(--line));
        }
        &-subtop {
            margin-top: 16px;
            @include elps();
        }
        &-middle {
            margin-top: 10px;
            @include elps();
        }
        &-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // margin-top: auto;
            @include elps();
            &-left {
                flex: 1;
                width: 0;
                line-height: 48px;
                color: #999;
                @include elps();
            }
            &-button {
                margin-right: 8px;
                width: 124px;
                height: 48px;
                text-align: center;
                border: 2px solid #fe7700;
                border-radius: 8px;
                font-size: 26px;
                color: #fe7700;
            }
        }
    }
}
.margin-top-auto {
    margin-top: auto;
}

</style>
