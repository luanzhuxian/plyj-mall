<template>
  <div class="invite-newcomers-show-orders">
    <div class="title">
      已获得豪礼晒单
    </div>
    <div class="invite-numbers-wrap">
      <span class="invite-numbers">已有<span class="numbers">{{ totalShow }}</span>人获得了豪礼大奖</span>
    </div>
    <ul class="invite-members-list">
      <li
        v-for="(user, $idx) in users"
        :key="$idx"
      >
        <i class="gift-icon" />
        <!-- <img class="avatar" src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1369684156,4277819085&fm=26&gp=0.jpg"> -->
        <img class="avatar" :src="user.avatar">
        <div class="infos">
          <p class="share-info">
            {{ user.name }}邀请了<span class="numbers">{{ user.inviteNum }}</span>位好友
          </p>
          <p class="gift-info">
            {{ user.giftInfo }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'InviteNewcomersShowOrders',
  props: {
    users: {
      type: Array,
      default () {
        // [{name: String, avatar: String, inviteNum: Number, giftInfo: String}]
        return []
      }
    },
    totalShow: {
      type: Number,
      default: 0
    }
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
.invite-newcomers-show-orders {
  width: 702px;
  padding: 32px 0;
  background: rgba(255,255,255,1);
  border-radius: 20px;

  .title {
    height: 40px;
    line-height: 40px;
    margin-bottom: 12px;
    font-size: 28px;
    text-align: center;
  }

  .numbers {
    color: #fa4d2f;
  }

  .invite-numbers-wrap {
    text-align: center;
    margin-bottom: 40px;
  }

  .invite-numbers {
    display: inline-block;
    width:362px;
    height:50px;
    line-height: 50px;
    background: rgba(242,242,242,1);
    border-radius:68px;
    color: #999999;
    font-size: 24px;
  }

  .invite-members-list {
    list-style: none;
    padding-left: 24px;

    li {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 106px;
      list-style: none;
      padding: 0 0 40px 0;
      margin: 0;

      .gift-icon {
        display: inline-block;
        width: 48px;
        height: 48px;
        margin-right: 28px;
        background-image: url('https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/mall/2.0.0/invitenewcomers/gift@2x.png');
        background-size: 100%;
      }

      .avatar {
        width:106px;
        height:106px;
        margin-right: 24px;
        background:rgba(0,0,0,0);
        border-radius:50%;
      }

      .infos {
        margin-right: 24px;
        .share-info {
          height: 36px;
          margin-bottom: 4px;
          line-height: 36px;
          font-size: 26px;
          color: #333;
        }

        .gift-info {
          font-size: 22px;
          color: #999;
        }
      }
    }
  }
}
</style>
