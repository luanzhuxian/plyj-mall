<template>
  <div
    ref="price"
    :class="{
      [$style.price]: true,
      [$style[size]]: true,
      [$style.plain]: plain
    }"
  >
    <span :class="$style.currentPrice">
      <span
        v-if="prefixText"
        :class="$style.prefixText"
        v-text="prefixText"
      />
      <i
        :class="$style.integer"
        v-text="integer"
      />
      <i
        v-if="float"
        :class="$style.float"
        v-text="float"
      />
    </span>
    <del
      v-if="originalPrice"
      v-text="'¥' + originalPrice"
    />
  </div>
</template>

<script>
export default {
  name: 'Price',
  props: {
    price: [String, Number],
    originalPrice: [String, Number],
    /* mini small middle large */
    size: [String, Number],
    plain: Boolean,
    prefixText: String
  },
  data () {
    return {
    }
  },
  computed: {
    integer: function () {
      return this.price ? String(this.price).split('.')[0] : ''
    },
    float: function () {
      return this.price ? String(this.price).split('.')[1] : ''
    }
  }
}
</script>

<style module lang="scss">
  .price {
    display: inline-flex;
    align-items: baseline;
    flex-wrap: wrap;
    .prefix-text {
      font-weight: normal;
    }
    &.mini {
      .integer {
        font-size: 28px;
        &:before {
          font-size: 20px;
        }
      }
      .prefix-text {
        font-size: 20px;
      }
      .float {
        font-size: 20px;
      }
      del {
        font-size: 20px;
      }
    }
    &.small {
      .integer {
        font-size: 32px;
        &:before {
          font-size: 28px;
        }
      }
      .prefix-text {
        font-size: 20px;
      }
      .float {
        font-size: 22px;
      }
      del {
        font-size: 20px;
      }
    }
    &.middle {
      .integer {
        font-size: 38px;
      }
      .prefix-text {
        font-size: 22px;
      }
      .float {
        font-size: 24px;
      }
      del {
        font-size: 24px;
      }
    }
    &.large {
      .integer {
        font-size: 44px;
      }
      .prefix-text {
        font-size: 26px;
      }
      .float {
        font-size: 26px;
      }
      del {
        font-size: 28px;
      }
    }
    &.huge {
      .integer {
        font-size: 56px;
        &:before {
          font-size: 32px;
        }
      }
      .prefix-text {
        font-size: 32px;
      }
      .float {
        font-size: 34px;
      }
      del {
        font-size: 32px;
      }
    }
    &.huger {
      .integer {
        font-size: 76px;
        &:before {
          font-size: 50px;
        }
      }
      .prefix-text {
        font-size: 50px;
      }
      .float {
        font-size: 45px;
      }
      del {
        font-size: 36px;
      }
    }
    del {
      color: #999;
    }
  }
  .current-price {
    display: inline-block;
    margin-right: 10px;
    color: $--primary-color;
    font-weight: bold;
  }
  .integer {
    &:before {
      content: '¥';
    }
  }
  .float {
    &:before {
      content: '.';
    }
  }
  .plain {
    .current-price {
      font-weight: normal;
      color: $--font-color_gray1;
    }
  }
</style>
