<template>
  <div class="pl-upload-img">
    <ul class="pl-img-list">
      <li
        class="img"
        v-for="(img, i) of images"
        :key="i"
      >
        <img
          v-gallery
          :src="img"
        >
        <pl-svg
          class="remove-btn iconfont icon-qingchu"
          name="close"
          @click="removeImg(i)"
        />
      </li>
      <li v-if="imgs.length < count || !count">
        <label class="upload-img-box">
          <pl-svg name="camera" />
          <span>上传凭证</span>
          <span v-if="count > 0">（最多{{ count }}张）</span>
          <input
            @change="change"
            type="file"
            accept="image/*"
            style="display: none;"
          >
        </label>
      </li>
    </ul>
  </div>
</template>
<script>
import { upload, compress } from '../../assets/js/upload-image'
import { Indicator } from 'mint-ui'
export default {
  name: 'PlUploadImg',
  data () {
    return {
      imgs: []
    }
  },
  props: {
    // 图片最大体积,单位M
    size: {
      type: Number,
      default: 4
    },
    // 图片数量
    count: {
      type: Number,
      default: 0
    },
    images: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  created () {
  },
  methods: {
    async change (e) {
      const fileList = e.target.files
      try {
        for (let blob of fileList) {
          // 如果图片体积过大，压缩至期望的大小
          Indicator.open('正在压缩图片')
          blob = await compress(blob, this.size)
          Indicator.close()
          this.up(blob)
        }
      } catch (e) {
        throw e
      } finally {
        e.target.type = 'text'
        e.target.type = 'file'
      }
    },
    async up (file) {
      try {
        Indicator.open('正在上传图片')
        let res = await upload({ file })
        this.$emit('success', res)
      } catch (e) {
        throw e
      } finally {
        Indicator.close()
      }
    },
    async removeImg (index) {
      try {
        let rm = this.images.splice(index, 1)
        this.$emit('change', this.images)
        this.$emit('update:images', this.images)
        this.$emit('remove', index, rm)
      } catch (e) {
        throw e
      }
    }
  }
}
</script>

<style lang="scss">
  .pl-upload-img {
  }
  .pl-img-list {
    display: inline-flex;
    flex-wrap: wrap;
    width: 100%;
    .img {
      position: relative;
      width: auto;
      min-width: 144px;
      height: 144px;
      margin-right: 20px;
      margin-bottom: 20px;
      box-shadow: 0 5px 30px 0 rgba(0, 0, 0, .2);
      img {
        position: relative;
        height: 100%;
        left: 50%;
        transform: translateX(-50%);
      }
      .remove-btn {
        position: absolute;
        right: -17px;
        top: -14px;
        width: 34px;
        height: 34px;
        line-height: 34px;
        border-radius: 50%;
        fill: red;
        text-align: center;
        path {
          fill: red;
        }
      }
    }
  }
  .upload-img-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 144px;
    height: 144px;
    border: 1px dashed #999;
    text-align: center;
    span {
      color: #999;
      font-size: 22px;
    }
    svg {
      width: 36px;
      fill: #999;
    }
  }
</style>
