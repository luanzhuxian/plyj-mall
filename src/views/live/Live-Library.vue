<template>
  <!--我的视频列表-->
  <div :class="$style.liveLibrary">
    <!--头部-->
    <header>
      <div>
        我的观看列表({{ videoList.length }})
      </div>
      <!-- <div @click="edit">{{ isEdit ? '取消' : '管理' }}</div> -->
    </header>
    <!--视频列表-->
    <div :class="$style.videoContent">
      <pl-checkbox-group
        v-model="checkedList"
        ref="checkboxGroup"
        @change="selectedChange"
      >
        <pl-checkbox
          :class="{[$style.checkBox]:true,[$style.hiddenBox]:!isEdit}"
          v-for="(item, i) of videoList"
          :key="i"
          :data="item"
          :gap-column="24"
          border
        >
          <template v-slot:suffix="{ data }">
            <div :class="$style.videoItem">
              <div>
                <div>支持回放</div>
                <img :src="item.coverImg" alt="">
              </div>
              <div>
                <div>
                  <div>{{ item.videoName }}</div>
                  <div>直播时间：{{ item.createTime }}</div>
                </div>
                <div>
                  <div>
                    <template v-if="item.description && Number(item.description.split('元')[0]) === 0">
                      <span>免费</span>
                    </template>
                    <template v-else>
                      <span>已付费：</span><span>￥ {{ item.description }}</span>
                    </template>
                  </div>
                  <div @click="$router.push({name:'LivePlayBack',params:{id:item.id}})">再次观看</div>
                </div>
              </div>
            </div>
          </template>
        </pl-checkbox>
      </pl-checkbox-group>
      <!--缺省-->
      <div v-if="videoList.length === 0" :class="$style.hasNoMes">
        暂无观看记录
      </div>
    </div>
    <!--尾部-->
    <footer v-if="isEdit">
      <div>
        <pl-checkbox :checked="checkedAll" @change="checkAll" border>
          <span slot="suffix" class="fz-24 gray-2 ml-10">
            全选
          </span>
        </pl-checkbox>
      </div>
      <div :class="{[$style.disabled]:!checkedList.length}" @click="deleteVideo">删除</div>
    </footer>
  </div>
</template>

<script>
import { getLibraryList } from '../../apis/live'
export default {
  name: 'LiveLibrary',
  data () {
    return {
      isEdit: false,
      checkedAll: false,
      videoList: [], // 视频列表
      checkedList: []
    }
  },
  async activated () {
    try {
      let mes = await getLibraryList()
      if (mes) {
        this.videoList = mes
      }
    } catch (e) { throw e }
  },
  methods: {
    async deleteVideo () {
      if (this.checkedList.length) {
        await this.$confirm({
          message: '确认删除视频库里的视频删除后将不可恢复'
        })
      }
    },
    edit () {
      this.isEdit = !this.isEdit
    },
    selectedChange (e) {
    //   console.log(e)
    },
    checkAll (val) {
      this.checkedAll = val
      this.$refs.checkboxGroup.changeAll(val)
    }
  }
}
</script>

<style lang='scss' module scoped>

  .live-library {

    > header {
      display: flex;
      justify-content: space-between;
      padding: 24px;
      font-size: 28px;
      > div:nth-of-type(1) {
        font-size:24px;
      }
    }

    > footer {
      display: flex;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      background: #FFFFFF;
      padding: 24px;
      > div:nth-of-type(1) {
        color: #666666;
        font-size: 22px;
      }
      > div:nth-of-type(2) {
        width: 176px;
        line-height: 70px;
        color: #FFFFFF;
        font-size: 24px;
        text-align: center;
        border-radius:10px;
        background: #F2B036;
      }
      > .disabled {
        color: #fff !important;
        background: #ccc !important;
      }
    }

    > .video-content {
      box-sizing: border-box;
      padding: 0 24px 24px 24px;
      > .has-no-mes {
        text-align: center;
        margin-top: calc( 50vh - 170px);
        font-size: 30px;
      }
    }

    .check-box {
      background: #FFFFFF;
      border-radius:20px;
      padding: 24px;
      overflow: hidden;
      /deep/ label {
        margin-right: 24px;
      }
    }
    .hidden-box {
      /deep/ label {
        display: none;
      }
    }
    .video-item {
      display: flex;
      justify-content: flex-start;
      width: 100%;
      background: #FFFFFF;
      > div:nth-of-type(1) {
        height: 164px;
        position: relative;
        margin-right: 20px;
        > img {
          width: 224px;
          height: 100%;
          vertical-align: top;
        }
        > div {
          position: absolute;
          top: 0;
          left: 0;
          width: 120px;
          background: #F2B036;
          color: #FFFFFF;
          font-size: 22px;
          line-height: 46px;
          text-align: center;
          border-radius:0px 40px 40px 0px;
        }
      }
      > div:nth-of-type(2) {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        align-content: space-between;
        > div:nth-of-type(1) {
          width: 100%;
          color: #A8A8A8;
          font-size: 24px;
          > div:nth-of-type(1) {
            margin-bottom: 6px;
            color: #333333;
            font-size: 32px;
          }
        }
        > div:nth-of-type(2) {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          > div:nth-of-type(1) {
            font-size: 24px;
          }
          > div:nth-of-type(2){
            font-size: 22px;
            text-align: center;
            background: #FE7700;
            color: #FFFFFF;
            width: 140px;
            line-height: 40px;
            border-radius:20px;
          }
        }
      }
    }
  }

</style>
