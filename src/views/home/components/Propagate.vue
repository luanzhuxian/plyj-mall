<template>
    <div :class="$style.propagate">
        <div :class="$style.content" @click="clickPingXuan">
            <div :class="$style.top" @click="$router.push({ name: 'Appointment' })">
                <img :src="data.otherValue" :alt="data.values[0].mallName">
                <div :class="$style.name">
                    <span>{{ data.values[0].mallName }}</span>
                    <div :class="$style.right">
                        <pl-svg name="icon-right" :height="30" fill="#fff" />
                    </div>
                </div>
            </div>
            <div :class="$style.middle" @click="$router.push({ name: 'Appointment' })">
                <div :class="$style.logo">
                    <img :src="data.values[0].mallLogo + '?x-oss-process=style/thum-small'">
                    <!-- <img :src="logoUrl" alt=""> -->
                </div>
                <div :class="$style.intro" v-if="data.values[0].mallDesc">
                    {{ data.values[0].mallDesc }}
                </div>
            </div>

            <div :class="$style.bottom" v-if="data.show === 1 && mallBrandingRequestModels.length">
                <label>教育特色：</label>
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
            sessionStorage.removeItem('PROPAGATE')
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
            this.$router.push({ name: 'Appointment', hash: `#${ item.type }` })
        }
    }
}
</script>

<style module lang="scss">
  .propagate {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    > .content {
      // display: flex;
      // flex-direction: column;
      // padding: 24px;
      background-color: #fff;
      border-radius: 20px;
      overflow: hidden;
      > .top {
        position: relative;
        height: 370px;
        overflow: hidden;
        .name {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          padding: 0 24px 0 194px;
          line-height: 48px;
          font-size: 32px;
          font-family: MicrosoftYaHei-Bold;
          font-weight: bold;
          color: #FFFFFF;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
          span {
            flex: 1;
            width: 0;
            @include elps();
          }
        }
      }
      > .middle {
        position: relative;
        height: 80px;
        padding: 12px 24px 0 194px;
        .intro {
          font-size: 24px;
          line-height: 36px;
          color: #999999;
          @include elps();
        }
        .logo {
          position: absolute;
          left: 50px;
          top: 0;
          right: 0;
          transform: translateY(-55%);
          box-sizing: border-box;
          width: 120px;
          height: 120px;
          background: #EDEDED;
          border: 1px solid #F2D04A;
          border-radius: 50%;
          overflow: hidden;
        }
      }
      > .bottom {
        padding: 24px 30px 30px;
        margin-bottom: -16px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-size: 24px;
        line-height: 36px;
        color: #666666;
        border-top: 2px solid #D8D8D8;
        .tags {
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          color: #999;
          > li {
            margin-left: 16px;
            margin-bottom: 16px;
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
