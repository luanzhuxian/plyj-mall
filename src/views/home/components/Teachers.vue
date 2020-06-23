<template>
    <div :class="$style.teachers">
        <swiper v-if="data.values.length" :options="swiperOption">
            <swiper-slide v-for="(item, i) of data.values" :key="i">
                <li :class="$style.listItem">
                    <div :class="$style.imgWrapper">
                        <img v-imgError :src="item.image" alt="">
                        <p :class="$style.name" v-text="item.name" />
                    </div>
                    <div :class="$style.info">
                        <p :class="$style.main" v-text="item.value" />
                        <p :class="$style.intro">
                            简介：{{ item.valueName }}
                        </p>
                    </div>
                </li>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
    name: 'Teachers',
    components: {
        swiper,
        swiperSlide
    },
    props: {
        data: {
            type: Object,
            default () {
                return { values: [] }
            }
        }
    },
    data () {
        return {
            swiperOption: {
                slidesPerView: 3,
                spaceBetween: 10
            }
        }
    }
}
</script>
<style lang="scss" module>
.teachers {
  .list {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .list-item {
    width: 224px;
    border-radius: 20px;
    overflow: hidden;
    font-size: 24px;
    font-family: Microsoft YaHei;
  }
  .img-wrapper {
    position: relative;
    height: 224px;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0 10px;
    height: 42px;
    line-height: 42px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
    color: #FFF;
    @include elps();
  }
  .info {
    box-sizing: border-box;
    padding: 14px 10px;
    background: #FFF;
    color: #7B7B7B;
    height: 164px;
  }
  .main {
    color: #000;
    line-height: 26px;
    font-weight: bold;
    @include elps();
  }
  .intro {
    margin-top: 10px;
    @include elps-wrap(3);
  }
}
</style>
