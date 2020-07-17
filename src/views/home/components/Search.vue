<template>
    <div :class="$style.search" :style="{ padding: isQRCodeBtnShow ? `${20 / 7.5}vw` : '' }">
        <router-link
            tag="div"
            :class="$style.searchBox"
            :to="{ name: 'Search' }"
        >
            <pl-svg name="icon-search" fill="#ccc" width="30" />
            <input type="text" :placeholder="placeholder">
        </router-link>
        <button v-if="isQRCodeBtnShow" :class="$style.qrcodeBtn" @click.stop="$showMallQRCOde()">进入公众号</button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Search',
    props: {
        placeholder: {
            type: String,
            default: '搜索'
        }
    },
    computed: {
        ...mapGetters(['mallQRCodeInfo']),
        isQRCodeBtnShow () {
            return this.mallQRCodeInfo && this.mallQRCodeInfo.isHomeDisplay
        }
    }
}
</script>

<style module lang="scss">
.search {
    display: flex;
    height: 110px;
    width: 100%;
    align-items: center;
    box-sizing: border-box;
    z-index: 9;
}
.search-box {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 20px;
    flex: 1;
    width: 0;
    height: 60px;
    background-color: #fff;
    border-radius: 30px;
    box-sizing: border-box;
    svg {
        position: absolute;
        top: 50%;
        left: 32%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
    }
    input {
        width: 100%;
        font-size: 28px;
        font-weight: bold;
        background-color: transparent;
        text-align: center;
        &::placeholder {
            color: #bcbcbc;
            letter-spacing: 3px;
            text-align: center;
        }
    }
}
.qrcode-btn {
    margin-left: 20px;
    width: 170px;
    height: 60px;
    background: #fff;
    border: 2px solid #f2b036;
    border-radius: 30px;
    font-size: 26px;
    font-family: Microsoft YaHei;
    line-height: 56px;
    text-align: center;
    color: #f2b036;
    box-sizing: border-box;
}

</style>
