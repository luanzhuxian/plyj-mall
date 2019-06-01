<template>
  <div :class="$style.addInvoice">
    <h2
      :class="$style.title"
      v-text="id ? '编辑单位信息' : '新建单位信息'"
    />
    <p :class="$style.tips">
      重要信息，请认真填写。
    </p>
    <pl-form
      :class="$style.form"
      label-width="40"
    >
      <pl-form-item
        border
      >
        <pl-input
          size="middle"
          placeholder="单位名称"
        />
      </pl-form-item>
      <pl-form-item>
        <pl-input
          size="middle"
          placeholder="纳税人识别号"
        />
        <pl-svg
          :class="$style.warningIcon"
          slot="suffix"
          name="warning"
          color="#FE7700"
        />
      </pl-form-item>
    </pl-form>

    <div :class="$style.remove">
      删除该信息
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddInvoice',
  components: {
  },
  data () {
    return {
      list: [
        {
          name: '西安大梦想家艺术培训有限公司',
          number: '13777327727327273727777'
        },
        {
          name: '西安大梦想家艺术培训有限公司',
          number: '13777327727327273727777'
        }
      ]
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  activated () {
    console.log(this.id)
  },
  methods: {
    remove () {}
  }
}
</script>

<style module lang="scss">
  .addInvoice {
    padding: 40px;
  }
  .title {
    font-size: 40px;
  }
  .tips {
    margin-top: 14px;
    color: $--font-color_gray3;
    font-size: 28px;
  }
  .form {
    margin-top: 34px;
    background-color: #fff;
    border-radius: $--radius1;
    overflow: hidden;
  }
  .remove {
    height: 108px;
    margin-top: 28px;
    padding: 0 40px;
    color: #F24724;
    font-size: 30px;
    line-height: 108px;
    background-color: #fff;
    border-radius: 20px;
  }
  .warningIcon {
    width: 36px;
    margin: 0 40px;
  }
</style>
