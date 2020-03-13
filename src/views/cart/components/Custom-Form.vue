<template>
  <pl-popup
    :show="show"
    :close-on-click-modal="false"
    @close="close"
  >
    <div :class="$style.formWrap">
      <div :class="$style.title">
        {{ title }}
      </div>
      <div :class="$style.tip">
        *重要信息，请认真填写
      </div>
      <pl-form
        :model="form"
        :rules="rules"
        ref="form"
        :class="$style.form"
        :label-style="{ fontSize: 28 / 7.5 + 'vw', color: '#a8a8a8', fontWeight: 'normal' }"
      >
        <pl-form-item
          v-for="(key, i) of keys"
          :key="i"
          :prop="key"
          :label="key"
          :gap-top="20"
          border
        >
          <pl-input v-model="form[key]" />
        </pl-form-item>
      </pl-form>
      <pl-button size="huge" type="warning" @click="confirm">
        确认
      </pl-button>
    </div>
  </pl-popup>
</template>

<script>
export default {
  name: 'CustomFormInline',
  props: {
    show: Boolean,
    form: {
      type: Object,
      default () {
        return {}
      }
    },
    rules: {
      type: Object,
      default () {
        return {}
      }
    },
    title: {
      type: String,
      default: '学员信息'
    }
  },
  computed: {
    keys () {
      return Object.keys(this.form)
    }
  },
  methods: {
    close () {
      this.$emit('update:show', false)
    },
    confirm (e) {
      if (this.$refs.form.validate()) {
        this.close()
        this.$emit('confirm', e)
      }
    }
  }
}
</script>

<style module lang="scss">
  .formWrap {
    padding: 24px;
  }
  .title {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
  }
  .tip {
    font-size: 26px;
    color: #999;
    line-height: 80px;
  }
  .form {
    margin-bottom: 50px;
    max-height: 676px;
    overflow-y: scroll;
  }
</style>
