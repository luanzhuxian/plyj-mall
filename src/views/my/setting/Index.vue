<template>
    <div :class="$style.setting">
        <div :class="$style.top">
            <img v-imgError
                 :src="avatar"
                 alt=""
            >
            <div :class="$style.baseInfo">
                <span
                    :class="$style.name"
                    v-text="userName"
                />
                <span
                    :class="$style.phoneNumber"
                    v-text="mobile?`${mobile.substring(0, 3)}****${mobile.substring(mobile.length-4)}`:'未设置'"
                />
            </div>
            <router-link
                :to="{ name: 'SettingEdit' }"
            >
                <div :class="$style.edit">
                    编辑
                </div>
            </router-link>
        </div>

        <div :class="$style.set">
            <pl-fields :route="{ name: 'Address' }">
                <div>
                    <pl-svg class="mr-24" name="icon-my-address" width="40" :vertical-align="-8" />
                    <span>我的地址</span>
                </div>
            </pl-fields>
            <pl-fields :route="{ name: 'Invoice' }">
                <div>
                    <pl-svg class="mr-24" name="icon-my-invoice" width="40" :vertical-align="-8" />
                    <span>我的发票</span>
                </div>
            </pl-fields>
            <pl-fields :route="{ name: 'StudentList' }">
                <div>
                    <pl-svg class="mr-24" name="icon-student-manage" width="40" :vertical-align="-8" />
                    <span>学员管理</span>
                </div>
            </pl-fields>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Index',
    computed: {
        ...mapGetters(['avatar', 'userName', 'mobile', 'roleName'])
    }
}
</script>

<style module lang="scss">
    .top {
        display: flex;
        align-items: center;
        height: 200px;
        padding: 0 28px;
        background-color: #fff;
        img {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 50%;
        }
        .dafault-face {
            width: 120px;
        }
        .login-btn {
            width: 200px;
        }
    }
    .base-info {
      width: 460px;
        margin-left: 28px;
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .name {
        font-size: 42px;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .phone-number {
        font-size: 24px;
        font-weight:400;
        color: #666666;
        line-height:34px;
        font-family:PingFangSC-Regular;
      &:before {
            content: '手机号:';
            margin-right: 8px;
            font-family:PingFangSC-Regular;
        }
    }
    .edit{
      background:rgba(255,247,230,1);
      border-radius:5px;
      font-size:24px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(254,119,0,1);
      line-height:34px;
      padding: 8px 18px;
    }
    .set {
        width: 670px;
        margin: 28px auto;
        padding: 0 28px;
        border-radius: $--radius1;
        overflow: hidden;
        background-color: #fff;
    }
</style>
