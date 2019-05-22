<template>
  <div :class="$style.yaji">
    <top-text
      :title="`您好 ${userName}，`"
      tip="今天您赚到润笔了吗？"
    />
    <!--<div :class="$style.addFriend + ' radius-20 bold'">
      <span>邀请您的好友一起加入Helper吧！</span>
      <pl-svg name="add-friend" />
    </div>-->
    <ModuleTitle
      size="middle"
      title="分享就赚钱"
      badge="HOT"
      class="mt-40"
    />
    <load-more
      :request-methods="getActivityProduct"
      :form="form"
      ref="loadMore"
      :loading.sync="loading"
      no-content-tip="暂无活动商品"
    >
      <template v-slot="{ list }">
        <template v-if="list.length > 0">
          <ShareItem
            v-for="(item, i) of list"
            :key="i"
            :price="item.priceModels[0].price"
            :grade="5"
            :id="item.contentId"
            :desc="item.productDesc"
            :title="item.productName"
            :img="item.productImage[0].mediaUrl"
          />
        </template>

        <!--<div
          v-else-if="loading"
          :class="$style.skeleton"
        >
          <div :class="$style.left + ' ' + $style.skeAnimation" />
          <div :class="$style.right">
            <div :class="$style.rightA + ' ' + $style.skeAnimation" />
            <div :class="$style.rightB + ' ' + $style.skeAnimation" />
            <div :class="$style.rightC + ' ' + $style.skeAnimation" />
            <div :class="$style.rightD + ' ' + $style.skeAnimation" />
          </div>
        </div>-->
      </template>
    </load-more>
  </div>
</template>

<script>
import TopText from '../../components/Top-Text.vue'
import ModuleTitle from '../../components/Module-Title.vue'
import ShareItem from '../../components/item/Share-Item.vue'
import LoadMore from '../../components/Load-More.vue'
import { getActivityProduct } from '../../apis/broker'
import { mapGetters } from 'vuex'
export default {
  name: 'Yaji',
  components: {
    ModuleTitle,
    ShareItem,
    TopText,
    LoadMore
  },
  data () {
    return {
      total: 10,
      loading: false,
      form: {
        type: '',
        current: 1,
        size: 10
      },
      getActivityProduct
    }
  },
  computed: {
    ...mapGetters(['mallId', 'userName', 'agentUser'])
  },
  mounted () {
    this.$refs.loadMore.refresh()
  },
  methods: {
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.agentUser) {
        vm.$router.push({ name: 'My' })
      }
    })
  }
}
</script>

<style module lang="scss">
  .yaji {
    padding: 28px 40px 120px 40px;
  }
  .add-friend {
    display: flex;
    justify-content: space-between;
    margin-top: 36px;
    margin-bottom: 62px;
    padding: 34px 40px;
    background-color: var(--warning-color);
    > span {
      color: #fff;
      font-size: 28px;
    }
    > svg {
      height: 36px;
      fill: #fff;
      font-weight: bold;
    }
  }
  .skeleton {
    position: relative;
    width: 670px;
    height: 318px;
    margin: 28px auto 0;
    .left {
      width: 480px;
      height: 318px;
      border-radius: $--radius1;
    }
    .right {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 342px;
      height: 206px;
      padding: 28px 20px;
      border-radius: $--radius1;
      background-color: #dadada;
    }
    .rightA {
      width: 288px;
      height: 40px;
    }
    .rightB {
      width: 180px;
      height: 28px;
      margin-top: 12px;
    }
    .rightC {
      height: 14px;
      width: 100px;
      margin-top: 12px;
    }
    .rightD {
      width: 220px;
      height: 53px;
      margin-top: 40px;
    }
  }
  .skeAnimation {
    @include skeAnimation(#eee)
  }
</style>
