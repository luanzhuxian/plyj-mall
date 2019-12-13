<template>
  <div :class="$style.propagate">
    <div
      :class="$style.content"
      v-if="data.showStatue === 1 && data.values.length"
      @click="clickPingXuan"
    >
      <div :class="$style.top" @click="$router.push({ name: 'Appointment' })">
        <div :class="$style.left">
          <div :class="$style.title" v-text="data.values[0].mallName" />
          <div :class="$style.desc" v-text="data.values[0].mallDesc" />
        </div>
        <div :class="$style.center">
          <img :src="logoUrl" alt="">
        </div>
        <div :class="$style.right">
          <pl-svg name="icon-right" :height="30" fill="#ccc" />
        </div>
      </div>
      <div :class="$style.bottom" v-if="data.show === 1 && mallBrandingRequestModels.length">
        <div :class="$style.title">
          教育特色 :
        </div>
        <ul :class="$style.tags">
          <template v-for="(item, i) of mallBrandingRequestModels">
            <li
              v-if="item.titleName"
              :key="i"
              v-text="item.titleName"
              @click="jump(item)"
            />
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Propagate',
  data () {
    return {}
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['logoUrl']),
    mallBrandingRequestModels () {
      return this.data.values.length ? this.data.values[0].mallBrandingRequestModels.filter(item => item.show === 1) : []
    }
  },
  methods: {
    clickPingXuan () {
      sessionStorage.removeItem('PIN_XUAN')
    },
    jump (item) {
      if (item.type === 1) {
        this.$router.push({ name: 'SchoolShow' })
        return
      }
      if (item.type === 2) {
        this.$router.push({ name: 'StudentShow' })
        return
      }
      this.$router.push({ name: 'Appointment', hash: `#${item.type}` })
    }
  }
}
</script>

<style module lang="scss">
  .propagate {
    > .content {
      display: flex;
      flex-direction: column;
      padding: 24px;
      background-color: #fff;
      border-radius: 20px;
      > .top {
        display: flex;
        justify-content: space-between;
        > .left {
          > .title {
            font-size: 36px;
            font-weight: bold;
          }
          > .desc {
            width: 418px;
            margin-top: 16px;
            font-size: 24px;
            color: #999;
            @include elps-wrap(2);
          }
        }
        > .center {
          > img {
            width: 128px !important;
            height: 128px !important;
            object-fit: cover;
            border-radius: 64px;
          }
        }
        > .right {
          display: inline-flex;
          align-items: center;
        }
      }
      > .bottom {
        display: flex;
        margin-top: 24px;
        font-size: 24px;
        overflow: hidden;
        border-top: 1px solid #e7e7e7;
        .title {
          margin-top: 24px;
          color: #666;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          color: #999;
          > li {
            margin-left: 16px;
            margin-top: 16px;
            padding: 0 20px;
            line-height: 50px;
            background-color: #F2F4F5;
            border-radius: 25px;
          }
        }
      }
    }
  }
</style>
