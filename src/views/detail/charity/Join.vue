<template>
    <div :class="$style.join">
        <div :class="$style.joinTop">
            <ul :class="$style.avatarList">
                <li
                    :class="$style.avatar"
                    v-for="(item, k) in [1, 2, 3, 4].slice(-4)"
                    :key="k"
                >
                    <img :src="'https://mallcdn.youpenglai.com/static/admall/mall-management/default.png' + '?x-oss-process=style/thum-small'" :alt="item">
                </li>
            </ul>
            <span v-if="1 > 0">200人和你一起参与</span>
        </div>
        <div :class="$style.joinBottom">
            <span :class="$style.joinBottomLeft">购买可捐赠</span>
            <pl-svg name="icon-zongzi-03e21" width="30" height="30" />
            <span>20元公益金</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Join',
    props: {
        data: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {}
    }
}
</script>

<style lang="scss" module>
.join {
    max-width: 360px;
    &-top {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 24px;
        line-height: 34px;
        color: #999;
        > span {
            @include elps();
        }
    }
    &-bottom {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 8px;
        font-size: 26px;
        line-height: 36px;
        color: #ffa300;
        &-left {
            margin-right: 10px;
            color: #fe7700;
        }
        > svg {
            margin-right: 4px;
        }
        > span {
            @include elps();
        }
    }
}
.avatar-list {
    position: relative;
    display: flex;
    align-items: center;
    margin-right: 20px;
    .avatar {
        position: absolute;
        width: 32px;
        height: 32px;
        background-color: #ccc;
        border-radius: 50%;
        overflow: hidden;
        @for $i from 1 through 4 {
            $difference: 20px;
            &:nth-last-of-type(#{$i}) {
                right: ($i - 1) * $difference;
                z-index: 4 - $i;
            }
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}

</style>
