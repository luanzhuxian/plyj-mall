<template>
  <div class="pl-upload-img">
    <ul class="pl-img-list">
      <li
        class="img"
        v-for="(img, i) of images"
        :key="i"
      >
        <img :src="img">
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
import compress from '../../assets/js/compress-image'
import { Indicator } from 'mint-ui'
import axios from 'axios'
export default {
  name: 'PlUploadImg',
  data () {
    return {
      imgs: []
    }
  },
  props: {
    // 图片在表单中对应的属性名
    field: {
      type: String,
      required: true
    },
    // 图片上传的服务器地址
    url: {
      type: String,
      required: true
    },
    formData: Object, // 其他表单字段
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
  computed: {
    sizeByte: function f () {
      // 字节形式表示的图片体积
      return this.size * 1024 * 1024
    }
  },
  created () {
  },
  methods: {
    async change (e) {
      const fileList = e.target.files
      Indicator.open()
      for (let blob of fileList) {
        if (blob.size > this.sizeByte) {
          // 如果图片体积过大，压缩至期望的大小
          blob = await compress.compress(blob, this.size)
        }
        try {
          let formData = new FormData()
          formData.append(this.field, blob)
          if (this.formData) {
            for (let k of Object.keys(this.formData)) {
              formData.append(k, this.formData[k])
            }
          }
          const data = await axios.post(this.url, formData)
          this.$emit('success', data)
          Indicator.close()
        } catch (e) {
          Indicator.close()
          throw e
        }
      }
      e.target.type = 'text'
      e.target.type = 'file'
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
