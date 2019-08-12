<template>
  <div :class="$style.wwec">
    <div :class="$style.top">
      123
    </div>
    <div :class="$style.form">
      <pl-form :label-width="184">
        <pl-form-item :label-style="labelStyle" :class="$style.formItem" label="姓名" :gap-top="16">
          <pl-input size="mini" placeholder="请输入联系人真实姓名" />
        </pl-form-item>
        <pl-form-item :label-style="labelStyle" :class="$style.formItem" label="手机号" :gap-top="16">
          <pl-input size="mini" placeholder="请输入联系人手机号" />
        </pl-form-item>
        <pl-form-item :label-style="labelStyle" :class="$style.formItem" label="机构名称" :gap-top="16">
          <pl-input size="mini" placeholder="请输入机构名称" />
        </pl-form-item>
      </pl-form>

      <p :class="$style.title">职位</p>
      <div :class="$style.types" @change="jobChange">
        <label>
          <input type="checkbox" value="校长" v-show="false">
          <span>校长</span>
        </label>
        <label>
          <input type="checkbox" value="市场老师" v-show="false">
          <span>市场老师</span>
        </label>
        <label>
          <input type="checkbox" value="咨询顾问" v-show="false">
          <span>咨询顾问</span>
        </label>
        <label>
          <input type="checkbox" value="其它" checked v-show="false">
          <span>其它</span>
        </label>
      </div>
      <p :class="$style.title">经营类型</p>
      <div :class="$style.types" @change="typesChange">
        <label>
          <input type="checkbox" value="K12教育" v-show="false">
          <span>K12教育</span>
        </label>
        <label>
          <input type="checkbox" value="语言培训" v-show="false">
          <span>语言培训</span>
        </label>
        <label>
          <input type="checkbox" value="兴趣特长" v-show="false">
          <span>兴趣特长</span>
        </label>
        <label>
          <input type="checkbox" value="早教幼教" v-show="false">
          <span>早教幼教</span>
        </label>
        <label>
          <input type="checkbox" value="职称技能" v-show="false">
          <span>职称技能</span>
        </label>
        <label>
          <input type="checkbox" value="公务求职" v-show="false">
          <span>公务求职</span>
        </label>
        <label>
          <input type="checkbox" value="留学考试" v-show="false">
          <span>留学考试</span>
        </label>
        <label>
          <input type="checkbox" value="其它" checked v-show="false">
          <span>其它</span>
        </label>
      </div>
      <button :class="$style.confirm">一键领取免费名额</button>
    </div>

    <div :class="$style.success">
      <p>成功案例</p>
      <ul :class="$style.successList">
        <li>
          <img src="https://img.alicdn.com/tfs/TB15I0OLMHqK1RjSZJnXXbNLpXa-468-644.jpg_320x5000q100.jpg_.webp" alt="">
          <p>西安有朋来教育科技有限公司</p>
        </li>
        <li>
          <img src="https://img.alicdn.com/tfs/TB15I0OLMHqK1RjSZJnXXbNLpXa-468-644.jpg_320x5000q100.jpg_.webp" alt="">
          <p>西安有朋来教育科技有限公司</p>
        </li>
        <li>
          <img src="https://img.alicdn.com/tfs/TB15I0OLMHqK1RjSZJnXXbNLpXa-468-644.jpg_320x5000q100.jpg_.webp" alt="">
          <p>西安有朋来教育科技有限公司</p>
        </li>
        <li>
          <img src="https://img.alicdn.com/tfs/TB15I0OLMHqK1RjSZJnXXbNLpXa-468-644.jpg_320x5000q100.jpg_.webp" alt="">
          <p>西安有朋来教育科技有限公司</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Wwec',
  data () {
    return {
      labelStyle: {
        fontWeight: 'normal',
        color: '#666'
      },
      jobs: ['其它'],
      types: ['其它']
    }
  },
  methods: {
    jobChange (e) {
      let { target } = e
      if (target.checked) {
        this.jobs.push(target.value)
      } else {
        let index = this.jobs.indexOf(target.value)
        this.jobs.splice(index, 1)
      }
    },
    typesChange (e) {
      let { target } = e
      if (target.checked) {
        this.types.push(target.value)
      } else {
        let index = this.types.indexOf(target.value)
        this.types.splice(index, 1)
      }
    }
  }
}
</script>

<style module lang="scss">
  .wwec {
    padding-bottom: 140px;
    background-color: #492560;
  }
  .top {
    height: 306px;
    background: url("https://penglai-weimall.oss-cn-hangzhou.aliyuncs.com/static/820/wwec1.png") no-repeat;
    background-size: 100%;
  }
  .form {
    padding: 48px 46px;
    background-color: #fff;
    border-radius: 20px;
    .form-item {
      border: 1px solid #ccc;
      padding-left: 24px;
      border-radius: 20px;
    }
    .title {
      font-size: 28px;
      line-height: 78px;
      color: #000;
      font-weight: bold;
    }
  }
  .types {
    display: grid;
    grid-template-columns: repeat(4, 152px);
    grid-template-rows: repeat(auto-fill, 58px);
    grid-gap: 20px;
    font-size: 28px;
    text-align: center;
    > label {
      > span {
        display: block;
        border: 1px solid #ccc;
        line-height: 56px;
        border-radius: 29px;
      }
      > input:checked + span {
        border: none;
        line-height: 58px;
        color: #fff;
        background-color: #598BF8;
      }
    }
  }
  .confirm {
    width: 100%;
    height: 88px;
    letter-spacing: 2px;
    margin-top: 32px;
    font-size: 32px;
    color: #fff;
    background-color: #598BF8;
    border-radius: 20px;
  }
  .success {
    margin-top: 80px;
    > p {
      position: relative;
      font-size: 48px;
      line-height: 72px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      &:after {
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        content: '';
        width: 80px;
        height: 4px;
        background-color: #fff;

      }
    }
  }
  .success-list {
    width: 100%;
    margin-top: 32px;
    justify-content: flex-start;
    white-space: nowrap;
    overflow: auto;
    > li {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      width: 202px;
      height: 250px;
      margin-left: 20px;
      box-sizing: border-box;
      padding: 32px 18px;
      background-color: #fff;
      border-radius: 20px;
      &:nth-last-of-type(1) {
        margin-right: 20px;
      }
      > p {
        width: 100%;
        margin-top: 22px;
        font-size: 24px;
        height: 62px;
        text-align: center;
        word-break: break-all;
        white-space: pre-wrap;
        line-height: 30px;
        @include elps-wrap(2);
      }
      > img {
        width: 102px;
        height: 102px;
        object-fit: cover;
        border-radius: 51px;
      }
    }
  }
</style>
