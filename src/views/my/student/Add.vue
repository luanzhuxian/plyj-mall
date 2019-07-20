<template>
  <div :class="$style.addStudent">
    <TopText
      :title="id ? '编辑学员信息' : '添加学员信息'"
      tip="重要信息，请认真填写。"
    />

    <pl-form
      ref="form"
      :model="form"
      :class="$style.form + ' radius-20'"
      label-width="40"
      :rules="rules"
    >
      <pl-form-item
        border
        prop="stuName"
      >
        <pl-input
          placeholder="学员姓名"
          v-model.trim="form.stuName"
          size="middle"
        />
      </pl-form-item>
      <pl-form-item
        border
        prop="stuMobile"
      >
        <pl-input
          placeholder="手机号码"
          v-model.trim="form.stuMobile"
          size="middle"
        />
      </pl-form-item>
    </pl-form>

    <div :class="$style.setDefault + ' radius-20'">
      <span class="fz-30">设为默认学员</span>
      <pl-switch v-model="form.defaultStatus" :active-text="1" :inactive-text="0" />
    </div>

    <div
      v-if="id"
      :class="$style.remove"
      @click="remove"
    >
      删除该学员
    </div>

    <pl-button
      :class="$style.submit"
      size="huge"
      type="warning"
      :loading="loading"
      @click="confirm"
    >
      {{ canSelect ? '保存并使用' : '保存' }}
    </pl-button>
  </div>
</template>

<script>
import TopText from '../../../components/Top-Text.vue'
import { isPhone, isName } from '../../../assets/js/validate'
import { resetForm } from '../../../assets/js/util'
import {
  add,
  remove,
  edit,
  getDetail
} from '../../../apis/student'
export default {
  name: 'AddStudent',
  components: {
    TopText
  },
  data () {
    return {
      defaultStatus: false,
      form: {
        defaultStatus: 0,
        stuMobile: '',
        stuName: ''
      },
      rules: {
        stuName: [
          { required: true, message: '请输入学员姓名', trigger: 'blur' },
          { validator: isName, message: '姓名只支持中英文，且中文为2~10字，英文为2~20字', trigger: 'blur' }
        ],
        stuMobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: isPhone, message: '手机号码格式错误', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    canSelect () {
      return this.$route.query.select === 'YES'
    },
    proId () {
      return this.$route.query.pro
    },
    count () {
      return this.$route.query.count
    }
  },
  async activated () {
    if (this.id) {
      this.form.id = this.id
      try {
        let { result } = await getDetail(this.id)
        this.form.stuName = result.stuName
        this.form.stuMobile = result.stuMobile
        this.form.defaultStatus = result.defaultStatus
      } catch (e) {
        throw e
      }
    }
  },
  deactivated () {
    resetForm(this.form)
    delete this.form.id
  },
  methods: {
    async confirm () {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          let result
          if (this.id) {
            let { result: res } = await edit([this.form])
            if (res) {
              result = this.form
            }
          } else {
            let { result: res } = await add(this.form)
            result = res
          }
          if (this.canSelect) {
            let checked = JSON.parse(localStorage.getItem('CHECKED_STUDENT')) || {}
            checked[this.proId] = checked[this.proId] || []
            if (checked[this.proId].length < this.count) {
              let finded = checked[this.proId].find(item => item.id === result.id)
              if (finded) {
                Object.assign(finded, result)
              } else {
                checked[this.proId].push(result)
              }
              localStorage.setItem('CHECKED_STUDENT', JSON.stringify(checked))
            }
            this.$router.replace({
              name: 'StudentList',
              query: this.$route.query
            })
          } else {
            this.$router.go(-1)
          }
        } catch (e) {
          throw e
        } finally {
          this.loading = false
        }
      }
    },
    async remove () {
      await this.$confirm({
        message: '是否删除该学员？',
        confirmText: '删除'
      })
      try {
        let { result } = await remove([this.id])
        if (result) {
          this.$router.replace({
            name: 'StudentList',
            query: this.$route.query
          })
        }
      } catch (e) {
        throw e
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'StudentList') {
      localStorage.removeItem('SELECT_STUDENT_FROM')
    }
    next()
  }
}
</script>

<style module lang="scss">
  .add-student {
    padding: 28px 40px;
    .form {
      margin-top: 36px;
      overflow: hidden;
    }
  }
  .set-default {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
    padding: 23px 40px;
    background-color: #fff;
  }
  .remove {
    margin-top: 28px;
    padding: 0 40px;
    line-height: 108px;
    font-size: 30px;
    color: #F24724;
    background-color: #fff;
    border-radius: 20px;
  }
  .submit {
    position: fixed;
    bottom: 40px;
    width: 670px !important;
    margin: 120px auto 20px;
  }
</style>
