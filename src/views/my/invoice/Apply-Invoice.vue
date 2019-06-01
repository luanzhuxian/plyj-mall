<template>
  <div :class="$style.applyInvoice">
    <div :class="$style.tips">
      <div :class="$style.top">
        <pl-svg
          :class="$style.warning"
          name="warning2"
          color="#1890FF"
        />
        <p>发票将会与商品同时邮寄，单商品仅支持一次开票服务，请确保填写开票信息真实有效。</p>
      </div>
      <button :class="$style.button">
        发票须知
      </button>
    </div>

    <div :class="$style.checkedBox">
      <div :class="$style.buttons">
        <button
          :class="{
            [$style.active]: type === 1
          }"
          @click="change(1)"
        >
          个人
        </button>
        <span
          :class="{
            [$style.separator]: true,
            [$style.active]: type === 1
          }"
        />
        <button
          :class="{
            [$style.active]: type === 2
          }"
          @click="change(2)"
        >
          单位
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApplyInvoice',
  data () {
    return {
      type: 1 // 1：个人，2：单位
    }
  },
  methods: {
    change (type) {
      this.type = type
    }
  }
}
</script>

<style module lang="scss">
  .applyInvoice {
    padding: 20px 40px;
  }
  .tips {
    display: flex;
    flex-direction: column;
    padding: 16px 32px 16px 24px;
    background-color: #fff;
    font-size: 26px;
    border-radius: $--radius1;
  }
  .top {
    display: flex;
    color: $--font-color_gray2;
    > .warning {
      width: 54px;
      height: 36px;
      margin-top: 2px;
      margin-right: 12px;
    }
  }

  .button {
    align-self: flex-end;
    margin-top: 4px;
    font-size: 24px;
    line-height: 40px;
    color: #1890FF;
    text-decoration: underline;
  }
  .checkedBox {
    margin-top: 28px;
    border-radius: $--radius1;
    background-color: #fff;
    > .buttons {
      position: relative;
      display: flex;
      height: 88px;
      overflow: hidden;
      .separator {
        position: absolute;
        top: -50%;
        right: 50%;
        width: 50px;
        height: 200%;
        overflow: hidden;
        z-index: 8;
        transform: rotate(12deg);
        background-color: #fcfcfc;
        &.active {
          right: 42.6%;
          transform: rotate(168deg);
        }
        &:after {
          position: absolute;
          content: "";
          right: -5px;
          width: 5px;
          height: 100%;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        }
      }
      button {
        flex: 1;
        font-size: 32px;
        color: #ccc;
        background-color: #fcfcfc;
        &.active {
          font-weight: bold;
          color: #333;
          background-color: #fff;
        }
      }
    }
  }
</style>
